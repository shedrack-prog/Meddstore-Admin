import prismadb from '@/prisma/prismaDb';
import { useParams } from 'next/navigation';
import BillboardForm from './components/billboardForm';

const BillboardPageCreate = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPageCreate;
