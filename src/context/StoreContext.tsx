import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { supabase, isSupabaseConfigured } from '../lib/supabase.ts';

export const SUPER_ADMIN_EMAIL = 'aleman201451@gmail.com';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  provider: 'firebase' | 'supabase';
}

function mapFirebaseUser(u: FirebaseUser): AuthUser {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoURL: u.photoURL,
    emailVerified: Boolean(u.emailVerified),
    provider: 'firebase',
  };
}

function mapSupabaseUser(u: any): AuthUser {
  return {
    uid: String(u.id),
    email: u.email || null,
    displayName: u.user_metadata?.full_name || u.user_metadata?.name || null,
    photoURL: u.user_metadata?.avatar_url || null,
    emailVerified: Boolean(u.email_confirmed_at),
    provider: 'supabase',
  };
}

function formatAuthError(err: any, lang: 'ar' | 'en'): string {
  const code = String(err?.code || '');
  const msg = String(err?.message || '');

  if (code === 'auth/operation-not-allowed' || msg.includes('operation-not-allowed')) {
    return lang === 'ar'
      ? 'تسجيل الدخول بالبريد الإلكتروني وكلمة المرور غير مفعّل في إعدادات Firebase حالياً. يمكنك الدخول فوراً عبر زر "Google" بالأعلى، أو تفعيل مزود Email/Password من لوحة Firebase Console.'
      : 'Email/Password sign-in is not enabled in Firebase Console yet. Please sign in immediately with Google above, or enable the Email/Password provider in Firebase Console.';
  }
  if (code === 'auth/email-already-in-use' || msg.toLowerCase().includes('already registered')) {
    return lang === 'ar'
      ? 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول بدلاً من ذلك.'
      : 'This email is already registered. Please sign in instead.';
  }
  if (
    code === 'auth/invalid-credential' ||
    code === 'auth/wrong-password' ||
    code === 'auth/user-not-found' ||
    msg.toLowerCase().includes('invalid login credentials')
  ) {
    return lang === 'ar'
      ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
      : 'Invalid email address or password.';
  }
  if (msg.toLowerCase().includes('email not confirmed')) {
    return lang === 'ar'
      ? 'لم يتم تأكيد بريدك الإلكتروني بعد. يرجى فتح بريدك والضغط على رابط التفعيل أولاً.'
      : 'Your email address is not confirmed yet. Please check your inbox and click the confirmation link first.';
  }
  if (code === 'auth/weak-password' || msg.toLowerCase().includes('at least 6 characters')) {
    return lang === 'ar'
      ? 'كلمة المرور ضعيفة جداً؛ يجب أن تتكون من 6 أحرف على الأقل.'
      : 'Password is too weak; it must be at least 6 characters.';
  }
  if (code === 'auth/invalid-email') {
    return lang === 'ar'
      ? 'صيغة البريد الإلكتروني غير صحيحة.'
      : 'Please enter a valid email address.';
  }
  if (code === 'auth/popup-closed-by-user') {
    return lang === 'ar'
      ? 'تم إغلاق نافذة تسجيل الدخول عبر Google قبل إتمام العملية.'
      : 'Google sign-in popup was closed before completion.';
  }
  if (code === 'auth/popup-blocked') {
    return lang === 'ar'
      ? 'قام المتصفح بحظر نافذة Google المنبثقة. يرجى السماح بالنوافذ المنبثقة والمحاولة مرة أخرى.'
      : 'Your browser blocked the Google sign-in popup. Please allow popups and try again.';
  }
  if (code === 'auth/too-many-requests' || msg.toLowerCase().includes('rate limit')) {
    return lang === 'ar'
      ? 'تم إرسال عدة محاولات متتالية. يرجى الانتظار قليلاً ثم المحاولة مرة أخرى.'
      : 'Too many attempts. Please wait a moment and try again.';
  }
  return msg || (lang === 'ar' ? 'حدث خطأ أثناء المصادقة' : 'Authentication failed');
}

