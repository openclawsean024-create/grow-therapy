import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get('specialty');
    const insurance = searchParams.get('insurance');

    const therapists = await prisma.therapist.findMany({
      where: {
        ...(specialty && {
          specialties: { contains: specialty },
        }),
        ...(insurance && {
          insuranceAccepted: { contains: insurance },
        }),
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(therapists);
  } catch (error) {
    console.error('Error fetching therapists:', error);
    return NextResponse.json({ error: 'Failed to fetch therapists' }, { status: 500 });
  }
}
