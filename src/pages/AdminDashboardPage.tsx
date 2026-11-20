import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  LayoutDashboard,
  Package,
  UploadCloud,
  FolderTree,
  ShoppingBag,
  CreditCard,
  Users,
  Star,
  HelpCircle,
  Tag,
  Megaphone,
  Image as ImageIcon,
  FileText,
  Share2,
  LifeBuoy,
  BarChart3,
  DollarSign,
  Download,
  Coins,
  Settings,
  Mail,
  Search,
  Scale,
  DatabaseBackup,
  Lock,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Pencil,
  RotateCcw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useStore, SUPER_ADMIN_EMAIL } from '../context/StoreContext.tsx';

type AdminTabId =
  | 'overview'
  | 'products'
  | 'files'
  | 'categories'
  | 'orders'
  | 'payments'
  | 'customers'
  | 'reviews'
  | 'questions'
  | 'coupons'
  | 'marketing'
  | 'banners'
  | 'pages'
  | 'social'
  | 'tickets'
  | 'sales_reports'
  | 'revenue_reports'
  | 'download_analytics'
  | 'currencies'
  | 'payment_config'
  | 'email_settings'
  | 'seo'
  | 'copyright'
  | 'backup'
  | 'security';

const ADMIN_SECTIONS: Array<{ id: AdminTabId; labelAr: string; labelEn: string; icon: any }> = [
  { id: 'overview', labelAr: '1. نظرة عامة وإحصائيات', labelEn: '1. Overview', icon: LayoutDashboard },
  { id: 'products', labelAr: '2. إدارة المنتجات الرقمية', labelEn: '2. Products', icon: Package },
  { id: 'files', labelAr: '3. إدارة ورفع الملفات', labelEn: '3. Files & Storage', icon: UploadCloud },
  { id: 'categories', labelAr: '4. الأقسام والتصنيفات', labelEn: '4. Categories', icon: FolderTree },
  { id: 'orders', labelAr: '5. الطلبات والتسليم', labelEn: '5. Orders', icon: ShoppingBag },
  { id: 'payments', labelAr: '6. المدفوعات والاسترداد', labelEn: '6. Payments', icon: CreditCard },
  { id: 'customers', labelAr: '7. العملاء والحسابات', labelEn: '7. Customers', icon: Users },
  { id: 'reviews', labelAr: '8. التقييمات والمراجعات', labelEn: '8. Reviews', icon: Star },
  { id: 'questions', labelAr: '9. أسئلة المنتجات', labelEn: '9. Questions', icon: HelpCircle },
  { id: 'coupons', labelAr: '10. الكوبونات والخصومات', labelEn: '10. Coupons', icon: Tag },
  { id: 'marketing', labelAr: '11. التسويق والنشرة البريدية', labelEn: '11. Marketing', icon: Megaphone },
  { id: 'banners', labelAr: '12. بنرات الصفحة الرئيسية', labelEn: '12. Homepage Banners', icon: ImageIcon },
  { id: 'pages', labelAr: '13. الصفحات والسياسات', labelEn: '13. Pages & Content', icon: FileText },
  { id: 'social', labelAr: '14. منصات التواصل الاجتماعي', labelEn: '14. Social Media', icon: Share2 },
  { id: 'tickets', labelAr: '15. تذاكر الدعم الفني', labelEn: '15. Support Tickets', icon: LifeBuoy },
  { id: 'sales_reports', labelAr: '16. تقارير المبيعات', labelEn: '16. Sales Reports', icon: BarChart3 },
  { id: 'revenue_reports', labelAr: '17. التقارير المالية', labelEn: '17. Revenue Reports', icon: DollarSign },
  { id: 'download_analytics', labelAr: '18. تحليلات التحميل', labelEn: '18. Download Analytics', icon: Download },
  { id: 'currencies', labelAr: '19. العملات وأسعار الصرف', labelEn: '19. Currency Settings', icon: Coins },
  { id: 'payment_config', labelAr: '20. بوابات الدفع والشحن', labelEn: '20. Payment Config', icon: Settings },
  { id: 'email_settings', labelAr: '21. إعدادات البريد الإلكتروني', labelEn: '21. Email Settings', icon: Mail },
  { id: 'seo', labelAr: '22. تحسين محركات البحث SEO', labelEn: '22. SEO Management', icon: Search },
  { id: 'copyright', labelAr: '23. إعدادات الملكية الفكرية', labelEn: '23. Copyright Settings', icon: Scale },
  { id: 'backup', labelAr: '24. النسخ الاحتياطي والاستعادة', labelEn: '24. Backup & Recovery', icon: DatabaseBackup },
  { id: 'security', labelAr: '25. الأمان وسجل التدقيق', labelEn: '25. Security & Audit Logs', icon: Lock },
];

