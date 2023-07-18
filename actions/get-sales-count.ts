import prismadb from '@/prisma/prismaDb';

export const getSalesCount = async (storeId: string) => {
  const salesCount = await prismadb.order.count({
    where: {
      storeId: storeId,
      isPaid: true,
    },
  });

  return salesCount;
};
