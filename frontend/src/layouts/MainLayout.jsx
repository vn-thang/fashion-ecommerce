import { Outlet } from 'react-router-dom';
import CustomerHeader from './components/CustomerHeader';
import CustomerFooter from './components/CustomerFooter';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5] font-sans text-gray-900">
      <CustomerHeader />
     <main className="flex-1 w-[95%] max-w-[1600px] mx-auto px-4 pt-6 pb-12">
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  );
};

export default MainLayout;