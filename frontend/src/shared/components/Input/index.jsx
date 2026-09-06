import React from 'react';

const Input = ({
  label,
  error,
  type = 'text',
  variant = 'default',
  className = '',
  id,
  required,
  ...props
}) => {
  const baseInputStyles =
    'w-full text-[13px] leading-5 transition-all duration-200 outline-none';

  const variants = {
    default:
      'px-3.5 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm',

    auth:
      'px-5 py-2.5 bg-[#e2e5ec] border border-slate-300/80 rounded-full text-slate-800 placeholder:text-slate-400 focus:border-[#c36374] focus:bg-white focus:shadow-sm'
  };

  const errorStyles = error
    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/10'
    : '';

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-gray-700"
        >
          {label}
          {required && (
            <span className="text-rose-500">*</span>
          )}
        </label>
      )}

      <input
        id={id}
        type={type}
        required={required}
        className={`${baseInputStyles} ${variants[variant]} ${errorStyles} ${className}`}
        {...props}
      />

      {error && (
        <p className="pl-1 text-[11px] font-medium text-rose-500">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

export default Input;