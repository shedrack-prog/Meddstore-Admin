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
    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
      images,
    } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!name || !price || !categoryId || !colorId || !sizeId) {
      return new NextResponse('Please provide all values', { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse('images are required', { status: 400 });
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
    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        sizeId,
        colorId,
        isArchived,
        isFeatured,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        storeId: params.storeId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse('INTERNAL SERVER ERROR', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);

    const categoryId = searchParams.get('categoryId') || undefined;
    const colorId = searchParams.get('colorId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    const { storeId } = params;

    if (!storeId) {
      return new NextResponse('Store Id is required', { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId,
        colorId,
        categoryId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log(['PRODUCTS_GET', error]);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
