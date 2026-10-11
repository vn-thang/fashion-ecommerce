const CustomerPageHeader = ({
  title,
  description,
  action,
  className = ''
}) => (
  <div
    className={`flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between ${className}`}
  >
    <div>
      <h1 className="text-lg font-semibold leading-7 text-slate-900 sm:text-xl">
        {title}
      </h1>
      {description && (
        <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500">
          {description}
        </p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export default CustomerPageHeader;
