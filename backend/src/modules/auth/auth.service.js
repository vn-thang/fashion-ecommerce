const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('./auth.repository');
const { TOKEN_EXPIRY, MESSAGES, ROLES } = require('./auth.constants');
const auditLogService = require('../auditLog/auditLog.service');

const crypto = require('crypto');
const mailService = require('../../services/email.service');
const otpRedis = require('../../shared/otp/otpRedis');
const { validatePassword } = require('./auth.validation');

const { generatePasswordResetToken, generateEmailVerificationToken} = require('../../utils/passwordResetToken');
const notificationService = require('../notification/notification.service');
const NOTIFICATION_CONSTANTS = require('../notification/notification.constants');

const signAccessToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_ACCESS_SECRET, { expiresIn: TOKEN_EXPIRY.ACCESS });
};

const signRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: TOKEN_EXPIRY.REFRESH });
};

const signResetToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_RESET_SECRET || 'M4_B1_M4T_RESET', { expiresIn: '15m' });
};

const authService = {
  
register: async ({ fullName, email, password }) => {

  const existingUser =
    await authRepository.findUserByEmailOrPhone(email);

  if (existingUser) {
    throw new Error(MESSAGES.EXISTING_USER);
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const newUser =
    await authRepository.createUserWithCart({
      email,
      passwordHash: hashedPassword,
      fullName,
      phoneNumber: null,
      role: ROLES.CUSTOMER,
      isActive: true,
      emailVerified: false
    });

  const {
    token,
    tokenHash
  } = generateEmailVerificationToken();

  const expiresAt = new Date(
    Date.now() + 15 * 60 * 1000
  );

  await authRepository.createEmailVerificationToken({
    userId: newUser.id,
    tokenHash,
    expiresAt
  });

  const verifyLink =
    `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  try {
    await mailService.sendEmailVerificationEmail(
      newUser.email,
      verifyLink
    );

  } catch (error) {
    console.error('10. GỬI EMAIL THẤT BẠI:', error);

    await authRepository.deleteEmailVerificationToken(
      tokenHash
    );

    throw new Error(
      'Không thể gửi email xác thực. Vui lòng thử lại sau.'
    );
  }

  return {
    id: newUser.id,
    email: newUser.email,
    message:
      'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.'
  };
},

  verifyEmail: async token => {
    if (!token) {
      throw new Error(
        'Token xác thực email không hợp lệ!'
      );
    }
    const {
      createHash
    } = require('crypto');

    const tokenHash = createHash('sha256')
      .update(token)
      .digest('hex');

    const verificationToken =
      await authRepository.findEmailVerificationToken(
        tokenHash
      );

    if (!verificationToken) {
      throw new Error(
        'Link xác thực email không hợp lệ hoặc đã được sử dụng!'
      );
    }

    if (
      verificationToken.expiresAt < new Date()
    ) {
      await authRepository.deleteEmailVerificationToken(
        tokenHash
      );

      throw new Error(
        'Link xác thực email đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.'
      );
    }

    if (verificationToken.user.emailVerified) {
      await authRepository.deleteEmailVerificationToken(
        tokenHash
      );

      return {
        message:
          'Email của bạn đã được xác thực trước đó!'
      };
    }

    await authRepository.verifyEmailTransaction(
      verificationToken.userId
    );

    return {
      message:
        'Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.'
    };
  },

  resendVerificationEmail: async email => {
    const user =
      await authRepository.findUserByEmailOrPhone(email);

    if (!user) {
      throw new Error(
        'Email này không tồn tại trên hệ thống!'
      );
    }
    if (!user.isActive) {
      throw new Error(
        MESSAGES.ACCOUNT_LOCKED
      );
    }
    if (user.emailVerified) {
      throw new Error(
        'Email của tài khoản này đã được xác thực!'
      );
    }
    await authRepository.deleteEmailVerificationTokensByUserId(
      user.id
    );
    const {
      token,
      tokenHash
    } = generateEmailVerificationToken();

    const expiresAt = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await authRepository.createEmailVerificationToken({
      userId: user.id,
      tokenHash,
      expiresAt
    });

    const verifyLink =
      `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    try {
      await mailService.sendEmailVerificationEmail(
        user.email,
        verifyLink
      );
    } catch (error) {
      console.error(
        '❌ Gửi lại email xác thực thất bại:',
        error
      );

      await authRepository.deleteEmailVerificationToken(
        tokenHash
      );

      throw new Error(
        'Không thể gửi email xác thực. Vui lòng thử lại sau.'
      );
    }

    return {
      message:
        'Email xác thực mới đã được gửi. Vui lòng kiểm tra hộp thư của bạn.'
    };
  },

  login: async (username, password) => {
    const user =
      await authRepository.findUserByEmailOrPhone(
        username
      );

    if (!user) {
      throw new Error(
        MESSAGES.INVALID_CREDENTIALS
      );
    }

    if (!user.isActive) {
      throw new Error(
        MESSAGES.ACCOUNT_LOCKED
      );
    }
    if (!user.emailVerified) {
      throw new Error(
        'Vui lòng xác thực email trước khi đăng nhập!'
      );
    }

    const isPasswordMatch =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!isPasswordMatch) {
      throw new Error(
        MESSAGES.INVALID_CREDENTIALS
      );
    }

    const accessToken =
      signAccessToken(
        user.id,
        user.role
      );

    const refreshToken =
      signRefreshToken(user.id);
    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + 7
    );
    await authRepository.saveRefreshToken(
      user.id,
      refreshToken,
      expiresAt
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        emailVerified: user.emailVerified
      }
    };
  },


