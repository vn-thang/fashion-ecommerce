import React from 'react';

const AuthMessage = ({ type = 'error', children }) => {
  if (!children) return null;

  const styles =
    type === 'success'
      ? 'border-green-200 bg-green-100 text-green-700'
      : 'border-red-200 bg-red-100 text-red-600';

  const icon = type === 'success' ? '🎉' : '⚠️';

  return (
    <div
      className={`mb-4 rounded-xl border p-2.5 text-center text-xs font-bold ${styles}`}
    >
      {icon} {children}
    </div>
  );
};

export default AuthMessage;
