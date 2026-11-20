import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { db } from './src/db/index.ts';
import { createServerSupabaseAdmin } from './src/lib/supabase.ts';
import {
  ensureBootstrapped,
  syncUserProfileAndRole,
  logAuditEvent,
  getPublicMarketplaceBootstrap,
  getProductFullDetails,
  createManualDatabaseBackup,
  profiles,
  userRoles,
  categories,
  products,
  productTranslations,
  productFiles,
  productImages,
  orders,
  orderItems,
  payments,
  downloads,
  downloadLogs,
  favorites,
  reviews,
  productQuestions,
  coupons,
  couponRedemptions,
  notifications,
  supportTickets,
  newsletterSubscribers,
  storeSettings,
  socialLinks,
  homepageBanners,
  currencies,
  exchangeRates,
  auditLogs,
  backupLogs,
  eq,
  desc,
  asc,
  and,
} from './src/db/repository.ts';
import {
  optionalAuth,
  requireAuth,
  requireSuperAdmin,
} from './src/middleware/auth.ts';
import type { AuthRequest } from './src/middleware/auth.ts';

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Simple in-memory rate limiter for downloads
const downloadRateLimit = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(key: string, maxRequests = 15, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = downloadRateLimit.get(key);
  if (!entry || now > entry.resetAt) {
    downloadRateLimit.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) {
    return false;
  }
  entry.count += 1;
  return true;
}

// SEO: robots.txt
app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  res.type('text/plain').send(
    `User-agent: *\nAllow: /\nDisallow: /admin-dashboard\nDisallow: /checkout\nDisallow: /my-account\nSitemap: ${baseUrl}/sitemap.xml\n`
  );
});

