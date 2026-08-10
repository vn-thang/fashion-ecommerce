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
          }
        ]
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