'use client';

import { ColumnDef } from '@tanstack/react-table';

export type OrderColumnType = {
  id: string;
  phone: string;
  address: string;
  totalPrice: string;
  isPaid: boolean;
  products: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumnType>[] = [
  {
    accessorKey: 'products',
    header: 'Products',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'totalPrice',
    header: 'Total Price',
  },
  {
    accessorKey: 'isPaid',
    header: 'Paid',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },
];
