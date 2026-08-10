const bannerService = require('./banner.service');
const { MESSAGES } = require('./banner.constants');

const bannerController = {
  create: async (req, res) => {
    try {
      const banner = await bannerService.createBanner(req.body, req.file);

      return res.status(201).json({
        success: true,
        message: MESSAGES.CREATED_SUCCESS,
        data: banner
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const banners = await bannerService.getAllBanners();

      return res.json({
        success: true,
        data: banners
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getActive: async (req, res) => {
    try {
      const banners = await bannerService.getActiveBanners();

      return res.json({
        success: true,
        data: banners
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  update: async (req, res) => {
    try {
      const banner = await bannerService.updateBanner(
        req.params.id,
        req.body,
        req.file
      );

      return res.json({
        success: true,
        message: MESSAGES.UPDATED_SUCCESS,
        data: banner
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  delete: async (req, res) => {
    try {
      await bannerService.deleteBanner(req.params.id);

      return res.json({
        success: true,
        message: MESSAGES.DELETED_SUCCESS
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = bannerController;