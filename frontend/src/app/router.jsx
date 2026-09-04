import { createBrowserRouter, Navigate } from 'react-router-dom';

import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage';
import CategoryPage from '../features/category/pages/admin/categoryPage';
import AdminLayout from '../layouts/AdminLayout';
import BrandPage from '../features/brand/pages/admin/BrandPage';
import ProductPage from '../features/product/pages/admin/ProductPage';
import MainLayout from '../layouts/MainLayout';
import CustomerHome from '../features/product/pages/customer/CustomerHome';
import HomePage from '../features/home/pages/HomePage';
import ProductDetail from '../features/product/pages/customer/ProductDetail';
import CartPage from '../features/cart/pages/CartPage';
import { CartProvider } from '../features/cart/hooks/CartContext';
import AccountLayout from '../layouts/AccountLayout';
import ProfilePage from '../features/profile/pages/customer/ProfilePage';
import AddressPage from '../features/profile/pages/customer/AddressPage';
import CouponPage from '../features/coupon/pages/admin/CouponPage';
import CheckoutPage from '../features/order/pages/customer/CheckoutPage';
import OrderSuccessPage from '../features/order/pages/customer/OrderSuccessPage';
import { useAuth } from '../features/auth/store/authContext';
import AdminOrderPage from '../features/order/pages/admin/AdminOrderPage';
import MyOrdersPage from '../features/order/pages/customer/MyOrdersPage';
import OrderDetailPage from '../features/order/pages/customer/OrderDetailPage';
import ReviewAdminPage from '../features/review/pages/admin/ReviewAdminPage';
import StoreSettingPage from '../features/storeSetting/pages/admin/StoreSettingPage';
import BannerPage from '../features/banner/pages/admin/BannerPage';
import FlashSaleAdminPage from '../features/flashSale/pages/admin/FlashSaleAdminPage';
import FlashSaleVariantPage from '../features/flashSale/pages/admin/FlashSaleVariantPage';
import FlashSalePage from '../features/flashSale/pages/customers/FlashSalePage';
import PaymentReturnPage from '../features/payment/pages/customers/PaymentReturnPage';
import AdminPaymentPage from '../features/payment/pages/admin/AdminPaymentPage';
import InventoryPage from '../features/inventory/pages/admin/InventoryPage';
import UserPage from '../features/profile/pages/admin/UserPage';
import DashBoardPage from '../features/dashboard/pages/DashboardPage';
import AuditLogPage from '../features/auditLog/pages/admin/AuditLogPage';
import NotificationPage from '../features/notification/pages/customer/NotificationPage';
import AdminNotificationPage from '../features/notification/pages/admin/AdminNotificationPage';
import ChatAdminPage from '../features/chat/pages/admin/ChatAdminPage';
import ChangePasswordPage from '../features/auth/pages/ChangePasswordPage';
import VerifyEmailPage from '../features/auth/pages/VerifyEmailPage';
import HelpPage from '../features/policy/pages/HelpPage';
import ShippingPolicyPage from '../features/policy/pages/ShippingPolicyPage';
import RefundPolicyPage from '../features/policy/pages/RefundPolicyPage';
import PrivacyPage from '../features/policy/pages/PrivacyPage';
import TermsPage from '../features/policy/pages/TermsPage';
import ReturnManagementPage from '../features/return/pages/admin/ReturnManagementPage';
import ReturnPage from '../features/return/pages/customer/ReturnPage';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const router = createBrowserRouter([
  {
    path: '/',
   element: (
      <CartProvider>
        <MainLayout />
      </CartProvider>
    ),
    children: [
      {
        index: true, 
        element: <HomePage />, 
      },
      {
        path: 'products', 
        element: <CustomerHome />,
      },
       {
        path: 'flashSales', 
        element: <FlashSalePage />,
      },
      {
        path: "/product/:slug",
        element: <ProductDetail />
      },
      {
        path: 'cart',
        element: <CartPage />
      },
      {
        path: 'notifications',
        element: <NotificationPage />
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'checkout/success',
        element: (
          <ProtectedRoute>
            <OrderSuccessPage />
          </ProtectedRoute>
        )
      },
      {
      path: '/payment/return',
      element: (
          <PaymentReturnPage />
      )
      },

      {
        path: 'account',
        element: (
          <ProtectedRoute>
            <AccountLayout />
          </ProtectedRoute>
        ), 
        children: [
          {
            path: 'profile', 
            element: <ProfilePage />
          },
          {
            path: 'addresses', 
            element: <AddressPage />
          },
          {
            path: 'orders', 
            element: <MyOrdersPage />
          },
          {
            path: 'orders/:id', 
            element: <OrderDetailPage />
          },
          {
            path: 'returns',
            element: <ReturnPage />
          }
        ]
      }, 
       {
            path: 'help', 
            element: <HelpPage />
          },
           {
            path: 'shipping-policy', 
            element: <ShippingPolicyPage />
          },
           {
            path: 'refund-policy', 
            element: <RefundPolicyPage />
          },
           {
            path: '/privacy', 
            element: <PrivacyPage />
          },
           {
            path: 'terms', 
            element: <TermsPage />
          },
    ]
  },

  {
    path: '/login',
    element: <LoginPage />,
  },

  {
    path: '/register',
    element: <RegisterPage />,
  },
 {
    path: '/verify-email',
    element: <VerifyEmailPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },

  {
  path: '/reset-password',
  element: <ResetPasswordPage />
  },

  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: <DashBoardPage />,
      },
     {
      path: "change-password",
      element: <ChangePasswordPage />
      },
      {
       path: 'categories',
        element: <CategoryPage />,
        },
        {
       path: 'brands',
        element: <BrandPage />,
        },
         {
       path: 'products',
        element: <ProductPage />,
        },
        {
         path: 'coupons',
        element: <CouponPage />,
        },
        {
        path: 'flashSales',
        element: <FlashSaleAdminPage />,
        },
        {
        path: 'flashSales/:flashSaleId/variants',
        element: <FlashSaleVariantPage />
        },
       {
        path: 'sales',
        children: [
          {
            path: 'orders',
            element: <AdminOrderPage />
          },
          {
            path: 'payments',
            element: <AdminPaymentPage />
          },
          {
            path: 'returns',
            element: <ReturnManagementPage />
          }
        ]
      },

       {
        path: 'users',
        element: <UserPage />,
        },
        {
        path: 'reviews',
        element: <ReviewAdminPage />,
        },
         {
        path: 'inventory',
        element: <InventoryPage />,
        },
        {
        path: 'notifications',
        element: <AdminNotificationPage />,
        },
        {
        path: 'chat',
        element: <ChatAdminPage />,
        },

        {
        path: 'audit-logs',
        element: <AuditLogPage />,
        },

      {
        path: 'settings',
        children: [
          {
            path: 'store',
            element: <StoreSettingPage />
          },
           {
            path: 'banners',
            element: <BannerPage />
          },
          
        ]
      }
    ],
  },
]);