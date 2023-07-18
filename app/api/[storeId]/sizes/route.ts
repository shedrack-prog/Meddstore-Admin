import prismadb from '@/prisma/prismaDb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string };
  }
) {
  try {
    const body = await req.json();
    const { userId } = auth();
    const { name, value } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Size name is required', { status: 400 });
    }

    if (!value) {
      return new NextResponse('Size value is required', { status: 400 });
    }

    const isStoreByUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!isStoreByUser) {
      return new NextResponse('Unauthorized', { status: 403 });
    }
    const size = await prismadb.size.create({
      data: {
        name,
        value: value.toUpperCase(),
        storeId: params.storeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log('[SIZES_POST]', error);
    return new NextResponse('INTERNAL SERVER ERROR', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = params;

    if (!storeId) {
      return new NextResponse('Store Id is required', { status: 400 });
    }

    const sizes = await prismadb.size.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log(['SIZES_GET', error]);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
