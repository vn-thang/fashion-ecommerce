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
        isActive: true,
        passwordHash: true
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

   createEmailVerificationToken: async ({
    userId,
    tokenHash,
    expiresAt
  }) => {
    return await prisma.emailVerificationToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt
      }
    });
  },

  findEmailVerificationToken: async tokenHash => {
    return await prisma.emailVerificationToken.findUnique({
      where: {
        tokenHash
      },
      include: {
        user: true
      }
    });
  },

  deleteEmailVerificationToken: async tokenHash => {
    return await prisma.emailVerificationToken.delete({
      where: {
        tokenHash
      }
    });
  },

  deleteEmailVerificationTokensByUserId: async userId => {
    return await prisma.emailVerificationToken.deleteMany({
      where: {
        userId
      }
    });
  },

  verifyEmailTransaction: async userId => {
    return await prisma.$transaction(async tx => {
      const user = await tx.user.update({
        where: {
          id: userId
        },
        data: {
          emailVerified: true
        }
      });

      await tx.emailVerificationToken.deleteMany({
        where: {
          userId
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

  resetPasswordTransaction: async (
  userId,
  hashedPassword
) => {
  return await prisma.$transaction(async tx => {
    await tx.user.update({
      where: {
        id: userId
      },
      data: {
        passwordHash: hashedPassword
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
  });
},
};

module.exports = authRepository;