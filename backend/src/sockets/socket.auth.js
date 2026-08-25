const jwt = require('jsonwebtoken');

const socketAuth = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Bạn chưa đăng nhập!'));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    socket.user = {
      userId: decoded.userId,
      role: decoded.role?.toUpperCase()
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new Error('Phiên đăng nhập đã hết hạn!'));
    }

    return next(new Error('Token không hợp lệ!'));
  }
};

module.exports = socketAuth;