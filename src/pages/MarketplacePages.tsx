import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Download,
  FileText,
  FolderOpen,
  Search,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Heart,
  ExternalLink,
  HelpCircle,
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useStore, ProductItem } from '../context/StoreContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';

const HERO_IMAGE = '/src/assets/images/hero_translation_library_1794830079396.jpg';
const EDITORIAL_IMAGE = '/src/assets/images/editorial_publishing_desk_1794830080096.jpg';
const ARCHIVE_IMAGE = '/src/assets/images/digital_archive_workspace_1794830081387.jpg';

const SUPPORTED_FORMATS = [
  'ALL',
  'PDF',
  'DOC',
  'DOCX',
  'XLS',
  'XLSX',
  'PPT',
  'PPTX',
  'ZIP',
  'RAR',
  'MP3',
  'WAV',
  'MP4',
  'JPG',
  'PNG',
  'SVG',
  'EPUB',
];

// ============================================================================
// 1. HOMEPAGE (/) — Strict 3-Section E-Commerce Discipline + Real DB Stats
// ============================================================================
export const HomePage: React.FC = () => {
  const {
    lang,
    categories,
    products,
    stats,
    socialLinks,
    isSuperAdmin,
    openShareModal,
  } = useStore();

  const featuredProducts = useMemo(() => {
    const feat = products.filter((p) => p.isFeatured);
    return feat.length > 0 ? feat.slice(0, 6) : products.slice(0, 6);
  }, [products]);

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div>
      {/* Section 1: Storefront Split Hero + Full-Width Real Database KPI Strip Below */}
      <section className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-amber-400 tracking-wide">
                  متجر اتحاد المترجمين العرب · Online store alliance of arab translators
                </p>
                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white"
                  style={{ textWrap: 'balance' }}
                >
                  {lang === 'ar'
                    ? 'المنصة الرقمية المتكاملة لكتب ومراجع الترجمة والقواميس والدورات التدريبية'
                    : 'The Official Digital Marketplace for Translation Books, Lexicons & Professional Courses'}
                </h1>
              </div>

              <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
                {lang === 'ar'
                  ? 'إصدارات رقمية أصلية، معاجم متخصصة، حقائب تدريبية، وقوالب جاهزة للمترجمين والباحثين تحت إشراف وحقوق الملكية الفكرية للدكتورة/ إيمان الأحمر.'
                  : 'Authentic digital publications, specialized bilingual dictionaries, training courses, and professional translator templates under the intellectual property and supervision of Dr. Eman Elahmer.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/marketplace"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <span>{lang === 'ar' ? 'تصفح المتجر الرقمي' : 'Explore Marketplace'}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>
                <Link
                  to="/categories"
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-lg border border-slate-700 transition-colors whitespace-nowrap shrink-0"
                >
                  {lang === 'ar' ? 'استعراض الأقسام (9 أقسام)' : 'Browse Categories'}
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    openShareModal({
                      title: 'متجر اتحاد المترجمين العرب | Online store alliance of arab translators',
                      url: window.location.origin,
                    })
                  }
                  className="px-4 py-3 bg-transparent hover:bg-slate-800 text-slate-200 font-medium text-sm rounded-lg border border-slate-700 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'ar' ? 'مشاركة المتجر' : 'Share Store'}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative h-full min-h-[280px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-800">
                <img
                  src={HERO_IMAGE}
                  alt="متجر اتحاد المترجمين العرب - Online store alliance of arab translators"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-6">
                  <p className="text-xs font-semibold text-amber-300">
                    جميع حقوق الطبع والنشر والملكية الفكرية محفوظة للدكتورة/ إيمان الأحمر
                  </p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Copyright © 2026 Dr. Eman Elahmer. All Rights Reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width Real Database Statistics Strip Below Hero Split */}
          <div className="mt-10 pt-8 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <span className="block text-xs text-slate-400">
                {lang === 'ar' ? 'الأقسام الرسمية المعتمدة' : 'Official Store Categories'}
              </span>
              <span className="mt-1 block text-2xl font-bold font-mono tabular-nums text-white">
                {stats.totalCategories}
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-400">
                {lang === 'ar' ? 'الإصدارات المنشورة حالياً' : 'Published Digital Products'}
              </span>
              <span className="mt-1 block text-2xl font-bold font-mono tabular-nums text-amber-400">
                {stats.totalProducts}
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-400">
                {lang === 'ar' ? 'إجمالي التحميلات الفعلية' : 'Verified File Downloads'}
              </span>
              <span className="mt-1 block text-2xl font-bold font-mono tabular-nums text-white">
                {stats.totalDownloads}
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-400">
                {lang === 'ar' ? 'مراجعات المشترين الموثقين' : 'Verified Buyer Reviews'}
              </span>
              <span className="mt-1 block text-2xl font-bold font-mono tabular-nums text-white">
                {stats.totalReviews}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Featured Products Collection (or Honest Empty Catalog Launch State) */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {lang === 'ar' ? 'إصدارات المتجر الرقمي' : 'Marketplace Digital Publications'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {lang === 'ar'
                ? 'جميع المعروضات والأسعار مستمدة مباشرة من قاعدة البيانات الرسمية دون أي بيانات افتراضية.'
                : 'All products and prices are loaded directly from live database records with zero fictional items.'}
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span>{lang === 'ar' ? 'عرض جميع المنتجات' : 'View All Products'}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {lang === 'ar'
                      ? 'سياسة الشفافية الكاملة — كتالوج جاهز للرفع الرسمي'
                      : 'Authentic Data Policy — Catalog Ready for Official Uploads'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {lang === 'ar'
                    ? 'المتجر مهيأ بالكامل وفي انتظار رفع الإصدارات الأصلية من قِبل الإدارة'
                    : 'Marketplace Provisioned & Ready for Genuine Administrator Product Uploads'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {lang === 'ar'
                    ? 'التزاماً بمعايير المصداقية وعدم عرض أي منتجات أو أسعار وهمية، يبدأ المتجر بكتالوج فارغ تماماً. يمكن للدكتورة/ إيمان الأحمر (عبر حساب الإدارة المعتمد Aleman201451@gmail.com) الدخول إلى لوحة التحكم ورفع الكتب والملفات وتحديد الأسعار الحقيقية.'
                    : 'In strict compliance with our No-Fictional-Data Policy, the marketplace launches with a clean, empty product catalog. Dr. Eman Elahmer (via verified Super Admin account Aleman201451@gmail.com) can upload genuine books, files, and prices from the Administrator Dashboard.'}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to="/categories"
                    className="px-5 py-2.5 bg-slate-900 dark:bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    {lang === 'ar' ? 'استعراض الأقسام المعتمدة' : 'Explore Official Categories'}
                  </Link>
                  {isSuperAdmin ? (
                    <Link
                      to="/admin-dashboard"
                      className="px-5 py-2.5 border border-amber-600 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-lg hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      {lang === 'ar' ? 'إضافة أول منتج من لوحة الإدارة' : 'Upload First Product in Admin'}
                    </Link>
                  ) : (
                    <Link
                      to="/technical-support"
                      className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                    >
                      {lang === 'ar' ? 'تواصل مع الدعم الفني' : 'Contact Technical Support'}
                    </Link>
                  )}
                </div>
              </div>
              <div className="lg:col-span-5">
                <img
                  src={EDITORIAL_IMAGE}
                  alt="Academic Translation Reference Volumes"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-cover rounded-xl border border-slate-200 dark:border-slate-800"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Section 3: Official Categories Grid & Institutional Ownership / Social Community */}
      <section className="bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-14">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {lang === 'ar' ? 'الأقسام الرسمية للمتجر' : 'Official Store Categories'}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {lang === 'ar'
                    ? 'تصنيفات متخصصة تغطي كافة احتياجات المترجمين واللغويين بصيغ PDF وDOCX وXLSX وPPTX وZIP وMP3 وMP4 وEPUB.'
                    : 'Specialized categories covering translator resources in PDF, DOCX, XLSX, PPTX, ZIP, MP3, MP4, and EPUB formats.'}
                </p>
              </div>
              <Link
                to="/categories"
                className="text-sm font-semibold text-amber-700 dark:text-amber-400 hover:underline"
              >
                {lang === 'ar' ? 'فتح دليل الأقسام الكامل' : 'Full Categories Directory'}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-amber-500 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                          {lang === 'ar' ? cat.nameAr : cat.nameEn}
                        </h3>
                        <span className="text-xs font-mono tabular-nums text-slate-500">
                          {count} {lang === 'ar' ? 'منتج' : 'items'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                        {lang === 'ar' ? cat.nameEn : cat.nameAr}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {lang === 'ar' ? cat.descriptionAr : cat.descriptionEn}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400">
                      <span>{lang === 'ar' ? 'استعراض القسم' : 'Browse Category'}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Institutional Ownership & Official Social Media Channels */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <img
                  src={ARCHIVE_IMAGE}
                  alt="Digital Archive Workspace"
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-cover rounded-xl"
                />
              </div>
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {lang === 'ar'
                    ? 'إشراف علمي وحماية كاملة لحقوق الملكية الفكرية'
                    : 'Scholarly Supervision & Protected Intellectual Property'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {lang === 'ar'
                    ? 'جميع حقوق الطبع والنشر والملكية الفكرية للمحتوى الأصلي والإصدارات الرقمية المملوكة للمتجر محفوظة للدكتورة/ إيمان الأحمر. يتم تسليم الملفات الرقمية عبر روابط مشفرة وموقعة زمنياً لضمان أمان المشتريات.'
                    : 'All original branding, digital publications, and platform materials owned by the store are protected under Copyright © 2026 Dr. Eman Elahmer. Purchased digital files are delivered via time-limited signed URLs.'}
                </p>

                <div className="pt-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-white mb-3">
                    {lang === 'ar'
                      ? 'تابع الحسابات والمجتمعات الرسمية لمتجر اتحاد المترجمين العرب:'
                      : 'Follow Official Online store alliance of arab translators Channels:'}
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {socialLinks.map((soc) => (
                      <a
                        key={soc.id}
                        href={soc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <span>{lang === 'ar' ? soc.labelAr : soc.labelEn}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ============================================================================
// 2. MAIN MARKETPLACE (/marketplace)
// ============================================================================
export const MainMarketplacePage: React.FC = () => {
  const { lang, categories, products, recentlyViewedIds } = useStore();
  const [selectedCat, setSelectedCat] = useState<number | 'ALL'>('ALL');
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');
  const [priceFilter, setPriceFilter] = useState<'ALL' | 'FREE' | 'PAID'>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'best_selling' | 'most_downloaded' | 'price_asc'>('newest');
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCat !== 'ALL' && p.categoryId !== selectedCat) return false;
        if (selectedFormat !== 'ALL' && p.fileFormat.toUpperCase() !== selectedFormat) return false;
        if (priceFilter === 'FREE' && !p.isFree && Number(p.price) > 0) return false;
        if (priceFilter === 'PAID' && (p.isFree || Number(p.price) === 0)) return false;
        if (query.trim()) {
          const q = query.trim().toLowerCase();
          const matchAr = p.titleAr.toLowerCase().includes(q) || p.descriptionAr.toLowerCase().includes(q);
          const matchEn = p.titleEn.toLowerCase().includes(q) || p.descriptionEn.toLowerCase().includes(q);
          if (!matchAr && !matchEn) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'best_selling') return (b.salesCount || 0) - (a.salesCount || 0);
        if (sortBy === 'most_downloaded') return (b.downloadsCount || 0) - (a.downloadsCount || 0);
        if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, selectedCat, selectedFormat, priceFilter, sortBy, query]);

  const recentlyViewedProducts = products.filter((p) => recentlyViewedIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            {lang === 'ar' ? 'السوق الرقمي الرئيسي — متجر اتحاد المترجمين العرب' : 'Main Digital Marketplace — Online store alliance of arab translators'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'ar'
              ? 'تصفح وابحث في جميع الكتب والمراجع والقواميس والملفات الرقمية المعتمدة.'
              : 'Browse and filter all verified translation books, references, dictionaries, and digital files.'}
          </p>
        </div>
        <Link
          to="/advanced-search"
          className="px-4 py-2.5 bg-slate-900 dark:bg-amber-600 text-white text-xs font-semibold rounded-lg flex items-center gap-2 self-start whitespace-nowrap shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{lang === 'ar' ? 'البحث المتقدم الشامل' : 'Full Advanced Search'}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
                {lang === 'ar' ? 'بحث سريع' : 'Quick Filter'}
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'عنوان الكتاب أو الوصف...' : 'Title or keyword...'}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                {lang === 'ar' ? 'الأقسام' : 'Categories'}
              </h3>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedCat('ALL')}
                  className={`w-full text-start px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCat === 'ALL'
                      ? 'bg-slate-900 text-white dark:bg-amber-600'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  {lang === 'ar' ? 'جميع الأقسام' : 'All Categories'}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCat(cat.id)}
                    className={`w-full text-start px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCat === cat.id
                        ? 'bg-slate-900 text-white dark:bg-amber-600'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    {lang === 'ar' ? cat.nameAr : cat.nameEn}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
                {lang === 'ar' ? 'صيغة الملف الرقمي' : 'Digital File Format'}
              </label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg"
              >
                {SUPPORTED_FORMATS.map((fmt) => (
                  <option key={fmt} value={fmt}>
                    {fmt === 'ALL' ? (lang === 'ar' ? 'جميع الصيغ' : 'All Formats') : fmt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
                {lang === 'ar' ? 'نوع الإتاحة' : 'Access Type'}
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
                {(['ALL', 'FREE', 'PAID'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPriceFilter(mode)}
                    className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      priceFilter === mode
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {mode === 'ALL'
                      ? lang === 'ar'
                        ? 'الكل'
                        : 'All'
                      : mode === 'FREE'
                      ? lang === 'ar'
                        ? 'مجاني'
                        : 'Free'
                      : lang === 'ar'
                      ? 'مدفوع'
                      : 'Paid'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Viewport */}
        <div className="lg:col-span-9 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {lang === 'ar'
                ? `عدد النتائج الفعلية: ${filteredProducts.length} منتج`
                : `Showing ${filteredProducts.length} real product(s)`}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{lang === 'ar' ? 'ترتيب حسب:' : 'Sort by:'}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg"
              >
                <option value="newest">{lang === 'ar' ? 'الأحدث إضافة' : 'Newest Arrivals'}</option>
                <option value="best_selling">{lang === 'ar' ? 'الأكثر مبيعاً (فعلياً)' : 'Actual Best Selling'}</option>
                <option value="most_downloaded">{lang === 'ar' ? 'الأكثر تحميلاً (فعلياً)' : 'Most Downloaded'}</option>
                <option value="price_asc">{lang === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
              <BookOpen className="w-10 h-10 text-amber-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === 'ar'
                  ? 'لا توجد منتجات منشورة تطابق معايير التصفية الحالية'
                  : 'No published products match the selected filter criteria'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {lang === 'ar'
                  ? 'يعرض المتجر فقط المنتجات الحقيقية المرفوعة من قِبل الإدارة دون أي منتجات افتراضية.'
                  : 'The store strictly displays genuine products uploaded by the administrator with zero fictional placeholders.'}
              </p>
            </div>
          )}

          {/* Recently Viewed Products */}
          {recentlyViewedProducts.length > 0 && (
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold mb-4">
                {lang === 'ar' ? 'منتجات شاهدتها مؤخراً' : 'Recently Viewed Products'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentlyViewedProducts.slice(0, 3).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. COLLECTION PAGES (/products, /featured, /new-arrivals, /best-sellers, /special-offers, /free-downloads)
// ============================================================================
export const CatalogCollectionPage: React.FC<{
  mode: 'all' | 'featured' | 'new' | 'bestsellers' | 'offers' | 'free';
}> = ({ mode }) => {
  const { lang, products } = useStore();

  const headerInfo = {
    all: {
      titleAr: 'جميع المنتجات الرقمية',
      titleEn: 'All Digital Products',
      descAr: 'القائمة الكاملة لجميع الكتب والملفات والقواميس والدورات المنشورة في المتجر.',
      descEn: 'Complete catalog of all published books, files, dictionaries, and courses.',
    },
    featured: {
      titleAr: 'المنتجات المميزة',
      titleEn: 'Featured Products',
      descAr: 'إصدارات مختارة ومميزة من قِبل إدارة متجر اتحاد المترجمين العرب.',
      descEn: 'Curated publications highlighted by the Online store alliance of arab translators administration.',
    },
    new: {
      titleAr: 'أحدث الإصدارات',
      titleEn: 'New Arrivals',
      descAr: 'أحدث الكتب والملفات الرقمية المضافة حديثاً إلى المتجر مرتبة زمنياً.',
      descEn: 'Latest digital publications added to the marketplace in chronological order.',
    },
    bestsellers: {
      titleAr: 'الأكثر مبيعاً',
      titleEn: 'Best Sellers',
      descAr: 'المنتجات الأعلى مبيعاً بناءً على سجلات الطلبات المؤكدة الفعلية في قاعدة البيانات.',
      descEn: 'Top-selling products ranked strictly by real confirmed database orders.',
    },
    offers: {
      titleAr: 'العروض والتخفيضات الخاصة',
      titleEn: 'Special Offers & Discounts',
      descAr: 'المنتجات التي تتضمن خصومات حقيقية مفعلة من قِبل إدارة المتجر.',
      descEn: 'Products featuring genuine active price discounts configured by the administrator.',
    },
    free: {
      titleAr: 'التحميلات والمنتجات المجانية',
      titleEn: 'Free Downloads',
      descAr: 'ملفات ومراجع مجانية متاحة للتحميل المباشر للمترجمين والباحثين.',
      descEn: 'Complimentary files and references available for direct download.',
    },
  }[mode];

  const items = useMemo(() => {
    const copy = [...products];
    if (mode === 'featured') return copy.filter((p) => p.isFeatured);
    if (mode === 'new')
      return copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    if (mode === 'bestsellers')
      return copy
        .filter((p) => (p.salesCount || 0) > 0)
        .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    if (mode === 'offers')
      return copy.filter(
        (p) =>
          p.isSpecialOffer ||
          (p.discountPrice !== null &&
            p.discountPrice !== undefined &&
            Number(p.discountPrice) > 0 &&
            Number(p.discountPrice) < Number(p.price))
      );
    if (mode === 'free') return copy.filter((p) => p.isFree || Number(p.price) === 0);
    return copy;
  }, [products, mode]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          {lang === 'ar' ? headerInfo.titleAr : headerInfo.titleEn}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {lang === 'ar' ? headerInfo.descAr : headerInfo.descEn}
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <FolderOpen className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {lang === 'ar'
              ? 'لا توجد منتجات مسجلة في هذا القسم حالياً'
              : 'No products currently registered in this collection'}
          </h2>
          <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
            {lang === 'ar'
              ? 'تظهر المنتجات هنا تلقائياً فور قيام إدارة المتجر برفعها أو تفعيل حالتها في قاعدة البيانات.'
              : 'Products appear here automatically as soon as the store administrator uploads or activates them in the database.'}
          </p>
          <div className="pt-2">
            <Link
              to="/categories"
              className="inline-block px-5 py-2.5 bg-slate-900 dark:bg-amber-600 text-white text-xs font-semibold rounded-lg"
            >
              {lang === 'ar' ? 'تصفح أقسام المتجر' : 'Browse Store Categories'}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 4. PRODUCT CATEGORIES DIRECTORY (/categories) & CATEGORY DETAILS (/category/:slug)
// ============================================================================
export const CategoriesDirectoryPage: React.FC = () => {
  const { lang, categories, products } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          {lang === 'ar' ? 'أقسام وتصنيفات المتجر الرقمي' : 'Marketplace Product Categories'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {lang === 'ar'
            ? 'الأقسام الرسمية المعتمدة في متجر اتحاد المترجمين العرب لجميع التخصصات اللغوية والترجمية.'
            : 'Official categories in the Online store alliance of arab translators covering all linguistic and translation disciplines.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-amber-500 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {lang === 'ar' ? cat.nameAr : cat.nameEn}
                  </h2>
                  <span className="text-xs font-mono tabular-nums text-amber-700 dark:text-amber-400">
                    {count} {lang === 'ar' ? 'منتج' : 'items'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  {lang === 'ar' ? cat.nameEn : cat.nameAr}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {lang === 'ar' ? cat.descriptionAr : cat.descriptionEn}
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-amber-700 dark:text-amber-400">
                {lang === 'ar' ? 'فتح صفحة القسم ←' : 'View Category Details →'}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const CategoryDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, categories, products } = useStore();

  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = useMemo(() => {
    if (!category) return [];
    if (category.slug === 'free-products') {
      return products.filter((p) => p.categoryId === category.id || p.isFree);
    }
    return products.filter((p) => p.categoryId === category.id);
  }, [category, products]);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold">{lang === 'ar' ? 'القسم غير موجود' : 'Category Not Found'}</h1>
        <Link to="/categories" className="inline-block px-4 py-2 bg-slate-900 text-white text-xs rounded-lg">
          {lang === 'ar' ? 'العودة إلى الأقسام' : 'Back to Categories'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="text-xs text-slate-500 mb-2">
          <Link to="/categories" className="hover:underline">
            {lang === 'ar' ? 'الأقسام' : 'Categories'}
          </Link>{' '}
          / <span>{lang === 'ar' ? category.nameAr : category.nameEn}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          {lang === 'ar' ? category.nameAr : category.nameEn}
        </h1>
        <p className="text-sm text-amber-700 dark:text-amber-400 font-medium mt-0.5">
          {lang === 'ar' ? category.nameEn : category.nameAr}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-3xl">
          {lang === 'ar' ? category.descriptionAr : category.descriptionEn}
        </p>
      </div>

      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
          <BookOpen className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="text-base font-bold">
            {lang === 'ar'
              ? `لا توجد منتجات مرفوعة حالياً في قسم "${category.nameAr}"`
              : `No products currently uploaded in "${category.nameEn}"`}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'ar'
              ? 'سيتم عرض الإصدارات الرقمية في هذا القسم فور إضافتها من لوحة تحكم الإدارة.'
              : 'Digital publications will appear here as soon as they are uploaded via the Administrator Dashboard.'}
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 5. PRODUCT DETAILS PAGE (/product/:slug) — Contiguous Purchase Module, License, Reviews, Q&A
// ============================================================================
export const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const {
    lang,
    user,
    products,
    categories,
    formatPrice,
    addToCart,
    favoriteIds,
    toggleFavorite,
    openShareModal,
    triggerSecureDownload,
    recordProductView,
    authFetch,
    showToast,
  } = useStore();

  const [detailData, setDetailData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [questionText, setQuestionText] = useState('');

  const loadDetails = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        setDetailData(data);
        if (data.product?.id) {
          recordProductView(data.product.id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="h-96 rounded-2xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
      </div>
    );
  }

  if (!detailData || !detailData.product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold">
          {lang === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}
        </h1>
        <Link to="/marketplace" className="inline-block px-5 py-2.5 bg-slate-900 text-white text-xs rounded-lg">
          {lang === 'ar' ? 'العودة إلى المتجر' : 'Back to Marketplace'}
        </Link>
      </div>
    );
  }

  const product: ProductItem = detailData.product;
  const category = categories.find((c) => c.id === product.categoryId);
  const hasDiscount =
    !product.isFree &&
    product.discountPrice !== null &&
    Number(product.discountPrice) > 0 &&
    Number(product.discountPrice) < Number(product.price);
  const effectivePrice = product.isFree
    ? 0
    : hasDiscount
    ? Number(product.discountPrice)
    : Number(product.price);

  const priceInfo = formatPrice(effectivePrice, product.currency);
  const canonicalUrl = `${window.location.origin}/product/${product.slug}`;
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 3);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast(lang === 'ar' ? 'يرجى تسجيل الدخول لإضافة تقييم' : 'Please sign in to submit a review', 'info');
      return;
    }
    const res = await authFetch('/api/reviews', {
      method: 'POST',
      body: JSON.stringify({
        productId: product.id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      }),
    });
    if (res.ok) {
      setReviewTitle('');
      setReviewComment('');
      showToast(lang === 'ar' ? 'تم نشر تقييمك بنجاح' : 'Review submitted successfully', 'success');
      loadDetails();
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast(lang === 'ar' ? 'يرجى تسجيل الدخول لطرح سؤال' : 'Please sign in to ask a question', 'info');
      return;
    }
    const res = await authFetch('/api/questions', {
      method: 'POST',
      body: JSON.stringify({
        productId: product.id,
        question: questionText,
      }),
    });
    if (res.ok) {
      setQuestionText('');
      showToast(lang === 'ar' ? 'تم إرسال سؤالك للإدارة' : 'Question submitted', 'success');
      loadDetails();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-14">
      {/* Main Contiguous PDP Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Product Gallery Left/Start */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {product.mainImageUrl ? (
              <img
                src={product.mainImageUrl}
                alt={lang === 'ar' ? product.titleAr : product.titleEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900 text-white">
                <FileText className="w-16 h-16 text-amber-400 mb-3" />
                <span className="text-sm font-mono uppercase text-amber-300">{product.fileFormat}</span>
                <h2 className="text-lg font-bold mt-2">{product.titleAr}</h2>
              </div>
            )}
          </div>

          {product.previewUrl && (
            <a
              href={product.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ExternalLink className="w-4 h-4 text-amber-600" />
              <span>{lang === 'ar' ? 'معاينة مقتطف من المنتج الرقمي' : 'Preview Digital Sample'}</span>
            </a>
          )}
        </div>

        {/* Contiguous Purchase Module Right/End */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>
              {category
                ? lang === 'ar'
                  ? category.nameAr
                  : category.nameEn
                : lang === 'ar'
                ? 'إصدار رقمي'
                : 'Digital Publication'}
            </span>
            <span>·</span>
            <span className="font-mono">SKU: {product.sku}</span>
            <span>·</span>
            <span className="font-mono">{product.fileFormat}</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {product.titleAr}
            </h1>
            <p className="text-base font-medium text-amber-700 dark:text-amber-400 mt-1">
              {product.titleEn}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="block text-xs text-slate-500">
                {lang === 'ar' ? 'السعر الفعلي:' : 'Price:'}
              </span>
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {priceInfo.formatted}
              </span>
              {priceInfo.isConverted && (
                <span className="block text-[11px] font-mono text-slate-500">
                  ({lang === 'ar' ? 'عملة المعاملة الأساسية:' : 'Base transaction:'} {priceInfo.actualTransactionText})
                </span>
              )}
            </div>
            <div className="text-end text-xs text-slate-500 font-mono tabular-nums space-y-1">
              <div>{lang === 'ar' ? 'الصيغة:' : 'Format:'} {product.fileFormat}</div>
              {product.fileSizeLabel && <div>{lang === 'ar' ? 'الحجم:' : 'Size:'} {product.fileSizeLabel}</div>}
              <div>{lang === 'ar' ? 'التحميلات:' : 'Downloads:'} {product.downloadsCount}</div>
            </div>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {lang === 'ar'
              ? product.descriptionAr || product.shortDescriptionAr
              : product.descriptionEn || product.shortDescriptionEn || product.descriptionAr}
          </p>

          {/* Primary Purchase / Download Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {product.isFree || Number(product.price) === 0 ? (
              <button
                type="button"
                onClick={() => triggerSecureDownload(product)}
                className="flex-1 py-3 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تحميل مجاني مباشر' : 'Instant Free Download'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => addToCart(product, 1)}
                className="flex-1 py-3 px-6 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إضافة إلى سلة التسوق' : 'Add to Shopping Cart'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => toggleFavorite(product.id)}
              className="p-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-amber-500"
              title={lang === 'ar' ? 'المفضلة' : 'Favorite'}
            >
              <Heart
                className="w-5 h-5 text-rose-600"
                fill={favoriteIds.includes(product.id) ? 'currentColor' : 'none'}
              />
            </button>

            <button
              type="button"
              onClick={() =>
                openShareModal({
                  title: `${product.titleAr} | ${product.titleEn}`,
                  url: canonicalUrl,
                })
              }
              className="p-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-amber-500"
              title={lang === 'ar' ? 'مشاركة المنتج' : 'Share Product'}
            >
              <Share2 className="w-5 h-5 text-amber-600" />
            </button>
          </div>

          {/* Official Copyright & Digital Product License Notice (Section 3) */}
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-amber-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>ترخيص المنتج الرقمي وحقوق الملكية الفكرية</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              جميع حقوق الطبع والنشر والملكية الفكرية محفوظة للدكتورة/ إيمان الأحمر.
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              {lang === 'ar' ? product.licenseTermsAr : product.licenseTermsEn}
            </p>
          </div>
        </div>
      </div>

      {/* Product Reviews & Questions Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-8 border-t border-slate-200 dark:border-slate-800">
        {/* Verified Reviews */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">
            {lang === 'ar' ? 'تقييمات ومراجعات المشترين' : 'Customer Reviews & Ratings'} (
            {detailData.reviews?.length || 0})
          </h2>

          {detailData.reviews?.length === 0 ? (
            <p className="text-xs text-slate-500">
              {lang === 'ar' ? 'لا توجد مراجعات مسجلة لهذا المنتج بعد.' : 'No reviews submitted for this product yet.'}
            </p>
          ) : (
            <div className="space-y-4">
              {detailData.reviews.map((rev: any) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold">{rev.reviewerName}</span>
                    <span className="font-mono text-amber-600">
                      {'★'.repeat(rev.rating)}
                      {rev.isVerifiedBuyer
                        ? lang === 'ar'
                          ? ' · مشتري موثق'
                          : ' · Verified Buyer'
                        : ''}
                    </span>
                  </div>
                  {rev.title && <p className="text-xs font-semibold">{rev.title}</p>}
                  <p className="text-xs text-slate-600 dark:text-slate-400">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}

          <form
            onSubmit={handleSubmitReview}
            className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
          >
            <h3 className="text-sm font-bold">
              {lang === 'ar' ? 'أضف تقييمك للمنتج' : 'Write a Product Review'}
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <span>{lang === 'ar' ? 'التقييم:' : 'Rating:'}</span>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} / 5
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder={lang === 'ar' ? 'عنوان التقييم' : 'Review headline'}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
            />
            <textarea
              required
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder={lang === 'ar' ? 'اكتب تجربتك الحقيقية مع هذا الإصدار...' : 'Share your experience with this publication...'}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 dark:bg-amber-600 text-white text-xs font-semibold rounded-lg"
            >
              {lang === 'ar' ? 'إرسال التقييم' : 'Submit Review'}
            </button>
          </form>
        </div>

        {/* Product Questions & Answers */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">
            {lang === 'ar' ? 'الأسئلة والاستفسارات حول المنتج' : 'Product Questions & Answers'} (
            {detailData.questions?.length || 0})
          </h2>

          {detailData.questions?.length === 0 ? (
            <p className="text-xs text-slate-500">
              {lang === 'ar' ? 'لا توجد استفسارات مطروحة حول هذا المنتج بعد.' : 'No questions asked about this product yet.'}
            </p>
          ) : (
            <div className="space-y-4">
              {detailData.questions.map((q: any) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                >
                  <p className="font-bold text-slate-900 dark:text-white">
                    س: {q.question} <span className="font-normal text-slate-500">({q.askerName})</span>
                  </p>
                  {q.answer ? (
                    <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                      ج ({q.answeredBy}): {q.answer}
                    </p>
                  ) : (
                    <p className="text-slate-400">
                      {lang === 'ar' ? 'بانتظار رد الإدارة...' : 'Awaiting administrator response...'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <form
            onSubmit={handleSubmitQuestion}
            className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
          >
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>{lang === 'ar' ? 'اطرح سؤالاً حول هذا المنتج' : 'Ask a Question About This Product'}</span>
            </h3>
            <textarea
              required
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'اكتب استفسارك حول محتوى الكتاب أو صيغة الملف...'
                  : 'Ask about table of contents, file compatibility, or licensing...'
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 dark:bg-amber-600 text-white text-xs font-semibold rounded-lg"
            >
              {lang === 'ar' ? 'إرسال السؤال' : 'Post Question'}
            </button>
          </form>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold mb-6">
            {lang === 'ar' ? 'منتجات ذات صلة في نفس القسم' : 'Related Products'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 6. SEARCH RESULTS (/search) & ADVANCED SEARCH (/advanced-search)
// ============================================================================
export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const { lang, products } = useStore();

  const results = useMemo(() => {
    if (!q.trim()) return products;
    const lower = q.trim().toLowerCase();
    return products.filter(
      (p) =>
        p.titleAr.toLowerCase().includes(lower) ||
        p.titleEn.toLowerCase().includes(lower) ||
        p.descriptionAr.toLowerCase().includes(lower) ||
        p.descriptionEn.toLowerCase().includes(lower) ||
        p.fileFormat.toLowerCase().includes(lower)
    );
  }, [products, q]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {lang === 'ar' ? `نتائج البحث عن: "${q}"` : `Search Results for: "${q}"`}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ar' ? `تم العثور على ${results.length} نتيجة فعلية` : `Found ${results.length} matching product(s)`}
          </p>
        </div>
        <Link
          to="/advanced-search"
          className="px-4 py-2 bg-slate-900 dark:bg-amber-600 text-white text-xs font-semibold rounded-lg"
        >
          {lang === 'ar' ? 'تخصيص البحث المتقدم' : 'Refine in Advanced Search'}
        </Link>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
          <Search className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="text-base font-bold">
            {lang === 'ar' ? 'لم يتم العثور على منتجات مطابقة لبحثك' : 'No matching products found'}
          </h2>
          <Link to="/categories" className="inline-block px-4 py-2 bg-slate-900 text-white text-xs rounded-lg">
            {lang === 'ar' ? 'استعراض جميع الأقسام' : 'Browse All Categories'}
          </Link>
        </div>
      )}
    </div>
  );
};

export const AdvancedSearchPage: React.FC = () => {
  const { lang, categories, products } = useStore();
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState<string>('ALL');
  const [format, setFormat] = useState<string>('ALL');
  const [accessType, setAccessType] = useState<'ALL' | 'FREE' | 'PAID'>('ALL');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'bestselling' | 'downloads'>('newest');
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        if (keyword.trim()) {
          const k = keyword.trim().toLowerCase();
          const match =
            p.titleAr.toLowerCase().includes(k) ||
            p.titleEn.toLowerCase().includes(k) ||
            p.descriptionAr.toLowerCase().includes(k) ||
            p.descriptionEn.toLowerCase().includes(k);
          if (!match) return false;
        }
        if (categoryId !== 'ALL' && p.categoryId !== Number(categoryId)) return false;
        if (format !== 'ALL' && p.fileFormat.toUpperCase() !== format) return false;
        if (accessType === 'FREE' && !p.isFree && Number(p.price) > 0) return false;
        if (accessType === 'PAID' && (p.isFree || Number(p.price) === 0)) return false;
        if (minPrice !== '' && Number(p.price) < Number(minPrice)) return false;
        if (maxPrice !== '' && Number(p.price) > Number(maxPrice)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'bestselling') return (b.salesCount || 0) - (a.salesCount || 0);
        if (sortOrder === 'downloads') return (b.downloadsCount || 0) - (a.downloadsCount || 0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, keyword, categoryId, format, accessType, minPrice, maxPrice, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-bold">
          {lang === 'ar' ? 'البحث المتقدم في المتجر الرقمي' : 'Advanced Marketplace Search'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {lang === 'ar'
            ? 'ابحث باللغتين العربية والإنجليزية حسب القسم، صيغة الملف، نطاق السعر، والأكثر مبيعاً أو تحميلاً.'
            : 'Filter in Arabic or English by category, file format, price range, actual sales, or downloads.'}
        </p>
      </div>

      <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold mb-1">
            {lang === 'ar' ? 'كلمات البحث (عربي / إنجليزي)' : 'Search Keywords (AR / EN)'}
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
            placeholder={lang === 'ar' ? 'اسم الكتاب، القاموس، الوصف...' : 'Title, dictionary, description...'}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">
            {lang === 'ar' ? 'القسم' : 'Category'}
          </label>
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
          >
            <option value="ALL">{lang === 'ar' ? 'الكل' : 'All Categories'}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {lang === 'ar' ? c.nameAr : c.nameEn}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">
            {lang === 'ar' ? 'صيغة الملف' : 'File Format'}
          </label>
          <select
            value={format}
            onChange={(e) => {
              setFormat(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
          >
            {SUPPORTED_FORMATS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">
            {lang === 'ar' ? 'نطاق السعر (من - إلى)' : 'Price Range'}
          </label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder={lang === 'ar' ? 'من' : 'Min'}
              className="w-1/2 px-2 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
            />
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder={lang === 'ar' ? 'إلى' : 'Max'}
              className="w-1/2 px-2 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">
            {lang === 'ar' ? 'الترتيب' : 'Sort Order'}
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
          >
            <option value="newest">{lang === 'ar' ? 'الأحدث' : 'Newest'}</option>
            <option value="bestselling">{lang === 'ar' ? 'الأكثر مبيعاً' : 'Best Selling'}</option>
            <option value="downloads">{lang === 'ar' ? 'الأكثر تحميلاً' : 'Most Downloaded'}</option>
          </select>
        </div>
      </div>

      {paginated.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paginated.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pNum) => (
                <button
                  key={pNum}
                  type="button"
                  onClick={() => setPage(pNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-mono font-bold ${
                    page === pNum
                      ? 'bg-slate-900 text-white dark:bg-amber-600'
                      : 'border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {pNum}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <p className="text-sm font-semibold">
            {lang === 'ar'
              ? 'لا توجد نتائج مطابقة لمحددات البحث المتقدم الحالية.'
              : 'No products match your advanced search filters.'}
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 7. REVIEWS & RATINGS PAGE (/reviews)
// ============================================================================
export const ReviewsDirectoryPage: React.FC = () => {
  const { lang, reviews, products } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-bold">
          {lang === 'ar' ? 'تقييمات ومراجعات العملاء الموثقة' : 'Verified Customer Reviews & Ratings'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {lang === 'ar'
            ? 'جميع التقييمات المعروضة هنا حقيقية ومرتبطة بمنتجات وطلبات فعلية في قاعدة البيانات.'
            : 'All reviews displayed here are authentic and linked to real database records.'}
        </p>
      </div>

      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev: any) => {
            const prod = products.find((p) => p.id === rev.productId);
            return (
              <div
                key={rev.id}
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{rev.reviewerName}</span>
                  <span className="font-mono text-amber-600">{'★'.repeat(rev.rating)}</span>
                </div>
                {prod && (
                  <Link
                    to={`/product/${prod.slug}`}
                    className="block text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    {lang === 'ar' ? prod.titleAr : prod.titleEn}
                  </Link>
                )}
                {rev.title && <h3 className="text-sm font-bold">{rev.title}</h3>}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
          <Star className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-base font-bold">
            {lang === 'ar' ? 'لا توجد مراجعات منشورة بعد' : 'No published reviews yet'}
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {lang === 'ar'
              ? 'نلتزم بعدم إضافة أي تقييمات وهمية. ستظهر مراجعات المشترين الحقيقيين هنا فور تقييمهم للإصدارات.'
              : 'We strictly prohibit fake reviews. Genuine buyer reviews will appear here as customers rate purchased publications.'}
          </p>
        </div>
      )}
    </div>
  );
};
