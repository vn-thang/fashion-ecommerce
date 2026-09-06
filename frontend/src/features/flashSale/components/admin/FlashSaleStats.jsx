import React from 'react';

const FlashSaleStats = ({ stats }) => {
  const cards = [
    {
      title: 'Tổng chương trình',
      value: stats.total,
      color: 'bg-indigo-50 text-indigo-700'
    },
    {
      title: 'Đang diễn ra',
      value: stats.running,
      color: 'bg-green-50 text-green-700'
    },
    {
      title: 'Sắp diễn ra',
      value: stats.upcoming,
      color: 'bg-blue-50 text-blue-700'
    },
    {
      title: 'Đã kết thúc',
      value: stats.finished,
      color: 'bg-gray-100 text-gray-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map(card => (
        <div
          key={card.title}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4"
        >
          <p className="text-xs text-gray-500">{card.title}</p>

          <div className={`inline-flex mt-4 px-4 py-2 rounded-xl text-2xl font-bold ${card.color}`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlashSaleStats;