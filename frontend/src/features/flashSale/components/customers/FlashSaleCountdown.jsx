import React, {
  useState,
  useEffect
} from 'react';

const FlashSaleCountdown = ({
  endDate
}) => {

  const calculate = () => {

    if (!endDate) {
      return {
        h: '00',
        m: '00',
        s: '00'
      };
    }

    const distance =
      new Date(endDate) - new Date();

    if (distance <= 0) {
      return {
        h: '00',
        m: '00',
        s: '00'
      };
    }

    const h = Math.floor(
      distance / (1000 * 60 * 60)
    );

    const m = Math.floor(
      (distance %
        (1000 * 60 * 60)) /
        (1000 * 60)
    );

    const s = Math.floor(
      (distance %
        (1000 * 60)) /
        1000
    );

    return {
      h: String(h).padStart(2, '0'),
      m: String(m).padStart(2, '0'),
      s: String(s).padStart(2, '0')
    };
  };

  const [time, setTime] =
    useState(calculate());

  useEffect(() => {

    const interval =
      setInterval(() => {
        setTime(calculate());
      }, 1000);

    return () =>
      clearInterval(interval);

  }, [endDate]);

  const Box = ({ value }) => (
    <div className="w-14 h-14 rounded-lg bg-white text-red-600 flex items-center justify-center font-bold text-2xl">
      {value}
    </div>
  );

  return (
    <div>

      <div className="text-center mb-2">
        Kết thúc sau
      </div>

      <div className="flex items-center gap-2">

        <Box value={time.h} />

        <span>:</span>

        <Box value={time.m} />

        <span>:</span>

        <Box value={time.s} />

      </div>

    </div>
  );
};

export default FlashSaleCountdown;