const { MESSAGES } = require('./category.constants');

const validateUUID = id => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const categoryValidation = {
  validateCreate: (req, res, next) => {
    const { name, parentId } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: MESSAGES.NAME_REQUIRED });
    }

    if (parentId && !validateUUID(parentId)) {
      return res.status(400).json({ success: false, message: `ParentId ${MESSAGES.INVALID_ID}` });
    }

    next();
  },

  validateUpdate: (req, res, next) => {
    const { id } = req.params;
    const { name, parentId } = req.body;

    if (!validateUUID(id)) {
      return res.status(400).json({ success: false, message: MESSAGES.INVALID_ID });
    }

    if (name !== undefined && name.trim() === '') {
      return res.status(400).json({ success: false, message: MESSAGES.NAME_REQUIRED });
    }

    if (parentId && !validateUUID(parentId)) {
      return res.status(400).json({ success: false, message: `ParentId ${MESSAGES.INVALID_ID}` });
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

module.exports = categoryValidation;