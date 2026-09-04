const prisma = require('../../config/database');

const returnRepository = {
  create: async data => {
    return await prisma.returnRequest.create({
      data,
      include: {
        items: true
      }
    });
  },

  createTransaction: async ({
    returnData,
    items
  }) => {
    return await prisma.$transaction(async tx => {
      const returnRequest = await tx.returnRequest.create({
        data: returnData
      });

      await tx.returnRequestItem.createMany({
        data: items.map(item => ({
          returnRequestId: returnRequest.id,
          orderItemId: item.orderItemId,
          quantity: item.quantity
        }))
      });

      return await tx.returnRequest.findUnique({
        where: {
          id: returnRequest.id
        },
        include: {
          items: {
            include: {
              orderItem: true
            }
          },
          order: true
        }
      });
    });
  },

  findOrderItemsByIds: async (orderItemIds, orderId) => {
  return await prisma.orderItem.findMany({
    where: {
      id: {
        in: orderItemIds
      },
      orderId
    }
  });
},

  findById: async id => {
    return await prisma.returnRequest.findUnique({
      where: {
        id
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        order: {
          include: {
            payment: true
          }
        },
       items: {
        include: {
          orderItem: {
            include: {
              variant: {
                include: {
                  product: {
                    select: {
                      id: true,
                      name: true,
                      thumbnailUrl: true
                    }
                  }
                }
              }
            }
          }
        }
      }
      }
    });
  },

findByIdAndUser: async (id, userId) => {
  return await prisma.returnRequest.findFirst({
    where: {
      id,
      userId
    },
    include: {
      order: {
        include: {
          payment: true
        }
      },
      items: {
        include: {
          orderItem: {
            include: {
              variant: {
                include: {
                  product: {
                    select: {
                      id: true,
                      name: true,
                      thumbnailUrl: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
},

findByOrderId: async (orderId, userId) => {
  return await prisma.returnRequest.findMany({
    where: {
      orderId,
      userId
    },
    include: {
      items: {
        include: {
          orderItem: {
            include: {
              variant: {
                include: {
                  product: {
                    select: {
                      id: true,
                      name: true,
                      thumbnailUrl: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
},

  findExistingByOrderItem: async orderItemIds => {
    return await prisma.returnRequestItem.findMany({
      where: {
        orderItemId: {
          in: orderItemIds
        },
        returnRequest: {
          status: {
            in: [
              'REQUESTED',
              'APPROVED',
              'SHIPPING',
              'RECEIVED',
              'COMPLETED'
            ]
          }
        }
      },
      select: {
        orderItemId: true,
        quantity: true,
        returnRequest: {
          select: {
            id: true,
            status: true
          }
        }
      }
    });
  },

  findCompletedReturnQuantity: async orderItemId => {
    const result = await prisma.returnRequestItem.aggregate({
      where: {
        orderItemId,
        returnRequest: {
          status: 'COMPLETED'
        }
      },
      _sum: {
        quantity: true
      }
    });

    return result._sum.quantity || 0;
  },

  findReturnQuantity: async orderItemId => {
    const result = await prisma.returnRequestItem.aggregate({
      where: {
        orderItemId,
        returnRequest: {
          status: {
            in: [
              'REQUESTED',
              'APPROVED',
              'SHIPPING',
              'RECEIVED',
              'COMPLETED'
            ]
          }
        }
      },
      _sum: {
        quantity: true
      }
    });

    return result._sum.quantity || 0;
  },

  findAll: async ({ skip, take, where }) => {
    const [returns, totalItems] = await prisma.$transaction([
      prisma.returnRequest.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          },
          order: {
            select: {
              id: true,
              orderNumber: true,
              totalAmount: true,
              status: true
            }
          },
          items: {
            include: {
              orderItem: true
            }
          }
        }
      }),
      prisma.returnRequest.count({
        where
      })
    ]);

    return {
      returns,
      totalItems
    };
  },

  updateStatus: async (id, data) => {
    return await prisma.returnRequest.update({
      where: {
        id
      },
      data,
      include: {
        items: {
          include: {
            orderItem: true
          }
        },
        order: {
          include: {
            payment: true
          }
        }
      }
    });
  },

completeTransaction: async ({
  returnId,
  refundAmount,
  paymentStatus,
  refundedAmount
}) => {
  return await prisma.$transaction(async tx => {
    const returnRequest =
      await tx.returnRequest.findUnique({
        where: {
          id: returnId
        },
        include: {
          items: {
           items: {
  include: {
    orderItem: {
      include: {
        variant: true
      }
    }
  }
}
          },
          order: {
            include: {
              payment: true
            }
          }
        }
      });

    if (!returnRequest) {
      throw new Error('Không tìm thấy yêu cầu trả hàng.');
    }

    if (returnRequest.status === 'COMPLETED') {
      return returnRequest;
    }

    for (const item of returnRequest.items) {
      await tx.productVariant.update({
        where: {
          id: item.orderItem.productVariantId
        },
        data: {
          stockQuantity: {
            increment: item.quantity
          }
        }
      });

      if (item.orderItem.flashSaleVariantId) {
        await tx.flashSaleVariant.update({
          where: {
            id: item.orderItem.flashSaleVariantId
          },
          data: {
            flashSaleStock: {
              increment: item.quantity
            }
          }
        });
      }

      await tx.inventoryTransaction.create({
        data: {
          productVariantId:
            item.orderItem.productVariantId,
          type: 'Import',
          quantity: item.quantity,
          note:
            `Hoàn kho do hoàn hàng ${returnRequest.order.orderNumber}`,
          createdBy: returnRequest.userId
        }
      });
    }
const orderItems = await tx.orderItem.findMany({
  where: {
    orderId: returnRequest.order.id
  },
  select: {
    id: true,
    quantity: true
  }
});

const returnedQuantities = await tx.returnRequestItem.findMany({
  where: {
    orderItem: {
      orderId: returnRequest.order.id
    },
    returnRequest: {
      status: {
        in: [
          'REQUESTED',
          'APPROVED',
          'SHIPPING',
          'RECEIVED',
          'COMPLETED'
        ]
      }
    }
  },
  select: {
    orderItemId: true,
    quantity: true
  }
});

const returnedQuantityMap = new Map();

for (const item of returnedQuantities) {
  const current =
    returnedQuantityMap.get(item.orderItemId) || 0;

  returnedQuantityMap.set(
    item.orderItemId,
    current + item.quantity
  );
}

const isFullReturn = orderItems.every(orderItem => {
  const returnedQuantity =
    returnedQuantityMap.get(orderItem.id) || 0;

  return returnedQuantity >= orderItem.quantity;
});

const fullyReturnedOrderItemIds = orderItems
  .filter(orderItem => {
    const returnedQuantity =
      returnedQuantityMap.get(orderItem.id) || 0;

    return returnedQuantity >= orderItem.quantity;
  })
  .map(orderItem => orderItem.id);

for (const item of returnRequest.items) {
await tx.product.update({
  where: {
    id: item.orderItem.variant.productId
  },
  data: {
    soldCount: {
      decrement: item.quantity
    }
  }
});
}

if (fullyReturnedOrderItemIds.length > 0) {
  const reviews = await tx.review.findMany({
    where: {
      orderItemId: {
        in: fullyReturnedOrderItemIds
      },
      isHidden: false
    },
    select: {
      id: true,
      productId: true
    }
  });

  if (reviews.length > 0) {
    await tx.review.updateMany({
      where: {
        id: {
          in: reviews.map(review => review.id)
        }
      },
      data: {
        isHidden: true
      }
    });

    const reviewCountByProduct = new Map();

    for (const review of reviews) {
      const count =
        reviewCountByProduct.get(review.productId) || 0;

      reviewCountByProduct.set(
        review.productId,
        count + 1
      );
    }

    for (const [
      productId,
      count
    ] of reviewCountByProduct) {
      await tx.product.update({
        where: {
          id: productId
        },
        data: {
          reviewCount: {
            decrement: count
          }
        }
      });
    }
  }
}

const updatedReturn =
  await tx.returnRequest.update({
    where: {
      id: returnId
    },
    data: {
      status: 'COMPLETED',
      refundAmount,
      completedAt: new Date()
    },
    include: {
      items: {
        include: {
          orderItem: true
        }
      },
      order: {
        include: {
          payment: true
        }
      }
    }
  });

if (isFullReturn) {
  await tx.order.update({
    where: {
      id: returnRequest.order.id
    },
    data: {
      status: 'RETURN'
    }
  });
}

    if (returnRequest.order.payment) {
      await tx.payment.update({
        where: {
          id: returnRequest.order.payment.id
        },
        data: {
          status: paymentStatus,
          refundedAmount
        }
      });
    }

    return updatedReturn;
  });
},

  findOrderByIdAndUser: async (orderId, userId) => {
  return await prisma.order.findFirst({
    where: {
      id: orderId,
      userId
    },
    include: {
      payment: true,
      items: {
        include: {
          variant: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  thumbnailUrl: true
                }
              }
            }
          }
        }
      },
      returnRequests: {
        select: {
          id: true,
          status: true,
          reason: true,
          refundAmount: true,
          createdAt: true,
          completedAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });
},
};

module.exports = returnRepository;