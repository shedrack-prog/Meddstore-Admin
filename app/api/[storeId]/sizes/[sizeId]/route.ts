import prismadb from '@/prisma/prismaDb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    // const {userId} = auth()

    if (!params.sizeId) {
      return new NextResponse('Size id is required');
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log(['SIZE_GET'], error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const body = await req.json();
    const { name, value } = body;
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse('Store Id is required', { status: 400 });
    }

    if (!params.sizeId) {
      return new NextResponse('Size id is required', { status: 400 });
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
    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log(['SIZE_PATCH'], error);
    return new NextResponse('internal Server Error', { status: 500 });
  }
}

// Delete API
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse('Store Id is required', { status: 400 });
    }
    if (!params.sizeId) {
      return new NextResponse('Size Id is required', { status: 400 });
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

    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log(['SIZE_DELETE'], error);
    return new NextResponse('internal Server Error', { status: 500 });
  }
}
