'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-actioins';

export type BillboardColumnType = {
  id: string;
  label: string;
  createdAt: string;
};

export const columns: ColumnDef<BillboardColumnType>[] = [
  {
    accessorKey: 'label',
    header: 'Label',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