export interface CategoryItem {
  id: number;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  iconName: string;
  sortOrder: number;
}

export interface ProductItem {
  id: number;
  slug: string;
  categoryId: number | null;
  sku: string;
  titleAr: string;
  titleEn: string;
  shortDescriptionAr: string;
  shortDescriptionEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: string;
  discountPrice: string | null;
  currency: string;
  fileFormat: string;
  fileSizeBytes: number;
  fileSizeLabel: string;
  isFree: boolean;
  isFeatured: boolean;
  isSpecialOffer: boolean;
  isPublished: boolean;
  availabilityStatus: string;
  licenseTermsAr: string;
  licenseTermsEn: string;
  previewUrl: string;
  mainImageUrl: string;
  productType: string;
  downloadsCount: number;
  salesCount: number;
  viewsCount: number;
  ratingAvg: string;
  reviewsCount: number;
  createdAt: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface SharePayload {
  title: string;
  url: string;
  description?: string;
}

interface StoreContextValue {
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currency: string;
  setCurrency: (code: string) => void;
  formatPrice: (amountInEgp: number | string, productCurrency?: string) => {
    formatted: string;
    actualTransactionText: string;
    isConverted: boolean;
  };
  user: AuthUser | null;
  idToken: string | null;
  userRole: string;
  isSuperAdmin: boolean;
  authLoading: boolean;
  categories: CategoryItem[];
  products: ProductItem[];
  currencies: Array<{ code: string; symbol: string; nameAr: string; nameEn: string; isBase: boolean }>;
  exchangeRates: Array<{ fromCurrency: string; toCurrency: string; rate: string; isConfigured: boolean }>;
  socialLinks: Array<{ id: number; platform: string; labelAr: string; labelEn: string; url: string; iconName: string }>;
  banners: Array<any>;
  settings: Record<string, string>;
  reviews: Array<any>;
  stats: {
    totalProducts: number;
    totalCategories: number;
    totalDownloads: number;
    totalReviews: number;
  };
  loadingBootstrap: boolean;
  refreshBootstrap: () => Promise<void>;
  cart: CartItem[];
  addToCart: (product: ProductItem, qty?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQty: (productId: number, qty: number) => void;
  clearCart: () => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  favoriteIds: number[];
  toggleFavorite: (productId: number) => Promise<void>;
  recentlyViewedIds: number[];
  recordProductView: (productId: number) => void;
  compareIds: number[];
  toggleCompare: (productId: number) => void;
  shareModal: SharePayload | null;
  openShareModal: (payload: SharePayload) => void;
  closeShareModal: () => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (
    name: string,
    email: string,
    pass: string
  ) => Promise<{ requiresEmailConfirmation?: boolean }>;
  sendResetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  refreshAuthSession: () => Promise<void>;
  logout: () => Promise<void>;
  triggerSecureDownload: (product: ProductItem) => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  cart: 'atu_store_cart_v1',
  recent: 'atu_store_recent_v1',
  lang: 'atu_store_lang_v1',
  theme: 'atu_store_theme_v1',
};

function safeReadStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWriteStorage(key: string, value: unknown): void {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota or storage restriction errors
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<'ar' | 'en'>(() => {
    const saved = safeReadStorage<'ar' | 'en'>(STORAGE_KEYS.lang, 'ar');
    return saved === 'en' ? 'en' : 'ar';
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = safeReadStorage<'light' | 'dark'>(STORAGE_KEYS.theme, 'light');
    return saved === 'dark' ? 'dark' : 'light';
  });
  const [currency, setCurrency] = useState<string>('EGP');

  // Auth state (Token stored strictly in memory as mandated by security rules)
  const [user, setUser] = useState<AuthUser | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('visitor');
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Marketplace data
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [exchangeRates, setExchangeRates] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 9,
    totalDownloads: 0,
    totalReviews: 0,
  });
  const [loadingBootstrap, setLoadingBootstrap] = useState<boolean>(true);

