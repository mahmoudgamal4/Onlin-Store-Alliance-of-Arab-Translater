CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    LOWER(auth.jwt() ->> 'email') = 'aleman201451@gmail.com'
    AND COALESCE((auth.jwt() ->> 'email_verified')::boolean, true),
    false
  );
$$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id SERIAL PRIMARY KEY,
  uid TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  country TEXT DEFAULT 'EG',
  preferred_language TEXT DEFAULT 'ar',
  preferred_currency TEXT DEFAULT 'EGP',
  avatar_url TEXT DEFAULT '',
  email_verified BOOLEAN DEFAULT false,
  deletion_requested BOOLEAN DEFAULT false,
  deletion_reason TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id SERIAL PRIMARY KEY,
  uid TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('super_admin', 'customer', 'visitor')),
  is_verified_owner BOOLEAN DEFAULT false,
  assigned_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  parent_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
  icon_name TEXT DEFAULT 'BookOpen',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
  sku TEXT NOT NULL UNIQUE,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  short_description_ar TEXT DEFAULT '',
  short_description_en TEXT DEFAULT '',
  description_ar TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  discount_price NUMERIC(12, 2),
  currency TEXT NOT NULL DEFAULT 'EGP',
  file_format TEXT NOT NULL DEFAULT 'PDF',
  file_size_bytes INTEGER DEFAULT 0,
  file_size_label TEXT DEFAULT '',
  is_free BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_special_offer BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  availability_status TEXT DEFAULT 'available',
  license_terms_ar TEXT DEFAULT 'جميع حقوق الطبع والنشر والملكية الفكرية محفوظة للدكتورة/ إيمان الأحمر. يمنع إعادة البيع التجاري أو التوزيع غير المصرح به.',
  license_terms_en TEXT DEFAULT 'Copyright © 2026 Dr. Eman Elahmer. All Rights Reserved. Unauthorized redistribution or commercial resale is strictly prohibited.',
  preview_url TEXT DEFAULT '',
  main_image_url TEXT DEFAULT '',
  product_type TEXT DEFAULT 'digital',
  stock_quantity INTEGER,
  weight_grams INTEGER,
  dimensions_cm TEXT,
  shipping_enabled BOOLEAN DEFAULT false,
  downloads_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  rating_avg NUMERIC(3, 2) DEFAULT 0.00,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_translations (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT DEFAULT '',
  full_description TEXT DEFAULT '',
  seo_title TEXT DEFAULT '',
  seo_description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_files (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_format TEXT NOT NULL,
  file_size_bytes INTEGER NOT NULL DEFAULT 0,
  file_size_label TEXT DEFAULT '',
  storage_path TEXT NOT NULL,
  file_data_url TEXT DEFAULT '',
  is_preview BOOLEAN DEFAULT false,
  is_paid_protected BOOLEAN DEFAULT true,
  max_downloads_per_purchase INTEGER DEFAULT 5,
  downloads_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_ar TEXT DEFAULT '',
  alt_en TEXT DEFAULT '',
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id SERIAL PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  user_uid TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT DEFAULT '',
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'EGP',
  coupon_code TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  payment_method TEXT DEFAULT '',
  shipping_address TEXT DEFAULT '',
  tracking_number TEXT DEFAULT '',
  fulfillment_status TEXT DEFAULT 'digital_pending',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  file_format TEXT DEFAULT 'PDF',
  unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  license_code TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_uid TEXT NOT NULL,
  gateway TEXT NOT NULL,
  transaction_reference TEXT DEFAULT '',
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'EGP',
  status TEXT NOT NULL DEFAULT 'pending',
  webhook_verified BOOLEAN DEFAULT false,
  gateway_response TEXT DEFAULT '',
  refund_reason TEXT DEFAULT '',
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.downloads (
  id SERIAL PRIMARY KEY,
  user_uid TEXT NOT NULL,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  order_id INTEGER REFERENCES public.orders(id) ON DELETE SET NULL,
  file_id INTEGER REFERENCES public.product_files(id) ON DELETE SET NULL,
  signed_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  download_count INTEGER DEFAULT 0,
  max_downloads INTEGER DEFAULT 5,
  last_downloaded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.download_logs (
  id SERIAL PRIMARY KEY,
  download_id INTEGER REFERENCES public.downloads(id) ON DELETE SET NULL,
  user_uid TEXT NOT NULL,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  file_id INTEGER,
  ip_address TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'authorized',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.favorites (
  id SERIAL PRIMARY KEY,
  user_uid TEXT NOT NULL,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  list_type TEXT DEFAULT 'favorite',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_uid TEXT NOT NULL,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT DEFAULT '',
  comment TEXT NOT NULL,
  is_verified_buyer BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_questions (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_uid TEXT NOT NULL,
  asker_name TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT DEFAULT '',
  answered_by TEXT DEFAULT '',
  is_public BOOLEAN DEFAULT true,
  answered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.coupons (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description_ar TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC(10, 2) NOT NULL,
  min_order_amount NUMERIC(10, 2) DEFAULT 0.00,
  max_uses INTEGER DEFAULT 100,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
  id SERIAL PRIMARY KEY,
  coupon_id INTEGER NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_uid TEXT NOT NULL,
  order_id INTEGER REFERENCES public.orders(id) ON DELETE SET NULL,
  discount_applied NUMERIC(10, 2) NOT NULL,
  redeemed_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id SERIAL PRIMARY KEY,
  user_uid TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  message_ar TEXT NOT NULL,
  message_en TEXT NOT NULL,
  type TEXT DEFAULT 'system',
  link_url TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id SERIAL PRIMARY KEY,
  ticket_number TEXT NOT NULL UNIQUE,
  user_uid TEXT DEFAULT '',
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'normal',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  attachment_name TEXT DEFAULT '',
  attachment_data_url TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',
  admin_response TEXT DEFAULT '',
  responded_by TEXT DEFAULT '',
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT DEFAULT '',
  locale TEXT DEFAULT 'ar',
  consent_given BOOLEAN NOT NULL DEFAULT true,
  is_subscribed BOOLEAN NOT NULL DEFAULT true,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.store_settings (
  id SERIAL PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  updated_by TEXT DEFAULT 'system',
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.social_links (
  id SERIAL PRIMARY KEY,
  platform TEXT NOT NULL,
  label_ar TEXT NOT NULL,
  label_en TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Globe',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.homepage_banners (
  id SERIAL PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  subtitle_ar TEXT DEFAULT '',
  subtitle_en TEXT DEFAULT '',
  cta_text_ar TEXT DEFAULT 'تصفح المتجر',
  cta_text_en TEXT DEFAULT 'Browse Marketplace',
  cta_link TEXT DEFAULT '/marketplace',
  image_url TEXT DEFAULT '',
  position TEXT DEFAULT 'hero',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.currencies (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  symbol TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  is_base BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.exchange_rates (
  id SERIAL PRIMARY KEY,
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  rate NUMERIC(14, 6),
  source TEXT DEFAULT 'manual_admin',
  is_configured BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id SERIAL PRIMARY KEY,
  actor_uid TEXT DEFAULT '',
  actor_email TEXT DEFAULT '',
  action TEXT NOT NULL,
  entity_type TEXT DEFAULT '',
  entity_id TEXT DEFAULT '',
  details TEXT DEFAULT '',
  ip_address TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.backup_logs (
  id SERIAL PRIMARY KEY,
  backup_code TEXT NOT NULL UNIQUE,
  backup_type TEXT NOT NULL DEFAULT 'manual',
  scope TEXT NOT NULL DEFAULT 'full_database_and_storage',
  status TEXT NOT NULL DEFAULT 'completed',
  size_bytes INTEGER DEFAULT 0,
  tables_count INTEGER DEFAULT 27,
  records_count INTEGER DEFAULT 0,
  checksum_sha256 TEXT DEFAULT '',
  storage_location TEXT DEFAULT 'isolated_backup_vault',
  verification_status TEXT DEFAULT 'verified',
  snapshot_json TEXT DEFAULT '',
  initiated_by TEXT DEFAULT '',
  completed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products(is_published);
CREATE INDEX IF NOT EXISTS idx_orders_user_uid ON public.orders(user_uid);
CREATE INDEX IF NOT EXISTS idx_downloads_user_uid ON public.downloads(user_uid);
CREATE INDEX IF NOT EXISTS idx_favorites_user_uid ON public.favorites(user_uid);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON public.support_tickets(user_uid);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active categories" ON public.categories;
CREATE POLICY "Public read active categories" ON public.categories FOR SELECT USING (is_active = true OR public.is_super_admin());

DROP POLICY IF EXISTS "Public read published products" ON public.products;
CREATE POLICY "Public read published products" ON public.products FOR SELECT USING (is_published = true OR public.is_super_admin());

DROP POLICY IF EXISTS "Public read product translations" ON public.product_translations;
CREATE POLICY "Public read product translations" ON public.product_translations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read product images" ON public.product_images;
CREATE POLICY "Public read product images" ON public.product_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read approved reviews" ON public.reviews;
CREATE POLICY "Public read approved reviews" ON public.reviews FOR SELECT USING (is_approved = true OR public.is_super_admin());

DROP POLICY IF EXISTS "Public read public questions" ON public.product_questions;
CREATE POLICY "Public read public questions" ON public.product_questions FOR SELECT USING (is_public = true OR public.is_super_admin());

DROP POLICY IF EXISTS "Public read store settings" ON public.store_settings;
CREATE POLICY "Public read store settings" ON public.store_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read social links" ON public.social_links;
CREATE POLICY "Public read social links" ON public.social_links FOR SELECT USING (is_active = true OR public.is_super_admin());

DROP POLICY IF EXISTS "Public read homepage banners" ON public.homepage_banners;
CREATE POLICY "Public read homepage banners" ON public.homepage_banners FOR SELECT USING (is_active = true OR public.is_super_admin());

DROP POLICY IF EXISTS "Public read currencies" ON public.currencies;
CREATE POLICY "Public read currencies" ON public.currencies FOR SELECT USING (is_active = true OR public.is_super_admin());

DROP POLICY IF EXISTS "Public read configured exchange rates" ON public.exchange_rates;
CREATE POLICY "Public read configured exchange rates" ON public.exchange_rates FOR SELECT USING (is_configured = true OR public.is_super_admin());

DROP POLICY IF EXISTS "Users read own role" ON public.user_roles;
CREATE POLICY "Users read own role" ON public.user_roles FOR SELECT USING (auth.uid()::text = uid OR public.is_super_admin());

DROP POLICY IF EXISTS "Only Super Admin mutates roles" ON public.user_roles;
CREATE POLICY "Only Super Admin mutates roles" ON public.user_roles FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid()::text = uid OR public.is_super_admin());

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid()::text = uid OR public.is_super_admin());

DROP POLICY IF EXISTS "Super Admin full access to product_files" ON public.product_files;
CREATE POLICY "Super Admin full access to product_files" ON public.product_files FOR ALL USING (public.is_super_admin());

DROP POLICY IF EXISTS "Authorized buyers or free files read access" ON public.product_files;
CREATE POLICY "Authorized buyers or free files read access" ON public.product_files FOR SELECT USING (
  is_paid_protected = false
  OR public.is_super_admin()
  OR EXISTS (
    SELECT 1 FROM public.orders o
    JOIN public.order_items oi ON oi.order_id = o.id
    WHERE o.user_uid = auth.uid()::text
      AND o.payment_status = 'paid'
      AND oi.product_id = product_files.product_id
  )
);

DROP POLICY IF EXISTS "Users read own orders" ON public.orders;
CREATE POLICY "Users read own orders" ON public.orders FOR SELECT USING (auth.uid()::text = user_uid OR public.is_super_admin());

DROP POLICY IF EXISTS "Users create own orders" ON public.orders;
CREATE POLICY "Users create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid()::text = user_uid OR public.is_super_admin());

DROP POLICY IF EXISTS "Super Admin manage orders" ON public.orders;
CREATE POLICY "Super Admin manage orders" ON public.orders FOR ALL USING (public.is_super_admin());

DROP POLICY IF EXISTS "Users read own downloads" ON public.downloads;
CREATE POLICY "Users read own downloads" ON public.downloads FOR SELECT USING (auth.uid()::text = user_uid OR public.is_super_admin());

DROP POLICY IF EXISTS "Users manage own favorites" ON public.favorites;
CREATE POLICY "Users manage own favorites" ON public.favorites FOR ALL USING (auth.uid()::text = user_uid OR public.is_super_admin());

DROP POLICY IF EXISTS "Users read own notifications" ON public.notifications;
CREATE POLICY "Users read own notifications" ON public.notifications FOR SELECT USING (auth.uid()::text = user_uid OR public.is_super_admin());

DROP POLICY IF EXISTS "Users read own support tickets" ON public.support_tickets;
CREATE POLICY "Users read own support tickets" ON public.support_tickets FOR SELECT USING (auth.uid()::text = user_uid OR public.is_super_admin());

DROP POLICY IF EXISTS "Anyone can submit support ticket" ON public.support_tickets;
CREATE POLICY "Anyone can submit support ticket" ON public.support_tickets FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Super Admin full control products" ON public.products;
CREATE POLICY "Super Admin full control products" ON public.products FOR ALL USING (public.is_super_admin());

DROP POLICY IF EXISTS "Super Admin full control categories" ON public.categories;
CREATE POLICY "Super Admin full control categories" ON public.categories FOR ALL USING (public.is_super_admin());

DROP POLICY IF EXISTS "Super Admin full control coupons" ON public.coupons;
CREATE POLICY "Super Admin full control coupons" ON public.coupons FOR ALL USING (public.is_super_admin());

DROP POLICY IF EXISTS "Super Admin full control settings" ON public.store_settings;
CREATE POLICY "Super Admin full control settings" ON public.store_settings FOR ALL USING (public.is_super_admin());

DROP POLICY IF EXISTS "Super Admin full control backups" ON public.backup_logs;
CREATE POLICY "Super Admin full control backups" ON public.backup_logs FOR ALL USING (public.is_super_admin());

DROP POLICY IF EXISTS "Super Admin full control audits" ON public.audit_logs;
CREATE POLICY "Super Admin full control audits" ON public.audit_logs FOR ALL USING (public.is_super_admin());

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('paid-products', 'paid-products', false),
  ('public-previews', 'public-previews', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Super Admin full control on storage objects" ON storage.objects;
CREATE POLICY "Super Admin full control on storage objects"
ON storage.objects FOR ALL
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Public read on public-previews bucket" ON storage.objects;
CREATE POLICY "Public read on public-previews bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-previews');
