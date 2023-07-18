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
    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Category name is required', { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 });
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
    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORY_POST]', error);
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

    const categories = await prismadb.category.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log(['CATEGORIES_GET', error]);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
