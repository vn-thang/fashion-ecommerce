const userRepository = require('./user.repository');
const { MESSAGES } = require('./user.constants');
const {
  getPagination,
  getPaginationMetadata
} = require('../../utils/pagination');

const userService = {

  getProfile: async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user) throw new Error(MESSAGES.USER_NOT_FOUND);
    return user;
  },

  updateProfile: async (userId, updateData) => {
    const user = await userRepository.getUserById(userId);
    if (!user) throw new Error(MESSAGES.USER_NOT_FOUND);

    const dataToUpdate = {
      fullName: updateData.fullName ?? user.fullName,
      phoneNumber: updateData.phoneNumber ?? user.phoneNumber,
      avatarUrl: updateData.avatarUrl ?? user.avatarUrl
    };

    return await userRepository.updateUser(userId, dataToUpdate);
  },

  getAddresses: async (userId) => {
    return await userRepository.getAddressesByUserId(userId);
  },

  addAddress: async (userId, addressData) => {
    const addressCount = await userRepository.countAddressesByUserId(userId);
    
    let isDefault = addressData.isDefault === true || addressData.isDefault === 'true';
    if (addressCount === 0) {
      isDefault = true; 
    }

    if (isDefault) {
      await userRepository.clearDefaultAddresses(userId);
    }

    return await userRepository.createAddress(userId, {
      ...addressData,
      isDefault
    });
  },

  updateAddress: async (userId, addressId, addressData) => {
    const existingAddress = await userRepository.getAddressById(addressId);
    if (!existingAddress || existingAddress.userId !== userId) {
      throw new Error(MESSAGES.ADDRESS_NOT_FOUND);
    }

    let isDefault = addressData.isDefault === true || addressData.isDefault === 'true';
    
    if (isDefault && !existingAddress.isDefault) {
      await userRepository.clearDefaultAddresses(userId);
    } 
    else if (existingAddress.isDefault) {
      isDefault = true;
    }

    return await userRepository.updateAddress(addressId, {
      ...addressData,
      isDefault
    });
  },

  deleteAddress: async (userId, addressId) => {
    const existingAddress = await userRepository.getAddressById(addressId);
    if (!existingAddress || existingAddress.userId !== userId) {
      throw new Error(MESSAGES.ADDRESS_NOT_FOUND);
    }

    await userRepository.deleteAddress(addressId);

    if (existingAddress.isDefault) {
      const remainingAddresses = await userRepository.getAddressesByUserId(userId);
      if (remainingAddresses.length > 0) {
        await userRepository.setDefaultAddress(remainingAddresses[0].id);
      }
    }

    return { success: true };
  },

  setAddressDefault: async (userId, addressId) => {
    const existingAddress = await userRepository.getAddressById(addressId);
    if (!existingAddress || existingAddress.userId !== userId) {
      throw new Error(MESSAGES.ADDRESS_NOT_FOUND);
    }

    await userRepository.clearDefaultAddresses(userId);
    return await userRepository.setDefaultAddress(addressId);
  },

getAllUsers: async query => {
  const { page, limit, skip } = getPagination(
    query.page,
    query.limit
  );

  const where = {};

  if (query.keyword?.trim()) {
    where.OR = [
      {
        fullName: {
          contains: query.keyword.trim(),
          mode: 'insensitive'
        }
      },
      {
        email: {
          contains: query.keyword.trim(),
          mode: 'insensitive'
        }
      },
      {
        phoneNumber: {
          contains: query.keyword.trim(),
          mode: 'insensitive'
        }
      }
    ];
  }

  if (query.role) {
    where.role = query.role;
  }

  if (query.isActive !== undefined && query.isActive !== '') {
    where.isActive = query.isActive === 'true';
  }

  const { users, totalItems } =
    await userRepository.findUsersPaginated({
      where,
      skip,
      take: limit
    });

  return {
    users,
    pagination: getPaginationMetadata(
      totalItems,
      page,
      limit
    )
  };
},
  getUserDetail: async userId => {
    const user = await userRepository.findUserDetailById(userId);

    if (!user) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    return user;
  },

  updateUserStatus: async (userId, isActive) => {
  const user = await userRepository.getUserById(userId);

  if (!user) {
    throw new Error(MESSAGES.USER_NOT_FOUND);
  }

  return await userRepository.updateUser(userId, {
    isActive
  });
}

};

module.exports = userService;