const cartRepository = require('./cart.repository');
const { MESSAGES } = require('./cart.constants');

const cartService = {

getCart: async (userId) => {
  let cart = await cartRepository.getCartByUserId(userId);

  if (!cart) {
    cart = await cartRepository.createCart(userId);
  }

  let totalItems = 0;
  let totalPrice = 0;

  const formattedItems = cart.items.map(item => {
    totalItems += item.quantity;

    const flashSale = item.variant.flashSaleVariants?.[0];

    const originalPrice = Number(item.variant.price) || 0;
    const flashSalePrice = flashSale
      ? Number(flashSale.flashSalePrice)
      : null;

    const itemPrice = flashSalePrice ?? originalPrice;

    const itemTotal = itemPrice * item.quantity;
    totalPrice += itemTotal;

    return {
      id: item.id,
      quantity: item.quantity,
      variantId: item.variant.id,
      sku: item.variant.sku,
      color: item.variant.color,
      size: item.variant.size,
      price: itemPrice,
      originalPrice,
      flashSalePrice,
      isFlashSale: !!flashSale,

      stockQuantity: item.variant.stockQuantity,
      product: item.variant.product,

      itemTotal
    };
  });

  return {
    cartId: cart.id,
    totalItems,
    totalPrice,
    items: formattedItems
  };
},

addToCart: async (userId, { productVariantId, quantity }) => {
    const variant = await cartRepository.getVariantById(productVariantId);
    if (!variant || variant.status !== 'ACTIVE') {
      throw new Error(MESSAGES.VARIANT_NOT_FOUND);
    }

    let cart = await cartRepository.getCartByUserId(userId);
    if (!cart) cart = await cartRepository.createCart(userId);

    const existingItem = cart.items?.find(item => item.variant.id === productVariantId);
    
    const totalRequestedQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    if (totalRequestedQuantity > variant.stockQuantity) {
      throw new Error(`Kho chỉ còn ${variant.stockQuantity} sản phẩm. Không đủ số lượng bạn yêu cầu!`);
    }

    await cartRepository.upsertCartItem(cart.id, productVariantId, quantity);

    return await cartService.getCart(userId);
  },

  updateItemQuantity: async (userId, itemId, quantity) => {
    const cart = await cartRepository.getCartByUserId(userId);
    if (!cart) throw new Error(MESSAGES.CART_NOT_FOUND);

    const item = cart.items.find(i => i.id === itemId);
    if (!item) throw new Error(MESSAGES.ITEM_NOT_FOUND);

    if (quantity > item.variant.stockQuantity) {
      throw new Error(`Kho chỉ còn ${item.variant.stockQuantity} sản phẩm.`);
    }

    await cartRepository.updateCartItemQuantity(itemId, quantity);
    return await cartService.getCart(userId);
  },

  removeItem: async (userId, itemId) => {
    const cart = await cartRepository.getCartByUserId(userId);
    if (!cart) throw new Error(MESSAGES.CART_NOT_FOUND);

    const itemExists = cart.items.some(i => i.id === itemId);
    if (!itemExists) throw new Error(MESSAGES.ITEM_NOT_FOUND);

    await cartRepository.deleteCartItem(itemId);
    return await cartService.getCart(userId);
  },

  clearCart: async (userId) => {
    const cart = await cartRepository.getCartByUserId(userId);
    if (cart) {
      await cartRepository.clearCart(cart.id);
    }
    return { success: true };
  }
};

module.exports = cartService;