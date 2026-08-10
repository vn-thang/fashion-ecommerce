import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const FlashSaleHeader = ({ flashSale }) => {

  const calculateTimeLeft = () => {
    if (!flashSale?.endDate) return null;

    const difference =
      new Date(flashSale.endDate).getTime() - Date.now();

    if (difference <= 0) {
      return {
        hours: '00',
        minutes: '00',
        seconds: '00'
      };
    }

    const hours = Math.floor(
      difference / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
      (difference % (1000 * 60 * 60)) /
      (1000 * 60)
    );

    const seconds = Math.floor(
      (difference % (1000 * 60)) /
      1000
    );

    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0')
    };
  };

  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [flashSale]);

  const countdown = useMemo(() => {
    if (!timeLeft) return null;

    return (
      <div className="flex items-center gap-1">

        {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map(
          (item, index) => (
            <React.Fragment key={index}>
              <div className="bg-black text-white rounded px-2 py-1 text-sm font-bold min-w-[36px] text-center">
                {item}
              </div>

              {index < 2 && (
                <span className="font-bold text-gray-600">
                  :
                </span>
              )}
            </React.Fragment>
          )
        )}

      </div>
    );
  }, [timeLeft]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-red-50 via-white to-white">

      {/* Bên trái */}
      <div className="flex flex-wrap items-center gap-5">

        <div className="flex items-center gap-2">

          <span className="text-3xl">
            ⚡
          </span>

          <div>
            <h2 className="text-2xl font-bold text-[#ee4d2d] uppercase tracking-wide">
              Flash Sale
            </h2>

            {flashSale?.name && (
              <p className="text-sm text-gray-500">
                {flashSale.name}
              </p>
            )}
          </div>

        </div>

        {/* Countdown */}
        {countdown}

      </div>

      {/* Bên phải */}
      <Link
        to="/flashSales"
         className="flex items-center gap-1 text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors"
      >
        Xem tất cả
             <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>

    </div>
  );
};

export default FlashSaleHeader;