// SEO: sitemap.xml
app.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const data = await getPublicMarketplaceBootstrap();
    const staticRoutes = [
      '',
      '/marketplace',
      '/products',
      '/categories',
      '/search',
      '/advanced-search',
      '/featured',
      '/new-arrivals',
      '/best-sellers',
      '/special-offers',
      '/free-downloads',
      '/reviews',
      '/about',
      '/contact',
      '/technical-support',
      '/faq',
      '/privacy-policy',
      '/terms',
      '/refund-policy',
      '/license-policy',
      '/copyright-policy',
      '/developer-info',
    ];

    const urlsXml = [
      ...staticRoutes.map(
        (route) =>
          `<url><loc>${baseUrl}${route}</loc><changefreq>daily</changefreq><priority>${
            route === '' ? '1.0' : '0.8'
          }</priority></url>`
      ),
      ...data.categories.map(
        (c) =>
          `<url><loc>${baseUrl}/category/${c.slug}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`
      ),
      ...data.products.map(
        (p) =>
          `<url><loc>${baseUrl}/product/${p.slug}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>`
      ),
    ].join('');

    res
      .type('application/xml')
      .send(
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlsXml}</urlset>`
      );
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Download Official Supabase SQL + RLS + Storage Migration Script
app.get('/api/supabase/migration-sql', (_req, res) => {
  try {
    const sqlPath = path.join(
      process.cwd(),
      'supabase',
      'migrations',
      '20260101000000_arab_translators_union_store.sql'
    );
    const content = fs.readFileSync(sqlPath, 'utf8');
    res.setHeader('Content-Type', 'application/sql; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="20260101000000_arab_translators_union_store.sql"'
    );
    res.send(content);
  } catch (error) {
    console.error('Failed to read Supabase migration SQL:', error);
    res.status(500).send('Error loading migration file');
  }
});

// Download Official Supabase Seed SQL Script (Official Categories, Currencies, Social Links, Settings — Zero Fictional Products)
app.get('/api/supabase/seed-sql', (_req, res) => {
  try {
    const seedPath = path.join(process.cwd(), 'supabase', 'seed.sql');
    const content = fs.readFileSync(seedPath, 'utf8');
    res.setHeader('Content-Type', 'application/sql; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="seed_arab_translators_union_store.sql"'
    );
    res.send(content);
  } catch (error) {
    console.error('Failed to read Supabase seed SQL:', error);
    res.status(500).send('Error loading seed file');
  }
});

// Download Full Deployment-Ready Site Archive (Secret-Free ZIP for External Hosting)
app.get('/api/export/site-zip', (_req, res) => {
  try {
    const zipPath = path.join(
      process.cwd(),
      'exports',
      'online-store-alliance-of-arab-translators.zip'
    );
    if (!fs.existsSync(zipPath)) {
      return res.status(404).send('Site export archive not found');
    }
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="online-store-alliance-of-arab-translators.zip"'
    );
    return res.sendFile(zipPath);
  } catch (error) {
    console.error('Failed to stream site zip:', error);
    res.status(500).send('Error downloading site zip archive');
  }
});

// 1. Public Marketplace Bootstrap
app.get('/api/bootstrap', async (_req, res) => {
  try {
    const data = await getPublicMarketplaceBootstrap();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to load marketplace data' });
  }
});

// 2. Product Details
app.get('/api/products/:slugOrId', async (req, res) => {
  try {
    const details = await getProductFullDetails(req.params.slugOrId);
    if (!details) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(details);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to load product details' });
  }
});

// 3. Auth Synchronization (Strict RBAC)
app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    await ensureBootstrapped();
    const user = req.user!;
    const synced = await syncUserProfileAndRole({
      uid: user.uid,
      email: user.email || '',
      displayName: user.name || req.body?.displayName || '',
      photoURL: user.picture || '',
      emailVerified: user.email_verified,
    });
    res.json(synced);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to synchronize account' });
  }
});

// 4. Customer Account Overview
app.get('/api/account/overview', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    const [
      profileRows,
      roleRows,
      userOrders,
      userDownloads,
      userFavorites,
      userReviews,
      userNotifications,
      userTickets,
    ] = await Promise.all([
      db.select().from(profiles).where(eq(profiles.uid, uid)),
      db.select().from(userRoles).where(eq(userRoles.uid, uid)),
      db.select().from(orders).where(eq(orders.userUid, uid)).orderBy(desc(orders.createdAt)),
      db.select().from(downloads).where(eq(downloads.userUid, uid)).orderBy(desc(downloads.createdAt)),
      db.select().from(favorites).where(eq(favorites.userUid, uid)).orderBy(desc(favorites.createdAt)),
      db.select().from(reviews).where(eq(reviews.userUid, uid)).orderBy(desc(reviews.createdAt)),
      db.select().from(notifications).where(eq(notifications.userUid, uid)).orderBy(desc(notifications.createdAt)),
      db.select().from(supportTickets).where(eq(supportTickets.userUid, uid)).orderBy(desc(supportTickets.createdAt)),
    ]);

    const allOrderItems = await db.select().from(orderItems);
    const userOrderIds = new Set(userOrders.map((o) => o.id));
    const filteredOrderItems = allOrderItems.filter((item) => userOrderIds.has(item.orderId));

    res.json({
      profile: profileRows[0] || null,
      role: roleRows[0]?.role || 'customer',
      orders: userOrders,
      orderItems: filteredOrderItems,
      downloads: userDownloads,
      favorites: userFavorites,
      reviews: userReviews,
      notifications: userNotifications,
      tickets: userTickets,
    });
  } catch (error: any) {
    console.error('Failed to load account overview:', error);
    res.status(500).json({ error: 'Failed to load account overview' });
  }
});

// 5. Update Customer Profile / Request Account Deletion
app.put('/api/account/profile', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    const {
      fullName,
      phone,
      country,
      preferredLanguage,
      preferredCurrency,
      deletionRequested,
      deletionReason,
    } = req.body;

    const updated = await db
      .update(profiles)
      .set({
        fullName: fullName ?? '',
        phone: phone ?? '',
        country: country ?? 'EG',
        preferredLanguage: preferredLanguage ?? 'ar',
        preferredCurrency: preferredCurrency ?? 'EGP',
        deletionRequested: Boolean(deletionRequested),
        deletionReason: deletionReason ?? '',
        updatedAt: new Date(),
      })
      .where(eq(profiles.uid, uid))
      .returning();

    if (deletionRequested) {
      await logAuditEvent({
        actorUid: uid,
        actorEmail: req.user!.email || '',
        action: 'ACCOUNT_DELETION_REQUESTED',
        entityType: 'profiles',
        entityId: uid,
        details: deletionReason || 'User requested account deletion',
      });
    }

    res.json({ profile: updated[0] });
  } catch (error: any) {
    console.error('Profile update failed:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// 6. Toggle Favorite / Wishlist
app.post('/api/favorites/toggle', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    const productId = Number(req.body.productId);
    const listType = req.body.listType || 'favorite';

    const existing = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userUid, uid), eq(favorites.productId, productId)));

    if (existing.length > 0) {
      await db.delete(favorites).where(eq(favorites.id, existing[0].id));
      return res.json({ status: 'removed', productId });
    } else {
      const inserted = await db
        .insert(favorites)
        .values({ userUid: uid, productId, listType })
        .returning();
      return res.json({ status: 'added', favorite: inserted[0] });
    }
  } catch (error: any) {
    console.error('Favorite toggle error:', error);
    res.status(500).json({ error: 'Failed to update favorites' });
  }
});

// 7. Validate Coupon Code
app.post('/api/coupons/validate', async (req, res) => {
  try {
    const code = String(req.body.code || '').trim().toUpperCase();
    const orderSubtotal = Number(req.body.subtotal || 0);
    if (!code) {
      return res.status(400).json({ error: 'يرجى إدخال كود الخصم / Please enter a coupon code' });
    }

    const rows = await db.select().from(coupons).where(eq(coupons.code, code));
    if (!rows.length || !rows[0].isActive) {
      return res.status(404).json({ error: 'كود الخصم غير صالح أو غير مفعل / Invalid or inactive coupon code' });
    }

    const coupon = rows[0];
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'انتهت صلاحية كود الخصم / Coupon has expired' });
    }
    if ((coupon.usedCount || 0) >= (coupon.maxUses || 100)) {
      return res.status(400).json({ error: 'تم استنفاد الحد الأقصى لاستخدام الكوبون / Coupon usage limit reached' });
    }
    if (orderSubtotal < Number(coupon.minOrderAmount || 0)) {
      return res.status(400).json({
        error: `الحد الأدنى للطلب لاستخدام هذا الكوبون هو ${coupon.minOrderAmount} / Minimum order amount is ${coupon.minOrderAmount}`,
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderSubtotal * Number(coupon.discountValue)) / 100;
    } else {
      discountAmount = Number(coupon.discountValue);
    }
    discountAmount = Math.min(discountAmount, orderSubtotal);

    res.json({
      coupon,
      discountAmount: Number(discountAmount.toFixed(2)),
    });
  } catch (error) {
    console.error('Coupon validation failed:', error);
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
});

// 8. Create Order & Handle Real Payment Verification Rules (Section 8 & 9)
app.post('/api/orders', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      paymentMethod,
      couponCode,
      currency,
      notes,
      shippingAddress,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'سلة التسوق فارغة / Shopping cart is empty' });
    }

    const allProds = await db.select().from(products);
    const prodMap = new Map(allProds.map((p) => [p.id, p]));

    let subtotal = 0;
    const verifiedItems: Array<{
      product: typeof allProds[0];
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }> = [];

    for (const item of items) {
      const prod = prodMap.get(Number(item.productId));
      if (!prod || !prod.isPublished) {
        return res.status(400).json({ error: 'أحد المنتجات غير متاح حالياً / One of the selected products is unavailable' });
      }
      const qty = Math.max(1, Number(item.quantity || 1));
      const effectivePrice = prod.isFree
        ? 0
        : prod.discountPrice !== null && prod.discountPrice !== undefined && Number(prod.discountPrice) > 0
        ? Number(prod.discountPrice)
        : Number(prod.price);
      const lineTotal = effectivePrice * qty;
      subtotal += lineTotal;
      verifiedItems.push({
        product: prod,
        quantity: qty,
        unitPrice: effectivePrice,
        totalPrice: lineTotal,
      });
    }

    let discountAmount = 0;
    let appliedCoupon: typeof coupons.$inferSelect | null = null;
    if (couponCode) {
      const cRows = await db
        .select()
        .from(coupons)
        .where(eq(coupons.code, String(couponCode).trim().toUpperCase()));
      if (cRows.length && cRows[0].isActive) {
        appliedCoupon = cRows[0];
        if (appliedCoupon.discountType === 'percentage') {
          discountAmount = (subtotal * Number(appliedCoupon.discountValue)) / 100;
        } else {
          discountAmount = Number(appliedCoupon.discountValue);
        }
        discountAmount = Math.min(discountAmount, subtotal);
      }
    }

    const totalAmount = Math.max(0, subtotal - discountAmount);
    const orderNumber = `ATU-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const isFreeOrder = totalAmount === 0;

    // Check gateway configuration in store_settings if order is paid
    const settingsRows = await db.select().from(storeSettings);
    const settingsMap: Record<string, string> = {};
    for (const s of settingsRows) settingsMap[s.settingKey] = s.settingValue;

    const selectedMethod = isFreeOrder ? 'free_digital_access' : paymentMethod || 'vodafone_cash';
    const isVodafoneCash = !isFreeOrder && selectedMethod === 'vodafone_cash';
    const vodafoneNumber = settingsMap.vodafone_cash_number || '+20 10 32105770';

    const orderStatus = isFreeOrder ? 'completed' : 'pending_payment_verification';
    const paymentStatus = isFreeOrder
      ? 'paid'
      : isVodafoneCash
      ? 'pending_vodafone_cash_verification'
      : 'awaiting_gateway_verification';

    const insertedOrders = await db
      .insert(orders)
      .values({
        orderNumber,
        userUid: uid,
        customerEmail: customerEmail || req.user!.email || '',
        customerName: customerName || req.user!.name || 'Customer',
        customerPhone: customerPhone || '',
        subtotal: subtotal.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        shippingFee: '0.00',
        totalAmount: totalAmount.toFixed(2),
        currency: currency || settingsMap.base_currency || 'EGP',
        couponCode: appliedCoupon ? appliedCoupon.code : '',
        status: orderStatus,
        paymentStatus,
        paymentMethod: selectedMethod,
        shippingAddress: shippingAddress || '',
        fulfillmentStatus: isFreeOrder ? 'delivered_digital' : 'awaiting_payment',
        notes: notes || '',
      })
      .returning();

    const createdOrder = insertedOrders[0];

    for (const vItem of verifiedItems) {
      const licenseCode = `LIC-ATU-${createdOrder.id}-${vItem.product.id}-${crypto
        .randomBytes(4)
        .toString('hex')
        .toUpperCase()}`;

      await db.insert(orderItems).values({
        orderId: createdOrder.id,
        productId: vItem.product.id,
        titleAr: vItem.product.titleAr,
        titleEn: vItem.product.titleEn,
        fileFormat: vItem.product.fileFormat,
        unitPrice: vItem.unitPrice.toFixed(2),
        quantity: vItem.quantity,
        totalPrice: vItem.totalPrice.toFixed(2),
        licenseCode,
      });

      if (isFreeOrder) {
        const signedToken = crypto.randomBytes(24).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await db.insert(downloads).values({
          userUid: uid,
          productId: vItem.product.id,
          orderId: createdOrder.id,
          signedToken,
          expiresAt,
          downloadCount: 0,
          maxDownloads: 10,
        });

        await db
          .update(products)
          .set({ salesCount: (vItem.product.salesCount || 0) + vItem.quantity })
          .where(eq(products.id, vItem.product.id));
      }
    }

    if (appliedCoupon) {
      await db
        .update(coupons)
        .set({ usedCount: (appliedCoupon.usedCount || 0) + 1 })
        .where(eq(coupons.id, appliedCoupon.id));

      await db.insert(couponRedemptions).values({
        couponId: appliedCoupon.id,
        userUid: uid,
        orderId: createdOrder.id,
        discountApplied: discountAmount.toFixed(2),
      });
    }

    // Record real payment entry (never simulate fake paid success!)
    await db.insert(payments).values({
      orderId: createdOrder.id,
      userUid: uid,
      gateway: isFreeOrder ? 'free_order' : selectedMethod,
      transactionReference: isFreeOrder
        ? `FREE-${orderNumber}`
        : isVodafoneCash
        ? `VFCASH-${orderNumber}`
        : `PENDING-${orderNumber}`,
      amount: totalAmount.toFixed(2),
      currency: createdOrder.currency,
      status: isFreeOrder
        ? 'verified'
        : isVodafoneCash
        ? 'pending_vodafone_cash_transfer'
        : 'pending_gateway_credentials',
      webhookVerified: isFreeOrder,
      gatewayResponse: isFreeOrder
        ? 'Free digital order automatically authorized'
        : isVodafoneCash
        ? `Awaiting Vodafone Cash transfer verification to ${vodafoneNumber} (Dr. Eman Elahmer)`
        : 'Awaiting live payment gateway webhook confirmation',
    });

    await db.insert(notifications).values({
      userUid: uid,
      titleAr: isFreeOrder
        ? 'تم تأكيد طلبك المجاني'
        : isVodafoneCash
        ? 'تم تسجيل طلبك — بانتظار تحويل فودافون كاش'
        : 'تم تسجيل طلبك في انتظار تأكيد الدفع',
      titleEn: isFreeOrder
        ? 'Free Order Confirmed'
        : isVodafoneCash
        ? 'Order Registered — Awaiting Vodafone Cash Transfer'
        : 'Order Registered — Pending Payment Confirmation',
      messageAr: isFreeOrder
        ? `تم إصدار رخصة التحميل للطلب رقم ${orderNumber}. يمكنك تحميل ملفاتك الآن.`
        : isVodafoneCash
        ? `تم تسجيل الطلب رقم ${orderNumber}. يرجى تحويل مبلغ ${totalAmount.toFixed(2)} ${createdOrder.currency} على فودافون كاش رقم ${vodafoneNumber} (د/ إيمان الأحمر) وإرسال إيصال التحويل عبر واتساب لتفعيل التحميل فوراً.`
        : `تم تسجيل الطلب رقم ${orderNumber}. سيتم تفعيل التحميل التلقائي فور تأكيد عملية الدفع عبر البوابة المعتمدة.`,
      messageEn: isFreeOrder
        ? `Download license issued for order ${orderNumber}. You can download your files now.`
        : isVodafoneCash
        ? `Order ${orderNumber} registered. Please transfer ${totalAmount.toFixed(2)} ${createdOrder.currency} via Vodafone Cash to ${vodafoneNumber} (Dr. Eman Elahmer) and send the receipt via WhatsApp to unlock instant downloads.`
        : `Order ${orderNumber} registered. Digital delivery unlocks automatically upon confirmed payment.`,
      type: 'order',
      linkUrl: `/payment-confirmation?order=${orderNumber}`,
    });

    res.json({
      order: createdOrder,
      isFreeOrder,
      messageAr: isFreeOrder
        ? 'تم إتمام الطلب المجاني وتفعيل روابط التحميل بنجاح.'
        : isVodafoneCash
        ? `تم تسجيل الطلب بنجاح. يرجى تحويل المبلغ عبر فودافون كاش على رقم د/ إيمان الأحمر (${vodafoneNumber}) وإرسال إيصال التحويل على واتساب لتفعيل التحميل فوراً.`
        : 'تم إنشاء الطلب بنجاح. نظراً لعدم تفعيل بيانات الربط الحي لبوابة الدفع من قبل الإدارة بعد، يظل الطلب في حالة انتظار تأكيد الدفع الفعلي.',
      messageEn: isFreeOrder
        ? 'Free order completed and download links activated.'
        : isVodafoneCash
        ? `Order registered. Please transfer via Vodafone Cash to Dr. Eman Elahmer (${vodafoneNumber}) and send the receipt on WhatsApp to unlock downloads immediately.`
        : 'Order created. Because live payment gateway credentials have not yet been activated by the administrator, the order remains pending verified payment.',
    });
  } catch (error: any) {
    console.error('Order creation failed:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
});

