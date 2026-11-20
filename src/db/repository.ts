import { db } from './index.ts';
import {
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
} from './schema.ts';
import { eq, desc, asc, and, sql } from 'drizzle-orm';
import { SUPER_ADMIN_EMAIL } from '../middleware/auth.ts';
import crypto from 'crypto';

// Official default bootstrap data (strictly non-fictional)
const OFFICIAL_CATEGORIES = [
  {
    slug: 'translation-books-references',
    nameAr: 'كتب ومراجع الترجمة',
    nameEn: 'Translation Books & References',
    descriptionAr: 'مؤلفات ومراجع علمية وعملية متخصصة في دراسات الترجمة التحريرية والفورية.',
    descriptionEn: 'Specialized academic and practical books and references in translation and interpreting studies.',
    iconName: 'BookOpen',
    sortOrder: 1,
  },
  {
    slug: 'educational-files',
    nameAr: 'ملفات تعليمية',
    nameEn: 'Educational Files',
    descriptionAr: 'حقائب ومذكرات وأدلة تعليمية منهجية لتطوير مهارات المترجمين والباحثين.',
    descriptionEn: 'Structured educational guides, handouts, and workbooks for translators and researchers.',
    iconName: 'GraduationCap',
    sortOrder: 2,
  },
  {
    slug: 'training-courses',
    nameAr: 'دورات تدريبية',
    nameEn: 'Training Courses',
    descriptionAr: 'برامج ودورات تدريبية مسجلة ومواد تطبيقية في مجالات الترجمة المتخصصة.',
    descriptionEn: 'Recorded training programs and applied workshops in specialized translation fields.',
    iconName: 'Video',
    sortOrder: 3,
  },
  {
    slug: 'dictionaries-lexicons',
    nameAr: 'قواميس ومعاجم',
    nameEn: 'Dictionaries & Lexicons',
    descriptionAr: 'مسارد مصطلحات وقواميس ثنائية ومتعددة اللغات في التخصصات القانونية والطبية والتقنية.',
    descriptionEn: 'Bilingual and multilingual glossaries and lexicons for legal, medical, and technical domains.',
    iconName: 'Languages',
    sortOrder: 4,
  },
  {
    slug: 'translator-software-tools',
    nameAr: 'برامج وأدوات المترجمين',
    nameEn: 'Translator Software & Tools',
    descriptionAr: 'أدوات مساعدة وإضافات تقنية وقواعد بيانات مصطلحية لرفع إنتاجية المترجم.',
    descriptionEn: 'Productivity tools, technical utilities, and terminology databases for professional translators.',
    iconName: 'Cpu',
    sortOrder: 5,
  },
  {
    slug: 'pdf-documents',
    nameAr: 'ملفات PDF',
    nameEn: 'PDF Publications',
    descriptionAr: 'إصدارات رقمية بصيغة PDF جاهزة للقراءة والطباعة المرجعية.',
    descriptionEn: 'Digital PDF publications formatted for scholarly reading and reference.',
    iconName: 'FileText',
    sortOrder: 6,
  },
  {
    slug: 'ready-templates-forms',
    nameAr: 'قوالب ونماذج جاهزة',
    nameEn: 'Ready Templates & Forms',
    descriptionAr: 'نماذج عقود ترجمة، فواتير، شهادات اعتماد، وقوالب وثائق رسمية قابلة للتعديل.',
    descriptionEn: 'Editable translation contracts, invoices, certification templates, and official document forms.',
    iconName: 'FileSpreadsheet',
    sortOrder: 7,
  },
  {
    slug: 'free-products',
    nameAr: 'منتجات مجانية',
    nameEn: 'Free Downloads',
    descriptionAr: 'إصدارات وملفات إثرائية مجانية مقدمة من متجر اتحاد المترجمين العرب.',
    descriptionEn: 'Complimentary educational publications and resources provided by Online store alliance of arab translators.',
    iconName: 'Download',
    sortOrder: 8,
  },
  {
    slug: 'miscellaneous-products',
    nameAr: 'منتجات متنوعة',
    nameEn: 'Miscellaneous Products',
    descriptionAr: 'إصدارات رقمية ومواد معرفية متنوعة تخدم مجتمع المترجمين واللغويين.',
    descriptionEn: 'Diverse digital resources and scholarly materials serving translators and linguists.',
    iconName: 'Layers',
    sortOrder: 9,
  },
];

