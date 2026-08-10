const PRODUCT_CONSTANTS = {
  STATUS: {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
  },
  INVENTORY_TYPE: {
    IMPORT: 'IMPORT',
    EXPORT: 'EXPORT',
    ADJUSTMENT: 'ADJUSTMENT'
  },
  MESSAGES: {
    NAME_REQUIRED: 'Tên sản phẩm không được để trống!',
    CATEGORY_REQUIRED: 'Danh mục sản phẩm (CategoryId) là bắt buộc!',
    BRAND_REQUIRED: 'Thương hiệu sản phẩm (BrandId) là bắt buộc!',
    THUMBNAIL_REQUIRED: 'Ảnh đại diện sản phẩm (Thumbnail) là bắt buộc!',
    ALBUM_REQUIRED: 'Vui lòng chọn ít nhất một file ảnh cho album chi tiết!',
    INVALID_UUID: 'Mã định danh (ID) truyền lên không đúng định dạng UUID!',
    SKU_REQUIRED: 'Mã biến thể (SKU) không được để trống!',
    PRICE_INVALID: 'Giá tiền biến thể phải là số dương lớn hơn 0!',
    STOCK_INVALID: 'Số lượng tồn kho ban đầu phải là số nguyên từ 0 trở lên!',
    SLUG_EXISTED: 'Tên sản phẩm này đã tồn tại, vui lòng chọn tên khác!',
    SKU_EXISTED: 'Mã SKU này đã tồn tại trên hệ thống!',
    PRODUCT_NOT_FOUND: 'Không tìm thấy sản phẩm!',
    VARIANT_NOT_FOUND: 'Không tìm thấy phân loại sản phẩm!',
    PRODUCT_IMAGE_NOT_FOUND: 'Không tìm thấy ảnh sản phẩm!'
  }
};

module.exports = PRODUCT_CONSTANTS;