const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // Hãy chỉnh lại đường dẫn trỏ đúng file prisma của bạn nếu cần

async function main() {
  console.log('🔥 Bắt đầu quá trình xóa dữ liệu cũ để làm sạch DB...');
  await prisma.productVariant.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.category.deleteMany({});
  console.log('✅ Đã dọn dẹp xong database.');

  // ==========================================
  // 1. TẠO 10 THƯƠNG HIỆU (BRANDS)
  // ==========================================
  console.log('🌱 Đang tạo 10 thương hiệu...');
  const brandData = [
    { name: 'Uniqlo', slug: 'uniqlo', logoUrl: 'https://picsum.photos/200/200?random=1' },
    { name: 'Zara', slug: 'zara', logoUrl: 'https://picsum.photos/200/200?random=2' },
    { name: 'H&M', slug: 'hm', logoUrl: 'https://picsum.photos/200/200?random=3' },
    { name: 'Levi\'s', slug: 'levis', logoUrl: 'https://picsum.photos/200/200?random=4' },
    { name: 'Nike', slug: 'nike', logoUrl: 'https://picsum.photos/200/200?random=5' },
    { name: 'Adidas', slug: 'adidas', logoUrl: 'https://picsum.photos/200/200?random=6' },
    { name: 'Gucci', slug: 'gucci', logoUrl: 'https://picsum.photos/200/200?random=7' },
    { name: 'Lacoste', slug: 'lacoste', logoUrl: 'https://picsum.photos/200/200?random=8' },
    { name: 'Puma', slug: 'puma', logoUrl: 'https://picsum.photos/200/200?random=9' },
    { name: 'Chanel', slug: 'chanel', logoUrl: 'https://picsum.photos/200/200?random=10' },
  ];

  const createdBrands = [];
  for (const b of brandData) {
    const brand = await prisma.brand.create({ data: b });
    createdBrands.push(brand);
  }
  console.log(`✅ Đã tạo thành công ${createdBrands.length} thương hiệu.`);

  // ==========================================
  // 2. TẠO 10 DANH MỤC (CATEGORIES) CÓ PHÂN CẤP CHA - CON
  // ==========================================
  console.log('🌱 Đang tạo danh mục sản phẩm...');
  
  // Tạo các danh mục gốc (Parent Categories)
  const catNam = await prisma.category.create({ data: { name: 'Thời trang Nam', slug: 'thoi-trang-nam', description: 'Quần áo phụ kiện dành cho nam' } });
  const catNu = await prisma.category.create({ data: { name: 'Thời trang Nữ', slug: 'thoi-trang-nu', description: 'Váy vóc quần áo dành cho nữ' } });
  const catGiay = await prisma.category.create({ data: { name: 'Giày dép', slug: 'giay-dep', description: 'Các loại giày thể thao, giày tây' } });
  const catPhuKien = await prisma.category.create({ data: { name: 'Phụ kiện', slug: 'phu-kien', description: 'Balo, túi xách, đồng hồ' } });

  // 💡 ĐÃ CẬP NHẬT: Đổi từ Chân Váy sang Áo Kiểu Nữ
  const catSoMiNam = await prisma.category.create({ data: { name: 'Áo sơ mi Nam', slug: 'ao-so-mi-nam', parentId: catNam.id } });
  const catQuanNam = await prisma.category.create({ data: { name: 'Quần Nam', slug: 'quan-nam', parentId: catNam.id } });
  const catVayNu = await prisma.category.create({ data: { name: 'Váy đầm Nữ', slug: 'vay-dam-nu', parentId: catNu.id } });
  const catAoNu = await prisma.category.create({ data: { name: 'Áo kiểu Nữ', slug: 'ao-kieu-nu', parentId: catNu.id } });
  const catTuiXach = await prisma.category.create({ data: { name: 'Túi xách & Balo', slug: 'tui-xach-balo', parentId: catPhuKien.id } });
  const catDongHo = await prisma.category.create({ data: { name: 'Đồng hồ', slug: 'dong-ho', parentId: catPhuKien.id } });

  console.log('✅ Đã tạo đủ cấu trúc hệ thống 10 danh mục.');

  // ==========================================
  // 3. ĐỊNH NGHĨA KHUNG DỮ LIỆU SẢN PHẨM (PRODUCTS)
  // ==========================================
  const productProfiles = [
    // --- 10 Sản phẩm Thời trang Nam (5 Sơ mi, 5 Quần) ---
    { categoryId: catSoMiNam.id, name: 'Áo Sơ Mi Nam Oxford Basic', slug: 'ao-so-mi-nam-oxford-basic', priceBase: 290000, thumb: 'https://picsum.photos/400/400?random=11' },
    { categoryId: catSoMiNam.id, name: 'Áo Sơ Mi Lụa Cổ Vest Hàn Quốc', slug: 'ao-so-mi-lua-co-vest-han-quoc', priceBase: 350000, thumb: 'https://picsum.photos/400/400?random=12' },
    { categoryId: catSoMiNam.id, name: 'Áo Sơ Mi Kẻ Sọc Công Sở', slug: 'ao-so-mi-ke-soc-cong-so', priceBase: 320000, thumb: 'https://picsum.photos/400/400?random=13' },
    { categoryId: catSoMiNam.id, name: 'Áo Sơ Mi Denim Thô Cá Tính', slug: 'ao-so-mi-denim-tho-ca-tinh', priceBase: 390000, thumb: 'https://picsum.photos/400/400?random=14' },
    { categoryId: catSoMiNam.id, name: 'Áo Sơ Mi Flannel Kẻ Caro', slug: 'ao-so-mi-flannel-ke-caro', priceBase: 280000, thumb: 'https://picsum.photos/400/400?random=15' },

    { categoryId: catQuanNam.id, name: 'Quần Tây Nam Dáng Baggy', slug: 'quan-tay-nam-dang-baggy', priceBase: 380000, thumb: 'https://picsum.photos/400/400?random=16' },
    { categoryId: catQuanNam.id, name: 'Quần Jean Nam Slimfit Co Giãn', slug: 'quan-jean-nam-slimfit-co-gian', priceBase: 450000, thumb: 'https://picsum.photos/400/400?random=17' },
    { categoryId: catQuanNam.id, name: 'Quần Kaki Nam Thẳng Lịch Lãm', slug: 'quan-kaki-nam-thang-lich-lam', priceBase: 360000, thumb: 'https://picsum.photos/400/400?random=18' },
    { categoryId: catQuanNam.id, name: 'Quần Short Kaki Đi Biển Nam', slug: 'quan-short-kaki-di-bien-nam', priceBase: 190000, thumb: 'https://picsum.photos/400/400?random=19' },
    { categoryId: catQuanNam.id, name: 'Quần Jogger Thể Thao Năng Động', slug: 'quan-jogger-the-thao-nang-dong', priceBase: 240000, thumb: 'https://picsum.photos/400/400?random=20' },

    // --- 10 Sản phẩm Thời trang Nữ (5 Váy đầm, 5 Áo kiểu) ---
    { categoryId: catVayNu.id, name: 'Váy Hoa Nhí Dáng Dài Tiểu Thư', slug: 'vay-hoa-nhi-dang-dai-tieu-thu', priceBase: 420000, thumb: 'https://picsum.photos/400/400?random=21' },
    { categoryId: catVayNu.id, name: 'Đầm Trễ Vai Dự Tiệc Sang Trọng', slug: 'dam-tre-vai-du-tiec-sang-trong', priceBase: 590000, thumb: 'https://picsum.photos/400/400?random=22' },
    { categoryId: catVayNu.id, name: 'Váy Suông Linen Mùa Hè Mát Lạnh', slug: 'vay-suong-linen-mua-he-mat-lanh', priceBase: 310000, thumb: 'https://picsum.photos/400/400?random=23' },
    { categoryId: catVayNu.id, name: 'Đầm Body Len Tăm Tôn Dáng', slug: 'dam-body-len-tam-ton-dang', priceBase: 280000, thumb: 'https://picsum.photos/400/400?random=24' },
    { categoryId: catVayNu.id, name: 'Váy Babydoll Dễ Thương Đi Chơi', slug: 'vay-babydoll-de-thuong-di-choi', priceBase: 250000, thumb: 'https://picsum.photos/400/400?random=25' },

    // 💡 ĐÃ CẬP NHẬT: 5 Sản phẩm Áo nữ mới thay thế cho chân váy cũ
    { categoryId: catAoNu.id, name: 'Áo Kiểu Trễ Vai Bánh Bèo Tiểu Thư', slug: 'ao-kieu-tre-vai-banh-beo-tieu-thu', priceBase: 220000, thumb: 'https://picsum.photos/400/400?random=26' },
    { categoryId: catAoNu.id, name: 'Áo Thun Croptop Ôm Body Năng Động', slug: 'ao-thun-croptop-om-body-nang-dong', priceBase: 150000, thumb: 'https://picsum.photos/400/400?random=27' },
    { categoryId: catAoNu.id, name: 'Áo Sơ Mi Lụa Cổ Đức Công Sở Nữ', slug: 'ao-so-mi-lua-co-duc-cong-so-nu', priceBase: 290000, thumb: 'https://picsum.photos/400/400?random=28' },
    { categoryId: catAoNu.id, name: 'Áo Len Cardigan Dáng Khoác Nhẹ', slug: 'ao-len-cardigan-dang-khoac-nhe', priceBase: 320000, thumb: 'https://picsum.photos/400/400?random=29' },
    { categoryId: catAoNu.id, name: 'Áo Kiểu Cổ Vuông Tay Phồng Thời Thượng', slug: 'ao-kieu-co-vuong-tay-phong-thoi-thuong', priceBase: 260000, thumb: 'https://picsum.photos/400/400?random=30' },

    // --- 15 Sản phẩm cho các danh mục còn lại (Mỗi mục đúng 5 cái) ---
    // Giày dép (5 sản phẩm)
    { categoryId: catGiay.id, name: 'Giày Thể Thao Sneaker Cổ Thấp', slug: 'giay-the-thao-sneaker-co-thap', priceBase: 650000, thumb: 'https://picsum.photos/400/400?random=31' },
    { categoryId: catGiay.id, name: 'Giày Tây Da Nam Oxford', slug: 'giay-tay-da-nam-oxford', priceBase: 1200000, thumb: 'https://picsum.photos/400/400?random=32' },
    { categoryId: catGiay.id, name: 'Giày Cao Gót Mũi Nhọn 7 Phân', slug: 'giay-cao-got-mui-nhon-7-phan', priceBase: 450000, thumb: 'https://picsum.photos/400/400?random=33' },
    { categoryId: catGiay.id, name: 'Scandal Quai Ngang Học Sinh', slug: 'scandal-quai-ngang-hoc-sinh', priceBase: 210000, thumb: 'https://picsum.photos/400/400?random=34' },
    { categoryId: catGiay.id, name: 'Dép Bánh Mì Đi Trong Nhà Siêu Êm', slug: 'dep-banh-mi-di-trong-nha-sieu-em', priceBase: 160000, thumb: 'https://picsum.photos/400/400?random=35' },

    // Túi xách & Balo (5 sản phẩm)
    { categoryId: catTuiXach.id, name: 'Balo Laptop Chống Nước Cao Cấp', slug: 'balo-laptop-chong-nuoc-cao-cap', priceBase: 480000, thumb: 'https://picsum.photos/400/400?random=36' },
    { categoryId: catTuiXach.id, name: 'Túi Xách Da Đeo Chéo Nữ Nắp Gập', slug: 'tui-xach-da-deo-cheo-nu-nap-gap', priceBase: 350000, thumb: 'https://picsum.photos/400/400?random=37' },
    { categoryId: catTuiXach.id, name: 'Túi Tote Vải Canvas Tiện Lợi', slug: 'tui-tote-vai-canvas-tien-loi', priceBase: 89000, thumb: 'https://picsum.photos/400/400?random=38' },
    { categoryId: catTuiXach.id, name: 'Ví Cầm Tay Mini Khóa Bấm', slug: 'vi-cam-tay-mini-khoa-bam', priceBase: 150000, thumb: 'https://picsum.photos/400/400?random=39' },
    { categoryId: catTuiXach.id, name: 'Túi Bao Tử Đeo Bụng Thể Thao', slug: 'tui-bao-tu-deo-bung-the-thao', priceBase: 180000, thumb: 'https://picsum.photos/400/400?random=40' },

    // Đồng hồ (5 sản phẩm)
    { categoryId: catDongHo.id, name: 'Đồng Hồ Nam Dây Da Cổ Điển', slug: 'dong-ho-nam-day-da-co-dien', priceBase: 1500000, thumb: 'https://picsum.photos/400/400?random=41' },
    { categoryId: catDongHo.id, name: 'Đồng Hồ Nữ Mặt Kính Thạch Anh', slug: 'dong-ho-nu-mat-kinh-thach-anh', priceBase: 1350000, thumb: 'https://picsum.photos/400/400?random=42' },
    { categoryId: catDongHo.id, name: 'Đồng Hồ Thể Thao Chống Nước Điện Tử', slug: 'dong-ho-the-thao-chong-nuoc-dien-tu', priceBase: 550000, thumb: 'https://picsum.photos/400/400?random=43' },
    { categoryId: catDongHo.id, name: 'Đồng Hồ Thông Minh Đo Sức Khỏe', slug: 'dong-ho-thong-minh-do-suc-khoe', priceBase: 2400000, thumb: 'https://picsum.photos/400/400?random=44' },
    { categoryId: catDongHo.id, name: 'Đồng Hồ Đôi Dây Kim Loại Cao Cấp', slug: 'dong-ho-doi-day-kim-loai-cao-cap', priceBase: 3200000, thumb: 'https://picsum.photos/400/400?random=45' }
  ];

  // ==========================================
  // 4. TIẾN HÀNH LOOP ĐỂ TẠO SẢN PHẨM & BIẾN THỂ
  // ==========================================
  console.log('🌱 Đang khởi tạo 35 sản phẩm cùng bộ biến thể tương ứng...');

  const colors = ['Trắng', 'Đen', 'Xanh Navy'];
  const sizes = ['S', 'M', 'L'];

  for (let i = 0; i < productProfiles.length; i++) {
    const profile = productProfiles[i];
    
    // Phân bổ ngẫu nhiên thương hiệu cho sản phẩm từ mảng 10 Brand đã tạo ở trên
    const randomBrand = createdBrands[i % createdBrands.length];

    // Tạo sản phẩm chính trước
    const product = await prisma.product.create({
      data: {
        categoryId: profile.categoryId,
        brandId: randomBrand.id,
        name: profile.name,
        slug: `${profile.slug}-${Date.now().toString().slice(-4)}`, // Đảm bảo unique cho slug
        thumbnailUrl: profile.thumb,
        description: `Mô tả chi tiết cho dòng sản phẩm ${profile.name}. Chất liệu vải cao cấp bền đẹp, đường may tinh tế sang trọng, đem lại cảm giác thoáng mát tôn dáng tuyệt đối cho người mặc khi đi làm, đi chơi hay dạo phố.`,
        status: 'ACTIVE'
      }
    });

    // Tạo Album ảnh phụ họa (Mỗi sản phẩm kèm 2 ảnh phụ tự động)
    await prisma.productImage.createMany({
      data: [
        { productId: product.id, imageUrl: `https://picsum.photos/400/400?random=${100 + i}`, displayOrder: 1 },
        { productId: product.id, imageUrl: `https://picsum.photos/400/400?random=${200 + i}`, displayOrder: 2 }
      ]
    });

    // Tạo các biến thể Variants (Màu Sắc x Kích Thước)
    const variantsToCreate = [];

    for (const color of colors) {
      for (const size of sizes) {
        // Tạo biến động giá nhỏ giữa các size để hiển thị logic "Từ... [Giá Min]" hoạt động rõ ràng
        let priceOffset = 0;
        if (size === 'M') priceOffset = 15000;
        if (size === 'L') priceOffset = 30000;

        // Mã hóa ngắn gọn tên màu sắc để tạo mã SKU ngẫu nhiên không trùng lặp
        const colorCode = color === 'Trắng' ? 'WHT' : color === 'Đen' ? 'BLK' : 'NVY';

        variantsToCreate.push({
          productId: product.id,
          sku: `${product.slug.toUpperCase().slice(0, 10)}-${colorCode}-${size}-${Date.now().toString().slice(-3)}`,
          color: color,
          size: size,
          price: profile.priceBase + priceOffset, // Giá biến thể tăng dần theo size
          stockQuantity: Math.floor(Math.random() * 80) + 20, // Số lượng tồn kho từ 20 đến 100 cái
          status: 'ACTIVE'
        });
      }
    }

    // Đẩy mảng Variant vào database bằng lệnh createMany
    await prisma.productVariant.createMany({ data: variantsToCreate });
  }

  console.log('✨ HOÀN THÀNH: Đã cập nhật và đổ thành công dữ liệu mẫu mới vào Database!');
}

main()
  .catch((e) => {
    console.error('❌ Có lỗi xảy ra trong quá trình seed data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });