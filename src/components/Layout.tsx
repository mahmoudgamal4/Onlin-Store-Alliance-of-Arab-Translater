import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  Share2,
  Sun,
  Moon,
  Globe,
  ShieldCheck,
  X,
  Copy,
  Check,
  Trash2,
  Scale,
  Menu,
  LogOut,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.359 5.016L2 22l5.141-1.344c1.484.813 3.172 1.25 4.89 1.25 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.516.078-1.188.109-1.922-.125-.453-.141-1.031-.328-1.766-.641-3.109-1.344-5.141-4.484-5.297-4.688-.156-.203-1.266-1.688-1.266-3.219 0-1.531.797-2.281 1.078-2.594.281-.313.609-.391.813-.391.203 0 .406.016.578.016.188 0 .438-.078.688.516.25.609.859 2.094.938 2.25.078.156.125.344.031.547-.094.203-.141.328-.297.5-.156.172-.313.391-.453.516-.156.141-.313.297-.141.594.172.297.766 1.266 1.641 2.047 1.125 1.016 2.078 1.328 2.375 1.484.297.156.469.125.641-.078.172-.203.734-.859.938-1.156.203-.297.391-.25.656-.156.266.094 1.688.797 1.984.938.297.141.484.219.563.344.078.125.078.719-.172 1.422z" />
  </svg>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    lang,
    setLang,
    theme,
    toggleTheme,
    currency,
    setCurrency,
    currencies,
    formatPrice,
    user,
    isSuperAdmin,
    logout,
    cart,
    removeFromCart,
    updateCartQty,
    cartDrawerOpen,
    setCartDrawerOpen,
    favoriteIds,
    compareIds,
    toggleCompare,
    products,
    shareModal,
    openShareModal,
    closeShareModal,
    toast,
    showToast,
    socialLinks,
  } = useStore();

  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterConsent, setNewsletterConsent] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      navigate('/marketplace');
      return;
    }
    navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotalEgp = cart.reduce((sum, i) => {
    const p = i.product;
    const unit = p.isFree
      ? 0
      : p.discountPrice && Number(p.discountPrice) > 0
      ? Number(p.discountPrice)
      : Number(p.price);
    return sum + unit * i.quantity;
  }, 0);

  const supportWhatsAppUrl =
    'https://wa.me/201032105770?text=' +
    encodeURIComponent(
      'مرحباً د/ إيمان الأحمر، أحتاج إلى المساعدة بخصوص متجر اتحاد المترجمين العرب.'
    );

  const developerWhatsAppUrl =
    'https://wa.me/201093151840?text=' +
    encodeURIComponent(
      'مرحباً م/ محمود جمال، أتواصل معك بخصوص متجر اتحاد المترجمين العرب.'
    );

  const handleCopyShareLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      showToast(
        lang === 'ar'
          ? 'تم نسخ الرابط بنجاح إلى الحافظة!'
          : 'Canonical link copied to clipboard!',
        'success'
      );
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      showToast(lang === 'ar' ? 'تعذر نسخ الرابط' : 'Failed to copy link', 'error');
    }
  };

  const handleNativeShare = async () => {
    if (!shareModal) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareModal.title,
          text: shareModal.description || shareModal.title,
          url: shareModal.url,
        });
      } catch {
        // User cancelled share sheet
      }
    } else {
      handleCopyShareLink(shareModal.url);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterConsent) {
      showToast(
        lang === 'ar'
          ? 'يرجى إدخال البريد الإلكتروني والموافقة على الإشعارات'
          : 'Please enter your email and accept consent',
        'error'
      );
      return;
    }
    const res = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: newsletterEmail,
        locale: lang,
        consentGiven: newsletterConsent,
      }),
    });
    if (res.ok) {
      setNewsletterEmail('');
      setNewsletterConsent(false);
      showToast(
        lang === 'ar'
          ? 'تم الاشتراك في النشرة البريدية بنجاح'
          : 'Subscribed to newsletter successfully',
        'success'
      );
    }
  };

  const comparedProducts = products.filter((p) => compareIds.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Bar Contract (Strict 3-Zone Header: Brand Wordmark — 5 Single-Line Links — 1 Primary Action) */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
        {/* Zone 1: Single text element wordmark */}
        <Link
          to="/"
          className="text-base md:text-lg font-bold tracking-tight text-amber-400 whitespace-nowrap shrink-0"
        >
          متجر اتحاد المترجمين العرب · Online store alliance of arab translators
        </Link>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-200">
          <Link
            to="/marketplace"
            className="hover:text-amber-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {lang === 'ar' ? 'المتجر الرئيسي' : 'Marketplace'}
          </Link>
          <Link
            to="/categories"
            className="hover:text-amber-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {lang === 'ar' ? 'الأقسام' : 'Categories'}
          </Link>
          <Link
            to="/free-downloads"
            className="hover:text-amber-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {lang === 'ar' ? 'التحميلات المجانية' : 'Free Downloads'}
          </Link>
          <Link
            to="/technical-support"
            className="hover:text-amber-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {lang === 'ar' ? 'الدعم الفني' : 'Support'}
          </Link>
          <Link
            to="/about"
            className="hover:text-amber-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {lang === 'ar' ? 'عن المتجر' : 'About Us'}
          </Link>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {isSuperAdmin ? (
            <Link
              to="/admin-dashboard"
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              {lang === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}
            </Link>
          ) : (
            <Link
              to="/products"
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              {lang === 'ar' ? 'تصفح جميع المنتجات' : 'Browse Catalog'}
            </Link>
          )}
        </div>
      </header>

      {/* Secondary Marketplace Search & Utility Bar */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Official Bilingual Brand Lockup (Arabic above English as mandated) */}
          <Link to="/" className="flex flex-col shrink-0">
            <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              متجر اتحاد المترجمين العرب
            </span>
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400 tracking-wide">
              Online store alliance of arab translators
            </span>
          </Link>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 min-w-[240px] max-w-xl flex items-center bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-amber-500"
          >
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'ابحث في كتب ومراجع الترجمة، القواميس، الدورات، الملفات...'
                  : 'Search translation books, dictionaries, courses, PDFs...'
              }
              className="w-full px-3.5 py-2 text-sm bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
            />
            <Link
              to="/advanced-search"
              title={lang === 'ar' ? 'بحث متقدم' : 'Advanced Search'}
              className="px-2.5 py-2 text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 dark:bg-amber-600 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-amber-500 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{lang === 'ar' ? 'بحث' : 'Search'}</span>
            </button>
          </form>

          {/* Marketplace Controls: Share Store, Currency, Language, Theme, Favorites, Cart, Account */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Share Store Button (Section 12) */}
            <button
              type="button"
              onClick={() =>
                openShareModal({
                  title: 'متجر اتحاد المترجمين العرب | Online store alliance of arab translators',
                  url: window.location.origin,
                  description:
                    'المنصة الرقمية الرسمية لكتب ومراجع الترجمة والقواميس والدورات التدريبية بإشراف د/ إيمان الأحمر.',
                })
              }
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-amber-500 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{lang === 'ar' ? 'مشاركة المتجر' : 'Share Store'}</span>
            </button>

            {/* Currency Selector (Section 10) */}
            <select
              aria-label={lang === 'ar' ? 'اختر العملة' : 'Select Currency'}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-mono font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
            >
              {(currencies.length > 0
                ? currencies
                : [
                    { code: 'EGP' },
                    { code: 'USD' },
                    { code: 'EUR' },
                    { code: 'SAR' },
                    { code: 'AED' },
                  ]
              ).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))}
            </select>

            {/* Language Switcher (RTL / LTR) */}
            <button
              type="button"
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-amber-500 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              title={lang === 'ar' ? 'تبديل المظهر' : 'Toggle Theme'}
              className="p-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-amber-500 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Compare Button */}
            {compareIds.length > 0 && (
              <button
                type="button"
                onClick={() => setCompareModalOpen(true)}
                className="px-2.5 py-1.5 text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 rounded-lg flex items-center gap-1 whitespace-nowrap shrink-0"
              >
                <Scale className="w-3.5 h-3.5" />
                <span className="font-mono tabular-nums">({compareIds.length})</span>
              </button>
            )}

            {/* Favorites Link */}
            <Link
              to="/my-favorites"
              className="px-2.5 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-amber-500 transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <Heart className="w-3.5 h-3.5 text-rose-600" />
              <span className="font-mono tabular-nums">{favoriteIds.length}</span>
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-900 dark:bg-amber-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-amber-500 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'السلة' : 'Cart'}</span>
              <span className="font-mono tabular-nums">({cartCount})</span>
            </button>

            {/* Customer Account / Auth */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/my-account"
                  className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-amber-500 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <UserIcon className="w-3.5 h-3.5 text-amber-600" />
                  <span className="max-w-[110px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  title={lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
                  className="p-1.5 text-slate-500 hover:text-rose-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-amber-500 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <UserIcon className="w-3.5 h-3.5 text-amber-600" />
                <span>{lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
              </Link>
            )}

            {/* Mobile All-Pages Directory Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              aria-label="Toggle Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-navigation quick links row */}
        <div className="max-w-7xl mx-auto mt-2.5 pt-2.5 border-t border-slate-200/70 dark:border-slate-800/70 flex items-center gap-5 overflow-x-auto text-xs font-medium text-slate-600 dark:text-slate-400">
          <Link to="/" className="hover:text-amber-700 dark:hover:text-amber-400 whitespace-nowrap shrink-0">
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <Link to="/marketplace" className="hover:text-amber-700 dark:hover:text-amber-400 whitespace-nowrap shrink-0">
            {lang === 'ar' ? 'السوق الرقمي' : 'Main Marketplace'}
          </Link>
          <Link to="/products" className="hover:text-amber-700 dark:hover:text-amber-400 whitespace-nowrap shrink-0">
            {lang === 'ar' ? 'جميع المنتجات' : 'All Products'}
          </Link>
          <Link to="/categories" className="hover:text-amber-700 dark:hover:text-amber-400 whitespace-nowrap shrink-0">
            {lang === 'ar' ? 'أقسام المتجر' : 'Product Categories'}
          </Link>
          <Link to="/featured" className="hover:text-amber-700 dark:hover:text-amber-400 whitespace-nowrap shrink-0">
            {lang === 'ar' ? 'المنتجات المميزة' : 'Featured Products'}
          </Link>
          <Link to="/new-arrivals" className="hover:text-amber-700 dark:hover:text-amber-400 whitespace-nowrap shrink-0">
            {lang === 'ar' ? 'أحدث الإصدارات' : 'New Arrivals'}
          </Link>
          <Link to="/best-sellers" className="hover:text-amber-700 dark:hover:text-amber-400 whitespace-nowrap shrink-0">
            {lang === 'ar' ? 'الأكثر مبيعاً' : 'Best Sellers'}
          </Link>
          <Link to="/special-offers" className="hover:text-amber-700 dark:hover:text-amber-400 whitespace-nowrap shrink-0">
            {lang === 'ar' ? 'العروض الخاصة' : 'Special Offers'}
          </Link>
          <Link to="/free-downloads" className="hover:text-amber-700 dark:hover:text-amber-400 whitespace-nowrap shrink-0">
            {lang === 'ar' ? 'منتجات مجانية' : 'Free Downloads'}
          </Link>
          <Link to="/reviews" className="hover:text-amber-700 dark:hover:text-amber-400 whitespace-nowrap shrink-0">
            {lang === 'ar' ? 'التقييمات والمراجعات' : 'Reviews & Ratings'}
          </Link>
          <Link to="/support-tickets" className="hover:text-amber-700 dark:hover:text-amber-400 whitespace-nowrap shrink-0">
            {lang === 'ar' ? 'تذاكر الدعم الفني' : 'Support Tickets'}
          </Link>
          <Link to="/copyright-policy" className="hover:text-amber-700 dark:hover:text-amber-400 whitespace-nowrap shrink-0">
            {lang === 'ar' ? 'الملكية الفكرية' : 'Copyright Policy'}
          </Link>
          <Link to="/admin-dashboard" className="hover:text-amber-700 dark:hover:text-amber-400 whitespace-nowrap shrink-0 flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'بوابة الإدارة' : 'Admin Portal'}</span>
          </Link>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
            <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-white dark:bg-slate-800">
              {lang === 'ar' ? 'المتجر الرئيسي' : 'Main Marketplace'}
            </Link>
            <Link to="/categories" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-white dark:bg-slate-800">
              {lang === 'ar' ? 'الأقسام' : 'Categories'}
            </Link>
            <Link to="/my-account" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-white dark:bg-slate-800">
              {lang === 'ar' ? 'حسابي' : 'My Account'}
            </Link>
            <Link to="/my-downloads" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-white dark:bg-slate-800">
              {lang === 'ar' ? 'مكتبتي الرقمية' : 'My Downloads'}
            </Link>
            <Link to="/technical-support" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-white dark:bg-slate-800">
              {lang === 'ar' ? 'الدعم الفني' : 'Technical Support'}
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded bg-white dark:bg-slate-800">
              {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </Link>
          </div>
        )}
      </div>

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed top-20 end-6 z-50 max-w-sm bg-slate-900 text-white border border-amber-500/40 px-4 py-3 rounded-xl shadow-lg flex items-center justify-between gap-3">
          <span className="text-xs font-medium">{toast.message}</span>
          <button
            type="button"
            onClick={() => showToast('', 'info')}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Page Content */}
      <main className="flex-1">{children}</main>

      {/* Slide-out Shopping Cart Drawer */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full flex flex-col justify-between p-6 shadow-2xl border-s border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {lang === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
                </h2>
                <p className="text-xs text-slate-500">
                  {lang === 'ar'
                    ? `${cartCount} عنصر في السلة`
                    : `${cartCount} item(s) in your cart`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCartDrawerOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
                    {lang === 'ar' ? 'سلة التسوق فارغة حالياً' : 'Your shopping cart is currently empty'}
                  </p>
                  <Link
                    to="/marketplace"
                    onClick={() => setCartDrawerOpen(false)}
                    className="inline-block px-4 py-2 text-xs font-semibold bg-slate-900 dark:bg-amber-600 text-white rounded-lg"
                  >
                    {lang === 'ar' ? 'تصفح المنتجات الرقمية' : 'Browse Digital Products'}
                  </Link>
                </div>
              ) : (
                cart.map(({ product, quantity }) => {
                  const unitPrice = product.isFree
                    ? 0
                    : product.discountPrice && Number(product.discountPrice) > 0
                    ? Number(product.discountPrice)
                    : Number(product.price);
                  return (
                    <div
                      key={product.id}
                      className="flex items-start justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800"
                    >
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {lang === 'ar' ? product.titleAr : product.titleEn}
                        </h4>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {product.fileFormat} · {formatPrice(unitPrice, product.currency).formatted}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => updateCartQty(product.id, quantity - 1)}
                            className="w-6 h-6 rounded border border-slate-300 dark:border-slate-700 text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="text-xs font-mono tabular-nums">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(product.id, quantity + 1)}
                            className="w-6 h-6 rounded border border-slate-300 dark:border-slate-700 text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>{lang === 'ar' ? 'الإجمالي الفعلي:' : 'Total:'}</span>
                  <span className="font-mono tabular-nums text-amber-700 dark:text-amber-400">
                    {formatPrice(cartSubtotalEgp, 'EGP').formatted}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/cart"
                    onClick={() => setCartDrawerOpen(false)}
                    className="py-2.5 text-center text-xs font-semibold border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    {lang === 'ar' ? 'عرض السلة' : 'View Cart'}
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => setCartDrawerOpen(false)}
                    className="py-2.5 text-center text-xs font-semibold bg-slate-900 dark:bg-amber-600 text-white rounded-lg hover:bg-slate-800"
                  >
                    {lang === 'ar' ? 'إتمام الشراء' : 'Checkout'}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Comparison Modal */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="text-lg font-bold">
                {lang === 'ar' ? 'مقارنة المنتجات الرقمية' : 'Compare Digital Products'}
              </h3>
              <button
                type="button"
                onClick={() => setCompareModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {comparedProducts.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">
                {lang === 'ar' ? 'لا توجد منتجات محددة للمقارنة.' : 'No products selected for comparison.'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-start border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="py-3 px-4 text-start font-semibold">
                        {lang === 'ar' ? 'الخاصية' : 'Attribute'}
                      </th>
                      {comparedProducts.map((p) => (
                        <th key={p.id} className="py-3 px-4 text-start font-semibold">
                          <div className="flex items-center justify-between gap-2">
                            <span>{lang === 'ar' ? p.titleAr : p.titleEn}</span>
                            <button
                              type="button"
                              onClick={() => toggleCompare(p.id)}
                              className="text-rose-500 text-xs"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    <tr>
                      <td className="py-3 px-4 text-slate-500">{lang === 'ar' ? 'السعر' : 'Price'}</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-4 font-mono tabular-nums font-semibold">
                          {formatPrice(p.isFree ? 0 : p.discountPrice || p.price, p.currency).formatted}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-slate-500">{lang === 'ar' ? 'الصيغة' : 'Format'}</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-4 font-mono">
                          {p.fileFormat}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-slate-500">{lang === 'ar' ? 'الحجم' : 'File Size'}</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-4 font-mono tabular-nums">
                          {p.fileSizeLabel || '—'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-slate-500">{lang === 'ar' ? 'التحميلات الفعلية' : 'Downloads'}</td>
                      {comparedProducts.map((p) => (
                        <td key={p.id} className="py-3 px-4 font-mono tabular-nums">
                          {p.downloadsCount}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Store & Product Sharing Modal (Section 12) */}
      {shareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === 'ar' ? 'مشاركة الرابط الرسمي' : 'Share Official Canonical Link'}
              </h3>
              <button
                type="button"
                onClick={closeShareModal}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-4">
              {shareModal.title}
            </p>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `${shareModal.title} - ${shareModal.url}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  shareModal.url
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold transition-colors"
              >
                <span>Facebook</span>
              </a>

              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  shareModal.url
                )}&text=${encodeURIComponent(shareModal.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors"
              >
                <span>Telegram</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  shareModal.url
                )}&text=${encodeURIComponent(shareModal.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors border border-slate-700"
              >
                <span>X (Twitter)</span>
              </a>
            </div>

            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full mb-3 py-2.5 px-4 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4 text-amber-600" />
              <span>
                {lang === 'ar' ? 'مشاركة عبر تطبيقات الجهاز' : 'Native Device Share'}
              </span>
            </button>

            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
              <input
                type="text"
                readOnly
                value={shareModal.url}
                className="flex-1 bg-transparent text-xs font-mono text-slate-700 dark:text-slate-300 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleCopyShareLink(shareModal.url)}
                className="px-3 py-1.5 bg-slate-900 dark:bg-amber-600 text-white text-xs font-semibold rounded-md flex items-center gap-1 whitespace-nowrap shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : lang === 'ar' ? 'نسخ الرابط' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two Separate Floating WhatsApp Buttons (Section 4 — Non-overlapping, Distinct Colors, Clear Labels & Tooltips) */}
      <div
        className="fixed bottom-4 end-4 z-40 flex flex-col items-end gap-2.5 pointer-events-none"
        aria-label="Official WhatsApp Contacts"
      >
        {/* A. TECHNICAL SUPPORT: Dr. Eman Elahmer */}
        <a
          href={supportWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="الدعم الفني وخدمة العملاء والشراء والتحميل — د/ إيمان الأحمر (01032105770)"
          className="pointer-events-auto group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg transition-transform duration-150 hover:-translate-y-0.5 border border-emerald-500/40"
        >
          <WhatsAppIcon className="w-5 h-5 shrink-0" />
          <div className="flex flex-col text-start leading-tight">
            <span className="text-xs font-bold whitespace-nowrap">
              تواصل مع د/ إيمان الأحمر
            </span>
            <span className="text-[10px] text-emerald-100 font-mono tabular-nums whitespace-nowrap">
              الدعم الفني والعملاء · 01032105770
            </span>
          </div>
        </a>

        {/* B. WEBSITE DEVELOPER: Eng. Mahmoud Gamal */}
        <a
          href={developerWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="تطوير الموقع والأعطال التقنية والاستضافة — م/ محمود جمال (01093151840)"
          className="pointer-events-auto group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-amber-300 shadow-lg transition-transform duration-150 hover:-translate-y-0.5 border border-amber-500/50"
        >
          <WhatsAppIcon className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="flex flex-col text-start leading-tight">
            <span className="text-xs font-bold text-white whitespace-nowrap">
              تواصل مع المطور م/ محمود جمال
            </span>
            <span className="text-[10px] text-amber-300 font-mono tabular-nums whitespace-nowrap">
              الدعم البرمجي والتقني · 01093151840
            </span>
          </div>
        </a>
      </div>

      {/* FINAL OFFICIAL FOOTER (Section 25) */}
      <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-14 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top Row: Official Brand Lockup + Newsletter Subscription */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
            <div className="lg:col-span-6 space-y-3">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-white">
                  متجر اتحاد المترجمين العرب
                </h2>
                <p className="text-base font-semibold text-amber-400">
                  Online store alliance of arab translators
                </p>
              </div>
              <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                {lang === 'ar'
                  ? 'المنصة الرقمية والتجارية الرسمية المتخصصة في كتب ومراجع الترجمة، القواميس والمعاجم، الدورات التدريبية، والقوالب والأدوات الاحترافية للمترجمين العرب.'
                  : 'The official digital e-commerce marketplace specializing in translation books, references, lexicons, training courses, and professional translator tools.'}
              </p>
              <div className="pt-2 space-y-1 text-xs text-amber-300/90 font-medium">
                <p>جميع حقوق الطبع والنشر والملكية الفكرية محفوظة للدكتورة/ إيمان الأحمر.</p>
                <p>Copyright © 2026 د/ إيمان الأحمر (Dr. Eman Elahmer). All Rights Reserved.</p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-bold text-white mb-1">
                  {lang === 'ar'
                    ? 'النشرة البريدية الرسمية لمتجر اتحاد المترجمين العرب'
                    : 'Official Online store alliance of arab translators Newsletter'}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  {lang === 'ar'
                    ? 'اشترك للحصول على إشعارات بأحدث الإصدارات العلمية والملفات المجانية (مع إمكانية إلغاء الاشتراك في أي وقت).'
                    : 'Subscribe for updates on genuine new scholarly publications and free resources (unsubscribe anytime).'}
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder={lang === 'ar' ? 'أدخل بريدك الإلكتروني...' : 'Enter your email address...'}
                      className="flex-1 px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors whitespace-nowrap shrink-0"
                    >
                      {lang === 'ar' ? 'اشتراك الآن' : 'Subscribe'}
                    </button>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newsletterConsent}
                      onChange={(e) => setNewsletterConsent(e.target.checked)}
                      className="rounded border-slate-700"
                    />
                    <span>
                      {lang === 'ar'
                        ? 'أوافق على استلام إشعارات الإصدارات الجديدة وفق سياسة الخصوصية.'
                        : 'I consent to receive publication updates in accordance with the Privacy Policy.'}
                    </span>
                  </label>
                </form>
              </div>
            </div>
          </div>

          {/* Complete Multi-Page Directory Links (Ensuring all 39 pages are directly accessible) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-slate-800 text-xs">
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-sm mb-3">
                {lang === 'ar' ? 'أقسام المتجر والتسوق' : 'Marketplace & Catalog'}
              </h4>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-amber-400">{lang === 'ar' ? 'الصفحة الرئيسية' : 'Homepage'}</Link></li>
                <li><Link to="/marketplace" className="hover:text-amber-400">{lang === 'ar' ? 'المتجر الرئيسي' : 'Main Marketplace'}</Link></li>
                <li><Link to="/products" className="hover:text-amber-400">{lang === 'ar' ? 'جميع المنتجات' : 'All Products'}</Link></li>
                <li><Link to="/categories" className="hover:text-amber-400">{lang === 'ar' ? 'الأقسام والتصنيفات' : 'Product Categories'}</Link></li>
                <li><Link to="/featured" className="hover:text-amber-400">{lang === 'ar' ? 'المنتجات المميزة' : 'Featured Products'}</Link></li>
                <li><Link to="/new-arrivals" className="hover:text-amber-400">{lang === 'ar' ? 'أحدث الإصدارات' : 'New Arrivals'}</Link></li>
                <li><Link to="/best-sellers" className="hover:text-amber-400">{lang === 'ar' ? 'الأكثر مبيعاً' : 'Best Sellers'}</Link></li>
                <li><Link to="/special-offers" className="hover:text-amber-400">{lang === 'ar' ? 'العروض الخاصة' : 'Special Offers'}</Link></li>
                <li><Link to="/free-downloads" className="hover:text-amber-400">{lang === 'ar' ? 'التحميلات المجانية' : 'Free Downloads'}</Link></li>
                <li><Link to="/advanced-search" className="hover:text-amber-400">{lang === 'ar' ? 'البحث المتقدم' : 'Advanced Search'}</Link></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-sm mb-3">
                {lang === 'ar' ? 'حساب العميل والطلبات' : 'Customer Account & Orders'}
              </h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-amber-400">{lang === 'ar' ? 'تسجيل دخول العملاء' : 'Customer Login'}</Link></li>
                <li><Link to="/register" className="hover:text-amber-400">{lang === 'ar' ? 'إنشاء حساب جديد' : 'Customer Registration'}</Link></li>
                <li><Link to="/password-recovery" className="hover:text-amber-400">{lang === 'ar' ? 'استعادة كلمة المرور' : 'Password Recovery'}</Link></li>
                <li><Link to="/my-account" className="hover:text-amber-400">{lang === 'ar' ? 'لوحة حسابي' : 'My Account'}</Link></li>
                <li><Link to="/my-profile" className="hover:text-amber-400">{lang === 'ar' ? 'الملف الشخصي' : 'My Profile'}</Link></li>
                <li><Link to="/my-orders" className="hover:text-amber-400">{lang === 'ar' ? 'طلباتي وفواتيري' : 'My Orders'}</Link></li>
                <li><Link to="/my-downloads" className="hover:text-amber-400">{lang === 'ar' ? 'مكتبتي وتحميلاتي' : 'My Downloads'}</Link></li>
                <li><Link to="/my-favorites" className="hover:text-amber-400">{lang === 'ar' ? 'قائمة المفضلة' : 'My Favorites'}</Link></li>
                <li><Link to="/cart" className="hover:text-amber-400">{lang === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}</Link></li>
                <li><Link to="/checkout" className="hover:text-amber-400">{lang === 'ar' ? 'إتمام الطلب' : 'Checkout'}</Link></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-sm mb-3">
                {lang === 'ar' ? 'السياسات وحقوق الملكية' : 'Legal & IP Policies'}
              </h4>
              <ul className="space-y-2">
                <li><Link to="/copyright-policy" className="hover:text-amber-400 font-semibold text-amber-300">{lang === 'ar' ? 'سياسة حقوق الطبع والملكية الفكرية' : 'Copyright & IP Policy'}</Link></li>
                <li><Link to="/license-policy" className="hover:text-amber-400">{lang === 'ar' ? 'سياسة ترخيص المنتجات الرقمية' : 'Digital Product License'}</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-amber-400">{lang === 'ar' ? 'سياسة الخصوصية وملفات الارتباط' : 'Privacy & Cookie Policy'}</Link></li>
                <li><Link to="/terms" className="hover:text-amber-400">{lang === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}</Link></li>
                <li><Link to="/refund-policy" className="hover:text-amber-400">{lang === 'ar' ? 'سياسة الاسترجاع والاسترداد' : 'Refund Policy'}</Link></li>
                <li><Link to="/reviews" className="hover:text-amber-400">{lang === 'ar' ? 'التقييمات والمراجعات' : 'Reviews & Ratings'}</Link></li>
                <li><Link to="/faq" className="hover:text-amber-400">{lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</Link></li>
                <li><Link to="/maintenance" className="hover:text-amber-400">{lang === 'ar' ? 'حالة الصيانة' : 'Maintenance Status'}</Link></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-sm mb-3">
                {lang === 'ar' ? 'الدعم الفني والتواصل الرسمي' : 'Official Support & Contact'}
              </h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-amber-400">{lang === 'ar' ? 'من نحن' : 'About Us'}</Link></li>
                <li><Link to="/contact" className="hover:text-amber-400">{lang === 'ar' ? 'اتصل بنا' : 'Contact Us'}</Link></li>
                <li><Link to="/technical-support" className="hover:text-amber-400">{lang === 'ar' ? 'مركز الدعم الفني' : 'Technical Support Center'}</Link></li>
                <li><Link to="/support-tickets" className="hover:text-amber-400">{lang === 'ar' ? 'تذاكر الدعم الفني' : 'Customer Support Tickets'}</Link></li>
                <li><Link to="/developer-info" className="hover:text-amber-400">{lang === 'ar' ? 'معلومات مطور الموقع' : 'Developer Information'}</Link></li>
                <li><Link to="/admin-dashboard" className="hover:text-amber-400 text-amber-400">{lang === 'ar' ? 'لوحة تحكم الإدارة الخاصة' : 'Private Admin Dashboard'}</Link></li>
              </ul>

              <div className="pt-3 mt-3 border-t border-slate-800 space-y-2">
                <div>
                  <span className="block text-slate-400">Technical Support / الدعم الفني:</span>
                  <a
                    href={supportWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-emerald-400 hover:underline font-mono tabular-nums"
                  >
                    د/ إيمان الأحمر — 01032105770
                  </a>
                </div>
                <div>
                  <span className="block text-slate-400">Website Developer / مطور الموقع:</span>
                  <a
                    href={developerWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-amber-400 hover:underline font-mono tabular-nums"
                  >
                    م/ محمود جمال — 01093151840
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Official Social Media Links (Section 18) & Final Copyright Bar (Section 25) */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-3">
              {(socialLinks.length > 0
                ? socialLinks
                : [
                    {
                      platform: 'facebook',
                      labelAr: 'فيسبوك',
                      labelEn: 'Facebook',
                      url: 'https://www.facebook.com/share/1EsrHvUQKk/',
                    },
                    {
                      platform: 'instagram',
                      labelAr: 'إنستغرام',
                      labelEn: 'Instagram',
                      url: 'https://www.instagram.com/nour112338?igsh=dXR6OGEzbXBxMGFm',
                    },
                    {
                      platform: 'facebook_community',
                      labelAr: 'مجتمع فيسبوك',
                      labelEn: 'Facebook Community',
                      url: 'https://www.facebook.com/share/g/1AVfo3xCDz/',
                    },
                    {
                      platform: 'tiktok',
                      labelAr: 'تيك توك',
                      labelEn: 'TikTok',
                      url: 'https://www.tiktok.com/@emanelahmer1?_r=1&_t=ZS-98sd4DxSbmi',
                    },
                    {
                      platform: 'youtube',
                      labelAr: 'يوتيوب',
                      labelEn: 'YouTube',
                      url: 'https://youtube.com/@emananwarelahmar9059?si=6UbiPWyZZC6MLLCM',
                    },
                  ]
              ).map((soc, idx) => (
                <a
                  key={idx}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <span>{lang === 'ar' ? soc.labelAr : soc.labelEn}</span>
                  <ExternalLink className="w-3 h-3 text-amber-400" />
                </a>
              ))}
            </div>

            <div className="text-center md:text-end text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-white">
                جميع حقوق الطبع والنشر والملكية الفكرية محفوظة للدكتورة/ إيمان الأحمر.
              </p>
              <p>Copyright © 2026 Dr. Eman Elahmer. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
