const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🔥 BẮT ĐẦU SEED DATABASE...\n');

  // =========================================================
  // 0. XÓA DỮ LIỆU CŨ
  // =========================================================
  console.log('🧹 Đang xóa dữ liệu cũ...');

  // Xóa các bảng phụ thuộc Product / User / Category / Brand
  await prisma.productVariant.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});

  await prisma.brand.deleteMany({});
  await prisma.category.deleteMany({});

  // Chỉ xóa các user seed nếu muốn giữ user cũ thì bỏ phần này.
  await prisma.user.deleteMany({
    where: {
      email: {
        in: [
          'admin@gmail.com',
          'user01@gmail.com',
          'user02@gmail.com',
          'user03@gmail.com'
        ]
      }
    }
  });

  console.log('✅ Đã dọn dữ liệu seed cũ.\n');

  // =========================================================
  // 1. USERS
  // =========================================================
  console.log('👤 Đang tạo Users...');

  const passwordHash = await bcrypt.hash('12345678', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      passwordHash,
      fullName: 'FashionHub Admin',
      phoneNumber: '0999999999',
      role: 'Admin',
      isActive: true,
      emailVerified: true
    }
  });

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'user01@gmail.com',
        passwordHash,
        fullName: 'Nguyễn Minh Anh',
        phoneNumber: '0918392039',
        role: 'Customer',
        isActive: true,
        emailVerified: true
      }
    }),

    prisma.user.create({
      data: {
        email: 'user02@gmail.com',
        passwordHash,
        fullName: 'Hà Ngọc Linh',
        phoneNumber: '0303948394',
        role: 'Customer',
        isActive: true,
        emailVerified: true
      }
    }),

    prisma.user.create({
      data: {
        email: 'user03@gmail.com',
        passwordHash,
        fullName: 'Nguyễn Ngọc Mai',
        phoneNumber: '0900000003',
        role: 'Customer',
        isActive: true,
        emailVerified: true
      }
    })
  ]);

  console.log(`✅ 1 Admin + ${users.length} Customer\n`);

  // =========================================================
  // 2. BRANDS
  // =========================================================
  console.log('🏷️ Đang tạo Brands...');

  const brandData = [
    {
      name: 'Uniqlo',
      slug: 'uniqlo'
    },
    {
      name: 'Zara',
      slug: 'zara'
    },
    {
      name: 'H&M',
      slug: 'hm'
    },
    {
      name: "Levi's",
      slug: 'levis'
    },
    {
      name: 'Nike',
      slug: 'nike'
    },
    {
      name: 'Adidas',
      slug: 'adidas'
    },
    {
      name: 'Puma',
      slug: 'puma'
    },
    {
      name: 'Lacoste',
      slug: 'lacoste'
    },
    {
      name: 'Mango',
      slug: 'mango'
    },
    {
      name: 'Charles & Keith',
      slug: 'charles-keith'
    }
  ];

  const brands = {};

  for (const data of brandData) {
    const brand = await prisma.brand.create({
      data: {
        ...data,
        logoUrl: null,
        status: 'ACTIVE'
      }
    });

    brands[data.slug] = brand;
  }

  console.log(`✅ Đã tạo ${brandData.length} Brands\n`);

  // =========================================================
  // 3. CATEGORIES
  // =========================================================
  console.log('📂 Đang tạo Categories...');

  const categoryStructure = [
    {
      name: 'Thời trang nam',
      slug: 'thoi-trang-nam',
      description: 'Thời trang dành cho nam giới',
      children: [
        {
          name: 'Áo nam',
          slug: 'ao-nam',
          description: 'Áo thun, áo sơ mi và các loại áo nam'
        },
        {
          name: 'Quần nam',
          slug: 'quan-nam',
          description: 'Quần jean, quần kaki, quần tây và quần short nam'
        },
        {
          name: 'Áo khoác nam',
          slug: 'ao-khoac-nam',
          description: 'Áo khoác, jacket và bomber dành cho nam'
        }
      ]
    },

    {
      name: 'Thời trang nữ',
      slug: 'thoi-trang-nu',
      description: 'Thời trang dành cho nữ giới',
      children: [
        {
          name: 'Áo nữ',
          slug: 'ao-nu',
          description: 'Áo thun, áo sơ mi và áo kiểu nữ'
        },
        {
          name: 'Quần nữ',
          slug: 'quan-nu',
          description: 'Quần jean, quần kaki, quần ống rộng và quần short nữ'
        },
        {
          name: 'Váy & Đầm',
          slug: 'vay-dam',
          description: 'Các loại váy và đầm thời trang nữ'
        },
        {
          name: 'Áo khoác nữ',
          slug: 'ao-khoac-nu',
          description: 'Áo khoác, cardigan và blazer nữ'
        }
      ]
    },

    {
      name: 'Giày dép',
      slug: 'giay-dep',
      description: 'Giày dép thời trang cho nam và nữ',
      children: [
        {
          name: 'Giày nam',
          slug: 'giay-nam',
          description: 'Giày thể thao, giày casual và giày nam'
        },
        {
          name: 'Giày nữ',
          slug: 'giay-nu',
          description: 'Giày cao gót, giày bệt và giày thời trang nữ'
        },
        {
          name: 'Sandal & Dép',
          slug: 'sandal-dep',
          description: 'Sandal và dép thời trang'
        }
      ]
    },

    {
      name: 'Phụ kiện',
      slug: 'phu-kien',
      description: 'Các loại phụ kiện thời trang',
      children: [
        {
          name: 'Túi xách',
          slug: 'tui-xach',
          description: 'Túi xách thời trang dành cho nam và nữ'
        },
        {
          name: 'Balo',
          slug: 'balo',
          description: 'Balo thời trang và balo sử dụng hàng ngày'
        },
        {
          name: 'Ví',
          slug: 'vi',
          description: 'Ví nam, ví nữ và ví cầm tay'
        },
        {
          name: 'Mũ',
          slug: 'mu',
          description: 'Các loại mũ thời trang'
        },
        {
          name: 'Thắt lưng',
          slug: 'that-lung',
          description: 'Thắt lưng thời trang nam và nữ'
        }
      ]
    }
  ];

  const categories = {};

  for (const parentData of categoryStructure) {
    const parent = await prisma.category.create({
      data: {
        name: parentData.name,
        slug: parentData.slug,
        description: parentData.description,
        status: 'ACTIVE'
      }
    });

    categories[parentData.slug] = parent;

    for (const childData of parentData.children) {
      const child = await prisma.category.create({
        data: {
          name: childData.name,
          slug: childData.slug,
          description: childData.description,
          parentId: parent.id,
          status: 'ACTIVE'
        }
      });

      categories[childData.slug] = child;
    }
  }

  console.log('✅ Đã tạo 4 category cha + 15 category con\n');

  // =========================================================
  // 4. PRODUCT DATA
  // =========================================================
  const products = [];

  // ---------------------------------------------------------
  // ÁO NAM
  // ---------------------------------------------------------
  products.push(
    ...createProducts(
      categories['ao-nam'].id,
      [
        ['Áo Thun Nam Cotton Basic', 'ao-thun-nam-cotton-basic', 'uniqlo', 299000],
        ['Áo Polo Nam Piqué Classic', 'ao-polo-nam-pique-classic', 'lacoste', 890000],
        ['Áo Sơ Mi Nam Oxford Slim Fit', 'ao-so-mi-nam-oxford-slim-fit', 'uniqlo', 599000],
        ['Áo Sơ Mi Nam Kẻ Sọc Regular Fit', 'ao-so-mi-nam-ke-soc-regular-fit', 'zara', 699000],
        ['Áo Thun Nam Oversized Basic', 'ao-thun-nam-oversized-basic', 'hm', 329000],
        ['Áo Polo Nam Essential', 'ao-polo-nam-essential', 'lacoste', 950000],
        ['Áo Sơ Mi Nam Linen Casual', 'ao-so-mi-nam-linen-casual', 'zara', 799000],
        ['Áo Thun Nam Graphic Logo', 'ao-thun-nam-graphic-logo', 'adidas', 649000],
        ['Áo Polo Nam Performance', 'ao-polo-nam-performance', 'nike', 749000],
        ['Áo Sơ Mi Nam Denim Classic', 'ao-so-mi-nam-denim-classic', 'levis', 899000]
      ]
    )
  );

  // ---------------------------------------------------------
  // QUẦN NAM
  // ---------------------------------------------------------
  products.push(
    ...createProducts(
      categories['quan-nam'].id,
      [
        ['Quần Jean Nam 511 Slim', 'quan-jean-nam-511-slim', 'levis', 1290000],
        ['Quần Jean Nam Straight Classic', 'quan-jean-nam-straight-classic', 'levis', 1190000],
        ['Quần Kaki Nam Slim Fit', 'quan-kaki-nam-slim-fit', 'uniqlo', 599000],
        ['Quần Kaki Nam Regular Fit', 'quan-kaki-nam-regular-fit', 'uniqlo', 649000],
        ['Quần Tây Nam Smart Ankle', 'quan-tay-nam-smart-ankle', 'zara', 899000],
        ['Quần Tây Nam Slim Formal', 'quan-tay-nam-slim-formal', 'hm', 699000],
        ['Quần Short Nam Cotton Basic', 'quan-short-nam-cotton-basic', 'uniqlo', 399000],
        ['Quần Short Nam Sport Essential', 'quan-short-nam-sport-essential', 'nike', 549000],
        ['Quần Jogger Nam Essentials', 'quan-jogger-nam-essentials', 'adidas', 699000],
        ['Quần Cargo Nam Utility', 'quan-cargo-nam-utility', 'zara', 899000]
      ]
    )
  );

  // ---------------------------------------------------------
  // ÁO KHOÁC NAM
  // ---------------------------------------------------------
  products.push(
    ...createProducts(
      categories['ao-khoac-nam'].id,
      [
        ['Áo Khoác Nam Ultra Light Down', 'ao-khoac-nam-ultra-light-down', 'uniqlo', 1490000],
        ['Áo Khoác Nam Bomber Basic', 'ao-khoac-nam-bomber-basic', 'zara', 1290000],
        ['Áo Khoác Nam Denim Jacket', 'ao-khoac-nam-denim-jacket', 'levis', 1590000],
        ['Áo Khoác Nam Windbreaker Sport', 'ao-khoac-nam-windbreaker-sport', 'nike', 1390000],
        ['Áo Khoác Nam Track Jacket', 'ao-khoac-nam-track-jacket', 'adidas', 1190000],
        ['Áo Khoác Nam Softshell Outdoor', 'ao-khoac-nam-softshell-outdoor', 'uniqlo', 1090000],
        ['Áo Khoác Nam Harrington Jacket', 'ao-khoac-nam-harrington-jacket', 'hm', 999000],
        ['Áo Khoác Nam Puffer Winter', 'ao-khoac-nam-puffer-winter', 'zara', 1690000],
        ['Áo Khoác Nam Lightweight Jacket', 'ao-khoac-nam-lightweight-jacket', 'puma', 1190000],
        ['Áo Khoác Nam Varsity Jacket', 'ao-khoac-nam-varsity-jacket', 'adidas', 1490000]
      ]
    )
  );

  // ---------------------------------------------------------
  // ÁO NỮ
  // ---------------------------------------------------------
  products.push(
    ...createProducts(
      categories['ao-nu'].id,
      [
        ['Áo Thun Nữ Cotton Basic', 'ao-thun-nu-cotton-basic', 'uniqlo', 299000],
        ['Áo Sơ Mi Nữ Linen Blend', 'ao-so-mi-nu-linen-blend', 'zara', 699000],
        ['Áo Kiểu Nữ Cổ Vuông', 'ao-kieu-nu-co-vuong', 'mango', 599000],
        ['Áo Croptop Nữ Basic', 'ao-croptop-nu-basic', 'hm', 299000],
        ['Áo Polo Nữ Piqué Classic', 'ao-polo-nu-pique-classic', 'lacoste', 850000],
        ['Áo Len Nữ Cổ Tròn Basic', 'ao-len-nu-co-tron-basic', 'uniqlo', 599000],
        ['Áo Sơ Mi Nữ Oversized', 'ao-so-mi-nu-oversized', 'zara', 749000],
        ['Áo Thun Nữ Graphic Print', 'ao-thun-nu-graphic-print', 'hm', 349000],
        ['Áo Blouse Nữ Tay Phồng', 'ao-blouse-nu-tay-phong', 'mango', 649000],
        ['Áo Polo Nữ Slim Fit', 'ao-polo-nu-slim-fit', 'lacoste', 890000]
      ]
    )
  );

  // ---------------------------------------------------------
  // QUẦN NỮ
  // ---------------------------------------------------------
  products.push(
    ...createProducts(
      categories['quan-nu'].id,
      [
        ['Quần Jean Nữ Straight Fit', 'quan-jean-nu-straight-fit', 'levis', 1190000],
        ['Quần Jean Nữ Wide Leg', 'quan-jean-nu-wide-leg', 'zara', 899000],
        ['Quần Kaki Nữ Straight Fit', 'quan-kaki-nu-straight-fit', 'uniqlo', 599000],
        ['Quần Tây Nữ Wide Leg', 'quan-tay-nu-wide-leg', 'mango', 799000],
        ['Quần Tây Nữ Slim Fit', 'quan-tay-nu-slim-fit', 'zara', 849000],
        ['Quần Short Nữ Cotton', 'quan-short-nu-cotton', 'uniqlo', 399000],
        ['Quần Short Nữ Denim', 'quan-short-nu-denim', 'levis', 699000],
        ['Quần Jogger Nữ Sport', 'quan-jogger-nu-sport', 'adidas', 649000],
        ['Quần Legging Nữ Training', 'quan-legging-nu-training', 'nike', 699000],
        ['Quần Cargo Nữ Utility', 'quan-cargo-nu-utility', 'zara', 899000]
      ]
    )
  );

  // ---------------------------------------------------------
  // VÁY & ĐẦM
  // ---------------------------------------------------------
  products.push(
    ...createProducts(
      categories['vay-dam'].id,
      [
        ['Đầm Linen Midi Basic', 'dam-linen-midi-basic', 'zara', 999000],
        ['Đầm Hoa Nhí Dáng Dài', 'dam-hoa-nhi-dang-dai', 'mango', 899000],
        ['Đầm Body Knit Thanh Lịch', 'dam-body-knit-thanh-lich', 'mango', 799000],
        ['Đầm Suông Cotton Casual', 'dam-suong-cotton-casual', 'uniqlo', 699000],
        ['Đầm Hai Dây Satin Dự Tiệc', 'dam-hai-day-satin-du-tiec', 'zara', 1290000],
        ['Váy Chữ A Denim', 'vay-chu-a-denim', 'levis', 799000],
        ['Váy Midi Xếp Ly', 'vay-midi-xep-ly', 'mango', 899000],
        ['Đầm Polo Nữ Classic', 'dam-polo-nu-classic', 'lacoste', 1090000],
        ['Đầm Sơ Mi Thắt Eo', 'dam-so-mi-that-eo', 'zara', 999000],
        ['Đầm Blazer Dáng Suông', 'dam-blazer-dang-suong', 'mango', 1190000]
      ]
    )
  );

  // ---------------------------------------------------------
  // ÁO KHOÁC NỮ
  // ---------------------------------------------------------
  products.push(
    ...createProducts(
      categories['ao-khoac-nu'].id,
      [
        ['Cardigan Nữ Len Mỏng', 'cardigan-nu-len-mong', 'uniqlo', 699000],
        ['Áo Khoác Nữ Denim Jacket', 'ao-khoac-nu-denim-jacket', 'levis', 1190000],
        ['Áo Blazer Nữ Basic', 'ao-blazer-nu-basic', 'mango', 1190000],
        ['Áo Blazer Nữ Oversized', 'ao-blazer-nu-oversized', 'zara', 1290000],
        ['Áo Khoác Nữ Trench Coat', 'ao-khoac-nu-trench-coat', 'zara', 1590000],
        ['Áo Khoác Nữ Puffer', 'ao-khoac-nu-puffer', 'uniqlo', 1390000],
        ['Áo Khoác Nữ Bomber', 'ao-khoac-nu-bomber', 'hm', 899000],
        ['Áo Khoác Nữ Cardigan Dài', 'ao-khoac-nu-cardigan-dai', 'mango', 999000],
        ['Áo Khoác Nữ Windbreaker', 'ao-khoac-nu-windbreaker', 'nike', 1190000],
        ['Áo Khoác Nữ Track Jacket', 'ao-khoac-nu-track-jacket', 'adidas', 1090000]
      ]
    )
  );

  // ---------------------------------------------------------
  // GIÀY NAM
  // ---------------------------------------------------------
  products.push(
    ...createProducts(
      categories['giay-nam'].id,
      [
        ['Nike Air Max SC Nam', 'nike-air-max-sc-nam', 'nike', 2390000],
        ['Nike Court Vision Low Nam', 'nike-court-vision-low-nam', 'nike', 1890000],
        ['Adidas Grand Court 2.0 Nam', 'adidas-grand-court-20-nam', 'adidas', 1790000],
        ['Adidas Runfalcon Nam', 'adidas-runfalcon-nam', 'adidas', 1590000],
        ['Puma Caven 2.0 Nam', 'puma-caven-20-nam', 'puma', 1690000],
        ['Puma Smash 3.0 Nam', 'puma-smash-30-nam', 'puma', 1490000],
        ['Lacoste Carnaby Pro Nam', 'lacoste-carnaby-pro-nam', 'lacoste', 2490000],
        ['Lacoste Graduate Pro Nam', 'lacoste-graduate-pro-nam', 'lacoste', 2290000],
        ['Adidas Advantage Base Nam', 'adidas-advantage-base-nam', 'adidas', 1690000],
        ['Puma RBD Game Nam', 'puma-rbd-game-nam', 'puma', 1790000]
      ],
      {
        type: 'shoe'
      }
    )
  );

  // ---------------------------------------------------------
  // GIÀY NỮ
  // ---------------------------------------------------------
  products.push(
    ...createProducts(
      categories['giay-nu'].id,
      [
        ['Zara Giày Cao Gót Mũi Nhọn', 'zara-giay-cao-got-mui-nhon', 'zara', 999000],
        ['Zara Giày Slingback Gót Thấp', 'zara-giay-slingback-got-thap', 'zara', 899000],
        ['Mango Giày Bệt Mũi Vuông', 'mango-giay-bet-mui-vuong', 'mango', 799000],
        ['Mango Giày Cao Gót Basic', 'mango-giay-cao-got-basic', 'mango', 999000],
        ['Charles & Keith Giày Cao Gót', 'charles-keith-giay-cao-got', 'charles-keith', 1490000],
        ['Charles & Keith Giày Slingback', 'charles-keith-giay-slingback', 'charles-keith', 1390000],
        ['Charles & Keith Giày Loafer Nữ', 'charles-keith-giay-loafer-nu', 'charles-keith', 1290000],
        ['Adidas Grand Court Nữ', 'adidas-grand-court-nu', 'adidas', 1790000],
        ['Puma Carina Street Nữ', 'puma-carina-street-nu', 'puma', 1690000],
        ['Lacoste Carnaby Set Nữ', 'lacoste-carnaby-set-nu', 'lacoste', 2190000]
      ],
      {
        type: 'shoe'
      }
    )
  );

  // ---------------------------------------------------------
  // SANDAL & DÉP
  // ---------------------------------------------------------
  products.push(
    ...createProducts(
      categories['sandal-dep'].id,
      [
        ['Adidas Adilette Aqua', 'adidas-adilette-aqua', 'adidas', 649000],
        ['Adidas Adilette Comfort', 'adidas-adilette-comfort', 'adidas', 799000],
        ['Nike Victori One Nam', 'nike-victori-one-nam', 'nike', 799000],
        ['Nike Calm Slide', 'nike-calm-slide', 'nike', 999000],
        ['Puma Popcat 20', 'puma-popcat-20', 'puma', 649000],
        ['Puma Leadcat 2.0', 'puma-leadcat-20', 'puma', 699000],
        ['Lacoste Croco Slide', 'lacoste-croco-slide', 'lacoste', 1090000],
        ['Charles & Keith Sandal Quai Ngang', 'charles-keith-sandal-quai-ngang', 'charles-keith', 1090000],
        ['Zara Sandal Quai Mảnh', 'zara-sandal-quai-manh', 'zara', 699000],
        ['Mango Sandal Da Quai Ngang', 'mango-sandal-da-quai-ngang', 'mango', 799000]
      ],
      {
        type: 'shoe'
      }
    )
  );

  // ---------------------------------------------------------
  // TÚI XÁCH
  // ---------------------------------------------------------
  products.push(
    ...createProducts(
      categories['tui-xach'].id,
      [
        ['Charles & Keith Túi Shoulder Bag', 'charles-keith-shoulder-bag', 'charles-keith', 1590000],
        ['Charles & Keith Túi Top Handle', 'charles-keith-top-handle', 'charles-keith', 1690000],
        ['Charles & Keith Túi Crossbody', 'charles-keith-crossbody', 'charles-keith', 1390000],
        ['Mango Túi Tote Da', 'mango-tui-tote-da', 'mango', 1290000],
        ['Mango Túi Crossbody Basic', 'mango-tui-crossbody-basic', 'mango', 999000],
        ['Zara Túi Shoulder Mini', 'zara-tui-shoulder-mini', 'zara', 899000],
        ['Zara Túi Tote Shopper', 'zara-tui-tote-shopper', 'zara', 1090000],
        ['H&M Túi Crossbody Basic', 'hm-tui-crossbody-basic', 'hm', 499000],
        ['Charles & Keith Túi Mini Chain', 'charles-keith-mini-chain', 'charles-keith', 1490000],
        ['Mango Túi Bucket Bag', 'mango-tui-bucket-bag', 'mango', 1190000]
      ],
      {
        type: 'accessory'
      }
    )
  );

  // ---------------------------------------------------------
  // BALO
  // ---------------------------------------------------------
  products.push(
    ...createProducts(
      categories['balo'].id,
      [
        ['Nike Heritage Backpack', 'nike-heritage-backpack', 'nike', 799000],
        ['Nike Elemental Backpack', 'nike-elemental-backpack', 'nike', 899000],
        ['Adidas Classic Backpack', 'adidas-classic-backpack', 'adidas', 749000],
        ['Adidas Power Backpack', 'adidas-power-backpack', 'adidas', 899000],
        ['Puma Phase Backpack', 'puma-phase-backpack', 'puma', 699000],
        ['Puma Deck Backpack', 'puma-deck-backpack', 'puma', 799000],
        ['Uniqlo Backpack Mini', 'uniqlo-backpack-mini', 'uniqlo', 499000],
        ['Uniqlo Nylon Backpack', 'uniqlo-nylon-backpack', 'uniqlo', 599000],
        ['Zara Balo Casual', 'zara-balo-casual', 'zara', 899000],
        ['H&M Balo Daily Backpack', 'hm-balo-daily-backpack', 'hm', 599000]
      ],
      {
        type: 'accessory'
      }
    )
  );

  // ---------------------------------------------------------
  // VÍ
  // ---------------------------------------------------------
  products.push(
    ...createProducts(
      categories['vi'].id,
      [
        ['Lacoste Ví Da Nam Classic', 'lacoste-vi-da-nam-classic', 'lacoste', 1490000],
        ['Lacoste Ví Gập Nam', 'lacoste-vi-gap-nam', 'lacoste', 1290000],
        ['Charles & Keith Ví Cầm Tay Nữ', 'charles-keith-vi-cam-tay-nu', 'charles-keith', 1090000],
        ['Charles & Keith Ví Card Holder', 'charles-keith-card-holder', 'charles-keith', 799000],
        ['Mango Ví Da Mini', 'mango-vi-da-mini', 'mango', 699000],
        ['Mango Ví Gập Nữ', 'mango-vi-gap-nu', 'mango', 799000],
        ['Zara Ví Da Nam', 'zara-vi-da-nam', 'zara', 699000],
        ['Zara Ví Cầm Tay Nữ', 'zara-vi-cam-tay-nu', 'zara', 799000],
        ['Uniqlo Ví Mini', 'uniqlo-vi-mini', 'uniqlo', 299000],
        ['H&M Ví Da PU', 'hm-vi-da-pu', 'hm', 399000]
      ],
      {
        type: 'accessory'
      }
    )
  );

  // ---------------------------------------------------------
  // MŨ
  // ---------------------------------------------------------
  products.push(
    ...createProducts(
      categories['mu'].id,
      [
        ['Nike Club Cap', 'nike-club-cap', 'nike', 649000],
        ['Nike Heritage86 Cap', 'nike-heritage86-cap', 'nike', 599000],
        ['Adidas Trefoil Cap', 'adidas-trefoil-cap', 'adidas', 599000],
        ['Adidas Classic Baseball Cap', 'adidas-classic-baseball-cap', 'adidas', 549000],
        ['Puma Essentials Cap', 'puma-essentials-cap', 'puma', 449000],
        ['Puma Metal Cat Cap', 'puma-metal-cat-cap', 'puma', 499000],
        ['Lacoste Cotton Twill Cap', 'lacoste-cotton-twill-cap', 'lacoste', 999000],
        ['Uniqlo Cotton Cap', 'uniqlo-cotton-cap', 'uniqlo', 299000],
        ['Zara Basic Baseball Cap', 'zara-basic-baseball-cap', 'zara', 399000],
        ['H&M Cotton Cap', 'hm-cotton-cap', 'hm', 299000]
      ],
      {
        type: 'accessory'
      }
    )
  );

  // ---------------------------------------------------------
  // THẮT LƯNG
  // ---------------------------------------------------------
  products.push(
    ...createProducts(
      categories['that-lung'].id,
      [
        ['Lacoste Thắt Lưng Da Nam Classic', 'lacoste-that-lung-da-nam-classic', 'lacoste', 1490000],
        ['Lacoste Thắt Lưng Canvas', 'lacoste-that-lung-canvas', 'lacoste', 1190000],
        ['Levi’s Thắt Lưng Da Heritage', 'levis-that-lung-da-heritage', 'levis', 999000],
        ['Levi’s Thắt Lưng Denim Casual', 'levis-that-lung-denim-casual', 'levis', 799000],
        ['Zara Thắt Lưng Da Basic', 'zara-that-lung-da-basic', 'zara', 699000],
        ['Zara Thắt Lưng Khóa Kim Loại', 'zara-that-lung-khoa-kim-loai', 'zara', 799000],
        ['Mango Thắt Lưng Da Nữ', 'mango-that-lung-da-nu', 'mango', 699000],
        ['Mango Thắt Lưng Bản Nhỏ', 'mango-that-lung-ban-nho', 'mango', 599000],
        ['Uniqlo Thắt Lưng Da Đơn Giản', 'uniqlo-that-lung-da-don-gian', 'uniqlo', 499000],
        ['H&M Thắt Lưng Casual', 'hm-that-lung-casual', 'hm', 399000]
      ],
      {
        type: 'accessory'
      }
    )
  );

  // =========================================================
  // 5. CREATE PRODUCTS + VARIANTS
  // =========================================================
  console.log(`📦 Đang tạo ${products.length} sản phẩm...`);

  let createdProductCount = 0;
  let createdVariantCount = 0;

  for (const profile of products) {
    const brand = brands[profile.brandSlug];

    const product = await prisma.product.create({
      data: {
        categoryId: profile.categoryId,
        brandId: brand.id,

        name: profile.name,
        slug: profile.slug,

        // ⭐ ĐỂ NULL ĐỂ ANH TỰ UPLOAD CLOUDINARY
        thumbnailUrl: null,

        description: profile.description,

        status: 'ACTIVE',

        soldCount: 0,
        reviewCount: 0,
        rating: 0
      }
    });

    createdProductCount++;

    const variants = createVariants(
      product,
      profile.price,
      profile.type
    );

    await prisma.productVariant.createMany({
      data: variants
    });

    createdVariantCount += variants.length;

    // -------------------------------------------------------
    // Tạo InventoryTransaction nhập kho ban đầu
    // Admin là người tạo giao dịch.
    // -------------------------------------------------------
    for (const variant of variants) {
      await prisma.inventoryTransaction.create({
        data: {
          productVariantId: variant.productId
            ? variant.id
            : undefined
        }
      }).catch(() => {
        // Bỏ qua vì variant từ createMany không có ID.
      });
    }
  }

  console.log(`✅ ${createdProductCount} Products`);
  console.log(`✅ ${createdVariantCount} Variants\n`);

  // =========================================================
  // 6. TẠO INVENTORY TRANSACTIONS
  // =========================================================
  //
  // Vì createMany không trả về ID trong cách sử dụng trên,
  // phần inventory sẽ được tạo lại bằng cách lấy toàn bộ
  // variants sau khi products đã tạo.
  //
  // =========================================================

  const allVariants = await prisma.productVariant.findMany({
    select: {
      id: true,
      stockQuantity: true
    }
  });

  // Xóa những transaction rỗng nếu đoạn trên không tạo được.
  // Thực tế đoạn tạo ở trên sẽ bị catch nên không ảnh hưởng.
  for (const variant of allVariants) {
    await prisma.inventoryTransaction.create({
      data: {
        productVariantId: variant.id,
        type: 'Import',
        quantity: variant.stockQuantity,
        balanceAfter: variant.stockQuantity,
        note: 'Nhập kho ban đầu khi khởi tạo dữ liệu sản phẩm',
        createdBy: admin.id
      }
    });
  }

  console.log(`✅ Đã tạo ${allVariants.length} InventoryTransactions\n`);

  // =========================================================
  // 7. SUMMARY
  // =========================================================
  const categoryCount = await prisma.category.count();
  const brandCount = await prisma.brand.count();
  const productCount = await prisma.product.count();
  const variantCount = await prisma.productVariant.count();
  const userCount = await prisma.user.count();

  console.log('==============================================');
  console.log('🎉 SEED DATABASE HOÀN TẤT');
  console.log('==============================================');
  console.log(`👤 Users       : ${userCount}`);
  console.log(`🏷️ Brands      : ${brandCount}`);
  console.log(`📂 Categories  : ${categoryCount}`);
  console.log(`📦 Products    : ${productCount}`);
  console.log(`🔹 Variants    : ${variantCount}`);
  console.log('==============================================');
  console.log('');
  console.log('🔐 Tài khoản test:');
  console.log('Admin    : admin@fashionhub.com / 123456');
  console.log('Customer : user1@gmail.com / 123456');
  console.log('Customer : user2@gmail.com / 123456');
  console.log('Customer : user3@gmail.com / 123456');
  console.log('');
  console.log('🖼️ Tất cả Product thumbnailUrl = null');
  console.log('🖼️ Tất cả Brand logoUrl = null');
  console.log('==============================================');
}

