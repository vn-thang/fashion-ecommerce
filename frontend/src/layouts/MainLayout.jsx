import { Outlet } from 'react-router-dom';
import CustomerHeader from './components/CustomerHeader';
import CustomerFooter from './components/CustomerFooter';
import CustomerChatWidget from '../features/chat/components/customer/CustomerChatWidget';
import { CustomerChatProvider } from '../features/chat/context/CustomerChatContext';
import ScrollToTop from '../shared/components/ScrollToTop';

const MainLayout = () => {
  return (
    <CustomerChatProvider>
    <div className="customer-app flex min-h-screen flex-col bg-slate-50 text-slate-900">

       <ScrollToTop />
      <CustomerHeader />

<main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-8">
  <Outlet />
</main>

      <CustomerFooter />

      <CustomerChatWidget />
    </div>
    </CustomerChatProvider>
  );
};

export default MainLayout;