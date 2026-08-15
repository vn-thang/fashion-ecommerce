const categoryRepository = require('./category.repository');
const { MESSAGES } = require('./category.constants');
const slugify = require('slugify');
const paginationHelper = require('../../utils/pagination');
const auditLogService = require('../auditLog/auditLog.service');

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
 createCategory: async (
    { name, parentId, description },
    userId
  ) => {
    const slug = slugify(name, {
      lower: true,
      strict: true
    });

    const existed =
      await categoryRepository.findBySlug(slug);

    if (existed) {
      throw new Error(MESSAGES.SLUG_EXISTED);
    }

    if (parentId) {
      await validateMaxDepth(parentId);
    }

    const category = await categoryRepository.create({
      name,
      slug,
      parentId,
      description,
      status: 'ACTIVE'
    });

    await auditLogService.createAuditLog({
      userId,
      action: 'CREATE',
      entityName: 'Category',
      entityId: category.id,
      newValues: category
    });

    return category;
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
    { name, parentId, description },
    userId
  ) => {
    const oldCategory =
      await categoryRepository.findById(id);

    if (!oldCategory) {
      throw new Error(MESSAGES.CATEGORY_NOT_FOUND);
    }

    const data = {
      description
    };

    if (name) {
      const slug = slugify(name, {
        lower: true,
        strict: true
      });

      const existed =
        await categoryRepository.findBySlug(slug);

      if (existed && existed.id !== id) {
        throw new Error(MESSAGES.SLUG_EXISTED);
      }

      data.name = name;
      data.slug = slug;
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

    const updatedCategory =
      await categoryRepository.update(id, data);

    await auditLogService.createAuditLog({
      userId,
      action: 'UPDATE',
      entityName: 'Category',
      entityId: id,
      oldValues: oldCategory,
      newValues: updatedCategory
    });

    return updatedCategory;
  },

 deactivateCategory: async (id, userId) => {
    const category =
      await categoryRepository.findById(id);

    if (!category) {
      throw new Error(MESSAGES.CATEGORY_NOT_FOUND);
    }

    const updatedCategory =
      await categoryRepository.deactivate(id);

    await auditLogService.createAuditLog({
      userId,
      action: 'DEACTIVATE',
      entityName: 'Category',
      entityId: id,
      oldValues: category,
      newValues: updatedCategory
    });

    return updatedCategory;
  },

 activateCategory: async (id, userId) => {
    const category =
      await categoryRepository.findById(id);

    if (!category) {
      throw new Error(MESSAGES.CATEGORY_NOT_FOUND);
    }

    if (category.status === 'ACTIVE') {
      return category;
    }

    if (category.parentId) {
      const parent =
        await categoryRepository.findById(
          category.parentId
        );

      if (parent?.status === 'INACTIVE') {
        throw new Error(
          'Không thể kích hoạt danh mục con khi danh mục cha đang bị ẩn!'
        );
      }
    }
     const updatedCategory =
      await categoryRepository.activate(id);

    await auditLogService.createAuditLog({
      userId,
      action: 'ACTIVATE',
      entityName: 'Category',
      entityId: id,
      oldValues: category,
      newValues: updatedCategory
    });

    return updatedCategory;
  },
};

module.exports = categoryService;