// 9. Invoice Details
app.get('/api/orders/:orderNumber/invoice', requireAuth, async (req: AuthRequest, res) => {
  try {
    const orderRows = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, req.params.orderNumber));

    if (!orderRows.length) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const order = orderRows[0];
    if (order.userUid !== req.user!.uid && !req.isSuperAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    res.json({
      order,
      items,
      copyrightNoticeAr: 'جميع حقوق الطبع والنشر والملكية الفكرية محفوظة للدكتورة/ إيمان الأحمر.',
      copyrightNoticeEn: 'Copyright © 2026 Dr. Eman Elahmer. All Rights Reserved.',
    });
  } catch (error) {
    console.error('Invoice error:', error);
    res.status(500).json({ error: 'Failed to load invoice' });
  }
});

// 10. Request Signed Download Token (Secure Digital Delivery - Section 7)
app.post('/api/downloads/request-token', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const ip = req.ip || 'unknown';
    if (!checkRateLimit(`dl_${ip}`, 15, 60000)) {
      return res.status(429).json({
        error: 'تم تجاوز الحد المسموح لطلبات التحميل. يرجى الانتظار دقيقة / Rate limit exceeded.',
      });
    }

    const productId = Number(req.body.productId);
    const prodRows = await db.select().from(products).where(eq(products.id, productId));
    if (!prodRows.length) {
      return res.status(404).json({ error: 'المنتج غير موجود / Product not found' });
    }
    const product = prodRows[0];
    const userUid = req.user?.uid || 'visitor';

    if (!product.isFree && Number(product.price) > 0) {
      if (!req.user) {
        return res.status(401).json({
          error: 'يرجى تسجيل الدخول وشراء المنتج لتحميل الملفات المدفوعة / Sign in and purchase required for paid files.',
        });
      }

      if (!req.isSuperAdmin) {
        const userOrders = await db
          .select()
          .from(orders)
          .where(and(eq(orders.userUid, req.user.uid), eq(orders.paymentStatus, 'paid')));

        const paidOrderIds = new Set(userOrders.map((o) => o.id));
        const allItems = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.productId, product.id));

        const hasPurchased = allItems.some((i) => paidOrderIds.has(i.orderId));
        if (!hasPurchased) {
          return res.status(403).json({
            error: 'هذا المنتج مدفوع ومحمّي. يجب إتمام الشراء المؤكد أولاً / Protected paid product. Confirmed purchase required.',
          });
        }
      }
    }

    const signedToken = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes signed URL expiry

    const dlRows = await db
      .insert(downloads)
      .values({
        userUid,
        productId: product.id,
        signedToken,
        expiresAt,
        downloadCount: 0,
        maxDownloads: 5,
      })
      .returning();

    await db.insert(downloadLogs).values({
      downloadId: dlRows[0].id,
      userUid,
      productId: product.id,
      ipAddress: ip,
      userAgent: req.get('user-agent') || '',
      status: 'signed_url_issued',
    });

    // If Supabase Storage is configured and the product file resides in 'paid-products' private bucket, issue a Supabase Storage signed URL
    const supabaseAdmin = createServerSupabaseAdmin();
    if (supabaseAdmin) {
      const files = await db
        .select()
        .from(productFiles)
        .where(eq(productFiles.productId, product.id));
      if (files.length > 0 && files[0].storagePath.startsWith('supabase://')) {
        const objectPath = files[0].storagePath.replace('supabase://paid-products/', '');
        const { data: signedData } = await supabaseAdmin.storage
          .from('paid-products')
          .createSignedUrl(objectPath, 1800);
        if (signedData?.signedUrl) {
          return res.json({
            signedUrl: signedData.signedUrl,
            expiresAt,
          });
        }
      }
    }

    res.json({
      signedUrl: `/api/downloads/stream/${signedToken}`,
      expiresAt,
    });
  } catch (error: any) {
    console.error('Request download token failed:', error);
    res.status(500).json({ error: 'Failed to generate secure download link' });
  }
});

