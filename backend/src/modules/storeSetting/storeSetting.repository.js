const prisma = require('../../config/database');

const storeSettingRepository = {
  findFirst: async () => {
    return await prisma.storeSetting.findFirst();
  },

  create: async (data) => {
    return await prisma.storeSetting.create({
      data
    });
  },

  update: async (id, data) => {
    return await prisma.storeSetting.update({
      where: {
        id
      },
      data
    });
  }
};

module.exports = storeSettingRepository;