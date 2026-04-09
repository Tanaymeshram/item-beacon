import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { itemId, color, birthplace } = await req.json();

    if (!itemId || !color || !birthplace) {
      return NextResponse.json({ error: 'Missing verification fields' }, { status: 400 });
    }

    const item = await prisma.item.findUnique({
      where: { id: itemId }
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Check answers (case-insensitive and trimmed)
    const colorMatch = item.secColor?.toLowerCase().trim() === color.toLowerCase().trim();
    const cityMatch = item.secBirthplace?.toLowerCase().trim() === birthplace.toLowerCase().trim();

    if (colorMatch && cityMatch) {
      return NextResponse.json({ success: true, message: 'Identity Verified' });
    } else {
      return NextResponse.json({ success: false, error: 'Incorrect security answers' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Error verifying item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