// 11. Stream Authorized Download
app.get('/api/downloads/stream/:signedToken', async (req, res) => {
  try {
    const token = req.params.signedToken;
    const dlRows = await db.select().from(downloads).where(eq(downloads.signedToken, token));
    if (!dlRows.length) {
      return res.status(404).send('Invalid or expired download link.');
    }

    const dl = dlRows[0];
    if (new Date(dl.expiresAt) < new Date()) {
      return res.status(410).send('Signed download URL has expired.');
    }
    if ((dl.downloadCount || 0) >= (dl.maxDownloads || 5)) {
      return res.status(429).send('Maximum download limit reached for this signed link.');
    }

    const prodRows = await db.select().from(products).where(eq(products.id, dl.productId));
    if (!prodRows.length) {
      return res.status(404).send('Product not found.');
    }
    const product = prodRows[0];

    await db
      .update(downloads)
      .set({
        downloadCount: (dl.downloadCount || 0) + 1,
        lastDownloadedAt: new Date(),
      })
      .where(eq(downloads.id, dl.id));

    await db
      .update(products)
      .set({ downloadsCount: (product.downloadsCount || 0) + 1 })
      .where(eq(products.id, product.id));

    await db.insert(downloadLogs).values({
      downloadId: dl.id,
      userUid: dl.userUid,
      productId: product.id,
      ipAddress: req.ip || '',
      userAgent: req.get('user-agent') || '',
      status: 'completed_download',
    });

    const files = await db
      .select()
      .from(productFiles)
      .where(eq(productFiles.productId, product.id));

    if (files.length > 0 && files[0].fileDataUrl && files[0].fileDataUrl.startsWith('data:')) {
      const file = files[0];
      const matches = (file.fileDataUrl || '').match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        res.setHeader('Content-Type', mimeType);
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${encodeURIComponent(file.fileName)}"`
        );
        return res.send(buffer);
      }
    }

    // Fallback licensed digital certificate/document if raw binary wasn't attached
    const content = [
      '====================================================================',
      'متجر اتحاد المترجمين العرب | ONLINE STORE ALLIANCE OF ARAB TRANSLATORS',
      '====================================================================',
      `Document Title (AR): ${product.titleAr}`,
      `Document Title (EN): ${product.titleEn}`,
      `SKU: ${product.sku}`,
      `Format: ${product.fileFormat}`,
      '',
      'DESCRIPTION:',
      product.descriptionAr || product.shortDescriptionAr || '',
      product.descriptionEn || product.shortDescriptionEn || '',
      '',
      '--------------------------------------------------------------------',
      'OFFICIAL COPYRIGHT & INTELLECTUAL PROPERTY NOTICE:',
      'جميع حقوق الطبع والنشر والملكية الفكرية محفوظة للدكتورة/ إيمان الأحمر.',
      'Copyright © 2026 د/ إيمان الأحمر (Dr. Eman Elahmer). All Rights Reserved.',
      '--------------------------------------------------------------------',
      product.licenseTermsAr || '',
      product.licenseTermsEn || '',
      '====================================================================',
    ].join('\n');

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(product.slug)}-licensed.txt"`
    );
    return res.send(content);
  } catch (error) {
    console.error('Stream download error:', error);
    res.status(500).send('Failed to stream download');
  }
});

// 12. Submit Product Review (Verified Buyer check)
app.post('/api/reviews', requireAuth, async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    const { productId, rating, title, comment } = req.body;
    const numRating = Math.min(5, Math.max(1, Number(rating || 5)));

    const userOrders = await db
      .select()
      .from(orders)
      .where(and(eq(orders.userUid, uid), eq(orders.paymentStatus, 'paid')));
    const paidOrderIds = new Set(userOrders.map((o) => o.id));
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.productId, Number(productId)));
    const isVerifiedBuyer = items.some((i) => paidOrderIds.has(i.orderId));

    const inserted = await db
      .insert(reviews)
      .values({
        productId: Number(productId),
        userUid: uid,
        reviewerName: req.user!.name || req.user!.email?.split('@')[0] || 'عميل المتجر',
        rating: numRating,
        title: title || '',
        comment: comment || '',
        isVerifiedBuyer,
        isApproved: true,
      })
      .returning();

    // Recalculate product rating average from real database records
    const allProdReviews = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.productId, Number(productId)), eq(reviews.isApproved, true)));
    const avg =
      allProdReviews.reduce((sum, r) => sum + r.rating, 0) /
      Math.max(1, allProdReviews.length);

    await db
      .update(products)
      .set({
        ratingAvg: avg.toFixed(2),
        reviewsCount: allProdReviews.length,
      })
      .where(eq(products.id, Number(productId)));

    res.json({ review: inserted[0] });
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// 13. Submit Product Question
app.post('/api/questions', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { productId, question } = req.body;
    if (!question || !String(question).trim()) {
      return res.status(400).json({ error: 'Question cannot be empty' });
    }
    const inserted = await db
      .insert(productQuestions)
      .values({
        productId: Number(productId),
        userUid: req.user!.uid,
        askerName: req.user!.name || req.user!.email?.split('@')[0] || 'زائر',
        question: String(question).trim(),
        isPublic: true,
      })
      .returning();

    res.json({ question: inserted[0] });
  } catch (error) {
    console.error('Question submission failed:', error);
    res.status(500).json({ error: 'Failed to submit question' });
  }
});

// 14. Submit Technical Support Ticket (Section 14)
app.post('/api/support-tickets', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      category,
      priority,
      subject,
      message,
      attachmentName,
      attachmentDataUrl,
    } = req.body;

    if (!customerName || !customerEmail || !subject || !message) {
      return res.status(400).json({ error: 'يرجى ملء كافة الحقول المطلوبة / Please fill all required fields' });
    }

    const ticketNumber = `ATU-TKT-${Date.now().toString().slice(-6)}-${Math.floor(
      10 + Math.random() * 90
    )}`;

    const inserted = await db
      .insert(supportTickets)
      .values({
        ticketNumber,
        userUid: req.user?.uid || '',
        customerName,
        customerEmail,
        customerPhone: customerPhone || '',
        category: category || 'general',
        priority: priority || 'normal',
        subject,
        message,
        attachmentName: attachmentName || '',
        attachmentDataUrl: attachmentDataUrl || '',
        status: 'open',
      })
      .returning();

    res.json({ ticket: inserted[0] });
  } catch (error) {
    console.error('Support ticket creation error:', error);
    res.status(500).json({ error: 'Failed to create support ticket' });
  }
});

