
import React, { useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import CartSidebar from './components/cart/CartSidebar';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

// --- Lazy-loaded pages for code splitting (faster initial load) ---
const Home = lazy(() => import('./pages/Home'));
const ProductListing = lazy(() => import('./pages/ProductListing'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// Static Pages
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const ShippingReturns = lazy(() => import('./pages/ShippingReturns'));
const About = lazy(() => import('./pages/About'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));

// Admin Imports
import AdminRoute from './components/auth/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
const DashboardOverview = lazy(() => import('./pages/admin/DashboardOverview'));
const ProductManagement = lazy(() => import('./pages/admin/ProductManagement'));
const OrderManagement = lazy(() => import('./pages/admin/OrderManagement'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const CategoryManagement = lazy(() => import('./pages/admin/CategoryManagement'));
const ReviewManagement = lazy(() => import('./pages/admin/ReviewManagement'));
const AdManagement = lazy(() => import('./pages/admin/AdManagement'));
const WishlistManagement = lazy(() => import('./pages/admin/WishlistManagement'));
const TestimonialManagement = lazy(() => import('./pages/admin/TestimonialManagement'));
const ReturnManagement = lazy(() => import('./pages/admin/ReturnManagement'));
const SettingsOverview = lazy(() => import('./pages/admin/SettingsOverview'));
const ShippingSettings = lazy(() => import('./pages/admin/ShippingSettings'));
const ThemeSettings = lazy(() => import('./pages/admin/ThemeSettings'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));

import ProtectedRoute from './components/auth/ProtectedRoute';
import AdDisplayManager from './components/common/AdDisplayManager';
import CookieConsent from './components/common/CookieConsent';
import SmoothScroll from './components/common/SmoothScroll';
import WhatsAppButton from './components/common/WhatsAppButton';

// Minimal spinner shown during page transitions
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin h-8 w-8 border-[3px] border-[#f85606] border-t-transparent rounded-full" />
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const { isOpen, closeCart, openCart } = useCart();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <SmoothScroll />
      {!isAdminRoute && <Header onCartOpen={openCart} />}
      {!isAdminRoute && <CartSidebar isOpen={isOpen} onClose={closeCart} />}
      {!isAdminRoute && <WhatsAppButton />}
      <AdDisplayManager />
      <CookieConsent />

      <main className={`flex-grow bg-sand ${!isAdminRoute ? 'pt-28 md:pt-32 lg:pt-38' : ''}`}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/track-order" element={<TrackOrder />} />

            {/* Static Pages */}
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shipping-returns" element={<ShippingReturns />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />

            {/* Auth pages */}
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<DashboardOverview />} />
                <Route path="/admin/products" element={<ProductManagement />} />
                <Route path="/admin/inventory" element={<ProductManagement />} />
                <Route path="/admin/orders" element={<OrderManagement />} />
                <Route path="/admin/returns" element={<ReturnManagement />} />
                <Route path="/admin/settings" element={<SettingsOverview />} />
                <Route path="/admin/theme" element={<ThemeSettings />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/categories" element={<CategoryManagement />} />
                <Route path="/admin/reviews" element={<ReviewManagement />} />
                <Route path="/admin/ads" element={<AdManagement />} />
                <Route path="/admin/wishlist" element={<WishlistManagement />} />
                <Route path="/admin/testimonials" element={<TestimonialManagement />} />
                <Route path="/admin/shipping" element={<ShippingSettings />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
};

const App = () => {
  const app = (
    <Router>
      <LanguageProvider>
        <ThemeProvider>
          <SiteSettingsProvider>
          <AuthProvider>
            <CartProvider>
              <Toaster position="bottom-right" reverseOrder={false} />
              <AppContent />
            </CartProvider>
          </AuthProvider>
        </SiteSettingsProvider>
        </ThemeProvider>
      </LanguageProvider>
    </Router>
  );

  // Only mount the Google provider when a client id is configured,
  // so the rest of the app keeps working without it.
  if (!GOOGLE_CLIENT_ID) {
    return app;
  }

  return <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{app}</GoogleOAuthProvider>;
};

export default App;
