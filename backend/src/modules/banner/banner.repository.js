const prisma = require('../../config/database');

const bannerRepository = {
  create: async (data) => {
    return await prisma.banner.create({
      data
    });
  },

  findAll: async () => {
    return await prisma.banner.findMany({
      orderBy: [
        {
          displayOrder: 'asc'
        },
        {
          createdAt: 'desc'
        }
      ]
    });
  },

  findActive: async () => {
    return await prisma.banner.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        {
          displayOrder: 'asc'
        },
        {
          createdAt: 'desc'
        }
      ]
    });
  },

  findById: async (id) => {
    return await prisma.banner.findUnique({
      where: {
        id
      }
    });
  },

  update: async (id, data) => {
    return await prisma.banner.update({
      where: {
        id
      },
      data
    });
  },

  delete: async (id) => {
    return await prisma.banner.delete({
      where: {
        id
      }
    });
  }
};

module.exports = bannerRepository;