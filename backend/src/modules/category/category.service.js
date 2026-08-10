const categoryRepository = require('./category.repository');
const { MESSAGES } = require('./category.constants');
const slugify = require('slugify');
const paginationHelper = require('../../utils/pagination');

const validateMaxDepth = async parentId => {
  if (!parentId) return;

  let level = 0;
  let currentId = parentId;

  while (currentId) {
    const category = await categoryRepository.findById(currentId);

    if (!category) {
      throw new Error('Danh mục cha không tồn tại trong hệ thống.');
    }

    if (!category.parentId) break;

    level++;
    currentId = category.parentId;

    if (level >= 3) {
      throw new Error(
        'Hệ thống chỉ cho phép tạo tối đa 3 cấp danh mục.'
      );
    }
  }
};

const categoryService = {
  createCategory: async ({
    name,
    parentId,
    description
  }) => {
    const slug = slugify(name, {
      lower: true,
      strict: true
    });

    const existed = await categoryRepository.findBySlug(slug);

    if (existed) {
      throw new Error(MESSAGES.SLUG_EXISTED);
    }

    if (parentId) {
      await validateMaxDepth(parentId);
    }

    return categoryRepository.create({
      name,
      slug,
      parentId,
      description,
      status: 'ACTIVE'
    });
  },

  getAllCategories: async query => {
    const {
      search,
      page: rawPage,
      limit: rawLimit
    } = query;

    const { page, limit, skip } =
      paginationHelper.getPagination(
        rawPage,
        rawLimit
      );

    const {
      categories,
      totalItems,
      totalCategories
    } = await categoryRepository.findAllPaginated({
      search,
      skip,
      take: limit
    });

    return {
      categories,
      pagination: {
        ...paginationHelper.getPaginationMetadata(
          totalItems,
          page,
          limit
        ),
        totalCategories
      }
    };
  },

  getAllActiveCategories: async () => {
  return categoryRepository.findAllActive();
},

  updateCategory: async (
    id,
    { name, parentId, description }
  ) => {
    const data = {
      description
    };

    if (name) {
      data.name = name;
      data.slug = slugify(name, {
        lower: true,
        strict: true
      });
    }

    if (parentId !== undefined) {
      if (id === parentId) {
        throw new Error(
          'Không thể tự chọn chính danh mục này làm cha của nó.'
        );
      }

      if (parentId !== null) {
        await validateMaxDepth(parentId);
      }

      data.parentId = parentId;
    }

    return categoryRepository.update(id, data);
  },

  deactivateCategory: async id => {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new Error(MESSAGES.CATEGORY_NOT_FOUND);
    }

    return categoryRepository.deactivate(id);
  },

activateCategory: async id => {
  const category = await categoryRepository.findById(id);

  if (!category) {
    throw new Error(MESSAGES.CATEGORY_NOT_FOUND);
  }

  if (category.status === 'ACTIVE') {
    return category;
  }

  if (category.parentId) {
    const parent = await categoryRepository.findById(
      category.parentId
    );

    if (parent?.status === 'INACTIVE') {
      throw new Error(
        'Không thể kích hoạt danh mục con khi danh mục cha đang bị ẩn!'
      );
    }
  }

  return categoryRepository.activate(id);
}
};

module.exports = categoryService;