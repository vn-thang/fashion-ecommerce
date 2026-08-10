import React, { useEffect } from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'md',
  className = ''
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    '2xl': "max-w-6xl",
    '3xl': "max-w-7xl",
     full: "max-w-[1500px]"
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity cursor-pointer" 
        onClick={onClose} 
      />
      <div className="flex min-h-full items-center justify-center p-4 text-center pointer-events-none">
        <div className={`relative z-10 pointer-events-auto w-full ${sizeClasses[size] || sizeClasses.md} ${className} transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-2xl transition-all border border-gray-100 animate-scaleUp`}>
          
          <div className="flex items-center justify-between bg-slate-50/70 px-6 py-4 border-b border-gray-150">
            <h3 className="text-lg font-bold text-slate-800 tracking-wide">{title}</h3>
            <button 
              onClick={onClose} 
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors outline-none"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">
            {children}
          </div>

          {footer && (
            <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50/50 border-t border-gray-100">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;