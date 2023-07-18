import prismadb from '@/prisma/prismaDb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    // const {userId} = auth()

    if (!params.colorId) {
      return new NextResponse('Color id is required');
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log(['COLOR_GET'], error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { colorId: string; storeId: string } }
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

    if (!params.colorId) {
      return new NextResponse('Color id is required', { status: 400 });
    }
    if (!name) {
      return new NextResponse('Color name is required', { status: 400 });
    }
    if (!value) {
      return new NextResponse('Color value is required', { status: 400 });
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
    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log(['COLOR_PATCH'], error);
    return new NextResponse('internal Server Error', { status: 500 });
  }
}

// Delete API
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse('Store Id is required', { status: 400 });
    }
    if (!params.colorId) {
      return new NextResponse('Color Id is required', { status: 400 });
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

    const color = await prismadb.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log(['COLOR_DELETE'], error);
    return new NextResponse('internal Server Error', { status: 500 });
  }
}
