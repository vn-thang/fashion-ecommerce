import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

  const variants = {
    primary:
      'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 shadow-sm shadow-emerald-600/10',

    secondary:
      'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 shadow-sm shadow-indigo-600/10',

    danger:
      'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-sm shadow-rose-600/10',

    outline:
      'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:ring-indigo-500',

    ghost:
      'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',

    auth:
      'rounded-full bg-[#c36374] text-white shadow-sm hover:bg-[#b05263] hover:shadow-md'
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-[11px] gap-1',
    md: 'px-3 py-1.5 text-xs gap-1.5',
    lg: 'px-4 py-2 text-sm gap-2'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="h-3.5 w-3.5 animate-spin text-current"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />

          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2
            5.291A7.962 7.962 0 014 12H0c0
            3.042 1.135 5.824 3
            7.938l3-2.647z"
          />
        </svg>
      )}

      {children}
    </button>
  );
};

export default Button;