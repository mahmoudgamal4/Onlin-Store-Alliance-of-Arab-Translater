import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
} from 'drizzle-orm/pg-core';

// 1. profiles
export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  fullName: text('full_name').default(''),
  phone: text('phone').default(''),
  country: text('country').default('EG'),
  preferredLanguage: text('preferred_language').default('ar'),
  preferredCurrency: text('preferred_currency').default('EGP'),
  avatarUrl: text('avatar_url').default(''),
  emailVerified: boolean('email_verified').default(false),
  deletionRequested: boolean('deletion_requested').default(false),
  deletionReason: text('deletion_reason').default(''),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 2. user_roles
export const userRoles = pgTable('user_roles', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  role: text('role').notNull().default('customer'), // 'super_admin' ONLY for Aleman201451@gmail.com
  isVerifiedOwner: boolean('is_verified_owner').default(false),
  assignedAt: timestamp('assigned_at').defaultNow(),
});

// 3. categories
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en').notNull(),
  descriptionAr: text('description_ar').default(''),
  descriptionEn: text('description_en').default(''),
  parentId: integer('parent_id'),
  iconName: text('icon_name').default('BookOpen'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. products
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  categoryId: integer('category_id').references(() => categories.id),
  sku: text('sku').notNull().unique(),
  titleAr: text('title_ar').notNull(),
  titleEn: text('title_en').notNull(),
  shortDescriptionAr: text('short_description_ar').default(''),
  shortDescriptionEn: text('short_description_en').default(''),
  descriptionAr: text('description_ar').default(''),
  descriptionEn: text('description_en').default(''),
  price: numeric('price', { precision: 12, scale: 2 }).notNull().default('0.00'),
  discountPrice: numeric('discount_price', { precision: 12, scale: 2 }),
  currency: text('currency').notNull().default('EGP'),
  fileFormat: text('file_format').notNull().default('PDF'),
  fileSizeBytes: integer('file_size_bytes').default(0),
  fileSizeLabel: text('file_size_label').default(''),
  isFree: boolean('is_free').default(false),
  isFeatured: boolean('is_featured').default(false),
  isSpecialOffer: boolean('is_special_offer').default(false),
  isPublished: boolean('is_published').default(true),
  availabilityStatus: text('availability_status').default('available'),
  licenseTermsAr: text('license_terms_ar').default(
    'جميع حقوق الطبع والنشر والملكية الفكرية محفوظة للدكتورة/ إيمان الأحمر. يمنع إعادة البيع التجاري أو التوزيع غير المصرح به.'
  ),
  licenseTermsEn: text('license_terms_en').default(
    'Copyright © 2026 Dr. Eman Elahmer. All Rights Reserved. Unauthorized redistribution or commercial resale is strictly prohibited.'
  ),
  previewUrl: text('preview_url').default(''),
  mainImageUrl: text('main_image_url').default(''),
  // Future physical product support (Section 20)
  productType: text('product_type').default('digital'), // 'digital' | 'physical'
  stockQuantity: integer('stock_quantity'),
  weightGrams: integer('weight_grams'),
  dimensionsCm: text('dimensions_cm'),
  shippingEnabled: boolean('shipping_enabled').default(false),
  // Real metrics
  downloadsCount: integer('downloads_count').default(0),
  salesCount: integer('sales_count').default(0),
  viewsCount: integer('views_count').default(0),
  ratingAvg: numeric('rating_avg', { precision: 3, scale: 2 }).default('0.00'),
  reviewsCount: integer('reviews_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 5. product_translations
export const productTranslations = pgTable('product_translations', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
  locale: text('locale').notNull(), // 'ar' | 'en'
  title: text('title').notNull(),
  shortDescription: text('short_description').default(''),
  fullDescription: text('full_description').default(''),
  seoTitle: text('seo_title').default(''),
  seoDescription: text('seo_description').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// 6. product_files
export const productFiles = pgTable('product_files', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
  fileName: text('file_name').notNull(),
  fileFormat: text('file_format').notNull(),
  fileSizeBytes: integer('file_size_bytes').notNull().default(0),
  fileSizeLabel: text('file_size_label').default(''),
  storagePath: text('storage_path').notNull(),
  fileDataUrl: text('file_data_url').default(''),
  isPreview: boolean('is_preview').default(false),
  isPaidProtected: boolean('is_paid_protected').default(true),
  maxDownloadsPerPurchase: integer('max_downloads_per_purchase').default(5),
  downloadsCount: integer('downloads_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// 7. product_images
export const productImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
  imageUrl: text('image_url').notNull(),
  altAr: text('alt_ar').default(''),
  altEn: text('alt_en').default(''),
  isPrimary: boolean('is_primary').default(false),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// 8. orders
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  userUid: text('user_uid').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').default(''),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull().default('0.00'),
  discountAmount: numeric('discount_amount', { precision: 12, scale: 2 }).notNull().default('0.00'),
  shippingFee: numeric('shipping_fee', { precision: 12, scale: 2 }).notNull().default('0.00'),
  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull().default('0.00'),
  currency: text('currency').notNull().default('EGP'),
  couponCode: text('coupon_code').default(''),
  status: text('status').notNull().default('pending'), // 'pending' | 'completed' | 'cancelled' | 'refunded'
  paymentStatus: text('payment_status').notNull().default('unpaid'), // 'unpaid' | 'paid' | 'failed' | 'refunded'
  paymentMethod: text('payment_method').default(''),
  shippingAddress: text('shipping_address').default(''),
  trackingNumber: text('tracking_number').default(''),
  fulfillmentStatus: text('fulfillment_status').default('digital_pending'),
  notes: text('notes').default(''),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 9. order_items
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .references(() => orders.id)
    .notNull(),
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
  titleAr: text('title_ar').notNull(),
  titleEn: text('title_en').notNull(),
  fileFormat: text('file_format').default('PDF'),
  unitPrice: numeric('unit_price', { precision: 12, scale: 2 }).notNull().default('0.00'),
  quantity: integer('quantity').notNull().default(1),
  totalPrice: numeric('total_price', { precision: 12, scale: 2 }).notNull().default('0.00'),
  licenseCode: text('license_code').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// 10. payments
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .references(() => orders.id)
    .notNull(),
  userUid: text('user_uid').notNull(),
  gateway: text('gateway').notNull(), // 'paymob' | 'fawry' | 'visa' | 'mastercard' | 'paypal' | 'free_order'
  transactionReference: text('transaction_reference').default(''),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull().default('0.00'),
  currency: text('currency').notNull().default('EGP'),
  status: text('status').notNull().default('pending'), // 'pending' | 'verified' | 'failed' | 'refunded'
  webhookVerified: boolean('webhook_verified').default(false),
  gatewayResponse: text('gateway_response').default(''),
  refundReason: text('refund_reason').default(''),
  refundedAt: timestamp('refunded_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 11. downloads
export const downloads = pgTable('downloads', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid').notNull(),
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
  orderId: integer('order_id'),
  fileId: integer('file_id'),
  signedToken: text('signed_token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  downloadCount: integer('download_count').default(0),
  maxDownloads: integer('max_downloads').default(5),
  lastDownloadedAt: timestamp('last_downloaded_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 12. download_logs
export const downloadLogs = pgTable('download_logs', {
  id: serial('id').primaryKey(),
  downloadId: integer('download_id'),
  userUid: text('user_uid').notNull(),
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
  fileId: integer('file_id'),
  ipAddress: text('ip_address').default(''),
  userAgent: text('user_agent').default(''),
  status: text('status').notNull().default('authorized'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 13. favorites
export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid').notNull(),
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
  listType: text('list_type').default('favorite'), // 'favorite' | 'wishlist'
  createdAt: timestamp('created_at').defaultNow(),
});

// 14. reviews
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
  userUid: text('user_uid').notNull(),
  reviewerName: text('reviewer_name').notNull(),
  rating: integer('rating').notNull(),
  title: text('title').default(''),
  comment: text('comment').notNull(),
  isVerifiedBuyer: boolean('is_verified_buyer').default(false),
  isApproved: boolean('is_approved').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// 15. product_questions
export const productQuestions = pgTable('product_questions', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
  userUid: text('user_uid').notNull(),
  askerName: text('asker_name').notNull(),
  question: text('question').notNull(),
  answer: text('answer').default(''),
  answeredBy: text('answered_by').default(''),
  isPublic: boolean('is_public').default(true),
  answeredAt: timestamp('answered_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 16. coupons
export const coupons = pgTable('coupons', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  descriptionAr: text('description_ar').default(''),
  descriptionEn: text('description_en').default(''),
  discountType: text('discount_type').notNull().default('percentage'), // 'percentage' | 'fixed'
  discountValue: numeric('discount_value', { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: numeric('min_order_amount', { precision: 10, scale: 2 }).default('0.00'),
  maxUses: integer('max_uses').default(100),
  usedCount: integer('used_count').default(0),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// 17. coupon_redemptions
export const couponRedemptions = pgTable('coupon_redemptions', {
  id: serial('id').primaryKey(),
  couponId: integer('coupon_id')
    .references(() => coupons.id)
    .notNull(),
  userUid: text('user_uid').notNull(),
  orderId: integer('order_id').references(() => orders.id),
  discountApplied: numeric('discount_applied', { precision: 10, scale: 2 }).notNull(),
  redeemedAt: timestamp('redeemed_at').defaultNow(),
});

// 18. notifications
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid').notNull(),
  titleAr: text('title_ar').notNull(),
  titleEn: text('title_en').notNull(),
  messageAr: text('message_ar').notNull(),
  messageEn: text('message_en').notNull(),
  type: text('type').default('system'),
  linkUrl: text('link_url').default(''),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// 19. support_tickets
export const supportTickets = pgTable('support_tickets', {
  id: serial('id').primaryKey(),
  ticketNumber: text('ticket_number').notNull().unique(),
  userUid: text('user_uid').default(''),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').default(''),
  category: text('category').notNull().default('general'),
  priority: text('priority').notNull().default('normal'), // 'low' | 'normal' | 'high' | 'urgent'
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  attachmentName: text('attachment_name').default(''),
  attachmentDataUrl: text('attachment_data_url').default(''),
  status: text('status').notNull().default('open'), // 'open' | 'in_progress' | 'resolved' | 'closed'
  adminResponse: text('admin_response').default(''),
  respondedBy: text('responded_by').default(''),
  respondedAt: timestamp('responded_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 20. newsletter_subscribers
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  fullName: text('full_name').default(''),
  locale: text('locale').default('ar'),
  consentGiven: boolean('consent_given').notNull().default(true),
  isSubscribed: boolean('is_subscribed').notNull().default(true),
  unsubscribedAt: timestamp('unsubscribed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 21. store_settings
export const storeSettings = pgTable('store_settings', {
  id: serial('id').primaryKey(),
  settingKey: text('setting_key').notNull().unique(),
  settingValue: text('setting_value').notNull(),
  category: text('category').default('general'),
  updatedBy: text('updated_by').default('system'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 22. social_links
export const socialLinks = pgTable('social_links', {
  id: serial('id').primaryKey(),
  platform: text('platform').notNull(),
  labelAr: text('label_ar').notNull(),
  labelEn: text('label_en').notNull(),
  url: text('url').notNull(),
  iconName: text('icon_name').default('Globe'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 23. homepage_banners
export const homepageBanners = pgTable('homepage_banners', {
  id: serial('id').primaryKey(),
  titleAr: text('title_ar').notNull(),
  titleEn: text('title_en').notNull(),
  subtitleAr: text('subtitle_ar').default(''),
  subtitleEn: text('subtitle_en').default(''),
  ctaTextAr: text('cta_text_ar').default('تصفح المتجر'),
  ctaTextEn: text('cta_text_en').default('Browse Marketplace'),
  ctaLink: text('cta_link').default('/marketplace'),
  imageUrl: text('image_url').default(''),
  position: text('position').default('hero'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// 24. currencies
export const currencies = pgTable('currencies', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(), // EGP, USD, EUR, SAR, AED
  symbol: text('symbol').notNull(),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en').notNull(),
  isBase: boolean('is_base').default(false),
  isActive: boolean('is_active').default(true),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 25. exchange_rates
export const exchangeRates = pgTable('exchange_rates', {
  id: serial('id').primaryKey(),
  fromCurrency: text('from_currency').notNull(),
  toCurrency: text('to_currency').notNull(),
  rate: numeric('rate', { precision: 14, scale: 6 }),
  source: text('source').default('manual_admin'),
  isConfigured: boolean('is_configured').default(false),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 26. audit_logs
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  actorUid: text('actor_uid').default(''),
  actorEmail: text('actor_email').default(''),
  action: text('action').notNull(),
  entityType: text('entity_type').default(''),
  entityId: text('entity_id').default(''),
  details: text('details').default(''),
  ipAddress: text('ip_address').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// 27. backup_logs
export const backupLogs = pgTable('backup_logs', {
  id: serial('id').primaryKey(),
  backupCode: text('backup_code').notNull().unique(),
  backupType: text('backup_type').notNull().default('manual'), // 'manual' | 'scheduled'
  scope: text('scope').notNull().default('full_database_and_storage'),
  status: text('status').notNull().default('completed'), // 'completed' | 'failed'
  sizeBytes: integer('size_bytes').default(0),
  tablesCount: integer('tables_count').default(27),
  recordsCount: integer('records_count').default(0),
  checksumSha256: text('checksum_sha256').default(''),
  storageLocation: text('storage_location').default('isolated_backup_vault'),
  verificationStatus: text('verification_status').default('verified'),
  snapshotJson: text('snapshot_json').default(''),
  initiatedBy: text('initiated_by').default(''),
  completedAt: timestamp('completed_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});