// 15. Newsletter Subscription & Unsubscribe (Section 17)
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email, fullName, locale, consentGiven } = req.body;
    if (!email || !consentGiven) {
      return res.status(400).json({
        error: 'يرجى إدخال البريد الإلكتروني والموافقة على سياسة الخصوصية / Email and consent required.',
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const inserted = await db
      .insert(newsletterSubscribers)
      .values({
        email: cleanEmail,
        fullName: fullName || '',
        locale: locale || 'ar',
        consentGiven: true,
        isSubscribed: true,
      })
      .onConflictDoUpdate({
        target: newsletterSubscribers.email,
        set: {
          isSubscribed: true,
          consentGiven: true,
          unsubscribedAt: null,
        },
      })
      .returning();

    res.json({ subscriber: inserted[0] });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

app.post('/api/newsletter/unsubscribe', async (req, res) => {
  try {
    const cleanEmail = String(req.body.email || '').trim().toLowerCase();
    await db
      .update(newsletterSubscribers)
      .set({ isSubscribed: false, unsubscribedAt: new Date() })
      .where(eq(newsletterSubscribers.email, cleanEmail));

    res.json({ status: 'unsubscribed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// ============================================================================
// SUPER ADMINISTRATOR ROUTES (Strictly Aleman201451@gmail.com)
// ============================================================================

app.get('/api/admin/dashboard', requireSuperAdmin, async (_req: AuthRequest, res) => {
  try {
    await ensureBootstrapped();
    const [
      allProds,
      allFiles,
      allCats,
      allOrders,
      allOrderItems,
      allPayments,
      allProfiles,
      allRoles,
      allReviews,
      allQuestions,
      allCoupons,
      allBanners,
      allSettings,
      allSocials,
      allTickets,
      allCurrencies,
      allRates,
      allAudits,
      allBackups,
      allDownloadLogs,
      allSubscribers,
    ] = await Promise.all([
      db.select().from(products).orderBy(desc(products.createdAt)),
      db.select({
        id: productFiles.id,
        productId: productFiles.productId,
        fileName: productFiles.fileName,
        fileFormat: productFiles.fileFormat,
        fileSizeBytes: productFiles.fileSizeBytes,
        fileSizeLabel: productFiles.fileSizeLabel,
        storagePath: productFiles.storagePath,
        isPreview: productFiles.isPreview,
        isPaidProtected: productFiles.isPaidProtected,
        downloadsCount: productFiles.downloadsCount,
        createdAt: productFiles.createdAt,
      }).from(productFiles).orderBy(desc(productFiles.createdAt)),
      db.select().from(categories).orderBy(asc(categories.sortOrder)),
      db.select().from(orders).orderBy(desc(orders.createdAt)),
      db.select().from(orderItems),
      db.select().from(payments).orderBy(desc(payments.createdAt)),
      db.select().from(profiles).orderBy(desc(profiles.createdAt)),
      db.select().from(userRoles),
      db.select().from(reviews).orderBy(desc(reviews.createdAt)),
      db.select().from(productQuestions).orderBy(desc(productQuestions.createdAt)),
      db.select().from(coupons).orderBy(desc(coupons.createdAt)),
      db.select().from(homepageBanners).orderBy(asc(homepageBanners.sortOrder)),
      db.select().from(storeSettings),
      db.select().from(socialLinks).orderBy(asc(socialLinks.sortOrder)),
      db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt)),
      db.select().from(currencies),
      db.select().from(exchangeRates),
      db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(100),
      db.select({
        id: backupLogs.id,
        backupCode: backupLogs.backupCode,
        backupType: backupLogs.backupType,
        scope: backupLogs.scope,
        status: backupLogs.status,
        sizeBytes: backupLogs.sizeBytes,
        tablesCount: backupLogs.tablesCount,
        recordsCount: backupLogs.recordsCount,
        checksumSha256: backupLogs.checksumSha256,
        storageLocation: backupLogs.storageLocation,
        verificationStatus: backupLogs.verificationStatus,
        initiatedBy: backupLogs.initiatedBy,
        completedAt: backupLogs.completedAt,
      }).from(backupLogs).orderBy(desc(backupLogs.createdAt)),
      db.select().from(downloadLogs).orderBy(desc(downloadLogs.createdAt)).limit(100),
      db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt)),
    ]);

    const confirmedRevenue = allOrders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    const totalDownloads = allProds.reduce((sum, p) => sum + (p.downloadsCount || 0), 0);

    res.json({
      metrics: {
        totalProducts: allProds.length,
        totalCategories: allCats.length,
        totalOrders: allOrders.length,
        paidOrdersCount: allOrders.filter((o) => o.paymentStatus === 'paid').length,
        confirmedRevenue: Number(confirmedRevenue.toFixed(2)),
        totalCustomers: allProfiles.length,
        totalDownloads,
        openTicketsCount: allTickets.filter((t) => t.status === 'open').length,
        completedBackupsCount: allBackups.filter((b) => b.status === 'completed').length,
      },
      products: allProds,
      files: allFiles,
      categories: allCats,
      orders: allOrders,
      orderItems: allOrderItems,
      payments: allPayments,
      customers: allProfiles,
      roles: allRoles,
      reviews: allReviews,
      questions: allQuestions,
      coupons: allCoupons,
      banners: allBanners,
      settings: allSettings,
      socialLinks: allSocials,
      tickets: allTickets,
      currencies: allCurrencies,
      exchangeRates: allRates,
      auditLogs: allAudits,
      backupLogs: allBackups,
      downloadLogs: allDownloadLogs,
      subscribers: allSubscribers,
    });
  } catch (error: any) {
    console.error('Admin dashboard load error:', error);
    res.status(500).json({ error: 'Failed to load admin dashboard data' });
  }
});

// Admin: Create or Update Product
app.post('/api/admin/products', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const body = req.body;
    const slug =
      body.slug ||
      `product-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const sku = body.sku || `ATU-SKU-${Date.now().toString().slice(-6)}`;

    const inserted = await db
      .insert(products)
      .values({
        slug,
        sku,
        categoryId: body.categoryId ? Number(body.categoryId) : null,
        titleAr: body.titleAr,
        titleEn: body.titleEn,
        shortDescriptionAr: body.shortDescriptionAr || '',
        shortDescriptionEn: body.shortDescriptionEn || '',
        descriptionAr: body.descriptionAr || '',
        descriptionEn: body.descriptionEn || '',
        price: String(body.price || '0.00'),
        discountPrice:
          body.discountPrice !== undefined && body.discountPrice !== ''
            ? String(body.discountPrice)
            : null,
        currency: body.currency || 'EGP',
        fileFormat: body.fileFormat || 'PDF',
        fileSizeBytes: Number(body.fileSizeBytes || 0),
        fileSizeLabel: body.fileSizeLabel || '',
        isFree: Boolean(body.isFree) || Number(body.price || 0) === 0,
        isFeatured: Boolean(body.isFeatured),
        isSpecialOffer: Boolean(body.isSpecialOffer),
        isPublished: body.isPublished !== false,
        availabilityStatus: body.availabilityStatus || 'available',
        licenseTermsAr:
          body.licenseTermsAr ||
          'جميع حقوق الطبع والنشر والملكية الفكرية محفوظة للدكتورة/ إيمان الأحمر. يمنع إعادة البيع التجاري أو التوزيع غير المصرح به.',
        licenseTermsEn:
          body.licenseTermsEn ||
          'Copyright © 2026 Dr. Eman Elahmer. All Rights Reserved. Unauthorized redistribution or commercial resale is strictly prohibited.',
        previewUrl: body.previewUrl || '',
        mainImageUrl: body.mainImageUrl || '',
        productType: body.productType || 'digital',
      })
      .returning();

    const createdProd = inserted[0];

    if (body.fileDataUrl && body.fileName) {
      let storagePath = `/private-storage/products/${createdProd.id}/${body.fileName}`;
      const supabaseAdmin = createServerSupabaseAdmin();
      if (supabaseAdmin && String(body.fileDataUrl).startsWith('data:')) {
        const matches = String(body.fileDataUrl).match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          const mimeType = matches[1];
          const buffer = Buffer.from(matches[2], 'base64');
          const objectPath = `products/${createdProd.id}/${Date.now()}-${body.fileName}`;
          const { error: uploadErr } = await supabaseAdmin.storage
            .from('paid-products')
            .upload(objectPath, buffer, { contentType: mimeType, upsert: true });
          if (!uploadErr) {
            storagePath = `supabase://paid-products/${objectPath}`;
          }
        }
      }

      await db.insert(productFiles).values({
        productId: createdProd.id,
        fileName: body.fileName,
        fileFormat: body.fileFormat || 'PDF',
        fileSizeBytes: Number(body.fileSizeBytes || 0),
        fileSizeLabel: body.fileSizeLabel || '',
        storagePath,
        fileDataUrl: body.fileDataUrl,
        isPreview: false,
        isPaidProtected: !createdProd.isFree,
      });
    }

    await logAuditEvent({
      actorUid: req.user!.uid,
      actorEmail: req.user!.email || '',
      action: 'PRODUCT_CREATED',
      entityType: 'products',
      entityId: String(createdProd.id),
      details: `Created product ${createdProd.titleAr} (${createdProd.sku})`,
    });

    res.json({ product: createdProd });
  } catch (error: any) {
    console.error('Create product failed:', error);
    res.status(500).json({ error: error.message || 'Failed to create product' });
  }
});

