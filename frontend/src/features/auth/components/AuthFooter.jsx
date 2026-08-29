import React from 'react';
import { Link } from 'react-router-dom';

const AuthFooter = ({
  text,
  linkText,
  to
}) => {
  return (
    <div className="mt-6 text-center text-[11px] font-bold tracking-wide text-slate-500">
      {text}

      <Link
        to={to}
        className="ml-1 font-extrabold text-[#c36374] hover:underline"
      >
        {linkText}
      </Link>
    </div>
  );
};

export default AuthFooter;