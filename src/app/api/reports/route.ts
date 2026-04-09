import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { itemId, finderName, finderContact, message, locationLat, locationLng } = await req.json();

    if (!itemId || !finderName || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        itemId,
        finderName,
        finderContact: finderContact || null,
        message,
        locationLat,
        locationLng
      },
    });

    // Automatically mock an initial chat message
    await prisma.chat.create({
      data: {
        itemId,
        sender: "finder",
        message: message
      }
    });

    // Log the action to the Digital Passport Audit Log
    await prisma.auditLog.create({
      data: {
        itemId,
        action: "REPORTED",
        details: `Item was reported found by ${finderName} at Location [${locationLat}, ${locationLng}]`
      }
    });

    // Gamification Points System
    // If the finder is logged into the platform, grant them Karma Points for being a Good Samaritan
    const finderUser = await getUserFromCookie();
    if (finderUser) {
      await prisma.user.update({
        where: { id: finderUser.userId },
        data: { rewardPoints: { increment: 50 } }
      });
    }

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error('Error reporting item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
