const authorize = (...roles) => {
  return (req, res, next) => {

    if (!req.user || !req.user.role) {
      return res.status(403).json({
        message: 'Bạn không có quyền truy cập!'
      });
    }

    // Ép quyền của user thành IN HOA toàn bộ 
    const userRole = req.user.role.toUpperCase();

    // Ép các quyền được phép thành IN HOA toàn bộ
    const allowedRoles = roles.map(role => role.toUpperCase());

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: 'Bạn không có quyền truy cập!'
      });
    }

    next();
  };
};

module.exports = authorize;