import React from 'react';
import { Link } from 'react-router-dom';

const CartItem = ({ item, updateQuantity, removeItem, formatPrice, isSelected, onToggle }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center text-center">
      <div className="col-span-5 flex items-center gap-4 text-left">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="w-4 h-4 cursor-pointer accent-[#ee4d2d] flex-shrink-0"
        />

        <img
          src={item.product?.thumbnailUrl || 'https://via.placeholder.com/80'}
          alt={item.product?.name}
          className="w-20 h-20 object-cover rounded border"
        />

        <div>
          <Link
            to={`/product/${item.product?.slug}`}
            className="text-xs font-medium text-gray-800 hover:text-[#ee4d2d] line-clamp-2"
          >
            {item.product?.name}
          </Link>
          <p className="text-xs text-gray-500 mt-1">
            Phân loại: {item.color}, {item.size}
          </p>
        </div>
      </div>

      <div className="col-span-2">
        {item.isFlashSale ? (
          <div className="flex flex-col items-center">
            <span className="text-[#ee4d2d] font-medium">
              {formatPrice(item.price)}
            </span>
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(item.originalPrice)}
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-600">
            {formatPrice(item.price)}
          </span>
        )}
      </div>

      <div className="col-span-2 flex justify-center items-center">
        <div className="flex items-center border border-gray-300 rounded">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="px-3 py-1 bg-gray-50 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            -
          </button>

          <span className="px-4 py-1 w-12 text-xs text-center border-x border-gray-300">
            {item.quantity}
          </span>

          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.stockQuantity}
            className="px-3 py-1 bg-gray-50 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>

      <div className="col-span-2 text-xs font-medium text-[#ee4d2d]">
        {formatPrice(item.itemTotal)}
      </div>

      <div className="col-span-1">
        <button
          onClick={() => removeItem(item.id)}
          title="Xóa sản phẩm"
          className="p-2 text-gray-500 hover:text-rose-600 transition-colors"
        >
          <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;