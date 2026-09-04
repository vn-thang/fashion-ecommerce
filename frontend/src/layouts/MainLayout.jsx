import { Outlet } from 'react-router-dom';
import CustomerHeader from './components/CustomerHeader';
import CustomerFooter from './components/CustomerFooter';
import CustomerChatWidget from '../features/chat/components/customer/CustomerChatWidget';
import { CustomerChatProvider } from '../features/chat/context/CustomerChatContext';

const MainLayout = () => {
  return (
    <CustomerChatProvider>
    <div className="flex min-h-screen flex-col bg-[#f5f5f5] font-sans text-gray-900">
      <CustomerHeader />

      <main className="mx-auto w-[95%] max-w-[1600px] flex-1 px-4 pb-12 pt-6">
        <Outlet />
      </main>

      <CustomerFooter />

      <CustomerChatWidget />
    </div>
    </CustomerChatProvider>
  );
};

export default MainLayout;