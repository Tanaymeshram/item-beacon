import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, contact, image, color, birthplace, itemName, description } = await req.json();

    if (!name || !contact || !image || !color || !birthplace) {
      return NextResponse.json({ error: 'Missing required guardian fields' }, { status: 400 });
    }

    const item = await prisma.item.create({
      data: {
        name: itemName || `Item by ${name}`,
        description: description || "Registered via Camera QR Guest Flow",
        category: "General",
        imageUrl: image, // Store base64 image
        ownerName: name,
        ownerContact: contact,
        secColor: color.toLowerCase().trim(),
        secBirthplace: birthplace.toLowerCase().trim(),
        status: "protected"
      },
    });

    // Log the creation to Audit Log
    await prisma.auditLog.create({
      data: {
        itemId: item.id,
        action: "GUEST_REGISTERED",
        details: `Item registered by guest ${name}`
      }
    });

    return NextResponse.json({ success: true, itemId: item.id });
  } catch (error: any) {
    console.error('Error registering guest item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
