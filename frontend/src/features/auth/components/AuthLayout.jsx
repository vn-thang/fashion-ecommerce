import React from 'react';

import { useAuthStore } from '../hooks/useAuthStore';

const AuthLayout = ({
  children,
  brandIcon = '👑',
  brandDescription,
  arrow = '‹',
  height = 'min-h-[500px]'
}) => {
  const { storeName, logoUrl } = useAuthStore();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-[#8893b0] via-[#a1889f] to-[#6d9ac4] p-4 font-sans">
      <div
        className={`relative flex w-full max-w-4xl ${height} overflow-hidden rounded-[35px] bg-[#eaecf0] shadow-2xl`}
      >
        <div
          className="relative z-10 flex w-[45%] flex-col items-center justify-center bg-[#1f2438] p-10 text-center text-white"
          style={{
            clipPath:
              'polygon(0 0, 100% 0, 88% 50%, 100% 100%, 0 100%)'
          }}
        >
          <div className="flex flex-col items-center gap-4 pr-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 text-3xl text-white shadow-lg">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={storeName}
                  className="h-full w-full object-cover"
                />
              ) : (
                brandIcon
              )}
            </div>

            <h1 className="text-3xl font-black uppercase tracking-widest">
              {storeName}
            </h1>

            <p className="max-w-[220px] text-[12px] leading-relaxed text-slate-300">
              {brandDescription}
            </p>
          </div>
        </div>

        <div className="absolute left-[42.5%] top-1/2 z-30 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[#eaecf0] bg-[#c36374] text-white shadow-xl transition hover:scale-110 active:scale-95">
          <span className="mb-0.5 select-none text-lg font-black leading-none">
            {arrow}
          </span>
        </div>

        <div className="relative z-20 flex w-[55%] flex-col justify-center bg-[#eaecf0] py-8 pl-16 pr-12">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;