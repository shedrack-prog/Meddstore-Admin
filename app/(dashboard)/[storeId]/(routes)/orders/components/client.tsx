'use client';

import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import { OrderColumnType, columns } from './column';

interface OrderClientProps {
  data: OrderColumnType[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage Orders for your store"
      />
      <Separator />

      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  );
};
