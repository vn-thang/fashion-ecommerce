const prisma = require('../../config/database');

const userRepository = {

  getUserById: async id => {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        avatarUrl: true,
        totalPoints: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });
  },

  updateUser: async (id, data) => {
    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        avatarUrl: true
      }
    });
  },

  getAddressesByUserId: async userId => {
    return await prisma.userAddress.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  },

  getAddressById: async addressId => {
    return await prisma.userAddress.findUnique({
      where: { id: addressId }
    });
  },

  countAddressesByUserId: async userId => {
    return await prisma.userAddress.count({
      where: { userId }
    });
  },

  createAddress: async (userId, data) => {
    return await prisma.userAddress.create({
      data: {
        userId,
        ...data
      }
    });
  },

  updateAddress: async (addressId, data) => {
    return await prisma.userAddress.update({
      where: { id: addressId },
      data
    });
  },

  deleteAddress: async addressId => {
    return await prisma.userAddress.delete({
      where: { id: addressId }
    });
  },

  clearDefaultAddresses: async userId => {
    return await prisma.userAddress.updateMany({
      where: {
        userId,
        isDefault: true
      },
      data: {
        isDefault: false
      }
    });
  },

  setDefaultAddress: async addressId => {
    return await prisma.userAddress.update({
      where: { id: addressId },
      data: {
        isDefault: true
      }
    });
  },

  findUsersPaginated: async ({
    where,
    skip,
    take
  }) => {
    const [users, totalItems] =
      await prisma.$transaction([
        prisma.user.findMany({
          where,
          skip,
          take,
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            avatarUrl: true,
            totalPoints: true,
            role: true,
            isActive: true,
            createdAt: true,
            _count: {
              select: {
                orders: true
              }
            }
          }
        }),

        prisma.user.count({
          where
        })
      ]);

    return {
      users,
      totalItems
    };
  },

  findUserDetailById: async id => {
    return await prisma.user.findUnique({
      where: {
        id
      },
      include: {
        addresses: {
          orderBy: [
            {
              isDefault: 'desc'
            },
            {
              createdAt: 'desc'
            }
          ]
        },

        _count: {
          select: {
            orders: true,
            reviews: true,
            wishlists: true
          }
        }
      }
    });
  }
};

module.exports = userRepository;