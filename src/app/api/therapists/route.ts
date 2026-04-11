import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const fallbackTherapists = [
  {
    id: 'mock-1',
    name: 'Dr. Emily Chen',
    bio: 'Specializes in anxiety, depression, and burnout support.',
    specialties: 'Anxiety,Depression,Burnout',
    insuranceAccepted: 'Aetna,BlueCross,Cigna',
    hourlyRate: 180,
    profileImage: null,
  },
  {
    id: 'mock-2',
    name: 'Dr. Jason Liu',
    bio: 'Focuses on trauma recovery, relationships, and life transitions.',
    specialties: 'Trauma,Relationships,Life Transitions',
    insuranceAccepted: 'UnitedHealth,Cigna',
    hourlyRate: 200,
    profileImage: null,
  },
  {
    id: 'mock-3',
    name: 'Dr. Sophia Wang',
    bio: 'Supports ADHD, parenting stress, and adolescent care.',
    specialties: 'ADHD,Family Therapy,Adolescent',
    insuranceAccepted: 'Aetna,UnitedHealth',
    hourlyRate: 170,
    profileImage: null,
  },
];

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
    return NextResponse.json(fallbackTherapists);
  }
}
