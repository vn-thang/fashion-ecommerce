const bannerRepository = require('./banner.repository');
const { MESSAGES } = require('./banner.constants');

const bannerService = {
  createBanner: async (data, file) => {
    if (!file) {
      throw new Error(MESSAGES.IMAGE_REQUIRED);
    }

    return await bannerRepository.create({
      title: data.title,
      description: data.description,
      imageUrl: file.path,
      displayOrder: Number(data.displayOrder) || 0,
      isActive:
        data.isActive === undefined
          ? true
          : data.isActive === 'true'
    });
  },

  getAllBanners: async () => {
    return await bannerRepository.findAll();
  },

  getActiveBanners: async () => {
    return await bannerRepository.findActive();
  },

  updateBanner: async (id, data, file) => {
    const banner = await bannerRepository.findById(id);

    if (!banner) {
      throw new Error(MESSAGES.NOT_FOUND);
    }

    const updateData = {
      title: data.title,
      description: data.description,
      displayOrder:
        data.displayOrder !== undefined
          ? Number(data.displayOrder)
          : banner.displayOrder,
      isActive:
        data.isActive !== undefined
          ? data.isActive === 'true'
          : banner.isActive
    };

    if (file) {
      updateData.imageUrl = file.path;
    }

    return await bannerRepository.update(id, updateData);
  },

  deleteBanner: async (id) => {
    const banner = await bannerRepository.findById(id);

    if (!banner) {
      throw new Error(MESSAGES.NOT_FOUND);
    }

    return await bannerRepository.delete(id);
  }
};

module.exports = bannerService;