app.put('/api/admin/products/:id', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const body = req.body;
    const updated = await db
      .update(products)
      .set({
        titleAr: body.titleAr,
        titleEn: body.titleEn,
        categoryId: body.categoryId ? Number(body.categoryId) : null,
        shortDescriptionAr: body.shortDescriptionAr || '',
        shortDescriptionEn: body.shortDescriptionEn || '',
        descriptionAr: body.descriptionAr || '',
        descriptionEn: body.descriptionEn || '',
        price: String(body.price || '0.00'),
        discountPrice:
          body.discountPrice !== undefined && body.discountPrice !== '' && body.discountPrice !== null
            ? String(body.discountPrice)
            : null,
        fileFormat: body.fileFormat || 'PDF',
        fileSizeLabel: body.fileSizeLabel || '',
        isFree: Boolean(body.isFree),
        isFeatured: Boolean(body.isFeatured),
        isSpecialOffer: Boolean(body.isSpecialOffer),
        isPublished: Boolean(body.isPublished),
        mainImageUrl: body.mainImageUrl || '',
        previewUrl: body.previewUrl || '',
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    await logAuditEvent({
      actorUid: req.user!.uid,
      actorEmail: req.user!.email || '',
      action: 'PRODUCT_UPDATED',
      entityType: 'products',
      entityId: String(id),
      details: `Updated product #${id}`,
    });

    res.json({ product: updated[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/admin/products/:id', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(productFiles).where(eq(productFiles.productId, id));
    await db.delete(productImages).where(eq(productImages.productId, id));
    await db.delete(productTranslations).where(eq(productTranslations.productId, id));
    await db.delete(favorites).where(eq(favorites.productId, id));
    await db.delete(reviews).where(eq(reviews.productId, id));
    await db.delete(productQuestions).where(eq(productQuestions.productId, id));
    await db.delete(downloads).where(eq(downloads.productId, id));
    await db.delete(downloadLogs).where(eq(downloadLogs.productId, id));
    await db.delete(products).where(eq(products.id, id));

    await logAuditEvent({
      actorUid: req.user!.uid,
      actorEmail: req.user!.email || '',
      action: 'PRODUCT_DELETED',
      entityType: 'products',
      entityId: String(id),
      details: `Deleted product #${id}`,
    });

    res.json({ status: 'deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Admin: Upload Product File (with Supabase Storage Private Bucket support)
app.post('/api/admin/files', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const {
      productId,
      fileName,
      fileFormat,
      fileSizeBytes,
      fileSizeLabel,
      fileDataUrl,
      isPreview,
      isPaidProtected,
    } = req.body;

    if (!productId || !fileName) {
      return res.status(400).json({ error: 'productId and fileName are required' });
    }

    let storagePath = `/private-storage/products/${productId}/${fileName}`;
    const supabaseAdmin = createServerSupabaseAdmin();
    if (supabaseAdmin && fileDataUrl && String(fileDataUrl).startsWith('data:')) {
      const matches = String(fileDataUrl).match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const bucket = isPreview ? 'public-previews' : 'paid-products';
        const objectPath = `products/${productId}/${Date.now()}-${fileName}`;
        const { error: uploadErr } = await supabaseAdmin.storage
          .from(bucket)
          .upload(objectPath, buffer, { contentType: mimeType, upsert: true });
        if (!uploadErr) {
          storagePath = `supabase://${bucket}/${objectPath}`;
        }
      }
    }

    const inserted = await db
      .insert(productFiles)
      .values({
        productId: Number(productId),
        fileName,
        fileFormat: fileFormat || 'PDF',
        fileSizeBytes: Number(fileSizeBytes || 0),
        fileSizeLabel: fileSizeLabel || '',
        storagePath,
        fileDataUrl: fileDataUrl || '',
        isPreview: Boolean(isPreview),
        isPaidProtected: isPaidProtected !== false,
      })
      .returning();

    await logAuditEvent({
      actorUid: req.user!.uid,
      actorEmail: req.user!.email || '',
      action: 'FILE_UPLOADED',
      entityType: 'product_files',
      entityId: String(inserted[0].id),
      details: `Uploaded file ${fileName} for product #${productId} (${storagePath})`,
    });

    res.json({ file: inserted[0] });
  } catch (error) {
    console.error('Upload product file failed:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

app.delete('/api/admin/files/:id', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(productFiles).where(eq(productFiles.id, id));
    res.json({ status: 'deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Admin: Categories
app.post('/api/admin/categories', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const { nameAr, nameEn, slug, descriptionAr, descriptionEn, iconName, sortOrder } = req.body;
    const cleanSlug =
      slug ||
      nameEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') ||
      `cat-${Date.now()}`;

    const inserted = await db
      .insert(categories)
      .values({
        slug: cleanSlug,
        nameAr,
        nameEn,
        descriptionAr: descriptionAr || '',
        descriptionEn: descriptionEn || '',
        iconName: iconName || 'BookOpen',
        sortOrder: Number(sortOrder || 10),
        isActive: true,
      })
      .returning();

    await logAuditEvent({
      actorUid: req.user!.uid,
      actorEmail: req.user!.email || '',
      action: 'CATEGORY_CREATED',
      entityType: 'categories',
      entityId: String(inserted[0].id),
      details: `Created category ${nameAr} / ${nameEn}`,
    });

    res.json({ category: inserted[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.delete('/api/admin/categories/:id', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(categories).where(eq(categories.id, id));
    res.json({ status: 'deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Admin: Coupons
app.post('/api/admin/coupons', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const { code, descriptionAr, descriptionEn, discountType, discountValue, minOrderAmount, maxUses } =
      req.body;
    const cleanCode = String(code).trim().toUpperCase();
    const inserted = await db
      .insert(coupons)
      .values({
        code: cleanCode,
        descriptionAr: descriptionAr || '',
        descriptionEn: descriptionEn || '',
        discountType: discountType || 'percentage',
        discountValue: String(discountValue || '10'),
        minOrderAmount: String(minOrderAmount || '0'),
        maxUses: Number(maxUses || 100),
        isActive: true,
      })
      .returning();

    await logAuditEvent({
      actorUid: req.user!.uid,
      actorEmail: req.user!.email || '',
      action: 'COUPON_CREATED',
      entityType: 'coupons',
      entityId: cleanCode,
      details: `Created coupon ${cleanCode}`,
    });

    res.json({ coupon: inserted[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create coupon' });
  }
});

app.delete('/api/admin/coupons/:id', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    await db.delete(coupons).where(eq(coupons.id, Number(req.params.id)));
    res.json({ status: 'deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
});

// Admin: Banners
app.post('/api/admin/banners', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const { titleAr, titleEn, subtitleAr, subtitleEn, ctaTextAr, ctaTextEn, ctaLink, imageUrl } =
      req.body;
    const inserted = await db
      .insert(homepageBanners)
      .values({
        titleAr,
        titleEn,
        subtitleAr: subtitleAr || '',
        subtitleEn: subtitleEn || '',
        ctaTextAr: ctaTextAr || 'تصفح المتجر',
        ctaTextEn: ctaTextEn || 'Browse Marketplace',
        ctaLink: ctaLink || '/marketplace',
        imageUrl: imageUrl || '',
        isActive: true,
      })
      .returning();

    res.json({ banner: inserted[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create banner' });
  }
});

app.delete('/api/admin/banners/:id', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    await db.delete(homepageBanners).where(eq(homepageBanners.id, Number(req.params.id)));
    res.json({ status: 'deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});

// Admin: Update Order & Payment Status / Authorize Digital Delivery
app.put('/api/admin/orders/:id/status', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const { status, paymentStatus } = req.body;
    const updated = await db
      .update(orders)
      .set({
        status,
        paymentStatus,
        fulfillmentStatus: paymentStatus === 'paid' ? 'delivered_digital' : 'pending',
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();

    const order = updated[0];

    if (paymentStatus === 'paid') {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
      for (const item of items) {
        const signedToken = crypto.randomBytes(24).toString('hex');
        await db.insert(downloads).values({
          userUid: order.userUid,
          productId: item.productId,
          orderId: order.id,
          signedToken,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          downloadCount: 0,
          maxDownloads: 10,
        });
      }
    }

    await logAuditEvent({
      actorUid: req.user!.uid,
      actorEmail: req.user!.email || '',
      action: 'ORDER_STATUS_UPDATED',
      entityType: 'orders',
      entityId: order.orderNumber,
      details: `Order ${order.orderNumber} updated to status=${status}, paymentStatus=${paymentStatus}`,
    });

    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Admin: Respond to Support Ticket
app.put('/api/admin/tickets/:id/respond', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const { adminResponse, status } = req.body;
    const updated = await db
      .update(supportTickets)
      .set({
        adminResponse,
        status: status || 'resolved',
        respondedBy: req.user!.email || 'Aleman201451@gmail.com',
        respondedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(supportTickets.id, id))
      .returning();

    const ticket = updated[0];
    if (ticket && ticket.userUid) {
      await db.insert(notifications).values({
        userUid: ticket.userUid,
        titleAr: `تم الرد على تذكرة الدعم رقم ${ticket.ticketNumber}`,
        titleEn: `Support Ticket ${ticket.ticketNumber} Updated`,
        messageAr: adminResponse,
        messageEn: adminResponse,
        type: 'support',
        linkUrl: '/support-tickets',
      });
    }

    await logAuditEvent({
      actorUid: req.user!.uid,
      actorEmail: req.user!.email || '',
      action: 'SUPPORT_TICKET_RESPONDED',
      entityType: 'support_tickets',
      entityId: ticket.ticketNumber,
      details: `Responded to ticket ${ticket.ticketNumber}`,
    });

    res.json({ ticket });
  } catch (error) {
    res.status(500).json({ error: 'Failed to respond to support ticket' });
  }
});

// Admin: Answer Product Question
app.put('/api/admin/questions/:id/answer', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const { answer } = req.body;
    const updated = await db
      .update(productQuestions)
      .set({
        answer,
        answeredBy: 'د/ إيمان الأحمر (الإدارة)',
        answeredAt: new Date(),
      })
      .where(eq(productQuestions.id, id))
      .returning();

    res.json({ question: updated[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to answer question' });
  }
});

// Admin: Update Store Settings
app.put('/api/admin/settings', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const updates: Record<string, string> = req.body.settings || {};
    for (const [key, value] of Object.entries(updates)) {
      await db
        .insert(storeSettings)
        .values({
          settingKey: key,
          settingValue: String(value),
          updatedBy: req.user!.email || 'Aleman201451@gmail.com',
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: storeSettings.settingKey,
          set: {
            settingValue: String(value),
            updatedBy: req.user!.email || 'Aleman201451@gmail.com',
            updatedAt: new Date(),
          },
        });
    }

    await logAuditEvent({
      actorUid: req.user!.uid,
      actorEmail: req.user!.email || '',
      action: 'STORE_SETTINGS_UPDATED',
      entityType: 'store_settings',
      details: `Updated settings keys: ${Object.keys(updates).join(', ')}`,
    });

    res.json({ status: 'updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Admin: Configure Real Exchange Rate
app.put('/api/admin/exchange-rates', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const { fromCurrency, toCurrency, rate } = req.body;
    const existing = await db
      .select()
      .from(exchangeRates)
      .where(
        and(
          eq(exchangeRates.fromCurrency, fromCurrency),
          eq(exchangeRates.toCurrency, toCurrency)
        )
      );

    if (existing.length > 0) {
      await db
        .update(exchangeRates)
        .set({
          rate: String(rate),
          isConfigured: true,
          updatedAt: new Date(),
        })
        .where(eq(exchangeRates.id, existing[0].id));
    } else {
      await db.insert(exchangeRates).values({
        fromCurrency,
        toCurrency,
        rate: String(rate),
        source: 'manual_admin',
        isConfigured: true,
      });
    }

    await logAuditEvent({
      actorUid: req.user!.uid,
      actorEmail: req.user!.email || '',
      action: 'EXCHANGE_RATE_CONFIGURED',
      entityType: 'exchange_rates',
      details: `Set ${fromCurrency} -> ${toCurrency} = ${rate}`,
    });

    res.json({ status: 'configured' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to configure exchange rate' });
  }
});

// Admin: Trigger Verified Manual Backup
app.post('/api/admin/backups/create', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const backup = await createManualDatabaseBackup(req.user!.email || 'Aleman201451@gmail.com');
    res.json({ backup });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Backup failed' });
  }
});

// Admin: Refund Order, Update Payment Record, and Revoke Digital Downloads
app.post('/api/admin/orders/:id/refund', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const refundReason = String(req.body.reason || 'Admin initiated refund').trim();

    const orderRows = await db.select().from(orders).where(eq(orders.id, id));
    if (!orderRows.length) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const order = orderRows[0];

    await db
      .update(orders)
      .set({
        status: 'refunded',
        paymentStatus: 'refunded',
        fulfillmentStatus: 'revoked',
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id));

    await db
      .update(payments)
      .set({
        status: 'refunded',
        refundReason,
        refundedAt: new Date(),
      })
      .where(eq(payments.orderId, id));

    // Immediately revoke/expire all download tokens tied to this order
    await db
      .update(downloads)
      .set({
        expiresAt: new Date(0),
        maxDownloads: 0,
      })
      .where(eq(downloads.orderId, id));

    if (order.userUid) {
      await db.insert(notifications).values({
        userUid: order.userUid,
        titleAr: `تم استرداد الطلب رقم ${order.orderNumber}`,
        titleEn: `Order ${order.orderNumber} Refunded`,
        messageAr: `تم تنفيذ الاسترداد للطلب رقم ${order.orderNumber} وإلغاء روابط التحميل المرتبطة به. السبب: ${refundReason}`,
        messageEn: `Order ${order.orderNumber} has been refunded and associated digital licenses revoked. Reason: ${refundReason}`,
        type: 'order',
        linkUrl: '/my-orders',
      });
    }

    await logAuditEvent({
      actorUid: req.user!.uid,
      actorEmail: req.user!.email || '',
      action: 'ORDER_REFUNDED_AND_REVOKED',
      entityType: 'orders',
      entityId: order.orderNumber,
      details: `Refunded order ${order.orderNumber}. Reason: ${refundReason}`,
    });

    res.json({ status: 'refunded', orderNumber: order.orderNumber });
  } catch (error) {
    console.error('Order refund error:', error);
    res.status(500).json({ error: 'Failed to refund order' });
  }
});

// Helper to recalculate product review stats after moderation
async function recalculateProductReviewStats(productId: number) {
  const approved = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true)));
  const avg =
    approved.length > 0
      ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length
      : 0;

  await db
    .update(products)
    .set({
      ratingAvg: avg.toFixed(2),
      reviewsCount: approved.length,
    })
    .where(eq(products.id, productId));
}

// Admin: Moderate Review (Approve / Hide)
app.put('/api/admin/reviews/:id', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const isApproved = Boolean(req.body.isApproved);
    const updated = await db
      .update(reviews)
      .set({ isApproved })
      .where(eq(reviews.id, id))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await recalculateProductReviewStats(updated[0].productId);

    await logAuditEvent({
      actorUid: req.user!.uid,
      actorEmail: req.user!.email || '',
      action: isApproved ? 'REVIEW_APPROVED' : 'REVIEW_HIDDEN',
      entityType: 'reviews',
      entityId: String(id),
      details: `Review #${id} set to isApproved=${isApproved}`,
    });

    res.json({ review: updated[0] });
  } catch (error) {
    console.error('Review moderation error:', error);
    res.status(500).json({ error: 'Failed to moderate review' });
  }
});

// Admin: Delete Review
app.delete('/api/admin/reviews/:id', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const existing = await db.select().from(reviews).where(eq(reviews.id, id));
    if (!existing.length) {
      return res.status(404).json({ error: 'Review not found' });
    }
    const productId = existing[0].productId;
    await db.delete(reviews).where(eq(reviews.id, id));
    await recalculateProductReviewStats(productId);

    await logAuditEvent({
      actorUid: req.user!.uid,
      actorEmail: req.user!.email || '',
      action: 'REVIEW_DELETED',
      entityType: 'reviews',
      entityId: String(id),
      details: `Deleted review #${id} from product #${productId}`,
    });

    res.json({ status: 'deleted' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// Admin: Social Links Management
app.post('/api/admin/social-links', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const { platform, labelAr, labelEn, url, iconName, sortOrder } = req.body;
    if (!platform || !labelAr || !url) {
      return res.status(400).json({ error: 'platform, labelAr, and url are required' });
    }
    const inserted = await db
      .insert(socialLinks)
      .values({
        platform: String(platform).trim(),
        labelAr: String(labelAr).trim(),
        labelEn: String(labelEn || labelAr).trim(),
        url: String(url).trim(),
        iconName: iconName || 'ExternalLink',
        sortOrder: Number(sortOrder || 10),
        isActive: true,
      })
      .returning();

    await logAuditEvent({
      actorUid: req.user!.uid,
      actorEmail: req.user!.email || '',
      action: 'SOCIAL_LINK_CREATED',
      entityType: 'social_links',
      entityId: String(inserted[0].id),
      details: `Created social link ${platform}: ${url}`,
    });

    res.json({ socialLink: inserted[0] });
  } catch (error) {
    console.error('Create social link error:', error);
    res.status(500).json({ error: 'Failed to create social link' });
  }
});

app.put('/api/admin/social-links/:id', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const { labelAr, labelEn, url, isActive } = req.body;
    const updated = await db
      .update(socialLinks)
      .set({
        labelAr: labelAr !== undefined ? String(labelAr).trim() : undefined,
        labelEn: labelEn !== undefined ? String(labelEn).trim() : undefined,
        url: url !== undefined ? String(url).trim() : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      })
      .where(eq(socialLinks.id, id))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ error: 'Social link not found' });
    }

    await logAuditEvent({
      actorUid: req.user!.uid,
      actorEmail: req.user!.email || '',
      action: 'SOCIAL_LINK_UPDATED',
      entityType: 'social_links',
      entityId: String(id),
      details: `Updated social link #${id}`,
    });

    res.json({ socialLink: updated[0] });
  } catch (error) {
    console.error('Update social link error:', error);
    res.status(500).json({ error: 'Failed to update social link' });
  }
});

app.delete('/api/admin/social-links/:id', requireSuperAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(socialLinks).where(eq(socialLinks.id, id));
    await logAuditEvent({
      actorUid: req.user!.uid,
      actorEmail: req.user!.email || '',
      action: 'SOCIAL_LINK_DELETED',
      entityType: 'social_links',
      entityId: String(id),
      details: `Deleted social link #${id}`,
    });
    res.json({ status: 'deleted' });
  } catch (error) {
    console.error('Delete social link error:', error);
    res.status(500).json({ error: 'Failed to delete social link' });
  }
});

// ============================================================================
// REAL SERVER-SIDE PAYMENT GATEWAY WEBHOOKS (Paymob, Fawry, PayPal)
// Strictly verifies cryptographic signatures before unlocking paid downloads.
// Returns 503 if live gateway credentials are not yet configured.
// ============================================================================

function timingSafeHexEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a.toLowerCase(), 'utf8');
  const bufB = Buffer.from(b.toLowerCase(), 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

async function finalizeVerifiedOrderPayment(params: {
  orderNumber: string;
  gateway: string;
  transactionReference: string;
  gatewayResponse: string;
}) {
  const orderRows = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, params.orderNumber));
  if (!orderRows.length) {
    return { found: false, alreadyPaid: false };
  }
  const order = orderRows[0];
  if (order.paymentStatus === 'paid') {
    return { found: true, alreadyPaid: true, order };
  }

  await db
    .update(orders)
    .set({
      status: 'completed',
      paymentStatus: 'paid',
      fulfillmentStatus: 'delivered_digital',
      updatedAt: new Date(),
    })
    .where(eq(orders.id, order.id));

  const existingPayments = await db
    .select()
    .from(payments)
    .where(eq(payments.orderId, order.id));

  if (existingPayments.length > 0) {
    await db
      .update(payments)
      .set({
        gateway: params.gateway,
        transactionReference: params.transactionReference,
        status: 'verified',
        webhookVerified: true,
        gatewayResponse: params.gatewayResponse.slice(0, 2000),
      })
      .where(eq(payments.id, existingPayments[0].id));
  } else {
    await db.insert(payments).values({
      orderId: order.id,
      userUid: order.userUid,
      gateway: params.gateway,
      transactionReference: params.transactionReference,
      amount: order.totalAmount,
      currency: order.currency,
      status: 'verified',
      webhookVerified: true,
      gatewayResponse: params.gatewayResponse.slice(0, 2000),
    });
  }

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  for (const item of items) {
    const signedToken = crypto.randomBytes(24).toString('hex');
    await db.insert(downloads).values({
      userUid: order.userUid,
      productId: item.productId,
      orderId: order.id,
      signedToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      downloadCount: 0,
      maxDownloads: 10,
    });

    const prodRows = await db.select().from(products).where(eq(products.id, item.productId));
    if (prodRows.length > 0) {
      await db
        .update(products)
        .set({ salesCount: (prodRows[0].salesCount || 0) + (item.quantity || 1) })
        .where(eq(products.id, item.productId));
    }
  }

  if (order.userUid) {
    await db.insert(notifications).values({
      userUid: order.userUid,
      titleAr: `تم تأكيد دفع الطلب رقم ${order.orderNumber}`,
      titleEn: `Payment Confirmed for Order ${order.orderNumber}`,
      messageAr: `تم التحقق من السداد عبر ${params.gateway} وتفعيل روابط التحميل الرقمية في حسابك.`,
      messageEn: `Your payment via ${params.gateway} is verified and digital download links are now active.`,
      type: 'order',
      linkUrl: '/my-downloads',
    });
  }

  await logAuditEvent({
    actorEmail: `webhook:${params.gateway}`,
    action: 'PAYMENT_WEBHOOK_VERIFIED',
    entityType: 'orders',
    entityId: order.orderNumber,
    details: `Verified ${params.gateway} transaction ${params.transactionReference} and unlocked digital files.`,
  });

  return { found: true, alreadyPaid: false, order };
}

// 1. Paymob Webhook (HMAC-SHA512 Verification)
app.post('/api/webhooks/paymob', async (req, res) => {
  try {
    const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
    if (!hmacSecret) {
      return res.status(503).json({
        error: 'Paymob live webhook secret (PAYMOB_HMAC_SECRET) is not configured.',
      });
    }

    const receivedHmac = String(req.query.hmac || req.headers['x-paymob-hmac'] || '').trim();
    const obj = req.body?.obj;
    if (!receivedHmac || !obj) {
      return res.status(400).json({ error: 'Missing Paymob payload or HMAC signature.' });
    }

    const concatenated = [
      obj.amount_cents ?? '',
      obj.created_at ?? '',
      obj.currency ?? '',
      obj.error_occured ?? '',
      obj.has_parent_transaction ?? '',
      obj.id ?? '',
      obj.integration_id ?? '',
      obj.is_3d_secure ?? '',
      obj.is_auth ?? '',
      obj.is_capture ?? '',
      obj.is_refunded ?? '',
      obj.is_standalone_payment ?? '',
      obj.is_voided ?? '',
      obj.order?.id ?? '',
      obj.owner ?? '',
      obj.pending ?? '',
      obj.source_data?.pan ?? '',
      obj.source_data?.sub_type ?? '',
      obj.source_data?.type ?? '',
      obj.success ?? '',
    ].join('');

    const calculatedHmac = crypto
      .createHmac('sha512', hmacSecret)
      .update(concatenated)
      .digest('hex');

    if (!timingSafeHexEqual(calculatedHmac, receivedHmac)) {
      return res.status(401).json({ error: 'Invalid Paymob HMAC signature.' });
    }

    if (obj.success === true || obj.success === 'true') {
      const orderNumber = String(obj.order?.merchant_order_id || '');
      if (orderNumber) {
        await finalizeVerifiedOrderPayment({
          orderNumber,
          gateway: 'paymob',
          transactionReference: String(obj.id),
          gatewayResponse: JSON.stringify({ id: obj.id, success: obj.success, currency: obj.currency }),
        });
      }
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('Paymob webhook error:', error);
    return res.status(500).json({ error: 'Paymob webhook processing failed' });
  }
});

// 2. Fawry Webhook (SHA-256 Signature Verification)
app.post('/api/webhooks/fawry', async (req, res) => {
  try {
    const securityKey = process.env.FAWRY_SECURITY_KEY;
    if (!securityKey) {
      return res.status(503).json({
        error: 'Fawry live security key (FAWRY_SECURITY_KEY) is not configured.',
      });
    }

    const {
      fawryRefNumber,
      merchantRefNumber,
      paymentAmount,
      orderAmount,
      orderStatus,
      paymentMethod,
      paymentRefrenceNumber,
      messageSignature,
    } = req.body || {};

    if (!fawryRefNumber || !merchantRefNumber || !messageSignature) {
      return res.status(400).json({ error: 'Incomplete Fawry webhook payload.' });
    }

    const rawSignature = `${fawryRefNumber}${merchantRefNumber}${Number(paymentAmount).toFixed(2)}${Number(orderAmount).toFixed(2)}${orderStatus}${paymentMethod}${paymentRefrenceNumber || ''}${securityKey}`;
    const expectedSignature = crypto.createHash('sha256').update(rawSignature).digest('hex');

    if (!timingSafeHexEqual(expectedSignature, String(messageSignature))) {
      return res.status(401).json({ error: 'Invalid Fawry messageSignature.' });
    }

    if (String(orderStatus).toUpperCase() === 'PAID') {
      await finalizeVerifiedOrderPayment({
        orderNumber: String(merchantRefNumber),
        gateway: 'fawry',
        transactionReference: String(fawryRefNumber),
        gatewayResponse: JSON.stringify({ fawryRefNumber, orderStatus, paymentMethod }),
      });
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('Fawry webhook error:', error);
    return res.status(500).json({ error: 'Fawry webhook processing failed' });
  }
});

// 3. PayPal Webhook (Official PayPal verify-webhook-signature API)
app.post('/api/webhooks/paypal', async (req, res) => {
  try {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (!clientId || !clientSecret || !webhookId) {
      return res.status(503).json({
        error: 'PayPal live webhook credentials (PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_WEBHOOK_ID) are not configured.',
      });
    }

    const apiBase =
      process.env.PAYPAL_MODE === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';

    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenRes = await fetch(`${apiBase}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenRes.ok) {
      return res.status(502).json({ error: 'Failed to authenticate with PayPal API.' });
    }
    const tokenJson: any = await tokenRes.json();

    const verifyRes = await fetch(`${apiBase}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenJson.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_algo: req.headers['paypal-auth-algo'],
        cert_url: req.headers['paypal-cert-url'],
        transmission_id: req.headers['paypal-transmission-id'],
        transmission_sig: req.headers['paypal-transmission-sig'],
        transmission_time: req.headers['paypal-transmission-time'],
        webhook_id: webhookId,
        webhook_event: req.body,
      }),
    });

    const verifyJson: any = await verifyRes.json();
    if (!verifyRes.ok || verifyJson.verification_status !== 'SUCCESS') {
      return res.status(401).json({ error: 'Invalid PayPal webhook signature.' });
    }

    if (req.body?.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const orderNumber = String(
        req.body?.resource?.custom_id || req.body?.resource?.invoice_id || ''
      );
      if (orderNumber) {
        await finalizeVerifiedOrderPayment({
          orderNumber,
          gateway: 'paypal',
          transactionReference: String(req.body?.resource?.id || ''),
          gatewayResponse: JSON.stringify({
            event_type: req.body.event_type,
            captureId: req.body?.resource?.id,
          }),
        });
      }
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return res.status(500).json({ error: 'PayPal webhook processing failed' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Online store alliance of arab translators server running on http://localhost:${PORT}`);
  });
}

export default app;

if (!process.env.VERCEL) {
  startServer();
}
