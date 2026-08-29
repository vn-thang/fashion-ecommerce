const authorize = (...roles) => {
  return (req, res, next) => {

    if (!req.user || !req.user.role) {
      return res.status(403).json({
        message: 'Bạn không có quyền truy cập!'
      });
    }
    const userRole = req.user.role.toUpperCase();
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