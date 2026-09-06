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
    'w-full text-xs transition-all duration-200 outline-none';

  const variants = {
    default:
      'px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm',

    auth:
      'px-6 py-3 bg-[#e2e5ec] border border-slate-300 rounded-full text-slate-800 focus:border-[#c36374] focus:bg-white focus:shadow-md placeholder:text-slate-400'
  };

  const errorStyles = error
    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/10'
    : '';

  return (
    <div className="w-full text-left space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-gray-700"
        >
          {label}
          {required && <span className="text-rose-500">*</span>}
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
        <p className="text-xs font-medium text-rose-500 pl-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

export default Input;