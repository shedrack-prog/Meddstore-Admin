import prismadb from '@/prisma/prismaDb';
import { useParams } from 'next/navigation';
import CategoryForm from './components/categoryForm';

const CategoryPageCreate = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  // single category
  const category = await prismadb.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  // all billboards for the one store
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryPageCreate;
