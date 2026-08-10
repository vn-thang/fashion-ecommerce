const prisma = require('../../config/database');

const authRepository = {
  findUserByEmailOrPhone: async (loginKey) => {
    return await prisma.user.findFirst({
      where: {
        OR: [
          { email: loginKey },
          { phoneNumber: loginKey }
        ]
      }
    });
  },

  findUserById: async (id) => {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true
      }
    });
  },

  createUserWithCart: async (userData) => {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: userData
      });

      await tx.cart.create({
        data: {
          userId: user.id
        }
      });

      return user;
    });
  },

  saveRefreshToken: async (userId, token, expiresAt) => {
    return await prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt
      }
    });
  },

  findValidRefreshToken: async (token) => {
    return await prisma.refreshToken.findFirst({
      where: {
        token,
        revokedAt: null
      }
    });
  },

  revokeRefreshToken: async (token) => {
    return await prisma.refreshToken.updateMany({
      where: { token },
      data: {
        revokedAt: new Date()
      }
    });
  },

  revokeAllRefreshTokens: async (userId) => {
    return await prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null
      },
      data: {
        revokedAt: new Date()
      }
    });
  },

  createPasswordResetToken: async ({
    userId,
    tokenHash,
    expiresAt
  }) => {
    return await prisma.passwordResetToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt
      }
    });
  },

  findPasswordResetToken: async (tokenHash) => {
    return await prisma.passwordResetToken.findUnique({
      where: {
        tokenHash
      }
    });
  },

  deletePasswordResetTokensByUser: async (userId) => {
    return await prisma.passwordResetToken.deleteMany({
      where: {
        userId
      }
    });
  },

  resetPasswordTransaction: async (
    userId,
    resetTokenId,
    hashedPassword
  ) => {
    return await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: userId
        },
        data: {
          passwordHash: hashedPassword
        }
      });

      await tx.passwordResetToken.update({
        where: {
          id: resetTokenId
        },
        data: {
          usedAt: new Date()
        }
      });

      await tx.refreshToken.updateMany({
        where: {
          userId,
          revokedAt: null
        },
        data: {
          revokedAt: new Date()
        }
      });

      await tx.passwordResetToken.deleteMany({
        where: {
          userId,
          id: {
            not: resetTokenId
          }
        }
      });
    });
  }
};

module.exports = authRepository;