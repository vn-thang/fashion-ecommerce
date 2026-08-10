const prisma = require('../../config/database');

const flashSaleRepository = {
  create: async (data) => {
    return await prisma.flashSale.create({ data });
  },

  findAllPaginated: async ({ search, skip, take }) => {
    const where = search
      ? { name: { contains: search, mode: 'insensitive' } }
      : {};

    const [flashSales, totalItems] = await prisma.$transaction([
      prisma.flashSale.findMany({
        where,
        skip,
        take,
        include: {
          _count: {
            select: { flashSaleVariants: true }
          }
        },
        orderBy: { startDate: 'desc' }
      }),
      prisma.flashSale.count({ where })
    ]);

    return { flashSales, totalItems };
  },

findById: async (id) => {
  return prisma.flashSale.findUnique({
    where: { id },
    include: {
      flashSaleVariants: {
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          variant: {
            include: {
              product: {
                include: {
                  brand: true,
                  category: true,
                  images: {
                    orderBy: {
                      displayOrder: 'asc'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
},

  findBasicById: async (id) => {
    return await prisma.flashSale.findUnique({
      where: { id }
    });
  },

  update: async (id, data) => {
    return await prisma.flashSale.update({
      where: { id },
      data
    });
  },

  disable: async (id) => {
    return await prisma.flashSale.update({
      where: { id },
      data: { isActive: false }
    });
  },

  exists: async (id) => {
    return (await prisma.flashSale.count({ where: { id } })) > 0;
  },

  findByName: async (name, excludeId = null) => {
    return await prisma.flashSale.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        },
        ...(excludeId && {
          NOT: { id: excludeId }
        })
      }
    });
  },

  findOverlap: async (startDate, endDate, excludeId = null) => {
    return await prisma.flashSale.findFirst({
      where: {
        isActive: true,
        ...(excludeId && {
          NOT: { id: excludeId }
        }),
        AND: [
          {
            startDate: {
              lte: new Date(endDate)
            }
          },
          {
            endDate: {
              gte: new Date(startDate)
            }
          }
        ]
      }
    });
  },

  findActiveFlashSale: async () => {
    const now = new Date();

    return await prisma.flashSale.findFirst({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now }
      },
      include: {
     flashSaleVariants: {
    include: {
        variant: {
            include: {
                product: {
                    include: {
                        brand: true,
                        category: true,
                    }
                }
            }
        }
    }
}
      }
    });
  },

  changeStatus: async (id, isActive) => {
    return await prisma.flashSale.update({
      where: { id },
      data: { isActive }
    });
  },

  count: async () => {
    return await prisma.flashSale.count();
  }, 

  existsAndActive: async(id)=>{
    return prisma.flashSale.findFirst({
        where:{
            id,
            isActive:true
        }
    });
}
};

module.exports = flashSaleRepository;