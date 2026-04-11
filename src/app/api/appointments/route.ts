import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        therapist: true,
        patient: true,
      },
      orderBy: { dateTime: 'desc' },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { therapistId, patientId, dateTime, durationMins = 50, type = 'therapy' } = body;

    if (!therapistId || !patientId || !dateTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        therapistId,
        patientId,
        dateTime: new Date(dateTime),
        durationMins,
        type,
        status: 'scheduled',
      },
      include: {
        therapist: true,
        patient: true,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
