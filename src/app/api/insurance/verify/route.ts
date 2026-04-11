import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { insurancePlanId, serviceType } = body;

    if (!insurancePlanId || !serviceType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const plan = await prisma.insurancePlan.findUnique({
      where: { id: insurancePlanId },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Insurance plan not found' }, { status: 404 });
    }

    // Mock verification logic
    const isMentalHealthService = serviceType.toLowerCase().includes('therapy') ||
      serviceType.toLowerCase().includes('psych') ||
      serviceType.toLowerCase().includes('counsel');

    const covered = plan.coversMentalHealth && isMentalHealthService;

    return NextResponse.json({
      insurancePlanId: plan.id,
      insurancePlanName: plan.name,
      serviceType,
      covered,
      copayAmount: covered ? plan.copayAmount : null,
      coveragePercent: covered ? plan.coveragePercent : null,
      maxSessionsPerYear: plan.maxSessionsPerYear,
      message: covered
        ? `✓ ${plan.name} covers ${serviceType}. You pay a $${plan.copayAmount} copay.`
        : `✗ ${plan.name} does not cover ${serviceType}.`,
    });
  } catch (error) {
    console.error('Error verifying insurance:', error);
    return NextResponse.json({ error: 'Failed to verify insurance' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const plans = await prisma.insurancePlan.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error fetching insurance plans:', error);
    return NextResponse.json([]);
  }
}
