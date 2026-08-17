const formatCurrency = amount => {
  return `${Number(amount).toLocaleString('vi-VN')}đ`;
};

const formatDiscount = coupon => {
  if (coupon.discountType === 'PERCENTAGE') {
    return `${Number(coupon.discountValue)}%`;
  }

  if (coupon.discountType === 'FIXED') {
    return formatCurrency(coupon.discountValue);
  }

  return '';
};

module.exports = {
  formatCurrency,
  formatDiscount
};