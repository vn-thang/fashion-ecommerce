import React from 'react';

const AuthHeader = ({
  title,
  subtitle,
  activeStep = 1
}) => {
  return (
    <div className="mb-6 text-center">
      <h2 className="text-2xl font-black tracking-tight text-[#1f2438]">
        {title}
      </h2>

      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">
        {subtitle}
      </p>

      <div className="mt-2 flex justify-center gap-1.5">
        {[1, 2, 3].map(step => (
          <span
            key={step}
            className={`h-1.5 w-1.5 rounded-full ${
              step === activeStep
                ? 'bg-[#c36374]'
                : 'bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AuthHeader;