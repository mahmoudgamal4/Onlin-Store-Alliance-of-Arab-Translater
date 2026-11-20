import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Share2,
  ShoppingCart,
  Download,
  FileText,
  Scale,
  Eye,
} from 'lucide-react';
import { ProductItem, useStore } from '../context/StoreContext.tsx';

export const ProductCard: React.FC<{ product: ProductItem }> = ({ product }) => {
  const {
    lang,
    categories,
    formatPrice,
    addToCart,
    favoriteIds,
    toggleFavorite,
    compareIds,
    toggleCompare,
    openShareModal,
    triggerSecureDownload,
  } = useStore();

  const [imgError, setImgError] = useState(false);

  const category = categories.find((c) => c.id === product.categoryId);
  const title = lang === 'ar' ? product.titleAr : product.titleEn || product.titleAr;
  const shortDesc =
    lang === 'ar'
      ? product.shortDescriptionAr || product.descriptionAr
      : product.shortDescriptionEn || product.descriptionEn || product.shortDescriptionAr;

  const hasDiscount =
    !product.isFree &&
    product.discountPrice !== null &&
    product.discountPrice !== undefined &&
    Number(product.discountPrice) > 0 &&
    Number(product.discountPrice) < Number(product.price);

  const effectivePrice = product.isFree
    ? 0
    : hasDiscount
    ? Number(product.discountPrice)
    : Number(product.price);

  const priceInfo = formatPrice(effectivePrice, product.currency);
  const originalPriceInfo = hasDiscount
    ? formatPrice(Number(product.price), product.currency)
    : null;

  const isFav = favoriteIds.includes(product.id);
  const isCompared = compareIds.includes(product.id);

  const canonicalUrl = `${window.location.origin}/product/${product.slug}`;

  return (
    <article className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-transform duration-150 hover:-translate-y-0.5">
      {/* Product Imagery (65% height equivalence, clean backdrop, zero-broken-image fallback) */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-800/70 overflow-hidden">
        {product.mainImageUrl && !imgError ? (
          <img
            src={product.mainImageUrl}
            alt={title}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            <FileText className="w-10 h-10 text-amber-400 mb-3 stroke-[1.5]" />
            <span className="text-xs font-mono uppercase tracking-wider text-amber-300/90">
              {product.fileFormat || 'PDF'}
            </span>
            <p className="mt-1 text-sm font-semibold line-clamp-2 text-slate-100 max-w-[22ch]">
              {title}
            </p>
          </div>
        )}

        {/* Quick Action Floating Buttons (Affordance-only icons) */}
        <div className="absolute top-3 end-3 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => toggleFavorite(product.id)}
            title={lang === 'ar' ? 'إضافة للمفضلة' : 'Save to Favorites'}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              isFav
                ? 'bg-amber-600 text-white'
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:bg-amber-600 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            onClick={() =>
              openShareModal({
                title,
                url: canonicalUrl,
                description: shortDesc,
              })
            }
            title={lang === 'ar' ? 'مشاركة المنتج' : 'Share Product'}
            className="w-9 h-9 rounded-lg bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:bg-slate-900 hover:text-white dark:hover:bg-amber-600 flex items-center justify-center transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleCompare(product.id)}
            title={lang === 'ar' ? 'مقارنة المنتج' : 'Compare Product'}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              isCompared
                ? 'bg-amber-600 text-white'
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area — Clean Unboxed Metadata (Zero-Pill Discipline) */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="truncate">
            {category
              ? lang === 'ar'
                ? category.nameAr
                : category.nameEn
              : lang === 'ar'
              ? 'إصدار رقمي'
              : 'Digital Publication'}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono uppercase">{product.fileFormat || 'PDF'}</span>
          {product.fileSizeLabel && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{product.fileSizeLabel}</span>
            </>
          )}
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="text-base font-semibold text-slate-900 dark:text-slate-100 hover:text-amber-700 dark:hover:text-amber-400 transition-colors line-clamp-2 mb-2"
        >
          {title}
        </Link>

        {shortDesc && (
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {shortDesc}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {priceInfo.formatted}
            </span>
            {originalPriceInfo && (
              <span className="text-xs font-mono tabular-nums text-slate-400 line-through">
                {originalPriceInfo.formatted}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/product/${product.slug}`}
              className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'التفاصيل' : 'Details'}</span>
            </Link>

            {product.isFree || Number(product.price) === 0 ? (
              <button
                type="button"
                onClick={() => triggerSecureDownload(product)}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تحميل مجاني' : 'Free Download'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => addToCart(product, 1)}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'أضف للسلة' : 'Add to Cart'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