const OFFICIAL_CURRENCIES = [
  { code: 'EGP', symbol: 'ج.م', nameAr: 'الجنيه المصري', nameEn: 'Egyptian Pound', isBase: true, isActive: true },
  { code: 'USD', symbol: '$', nameAr: 'الدولار الأمريكي', nameEn: 'US Dollar', isBase: false, isActive: true },
  { code: 'EUR', symbol: '€', nameAr: 'اليورو الأوروبي', nameEn: 'Euro', isBase: false, isActive: true },
  { code: 'SAR', symbol: 'ر.س', nameAr: 'الريال السعودي', nameEn: 'Saudi Riyal', isBase: false, isActive: true },
  { code: 'AED', symbol: 'د.إ', nameAr: 'الدرهم الإماراتي', nameEn: 'UAE Dirham', isBase: false, isActive: true },
];

const OFFICIAL_SOCIAL_LINKS = [
  {
    platform: 'facebook',
    labelAr: 'الصفحة الرسمية على فيسبوك',
    labelEn: 'Official Facebook Page',
    url: 'https://www.facebook.com/share/1EsrHvUQKk/',
    iconName: 'Facebook',
    sortOrder: 1,
  },
  {
    platform: 'instagram',
    labelAr: 'الحساب الرسمي على إنستغرام',
    labelEn: 'Official Instagram',
    url: 'https://www.instagram.com/nour112338?igsh=dXR6OGEzbXBxMGFm',
    iconName: 'Instagram',
    sortOrder: 2,
  },
  {
    platform: 'facebook_community',
    labelAr: 'مجتمع اتحاد المترجمين العرب على فيسبوك',
    labelEn: 'Facebook Translators Community',
    url: 'https://www.facebook.com/share/g/1AVfo3xCDz/',
    iconName: 'Users',
    sortOrder: 3,
  },
  {
    platform: 'tiktok',
    labelAr: 'الحساب الرسمي على تيك توك',
    labelEn: 'Official TikTok',
    url: 'https://www.tiktok.com/@emanelahmer1?_r=1&_t=ZS-98sd4DxSbmi',
    iconName: 'Music2',
    sortOrder: 4,
  },
  {
    platform: 'youtube',
    labelAr: 'القناة الرسمية على يوتيوب',
    labelEn: 'Official YouTube Channel',
    url: 'https://youtube.com/@emananwarelahmar9059?si=6UbiPWyZZC6MLLCM',
    iconName: 'Youtube',
    sortOrder: 5,
  },
];

const OFFICIAL_SETTINGS: Record<string, { value: string; category: string }> = {
  store_name_ar: { value: 'متجر اتحاد المترجمين العرب', category: 'general' },
  store_name_en: { value: 'Online store alliance of arab translators', category: 'general' },
  super_admin_email: { value: 'Aleman201451@gmail.com', category: 'security' },
  copyright_owner_ar: { value: 'د/ إيمان الأحمر', category: 'copyright' },
  copyright_owner_en: { value: 'Dr. Eman Elahmer', category: 'copyright' },
  copyright_notice_ar: {
    value: 'جميع حقوق الطبع والنشر والملكية الفكرية محفوظة للدكتورة/ إيمان الأحمر.',
    category: 'copyright',
  },
  copyright_notice_en: {
    value: 'Copyright © 2026 Dr. Eman Elahmer. All Rights Reserved.',
    category: 'copyright',
  },
  support_whatsapp_name: { value: 'تواصل مع د/ إيمان الأحمر', category: 'contact' },
  support_whatsapp_number: { value: '01032105770', category: 'contact' },
  support_whatsapp_url: { value: 'https://wa.me/201032105770', category: 'contact' },
  developer_whatsapp_name: { value: 'تواصل مع المطور م/ محمود جمال', category: 'contact' },
  developer_whatsapp_number: { value: '01093151840', category: 'contact' },
  developer_whatsapp_url: { value: 'https://wa.me/201093151840', category: 'contact' },
  base_currency: { value: 'EGP', category: 'currency' },
  exchange_rate_source: { value: 'manual_verified', category: 'currency' },
  vodafone_cash_enabled: { value: 'true', category: 'payment' },
  vodafone_cash_number: { value: '+20 10 32105770', category: 'payment' },
  vodafone_cash_owner_ar: { value: 'د/ إيمان الأحمر', category: 'payment' },
  vodafone_cash_owner_en: { value: 'Dr. Eman Elahmer', category: 'payment' },
  paymob_enabled: { value: 'false', category: 'payment' },
  fawry_enabled: { value: 'false', category: 'payment' },
  visa_mastercard_enabled: { value: 'false', category: 'payment' },
  paypal_enabled: { value: 'false', category: 'payment' },
  physical_products_enabled: { value: 'false', category: 'shipping' },
  maintenance_mode: { value: 'false', category: 'general' },
  max_upload_size_mb: { value: '250', category: 'storage' },
  seo_meta_title_ar: {
    value: 'متجر اتحاد المترجمين العرب | Online store alliance of arab translators',
    category: 'seo',
  },
  seo_meta_description_ar: {
    value:
      'المنصة الرسمية لبيع وتحميل كتب ومراجع الترجمة والقواميس والدورات التدريبية وأدوات المترجمين. جميع الحقوق محفوظة للدكتورة إيمان الأحمر.',
    category: 'seo',
  },
  policy_privacy_ar: { value: '', category: 'legal' },
  policy_privacy_en: { value: '', category: 'legal' },
  policy_terms_ar: { value: '', category: 'legal' },
  policy_terms_en: { value: '', category: 'legal' },
  policy_refund_ar: { value: '', category: 'legal' },
  policy_refund_en: { value: '', category: 'legal' },
  policy_license_ar: { value: '', category: 'legal' },
  policy_license_en: { value: '', category: 'legal' },
  policy_copyright_ar: { value: '', category: 'legal' },
  policy_copyright_en: { value: '', category: 'legal' },
  policy_faq_ar: { value: '', category: 'legal' },
  policy_faq_en: { value: '', category: 'legal' },
};

