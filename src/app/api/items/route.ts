import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, category, imageUrl } = await req.json();

    if (!name || !description || !imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const item = await prisma.item.create({
      data: {
        ownerId: user.userId,
        name,
        description,
        category,
        imageUrl,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
