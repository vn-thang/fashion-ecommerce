const brandRepository = require('./brand.repository');
const { MESSAGES } = require('./brand.constants');
const slugify = require('slugify');
const {
  getPagination,
  getPaginationMetadata
} = require('../../utils/pagination');

const { createAuditLog } = require('../auditLog/auditLog.service');

const DEFAULT_LIMIT = 10;

const brandService = {
  createBrand: async ({ name }, file, userId) => {
    const slug = slugify(name, {
      lower: true,
      strict: true
    });

    const existing = await brandRepository.findBySlug(slug);

    if (existing) {
      throw new Error(MESSAGES.SLUG_EXISTED);
    }

    const brand = await brandRepository.create({
      name,
      slug,
      logoUrl: file.path,
      status: 'ACTIVE'
    });

    await createAuditLog({
      userId,
      action: 'CREATE',
      entityName: 'Brand',
      entityId: brand.id,
      newValues: {
        name: brand.name,
        slug: brand.slug,
        logoUrl: brand.logoUrl,
        status: brand.status
      }
    });

    return brand;
  },

  getAllBrands: async (queryParams = {}) => {
    const {
      search,
      page: rawPage,
      limit: rawLimit
    } = queryParams;

    const { page, limit, skip } = getPagination(
      rawPage,
      rawLimit,
      DEFAULT_LIMIT
    );

    const [{ brands, totalItems }, stats] =
      await Promise.all([
        brandRepository.findAllPaginated({
          search,
          skip,
          take: limit
        }),
        brandRepository.findStats()
      ]);

    return {
      brands,
      stats,
      pagination: getPaginationMetadata(
        totalItems,
        page,
        limit
      )
    };
  },

  getAllActiveBrands: async (queryParams = {}) => {
    const {
      search,
      page: rawPage,
      limit: rawLimit
    } = queryParams;

    const { page, limit, skip } = getPagination(
      rawPage,
      rawLimit,
      DEFAULT_LIMIT
    );

    const { brands, totalItems } =
      await brandRepository.findAllActivePaginated({
        search,
        skip,
        take: limit
      });

    return {
      brands,
      pagination: getPaginationMetadata(
        totalItems,
        page,
        limit
      )
    };
  },

  updateBrand: async (id, { name }, file, userId) => {
    const brand = await brandRepository.findById(id);

    if (!brand) {
      throw new Error(MESSAGES.NOT_FOUND);
    }

    const data = {};

    if (name) {
      const slug = slugify(name, {
        lower: true,
        strict: true
      });

      const existing = await brandRepository.findBySlug(slug);

      if (existing && existing.id !== id) {
        throw new Error(MESSAGES.SLUG_EXISTED);
      }

      data.name = name;
      data.slug = slug;
    }

    if (file) {
      data.logoUrl = file.path;
    }

    const updatedBrand = await brandRepository.update(
      id,
      data
    );

    await createAuditLog({
      userId,
      action: 'UPDATE',
      entityName: 'Brand',
      entityId: id,
      oldValues: {
        name: brand.name,
        slug: brand.slug,
        logoUrl: brand.logoUrl,
        status: brand.status
      },
      newValues: {
        name: updatedBrand.name,
        slug: updatedBrand.slug,
        logoUrl: updatedBrand.logoUrl,
        status: updatedBrand.status
      }
    });

    return updatedBrand;
  },

  deactivateBrand: async (id, userId) => {
    const brand = await brandRepository.findById(id);

    if (!brand) {
      throw new Error(MESSAGES.NOT_FOUND);
    }

    if (brand.status === 'INACTIVE') {
      throw new Error(MESSAGES.ALREADY_INACTIVE);
    }

    const updatedBrand =
      await brandRepository.deactivate(id);

    await createAuditLog({
      userId,
      action: 'DEACTIVATE',
      entityName: 'Brand',
      entityId: id,
      oldValues: {
        status: brand.status
      },
      newValues: {
        status: updatedBrand.status
      }
    });

    return updatedBrand;
  },

  activateBrand: async (id, userId) => {
    const brand = await brandRepository.findById(id);

    if (!brand) {
      throw new Error(MESSAGES.NOT_FOUND);
    }

    if (brand.status === 'ACTIVE') {
      throw new Error(MESSAGES.ALREADY_ACTIVE);
    }

    const updatedBrand =
      await brandRepository.activate(id);

    await createAuditLog({
      userId,
      action: 'ACTIVATE',
      entityName: 'Brand',
      entityId: id,
      oldValues: {
        status: brand.status
      },
      newValues: {
        status: updatedBrand.status
      }
    });

    return updatedBrand;
  }
};

module.exports = brandService;