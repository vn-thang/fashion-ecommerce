const validateUUID = id => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(id);
};

const auditLogValidation = {
  validateId: (req, res, next) => {
    if (!validateUUID(req.params.id)) {
      return res.status(400).json({
        success: false,
        message:
          'Mã audit log phải là UUID hợp lệ!'
      });
    }

    next();
  }
};

module.exports = auditLogValidation;