const prisma = require('../../config/database');

const categoryRepository = {
  create: async data => {
    return await prisma.category.create({ data });
  },

  findAll: async () => {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  },

  findAllPaginated: async ({ search, skip, take }) => {
    if (search) {
      const categories = await prisma.category.findMany({
        where: {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        orderBy: { name: 'asc' }
      });

      return {
        categories,
        totalItems: categories.length,
        totalCategories: await prisma.category.count()
      };
    }

    const [roots, totalItems, totalCategories] =
      await prisma.$transaction([
        prisma.category.findMany({
          where: {
            parentId: null
          },
          skip,
          take,
          orderBy: {
            name: 'asc'
          },
          include: {
            children: {
              include: {
                children: {
                  include: {
                    children: true
                  }
                }
              }
            }
          }
        }),

        prisma.category.count({
          where: {
            parentId: null
          }
        }),

        prisma.category.count()
      ]);

    const flat = [];

    const flatten = category => {
      flat.push({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        parentId: category.parentId,
        status: category.status
      });

      if (category.children?.length) {
        category.children.forEach(flatten);
      }
    };

    roots.forEach(flatten);

    return {
      categories: flat,
      totalItems,
      totalCategories
    };
  },

findAllActive: async () => {
  const categories = await prisma.category.findMany({
    where: {
      status: 'ACTIVE'
    },
    orderBy: {
      name: 'asc'
    }
  });

  const map = new Map();
  const roots = [];

  categories.forEach(category => {
    map.set(category.id, {
      ...category,
      children: []
    });
  });

  categories.forEach(category => {
    const current = map.get(category.id);

    if (category.parentId) {
      const parent = map.get(category.parentId);

      if (parent) {
        parent.children.push(current);
      }
    } else {
      roots.push(current);
    }
  });

  return roots;
},

  findById: async id => {
    return await prisma.category.findUnique({
      where: { id }
    });
  },

  findBySlug: async slug => {
    return await prisma.category.findUnique({
      where: { slug }
    });
  },

  update: async (id, data) => {
    return await prisma.category.update({
      where: { id },
      data
    });
  },

  deactivate: async id => {
    return await prisma.$transaction(async tx => {
      const ids = [id];
      let parentIds = [id];

      while (parentIds.length) {
        const children = await tx.category.findMany({
          where: {
            parentId: {
              in: parentIds
            }
          },
          select: {
            id: true
          }
        });

        const childIds = children.map(child => child.id);

        if (!childIds.length) {
          break;
        }

        ids.push(...childIds);
        parentIds = childIds;
      }

      await tx.category.updateMany({
        where: {
          id: {
            in: ids
          }
        },
        data: {
          status: 'INACTIVE'
        }
      });

      return tx.category.findUnique({
        where: { id }
      });
    });
  },

activate: async id => {
  return await prisma.category.update({
    where: { id },
    data: {
      status: 'ACTIVE'
    }
  });
}
};

module.exports = categoryRepository;