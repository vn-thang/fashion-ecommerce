const prisma = require('../../config/database');

const cartRepository = {

  getCartByUserId: async (userId) => {
    return await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
    include: {
        product: {
            select: {
                id: true,
                name: true,
                slug: true,
                thumbnailUrl: true
            }
        },
        flashSaleVariants: {
            where: {
                flashSale: {
                    isActive: true,
                    startDate: { lte: new Date() },
                    endDate: { gte: new Date() }
                }
            },
            take: 1
        }
    }
}
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  },

  createCart: async (userId) => {
    return await prisma.cart.create({
      data: { userId },
      include: { items: true }
    });
  },

getVariantById: async (variantId) => {
  const now = new Date();

  return prisma.productVariant.findUnique({
    where: { id: variantId },
    include: {
      flashSaleVariants: {
        where: {
          flashSale: {
            isActive: true,
            startDate: { lte: now },
            endDate: { gte: now }
          }
        },
        include: {
          flashSale: true
        },
        take: 1
      }
    }
  });
},

  upsertCartItem: async (cartId, productVariantId, quantity) => {
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productVariantId: { cartId, productVariantId }
      }
    });

    if (existingItem) {
      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      return await prisma.cartItem.create({
        data: { cartId, productVariantId, quantity }
      });
    }
  },

  updateCartItemQuantity: async (itemId, quantity) => {
    return await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });
  },

  deleteCartItem: async (itemId) => {
    return await prisma.cartItem.delete({
      where: { id: itemId }
    });
  },

  clearCart: async (cartId) => {
    return await prisma.cartItem.deleteMany({
      where: { cartId }
    });
  }
};

module.exports = cartRepository;