const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🖼️ Bắt đầu cập nhật thumbnail từ ProductImage...');

  const products = await prisma.product.findMany({
    where: {
      thumbnailUrl: null
    },
    include: {
      images: {
        orderBy: {
          displayOrder: 'asc'
        },
        take: 1
      }
    }
  });

  console.log(`📦 Có ${products.length} sản phẩm chưa có thumbnail.`);

  let updated = 0;

  for (const product of products) {
    const firstImage = product.images[0];

    if (!firstImage) {
      console.log(`⚠️ Bỏ qua "${product.name}" vì chưa có ảnh.`);
      continue;
    }

    await prisma.product.update({
      where: {
        id: product.id
      },
      data: {
        thumbnailUrl: firstImage.imageUrl
      }
    });

    updated++;
    console.log(`✅ ${product.name}`);
  }

  console.log(`\n🎉 Hoàn thành! Đã cập nhật ${updated} thumbnail.`);
}

main()
  .catch(error => {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });