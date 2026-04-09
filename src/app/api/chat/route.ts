import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get('itemId');

  if (!itemId) {
    return NextResponse.json({ error: 'Missing itemId' }, { status: 400 });
  }

  try {
    const chats = await prisma.chat.findMany({
      where: { itemId },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ success: true, chats });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { itemId, message, sender } = await req.json();

    if (!itemId || !message || !sender) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const chat = await prisma.chat.create({
      data: {
        itemId,
        message,
        sender,
      },
    });

    return NextResponse.json({ success: true, chat });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