  // Shopping state (persisted in localStorage; auth tokens are never stored in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() =>
    safeReadStorage<CartItem[]>(STORAGE_KEYS.cart, [])
  );
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<number[]>(() =>
    safeReadStorage<number[]>(STORAGE_KEYS.recent, [])
  );
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [shareModal, setShareModal] = useState<SharePayload | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(
    null
  );

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      setToast({ message, type });
      setTimeout(() => {
        setToast((prev) => (prev?.message === message ? null : prev));
      }, 4000);
    },
    []
  );

  // Persist cart & recently viewed across refreshes
  useEffect(() => {
    safeWriteStorage(STORAGE_KEYS.cart, cart);
  }, [cart]);

  useEffect(() => {
    safeWriteStorage(STORAGE_KEYS.recent, recentlyViewedIds);
  }, [recentlyViewedIds]);

  // Sync HTML dir and lang
  const setLang = (newLang: 'ar' | 'en') => {
    setLangState(newLang);
    safeWriteStorage(STORAGE_KEYS.lang, newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Sync Dark mode class on <html>
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    safeWriteStorage(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const refreshBootstrap = useCallback(async () => {
    try {
      setLoadingBootstrap(true);
      const res = await fetch('/api/bootstrap');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
        setProducts(data.products || []);
        setCurrencies(data.currencies || []);
        setExchangeRates(data.exchangeRates || []);
        setSocialLinks(data.socialLinks || []);
        setBanners(data.banners || []);
        setSettings(data.settings || {});
        setReviews(data.reviews || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (error) {
      console.error('Bootstrap load error:', error);
    } finally {
      setLoadingBootstrap(false);
    }
  }, []);

  useEffect(() => {
    refreshBootstrap();
  }, [refreshBootstrap]);

  const syncAuthenticatedSession = useCallback(async (authUser: AuthUser, token: string) => {
    setUser(authUser);
    setIdToken(token);
    try {
      const syncRes = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: authUser.displayName || '',
        }),
      });
      if (syncRes.ok) {
        const syncData = await syncRes.json();
        setUserRole(syncData.roleRecord?.role || 'customer');
        setIsSuperAdmin(Boolean(syncData.isSuperAdmin));
      }

      const accRes = await fetch('/api/account/overview', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (accRes.ok) {
        const accData = await accRes.json();
        if (Array.isArray(accData.favorites)) {
          setFavoriteIds(accData.favorites.map((f: any) => f.productId));
        }
      }
    } catch (err) {
      console.error('Auth sync error:', err);
    }
  }, []);

  const clearAuthenticatedSession = useCallback(() => {
    setUser(null);
    setIdToken(null);
    setUserRole('visitor');
    setIsSuperAdmin(false);
    setFavoriteIds([]);
  }, []);

  // Unified Firebase + Supabase Auth listeners
  useEffect(() => {
    let mounted = true;

    const unsubFirebase = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mounted) return;
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          if (mounted) {
            await syncAuthenticatedSession(mapFirebaseUser(firebaseUser), token);
          }
        } catch (err) {
          console.error('Firebase token error:', err);
        }
        if (mounted) setAuthLoading(false);
        return;
      }

      // If no Firebase user, check Supabase Auth session if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (mounted && data.session?.user) {
            await syncAuthenticatedSession(
              mapSupabaseUser(data.session.user),
              data.session.access_token
            );
            setAuthLoading(false);
            return;
          }
        } catch (err) {
          console.error('Supabase session check error:', err);
        }
      }

      if (mounted) {
        clearAuthenticatedSession();
        setAuthLoading(false);
      }
    });

    let unsubSupabase: (() => void) | null = null;
    if (isSupabaseConfigured && supabase) {
      const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!mounted) return;
        if (session?.user) {
          await syncAuthenticatedSession(mapSupabaseUser(session.user), session.access_token);
          if (mounted) setAuthLoading(false);
        } else if (!auth.currentUser) {
          clearAuthenticatedSession();
          if (mounted) setAuthLoading(false);
        }
      });
      unsubSupabase = () => listener.subscription.unsubscribe();
    }

    return () => {
      mounted = false;
      unsubFirebase();
      if (unsubSupabase) unsubSupabase();
    };
  }, [syncAuthenticatedSession, clearAuthenticatedSession]);

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      let currentToken = idToken;
      if (user?.provider === 'supabase' && isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getSession();
        if (data.session?.access_token) {
          currentToken = data.session.access_token;
          setIdToken(currentToken);
        }
      } else if (auth.currentUser) {
        currentToken = await auth.currentUser.getIdToken();
        setIdToken(currentToken);
      }
      const headers = new Headers(options.headers || {});
      if (currentToken) {
        headers.set('Authorization', `Bearer ${currentToken}`);
      }
      if (!headers.has('Content-Type') && options.body) {
        headers.set('Content-Type', 'application/json');
      }
      return fetch(url, { ...options, headers });
    },
    [idToken, user]
  );

  // Multi-currency formatter (Never invents exchange rates!)
  const formatPrice = useCallback(
    (amount: number | string, productCurrency = 'EGP') => {
      const numericAmount = Number(amount || 0);
      if (numericAmount === 0) {
        return {
          formatted: lang === 'ar' ? 'مجاني' : 'Free',
          actualTransactionText: `${numericAmount.toFixed(2)} ${productCurrency}`,
          isConverted: false,
        };
      }

      if (currency === productCurrency) {
        return {
          formatted: `${numericAmount.toFixed(2)} ${currency}`,
          actualTransactionText: `${numericAmount.toFixed(2)} ${productCurrency}`,
          isConverted: false,
        };
      }

      // Check if admin has configured a real exchange rate
      const configuredRate = exchangeRates.find(
        (r) =>
          r.fromCurrency === productCurrency &&
          r.toCurrency === currency &&
          r.isConfigured &&
          Number(r.rate) > 0
      );

      if (configuredRate) {
        const converted = numericAmount * Number(configuredRate.rate);
        return {
          formatted: `${converted.toFixed(2)} ${currency}`,
          actualTransactionText: `${numericAmount.toFixed(2)} ${productCurrency}`,
          isConverted: true,
        };
      }

      // Honest fallback when exchange rate is not configured: show actual product currency
      return {
        formatted: `${numericAmount.toFixed(2)} ${productCurrency}`,
        actualTransactionText: `${numericAmount.toFixed(2)} ${productCurrency}`,
        isConverted: false,
      };
    },
    [currency, exchangeRates, lang]
  );

  // Cart functions
  const addToCart = (product: ProductItem, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty };
        return copy;
      }
      return [...prev, { product, quantity: qty }];
    });
    showToast(
      lang === 'ar'
        ? `تمت إضافة "${product.titleAr}" إلى سلة التسوق`
        : `Added "${product.titleEn}" to cart`,
      'success'
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateCartQty = (productId: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => setCart([]);

  const toggleFavorite = async (productId: number) => {
    if (!user) {
      showToast(
        lang === 'ar'
          ? 'يرجى تسجيل الدخول لإضافة المنتجات إلى المفضلة'
          : 'Please sign in to save favorites',
        'info'
      );
      return;
    }
    try {
      const res = await authFetch('/api/favorites/toggle', {
        method: 'POST',
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'added') {
          setFavoriteIds((prev) => [...prev, productId]);
          showToast(lang === 'ar' ? 'تمت الإضافة إلى المفضلة' : 'Added to favorites', 'success');
        } else {
          setFavoriteIds((prev) => prev.filter((id) => id !== productId));
          showToast(lang === 'ar' ? 'تمت الإزالة من المفضلة' : 'Removed from favorites', 'info');
        }
      }
    } catch {
      showToast(lang === 'ar' ? 'تعذر تحديث المفضلة' : 'Failed to update favorites', 'error');
    }
  };

  const recordProductView = useCallback((productId: number) => {
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  }, []);

  const toggleCompare = (productId: number) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        showToast(
          lang === 'ar'
            ? 'يمكنك مقارنة حتى 4 منتجات كحد أقصى'
            : 'You can compare up to 4 products at a time',
          'info'
        );
        return prev;
      }
      showToast(
        lang === 'ar' ? 'تمت إضافة المنتج إلى قائمة المقارنة' : 'Added product to comparison',
        'success'
      );
      return [...prev, productId];
    });
  };

  const openShareModal = (payload: SharePayload) => setShareModal(payload);
  const closeShareModal = () => setShareModal(null);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
      showToast(lang === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Signed in successfully', 'success');
    } catch (err: any) {
      throw new Error(formatAuthError(err, lang));
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      showToast(lang === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Signed in successfully', 'success');
      return;
    } catch (firebaseErr: any) {
      const code = String(firebaseErr?.code || '');
      const canFallbackToSupabase =
        isSupabaseConfigured &&
        supabase &&
        (code === 'auth/operation-not-allowed' ||
          code === 'auth/invalid-credential' ||
          code === 'auth/user-not-found' ||
          code === 'auth/wrong-password');

      if (canFallbackToSupabase && supabase) {
        const { data, error: sbErr } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });
        if (!sbErr && data.session?.user) {
          await syncAuthenticatedSession(
            mapSupabaseUser(data.session.user),
            data.session.access_token
          );
          showToast(lang === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Signed in successfully', 'success');
          return;
        }
        if (sbErr) {
          throw new Error(formatAuthError(sbErr, lang));
        }
      }
      throw new Error(formatAuthError(firebaseErr, lang));
    }
  };

  const registerWithEmail = async (
    name: string,
    email: string,
    pass: string
  ): Promise<{ requiresEmailConfirmation?: boolean }> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }
      try {
        await sendEmailVerification(cred.user);
      } catch {
        // Ignore if email verification dispatch is throttled
      }
      showToast(
        lang === 'ar'
          ? 'تم إنشاء الحساب وإرسال رابط تأكيد البريد الإلكتروني'
          : 'Account created and verification email sent',
        'success'
      );
      return { requiresEmailConfirmation: false };
    } catch (firebaseErr: any) {
      const code = String(firebaseErr?.code || '');
      if (code === 'auth/operation-not-allowed' && isSupabaseConfigured && supabase) {
        const { data, error: sbErr } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });
        if (sbErr) {
          throw new Error(formatAuthError(sbErr, lang));
        }
        if (data.session?.user) {
          await syncAuthenticatedSession(
            mapSupabaseUser(data.session.user),
            data.session.access_token
          );
          showToast(
            lang === 'ar'
              ? 'تم إنشاء الحساب وتسجيل الدخول بنجاح'
              : 'Account created and signed in successfully',
            'success'
          );
          return { requiresEmailConfirmation: false };
        }
        showToast(
          lang === 'ar'
            ? 'تم إنشاء الحساب بنجاح! يرجى فتح بريدك الإلكتروني والضغط على رابط التفعيل ثم تسجيل الدخول.'
            : 'Account created! Please check your email to confirm your account before signing in.',
          'success'
        );
        return { requiresEmailConfirmation: true };
      }
      throw new Error(formatAuthError(firebaseErr, lang));
    }
  };

  const sendResetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      showToast(
        lang === 'ar'
          ? 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني'
          : 'Password reset link sent to your email',
        'success'
      );
      return;
    } catch (firebaseErr: any) {
      const code = String(firebaseErr?.code || '');
      if (
        (code === 'auth/operation-not-allowed' || code === 'auth/user-not-found') &&
        isSupabaseConfigured &&
        supabase
      ) {
        const { error: sbErr } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (!sbErr) {
          showToast(
            lang === 'ar'
              ? 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني'
              : 'Password reset link sent to your email',
            'success'
          );
          return;
        }
        throw new Error(formatAuthError(sbErr, lang));
      }
      throw new Error(formatAuthError(firebaseErr, lang));
    }
  };

  const resendVerificationEmail = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        showToast(
          lang === 'ar'
            ? 'تم إعادة إرسال رابط تأكيد البريد الإلكتروني بنجاح. يرجى فحص البريد الوارد أو الرسائل غير المرغوب فيها.'
            : 'Verification email resent. Please check your inbox or spam folder.',
          'success'
        );
        return;
      }
      if (user?.provider === 'supabase' && user.email && isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: user.email,
        });
        if (error) throw new Error(formatAuthError(error, lang));
        showToast(
          lang === 'ar'
            ? 'تم إعادة إرسال رابط التفعيل إلى بريدك الإلكتروني.'
            : 'Verification email resent to your inbox.',
          'success'
        );
        return;
      }
      throw new Error(
        lang === 'ar' ? 'لا يوجد مستخدم مسجل حالياً.' : 'No signed-in user found.'
      );
    } catch (err: any) {
      throw new Error(formatAuthError(err, lang));
    }
  };

  const refreshAuthSession = async () => {
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        const freshToken = await auth.currentUser.getIdToken(true);
        await syncAuthenticatedSession(mapFirebaseUser(auth.currentUser), freshToken);
        showToast(
          auth.currentUser.emailVerified
            ? lang === 'ar'
              ? 'تم التحقق من بريدك الإلكتروني وتحديث الصلاحيات بنجاح!'
              : 'Email verified and permissions refreshed!'
            : lang === 'ar'
            ? 'لم يتم تأكيد البريد الإلكتروني بعد. اضغط على الرابط في بريدك ثم حاول مجدداً.'
            : 'Email is still not verified yet. Please click the link in your inbox first.',
          auth.currentUser.emailVerified ? 'success' : 'info'
        );
        return;
      }
      if (user?.provider === 'supabase' && isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.refreshSession();
        if (data.session?.user) {
          await syncAuthenticatedSession(
            mapSupabaseUser(data.session.user),
            data.session.access_token
          );
        }
      }
    } catch (err: any) {
      throw new Error(formatAuthError(err, lang));
    }
  };

  const logout = async () => {
    await Promise.allSettled([
      signOut(auth),
      isSupabaseConfigured && supabase ? supabase.auth.signOut() : Promise.resolve(),
    ]);
    clearAuthenticatedSession();
    showToast(lang === 'ar' ? 'تم تسجيل الخروج' : 'Signed out', 'info');
  };

  const triggerSecureDownload = async (product: ProductItem) => {
    try {
      const res = await authFetch('/api/downloads/request-token', {
        method: 'POST',
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Download unauthorized', 'error');
        return;
      }
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.setAttribute('download', '');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(
        lang === 'ar'
          ? 'بدأ تحميل الملف المحمّي بنجاح'
          : 'Secure download started successfully',
        'success'
      );
      refreshBootstrap();
    } catch {
      showToast(lang === 'ar' ? 'تعذر بدء التحميل' : 'Failed to start download', 'error');
    }
  };

  return (
    <StoreContext.Provider
      value={{
        lang,
        setLang,
        theme,
        toggleTheme,
        currency,
        setCurrency,
        formatPrice,
        user,
        idToken,
        userRole,
        isSuperAdmin,
        authLoading,
        categories,
        products,
        currencies,
        exchangeRates,
        socialLinks,
        banners,
        settings,
        reviews,
        stats,
        loadingBootstrap,
        refreshBootstrap,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartDrawerOpen,
        setCartDrawerOpen,
        favoriteIds,
        toggleFavorite,
        recentlyViewedIds,
        recordProductView,
        compareIds,
        toggleCompare,
        shareModal,
        openShareModal,
        closeShareModal,
        toast,
        showToast,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        sendResetPassword,
        resendVerificationEmail,
        refreshAuthSession,
        logout,
        triggerSecureDownload,
        authFetch,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
};
