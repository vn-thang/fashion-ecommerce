const { MESSAGES } = require('./auth.constants');

const authValidation = {
  validateRegister: (req, res, next) => {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ tất cả thông tin bắt buộc!' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Định dạng Email không hợp lệ!' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu phải chứa ít nhất 6 ký tự!' });
    }

    next();
  },

  validateLogin: (req, res, next) => {
    const { username, password } = req.body; 

  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ Tài khoản và Mật khẩu!' });
  }
  next();
  }
};

module.exports = authValidation;