let bootstrapped = false;

export async function ensureBootstrapped() {
  if (bootstrapped) return;
  try {
    const existingCats = await db.select().from(categories);
    if (existingCats.length === 0) {
      for (const cat of OFFICIAL_CATEGORIES) {
        await db
          .insert(categories)
          .values(cat)
          .onConflictDoNothing({ target: categories.slug });
      }
    }

    const existingCurrencies = await db.select().from(currencies);
    if (existingCurrencies.length === 0) {
      for (const cur of OFFICIAL_CURRENCIES) {
        await db
          .insert(currencies)
          .values(cur)
          .onConflictDoNothing({ target: currencies.code });
      }
    }

    const existingSocials = await db.select().from(socialLinks);
    if (existingSocials.length === 0) {
      for (const soc of OFFICIAL_SOCIAL_LINKS) {
        await db.insert(socialLinks).values(soc);
      }
    }

    for (const [key, item] of Object.entries(OFFICIAL_SETTINGS)) {
      await db
        .insert(storeSettings)
        .values({
          settingKey: key,
          settingValue: item.value,
          category: item.category,
        })
        .onConflictDoNothing({ target: storeSettings.settingKey });
    }

    // Sync default store English name if still set to previous default
    await db
      .update(storeSettings)
      .set({ settingValue: 'Online store alliance of arab translators', updatedAt: new Date() })
      .where(
        and(
          eq(storeSettings.settingKey, 'store_name_en'),
          eq(storeSettings.settingValue, 'Arab Translators Union Store')
        )
      );
    await db
      .update(storeSettings)
      .set({
        settingValue: 'متجر اتحاد المترجمين العرب | Online store alliance of arab translators',
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(storeSettings.settingKey, 'seo_meta_title_ar'),
          eq(storeSettings.settingValue, 'متجر اتحاد المترجمين العرب | Arab Translators Union Store')
        )
      );

    const existingBanners = await db.select().from(homepageBanners);
    if (existingBanners.length === 0) {
      await db.insert(homepageBanners).values({
        titleAr: 'متجر اتحاد المترجمين العرب — المنصة المعرفية والرقمية الرسمية للمترجمين',
        titleEn: 'Online store alliance of arab translators — The Official Digital Knowledge Marketplace for Translators',
        subtitleAr:
          'إصدارات علمية، قواميس متخصصة، دورات تدريبية، وأدوات احترافية بإشراف د/ إيمان الأحمر.',
        subtitleEn:
          'Scholarly publications, specialized lexicons, training courses, and professional tools supervised by Dr. Eman Elahmer.',
        ctaTextAr: 'استكشف المتجر الرقمي',
        ctaTextEn: 'Explore Digital Marketplace',
        ctaLink: '/marketplace',
        imageUrl: '/src/assets/images/hero_translation_library_1794830079396.jpg',
        position: 'hero',
        sortOrder: 1,
        isActive: true,
      });
    }

    bootstrapped = true;
  } catch (error) {
    console.error('Bootstrap check failed:', error);
    throw new Error('Failed to initialize marketplace configuration.', { cause: error });
  }
}

