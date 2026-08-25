const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Bạn chưa đăng nhập!'
      });
    }

    const accessToken = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET
    );

    req.user = {
      userId: decoded.userId,
        role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Phiên đăng nhập đã hết hạn!'
      });
    }

    return res.status(401).json({
      message: 'Token không hợp lệ!'
    });
  }
};

module.exports = authenticate;