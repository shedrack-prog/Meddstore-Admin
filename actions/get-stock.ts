import prismadb from '@/prisma/prismaDb';

export const getProductsInStock = async (storeId: string) => {
  const productsInStock = await prismadb.product.count({
    where: {
      storeId,
      isArchived: false,
    },
  });
  return productsInStock;
};
