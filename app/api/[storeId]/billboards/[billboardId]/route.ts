import prismadb from '@/prisma/prismaDb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    // const {userId} = auth()

    if (!params.billboardId) {
      return new NextResponse('Billboard id is required');
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(['BILLBOARD_GET'], error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const body = await req.json();
    const { label, imgUrl } = body;
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse('Store Id is required', { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 });
    }
    if (!label) {
      return new NextResponse('Label is required', { status: 400 });
    }
    if (!imgUrl) {
      return new NextResponse('image URL is required', { status: 400 });
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
    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imgUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(['BILLBOARD_PATCH'], error);
    return new NextResponse('internal Server Error', { status: 500 });
  }
}

// Delete API
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse('Store Id is required', { status: 400 });
    }
    if (!params.billboardId) {
      return new NextResponse('Billboard Id is required', { status: 400 });
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

    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(['BILLBOARD_DELETE'], error);
    return new NextResponse('internal Server Error', { status: 500 });
  }
}
