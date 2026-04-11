import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const fallbackTherapist = {
  id: 'mock-1',
  name: 'Dr. Emily Chen',
  bio: 'Specializes in anxiety, depression, and burnout support.',
  specialties: 'Anxiety,Depression,Burnout',
  insuranceAccepted: 'Aetna,BlueCross,Cigna',
  hourlyRate: 180,
  profileImage: null,
  appointments: [],
};

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
      return NextResponse.json(fallbackTherapist);
    }

    return NextResponse.json(therapist);
  } catch (error) {
    console.error('Error fetching therapist:', error);
    return NextResponse.json(fallbackTherapist);
  }
}