export const AdminDashboardPage: React.FC = () => {
  const {
    lang,
    user,
    isSuperAdmin,
    loginWithGoogle,
    loginWithEmail,
    resendVerificationEmail,
    refreshAuthSession,
    logout,
    authFetch,
    refreshBootstrap,
    showToast,
  } = useStore();

  const [adminEmailInput, setAdminEmailInput] = useState('Aleman201451@gmail.com');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminAuthBusy, setAdminAuthBusy] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<AdminTabId>('overview');
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Product Form State (Supports Create & Edit)
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [prodTitleAr, setProdTitleAr] = useState('');
  const [prodTitleEn, setProdTitleEn] = useState('');
  const [prodCategoryId, setProdCategoryId] = useState('');
  const [prodPrice, setProdPrice] = useState('0');
  const [prodDiscountPrice, setProdDiscountPrice] = useState('');
  const [prodFormat, setProdFormat] = useState('PDF');
  const [prodSizeLabel, setProdSizeLabel] = useState('');
  const [prodSizeBytes, setProdSizeBytes] = useState(0);
  const [prodDescAr, setProdDescAr] = useState('');
  const [prodDescEn, setProdDescEn] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodPreviewUrl, setProdPreviewUrl] = useState('');
  const [prodIsFree, setProdIsFree] = useState(false);
  const [prodIsFeatured, setProdIsFeatured] = useState(true);
  const [prodIsSpecialOffer, setProdIsSpecialOffer] = useState(false);
  const [prodIsPublished, setProdIsPublished] = useState(true);
  const [prodFileName, setProdFileName] = useState('');
  const [prodFileDataUrl, setProdFileDataUrl] = useState('');

  // Standalone File Upload State
  const [fileUploadProductId, setFileUploadProductId] = useState('');
  const [standaloneFileName, setStandaloneFileName] = useState('');
  const [standaloneFileFormat, setStandaloneFileFormat] = useState('PDF');
  const [standaloneFileSizeBytes, setStandaloneFileSizeBytes] = useState(0);
  const [standaloneFileSizeLabel, setStandaloneFileSizeLabel] = useState('');
  const [standaloneFileDataUrl, setStandaloneFileDataUrl] = useState('');
  const [standaloneFileIsPreview, setStandaloneFileIsPreview] = useState(false);

  // Category Form State
  const [catNameAr, setCatNameAr] = useState('');
  const [catNameEn, setCatNameEn] = useState('');
  const [catDescAr, setCatDescAr] = useState('');
  const [catDescEn, setCatDescEn] = useState('');

  // Coupon Form State
  const [couponCode, setCouponCode] = useState('');
  const [couponValue, setCouponValue] = useState('15');
  const [couponType, setCouponType] = useState('percentage');

  // Banner Form State
  const [bannerTitleAr, setBannerTitleAr] = useState('');
  const [bannerTitleEn, setBannerTitleEn] = useState('');
  const [bannerSubtitleAr, setBannerSubtitleAr] = useState('');
  const [bannerSubtitleEn, setBannerSubtitleEn] = useState('');
  const [bannerCtaTextAr, setBannerCtaTextAr] = useState('استكشف المتجر');
  const [bannerCtaTextEn, setBannerCtaTextEn] = useState('Explore Store');
  const [bannerCtaLink, setBannerCtaLink] = useState('/marketplace');
  const [bannerImageUrl, setBannerImageUrl] = useState('');

  // Social Link Form State
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialLabelAr, setNewSocialLabelAr] = useState('');
  const [newSocialLabelEn, setNewSocialLabelEn] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [socialEdits, setSocialEdits] = useState<
    Record<number, { labelAr: string; labelEn: string; url: string }>
  >({});

  // Refund inline reason state
  const [refundOrderId, setRefundOrderId] = useState<number | null>(null);
  const [refundReason, setRefundReason] = useState('');

  // Exchange Rate Form State
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [exchangeRateVal, setExchangeRateVal] = useState('');

  // Ticket & Question Response State
  const [ticketReplyMap, setTicketReplyMap] = useState<Record<number, string>>({});
  const [questionReplyMap, setQuestionReplyMap] = useState<Record<number, string>>({});

  // Settings map edit
  const [settingsEdit, setSettingsEdit] = useState<Record<string, string>>({});

  const loadDashboard = async () => {
    if (!isSuperAdmin) return;
    setLoading(true);
    try {
      const res = await authFetch('/api/admin/dashboard');
      if (res.ok) {
        const data = await res.json();
        setAdminData(data);
        const sMap: Record<string, string> = {};
        for (const s of data.settings || []) {
          sMap[s.settingKey] = s.settingValue;
        }
        setSettingsEdit(sMap);
        const socMap: Record<number, { labelAr: string; labelEn: string; url: string }> = {};
        for (const soc of data.socialLinks || []) {
          socMap[soc.id] = { labelAr: soc.labelAr, labelEn: soc.labelEn, url: soc.url };
        }
        setSocialEdits(socMap);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      loadDashboard();
    }
  }, [isSuperAdmin]);

  // Strict RBAC Gate: ONLY verified Aleman201451@gmail.com may access Super Admin
  if (!user || !isSuperAdmin) {
    const isAdminEmailUnverified =
      Boolean(user) &&
      (user?.email || '').toLowerCase() === SUPER_ADMIN_EMAIL &&
      !user?.emailVerified;

    const handleAdminGoogleLogin = async () => {
      setAdminAuthError('');
      setAdminAuthBusy(true);
      try {
        await loginWithGoogle();
      } catch (err: any) {
        const msg =
          err?.message || (lang === 'ar' ? 'تعذر تسجيل الدخول عبر Google' : 'Google sign-in failed');
        setAdminAuthError(msg);
        showToast(msg, 'error');
      } finally {
        setAdminAuthBusy(false);
      }
    };

    const handleAdminEmailLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setAdminAuthError('');
      setAdminAuthBusy(true);
      try {
        await loginWithEmail(adminEmailInput.trim(), adminPasswordInput);
      } catch (err: any) {
        const msg =
          err?.message || (lang === 'ar' ? 'تعذر تسجيل الدخول' : 'Sign-in failed');
        setAdminAuthError(msg);
        showToast(msg, 'error');
      } finally {
        setAdminAuthBusy(false);
      }
    };

    const handleResendVerify = async () => {
      setAdminAuthError('');
      setAdminAuthBusy(true);
      try {
        await resendVerificationEmail();
      } catch (err: any) {
        const msg = err?.message || 'Failed to resend verification email';
        setAdminAuthError(msg);
        showToast(msg, 'error');
      } finally {
        setAdminAuthBusy(false);
      }
    };

    const handleRefreshVerify = async () => {
      setAdminAuthError('');
      setAdminAuthBusy(true);
      try {
        await refreshAuthSession();
      } catch (err: any) {
        const msg = err?.message || 'Failed to refresh session';
        setAdminAuthError(msg);
        showToast(msg, 'error');
      } finally {
        setAdminAuthBusy(false);
      }
    };

    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-6 text-center">
          <ShieldAlert className="w-14 h-14 text-amber-600 mx-auto" />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {lang === 'ar'
                ? 'منطقة الإدارة العليا المحمية — متجر اتحاد المترجمين العرب'
                : 'Restricted Super Administrator Portal'}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {lang === 'ar'
                ? 'وفقاً لسياسة الأمان الصارمة على الخادم (Server-Side Authorization & Role Protection)، يقتصر الدخول إلى لوحة التحكم الشاملة حصرياً على حساب المدير العام المعتمد والموثق:'
                : 'In compliance with strict server-side RBAC authorization, access to the Super Administrator Dashboard is exclusively restricted to the verified owner account:'}
            </p>
            <p className="text-sm font-mono font-bold text-amber-700 dark:text-amber-400">
              Aleman201451@gmail.com
            </p>
          </div>

          {adminAuthError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs leading-relaxed">
              {adminAuthError}
            </div>
          )}

          {isAdminEmailUnverified ? (
            <div className="p-5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs space-y-3 text-start">
              <p className="font-bold text-amber-900 dark:text-amber-200">
                {lang === 'ar'
                  ? 'تم تسجيل الدخول ببريد الإدارة (Aleman201451@gmail.com) لكن البريد غير موثّق بعد!'
                  : 'Signed in as Aleman201451@gmail.com, but email address is not verified yet!'}
              </p>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                {lang === 'ar'
                  ? 'لحماية لوحة التحكم، يشترط الخادم تأكيد ملكية البريد الإلكتروني. افتح صندوق الوارد لبريد Aleman201451@gmail.com واضغط رابط التفعيل، ثم اضغط "تحديث الصلاحيات" — أو اضغط زر Google أدناه للتوثيق الفوري التلقائي.'
                  : 'For security, the server requires a verified email. Open Aleman201451@gmail.com inbox, click the verification link, then click Refresh — or sign in via Google below for instant verification.'}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  disabled={adminAuthBusy}
                  onClick={handleRefreshVerify}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg"
                >
                  {lang === 'ar' ? 'لقد فعّلت البريد — تحديث الصلاحيات الآن' : 'I Verified — Refresh Access'}
                </button>
                <button
                  type="button"
                  disabled={adminAuthBusy}
                  onClick={handleResendVerify}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg"
                >
                  {lang === 'ar' ? 'إعادة إرسال رابط التفعيل' : 'Resend Verification Email'}
                </button>
              </div>
            </div>
          ) : (
            user && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <p>
                  {lang === 'ar' ? 'الحساب المسجل حالياً:' : 'Currently signed in as:'}{' '}
                  <span className="font-mono font-bold">{user.email}</span>
                </p>
                <p className="text-slate-500">
                  {lang === 'ar'
                    ? 'صلاحية هذا الحساب: عميل (Customer) — يرجى تسجيل الخروج أو اختيار حساب الإدارة المعتمد (Aleman201451@gmail.com).'
                    : 'Role: Customer — Please sign out or switch to the authorized admin account (Aleman201451@gmail.com).'}
                </p>
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-1.5 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  {lang === 'ar' ? 'تسجيل الخروج من الحساب الحالي' : 'Sign Out Current Account'}
                </button>
              </div>
            )
          )}

          <div className="space-y-4 pt-2">
            <button
              type="button"
              disabled={adminAuthBusy}
              onClick={handleAdminGoogleLogin}
              className="w-full px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {lang === 'ar'
                  ? 'تسجيل الدخول بحساب الإدارة المعتمد عبر Google (يفتح اختيار الحساب)'
                  : 'Sign In with Authorized Admin Google Account'}
              </span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
              <span className="shrink mx-3 text-[11px] text-slate-400">
                {lang === 'ar' ? 'أو الدخول بالبريد وكلمة المرور' : 'or sign in with email & password'}
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
            </div>

            <form onSubmit={handleAdminEmailLogin} className="space-y-3 text-start">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="email"
                  required
                  value={adminEmailInput}
                  onChange={(e) => setAdminEmailInput(e.target.value)}
                  placeholder="Aleman201451@gmail.com"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono"
                />
                <input
                  type="password"
                  required
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="submit"
                  disabled={adminAuthBusy}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
                >
                  {adminAuthBusy
                    ? lang === 'ar'
                      ? 'جاري التحقق...'
                      : 'Verifying...'
                    : lang === 'ar'
                    ? 'دخول الإدارة بالبريد وكلمة المرور'
                    : 'Admin Email Sign In'}
                </button>
                <div className="flex items-center gap-3 text-[11px]">
                  <Link to="/register" className="text-amber-700 dark:text-amber-400 font-semibold hover:underline">
                    {lang === 'ar' ? 'إنشاء كلمة مرور لأول مرة' : 'First-time Register'}
                  </Link>
                  <Link to="/" className="text-slate-500 hover:underline">
                    {lang === 'ar' ? 'العودة إلى المتجر' : 'Return to Storefront'}
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // File drag/drop or input handler for Product Upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProdFileName(file.name);
    setProdSizeBytes(file.size);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    setProdSizeLabel(`${sizeMb} MB`);
    const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
    setProdFormat(ext);

    const reader = new FileReader();
    reader.onload = () => {
      setProdFileDataUrl(String(reader.result || ''));
    };
    reader.readAsDataURL(file);
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProdTitleAr('');
    setProdTitleEn('');
    setProdCategoryId('');
    setProdPrice('0');
    setProdDiscountPrice('');
    setProdFormat('PDF');
    setProdSizeLabel('');
    setProdSizeBytes(0);
    setProdDescAr('');
    setProdDescEn('');
    setProdImageUrl('');
    setProdPreviewUrl('');
    setProdIsFree(false);
    setProdIsFeatured(true);
    setProdIsSpecialOffer(false);
    setProdIsPublished(true);
    setProdFileName('');
    setProdFileDataUrl('');
  };

  const startEditProduct = (p: any) => {
    setEditingProductId(p.id);
    setProdTitleAr(p.titleAr || '');
    setProdTitleEn(p.titleEn || '');
    setProdCategoryId(p.categoryId ? String(p.categoryId) : '');
    setProdPrice(String(p.price ?? '0'));
    setProdDiscountPrice(p.discountPrice ? String(p.discountPrice) : '');
    setProdFormat(p.fileFormat || 'PDF');
    setProdSizeLabel(p.fileSizeLabel || '');
    setProdSizeBytes(Number(p.fileSizeBytes || 0));
    setProdDescAr(p.descriptionAr || '');
    setProdDescEn(p.descriptionEn || '');
    setProdImageUrl(p.mainImageUrl || '');
    setProdPreviewUrl(p.previewUrl || '');
    setProdIsFree(Boolean(p.isFree));
    setProdIsFeatured(Boolean(p.isFeatured));
    setProdIsSpecialOffer(Boolean(p.isSpecialOffer));
    setProdIsPublished(p.isPublished !== false);
    setProdFileName('');
    setProdFileDataUrl('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      titleAr: prodTitleAr,
      titleEn: prodTitleEn || prodTitleAr,
      categoryId: prodCategoryId ? Number(prodCategoryId) : null,
      price: prodIsFree ? '0.00' : prodPrice,
      discountPrice: prodDiscountPrice || null,
      fileFormat: prodFormat,
      fileSizeBytes: prodSizeBytes,
      fileSizeLabel: prodSizeLabel,
      descriptionAr: prodDescAr,
      descriptionEn: prodDescEn || prodDescAr,
      shortDescriptionAr: prodDescAr.slice(0, 140),
      shortDescriptionEn: (prodDescEn || prodDescAr).slice(0, 140),
      mainImageUrl: prodImageUrl,
      previewUrl: prodPreviewUrl,
      isFree: prodIsFree,
      isFeatured: prodIsFeatured,
      isSpecialOffer: prodIsSpecialOffer,
      isPublished: prodIsPublished,
      fileName: prodFileName,
      fileDataUrl: prodFileDataUrl,
    };

    const url = editingProductId
      ? `/api/admin/products/${editingProductId}`
      : '/api/admin/products';
    const method = editingProductId ? 'PUT' : 'POST';

    const res = await authFetch(url, {
      method,
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      // If editing and a new file was chosen, also upload the file attachment
      if (editingProductId && prodFileDataUrl && prodFileName) {
        await authFetch('/api/admin/files', {
          method: 'POST',
          body: JSON.stringify({
            productId: editingProductId,
            fileName: prodFileName,
            fileFormat: prodFormat,
            fileSizeBytes: prodSizeBytes,
            fileSizeLabel: prodSizeLabel,
            fileDataUrl: prodFileDataUrl,
            isPreview: false,
            isPaidProtected: !prodIsFree,
          }),
        });
      }
      showToast(
        editingProductId
          ? 'تم تحديث بيانات المنتج بنجاح'
          : 'تم نشر المنتج الرقمي وحفظ الملف بنجاح',
        'success'
      );
      resetProductForm();
      await loadDashboard();
      await refreshBootstrap();
    } else {
      showToast(editingProductId ? 'تعذر تحديث المنتج' : 'تعذر إنشاء المنتج', 'error');
    }
  };

  const handleStandaloneFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStandaloneFileName(file.name);
    setStandaloneFileSizeBytes(file.size);
    setStandaloneFileSizeLabel(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    setStandaloneFileFormat(file.name.split('.').pop()?.toUpperCase() || 'PDF');
    const reader = new FileReader();
    reader.onload = () => setStandaloneFileDataUrl(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const handleUploadStandaloneFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileUploadProductId || !standaloneFileName) {
      showToast('يرجى اختيار المنتج والملف أولاً', 'error');
      return;
    }
    const res = await authFetch('/api/admin/files', {
      method: 'POST',
      body: JSON.stringify({
        productId: Number(fileUploadProductId),
        fileName: standaloneFileName,
        fileFormat: standaloneFileFormat,
        fileSizeBytes: standaloneFileSizeBytes,
        fileSizeLabel: standaloneFileSizeLabel,
        fileDataUrl: standaloneFileDataUrl,
        isPreview: standaloneFileIsPreview,
        isPaidProtected: !standaloneFileIsPreview,
      }),
    });
    if (res.ok) {
      showToast('تم رفع الملف وربطه بالمنتج بنجاح', 'success');
      setStandaloneFileName('');
      setStandaloneFileDataUrl('');
      setStandaloneFileSizeBytes(0);
      setStandaloneFileSizeLabel('');
      await loadDashboard();
    } else {
      showToast('تعذر رفع الملف', 'error');
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    const res = await authFetch(`/api/admin/files/${fileId}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('تم حذف الملف بنجاح', 'info');
      await loadDashboard();
    }
  };

  const handleDeleteProduct = async (id: number) => {
    const res = await authFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('تم حذف المنتج', 'info');
      if (editingProductId === id) resetProductForm();
      await loadDashboard();
      await refreshBootstrap();
    }
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await authFetch('/api/admin/banners', {
      method: 'POST',
      body: JSON.stringify({
        titleAr: bannerTitleAr,
        titleEn: bannerTitleEn || bannerTitleAr,
        subtitleAr: bannerSubtitleAr,
        subtitleEn: bannerSubtitleEn || bannerSubtitleAr,
        ctaTextAr: bannerCtaTextAr,
        ctaTextEn: bannerCtaTextEn,
        ctaLink: bannerCtaLink,
        imageUrl: bannerImageUrl,
      }),
    });
    if (res.ok) {
      showToast('تمت إضافة البانر بنجاح', 'success');
      setBannerTitleAr('');
      setBannerTitleEn('');
      setBannerSubtitleAr('');
      setBannerSubtitleEn('');
      setBannerImageUrl('');
      await loadDashboard();
      await refreshBootstrap();
    }
  };

  const handleDeleteBanner = async (id: number) => {
    const res = await authFetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('تم حذف البانر', 'info');
      await loadDashboard();
      await refreshBootstrap();
    }
  };

  const handleCreateSocialLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await authFetch('/api/admin/social-links', {
      method: 'POST',
      body: JSON.stringify({
        platform: newSocialPlatform,
        labelAr: newSocialLabelAr,
        labelEn: newSocialLabelEn || newSocialLabelAr,
        url: newSocialUrl,
      }),
    });
    if (res.ok) {
      showToast('تمت إضافة رابط التواصل بنجاح', 'success');
      setNewSocialPlatform('');
      setNewSocialLabelAr('');
      setNewSocialLabelEn('');
      setNewSocialUrl('');
      await loadDashboard();
      await refreshBootstrap();
    }
  };

  const handleUpdateSocialLink = async (id: number) => {
    const edit = socialEdits[id];
    if (!edit) return;
    const res = await authFetch(`/api/admin/social-links/${id}`, {
      method: 'PUT',
      body: JSON.stringify(edit),
    });
    if (res.ok) {
      showToast('تم تحديث رابط التواصل', 'success');
      await loadDashboard();
      await refreshBootstrap();
    }
  };

  const handleDeleteSocialLink = async (id: number) => {
    const res = await authFetch(`/api/admin/social-links/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('تم حذف الرابط', 'info');
      await loadDashboard();
      await refreshBootstrap();
    }
  };

  const handleRefundOrder = async (orderId: number) => {
    const res = await authFetch(`/api/admin/orders/${orderId}/refund`, {
      method: 'POST',
      body: JSON.stringify({ reason: refundReason || 'استرداد بناءً على طلب العميل' }),
    });
    if (res.ok) {
      showToast('تم تنفيذ الاسترداد وإلغاء روابط التحميل بنجاح', 'info');
      setRefundOrderId(null);
      setRefundReason('');
      await loadDashboard();
    } else {
      showToast('تعذر تنفيذ الاسترداد', 'error');
    }
  };

  const handleToggleMaintenance = async () => {
    const nextVal = settingsEdit.maintenance_mode === 'true' ? 'false' : 'true';
    const updated = { ...settingsEdit, maintenance_mode: nextVal };
    setSettingsEdit(updated);
    const res = await authFetch('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify({ settings: { maintenance_mode: nextVal } }),
    });
    if (res.ok) {
      showToast(
        nextVal === 'true'
          ? 'تم تفعيل وضع الصيانة للمتجر العام (الإدارة تظل متاحة لك)'
          : 'تم إيقاف وضع الصيانة وإعادة فتح المتجر للزوار',
        'success'
      );
      await loadDashboard();
      await refreshBootstrap();
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await authFetch('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify({
        nameAr: catNameAr,
        nameEn: catNameEn,
        descriptionAr: catDescAr,
        descriptionEn: catDescEn,
      }),
    });
    if (res.ok) {
      setCatNameAr('');
      setCatNameEn('');
      setCatDescAr('');
      setCatDescEn('');
      showToast('تم إضافة القسم الجديد بنجاح', 'success');
      await loadDashboard();
      await refreshBootstrap();
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await authFetch('/api/admin/coupons', {
      method: 'POST',
      body: JSON.stringify({
        code: couponCode,
        discountType: couponType,
        discountValue: couponValue,
      }),
    });
    if (res.ok) {
      setCouponCode('');
      showToast('تم إنشاء كود الخصم بنجاح', 'success');
      loadDashboard();
    }
  };

  const handleSaveSettings = async () => {
    const res = await authFetch('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify({ settings: settingsEdit }),
    });
    if (res.ok) {
      showToast('تم حفظ إعدادات المتجر بنجاح', 'success');
      await loadDashboard();
      await refreshBootstrap();
    }
  };

  const handleConfigureExchangeRate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await authFetch('/api/admin/exchange-rates', {
      method: 'PUT',
      body: JSON.stringify({
        fromCurrency: 'EGP',
        toCurrency: targetCurrency,
        rate: exchangeRateVal,
      }),
    });
    if (res.ok) {
      setExchangeRateVal('');
      showToast('تم تحديث سعر الصرف الفعلي', 'success');
      await loadDashboard();
      await refreshBootstrap();
    }
  };

  const handleTriggerBackup = async () => {
    const res = await authFetch('/api/admin/backups/create', { method: 'POST' });
    if (res.ok) {
      showToast('تم إنشاء النسخة الاحتياطية والتحقق من بصمة SHA-256 بنجاح', 'success');
      loadDashboard();
    }
  };

  const metrics = adminData?.metrics || {
    totalProducts: 0,
    totalCategories: 9,
    totalOrders: 0,
    paidOrdersCount: 0,
    confirmedRevenue: 0,
    totalCustomers: 0,
    totalDownloads: 0,
    openTicketsCount: 0,
    completedBackupsCount: 0,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
        {/* Top Workspace Header */}
        <div className="mb-6 p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>لوحة تحكم الإدارة العليا · Super Administrator Workspace</span>
            </div>
            <h1 className="text-xl font-bold mt-1">
              متجر اتحاد المترجمين العرب — إدارة د/ إيمان الأحمر ({SUPER_ADMIN_EMAIL})
            </h1>
          </div>
          <button
            type="button"
            onClick={loadDashboard}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl flex items-center gap-2 border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>تحديث البيانات الحية</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 25-Section Navigation Sidebar */}
          <aside className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 max-h-[80vh] overflow-y-auto space-y-1">
            {ADMIN_SECTIONS.map((sec) => {
              const IconComp = sec.icon;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveTab(sec.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-start transition-colors ${
                    activeTab === sec.id
                      ? 'bg-slate-900 text-white dark:bg-amber-600'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  <span className="truncate">{lang === 'ar' ? sec.labelAr : sec.labelEn}</span>
                </button>
              );
            })}
          </aside>

          {/* Main Admin Viewport */}
          <div className="lg:col-span-9 space-y-6">
            {/* 1. OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <span className="text-xs text-slate-500 block">إجمالي المنتجات المنشورة</span>
                    <span className="text-2xl font-bold font-mono tabular-nums mt-1 block">
                      {metrics.totalProducts}
                    </span>
                  </div>
                  <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <span className="text-xs text-slate-500 block">الطلبات الفعلية</span>
                    <span className="text-2xl font-bold font-mono tabular-nums mt-1 block">
                      {metrics.totalOrders}
                    </span>
                  </div>
                  <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <span className="text-xs text-slate-500 block">الإيرادات المؤكدة (EGP)</span>
                    <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600 mt-1 block">
                      {metrics.confirmedRevenue.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <span className="text-xs text-slate-500 block">إجمالي التحميلات</span>
                    <span className="text-2xl font-bold font-mono tabular-nums mt-1 block">
                      {metrics.totalDownloads}
                    </span>
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                  <h2 className="text-base font-bold">
                    إجراءات الإدارة السريعة (جميع الإحصائيات حقيقية من قاعدة البيانات)
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('products')}
                      className="px-4 py-2.5 bg-slate-900 dark:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة ورفع منتج رقمي جديد</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('backup')}
                      className="px-4 py-2.5 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl"
                    >
                      إنشاء نسخة احتياطية موثقة
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('tickets')}
                      className="px-4 py-2.5 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl"
                    >
                      تذاكر الدعم الفني المفتوحة ({metrics.openTicketsCount})
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PRODUCTS MANAGEMENT (Create + Edit + Delete) */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <form
                  onSubmit={handleSaveProduct}
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-bold">
                      {editingProductId
                        ? `تعديل المنتج الرقمي (#${editingProductId})`
                        : 'إضافة منتج رقمي جديد ورفع الملف المحمّي'}
                    </h2>
                    {editingProductId && (
                      <button
                        type="button"
                        onClick={resetProductForm}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700"
                      >
                        إلغاء التعديل
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">عنوان المنتج بالعربية *</label>
                      <input
                        type="text"
                        required
                        value={prodTitleAr}
                        onChange={(e) => setProdTitleAr(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">عنوان المنتج بالإنجليزية *</label>
                      <input
                        type="text"
                        required
                        value={prodTitleEn}
                        onChange={(e) => setProdTitleEn(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">القسم</label>
                      <select
                        value={prodCategoryId}
                        onChange={(e) => setProdCategoryId(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                      >
                        <option value="">اختر القسم...</option>
                        {(adminData?.categories || []).map((c: any) => (
                          <option key={c.id} value={c.id}>
                            {c.nameAr}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">صيغة الملف الرقمي</label>
                      <select
                        value={prodFormat}
                        onChange={(e) => setProdFormat(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                      >
                        {['PDF', 'DOCX', 'DOC', 'XLSX', 'XLS', 'PPTX', 'PPT', 'ZIP', 'RAR', 'MP3', 'WAV', 'MP4', 'PNG', 'JPG', 'SVG', 'EPUB'].map(
                          (f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">السعر الفعلي (EGP)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">سعر الخصم الاختياري (EGP)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={prodDiscountPrice}
                        onChange={(e) => setProdDiscountPrice(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">رابط صورة الغلاف (اختياري)</label>
                      <input
                        type="text"
                        value={prodImageUrl}
                        onChange={(e) => setProdImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">رابط معاينة مجانية (اختياري)</label>
                      <input
                        type="text"
                        value={prodPreviewUrl}
                        onChange={(e) => setProdPreviewUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                      />
                    </div>
                  </div>

                  {/* Drag & Drop File Upload Box */}
                  <div className="p-5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center space-y-2">
                    <UploadCloud className="w-8 h-8 text-amber-600 mx-auto" />
                    <label className="block text-xs font-bold cursor-pointer text-amber-700 dark:text-amber-400">
                      <span>
                        {prodFileName
                          ? `تم اختيار الملف: ${prodFileName} (${prodSizeLabel})`
                          : editingProductId
                          ? 'اختياري: ارفع ملفاً جديداً لإضافته لهذا المنتج'
                          : 'اسحب وأفلت الملف الرقمي هنا أو اضغط لاختيار ملف من جهازك'}
                      </span>
                      <input type="file" onChange={handleFileSelect} className="hidden" />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <textarea
                      rows={3}
                      value={prodDescAr}
                      onChange={(e) => setProdDescAr(e.target.value)}
                      placeholder="الوصف التفصيلي بالعربية..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                    />
                    <textarea
                      rows={3}
                      value={prodDescEn}
                      onChange={(e) => setProdDescEn(e.target.value)}
                      placeholder="Detailed English description..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-xs">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={prodIsFree}
                        onChange={(e) => setProdIsFree(e.target.checked)}
                      />
                      <span>منتج مجاني متاح للتحميل المباشر</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={prodIsFeatured}
                        onChange={(e) => setProdIsFeatured(e.target.checked)}
                      />
                      <span>عرض في المنتجات المميزة</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={prodIsSpecialOffer}
                        onChange={(e) => setProdIsSpecialOffer(e.target.checked)}
                      />
                      <span>عرض خاص</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={prodIsPublished}
                        onChange={(e) => setProdIsPublished(e.target.checked)}
                      />
                      <span>منشور ومتاح في المتجر</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-slate-900 dark:bg-amber-600 text-white text-xs font-bold rounded-xl"
                  >
                    {editingProductId ? 'حفظ التعديلات على المنتج' : 'حفظ ونشر المنتج في المتجر'}
                  </button>
                </form>

                {/* Existing Products Table */}
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                  <h3 className="text-sm font-bold mb-4">
                    المنتجات المسجلة حالياً ({adminData?.products?.length || 0})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-start border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                          <th className="py-2 px-3 text-start">المنتج</th>
                          <th className="py-2 px-3 text-start">الصيغة</th>
                          <th className="py-2 px-3 text-start">السعر</th>
                          <th className="py-2 px-3 text-start">التحميلات</th>
                          <th className="py-2 px-3 text-end">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {(adminData?.products || []).map((p: any) => (
                          <tr key={p.id}>
                            <td className="py-2.5 px-3 font-semibold">
                              {p.titleAr}{' '}
                              {!p.isPublished && (
                                <span className="text-[11px] text-amber-600 font-normal">(مسودة)</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-mono">{p.fileFormat}</td>
                            <td className="py-2.5 px-3 font-mono tabular-nums">
                              {p.isFree ? 'مجاني' : `${p.price} ${p.currency}`}
                            </td>
                            <td className="py-2.5 px-3 font-mono tabular-nums">{p.downloadsCount}</td>
                            <td className="py-2.5 px-3 text-end space-x-3 space-x-reverse">
                              <button
                                type="button"
                                onClick={() => startEditProduct(p)}
                                className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 hover:underline font-semibold"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>تعديل</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(p.id)}
                                className="inline-flex items-center gap-1 text-rose-600 hover:underline font-semibold"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. DEDICATED FILE & SUPABASE STORAGE MANAGER */}
            {activeTab === 'files' && (
              <div className="space-y-6">
                <form
                  onSubmit={handleUploadStandaloneFile}
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4"
                >
                  <h2 className="text-base font-bold">
                    رفع وإرفاق ملف رقمي لمنتج قائم (مخزن Supabase الخاص paid-products)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">اختر المنتج *</label>
                      <select
                        required
                        value={fileUploadProductId}
                        onChange={(e) => setFileUploadProductId(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                      >
                        <option value="">اختر المنتج المراد إرفاق الملف له...</option>
                        {(adminData?.products || []).map((p: any) => (
                          <option key={p.id} value={p.id}>
                            #{p.id} — {p.titleAr}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 text-xs pb-2">
                        <input
                          type="checkbox"
                          checked={standaloneFileIsPreview}
                          onChange={(e) => setStandaloneFileIsPreview(e.target.checked)}
                        />
                        <span>ملف معاينة مجانية (يُرفع في public-previews بدلاً من paid-products)</span>
                      </label>
                    </div>
                  </div>
                  <div className="p-5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center space-y-2">
                    <UploadCloud className="w-8 h-8 text-amber-600 mx-auto" />
                    <label className="block text-xs font-bold cursor-pointer text-amber-700 dark:text-amber-400">
                      <span>
                        {standaloneFileName
                          ? `الملف المختار: ${standaloneFileName} (${standaloneFileSizeLabel})`
                          : 'اضغط لاختيار ملف رقمي لرفعه إلى التخزين المحمي'}
                      </span>
                      <input type="file" onChange={handleStandaloneFileSelect} className="hidden" />
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-900 dark:bg-amber-600 text-white text-xs font-bold rounded-xl"
                  >
                    رفع وحفظ الملف
                  </button>
                </form>

                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold">
                    مخزن الملفات المرفوعة حالياً ({adminData?.files?.length || 0})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-start border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                          <th className="py-2 px-3 text-start">اسم الملف</th>
                          <th className="py-2 px-3 text-start">رقم المنتج</th>
                          <th className="py-2 px-3 text-start">الصيغة والحجم</th>
                          <th className="py-2 px-3 text-start">مسار التخزين</th>
                          <th className="py-2 px-3 text-end">حذف</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {(adminData?.files || []).map((f: any) => (
                          <tr key={f.id}>
                            <td className="py-2.5 px-3 font-semibold">{f.fileName}</td>
                            <td className="py-2.5 px-3 font-mono">#{f.productId}</td>
                            <td className="py-2.5 px-3 font-mono tabular-nums">
                              {f.fileFormat} · {f.fileSizeLabel || `${f.fileSizeBytes} B`}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 max-w-xs truncate">
                              {f.storagePath}
                            </td>
                            <td className="py-2.5 px-3 text-end">
                              <button
                                type="button"
                                onClick={() => handleDeleteFile(f.id)}
                                className="text-rose-600 hover:underline font-semibold"
                              >
                                حذف
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 4. CATEGORIES */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <form
                  onSubmit={handleCreateCategory}
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4"
                >
                  <h2 className="text-base font-bold">إضافة قسم جديد</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      value={catNameAr}
                      onChange={(e) => setCatNameAr(e.target.value)}
                      placeholder="اسم القسم بالعربية"
                      className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                    />
                    <input
                      type="text"
                      required
                      value={catNameEn}
                      onChange={(e) => setCatNameEn(e.target.value)}
                      placeholder="Category Name in English"
                      className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 dark:bg-amber-600 text-white text-xs font-bold rounded-xl"
                  >
                    إضافة القسم
                  </button>
                </form>

                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                  <h3 className="text-sm font-bold">الأقسام الحالية ({adminData?.categories?.length || 0})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(adminData?.categories || []).map((c: any) => (
                      <div
                        key={c.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold">{c.nameAr}</p>
                          <p className="text-slate-500">{c.nameEn}</p>
                        </div>
                        <span className="font-mono text-slate-400">{c.slug}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5 & 6. ORDERS & PAYMENTS & REFUNDS */}
            {(activeTab === 'orders' || activeTab === 'payments' || activeTab === 'sales_reports' || activeTab === 'revenue_reports') && (
              <div className="space-y-6">
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                  <h2 className="text-base font-bold">
                    إدارة الطلبات والمدفوعات والاسترداد ({adminData?.orders?.length || 0})
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-start border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                          <th className="py-2.5 px-3 text-start">رقم الطلب</th>
                          <th className="py-2.5 px-3 text-start">العميل</th>
                          <th className="py-2.5 px-3 text-start">الإجمالي</th>
                          <th className="py-2.5 px-3 text-start">حالة الدفع</th>
                          <th className="py-2.5 px-3 text-end">إجراءات الإدارة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {(adminData?.orders || []).map((o: any) => (
                          <React.Fragment key={o.id}>
                            <tr>
                              <td className="py-3 px-3 font-mono font-bold">{o.orderNumber}</td>
                              <td className="py-3 px-3">
                                {o.customerName} ({o.customerEmail})
                              </td>
                              <td className="py-3 px-3 font-mono tabular-nums font-bold">
                                {o.totalAmount} {o.currency}
                              </td>
                              <td className="py-3 px-3 font-mono">{o.paymentStatus}</td>
                              <td className="py-3 px-3 text-end space-x-2 space-x-reverse">
                                {o.paymentStatus !== 'paid' && o.paymentStatus !== 'refunded' && (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      await authFetch(`/api/admin/orders/${o.id}/status`, {
                                        method: 'PUT',
                                        body: JSON.stringify({
                                          status: 'completed',
                                          paymentStatus: 'paid',
                                        }),
                                      });
                                      showToast('تم تأكيد الدفع وتفعيل روابط التحميل للعميل', 'success');
                                      loadDashboard();
                                    }}
                                    className="px-3 py-1 bg-emerald-700 text-white rounded-md font-semibold"
                                  >
                                    تأكيد السداد وتفعيل الرخصة
                                  </button>
                                )}
                                {o.paymentStatus === 'paid' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRefundOrderId(refundOrderId === o.id ? null : o.id);
                                      setRefundReason('');
                                    }}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-rose-700 text-white rounded-md font-semibold"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>استرداد وإلغاء الرخصة</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                            {refundOrderId === o.id && (
                              <tr className="bg-rose-50/60 dark:bg-rose-950/20">
                                <td colSpan={5} className="p-3">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <input
                                      type="text"
                                      value={refundReason}
                                      onChange={(e) => setRefundReason(e.target.value)}
                                      placeholder="اكتب سبب الاسترداد (مثال: طلب العميل قبل التحميل)..."
                                      className="flex-1 min-w-[220px] px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRefundOrder(o.id)}
                                      className="px-4 py-1.5 bg-rose-700 text-white text-xs font-bold rounded-lg"
                                    >
                                      تأكيد الاسترداد نهائياً
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setRefundOrderId(null)}
                                      className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 text-xs rounded-lg"
                                    >
                                      إلغاء
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {activeTab === 'payments' && (
                  <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                    <h3 className="text-sm font-bold">
                      سجل معاملات الدفع ({adminData?.payments?.length || 0})
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-start border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                            <th className="py-2 px-3 text-start">المرجع</th>
                            <th className="py-2 px-3 text-start">البوابة</th>
                            <th className="py-2 px-3 text-start">المبلغ</th>
                            <th className="py-2 px-3 text-start">التحقق</th>
                            <th className="py-2 px-3 text-start">الحالة</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                          {(adminData?.payments || []).map((pay: any) => (
                            <tr key={pay.id}>
                              <td className="py-2.5 px-3 font-mono">{pay.transactionReference}</td>
                              <td className="py-2.5 px-3 font-mono">{pay.gateway}</td>
                              <td className="py-2.5 px-3 font-mono tabular-nums">
                                {pay.amount} {pay.currency}
                              </td>
                              <td className="py-2.5 px-3">
                                {pay.webhookVerified ? 'موثق' : 'يدوي / بانتظار التحقق'}
                              </td>
                              <td className="py-2.5 px-3 font-mono">{pay.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 7. CUSTOMERS */}
            {activeTab === 'customers' && (
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                <h2 className="text-base font-bold">
                  سجل العملاء والصلاحيات ({adminData?.customers?.length || 0})
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                        <th className="py-2 px-3 text-start">البريد الإلكتروني</th>
                        <th className="py-2 px-3 text-start">الاسم</th>
                        <th className="py-2 px-3 text-start">الصلاحية</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {(adminData?.customers || []).map((c: any) => (
                        <tr key={c.id}>
                          <td className="py-2.5 px-3 font-mono">{c.email}</td>
                          <td className="py-2.5 px-3">{c.fullName || '—'}</td>
                          <td className="py-2.5 px-3 font-mono">
                            {c.email.toLowerCase() === SUPER_ADMIN_EMAIL ? 'super_admin' : 'customer'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 8. REVIEWS MODERATION */}
            {activeTab === 'reviews' && (
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                <h2 className="text-base font-bold">
                  إدارة ومراجعة تقييمات العملاء ({adminData?.reviews?.length || 0})
                </h2>
                {(adminData?.reviews || []).length === 0 ? (
                  <p className="text-xs text-slate-500">لا توجد تقييمات مسجلة حتى الآن.</p>
                ) : (
                  <div className="space-y-3">
                    {(adminData?.reviews || []).map((rev: any) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-start justify-between gap-4 text-xs"
                      >
                        <div className="space-y-1 max-w-2xl">
                          <div className="flex items-center gap-2 font-bold">
                            <span>{rev.reviewerName}</span>
                            <span className="font-mono text-amber-600">{rev.rating}/5</span>
                            <span className="text-slate-400 font-mono">منتج #{rev.productId}</span>
                            <span className={rev.isApproved ? 'text-emerald-600' : 'text-rose-600'}>
                              {rev.isApproved ? 'ظاهر في المتجر' : 'مخفي'}
                            </span>
                          </div>
                          {rev.title && <p className="font-semibold">{rev.title}</p>}
                          <p className="text-slate-600 dark:text-slate-400">{rev.comment}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={async () => {
                              await authFetch(`/api/admin/reviews/${rev.id}`, {
                                method: 'PUT',
                                body: JSON.stringify({ isApproved: !rev.isApproved }),
                              });
                              showToast(
                                rev.isApproved ? 'تم إخفاء التقييم' : 'تمت الموافقة وإظهار التقييم',
                                'success'
                              );
                              await loadDashboard();
                              await refreshBootstrap();
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold"
                          >
                            {rev.isApproved ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            <span>{rev.isApproved ? 'إخفاء' : 'إظهار'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await authFetch(`/api/admin/reviews/${rev.id}`, { method: 'DELETE' });
                              showToast('تم حذف التقييم', 'info');
                              await loadDashboard();
                              await refreshBootstrap();
                            }}
                            className="px-3 py-1.5 bg-rose-700 text-white rounded-lg font-semibold"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 9. QUESTIONS */}
            {activeTab === 'questions' && (
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                <h2 className="text-base font-bold">
                  أسئلة واستفسارات المنتجات ({adminData?.questions?.length || 0})
                </h2>
                {(adminData?.questions || []).map((q: any) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                  >
                    <p className="font-bold">
                      {q.askerName}: {q.question}
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={questionReplyMap[q.id] ?? q.answer ?? ''}
                        onChange={(e) =>
                          setQuestionReplyMap({ ...questionReplyMap, [q.id]: e.target.value })
                        }
                        placeholder="اكتب إجابة الإدارة..."
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          await authFetch(`/api/admin/questions/${q.id}/answer`, {
                            method: 'PUT',
                            body: JSON.stringify({
                              answer: questionReplyMap[q.id] || q.answer,
                            }),
                          });
                          showToast('تم حفظ الإجابة', 'success');
                          loadDashboard();
                        }}
                        className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-semibold"
                      >
                        رد
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 10 & 11. COUPONS & MARKETING */}
            {(activeTab === 'coupons' || activeTab === 'marketing') && (
              <div className="space-y-6">
                <form
                  onSubmit={handleCreateCoupon}
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4"
                >
                  <h2 className="text-base font-bold">إنشاء كوبون خصم حقيقي</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="كود الكوبون (مثال ATU2026)"
                      className="px-3 py-2 text-xs font-mono uppercase rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                    />
                    <select
                      value={couponType}
                      onChange={(e) => setCouponType(e.target.value)}
                      className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                    >
                      <option value="percentage">نسبة مئوية (%)</option>
                      <option value="fixed">مبلغ ثابت (EGP)</option>
                    </select>
                    <input
                      type="number"
                      required
                      value={couponValue}
                      onChange={(e) => setCouponValue(e.target.value)}
                      placeholder="قيمة الخصم"
                      className="px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 dark:bg-amber-600 text-white text-xs font-bold rounded-xl"
                  >
                    حفظ وتفعيل الكوبون
                  </button>
                </form>

                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                  <h3 className="text-sm font-bold">
                    المشتركون في النشرة البريدية ({adminData?.subscribers?.length || 0})
                  </h3>
                  <div className="space-y-1 text-xs font-mono">
                    {(adminData?.subscribers || []).map((s: any) => (
                      <div key={s.id} className="p-2 rounded bg-slate-50 dark:bg-slate-950">
                        {s.email} ({s.isSubscribed ? 'نشط' : 'ألغى الاشتراك'})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 15. SUPPORT TICKETS */}
            {activeTab === 'tickets' && (
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                <h2 className="text-base font-bold">
                  إدارة تذاكر الدعم الفني ({adminData?.tickets?.length || 0})
                </h2>
                {(adminData?.tickets || []).map((t: any) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex justify-between font-bold">
                      <span>
                        {t.ticketNumber} — {t.subject} ({t.customerName})
                      </span>
                      <span className="text-amber-600">{t.status}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{t.message}</p>
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={ticketReplyMap[t.id] ?? t.adminResponse ?? ''}
                        onChange={(e) =>
                          setTicketReplyMap({ ...ticketReplyMap, [t.id]: e.target.value })
                        }
                        placeholder="رد د/ إيمان الأحمر..."
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          await authFetch(`/api/admin/tickets/${t.id}/respond`, {
                            method: 'PUT',
                            body: JSON.stringify({
                              adminResponse: ticketReplyMap[t.id] || t.adminResponse,
                              status: 'resolved',
                            }),
                          });
                          showToast('تم إرسال الرد وتحديث التذكرة', 'success');
                          loadDashboard();
                        }}
                        className="px-4 py-1.5 bg-emerald-700 text-white rounded-lg font-semibold"
                      >
                        إرسال الرد
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 19. CURRENCIES & EXCHANGE RATES */}
            {activeTab === 'currencies' && (
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5">
                <h2 className="text-base font-bold">
                  إعدادات العملات وأسعار الصرف الحقيقية (EGP, USD, EUR, SAR, AED)
                </h2>
                <form onSubmit={handleConfigureExchangeRate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <select
                    value={targetCurrency}
                    onChange={(e) => setTargetCurrency(e.target.value)}
                    className="px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  >
                    {['USD', 'EUR', 'SAR', 'AED'].map((c) => (
                      <option key={c} value={c}>
                        EGP → {c}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={exchangeRateVal}
                    onChange={(e) => setExchangeRateVal(e.target.value)}
                    placeholder="سعر الصرف الفعلي (مثال: 0.020)"
                    className="px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 dark:bg-amber-600 text-white text-xs font-bold rounded-xl"
                  >
                    حفظ سعر الصرف
                  </button>
                </form>
              </div>
            )}

            {/* 24. BACKUP & RECOVERY */}
            {activeTab === 'backup' && (
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold">
                      النسخ الاحتياطي الموثق وخطة التعافي من الكوارث (Backup & Recovery)
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      لا يتم تسجيل أي نسخة احتياطية إلا بعد اكتمالها فعلياً والتحقق من بصمة SHA-256 الخاصة بها.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTriggerBackup}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-2"
                  >
                    <DatabaseBackup className="w-4 h-4" />
                    <span>تشغيل نسخ احتياطي فوري موثق</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                        <th className="py-2 px-3 text-start">كود النسخة</th>
                        <th className="py-2 px-3 text-start">الحجم (Bytes)</th>
                        <th className="py-2 px-3 text-start">عدد السجلات</th>
                        <th className="py-2 px-3 text-start">بصمة التحقق SHA-256</th>
                        <th className="py-2 px-3 text-start">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {(adminData?.backupLogs || []).map((b: any) => (
                        <tr key={b.id}>
                          <td className="py-2.5 px-3 font-mono font-bold">{b.backupCode}</td>
                          <td className="py-2.5 px-3 font-mono tabular-nums">{b.sizeBytes}</td>
                          <td className="py-2.5 px-3 font-mono tabular-nums">{b.recordsCount}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">
                            {b.checksumSha256?.slice(0, 20)}...
                          </td>
                          <td className="py-2.5 px-3 text-emerald-600 font-bold">
                            {b.verificationStatus}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 25. SECURITY & AUDIT LOGS */}
            {activeTab === 'security' && (
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                <h2 className="text-base font-bold">
                  سجلات الأمان والتدقيق الفعلية (Audit Logs)
                </h2>
                <div className="space-y-2 text-xs font-mono">
                  {(adminData?.auditLogs || []).map((log: any) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-wrap justify-between gap-2"
                    >
                      <span className="font-bold text-amber-700 dark:text-amber-400">
                        {log.action}
                      </span>
                      <span>{log.details}</span>
                      <span className="text-slate-400">{log.actorEmail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 12. DEDICATED HOMEPAGE BANNERS MANAGER */}
            {activeTab === 'banners' && (
              <div className="space-y-6">
                <form
                  onSubmit={handleCreateBanner}
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4"
                >
                  <h2 className="text-base font-bold">إضافة بانر جديد للصفحة الرئيسية</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      value={bannerTitleAr}
                      onChange={(e) => setBannerTitleAr(e.target.value)}
                      placeholder="العنوان الرئيسي بالعربية *"
                      className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                    />
                    <input
                      type="text"
                      value={bannerTitleEn}
                      onChange={(e) => setBannerTitleEn(e.target.value)}
                      placeholder="Main Title (English)"
                      className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                    />
                    <input
                      type="text"
                      value={bannerSubtitleAr}
                      onChange={(e) => setBannerSubtitleAr(e.target.value)}
                      placeholder="النص الفرعي بالعربية"
                      className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                    />
                    <input
                      type="text"
                      value={bannerSubtitleEn}
                      onChange={(e) => setBannerSubtitleEn(e.target.value)}
                      placeholder="Subtitle (English)"
                      className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                    />
                    <input
                      type="text"
                      value={bannerCtaTextAr}
                      onChange={(e) => setBannerCtaTextAr(e.target.value)}
                      placeholder="نص الزر بالعربية"
                      className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                    />
                    <input
                      type="text"
                      value={bannerCtaLink}
                      onChange={(e) => setBannerCtaLink(e.target.value)}
                      placeholder="رابط الزر (مثال: /marketplace)"
                      className="px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                    />
                  </div>
                  <input
                    type="text"
                    value={bannerImageUrl}
                    onChange={(e) => setBannerImageUrl(e.target.value)}
                    placeholder="رابط صورة البانر (اختياري)"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 dark:bg-amber-600 text-white text-xs font-bold rounded-xl"
                  >
                    إضافة البانر
                  </button>
                </form>

                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                  <h3 className="text-sm font-bold">
                    البنرات الحالية ({adminData?.banners?.length || 0})
                  </h3>
                  {(adminData?.banners || []).map((b: any) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <p className="font-bold">{b.titleAr}</p>
                        <p className="text-slate-500">{b.subtitleAr}</p>
                        <p className="font-mono text-[11px] text-amber-700 dark:text-amber-400">
                          {b.ctaLink}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteBanner(b.id)}
                        className="px-3 py-1.5 bg-rose-700 text-white rounded-lg font-semibold"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 13 & 23. LEGAL PAGES, POLICIES EDITOR & MAINTENANCE MODE TOGGLE */}
            {(activeTab === 'pages' || activeTab === 'copyright') && (
              <div className="space-y-6">
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold">وضع الصيانة للمتجر (Maintenance Mode)</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      عند التفعيل تظهر صفحة الصيانة للزوار، بينما تظل لوحة التحكم وصفحة الدخول متاحة لك فقط.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleMaintenance}
                    className={`px-5 py-2.5 text-xs font-bold rounded-xl ${
                      settingsEdit.maintenance_mode === 'true'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-rose-700 text-white'
                    }`}
                  >
                    {settingsEdit.maintenance_mode === 'true'
                      ? 'إيقاف وضع الصيانة وفتح المتجر'
                      : 'تفعيل وضع الصيانة مؤقتاً'}
                  </button>
                </div>

                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5">
                  <div>
                    <h2 className="text-base font-bold">محرر السياسات والصفحات القانونية</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      اترك أي حقل فارغاً لاستخدام النص الافتراضي الرسمي، أو اكتب نصاً مخصصاً ليظهر فوراً في الصفحة المقابلة.
                    </p>
                  </div>
                  {[
                    { keyAr: 'policy_privacy_ar', keyEn: 'policy_privacy_en', label: 'سياسة الخصوصية (/privacy-policy)' },
                    { keyAr: 'policy_terms_ar', keyEn: 'policy_terms_en', label: 'الشروط والأحكام (/terms)' },
                    { keyAr: 'policy_refund_ar', keyEn: 'policy_refund_en', label: 'سياسة الاستبدال والاسترجاع (/refund-policy)' },
                    { keyAr: 'policy_license_ar', keyEn: 'policy_license_en', label: 'سياسة ترخيص المنتجات الرقمية (/license-policy)' },
                    { keyAr: 'policy_copyright_ar', keyEn: 'policy_copyright_en', label: 'بنود إضافية لسياسة الملكية الفكرية (/copyright-policy)' },
                    { keyAr: 'policy_faq_ar', keyEn: 'policy_faq_en', label: 'الأسئلة الشائعة (/faq)' },
                  ].map((pol) => (
                    <div key={pol.keyAr} className="space-y-2 pb-4 border-b border-slate-200 dark:border-slate-800">
                      <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400">{pol.label}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <textarea
                          rows={3}
                          value={settingsEdit[pol.keyAr] || ''}
                          onChange={(e) =>
                            setSettingsEdit({ ...settingsEdit, [pol.keyAr]: e.target.value })
                          }
                          placeholder="النص المخصص بالعربية..."
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                        />
                        <textarea
                          rows={3}
                          value={settingsEdit[pol.keyEn] || ''}
                          onChange={(e) =>
                            setSettingsEdit({ ...settingsEdit, [pol.keyEn]: e.target.value })
                          }
                          placeholder="Custom English policy text..."
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="px-6 py-2.5 bg-slate-900 dark:bg-amber-600 text-white text-xs font-bold rounded-xl"
                  >
                    حفظ نصوص السياسات والصفحات القانونية
                  </button>
                </div>
              </div>
            )}

            {/* 14. DEDICATED SOCIAL MEDIA LINKS MANAGER */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <form
                  onSubmit={handleCreateSocialLink}
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4"
                >
                  <h2 className="text-base font-bold">إضافة حساب تواصل اجتماعي جديد</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={newSocialPlatform}
                      onChange={(e) => setNewSocialPlatform(e.target.value)}
                      placeholder="اسم المنصة (مثال: linkedin أو telegram)"
                      className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                    />
                    <input
                      type="url"
                      required
                      value={newSocialUrl}
                      onChange={(e) => setNewSocialUrl(e.target.value)}
                      placeholder="الرابط الكامل https://..."
                      className="px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                    />
                    <input
                      type="text"
                      required
                      value={newSocialLabelAr}
                      onChange={(e) => setNewSocialLabelAr(e.target.value)}
                      placeholder="العنوان بالعربية"
                      className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                    />
                    <input
                      type="text"
                      value={newSocialLabelEn}
                      onChange={(e) => setNewSocialLabelEn(e.target.value)}
                      placeholder="Label in English"
                      className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 dark:bg-amber-600 text-white text-xs font-bold rounded-xl"
                  >
                    إضافة الرابط
                  </button>
                </form>

                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                  <h3 className="text-sm font-bold">
                    روابط التواصل الحالية ({adminData?.socialLinks?.length || 0})
                  </h3>
                  {(adminData?.socialLinks || []).map((soc: any) => {
                    const edit = socialEdits[soc.id] || {
                      labelAr: soc.labelAr,
                      labelEn: soc.labelEn,
                      url: soc.url,
                    };
                    return (
                      <div
                        key={soc.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={edit.labelAr}
                            onChange={(e) =>
                              setSocialEdits({
                                ...socialEdits,
                                [soc.id]: { ...edit, labelAr: e.target.value },
                              })
                            }
                            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                          />
                          <input
                            type="text"
                            value={edit.labelEn}
                            onChange={(e) =>
                              setSocialEdits({
                                ...socialEdits,
                                [soc.id]: { ...edit, labelEn: e.target.value },
                              })
                            }
                            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                          />
                          <input
                            type="url"
                            value={edit.url}
                            onChange={(e) =>
                              setSocialEdits({
                                ...socialEdits,
                                [soc.id]: { ...edit, url: e.target.value },
                              })
                            }
                            className="px-3 py-1.5 font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateSocialLink(soc.id)}
                            className="px-3 py-1 bg-emerald-700 text-white rounded-lg font-semibold"
                          >
                            حفظ التعديل
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSocialLink(soc.id)}
                            className="px-3 py-1 bg-rose-700 text-white rounded-lg font-semibold"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 18. DEDICATED DOWNLOAD ANALYTICS */}
            {activeTab === 'download_analytics' && (
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                <h2 className="text-base font-bold">
                  سجل وتحليلات التحميلات الفعلية ({adminData?.downloadLogs?.length || 0})
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-start border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                        <th className="py-2 px-3 text-start">رقم المنتج</th>
                        <th className="py-2 px-3 text-start">المستخدم</th>
                        <th className="py-2 px-3 text-start">عنوان IP</th>
                        <th className="py-2 px-3 text-start">الحالة</th>
                        <th className="py-2 px-3 text-start">الوقت</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {(adminData?.downloadLogs || []).map((dl: any) => (
                        <tr key={dl.id}>
                          <td className="py-2.5 px-3 font-mono">#{dl.productId}</td>
                          <td className="py-2.5 px-3 font-mono">{dl.userUid}</td>
                          <td className="py-2.5 px-3 font-mono">{dl.ipAddress || '—'}</td>
                          <td className="py-2.5 px-3 font-mono text-emerald-600">{dl.status}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">
                            {dl.createdAt ? new Date(dl.createdAt).toLocaleString('ar-EG') : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 20, 21, 22. PAYMENT WEBHOOKS, EMAIL & SEO SETTINGS */}
            {['payment_config', 'email_settings', 'seo'].includes(activeTab) && (
              <div className="space-y-6">
                {activeTab === 'payment_config' && (
                  <div className="p-6 bg-slate-900 text-white rounded-2xl border border-amber-500/40 space-y-3 text-xs">
                    <h2 className="text-base font-bold text-amber-400">
                      روابط التحقق الآلي لبوابات الدفع (Payment Webhooks) والتأكيد اليدوي
                    </h2>
                    <p className="text-slate-300 leading-relaxed">
                      يمكنك قبول المدفوعات فوراً اليوم عبر التحويل البنكي أو إنستاباي أو فودافون كاش والتواصل على واتساب د/ إيمان الأحمر، ثم الضغط على زر "تأكيد السداد وتفعيل الرخصة" من تبويب الطلبات ليفتح التحميل للعميل فوراً دون الحاجة لربط بوابة دفع إلكترونية. وعند الاشتراك لاحقاً في Paymob أو Fawry أو PayPal، استخدم الروابط التالية في لوحة البوابة:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-amber-400 block mb-1">Paymob Webhook (HMAC-SHA512)</span>
                        <span>{window.location.origin}/api/webhooks/paymob</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-amber-400 block mb-1">Fawry Webhook (SHA-256)</span>
                        <span>{window.location.origin}/api/webhooks/fawry</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-amber-400 block mb-1">PayPal Webhook (API Verify)</span>
                        <span>{window.location.origin}/api/webhooks/paypal</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5">
                  <h2 className="text-base font-bold">
                    إعدادات وتكوين المنصة ({activeTab.toUpperCase()})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(settingsEdit)
                      .filter(([key]) => !key.startsWith('policy_'))
                      .map(([key, val]) => (
                        <div key={key}>
                          <label className="block text-xs font-mono text-slate-500 mb-1">{key}</label>
                          <input
                            type="text"
                            value={val}
                            onChange={(e) =>
                              setSettingsEdit({ ...settingsEdit, [key]: e.target.value })
                            }
                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                          />
                        </div>
                      ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    className="px-6 py-2.5 bg-slate-900 dark:bg-amber-600 text-white text-xs font-bold rounded-xl"
                  >
                    حفظ جميع الإعدادات في قاعدة البيانات
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
