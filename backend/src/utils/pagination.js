const paginationHelper = {

  getPagination: (rawPage, rawLimit, defaultLimit = 10) => {
    const page = parseInt(rawPage) > 0 ? parseInt(rawPage) : 1;
    const limit = parseInt(rawLimit) > 0 ? parseInt(rawLimit) : defaultLimit;
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  },

  getPaginationMetadata: (totalItems, page, limit) => {
    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      currentPage: page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }
};

module.exports = paginationHelper;