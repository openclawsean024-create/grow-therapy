import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const billings = await prisma.billing.findMany({
      include: {
        appointment: {
          include: { therapist: true },
        },
        patient: true,
        insurancePlan: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(billings);
  } catch (error) {
    console.error('Error fetching billings:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { appointmentId, patientId, insurancePlanId } = body;

    if (!appointmentId || !patientId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { therapist: true },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const totalAmount = appointment.therapist.hourlyRate;
    let copayAmount = totalAmount;
    let insuranceCoverage = 0;
    let amountDue = totalAmount;

    if (insurancePlanId) {
      const plan = await prisma.insurancePlan.findUnique({
        where: { id: insurancePlanId },
      });

      if (plan) {
        copayAmount = plan.copayAmount;
        insuranceCoverage = (totalAmount - copayAmount) * (plan.coveragePercent / 100);
        amountDue = copayAmount;
      }
    }

    const billing = await prisma.billing.create({
      data: {
        appointmentId,
        patientId,
        insurancePlanId,
        totalAmount,
        copayAmount,
        insuranceCoverage,
        amountDue,
        status: 'pending',
      },
      include: {
        appointment: { include: { therapist: true } },
        patient: true,
        insurancePlan: true,
      },
    });

    return NextResponse.json(billing, { status: 201 });
  } catch (error) {
    console.error('Error creating billing:', error);
    return NextResponse.json({ error: 'Failed to create billing' }, { status: 500 });
  }
}
