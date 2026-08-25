const {
  sendSuccess,
  sendError
} = require('../../utils/response');

const chatUploadController = {
  upload: async (req, res) => {
    try {
      if (!req.file) {
        return sendError(
          res,
          400,
          'Vui lòng chọn tập tin.'
        );
      }

      const file = req.file;

      const imageTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif'
      ];

      const type = imageTypes.includes(file.mimetype)
        ? 'IMAGE'
        : 'FILE';

      return sendSuccess(
        res,
        201,
        'Tải tập tin thành công!',
        {
          attachmentUrl: file.path,
          attachmentName: file.originalname,
          type,
          mimeType: file.mimetype,
          size: file.size
        }
      );
    } catch (err) {
      return sendError(
        res,
        400,
        err.message
      );
    }
  }
};

module.exports = chatUploadController;