forgotPassword: async email => {
  const user = await authRepository.findUserByEmailOrPhone(email);

  if (!user) {
    throw new Error('Email này không tồn tại trên hệ thống!');
  }

  if (!user.isActive) {
    throw new Error('Tài khoản hiện đang bị khóa!');
  }

  const { token, tokenHash } =
    generatePasswordResetToken();
  await otpRedis.setResetToken(
    tokenHash,
    user.id
  );

  const resetLink =
    `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  try {
    await mailService.sendPasswordResetEmail(
      user.email,
      resetLink
    );
  } catch (error) {
    console.error(
      '❌ Gửi email reset password thất bại:',
      error
    );
    await otpRedis.deleteResetToken(tokenHash);
    throw new Error(
      'Không thể gửi email khôi phục mật khẩu. Vui lòng kiểm tra cấu hình email.'
    );
  }

  return {
    message:
      'Link đặt lại mật khẩu đã được gửi vào email của bạn!'
  };
},

resetPassword: async (token, newPassword) => {
  if (!token) {
    throw new Error(
      'Token đặt lại mật khẩu không hợp lệ!'
    );
  }

const passwordError =
  validatePassword(newPassword);

if (passwordError) {
  throw new Error(passwordError);
}

  const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const resetToken =
    await otpRedis.getResetToken(tokenHash);

  if (!resetToken) {
    throw new Error(
      'Đường dẫn đặt lại mật khẩu không hợp lệ hoặc đã hết hạn!'
    );
  }

  const hashedPassword =
    await bcrypt.hash(newPassword, 10);

  await authRepository.resetPasswordTransaction(
    resetToken.userId,
    hashedPassword
  );
  await otpRedis.deleteResetToken(tokenHash);

  return {
    message:
      'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.'
  };
},

  refresh: async (token) => {
    const dbToken = await authRepository.findValidRefreshToken(token);
    if (!dbToken || dbToken.expiresAt < new Date()) {
      throw new Error('Refresh Token đã hết hạn hoặc không hợp lệ!');
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await authRepository.findUserById(decoded.userId);
    
    if (!user || !user.isActive) {
      throw new Error(MESSAGES.ACCOUNT_LOCKED);
    }

    const newAccessToken = signAccessToken(user.id, user.role);
    return { accessToken: newAccessToken };
  },

  logout: async (token) => {
    if (token) {
      await authRepository.revokeRefreshToken(token);
    }
    return true;
  },

changePassword: async (
  userId,
  currentPassword,
  newPassword
) => {
  const user =
    await authRepository.findUserById(userId);

  if (!user) {
    throw new Error(
      'Người dùng không tồn tại!'
    );
  }

  const isMatch = await bcrypt.compare(
    currentPassword,
    user.passwordHash
  );

  if (!isMatch) {
    throw new Error(
      'Mật khẩu hiện tại không chính xác!'
    );
  }

  const passwordError =
    validatePassword(newPassword);

  if (passwordError) {
    throw new Error(passwordError);
  }
  const isSamePassword =
    await bcrypt.compare(
      newPassword,
      user.passwordHash
    );

  if (isSamePassword) {
    throw new Error(
      'Mật khẩu mới phải khác mật khẩu hiện tại!'
    );
  }

  const hashedPassword =
    await bcrypt.hash(newPassword, 10);

  await authRepository.resetPasswordTransaction(
    userId,
    hashedPassword
  );

  await auditLogService.createAuditLog({
    userId,
    action: 'CHANGE_PASSWORD',
    entityName: 'User',
    entityId: userId
  });

  try {
    await notificationService.createNotification({
      userId,
      title:
        NOTIFICATION_CONSTANTS.ACCOUNT
          .PASSWORD_CHANGED_TITLE,
      content:
        NOTIFICATION_CONSTANTS.ACCOUNT
          .PASSWORD_CHANGED_CONTENT,
      type:
        NOTIFICATION_CONSTANTS.TYPE
          .PASSWORD_CHANGED,
      data: {
        type:
          NOTIFICATION_CONSTANTS.TYPE
            .PASSWORD_CHANGED
      }
    });
  } catch (error) {
    console.error(
      '[NOTIFICATION] Password changed notification failed:',
      error.message
    );
  }

  return {
    message:
      'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.'
  };
},
};

module.exports = authService;