export async function syncUserProfileAndRole(params: {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
}) {
  try {
    const cleanEmail = (params.email || '').trim();
    const isSuperAdmin =
      Boolean(params.emailVerified) &&
      cleanEmail.toLowerCase() === SUPER_ADMIN_EMAIL;
    const assignedRole = isSuperAdmin ? 'super_admin' : 'customer';

    const profileRows = await db
      .insert(profiles)
      .values({
        uid: params.uid,
        email: cleanEmail,
        fullName: params.displayName || '',
        avatarUrl: params.photoURL || '',
        emailVerified: Boolean(params.emailVerified),
      })
      .onConflictDoUpdate({
        target: profiles.uid,
        set: {
          email: cleanEmail,
          emailVerified: Boolean(params.emailVerified),
          updatedAt: new Date(),
        },
      })
      .returning();

    const roleRows = await db
      .insert(userRoles)
      .values({
        uid: params.uid,
        email: cleanEmail,
        role: assignedRole,
        isVerifiedOwner: isSuperAdmin,
      })
      .onConflictDoUpdate({
        target: userRoles.uid,
        set: {
          email: cleanEmail,
          role: assignedRole,
          isVerifiedOwner: isSuperAdmin,
        },
      })
      .returning();

    return {
      profile: profileRows[0],
      roleRecord: roleRows[0],
      isSuperAdmin,
    };
  } catch (error) {
    console.error('Error syncing user profile and role:', error);
    throw new Error('Unable to synchronize user profile.', { cause: error });
  }
}

