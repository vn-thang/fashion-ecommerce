import React from 'react';

import Pagination from '../../../../shared/components/Pagination';

const FlashSalePagination = (props) => {
  return (
    <div className="mt-8">
      <Pagination {...props} />
    </div>
  );
};

export default FlashSalePagination;