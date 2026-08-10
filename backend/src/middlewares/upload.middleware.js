const multer = require('multer');

const uploadMiddleware = {

  single: (uploaderInstance, fieldName) => {
    return (req, res, next) => {

      uploaderInstance.single(fieldName)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({
            success: false,
            message: `Lỗi tải tập tin (Multer): ${err.message}`
          });
        } else if (err) {
          return res.status(400).json({
            success: false,
            message: err.message || 'Đã xảy ra lỗi trong quá trình upload ảnh!'
          });
        }
        
        next();
      });
    };
  },

  array: (uploaderInstance, fieldName, maxCount = 5) => {
    return (req, res, next) => {
      uploaderInstance.array(fieldName, maxCount)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
              success: false,
              message: `Vượt quá số lượng file cho phép! Tối đa là ${maxCount} ảnh.`
            });
          }
          return res.status(400).json({
            success: false,
            message: `Lỗi tải chuỗi tập tin: ${err.message}`
          });
        } else if (err) {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }
        next();
      });
    };
  }, 
  
  fields: (uploaderInstance, fieldsConfig) => {
    return (req, res, next) => {
      uploaderInstance.fields(fieldsConfig)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ success: false, message: `Lỗi tải tập tin: ${err.message}` });
        } else if (err) {
          return res.status(400).json({ success: false, message: err.message });
        }
        next();
      });
    };
  }
};

module.exports = uploadMiddleware;