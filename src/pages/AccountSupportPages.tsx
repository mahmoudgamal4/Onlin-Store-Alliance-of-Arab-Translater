import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Lock,
  ShieldCheck,
  Package,
  Download,
  Heart,
  LifeBuoy,
  Bell,
  Trash2,
  Paperclip,
  Send,
  FileText,
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { WhatsAppIcon } from '../components/Layout.tsx';

// ============================================================================
// 17, 18, 19. AUTH PAGES (/login, /register, /password-recovery)
// ============================================================================
export const CustomerLoginPage: React.FC = () => {
  const { lang, loginWithGoogle, loginWithEmail, showToast } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');
    try {
      await loginWithEmail(email, password);
      navigate('/my-account');
    } catch (err: any) {
      const message = err?.message || (lang === 'ar' ? 'فشل تسجيل الدخول' : 'Login failed');
      setFormError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setFormError('');
    try {
      await loginWithGoogle();
      navigate('/my-account');
    } catch (err: any) {
      const message =
        err?.message || (lang === 'ar' ? 'فشل تسجيل الدخول عبر Google' : 'Google Sign-In failed');
      setFormError(message);
      showToast(message, 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold">
            {lang === 'ar' ? 'تسجيل الدخول إلى حسابك' : 'Sign In to Your Account'}
          </h1>
          <p className="text-xs text-slate-500">
            متجر اتحاد المترجمين العرب · Online store alliance of arab translators
          </p>
        </div>

        {formError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs leading-relaxed">
            {formError}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogle}
          className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>
            {lang === 'ar'
              ? 'تسجيل الدخول السريع عبر حساب Google الموثق'
              : 'Continue with Verified Google Account'}
          </span>
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
          <span className="shrink mx-3 text-xs text-slate-400">
            {lang === 'ar' ? 'أو بالبريد الإلكتروني' : 'or with email'}
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">
              {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute top-2.5 start-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full ps-9 pe-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              {lang === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute top-2.5 start-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full ps-9 pe-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <Link to="/password-recovery" className="text-amber-700 dark:text-amber-400 hover:underline">
              {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
            </Link>
            <Link to="/register" className="font-semibold hover:underline">
              {lang === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
          >
            {loading
              ? lang === 'ar'
                ? 'جاري الدخول...'
                : 'Signing in...'
              : lang === 'ar'
              ? 'تسجيل الدخول'
              : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const CustomerRegistrationPage: React.FC = () => {
  const { lang, registerWithEmail, loginWithGoogle, showToast } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [confirmationNotice, setConfirmationNotice] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');
    setConfirmationNotice('');
    try {
      const result = await registerWithEmail(name, email, password);
      if (result?.requiresEmailConfirmation) {
        setConfirmationNotice(
          lang === 'ar'
            ? 'تم إنشاء حسابك بنجاح! يرجى فتح بريدك الإلكتروني والضغط على رابط التفعيل، ثم تسجيل الدخول.'
            : 'Your account has been created! Please check your email inbox and click the confirmation link, then sign in.'
        );
      } else {
        navigate('/my-account');
      }
    } catch (err: any) {
      const message =
        err?.message || (lang === 'ar' ? 'تعذر إنشاء الحساب' : 'Registration error');
      setFormError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setFormError('');
    try {
      await loginWithGoogle();
      navigate('/my-account');
    } catch (err: any) {
      const message =
        err?.message || (lang === 'ar' ? 'فشل التسجيل عبر Google' : 'Google registration failed');
      setFormError(message);
      showToast(message, 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold">
            {lang === 'ar' ? 'إنشاء حساب عميل جديد' : 'Customer Registration'}
          </h1>
          <p className="text-xs text-slate-500">
            {lang === 'ar'
              ? 'جميع الحسابات المسجلة تمنح صلاحيات عميل فقط لحفظ المشتريات والمكتبة الرقمية.'
              : 'All registered accounts receive customer permissions to manage purchases and digital downloads.'}
          </p>
        </div>

        {formError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs leading-relaxed">
            {formError}
          </div>
        )}

        {confirmationNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs leading-relaxed space-y-2">
            <p>{confirmationNotice}</p>
            <Link to="/login" className="inline-block font-bold underline">
              {lang === 'ar' ? 'الانتقال إلى صفحة تسجيل الدخول' : 'Go to Sign In'}
            </Link>
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleRegister}
          className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{lang === 'ar' ? 'التسجيل السريع باستخدام Google' : 'Register with Google'}</span>
        </button>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">
              {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              {lang === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-slate-800 text-white text-xs font-semibold rounded-xl"
          >
            {loading
              ? lang === 'ar'
                ? 'جاري إنشاء الحساب...'
                : 'Creating account...'
              : lang === 'ar'
              ? 'إنشاء الحساب'
              : 'Create Customer Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const PasswordRecoveryPage: React.FC = () => {
  const { lang, sendResetPassword, showToast } = useStore();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendResetPassword(email);
    } catch (err: any) {
      showToast(err.message || 'Failed to send reset email', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5">
        <h1 className="text-xl font-bold">
          {lang === 'ar' ? 'استعادة كلمة المرور' : 'Password Recovery'}
        </h1>
        <p className="text-xs text-slate-500">
          {lang === 'ar'
            ? 'أدخل بريدك الإلكتروني المسجل لإرسال رابط إعادة تعيين كلمة المرور.'
            : 'Enter your registered email address to receive a password reset link.'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
          />
          <button
            type="submit"
            className="w-full py-2.5 bg-slate-900 dark:bg-amber-600 text-white text-xs font-bold rounded-xl"
          >
            {lang === 'ar' ? 'إرسال رابط الاستعادة' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 20, 21, 22, 23, 24. CUSTOMER ACCOUNT PAGES (/my-account, /my-profile, /my-orders, /my-downloads, /my-favorites)
// ============================================================================
export const CustomerAccountPortal: React.FC<{
  section: 'overview' | 'profile' | 'orders' | 'downloads' | 'favorites';
}> = ({ section }) => {
  const {
    lang,
    user,
    isSuperAdmin,
    products,
    favoriteIds,
    authFetch,
    triggerSecureDownload,
    showToast,
  } = useStore();

  const [accountData, setAccountData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('EG');
  const [deletionReason, setDeletionReason] = useState('');

  const loadAccount = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await authFetch('/api/account/overview');
      if (res.ok) {
        const data = await res.json();
        setAccountData(data);
        setFullName(data.profile?.fullName || user.displayName || '');
        setPhone(data.profile?.phone || '');
        setCountry(data.profile?.country || 'EG');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccount();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center space-y-4">
        <UserIcon className="w-12 h-12 text-amber-600 mx-auto" />
        <h1 className="text-xl font-bold">
          {lang === 'ar' ? 'يرجى تسجيل الدخول للوصول إلى حسابك' : 'Please Sign In to Access Your Account'}
        </h1>
        <p className="text-xs text-slate-500">
          {lang === 'ar'
            ? 'يمكن للزوار تصفح المتجر بحرية، بينما يتطلب عرض الطلبات والمكتبة الرقمية تسجيل الدخول.'
            : 'Visitors can browse freely; viewing orders and your personal digital library requires signing in.'}
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 bg-slate-900 dark:bg-amber-600 text-white text-xs font-bold rounded-xl"
        >
          {lang === 'ar' ? 'تسجيل الدخول الآن' : 'Sign In Now'}
        </Link>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent, requestDelete = false) => {
    e.preventDefault();
    const res = await authFetch('/api/account/profile', {
      method: 'PUT',
      body: JSON.stringify({
        fullName,
        phone,
        country,
        deletionRequested: requestDelete,
        deletionReason,
      }),
    });
    if (res.ok) {
      showToast(
        requestDelete
          ? lang === 'ar'
            ? 'تم تسجيل طلب حذف الحساب ومراجعته من الإدارة'
            : 'Account deletion request submitted'
          : lang === 'ar'
          ? 'تم تحديث الملف الشخصي بنجاح'
          : 'Profile updated successfully',
        'success'
      );
      loadAccount();
    }
  };

  const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Account Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-2">
          <div className="p-5 bg-slate-900 text-white rounded-2xl mb-4 space-y-1">
            <p className="text-xs text-amber-400 font-semibold">
              {isSuperAdmin
                ? lang === 'ar'
                  ? 'المدير العام المعتمد (Super Admin)'
                  : 'Verified Super Administrator'
                : lang === 'ar'
                ? 'حساب عميل'
                : 'Customer Account'}
            </p>
            <h2 className="text-sm font-bold truncate">{user.displayName || user.email}</h2>
            <p className="text-xs text-slate-400 font-mono truncate">{user.email}</p>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            <Link
              to="/my-account"
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl ${
                section === 'overview'
                  ? 'bg-slate-900 text-white dark:bg-amber-600'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>{lang === 'ar' ? 'نظرة عامة على الحساب' : 'Account Overview'}</span>
            </Link>
            <Link
              to="/my-profile"
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl ${
                section === 'profile'
                  ? 'bg-slate-900 text-white dark:bg-amber-600'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'ar' ? 'الملف الشخصي والخصوصية' : 'My Profile & Privacy'}</span>
            </Link>
            <Link
              to="/my-orders"
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl ${
                section === 'orders'
                  ? 'bg-slate-900 text-white dark:bg-amber-600'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>{lang === 'ar' ? 'طلباتي وفواتيري' : 'My Orders & Invoices'}</span>
            </Link>
            <Link
              to="/my-downloads"
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl ${
                section === 'downloads'
                  ? 'bg-slate-900 text-white dark:bg-amber-600'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'ar' ? 'مكتبتي الرقمية وتحميلاتي' : 'My Digital Library'}</span>
            </Link>
            <Link
              to="/my-favorites"
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl ${
                section === 'favorites'
                  ? 'bg-slate-900 text-white dark:bg-amber-600'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>{lang === 'ar' ? 'قائمة المفضلة' : 'My Favorites'}</span>
            </Link>
            <Link
              to="/support-tickets"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <LifeBuoy className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تذاكر الدعم الفني' : 'Support Tickets'}</span>
            </Link>
            {isSuperAdmin && (
              <Link
                to="/admin-dashboard"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'ar' ? 'لوحة تحكم الإدارة الشاملة' : 'Super Admin Dashboard'}</span>
              </Link>
            )}
          </nav>
        </aside>

        {/* Main Account Content */}
        <div className="lg:col-span-9 space-y-6">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500">
              {lang === 'ar' ? 'جاري تحميل بيانات الحساب...' : 'Loading account data...'}
            </div>
          ) : (
            <>
              {section === 'overview' && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">
                    {lang === 'ar' ? 'لوحة حسابي الشخصي' : 'My Account Dashboard'}
                  </h1>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-xs text-slate-500 block">
                        {lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}
                      </span>
                      <span className="text-2xl font-bold font-mono tabular-nums">
                        {accountData?.orders?.length || 0}
                      </span>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-xs text-slate-500 block">
                        {lang === 'ar' ? 'رخص التحميل' : 'Download Licenses'}
                      </span>
                      <span className="text-2xl font-bold font-mono tabular-nums">
                        {accountData?.downloads?.length || 0}
                      </span>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-xs text-slate-500 block">
                        {lang === 'ar' ? 'المفضلة' : 'Saved Favorites'}
                      </span>
                      <span className="text-2xl font-bold font-mono tabular-nums">
                        {favoriteProducts.length}
                      </span>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-xs text-slate-500 block">
                        {lang === 'ar' ? 'تذاكر الدعم' : 'Support Tickets'}
                      </span>
                      <span className="text-2xl font-bold font-mono tabular-nums">
                        {accountData?.tickets?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
                    <h2 className="text-base font-bold flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-600" />
                      <span>{lang === 'ar' ? 'إشعارات الحساب' : 'Account Notifications'}</span>
                    </h2>
                    {accountData?.notifications?.length ? (
                      <div className="space-y-3">
                        {accountData.notifications.map((n: any) => (
                          <div
                            key={n.id}
                            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                          >
                            <p className="font-bold">
                              {lang === 'ar' ? n.titleAr : n.titleEn}
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                              {lang === 'ar' ? n.messageAr : n.messageEn}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">
                        {lang === 'ar' ? 'لا توجد إشعارات جديدة حالياً.' : 'No new notifications.'}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {section === 'profile' && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">
                    {lang === 'ar' ? 'إعدادات الملف الشخصي والخصوصية' : 'Profile & Privacy Settings'}
                  </h1>
                  <form
                    onSubmit={(e) => handleSaveProfile(e, false)}
                    className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                        </label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-slate-900 dark:bg-amber-600 text-white text-xs font-semibold rounded-lg"
                    >
                      {lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
                    </button>
                  </form>

                  {/* Account Deletion Request (Section 13 & 23) */}
                  <div className="p-6 bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-2xl space-y-3">
                    <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                      <Trash2 className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'طلب حذف الحساب والبيانات الشخصية' : 'Request Account & Personal Data Deletion'}</span>
                    </h3>
                    <input
                      type="text"
                      value={deletionReason}
                      onChange={(e) => setDeletionReason(e.target.value)}
                      placeholder={lang === 'ar' ? 'سبب طلب حذف الحساب...' : 'Reason for account deletion request...'}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-950"
                    />
                    <button
                      type="button"
                      onClick={(e) => handleSaveProfile(e as any, true)}
                      className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-lg"
                    >
                      {lang === 'ar' ? 'إرسال طلب حذف الحساب' : 'Submit Account Deletion Request'}
                    </button>
                  </div>
                </div>
              )}

              {section === 'orders' && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">
                    {lang === 'ar' ? 'سجل الطلبات والفواتير' : 'Order History & Invoices'}
                  </h1>
                  {accountData?.orders?.length ? (
                    <div className="space-y-4">
                      {accountData.orders.map((ord: any) => (
                        <div
                          key={ord.id}
                          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4"
                        >
                          <div className="space-y-1 text-xs">
                            <p className="font-mono font-bold text-sm">{ord.orderNumber}</p>
                            <p className="text-slate-500">
                              {lang === 'ar' ? 'حالة الدفع:' : 'Payment Status:'}{' '}
                              <span className="font-semibold text-amber-700 dark:text-amber-400">
                                {ord.paymentStatus}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-mono tabular-nums font-bold text-sm">
                              {ord.totalAmount} {ord.currency}
                            </span>
                            <Link
                              to={`/payment-confirmation?order=${encodeURIComponent(ord.orderNumber)}`}
                              className="px-3.5 py-2 bg-slate-900 dark:bg-amber-600 text-white text-xs font-semibold rounded-lg"
                            >
                              {lang === 'ar' ? 'عرض الفاتورة' : 'View Invoice'}
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 p-8 bg-slate-50 dark:bg-slate-900 rounded-xl text-center">
                      {lang === 'ar' ? 'لا توجد طلبات مسجلة في حسابك بعد.' : 'No orders found in your account yet.'}
                    </p>
                  )}
                </div>
              )}

              {section === 'downloads' && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">
                    {lang === 'ar' ? 'مكتبتي الرقمية وسجل التحميلات' : 'My Digital Library & Downloads'}
                  </h1>
                  {accountData?.downloads?.length ? (
                    <div className="space-y-3">
                      {accountData.downloads.map((dl: any) => {
                        const prod = products.find((p) => p.id === dl.productId);
                        return (
                          <div
                            key={dl.id}
                            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs"
                          >
                            <div>
                              <p className="font-bold text-sm">
                                {prod
                                  ? lang === 'ar'
                                    ? prod.titleAr
                                    : prod.titleEn
                                  : `Product #${dl.productId}`}
                              </p>
                              <p className="text-slate-500 font-mono mt-0.5">
                                {lang === 'ar' ? 'عدد مرات التحميل:' : 'Downloads used:'}{' '}
                                {dl.downloadCount} / {dl.maxDownloads}
                              </p>
                            </div>
                            {prod && (
                              <button
                                type="button"
                                onClick={() => triggerSecureDownload(prod)}
                                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg flex items-center gap-1.5"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>{lang === 'ar' ? 'إعادة التحميل الآمن' : 'Re-download File'}</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 p-8 bg-slate-50 dark:bg-slate-900 rounded-xl text-center">
                      {lang === 'ar'
                        ? 'مكتبتك الرقمية فارغة حالياً. ستظهر هنا جميع الكتب والملفات المجانية أو المشتراة.'
                        : 'Your personal digital library is currently empty.'}
                    </p>
                  )}
                </div>
              )}

              {section === 'favorites' && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">
                    {lang === 'ar' ? 'قائمة المفضلة والأمنيات' : 'My Favorites & Wishlist'}
                  </h1>
                  {favoriteProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {favoriteProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 p-8 bg-slate-50 dark:bg-slate-900 rounded-xl text-center">
                      {lang === 'ar' ? 'لم تقم بإضافة أي منتجات إلى المفضلة بعد.' : 'No favorite products saved yet.'}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 28 & 35. TECHNICAL SUPPORT CENTER (/technical-support) & SUPPORT TICKETS (/support-tickets)
// ============================================================================
export const TechnicalSupportCenterPage: React.FC = () => {
  const { lang, user, authFetch, showToast } = useStore();
  const [customerName, setCustomerName] = useState(user?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [category, setCategory] = useState('purchase_inquiry');
  const [priority, setPriority] = useState('normal');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentDataUrl, setAttachmentDataUrl] = useState('');
  const [createdTicket, setCreatedTicket] = useState<any>(null);
  const [userTickets, setUserTickets] = useState<any[]>([]);

  const loadMyTickets = async () => {
    if (!user) return;
    const res = await authFetch('/api/account/overview');
    if (res.ok) {
      const data = await res.json();
      setUserTickets(data.tickets || []);
    }
  };

  useEffect(() => {
    loadMyTickets();
  }, [user]);

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast(lang === 'ar' ? 'الحد الأقصى للمرفق 5 ميجابايت' : 'Max attachment size is 5MB', 'error');
      return;
    }
    setAttachmentName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setAttachmentDataUrl(String(reader.result || ''));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await authFetch('/api/support-tickets', {
      method: 'POST',
      body: JSON.stringify({
        customerName,
        customerEmail,
        customerPhone,
        category,
        priority,
        subject,
        message,
        attachmentName,
        attachmentDataUrl,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setCreatedTicket(data.ticket);
      setSubject('');
      setMessage('');
      setAttachmentName('');
      setAttachmentDataUrl('');
      showToast(
        lang === 'ar'
          ? `تم فتح تذكرة الدعم رقم ${data.ticket.ticketNumber} بنجاح`
          : `Support ticket ${data.ticket.ticketNumber} created`,
        'success'
      );
      loadMyTickets();
    } else {
      showToast(data.error || 'Failed to submit ticket', 'error');
    }
  };

  const supportWhatsAppUrl =
    'https://wa.me/201032105770?text=' +
    encodeURIComponent(
      'مرحباً د/ إيمان الأحمر، أحتاج إلى المساعدة بخصوص متجر اتحاد المترجمين العرب.'
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Prominent Official WhatsApp Support Banner (Section 14) */}
      <div className="p-8 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-amber-400">
            مركز الدعم الفني وخدمة العملاء المعتمد
          </span>
          <h1 className="text-2xl md:text-3xl font-bold">
            {lang === 'ar'
              ? 'الدعم الفني وخدمة العملاء — د/ إيمان الأحمر'
              : 'Technical Support & Customer Care — Dr. Eman Elahmer'}
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            {lang === 'ar'
              ? 'للاستفسارات حول الشراء، مشاكل التحميل، تأكيد المدفوعات، المساعدة في الحساب، أو الشكاوى والمقترحات.'
              : 'For purchase inquiries, download assistance, payment confirmation, account help, or suggestions.'}
          </p>
        </div>

        <a
          href={supportWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl flex items-center gap-3 shrink-0 shadow-lg"
        >
          <WhatsAppIcon className="w-5 h-5" />
          <div className="text-start">
            <span className="block">تواصل مع د/ إيمان الأحمر</span>
            <span className="block text-xs font-mono tabular-nums text-emerald-100">
              01032105770
            </span>
          </div>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Support Ticket Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmitTicket}
            className="p-6 lg:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4"
          >
            <h2 className="text-lg font-bold">
              {lang === 'ar' ? 'فتح تذكرة دعم فني جديدة' : 'Submit a New Support Ticket'}
            </h2>

            {createdTicket && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
                <p className="font-bold text-emerald-900 dark:text-emerald-300">
                  {lang === 'ar'
                    ? `تم تسجيل تذكرتك بنجاح! رقم التذكرة: ${createdTicket.ticketNumber}`
                    : `Ticket registered! Ticket Number: ${createdTicket.ticketNumber}`}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {lang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {lang === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {lang === 'ar' ? 'تصنيف المشكلة' : 'Issue Category'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                >
                  <option value="purchase_inquiry">{lang === 'ar' ? 'استفسارات الشراء' : 'Purchase Inquiry'}</option>
                  <option value="download_problem">{lang === 'ar' ? 'مشاكل التحميل' : 'Download Problem'}</option>
                  <option value="payment_inquiry">{lang === 'ar' ? 'استفسارات الدفع والفواتير' : 'Payment & Invoice'}</option>
                  <option value="account_assistance">{lang === 'ar' ? 'مساعدة في الحساب' : 'Account Assistance'}</option>
                  <option value="complaint_suggestion">{lang === 'ar' ? 'شكاوى ومقترحات' : 'Complaints & Suggestions'}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {lang === 'ar' ? 'درجة الأولوية' : 'Priority Level'}
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                >
                  <option value="low">{lang === 'ar' ? 'منخفضة' : 'Low'}</option>
                  <option value="normal">{lang === 'ar' ? 'عادية' : 'Normal'}</option>
                  <option value="high">{lang === 'ar' ? 'مرتفعة' : 'High'}</option>
                  <option value="urgent">{lang === 'ar' ? 'عاجلة' : 'Urgent'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                {lang === 'ar' ? 'عنوان التذكرة *' : 'Subject *'}
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                {lang === 'ar' ? 'تفاصيل الطلب أو المشكلة *' : 'Detailed Message *'}
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
              />
            </div>

            <div>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer">
                <Paperclip className="w-4 h-4 text-amber-600" />
                <span>
                  {attachmentName || (lang === 'ar' ? 'إرفاق صورة أو مستند توضيحي (اختياري)' : 'Attach Screenshot/Document (Optional)')}
                </span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleAttachment}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 dark:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إرسال تذكرة الدعم الفني' : 'Submit Support Ticket'}</span>
            </button>
          </form>
        </div>

        {/* Customer Inquiry History */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-bold">
            {lang === 'ar' ? 'سجل تذاكر الدعم الخاصة بك' : 'Your Support Inquiry History'}
          </h2>
          {userTickets.length === 0 ? (
            <div className="p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-500 text-center">
              {lang === 'ar'
                ? 'لا توجد تذاكر دعم سابقة مسجلة في حسابك.'
                : 'No previous support tickets found in your account.'}
            </div>
          ) : (
            <div className="space-y-3">
              {userTickets.map((t: any) => (
                <div
                  key={t.id}
                  className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                      {t.ticketNumber}
                    </span>
                    <span className="font-semibold">
                      {t.status} · {t.priority}
                    </span>
                  </div>
                  <p className="font-bold">{t.subject}</p>
                  <p className="text-slate-600 dark:text-slate-400">{t.message}</p>
                  {t.adminResponse && (
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                      <p className="font-bold text-emerald-800 dark:text-emerald-300">
                        {lang === 'ar' ? 'رد الإدارة:' : 'Admin Response:'}
                      </p>
                      <p className="mt-1">{t.adminResponse}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
