import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Download,
  Tag,
  AlertCircle,
  Smartphone,
  Copy,
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { WhatsAppIcon } from '../components/Layout.tsx';

// ============================================================================
// 14. SHOPPING CART PAGE (/cart)
// ============================================================================
export const ShoppingCartPage: React.FC = () => {
  const {
    lang,
    cart,
    removeFromCart,
    updateCartQty,
    clearCart,
    formatPrice,
    currency,
  } = useStore();

  const subtotal = cart.reduce((sum, i) => {
    const p = i.product;
    const unit = p.isFree
      ? 0
      : p.discountPrice && Number(p.discountPrice) > 0
      ? Number(p.discountPrice)
      : Number(p.price);
    return sum + unit * i.quantity;
  }, 0);

  const subtotalFormatted = formatPrice(subtotal, 'EGP');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {lang === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {lang === 'ar'
              ? 'راجع المنتجات الرقمية المختارة قبل الانتقال إلى إتمام الطلب.'
              : 'Review your selected digital publications before proceeding to checkout.'}
          </p>
        </div>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="px-3.5 py-2 text-xs font-semibold text-rose-600 border border-rose-200 dark:border-rose-900/50 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            {lang === 'ar' ? 'إفراغ السلة' : 'Clear Cart'}
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <ShoppingCart className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold">
            {lang === 'ar' ? 'سلة التسوق فارغة حالياً' : 'Your shopping cart is empty'}
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {lang === 'ar'
              ? 'تصفح أقسام متجر اتحاد المترجمين العرب لإضافة الكتب والمراجع والدورات إلى سلة مشترياتك.'
              : 'Browse the Online store alliance of arab translators catalog to add books, references, and courses to your cart.'}
          </p>
          <Link
            to="/marketplace"
            className="inline-block px-6 py-2.5 bg-slate-900 dark:bg-amber-600 text-white text-xs font-bold rounded-lg"
          >
            {lang === 'ar' ? 'تصفح المتجر الرقمي' : 'Explore Marketplace'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm text-start border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                <tr>
                  <th className="py-3.5 px-4 text-start">{lang === 'ar' ? 'المنتج' : 'Product'}</th>
                  <th className="py-3.5 px-4 text-start">{lang === 'ar' ? 'الصيغة' : 'Format'}</th>
                  <th className="py-3.5 px-4 text-start">{lang === 'ar' ? 'السعر' : 'Unit Price'}</th>
                  <th className="py-3.5 px-4 text-start">{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
                  <th className="py-3.5 px-4 text-end">{lang === 'ar' ? 'الإجمالي' : 'Subtotal'}</th>
                  <th className="py-3.5 px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {cart.map(({ product, quantity }) => {
                  const unit = product.isFree
                    ? 0
                    : product.discountPrice && Number(product.discountPrice) > 0
                    ? Number(product.discountPrice)
                    : Number(product.price);
                  return (
                    <tr key={product.id}>
                      <td className="py-4 px-4">
                        <Link
                          to={`/product/${product.slug}`}
                          className="font-semibold text-slate-900 dark:text-white hover:text-amber-600"
                        >
                          {lang === 'ar' ? product.titleAr : product.titleEn}
                        </Link>
                      </td>
                      <td className="py-4 px-4 font-mono text-xs">{product.fileFormat}</td>
                      <td className="py-4 px-4 font-mono tabular-nums text-xs">
                        {formatPrice(unit, product.currency).formatted}
                      </td>
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-2 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1">
                          <button
                            type="button"
                            onClick={() => updateCartQty(product.id, quantity - 1)}
                            className="font-bold text-xs px-1"
                          >
                            -
                          </button>
                          <span className="font-mono tabular-nums text-xs">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(product.id, quantity + 1)}
                            className="font-bold text-xs px-1"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-end font-mono tabular-nums font-bold text-xs">
                        {formatPrice(unit * quantity, product.currency).formatted}
                      </td>
                      <td className="py-4 px-4 text-end">
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-bold">
              {lang === 'ar' ? 'ملخص سلة المشتريات' : 'Order Summary'}
            </h2>
            <div className="space-y-2 text-xs border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">
                  {lang === 'ar' ? 'عملة العرض المختارة:' : 'Selected Display Currency:'}
                </span>
                <span className="font-mono font-bold">{currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">
                  {lang === 'ar' ? 'عملة المعاملة الفعلية:' : 'Actual Transaction Currency:'}
                </span>
                <span className="font-mono font-bold">{subtotalFormatted.actualTransactionText}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-base font-bold">
              <span>{lang === 'ar' ? 'الإجمالي:' : 'Total:'}</span>
              <span className="font-mono tabular-nums text-amber-700 dark:text-amber-400">
                {subtotalFormatted.formatted}
              </span>
            </div>
            <Link
              to="/checkout"
              className="block w-full py-3 text-center bg-slate-900 dark:bg-amber-600 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              {lang === 'ar' ? 'المتابعة لإتمام الشراء والدفع' : 'Proceed to Checkout'}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 15. CHECKOUT PAGE (/checkout)
// ============================================================================
export const CheckoutPage: React.FC = () => {
  const {
    lang,
    user,
    cart,
    clearCart,
    formatPrice,
    settings,
    authFetch,
    showToast,
  } = useStore();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(user?.displayName || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('vodafone_cash');
  const [vodafoneSenderPhone, setVodafoneSenderPhone] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const vodafoneCashNumber = settings.vodafone_cash_number || '+20 10 32105770';
  const vodafoneOwnerAr = settings.vodafone_cash_owner_ar || 'د/ إيمان الأحمر';
  const vodafoneOwnerEn = settings.vodafone_cash_owner_en || 'Dr. Eman Elahmer';

  const handleCopyVodafoneNumber = async () => {
    try {
      await navigator.clipboard.writeText('01032105770');
      showToast(
        lang === 'ar'
          ? 'تم نسخ رقم فودافون كاش (01032105770) بنجاح'
          : 'Vodafone Cash number (01032105770) copied',
        'success'
      );
    } catch {
      showToast(vodafoneCashNumber, 'info');
    }
  };

  useEffect(() => {
    if (user) {
      setCustomerName((prev) => prev || user.displayName || '');
      setCustomerEmail((prev) => prev || user.email || '');
    }
  }, [user]);

  const subtotal = cart.reduce((sum, i) => {
    const p = i.product;
    const unit = p.isFree
      ? 0
      : p.discountPrice && Number(p.discountPrice) > 0
      ? Number(p.discountPrice)
      : Number(p.price);
    return sum + unit * i.quantity;
  }, 0);

  const finalTotal = Math.max(0, subtotal - discountAmount);
  const baseCurrency = settings.base_currency || 'EGP';

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: couponCode, subtotal }),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || 'Invalid coupon', 'error');
      setDiscountAmount(0);
    } else {
      setDiscountAmount(Number(data.discountAmount || 0));
      showToast(
        lang === 'ar'
          ? `تم تطبيق خصم الكوبون بقيمة ${data.discountAmount} ${baseCurrency}`
          : `Coupon discount of ${data.discountAmount} ${baseCurrency} applied`,
        'success'
      );
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast(
        lang === 'ar'
          ? 'يرجى تسجيل الدخول أولاً لإتمام الطلب وحفظ رخصة التحميل في حسابك'
          : 'Please sign in first to complete your order and bind digital licenses to your account',
        'error'
      );
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      const combinedNotes =
        paymentMethod === 'vodafone_cash' && vodafoneSenderPhone.trim()
          ? `${notes ? `${notes} | ` : ''}رقم محفظة فودافون كاش المُحوِّل منها / المرجع: ${vodafoneSenderPhone.trim()}`
          : notes;

      const res = await authFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: cart.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
          customerName,
          customerEmail,
          customerPhone,
          paymentMethod,
          couponCode: discountAmount > 0 ? couponCode : '',
          currency: baseCurrency,
          notes: combinedNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Checkout error', 'error');
      } else {
        clearCart();
        showToast(lang === 'ar' ? data.messageAr : data.messageEn, 'success');
        navigate(`/payment-confirmation?order=${encodeURIComponent(data.order.orderNumber)}`);
      }
    } catch {
      showToast(lang === 'ar' ? 'حدث خطأ أثناء تسجيل الطلب' : 'Failed to submit order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const gateways = [
    {
      id: 'vodafone_cash',
      nameAr: `فودافون كاش (${vodafoneOwnerAr})`,
      nameEn: `Vodafone Cash (${vodafoneOwnerEn})`,
      subtitleAr: `مفعل الآن — ${vodafoneCashNumber}`,
      subtitleEn: `Active Now — ${vodafoneCashNumber}`,
      enabled: settings.vodafone_cash_enabled !== 'false',
    },
    {
      id: 'paymob',
      nameAr: 'Paymob (باي موب مصر)',
      nameEn: 'Paymob Egypt',
      enabled: settings.paymob_enabled === 'true',
    },
    {
      id: 'fawry',
      nameAr: 'Fawry (فوري للدفع الإلكتروني)',
      nameEn: 'Fawry Pay',
      enabled: settings.fawry_enabled === 'true',
    },
    {
      id: 'visa_mastercard',
      nameAr: 'بطاقات Visa / Mastercard',
      nameEn: 'Visa / Mastercard',
      enabled: settings.visa_mastercard_enabled === 'true',
    },
    {
      id: 'paypal',
      nameAr: 'PayPal (باي بال)',
      nameEn: 'PayPal',
      enabled: settings.paypal_enabled === 'true',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl md:text-3xl font-bold">
          {lang === 'ar' ? 'إتمام الشراء والدفع الآمن' : 'Secure Checkout'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {lang === 'ar'
            ? 'جميع المعاملات مسجلة في قاعدة البيانات الرسمية ويتم تسليم المنتجات الرقمية تلقائياً بعد تأكيد الدفع.'
            : 'All transactions are recorded in PostgreSQL and digital downloads unlock automatically upon verified payment.'}
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="p-10 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <p className="text-sm mb-4">
            {lang === 'ar' ? 'لا توجد منتجات في سلة التسوق.' : 'Your cart is empty.'}
          </p>
          <Link to="/marketplace" className="px-5 py-2.5 bg-slate-900 text-white text-xs rounded-lg">
            {lang === 'ar' ? 'العودة إلى المتجر' : 'Return to Marketplace'}
          </Link>
        </div>
      ) : (
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            {/* Customer Billing Information */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
              <h2 className="text-base font-bold">
                {lang === 'ar' ? '1. بيانات المشتري وإصدار الترخيص' : '1. Buyer & License Holder Details'}
              </h2>
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
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    {lang === 'ar' ? 'البريد الإلكتروني الرسمي *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    {lang === 'ar' ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="010xxxxxxxx"
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    {lang === 'ar' ? 'ملاحظات إضافية على الطلب' : 'Order Notes'}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                </div>
              </div>
            </div>

            {/* Payment Gateways Section (Section 9) */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
              <h2 className="text-base font-bold flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>{lang === 'ar' ? '2. وسيلة الدفع الإلكتروني' : '2. Payment Gateway'}</span>
              </h2>

              {finalTotal === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                  {lang === 'ar'
                    ? 'إجمالي هذا الطلب مجاني (0.00). سيتم تفعيل روابط التحميل الفوري تلقائياً فور تأكيد الطلب.'
                    : 'This order total is Free (0.00). Instant download links will unlock automatically upon confirmation.'}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {gateways.map((gw: any) => (
                      <label
                        key={gw.id}
                        className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between ${
                          gw.id === 'vodafone_cash' ? 'sm:col-span-2' : ''
                        } ${
                          paymentMethod === gw.id
                            ? 'border-amber-600 bg-amber-50/40 dark:bg-amber-950/30'
                            : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={gw.id}
                            checked={paymentMethod === gw.id}
                            onChange={() => setPaymentMethod(gw.id)}
                          />
                          <div>
                            <span className="block text-xs font-bold">
                              {lang === 'ar' ? gw.nameAr : gw.nameEn}
                            </span>
                            <span
                              className={`text-[11px] font-medium ${
                                gw.enabled
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : 'text-slate-500'
                              }`}
                            >
                              {gw.subtitleAr
                                ? lang === 'ar'
                                  ? gw.subtitleAr
                                  : gw.subtitleEn
                                : gw.enabled
                                ? lang === 'ar'
                                  ? 'مفعل للربط المباشر'
                                  : 'Live API Active'
                                : lang === 'ar'
                                ? 'بانتظار إدخال مفاتيح التفعيل من الإدارة'
                                : 'Pending Admin API Keys'}
                            </span>
                          </div>
                        </div>
                        {gw.id === 'vodafone_cash' && (
                          <Smartphone className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                      </label>
                    ))}
                  </div>

                  {paymentMethod === 'vodafone_cash' ? (
                    <div className="p-5 rounded-xl bg-rose-50/70 dark:bg-rose-950/25 border border-rose-200 dark:border-rose-900/60 text-xs space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-1">
                          <p className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                            <Smartphone className="w-4 h-4 shrink-0" />
                            <span>
                              {lang === 'ar'
                                ? `بيانات التحويل عبر فودافون كاش — ${vodafoneOwnerAr}`
                                : `Vodafone Cash Transfer Details — ${vodafoneOwnerEn}`}
                            </span>
                          </p>
                          <p
                            dir="ltr"
                            className="text-base font-mono font-bold tracking-wide text-slate-900 dark:text-white inline-block"
                          >
                            {vodafoneCashNumber}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyVodafoneNumber}
                          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 text-white text-xs font-bold rounded-lg inline-flex items-center gap-1.5"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'نسخ رقم المحفظة' : 'Copy Number'}</span>
                        </button>
                      </div>

                      <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                        <li>
                          {lang === 'ar'
                            ? `قم بتحويل مبلغ (${finalTotal.toFixed(2)} ${baseCurrency}) عبر فودافون كاش إلى رقم ${vodafoneOwnerAr}: ${vodafoneCashNumber}`
                            : `Transfer ${finalTotal.toFixed(2)} ${baseCurrency} via Vodafone Cash to ${vodafoneOwnerEn}: ${vodafoneCashNumber}`}
                        </li>
                        <li>
                          {lang === 'ar'
                            ? 'أدخل رقم المحفظة المُحوِّل منها (اختياري) ثم اضغط على «تأكيد وتسجيل الطلب الرسمي».'
                            : 'Optionally enter the sender wallet number or transaction reference below, then click Confirm & Submit Order.'}
                        </li>
                        <li>
                          {lang === 'ar'
                            ? 'أرسل صورة إيصال التحويل مع رقم الطلب عبر واتساب د/ إيمان الأحمر ليتم تفعيل روابط التحميل في حسابك فوراً.'
                            : 'Send the transfer screenshot with your order number to Dr. Eman Elahmer on WhatsApp to unlock your downloads immediately.'}
                        </li>
                      </ol>

                      <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-800 dark:text-slate-200">
                          {lang === 'ar'
                            ? 'رقم محفظة فودافون كاش المُحوِّل منها أو رقم العملية (اختياري)'
                            : 'Sender Vodafone Cash Number / Transfer Reference (Optional)'}
                        </label>
                        <input
                          type="text"
                          value={vodafoneSenderPhone}
                          onChange={(e) => setVodafoneSenderPhone(e.target.value)}
                          placeholder="010xxxxxxxx"
                          className="w-full px-3.5 py-2 text-xs font-mono rounded-lg border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-950"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 text-xs space-y-1.5">
                      <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>
                          {lang === 'ar'
                            ? 'سياسة التحقق الصارم من المدفوعات (لا يتم محاكاة أي دفع وهمي)'
                            : 'Strict Payment Verification Policy (Zero Simulated Payments)'}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {lang === 'ar'
                          ? 'لا يقوم النظام أبداً بمحاكاة عمليات دفع وهمية. يمكنك اختيار «فودافون كاش» للدفع الفوري الآن، أو تسجيل الطلب والتواصل مع د/ إيمان الأحمر لتأكيد السداد وتفعيل التحميل.'
                          : 'This platform never simulates fake payments. Select Vodafone Cash to pay immediately now, or submit your order and confirm directly with Dr. Eman Elahmer.'}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Summary & Coupon */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5">
              <h2 className="text-base font-bold">
                {lang === 'ar' ? 'ملخص الطلب والعملة الفعلية' : 'Order & Transaction Currency Summary'}
              </h2>

              {/* Coupon Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold">
                  {lang === 'ar' ? 'هل لديك كود خصم (كوبون)؟' : 'Have a Coupon Code?'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="ATU2026"
                    className="flex-1 px-3 py-2 text-xs font-mono uppercase rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'تطبيق' : 'Apply'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 text-xs border-y border-slate-200 dark:border-slate-800 py-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                  <span className="font-mono tabular-nums font-semibold">
                    {subtotal.toFixed(2)} {baseCurrency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'ar' ? 'الخصم الفعلي:' : 'Verified Discount:'}</span>
                  <span className="font-mono tabular-nums font-semibold text-emerald-600">
                    -{discountAmount.toFixed(2)} {baseCurrency}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200/70 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {lang === 'ar' ? 'عملة المعاملة الفعلية عند الدفع:' : 'Actual Transaction Currency:'}
                  </span>
                  <span className="font-mono tabular-nums font-bold text-amber-700 dark:text-amber-400">
                    {finalTotal.toFixed(2)} {baseCurrency}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-50"
              >
                {submitting
                  ? lang === 'ar'
                    ? 'جاري تسجيل الطلب...'
                    : 'Processing Order...'
                  : lang === 'ar'
                  ? 'تأكيد وتسجيل الطلب الرسمي'
                  : 'Confirm & Submit Official Order'}
              </button>

              <p className="text-[11px] text-slate-500 text-center">
                جميع حقوق الطبع والنشر والملكية الفكرية محفوظة للدكتورة/ إيمان الأحمر.
              </p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

// ============================================================================
// 16. PAYMENT CONFIRMATION & OFFICIAL INVOICE PAGE (/payment-confirmation)
// ============================================================================
export const PaymentConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order') || '';
  const { lang, authFetch, triggerSecureDownload, products, settings, showToast } = useStore();
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const vodafoneCashNumber = settings.vodafone_cash_number || '+20 10 32105770';

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!orderNumber) {
        setLoading(false);
        return;
      }
      try {
        const res = await authFetch(`/api/orders/${encodeURIComponent(orderNumber)}/invoice`);
        if (res.ok) {
          const data = await res.json();
          setInvoiceData(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [orderNumber, authFetch]);

  const supportWhatsAppUrl =
    'https://wa.me/201032105770?text=' +
    encodeURIComponent(
      invoiceData?.order
        ? `مرحباً د/ إيمان الأحمر، أرسل لكم إيصال تحويل فودافون كاش (${vodafoneCashNumber}) للطلب رقم ${orderNumber} بقيمة ${invoiceData.order.totalAmount} ${invoiceData.order.currency} في متجر اتحاد المترجمين العرب (Online store alliance of arab translators) لتفعيل التحميل.`
        : `مرحباً د/ إيمان الأحمر، أود متابعة حالة طلبي رقم ${orderNumber} في متجر اتحاد المترجمين العرب (Online store alliance of arab translators).`
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 shrink-0" />
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {lang === 'ar'
                  ? 'إيصال وفاتورة الطلب الرسمية — متجر اتحاد المترجمين العرب'
                  : 'Official Order Receipt & Invoice — Online store alliance of arab translators'}
              </h1>
              <p className="text-xs font-mono text-amber-700 dark:text-amber-400">
                {orderNumber ? `Order #${orderNumber}` : ''}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start"
          >
            <Printer className="w-4 h-4" />
            <span>{lang === 'ar' ? 'طباعة / حفظ الفاتورة PDF' : 'Print / Save Invoice PDF'}</span>
          </button>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">
            {lang === 'ar' ? 'جاري تحميل بيانات الفاتورة...' : 'Loading official invoice...'}
          </p>
        ) : !invoiceData ? (
          <div className="space-y-4 text-center py-8">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {lang === 'ar'
                ? 'يمكنك استعراض جميع طلباتك وفواتيرك من صفحة "طلباتي" في حسابك الشخصي.'
                : 'You can view all your orders and invoices from the "My Orders" section in your account.'}
            </p>
            <Link
              to="/my-orders"
              className="inline-block px-5 py-2.5 bg-slate-900 dark:bg-amber-600 text-white text-xs font-semibold rounded-lg"
            >
              {lang === 'ar' ? 'الذهاب إلى طلباتي' : 'Go to My Orders'}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs">
              <div>
                <span className="text-slate-500 block">{lang === 'ar' ? 'اسم العميل:' : 'Customer:'}</span>
                <span className="font-bold">{invoiceData.order.customerName}</span>
                <span className="block text-slate-500 font-mono">{invoiceData.order.customerEmail}</span>
              </div>
              <div>
                <span className="text-slate-500 block">{lang === 'ar' ? 'حالة الدفع:' : 'Payment Status:'}</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">
                  {invoiceData.order.paymentStatus === 'paid'
                    ? lang === 'ar'
                      ? 'مدفوع ومؤكد — التحميل مفعل'
                      : 'Confirmed & Paid — Downloads Unlocked'
                    : invoiceData.order.paymentMethod === 'vodafone_cash'
                    ? lang === 'ar'
                      ? 'بانتظار تأكيد تحويل فودافون كاش'
                      : 'Awaiting Vodafone Cash Transfer Confirmation'
                    : lang === 'ar'
                    ? 'بانتظار تأكيد السداد'
                    : 'Pending Payment Confirmation'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">{lang === 'ar' ? 'الإجمالي الفعلي:' : 'Total Amount:'}</span>
                <span className="font-mono tabular-nums font-bold text-base">
                  {invoiceData.order.totalAmount} {invoiceData.order.currency}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'المنتج' : 'Item'}</th>
                    <th className="py-2.5 px-3 text-start">{lang === 'ar' ? 'كود الترخيص' : 'License Code'}</th>
                    <th className="py-2.5 px-3 text-end">{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                    <th className="py-2.5 px-3 text-end">{lang === 'ar' ? 'التحميل' : 'Download'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {invoiceData.items.map((item: any) => {
                    const matchedProd = products.find((p) => p.id === item.productId);
                    return (
                      <tr key={item.id}>
                        <td className="py-3 px-3 font-semibold">
                          {lang === 'ar' ? item.titleAr : item.titleEn}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-500">{item.licenseCode}</td>
                        <td className="py-3 px-3 text-end font-mono tabular-nums">
                          {item.totalPrice} {invoiceData.order.currency}
                        </td>
                        <td className="py-3 px-3 text-end">
                          {invoiceData.order.paymentStatus === 'paid' && matchedProd ? (
                            <button
                              type="button"
                              onClick={() => triggerSecureDownload(matchedProd)}
                              className="px-3 py-1.5 bg-emerald-700 text-white rounded-md font-semibold inline-flex items-center gap-1"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{lang === 'ar' ? 'تحميل' : 'Download'}</span>
                            </button>
                          ) : (
                            <span className="text-slate-400">
                              {lang === 'ar' ? 'يفعل بعد التأكيد' : 'Unlocks after payment'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {invoiceData.order.paymentStatus !== 'paid' && (
              <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs space-y-1.5">
                    <p className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 shrink-0" />
                      <span>
                        {lang === 'ar'
                          ? 'الدفع عبر فودافون كاش وتفعيل التحميل الفوري:'
                          : 'Pay via Vodafone Cash & Unlock Instant Downloads:'}
                      </span>
                    </p>
                    <p className="text-slate-700 dark:text-slate-300">
                      {lang === 'ar'
                        ? `حوّل مبلغ (${invoiceData.order.totalAmount} ${invoiceData.order.currency}) على رقم فودافون كاش الخاص بالدكتورة/ إيمان الأحمر:`
                        : `Transfer ${invoiceData.order.totalAmount} ${invoiceData.order.currency} to Dr. Eman Elahmer's Vodafone Cash number:`}{' '}
                      <strong dir="ltr" className="font-mono text-slate-900 dark:text-white inline-block">
                        {vodafoneCashNumber}
                      </strong>
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      {lang === 'ar'
                        ? 'ثم أرسل إيصال التحويل على واتساب مع رقم الطلب ليتم تفعيل التحميل مباشرة.'
                        : 'Then send your transfer receipt on WhatsApp with your order number to activate downloads.'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText('01032105770');
                          showToast(
                            lang === 'ar' ? 'تم نسخ الرقم 01032105770' : 'Copied 01032105770',
                            'success'
                          );
                        } catch {
                          showToast(vodafoneCashNumber, 'info');
                        }
                      }}
                      className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'نسخ رقم فودافون كاش' : 'Copy Wallet Number'}</span>
                    </button>
                    <a
                      href={supportWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center gap-2 whitespace-nowrap"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'إرسال الإيصال لـ د/ إيمان الأحمر' : 'Send Receipt via WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                جميع حقوق الطبع والنشر والملكية الفكرية محفوظة للدكتورة/ إيمان الأحمر.
              </p>
              <p>Copyright © 2026 Dr. Eman Elahmer. All Rights Reserved.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
