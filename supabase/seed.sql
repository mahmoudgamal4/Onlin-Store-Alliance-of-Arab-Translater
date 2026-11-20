INSERT INTO public.categories (slug, name_ar, name_en, description_ar, description_en, icon_name, sort_order, is_active)
VALUES
  ('translation-books-references', 'كتب ومراجع الترجمة', 'Translation Books & References', 'مؤلفات ومراجع علمية وعملية متخصصة في دراسات الترجمة التحريرية والفورية.', 'Specialized academic and practical books and references in translation and interpreting studies.', 'BookOpen', 1, true),
  ('educational-files', 'ملفات تعليمية', 'Educational Files', 'حقائب ومذكرات وأدلة تعليمية منهجية لتطوير مهارات المترجمين والباحثين.', 'Structured educational guides, handouts, and workbooks for translators and researchers.', 'GraduationCap', 2, true),
  ('training-courses', 'دورات تدريبية', 'Training Courses', 'برامج ودورات تدريبية مسجلة ومواد تطبيقية في مجالات الترجمة المتخصصة.', 'Recorded training programs and applied workshops in specialized translation fields.', 'Video', 3, true),
  ('dictionaries-lexicons', 'قواميس ومعاجم', 'Dictionaries & Lexicons', 'مسارد مصطلحات وقواميس ثنائية ومتعددة اللغات في التخصصات القانونية والطبية والتقنية.', 'Bilingual and multilingual glossaries and lexicons for legal, medical, and technical domains.', 'Languages', 4, true),
  ('translator-software-tools', 'برامج وأدوات المترجمين', 'Translator Software & Tools', 'أدوات مساعدة وإضافات تقنية وقواعد بيانات مصطلحية لرفع إنتاجية المترجم.', 'Productivity tools, technical utilities, and terminology databases for professional translators.', 'Cpu', 5, true),
  ('pdf-documents', 'ملفات PDF', 'PDF Publications', 'إصدارات رقمية بصيغة PDF جاهزة للقراءة والطباعة المرجعية.', 'Digital PDF publications formatted for scholarly reading and reference.', 'FileText', 6, true),
  ('ready-templates-forms', 'قوالب ونماذج جاهزة', 'Ready Templates & Forms', 'نماذج عقود ترجمة، فواتير، شهادات اعتماد، وقوالب وثائق رسمية قابلة للتعديل.', 'Editable translation contracts, invoices, certification templates, and official document forms.', 'FileSpreadsheet', 7, true),
  ('free-products', 'منتجات مجانية', 'Free Downloads', 'إصدارات وملفات إثرائية مجانية مقدمة من متجر اتحاد المترجمين العرب.', 'Complimentary educational publications and resources provided by Online store alliance of arab translators.', 'Download', 8, true),
  ('miscellaneous-products', 'منتجات متنوعة', 'Miscellaneous Products', 'إصدارات رقمية ومواد معرفية متنوعة تخدم مجتمع المترجمين واللغويين.', 'Diverse digital resources and scholarly materials serving translators and linguists.', 'Layers', 9, true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.currencies (code, symbol, name_ar, name_en, is_base, is_active)
VALUES
  ('EGP', 'ج.م', 'الجنيه المصري', 'Egyptian Pound', true, true),
  ('USD', '$', 'الدولار الأمريكي', 'US Dollar', false, true),
  ('EUR', '€', 'اليورو الأوروبي', 'Euro', false, true),
  ('SAR', 'ر.س', 'الريال السعودي', 'Saudi Riyal', false, true),
  ('AED', 'د.إ', 'الدرهم الإماراتي', 'UAE Dirham', false, true)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.social_links (platform, label_ar, label_en, url, icon_name, sort_order, is_active)
SELECT v.platform, v.label_ar, v.label_en, v.url, v.icon_name, v.sort_order, true
FROM (
  VALUES
    ('facebook', 'الصفحة الرسمية على فيسبوك', 'Official Facebook Page', 'https://www.facebook.com/share/1EsrHvUQKk/', 'Facebook', 1),
    ('instagram', 'الحساب الرسمي على إنستغرام', 'Official Instagram', 'https://www.instagram.com/nour112338?igsh=dXR6OGEzbXBxMGFm', 'Instagram', 2),
    ('facebook_community', 'مجتمع اتحاد المترجمين العرب على فيسبوك', 'Facebook Translators Community', 'https://www.facebook.com/share/g/1AVfo3xCDz/', 'Users', 3),
    ('tiktok', 'الحساب الرسمي على تيك توك', 'Official TikTok', 'https://www.tiktok.com/@emanelahmer1?_r=1&_t=ZS-98sd4DxSbmi', 'Music2', 4),
    ('youtube', 'القناة الرسمية على يوتيوب', 'Official YouTube Channel', 'https://youtube.com/@emananwarelahmar9059?si=6UbiPWyZZC6MLLCM', 'Youtube', 5)
) AS v(platform, label_ar, label_en, url, icon_name, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM public.social_links s WHERE s.platform = v.platform
);

INSERT INTO public.store_settings (setting_key, setting_value, category)
VALUES
  ('store_name_ar', 'متجر اتحاد المترجمين العرب', 'general'),
  ('store_name_en', 'Online store alliance of arab translators', 'general'),
  ('super_admin_email', 'Aleman201451@gmail.com', 'security'),
  ('copyright_owner_ar', 'د/ إيمان الأحمر', 'copyright'),
  ('copyright_owner_en', 'Dr. Eman Elahmer', 'copyright'),
  ('copyright_notice_ar', 'جميع حقوق الطبع والنشر والملكية الفكرية محفوظة للدكتورة/ إيمان الأحمر.', 'copyright'),
  ('copyright_notice_en', 'Copyright © 2026 Dr. Eman Elahmer. All Rights Reserved.', 'copyright'),
  ('support_whatsapp_name', 'تواصل مع د/ إيمان الأحمر', 'contact'),
  ('support_whatsapp_number', '01032105770', 'contact'),
  ('support_whatsapp_url', 'https://wa.me/201032105770', 'contact'),
  ('developer_whatsapp_name', 'تواصل مع المطور م/ محمود جمال', 'contact'),
  ('developer_whatsapp_number', '01093151840', 'contact'),
  ('developer_whatsapp_url', 'https://wa.me/201093151840', 'contact'),
  ('base_currency', 'EGP', 'currency'),
  ('exchange_rate_source', 'manual_verified', 'currency'),
  ('vodafone_cash_enabled', 'true', 'payment'),
  ('vodafone_cash_number', '+20 10 32105770', 'payment'),
  ('vodafone_cash_owner_ar', 'د/ إيمان الأحمر', 'payment'),
  ('vodafone_cash_owner_en', 'Dr. Eman Elahmer', 'payment'),
  ('paymob_enabled', 'false', 'payment'),
  ('fawry_enabled', 'false', 'payment'),
  ('visa_mastercard_enabled', 'false', 'payment'),
  ('paypal_enabled', 'false', 'payment'),
  ('physical_products_enabled', 'false', 'shipping'),
  ('maintenance_mode', 'false', 'general'),
  ('max_upload_size_mb', '250', 'storage'),
  ('seo_meta_title_ar', 'متجر اتحاد المترجمين العرب | Online store alliance of arab translators', 'seo'),
  ('seo_meta_description_ar', 'المنصة الرسمية لبيع وتحميل كتب ومراجع الترجمة والقواميس والدورات التدريبية وأدوات المترجمين. جميع الحقوق محفوظة للدكتورة إيمان الأحمر.', 'seo'),
  ('policy_privacy_ar', '', 'legal'),
  ('policy_privacy_en', '', 'legal'),
  ('policy_terms_ar', '', 'legal'),
  ('policy_terms_en', '', 'legal'),
  ('policy_refund_ar', '', 'legal'),
  ('policy_refund_en', '', 'legal'),
  ('policy_license_ar', '', 'legal'),
  ('policy_license_en', '', 'legal'),
  ('policy_copyright_ar', '', 'legal'),
  ('policy_copyright_en', '', 'legal')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO public.homepage_banners (title_ar, title_en, subtitle_ar, subtitle_en, cta_text_ar, cta_text_en, cta_link, image_url, position, sort_order, is_active)
SELECT
  'متجر اتحاد المترجمين العرب — المنصة المعرفية والرقمية الرسمية للمترجمين',
  'Online store alliance of arab translators — The Official Digital Knowledge Marketplace for Translators',
  'إصدارات علمية، قواميس متخصصة، دورات تدريبية، وأدوات احترافية بإشراف د/ إيمان الأحمر.',
  'Scholarly publications, specialized lexicons, training courses, and professional tools supervised by Dr. Eman Elahmer.',
  'استكشف المتجر الرقمي',
  'Explore Digital Marketplace',
  '/marketplace',
  '/src/assets/images/hero_translation_library_1794830079396.jpg',
  'hero',
  1,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.homepage_banners WHERE position = 'hero'
);
