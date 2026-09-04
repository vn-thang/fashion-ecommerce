import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

const PolicyLayout = ({
  title,
  description,
  breadcrumb = title,
  children
}) => {
  return (
    <main className="min-h-screen bg-gray-50 py-8 sm:py-10 lg:py-12">
      <div className="mx-auto w-[95%] max-w-[1100px]">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-sm text-gray-500"
        >
          <Link
            to="/"
            className="transition hover:text-[#ee4d2d]"
          >
            Trang chủ
          </Link>

          <FaChevronRight
            size={10}
            className="text-gray-400"
          />

          <span className="font-medium text-gray-700">
            {breadcrumb}
          </span>
        </nav>
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {title}
          </h1>

          {description && (
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              {description}
            </p>
          )}
        </div>
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
          {children}
        </article>

      </div>
    </main>
  );
};

export default PolicyLayout;
