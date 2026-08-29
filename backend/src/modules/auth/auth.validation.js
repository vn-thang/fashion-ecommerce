const { MESSAGES } = require('./auth.constants');

const validatePassword = password => {
  if (!password) {
    return 'Mật khẩu không được để trống!';
  }

  if (password.length < 8) {
    return 'Mật khẩu phải có ít nhất 8 ký tự!';
  }

  if (!/[A-Za-z]/.test(password)) {
    return 'Mật khẩu phải chứa ít nhất 1 chữ cái!';
  }

  if (!/\d/.test(password)) {
    return 'Mật khẩu phải chứa ít nhất 1 chữ số!';
  }

  return null;
};

const authValidation = {
  validateRegister: (req, res, next) => {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        message:
          'Vui lòng điền đầy đủ tất cả thông tin bắt buộc!'
      });
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Định dạng Email không hợp lệ!'
      });
    }

    const passwordError =
      validatePassword(password);

    if (passwordError) {
      return res.status(400).json({
        message: passwordError
      });
    }

    next();
  },

  validateLogin: (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message:
          'Vui lòng nhập đầy đủ Tài khoản và Mật khẩu!'
      });
    }

    next();
  },

  validatePassword
};

module.exports = authValidation;