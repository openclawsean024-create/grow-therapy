import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const therapist = await prisma.therapist.findUnique({
      where: { id: params.id },
      include: {
        appointments: {
          where: { status: 'scheduled' },
          orderBy: { dateTime: 'asc' },
          take: 10,
        },
      },
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist not found' }, { status: 404 });
    }

    return NextResponse.json(therapist);
  } catch (error) {
    console.error('Error fetching therapist:', error);
    return NextResponse.json({ error: 'Failed to fetch therapist' }, { status: 500 });
  }
}
