const authService = require('./auth.service');
const { TOKEN_EXPIRY, MESSAGES } = require('./auth.constants');
const { sendSuccess, sendError } = require('../../utils/response');

const authController = {
  register: async (req, res) => {
    try {
      const result = await authService.register(req.body);
      return sendSuccess(res, 201, MESSAGES.REGISTER_SUCCESS, result);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  },

   verifyEmail: async (req, res) => {
    try {
      const { token } = req.query;

      const result = await authService.verifyEmail(token);

      return sendSuccess(
        res,
        200,
        result.message
      );
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  },

resendVerificationEmail: async (req, res) => {
  try {
    const { email } = req.body;

    const result =
      await authService.resendVerificationEmail(email);

    return sendSuccess(
      res,
      200,
      result.message,
      {
        verificationLink: result.verificationLink
      }
    );
  } catch (error) {
    return sendError(res, 400, error.message);
  }
},

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const { accessToken, refreshToken, user } = await authService.login(username, password);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: TOKEN_EXPIRY.COOKIE_MAX_AGE
      });
      return sendSuccess(res, 200, MESSAGES.LOGIN_SUCCESS, { accessToken, user });
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  },

  refresh: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return sendError(res, 401, 'Không tìm thấy session phục hồi, vui lòng đăng nhập lại!');
      }

      const { accessToken } = await authService.refresh(refreshToken);
      return sendSuccess(res, 200, MESSAGES.REFRESH_SUCCESS, { accessToken });
    } catch (error) {
      return sendError(res, 401, error.message);
    }
  },

  logout: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      await authService.logout(refreshToken);

      res.clearCookie('refreshToken');
      return sendSuccess(res, 200, MESSAGES.LOGOUT_SUCCESS);
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }, 

forgotPassword: async (req, res) => {
  try {
    const { email } = req.body;

    const result =
      await authService.forgotPassword(email);

    return sendSuccess(
      res,
      200,
      result.message,
      {
        resetLink: result.resetLink
      }
    );
  } catch (error) {
    return sendError(res, 400, error.message);
  }
},

  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      const result = await authService.resetPassword(token, newPassword);
      return sendSuccess(res, 200, 'Đặt lại mật khẩu thành công!', result);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  },

  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;

      const result = await authService.changePassword(userId, currentPassword, newPassword);

      res.clearCookie('refreshToken');
      return sendSuccess(res, 200, 'Đổi mật khẩu thành công!', result);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }
};

module.exports = authController;