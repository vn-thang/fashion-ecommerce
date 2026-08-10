const brandRepository = require('./brand.repository');
const { MESSAGES } = require('./brand.constants');
const slugify = require('slugify');
const { getPagination, getPaginationMetadata } = require('../../utils/pagination');

const DEFAULT_LIMIT = 10;

const brandService = {
  createBrand: async ({ name }, file) => {
    const slug = slugify(name, {
      lower: true,
      strict: true
    });

    const existing = await brandRepository.findBySlug(slug);

    if (existing) {
      throw new Error(MESSAGES.SLUG_EXISTED);
    }

    return brandRepository.create({
      name,
      slug,
      logoUrl: file.path,
      status: 'ACTIVE'
    });
  },

  getAllBrands: async (queryParams = {}) => {
    const { search, page: rawPage, limit: rawLimit } = queryParams;

    const { page, limit, skip } = getPagination(
      rawPage,
      rawLimit,
      DEFAULT_LIMIT
    );

    const [{ brands, totalItems }, stats] = await Promise.all([
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
      pagination: getPaginationMetadata(totalItems, page, limit)
    };
  },

  getAllActiveBrands: async (queryParams = {}) => {
  const { search, page: rawPage, limit: rawLimit } = queryParams;
  const { page, limit, skip } = getPagination(rawPage, rawLimit, DEFAULT_LIMIT);

  const { brands, totalItems } = await brandRepository.findAllActivePaginated({
    search,
    skip,
    take: limit
  });

  return {
    brands,
    pagination: getPaginationMetadata(totalItems, page, limit)
  };
},

  updateBrand: async (id, { name }, file) => {
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

    return brandRepository.update(id, data);
  },

  deactivateBrand: async (id) => {
    const brand = await brandRepository.findById(id);

    if (!brand) {
      throw new Error(MESSAGES.NOT_FOUND);
    }

    if (brand.status === 'INACTIVE') {
      throw new Error(MESSAGES.ALREADY_INACTIVE);
    }

    return brandRepository.deactivate(id);
  },

  activateBrand: async (id) => {
    const brand = await brandRepository.findById(id);

    if (!brand) {
      throw new Error(MESSAGES.NOT_FOUND);
    }

    if (brand.status === 'ACTIVE') {
      throw new Error(MESSAGES.ALREADY_ACTIVE);
    }

    return brandRepository.activate(id);
  }
};

module.exports = brandService;