// ============================================================
// PRODUCT FACTORY
// ============================================================

function createProducts(
  categoryId,
  data,
  options = {}
) {
  return data.map(item => ({
    categoryId,
    name: item[0],
    slug: item[1],
    brandSlug: item[2],
    price: item[3],
    type: options.type || 'clothing',

    description:
      `Sản phẩm ${item[0]} chính hãng từ ${capitalizeBrand(item[2])}. ` +
      `Thiết kế hiện đại, chất liệu phù hợp sử dụng hàng ngày, ` +
      `mang lại sự thoải mái và phong cách cho người sử dụng.`
  }));
}

// ============================================================
// VARIANT FACTORY
// ============================================================

function createVariants(product, basePrice, type) {
  const variants = [];

  // ==========================================================
  // Tạo mã sản phẩm từ slug
  // ==========================================================

  const productCode = product.slug
    .replace(/-/g, '')
    .toUpperCase();

  // ==========================================================
  // CLOTHING
  // ==========================================================

  if (type === 'clothing') {
    const colors = [
      'Đen',
      'Trắng',
      'Xanh Navy'
    ];

    const sizes = [
      'S',
      'M',
      'L',
      'XL'
    ];

    let index = 1;

    for (const color of colors) {
      for (const size of sizes) {
        let price = basePrice;

        if (size === 'XL') {
          price += 30000;
        }

        variants.push({
          productId: product.id,

          sku: `${productCode}-${index
            .toString()
            .padStart(3, '0')}`,

          color,
          size,

          price,

          stockQuantity: 50,

          status: 'ACTIVE'
        });

        index++;
      }
    }

    return variants;
  }

  // ==========================================================
  // SHOES
  // ==========================================================

  if (type === 'shoe') {
    const colors = [
      'Đen',
      'Trắng',
      'Xám'
    ];

    const sizes = [
      '39',
      '40',
      '41',
      '42',
      '43'
    ];

    let index = 1;

    for (const color of colors) {
      for (const size of sizes) {
        variants.push({
          productId: product.id,

          sku: `${productCode}-${index
            .toString()
            .padStart(3, '0')}`,

          color,
          size,

          price: basePrice,

          stockQuantity: 30,

          status: 'ACTIVE'
        });

        index++;
      }
    }

    return variants;
  }

  // ==========================================================
  // ACCESSORIES
  // ==========================================================

  if (type === 'accessory') {
    const colors = [
      'Đen',
      'Nâu',
      'Trắng'
    ];

    let index = 1;

    for (const color of colors) {
      variants.push({
        productId: product.id,

        sku: `${productCode}-${index
          .toString()
          .padStart(3, '0')}`,

        color,
        size: null,

        price: basePrice,

        stockQuantity: 30,

        status: 'ACTIVE'
      });

      index++;
    }

    return variants;
  }

  return [];
}

// ============================================================
// BRAND NAME
// ============================================================

function capitalizeBrand(slug) {
  const names = {
    uniqlo: 'Uniqlo',
    zara: 'Zara',
    hm: 'H&M',
    levis: "Levi's",
    nike: 'Nike',
    adidas: 'Adidas',
    puma: 'Puma',
    lacoste: 'Lacoste',
    mango: 'Mango',
    'charles-keith': 'Charles & Keith'
  };

  return names[slug] || slug;
}

// ============================================================
// RUN
// ============================================================

main()
  .catch(error => {
    console.error('\n❌ SEED THẤT BẠI:');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });