const prisma = require('../../config/database');

const brandRepository = {
  create: async (data) => {
    return await prisma.brand.create({ data });
  },

  findAll: async () => {
    return await prisma.brand.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  findAllPaginated: async ({ search, skip, take }) => {
    const where = search
      ? { name: { contains: search, mode: 'insensitive' } }
      : {};

    const [brands, totalItems] = await prisma.$transaction([
      prisma.brand.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.brand.count({ where })
    ]);

    return { brands, totalItems };
  },

  findAllActivePaginated: async ({ search, skip, take }) => {
  const where = {
    status: 'ACTIVE',
    ...(search ? { name: { contains: search, mode: 'insensitive' } } : {})
  };

  const [brands, totalItems] = await prisma.$transaction([
    prisma.brand.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.brand.count({ where })
  ]);

  return { brands, totalItems };
},

  findStats: async () => {
    const [totalBrands, activeBrands, emptyBrands] = await prisma.$transaction([
      prisma.brand.count(),
      prisma.brand.count({
        where: { status: 'ACTIVE' }
      }),
      prisma.brand.count({
        where: {
          products: {
            none: {}
          }
        }
      })
    ]);

    return {
      totalBrands,
      activeBrands,
      emptyBrands
    };
  },

  findBySlug: async (slug) => {
    return await prisma.brand.findUnique({
      where: { slug }
    });
  },

  findById: async (id) => {
    return await prisma.brand.findUnique({
      where: { id }
    });
  },

  update: async (id, data) => {
    return await prisma.brand.update({
      where: { id },
      data
    });
  },

  deactivate: async (id) => {
    return await prisma.brand.update({
      where: { id },
      data: { status: 'INACTIVE' }
    });
  },

  activate: async (id) => {
    return await prisma.brand.update({
      where: { id },
      data: { status: 'ACTIVE' }
    });
  }
};

module.exports = brandRepository;