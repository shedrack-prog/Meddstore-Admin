import prismadb from '@/prisma/prismaDb';
import { BillboardClient } from './components/client';
import { BillboardColumnType } from './components/column';
import { format } from 'date-fns';

const Billboards = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedBillboards: BillboardColumnType[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="space-y-4 flex-1 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default Billboards;
