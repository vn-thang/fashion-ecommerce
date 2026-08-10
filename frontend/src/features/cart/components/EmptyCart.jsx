import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../shared/components/Button';

const EmptyCart = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 rounded-lg shadow-sm">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-xl font-medium text-gray-700 mb-6">Giỏ hàng của bạn đang trống</h2>
      <Link to="/">
        <Button variant="primary" className="bg-[#ee4d2d] hover:bg-[#d74123]">
          Tiếp tục mua sắm
        </Button>
      </Link>
    </div>
  );
};

export default EmptyCart;