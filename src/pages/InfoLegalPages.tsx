import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  BookOpen,
  Scale,
  Code2,
  ExternalLink,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Wrench,
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { WhatsAppIcon } from '../components/Layout.tsx';

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

// ============================================================================
// 26. ABOUT US PAGE (/about)
// ============================================================================
export const AboutUsPage: React.FC = () => {
  const { lang } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-6 py-14 space-y-10">
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
          متجر اتحاد المترجمين العرب · Online store alliance of arab translators
        </span>
        <h1 className="text-3xl font-bold mt-1">
          {lang === 'ar' ? 'من نحن — الرؤية والرسالة والملكية الفكرية' : 'About Us — Vision, Mission & Intellectual Property'}
        </h1>
      </div>

      <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <p>
          {lang === 'ar'
            ? 'يُعد "متجر اتحاد المترجمين العرب" (Online store alliance of arab translators) المنصة الرقمية والتجارية المتخصصة لتوفير الكتب والمراجع العلمية في دراسات الترجمة، المعاجم والقواميس المتخصصة، الحقائب والدورات التدريبية، والقوالب والأدوات التقنية المصممة لرفع كفاءة المترجمين واللغويين في الوطن العربي والعالم.'
            : 'The Online store alliance of arab translators (متجر اتحاد المترجمين العرب) is the specialized digital marketplace dedicated to providing scholarly translation books, bilingual lexicons, training courses, and professional templates for translators and linguists worldwide.'}
        </p>

        <div className="p-6 rounded-xl bg-slate-900 text-white space-y-2">
          <h2 className="text-base font-bold text-amber-400">
            {lang === 'ar' ? 'الملكية الفكرية والإشراف العام' : 'Ownership & Intellectual Property'}
          </h2>
          <p className="text-sm font-semibold">
            جميع حقوق الطبع والنشر والملكية الفكرية محفوظة للدكتورة/ إيمان الأحمر.
          </p>
          <p className="text-xs text-slate-300">
            Copyright © 2026 د/ إيمان الأحمر (Dr. Eman Elahmer). All Rights Reserved.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white">
              {lang === 'ar' ? 'الدعم الفني وخدمة العملاء' : 'Technical Support & Customer Care'}
            </h3>
            <p className="text-xs">د/ إيمان الأحمر — 01032105770</p>
            <a
              href={supportWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>تواصل مع د/ إيمان الأحمر</span>
            </a>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white">
              {lang === 'ar' ? 'التطوير البرمجي والتقني للمنصة' : 'Platform Engineering & Development'}
            </h3>
            <p className="text-xs">م/ محمود جمال — 01093151840</p>
            <a
              href={developerWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>تواصل مع المطور م/ محمود جمال</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 27. CONTACT US PAGE (/contact)
// ============================================================================
export const ContactUsPage: React.FC = () => {
  const { lang, socialLinks } = useStore();

  return (
    <div className="max-w-6xl mx-auto px-6 py-14 space-y-12">
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-bold">
          {lang === 'ar' ? 'تواصل معنا — القنوات الرسمية المعتمدة' : 'Contact Us — Official Communication Channels'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {lang === 'ar'
            ? 'قنوات تواصل مباشرة ومفصولة بوضوح لخدمة العملاء والدعم الفني، أو للتطوير التقني للموقع.'
            : 'Clearly separated direct WhatsApp channels for Customer Support and Website Technical Development.'}
        </p>
      </div>

      {/* Two Official WhatsApp Contact Cards (Section 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* A. Technical Support */}
        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              أولاً: خدمة العملاء والدعم الفني والمبيعات
            </span>
            <h2 className="text-xl font-bold">تواصل مع د/ إيمان الأحمر</h2>
            <p className="text-sm font-mono tabular-nums text-slate-600 dark:text-slate-400">
              WhatsApp: 01032105770
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pt-2">
              <li>· استفسارات الشراء والمنتجات الرقمية</li>
              <li>· المساعدة في تحميل الملفات وتفعيل الرخص</li>
              <li>· تأكيد المدفوعات والفواتير</li>
              <li>· الشكاوى والمقترحات ومساعدة الحسابات</li>
            </ul>
          </div>
          <a
            href={supportWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <WhatsAppIcon className="w-5 h-5" />
            <span>بدء محادثة واتساب مع د/ إيمان الأحمر</span>
          </a>
        </div>

        {/* B. Website Developer */}
        <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              ثانياً: التطوير البرمجي والصيانة التقنية للموقع
            </span>
            <h2 className="text-xl font-bold">تواصل مع المطور م/ محمود جمال</h2>
            <p className="text-sm font-mono tabular-nums text-slate-600 dark:text-slate-400">
              WhatsApp: 01093151840
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 pt-2">
              <li>· التطوير التقني والبرمجي للمنصة</li>
              <li>· الإبلاغ عن الأعطال التقنية أو البرمجية</li>
              <li>· الاستضافة والنشر السحابي وقواعد البيانات</li>
              <li>· طلبات الميزات التقنية وصيانة الموقع</li>
            </ul>
          </div>
          <a
            href={developerWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors border border-amber-500/40"
          >
            <WhatsAppIcon className="w-5 h-5" />
            <span>بدء محادثة واتساب مع المطور م/ محمود جمال</span>
          </a>
        </div>
      </div>

      {/* Official Social Media Links (Section 18) */}
      <div className="p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold">
          {lang === 'ar'
            ? 'الحسابات والمجتمعات الرسمية على منصات التواصل الاجتماعي'
            : 'Official Social Media Channels & Communities'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {socialLinks.map((soc) => (
            <a
              key={soc.id}
              href={soc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-amber-500 flex items-center justify-between text-xs font-bold"
            >
              <span>{lang === 'ar' ? soc.labelAr : soc.labelEn}</span>
              <ExternalLink className="w-4 h-4 text-amber-600 shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 34. COPYRIGHT & INTELLECTUAL PROPERTY POLICY PAGE (/copyright-policy) — Section 3
// ============================================================================
export const CopyrightPolicyPage: React.FC = () => {
  const { lang, settings, authFetch, showToast } = useStore();
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [infringementDetails, setInfringementDetails] = useState('');
  const customCopyrightBody = (
    lang === 'ar' ? settings.policy_copyright_ar : settings.policy_copyright_en
  )?.trim();

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await authFetch('/api/support-tickets', {
      method: 'POST',
      body: JSON.stringify({
        customerName: reporterName,
        customerEmail: reporterEmail,
        category: 'copyright_report',
        priority: 'high',
        subject: 'إبلاغ عن انتهاك حقوق ملكية فكرية / Copyright Infringement Report',
        message: infringementDetails,
      }),
    });
    if (res.ok) {
      setReporterName('');
      setReporterEmail('');
      setInfringementDetails('');
      showToast(
        lang === 'ar'
          ? 'تم تسجيل بلاغ حقوق الملكية الفكرية وإحالته للإدارة بنجاح'
          : 'Copyright infringement report submitted successfully',
        'success'
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-14 space-y-10">
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">
          <Scale className="w-4 h-4" />
          <span>وثيقة الحماية القانونية وحقوق الملكية الفكرية الرسمية</span>
        </div>
        <h1 className="text-3xl font-bold">
          {lang === 'ar'
            ? 'سياسة حقوق الطبع والنشر والملكية الفكرية'
            : 'Intellectual Property and Copyright Policy'}
        </h1>
      </div>

      {/* Official Mandate Banner */}
      <div className="p-8 bg-slate-900 text-white rounded-2xl border border-amber-500/40 space-y-3">
        <p className="text-lg font-bold text-amber-400">
          جميع حقوق الطبع والنشر والملكية الفكرية محفوظة للدكتورة/ إيمان الأحمر.
        </p>
        <p className="text-sm font-semibold">
          Copyright © 2026 د/ إيمان الأحمر (Dr. Eman Elahmer). All Rights Reserved.
        </p>
        <p className="text-xs text-slate-300 leading-relaxed">
          {lang === 'ar'
            ? 'تسري ملكية حقوق الطبع والنشر على جميع عناصر الهوية البصرية للمتجر، المحتوى الأصلي، التصميمات، الإصدارات الرقمية، والمواد التعليمية المملوكة أو المرخصة قانونياً للدكتورة/ إيمان الأحمر، مع الاحترام الكامل لحقوق الملكية الفكرية وتراخيص الأطراف الثالثة.'
            : 'Copyright ownership applies to all store branding, original content, design elements, digital publications, and platform materials owned or legally authorized by Dr. Eman Elahmer, while fully respecting third-party copyrights and product licenses.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            1. حماية حقوق المؤلف والملكية الفكرية (Copyright Protection)
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            جميع الكتب والمراجع والقواميس والدورات التدريبية والملفات الرقمية المنشورة باسم متجر اتحاد المترجمين العرب محمية بموجب قوانين حماية الملكية الفكرية وحقوق المؤلف المحلية والدولية.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            2. حظر إعادة التوزيع غير المصرح به (Restrictions on Redistribution)
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            يُحظر تماماً نسخ أو رفع أو مشاركة الملفات الرقمية المشتراة على مواقع الإنترنت أو مجموعات التواصل الاجتماعي أو تطبيقات المراسلة دون إذن كتابي مسبق من الدكتورة/ إيمان الأحمر.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            3. منع إعادة البيع التجاري (Prohibition of Commercial Resale)
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            الترخيص الممنوح للمشتري هو ترخيص استخدام شخصي وعلمي غير حصري وغير قابل للتحويل، ويُمنع منعاً باتاً استغلال المواد الرقمية في إعادة البيع التجاري أو المتاجرة بها.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            4. قواعد استخدام المواد الرقمية المشتراة (Rules of Use)
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            يحق للمشتري الموثق تحميل الملفات الرقمية للاستفادة العلمية والمهنية الشخصية، مع الالتزام بعدم إزالة إشعارات حقوق الطبع والنشر أو العلامات المائية الخاصة بالدكتورة/ إيمان الأحمر.
          </p>
        </div>
      </div>

      {customCopyrightBody && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {lang === 'ar' ? 'بنود إضافية معتمدة من إدارة المتجر' : 'Additional Store Policy Clauses'}
          </h2>
          <p>{customCopyrightBody}</p>
        </div>
      )}

      {/* Procedure for Reporting Copyright Infringement */}
      <form
        onSubmit={handleReportSubmit}
        className="p-6 lg:p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4"
      >
        <h3 className="text-base font-bold">
          {lang === 'ar'
            ? 'إجراءات الإبلاغ عن انتهاك حقوق الطبع والنشر (Report Copyright Infringement)'
            : 'Procedures for Reporting Copyright Infringement'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            required
            value={reporterName}
            onChange={(e) => setReporterName(e.target.value)}
            placeholder={lang === 'ar' ? 'اسم المُبلِّغ الكامل' : 'Your Full Name'}
            className="px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
          />
          <input
            type="email"
            required
            value={reporterEmail}
            onChange={(e) => setReporterEmail(e.target.value)}
            placeholder={lang === 'ar' ? 'البريد الإلكتروني الرسمي' : 'Your Email Address'}
            className="px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
          />
        </div>
        <textarea
          rows={3}
          required
          value={infringementDetails}
          onChange={(e) => setInfringementDetails(e.target.value)}
          placeholder={
            lang === 'ar'
              ? 'اذكر رابط المصنف وتفاصيل الانتهاك المراد الإبلاغ عنه...'
              : 'Provide the URL of the work and details of the reported infringement...'
          }
          className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-slate-900 dark:bg-amber-600 text-white text-xs font-bold rounded-xl"
        >
          {lang === 'ar' ? 'إرسال بلاغ الملكية الفكرية' : 'Submit Copyright Report'}
        </button>
      </form>
    </div>
  );
};

// ============================================================================
// 29, 30, 31, 32, 33. FAQ & LEGAL POLICY PAGES (/faq, /privacy-policy, /terms, /refund-policy, /license-policy)
// ============================================================================
export const LegalPolicyPage: React.FC<{
  policyType: 'faq' | 'privacy' | 'terms' | 'refund' | 'license';
}> = ({ policyType }) => {
  const { lang, settings, showToast } = useStore();
  const [cookieAnalytics, setCookieAnalytics] = useState(false);
  const customPolicyKey = `policy_${policyType}_${lang}`;
  const customPolicyText = (settings[customPolicyKey] || '').trim();

  const contentMap = {
    faq: {
      titleAr: 'الأسئلة الشائعة حول متجر اتحاد المترجمين العرب',
      titleEn: 'Frequently Asked Questions (FAQ)',
      items: [
        {
          qAr: 'كيف أحصل على الملفات الرقمية بعد الشراء؟',
          qEn: 'How do I receive digital files after purchase?',
          aAr: 'للمنتجات المجانية يتم التحميل فوراً. وللمنتجات المدفوعة يتم تفعيل رابط التحميل المشفر تلقائياً في حسابك فور تأكيد عملية السداد.',
          aEn: 'Free products download immediately. Paid products unlock automatically in your digital library via signed URLs once payment is verified.',
        },
        {
          qAr: 'ما هي صيغ الملفات المدعومة في المتجر؟',
          qEn: 'Which digital file formats are supported?',
          aAr: 'يدعم المتجر صيغ PDF وDOC/DOCX وXLS/XLSX وPPT/PPTX وZIP/RAR وMP3/WAV وMP4 وJPG/PNG وSVG وEPUB.',
          aEn: 'We support PDF, DOC/DOCX, XLS/XLSX, PPT/PPTX, ZIP/RAR, MP3/WAV, MP4, JPG/PNG, SVG, and EPUB.',
        },
        {
          qAr: 'كيف أتواصل مع الدعم الفني أو خدمة العملاء؟',
          qEn: 'How do I contact customer support?',
          aAr: 'يمكنك التواصل مباشرة عبر زر واتساب الرسمي للدكتورة/ إيمان الأحمر (01032105770) أو عبر فتح تذكرة في صفحة تذاكر الدعم.',
          aEn: 'Contact Dr. Eman Elahmer directly via WhatsApp (01032105770) or submit a ticket in the Support Center.',
        },
      ],
    },
    privacy: {
      titleAr: 'سياسة الخصوصية وإدارة الموافقة وملفات الارتباط',
      titleEn: 'Privacy Policy, Cookie Preferences & Data Protection',
      items: [
        {
          qAr: 'حماية البيانات الشخصية',
          qEn: 'Personal Information Protection',
          aAr: 'يلتزم متجر اتحاد المترجمين العرب بحماية بيانات العملاء (الاسم، البريد الإلكتروني، رقم الهاتف) واستخدامها حصرياً لإصدار الفواتير وتراخيص التحميل الرقمية.',
          aEn: 'We protect all customer personal data and use it strictly for order fulfillment, licensing, and authorized support.',
        },
        {
          qAr: 'حق حذف البيانات وإلغاء الاشتراك',
          qEn: 'Data Deletion & Unsubscribe Rights',
          aAr: 'يمكن لأي عميل طلب حذف حسابه وبياناته الشخصية من صفحة "الملف الشخصي"، كما يمكن إلغاء الاشتراك في النشرة البريدية في أي وقت.',
          aEn: 'Customers may request account and data deletion directly from their Profile page and unsubscribe from newsletters at any time.',
        },
      ],
    },
    terms: {
      titleAr: 'الشروط والأحكام العامة للاستخدام والتسوق',
      titleEn: 'Terms and Conditions of Service',
      items: [
        {
          qAr: 'شروط استخدام المنصة',
          qEn: 'Platform Terms of Use',
          aAr: 'باستخدامك لمتجر اتحاد المترجمين العرب فإنك توافق على الالتزام بحقوق الملكية الفكرية للدكتورة/ إيمان الأحمر وعدم إساءة استخدام روابط التحميل.',
          aEn: 'By using the store, you agree to respect Dr. Eman Elahmer’s intellectual property rights and abide by digital license limits.',
        },
      ],
    },
    refund: {
      titleAr: 'سياسة الاستبدال والاسترجاع للمنتجات الرقمية',
      titleEn: 'Refund & Return Policy',
      items: [
        {
          qAr: 'قواعد استرداد المبالغ للملفات الرقمية',
          qEn: 'Digital Product Refund Rules',
          aAr: 'نظراً للطبيعة الفورية للمنتجات الرقمية القابلة للتحميل، يمكن طلب استرداد المبلغ قبل تحميل الملف، أو في حال وجود خلل تقني في الملف تعذر حله عبر الدعم الفني.',
          aEn: 'Refunds are processed if requested prior to file download or if a verified technical defect in the file cannot be resolved by support.',
        },
      ],
    },
    license: {
      titleAr: 'سياسة ترخيص المنتجات الرقمية',
      titleEn: 'Digital Product License Policy',
      items: [
        {
          qAr: 'نطاق الترخيص الممنوح للمشتري',
          qEn: 'Scope of Customer Digital License',
          aAr: 'جميع حقوق الطبع والنشر والملكية الفكرية محفوظة للدكتورة/ إيمان الأحمر. يمنح الشراء رخصة استخدام فردية غير حصرية للمشتري فقط ولا يجوز مشاركتها أو إعادة بيعها.',
          aEn: 'Copyright © 2026 Dr. Eman Elahmer. All Rights Reserved. Purchase grants a single-user, non-exclusive, non-transferable license.',
        },
      ],
    },
  }[policyType];

  return (
    <div className="max-w-5xl mx-auto px-6 py-14 space-y-8">
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-bold">
          {lang === 'ar' ? contentMap.titleAr : contentMap.titleEn}
        </h1>
        <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mt-1">
          جميع حقوق الطبع والنشر والملكية الفكرية محفوظة للدكتورة/ إيمان الأحمر.
        </p>
      </div>

      {customPolicyText ? (
        <div className="p-6 lg:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          {customPolicyText
            .split(/\n{2,}/)
            .filter(Boolean)
            .map((paragraph, idx) => (
              <p
                key={idx}
                className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line"
              >
                {paragraph}
              </p>
            ))}
        </div>
      ) : (
        <div className="space-y-4">
          {contentMap.items.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2"
            >
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === 'ar' ? item.qAr : item.qEn}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {lang === 'ar' ? item.aAr : item.aEn}
              </p>
            </div>
          ))}
        </div>
      )}

      {policyType === 'privacy' && (
        <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold">
            {lang === 'ar' ? 'تفضيلات ملفات الارتباط (Cookie Preferences)' : 'Cookie & Consent Preferences'}
          </h3>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked
              disabled
              className="rounded"
            />
            <span>
              {lang === 'ar'
                ? 'ملفات الارتباط الأساسية (ضرورية لتسجيل الدخول وسلة التسوق والأمان)'
                : 'Essential Security & Session Cookies (Required)'}
            </span>
          </label>
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={cookieAnalytics}
              onChange={(e) => setCookieAnalytics(e.target.checked)}
              className="rounded"
            />
            <span>
              {lang === 'ar'
                ? 'تفضيلات تحسين تجربة التصفح واللغة والعملة'
                : 'Preference & Localization Cookies'}
            </span>
          </label>
          <button
            type="button"
            onClick={() =>
              showToast(
                lang === 'ar' ? 'تم حفظ تفضيلات الخصوصية بنجاح' : 'Privacy preferences saved',
                'success'
              )
            }
            className="px-4 py-2 bg-slate-900 dark:bg-amber-600 text-white text-xs font-semibold rounded-lg"
          >
            {lang === 'ar' ? 'حفظ تفضيلات الخصوصية' : 'Save Preferences'}
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 36. DEVELOPER INFORMATION PAGE (/developer-info)
// ============================================================================
export const DeveloperInfoPage: React.FC = () => {
  const { lang } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-6 py-14 space-y-8">
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
          <Code2 className="w-4 h-4" />
          <span>التطوير البرمجي والهندسة التقنية للمنصة</span>
        </div>
        <h1 className="text-3xl font-bold mt-1">
          {lang === 'ar'
            ? 'مطور الموقع — المهندس/ محمود جمال'
            : 'Website Developer — Eng. Mahmoud Gamal'}
        </h1>
      </div>

      <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold">م/ محمود جمال (Eng. Mahmoud Gamal)</h2>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'ar'
                ? 'المسؤول عن التطوير التقني، معمارية قاعدة البيانات، الأمان، والاستضافة لمتجر اتحاد المترجمين العرب.'
                : 'Lead Full-Stack Engineer responsible for architecture, database security, and deployment.'}
            </p>
            <p className="text-sm font-mono tabular-nums font-bold text-amber-700 dark:text-amber-400 mt-2">
              WhatsApp: 01093151840
            </p>
          </div>
          <a
            href={developerWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-2 border border-amber-500/40 self-start"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>تواصل مع المطور م/ محمود جمال</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <h3 className="font-bold">{lang === 'ar' ? 'البنية البرمجية' : 'Tech Stack'}</h3>
            <p className="text-slate-600 dark:text-slate-400">
              React 19 + TypeScript + Tailwind CSS v4 + Express + PostgreSQL + Drizzle ORM.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <h3 className="font-bold">{lang === 'ar' ? 'الحماية والصلاحيات' : 'Security & RBAC'}</h3>
            <p className="text-slate-600 dark:text-slate-400">
              مصادقة موثقة وحماية صارمة على الخادم تقصر صلاحيات الإدارة على البريد الرسمي المعتمد فقط.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <h3 className="font-bold">{lang === 'ar' ? 'النسخ الاحتياطي' : 'Backup & Recovery'}</h3>
            <p className="text-slate-600 dark:text-slate-400">
              نظام نسخ احتياطي موثق ببصمة SHA-256 مع سجلات تدقيق واستعادة كاملة.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {lang === 'ar'
                ? 'ملف ترحيل قاعدة بيانات Supabase الرسمي (27 جدولاً + سياسات RLS + التخزين الخاص)'
                : 'Official Supabase PostgreSQL & RLS Migration Script (27 Tables + Private Storage)'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'ar'
                ? 'جاهز للتنفيذ المباشر في Supabase SQL Editor لتفعيل الجداول وسياسات الحماية الصارمة.'
                : 'Ready to run in the Supabase SQL Editor to provision all tables, RLS policies, and storage buckets.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <a
              href="/api/export/site-zip"
              download="online-store-alliance-of-arab-translators.zip"
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl whitespace-nowrap text-center"
            >
              {lang === 'ar' ? 'تحميل الموقع كاملاً (ZIP للاستضافة)' : 'Download Full Site ZIP'}
            </a>
            <a
              href="/api/supabase/migration-sql"
              download="20260101000000_arab_translators_union_store.sql"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl whitespace-nowrap text-center"
            >
              {lang === 'ar' ? 'تحميل ملف Supabase SQL + RLS' : 'Download Supabase SQL + RLS'}
            </a>
            <a
              href="/api/supabase/seed-sql"
              download="seed_arab_translators_union_store.sql"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 font-bold text-xs rounded-xl whitespace-nowrap text-center"
            >
              {lang === 'ar' ? 'تحميل ملف البيانات الأساسية (Seed SQL)' : 'Download Supabase Seed SQL'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 37 & 38. MAINTENANCE PAGE (/maintenance) & 404 ERROR PAGE
// ============================================================================
export const MaintenancePage: React.FC = () => {
  const { lang, settings } = useStore();
  const isMaintenance = settings.maintenance_mode === 'true';

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center space-y-5">
      <Wrench className="w-12 h-12 text-amber-600 mx-auto" />
      <h1 className="text-2xl font-bold">
        {lang === 'ar' ? 'صفحة حالة الصيانة والتحديثات التقنية' : 'System Maintenance Status'}
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {isMaintenance
          ? lang === 'ar'
            ? 'المتجر يخضع حالياً لتحديثات مجدولة. يرجى المحاولة بعد قليل.'
            : 'The marketplace is currently undergoing scheduled updates.'
          : lang === 'ar'
          ? 'جميع أنظمة متجر اتحاد المترجمين العرب تعمل بكفاءة عالية حالياً ولا توجد أعمال صيانة جارية.'
          : 'All Online store alliance of arab translators systems are currently operational with zero active maintenance.'}
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-2.5 bg-slate-900 dark:bg-amber-600 text-white text-xs font-bold rounded-xl"
      >
        {lang === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Return to Homepage'}
      </Link>
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  const { lang } = useStore();

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center space-y-5">
      <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto" />
      <h1 className="text-3xl font-bold font-mono">404</h1>
      <h2 className="text-xl font-bold">
        {lang === 'ar' ? 'الصفحة المطلوبة غير موجودة' : 'Page Not Found'}
      </h2>
      <p className="text-xs text-slate-500 max-w-md mx-auto">
        {lang === 'ar'
          ? 'تأكد من صحة الرابط أو انتقل مباشرة إلى الصفحة الرئيسية أو السوق الرقمي.'
          : 'Please check the URL or navigate back to the Homepage or Main Marketplace.'}
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link
          to="/"
          className="px-5 py-2.5 bg-slate-900 dark:bg-amber-600 text-white text-xs font-bold rounded-xl"
        >
          {lang === 'ar' ? 'الصفحة الرئيسية' : 'Homepage'}
        </Link>
        <Link
          to="/marketplace"
          className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl"
        >
          {lang === 'ar' ? 'المتجر الرئيسي' : 'Marketplace'}
        </Link>
      </div>
    </div>
  );
};
