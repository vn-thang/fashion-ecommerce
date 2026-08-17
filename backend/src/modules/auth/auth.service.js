const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('./auth.repository');
const { TOKEN_EXPIRY, MESSAGES, ROLES } = require('./auth.constants');
const auditLogService = require('../auditLog/auditLog.service');

const crypto = require('crypto');
const mailService = require('../../services/email.service');
const {
  generatePasswordResetToken
} = require('../../utils/passwordResetToken');
const notificationService = require('../notification/notification.service');
const NOTIFICATION_CONSTANTS = require('../notification/notification.constants');

// Các hàm helper nội bộ để ký Token
const signAccessToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_ACCESS_SECRET, { expiresIn: TOKEN_EXPIRY.ACCESS });
};

const signRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: TOKEN_EXPIRY.REFRESH });
};

// Mã token ngắn hạn 15 phút dành cho việc đổi mật khẩu
const signResetToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_RESET_SECRET || 'M4_B1_M4T_RESET', { expiresIn: '15m' });
};

const authService = {
  
  register: async ({ email, password, fullName }) => {
    const existingUser = await authRepository.findUserByEmailOrPhone(email);
    if (existingUser) {
      throw new Error(MESSAGES.EXISTING_USER);
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10: độ tốn công khi hash
 
    const newUser = await authRepository.createUserWithCart({
      email,
      passwordHash: hashedPassword,
      fullName,
      phoneNumber: null, 
      role: ROLES.CUSTOMER,
      isActive: true
    });

    return { id: newUser.id };
  },

  login: async (username, password) => {
    const user = await authRepository.findUserByEmailOrPhone(username, username);
    if (!user) {
      throw new Error(MESSAGES.INVALID_CREDENTIALS);
    }

    if (!user.isActive) {
      throw new Error(MESSAGES.ACCOUNT_LOCKED);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordMatch) {
      throw new Error(MESSAGES.INVALID_CREDENTIALS);
    }

    const accessToken = signAccessToken(user.id, user.role);
    const refreshToken = signRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await authRepository.saveRefreshToken(user.id, refreshToken, expiresAt);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role }
    };
  },

forgotPassword: async (email) => {
  const user = await authRepository.findUserByEmailOrPhone(email);

  if (!user) {
    throw new Error('Email này không tồn tại trên hệ thống!');
  }

  if (!user.isActive) {
    throw new Error('Tài khoản hiện đang bị khóa!');
  }

  await authRepository.deletePasswordResetTokensByUser(user.id);

  const { token, tokenHash } = generatePasswordResetToken();

  const expiresAt = new Date(
    Date.now() + 15 * 60 * 1000
  );

  await authRepository.createPasswordResetToken({
    userId: user.id,
    tokenHash,
    expiresAt
  });

  const resetLink =
    `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  try {
    await mailService.sendPasswordResetEmail(
      user.email,
      resetLink
    );
  } catch (error) {
    console.error('❌ Gửi email reset password thất bại:', error);

    await authRepository.deletePasswordResetTokensByUser(
      user.id
    );

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

  if (!newPassword || newPassword.length < 8) {
    throw new Error(
      'Mật khẩu mới phải có ít nhất 8 ký tự!'
    );
  }

  const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const resetToken =
    await authRepository.findPasswordResetToken(tokenHash);

  if (!resetToken) {
    throw new Error(
      'Đường dẫn đặt lại mật khẩu không hợp lệ!'
    );
  }

  if (resetToken.usedAt) {
    throw new Error(
      'Link đặt lại mật khẩu đã được sử dụng!'
    );
  }

  if (resetToken.expiresAt < new Date()) {
    throw new Error(
      'Link đặt lại mật khẩu đã hết hạn!'
    );
  }

  const hashedPassword =
    await bcrypt.hash(newPassword, 10);

  await authRepository.resetPasswordTransaction(
    resetToken.userId,
    resetToken.id,
    hashedPassword
  );

  return {
    message:
      'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.'
  };
},

  // 5. Cấp lại Access Token từ Refresh Token
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

changePassword: async (userId, oldPassword, newPassword) => {
  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw new Error('Người dùng không tồn tại!');
  }

  const isMatch = await bcrypt.compare(
    oldPassword,
    user.passwordHash
  );

  if (!isMatch) {
    throw new Error('Mật khẩu hiện tại không chính xác!');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await authRepository.updatePassword(
    userId,
    hashedPassword
  );

  await authRepository.revokeAllRefreshTokens(userId);

  await auditLogService.createAuditLog({
    userId,
    action: 'CHANGE_PASSWORD',
    entityName: 'User',
    entityId: userId
  });

try {
  await notificationService.createNotification({
    userId,
    title: NOTIFICATION_CONSTANTS.ACCOUNT.PASSWORD_CHANGED_TITLE,
    content:
      NOTIFICATION_CONSTANTS.ACCOUNT.PASSWORD_CHANGED_CONTENT,
    type: NOTIFICATION_CONSTANTS.TYPE.PASSWORD_CHANGED,
    data: {
      type: NOTIFICATION_CONSTANTS.TYPE.PASSWORD_CHANGED
    }
  });
} catch (error) {
  console.error(
    '[NOTIFICATION] Password changed notification failed:',
    error.message
  );
}

  return {
    message: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.'
  };
},
};

module.exports = authService;