const storeSettingRepository = require('./storeSetting.repository');

const storeSettingService = {
  getStoreSetting: async () => {
    let setting = await storeSettingRepository.findFirst();

    if (!setting) {
      setting = await storeSettingRepository.create({
        storeName: 'FashionHub'
      });
    }

    return setting;
  },

  updateStoreSetting: async (data, file) => {
    let setting = await storeSettingRepository.findFirst();

    if (!setting) {
      setting = await storeSettingRepository.create({
        storeName: data.storeName || 'FashionHub'
      });
    }

    const updateData = {
      storeName: data.storeName,
      hotline: data.hotline,
      zalo: data.zalo,
      email: data.email,
      address: data.address,
      openingHours: data.openingHours,
      description: data.description
    };

    if (file) {
      updateData.logoUrl = file.path;
    }

    return await storeSettingRepository.update(setting.id, updateData);
  }
};

module.exports = storeSettingService;