# دليل رفع وتشغيل متجر اتحاد المترجمين العرب
# Deployment Guide — Online store alliance of arab translators

جميع حقوق الطبع والنشر والملكية الفكرية محفوظة للدكتورة/ إيمان الأحمر.
Copyright © 2026 Dr. Eman Elahmer. All Rights Reserved.

---

## المتطلبات (Requirements)
- **Node.js 22+** (أو Node.js 20+ مع استخدام `npx tsx server.ts`)
- **قاعدة بيانات PostgreSQL** (مثل قاعدة بيانات مشروعك في Supabase أو Railway أو Render أو VPS)
- **مشروع Supabase** لتخزين الملفات المحمية (`paid-products` و `public-previews`)

---

## خطوات الرفع على أي استضافة (Railway / Render / VPS / cPanel Node.js)

### 1. فك الضغط وإعداد ملف البيئة `.env`
انسخ ملف `.env.example` إلى `.env` وأضف القيم الحقيقية من لوحة التحكم الخاصة بك:

```env
NODE_ENV=production
PORT=3000
APP_URL=https://yourdomain.com

# Supabase
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SECRET_OR_SERVICE_ROLE_KEY

# PostgreSQL (من Supabase -> Connect -> Transaction/Session Pooler أو أي PostgreSQL)
SQL_HOST=aws-0-eu-central-1.pooler.supabase.com
SQL_PORT=5432
SQL_DB_NAME=postgres
SQL_USER=postgres.YOUR_PROJECT_REF
SQL_PASSWORD=YOUR_DB_PASSWORD
SQL_SSL=true
```

> تنبيه أمني: ملف `.env` غير مضمّن داخل هذا الأرشيف حفاظاً على سرية مفاتيحك. أضف المتغيرات في لوحة **Environment Variables** في الاستضافة.

### 2. إعداد قاعدة البيانات (إذا لم تكن قد نفذت السكربتات بعد)
1. نفّذ الملف `supabase/migrations/20260101000000_arab_translators_union_store.sql` في **Supabase SQL Editor** لإنشاء الـ 27 جدولاً وسياسات RLS وحاويات التخزين.
2. نفّذ الملف `supabase/seed.sql` لملء الأقسام الـ 9 والعملات وروابط التواصل وإعدادات فودافون كاش (`+20 10 32105770`).

### 3. تثبيت الحزم وبناء الواجهة وتشغيل الخادم
```bash
npm install
npm run build
NODE_ENV=production npm start
```
*(في حال استخدام Node 20 بدلاً من Node 22، شغّل الخادم عبر: `NODE_ENV=production npx tsx server.ts`)*

### 4. إضافة الدومين في Firebase Auth
من لوحة تحكم Firebase Authentication -> Settings -> **Authorized domains**، أضف الدومين الجديد حتى يعمل تسجيل الدخول عبر Google وحساب المدير العام `Aleman201451@gmail.com`.

### 5. وسيلة الدفع المفعلة حالياً
- **فودافون كاش — د/ إيمان الأحمر:** `+20 10 32105770` (مفعلة وجاهزة للاستلام وتفعيل الرخصة من لوحة التحكم `/admin-dashboard`).
- **بوابات الدفع الآلية (اختياري مستقبلاً):** Paymob / Fawry / PayPal جاهزة عبر نقاط `/api/webhooks/paymob` و`/api/webhooks/fawry` و`/api/webhooks/paypal` بمجرد إضافة مفاتيحها في المتغيرات البيئية.