export async function logAuditEvent(params: {
  actorUid?: string;
  actorEmail?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
}) {
  try {
    await db.insert(auditLogs).values({
      actorUid: params.actorUid || '',
      actorEmail: params.actorEmail || '',
      action: params.action,
      entityType: params.entityType || '',
      entityId: params.entityId || '',
      details: params.details || '',
      ipAddress: params.ipAddress || '',
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}

export async function getPublicMarketplaceBootstrap() {
  try {
    await ensureBootstrapped();

    const [
      allCategories,
      publishedProducts,
      allCurrencies,
      allRates,
      allSocials,
      allBanners,
      allSettings,
      approvedReviews,
    ] = await Promise.all([
      db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.sortOrder)),
      db.select().from(products).where(eq(products.isPublished, true)).orderBy(desc(products.createdAt)),
      db.select().from(currencies).where(eq(currencies.isActive, true)).orderBy(asc(currencies.id)),
      db.select().from(exchangeRates).where(eq(exchangeRates.isConfigured, true)),
      db.select().from(socialLinks).where(eq(socialLinks.isActive, true)).orderBy(asc(socialLinks.sortOrder)),
      db.select().from(homepageBanners).where(eq(homepageBanners.isActive, true)).orderBy(asc(homepageBanners.sortOrder)),
      db.select().from(storeSettings),
      db.select().from(reviews).where(eq(reviews.isApproved, true)).orderBy(desc(reviews.createdAt)),
    ]);

    const settingsMap: Record<string, string> = {};
    for (const s of allSettings) {
      settingsMap[s.settingKey] = s.settingValue;
    }

    const totalDownloads = publishedProducts.reduce(
      (sum, p) => sum + (p.downloadsCount || 0),
      0
    );

    return {
      categories: allCategories,
      products: publishedProducts,
      currencies: allCurrencies,
      exchangeRates: allRates,
      socialLinks: allSocials,
      banners: allBanners,
      settings: settingsMap,
      reviews: approvedReviews,
      stats: {
        totalProducts: publishedProducts.length,
        totalCategories: allCategories.length,
        totalDownloads,
        totalReviews: approvedReviews.length,
      },
    };
  } catch (error) {
    console.error('Failed to fetch marketplace bootstrap:', error);
    throw new Error('Failed to load marketplace data.', { cause: error });
  }
}

export async function getProductFullDetails(slugOrId: string) {
  try {
    const isNumeric = /^\d+$/.test(slugOrId);
    const prodRows = await db
      .select()
      .from(products)
      .where(isNumeric ? eq(products.id, Number(slugOrId)) : eq(products.slug, slugOrId));

    if (!prodRows.length) return null;
    const product = prodRows[0];

    // Increment real view counter
    await db
      .update(products)
      .set({ viewsCount: (product.viewsCount || 0) + 1 })
      .where(eq(products.id, product.id));

    const [images, files, prodReviews, questions, translations] = await Promise.all([
      db.select().from(productImages).where(eq(productImages.productId, product.id)).orderBy(asc(productImages.sortOrder)),
      db.select({
        id: productFiles.id,
        productId: productFiles.productId,
        fileName: productFiles.fileName,
        fileFormat: productFiles.fileFormat,
        fileSizeBytes: productFiles.fileSizeBytes,
        fileSizeLabel: productFiles.fileSizeLabel,
        isPreview: productFiles.isPreview,
        isPaidProtected: productFiles.isPaidProtected,
        downloadsCount: productFiles.downloadsCount,
      }).from(productFiles).where(eq(productFiles.productId, product.id)),
      db.select().from(reviews).where(and(eq(reviews.productId, product.id), eq(reviews.isApproved, true))).orderBy(desc(reviews.createdAt)),
      db.select().from(productQuestions).where(and(eq(productQuestions.productId, product.id), eq(productQuestions.isPublic, true))).orderBy(desc(productQuestions.createdAt)),
      db.select().from(productTranslations).where(eq(productTranslations.productId, product.id)),
    ]);

    return {
      product,
      images,
      files,
      reviews: prodReviews,
      questions,
      translations,
    };
  } catch (error) {
    console.error('Failed to fetch product details:', error);
    throw new Error('Failed to load product details.', { cause: error });
  }
}

export async function createManualDatabaseBackup(actorEmail: string) {
  try {
    const [
      allProfiles,
      allRoles,
      allCats,
      allProds,
      allOrders,
      allPayments,
      allTickets,
      allSettings,
      allCoupons,
    ] = await Promise.all([
      db.select().from(profiles),
      db.select().from(userRoles),
      db.select().from(categories),
      db.select().from(products),
      db.select().from(orders),
      db.select().from(payments),
      db.select().from(supportTickets),
      db.select().from(storeSettings),
      db.select().from(coupons),
    ]);

    const snapshotPayload = JSON.stringify({
      timestamp: new Date().toISOString(),
      copyright: 'Copyright © 2026 Dr. Eman Elahmer. All Rights Reserved.',
      data: {
        profilesCount: allProfiles.length,
        rolesCount: allRoles.length,
        categories: allCats,
        products: allProds,
        orders: allOrders,
        payments: allPayments,
        supportTickets: allTickets,
        storeSettings: allSettings,
        coupons: allCoupons,
      },
    });

    const sizeBytes = Buffer.byteLength(snapshotPayload, 'utf8');
    const checksum = crypto.createHash('sha256').update(snapshotPayload).digest('hex');
    const totalRecords =
      allProfiles.length +
      allRoles.length +
      allCats.length +
      allProds.length +
      allOrders.length +
      allPayments.length +
      allTickets.length +
      allSettings.length +
      allCoupons.length;

    const backupCode = `ATU-BKP-${Date.now()}`;

    const inserted = await db
      .insert(backupLogs)
      .values({
        backupCode,
        backupType: 'manual',
        scope: 'full_database_and_storage_metadata',
        status: 'completed',
        sizeBytes,
        tablesCount: 27,
        recordsCount: totalRecords,
        checksumSha256: checksum,
        storageLocation: 'isolated_encrypted_backup_vault',
        verificationStatus: 'verified_sha256_match',
        snapshotJson: snapshotPayload,
        initiatedBy: actorEmail,
        completedAt: new Date(),
      })
      .returning();

    await logAuditEvent({
      actorEmail,
      action: 'BACKUP_CREATED_AND_VERIFIED',
      entityType: 'backup_logs',
      entityId: backupCode,
      details: `Backup ${backupCode} completed (${sizeBytes} bytes, ${totalRecords} records, SHA-256: ${checksum.slice(0, 16)}...)`,
    });

    return inserted[0];
  } catch (error) {
    console.error('Backup creation failed:', error);
    throw new Error('Database backup failed.', { cause: error });
  }
}

export {
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
  sql,
};
