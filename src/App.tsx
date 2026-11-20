/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext.tsx';
import { Layout } from './components/Layout.tsx';
import {
  HomePage,
  MainMarketplacePage,
  CatalogCollectionPage,
  CategoriesDirectoryPage,
  CategoryDetailsPage,
  ProductDetailsPage,
  SearchResultsPage,
  AdvancedSearchPage,
  ReviewsDirectoryPage,
} from './pages/MarketplacePages.tsx';
import {
  ShoppingCartPage,
  CheckoutPage,
  PaymentConfirmationPage,
} from './pages/CartCheckoutPages.tsx';
import {
  CustomerLoginPage,
  CustomerRegistrationPage,
  PasswordRecoveryPage,
  CustomerAccountPortal,
  TechnicalSupportCenterPage,
} from './pages/AccountSupportPages.tsx';
import {
  AboutUsPage,
  ContactUsPage,
  CopyrightPolicyPage,
  LegalPolicyPage,
  DeveloperInfoPage,
  MaintenancePage,
  NotFoundPage,
} from './pages/InfoLegalPages.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';

const RouteCanonicalAndScrollManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update canonical URL dynamically (Section 12 & 21)
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.origin + location.pathname);
  }, [location.pathname]);

  return null;
};

const MAINTENANCE_ALLOWED_PATHS = [
  '/admin-dashboard',
  '/login',
  '/password-recovery',
  '/maintenance',
  '/developer-info',
];

const AppRoutesWithMaintenanceGuard: React.FC = () => {
  const { settings, isSuperAdmin } = useStore();
  const location = useLocation();

  const isMaintenanceActive = settings.maintenance_mode === 'true';
  const isExemptRoute = MAINTENANCE_ALLOWED_PATHS.includes(location.pathname);

  if (isMaintenanceActive && !isSuperAdmin && !isExemptRoute) {
    return <MaintenancePage />;
  }

  return (
    <Routes>
      {/* 1. Homepage */}
      <Route path="/" element={<HomePage />} />
      {/* 2. Main Marketplace */}
      <Route path="/marketplace" element={<MainMarketplacePage />} />
      {/* 3. All Products */}
      <Route path="/products" element={<CatalogCollectionPage mode="all" />} />
      {/* 4. Product Categories */}
      <Route path="/categories" element={<CategoriesDirectoryPage />} />
      {/* 5. Category Details */}
      <Route path="/category/:slug" element={<CategoryDetailsPage />} />
      {/* 6. Product Details */}
      <Route path="/product/:slug" element={<ProductDetailsPage />} />
      {/* 7. Search Results */}
      <Route path="/search" element={<SearchResultsPage />} />
      {/* 8. Advanced Search */}
      <Route path="/advanced-search" element={<AdvancedSearchPage />} />
      {/* 9. Featured Products */}
      <Route path="/featured" element={<CatalogCollectionPage mode="featured" />} />
      {/* 10. New Arrivals */}
      <Route path="/new-arrivals" element={<CatalogCollectionPage mode="new" />} />
      {/* 11. Best Sellers */}
      <Route path="/best-sellers" element={<CatalogCollectionPage mode="bestsellers" />} />
      {/* 12. Special Offers */}
      <Route path="/special-offers" element={<CatalogCollectionPage mode="offers" />} />
      {/* 13. Free Downloads */}
      <Route path="/free-downloads" element={<CatalogCollectionPage mode="free" />} />
      {/* 14. Shopping Cart */}
      <Route path="/cart" element={<ShoppingCartPage />} />
      {/* 15. Checkout */}
      <Route path="/checkout" element={<CheckoutPage />} />
      {/* 16. Payment Confirmation */}
      <Route path="/payment-confirmation" element={<PaymentConfirmationPage />} />
      {/* 17. Customer Registration */}
      <Route path="/register" element={<CustomerRegistrationPage />} />
      {/* 18. Customer Login */}
      <Route path="/login" element={<CustomerLoginPage />} />
      {/* 19. Password Recovery */}
      <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
      {/* 20. My Account */}
      <Route path="/my-account" element={<CustomerAccountPortal section="overview" />} />
      {/* 21. My Profile */}
      <Route path="/my-profile" element={<CustomerAccountPortal section="profile" />} />
      {/* 22. My Orders */}
      <Route path="/my-orders" element={<CustomerAccountPortal section="orders" />} />
      {/* 23. My Downloads */}
      <Route path="/my-downloads" element={<CustomerAccountPortal section="downloads" />} />
      {/* 24. My Favorites */}
      <Route path="/my-favorites" element={<CustomerAccountPortal section="favorites" />} />
      {/* 25. Reviews and Ratings */}
      <Route path="/reviews" element={<ReviewsDirectoryPage />} />
      {/* 26. About Us */}
      <Route path="/about" element={<AboutUsPage />} />
      {/* 27. Contact Us */}
      <Route path="/contact" element={<ContactUsPage />} />
      {/* 28. Technical Support */}
      <Route path="/technical-support" element={<TechnicalSupportCenterPage />} />
      {/* 29. Frequently Asked Questions */}
      <Route path="/faq" element={<LegalPolicyPage policyType="faq" />} />
      {/* 30. Privacy Policy */}
      <Route path="/privacy-policy" element={<LegalPolicyPage policyType="privacy" />} />
      {/* 31. Terms and Conditions */}
      <Route path="/terms" element={<LegalPolicyPage policyType="terms" />} />
      {/* 32. Refund Policy */}
      <Route path="/refund-policy" element={<LegalPolicyPage policyType="refund" />} />
      {/* 33. Digital Product License Policy */}
      <Route path="/license-policy" element={<LegalPolicyPage policyType="license" />} />
      {/* 34. Copyright and Intellectual Property Policy */}
      <Route path="/copyright-policy" element={<CopyrightPolicyPage />} />
      {/* 35. Customer Support Tickets */}
      <Route path="/support-tickets" element={<TechnicalSupportCenterPage />} />
      {/* 36. Developer Information */}
      <Route path="/developer-info" element={<DeveloperInfoPage />} />
      {/* 37. Maintenance Page */}
      <Route path="/maintenance" element={<MaintenancePage />} />
      {/* 38. Private Administrator Dashboard */}
      <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
      {/* 39. 404 Error Page */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <RouteCanonicalAndScrollManager />
        <Layout>
          <AppRoutesWithMaintenanceGuard />
        </Layout>
      </StoreProvider>
    </BrowserRouter>
  );
}
