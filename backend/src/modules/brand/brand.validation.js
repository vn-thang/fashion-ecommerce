const { MESSAGES } = require('./brand.constants');

const validateUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const brandValidation = {
  validateCreate: (req, res, next) => {
    const { name } = req.body;

    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ success: false, message: MESSAGES.NAME_REQUIRED });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: MESSAGES.LOGO_REQUIRED });
    }

    next();
  },

  validateUpdate: (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!validateUUID(id)) {
      return res.status(400).json({ success: false, message: MESSAGES.INVALID_ID });
    }

    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      return res.status(400).json({ success: false, message: MESSAGES.NAME_REQUIRED });
    }

    next();
  },

  validateId: (req, res, next) => {
    if (!validateUUID(req.params.id)) {
      return res.status(400).json({ success: false, message: MESSAGES.INVALID_ID });
    }

    next();
  }
};

module.exports = brandValidation;