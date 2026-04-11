import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MOCK_PLANS: Record<string, { name: string; coversMentalHealth: boolean; copayAmount: number; coveragePercent: number; maxSessionsPerYear: number | null }> = {
  'mock-insurance-1': { name: 'Aetna PPO', coversMentalHealth: true, copayAmount: 30, coveragePercent: 80, maxSessionsPerYear: 30 },
  'mock-insurance-2': { name: 'BlueCross BlueShield', coversMentalHealth: true, copayAmount: 25, coveragePercent: 85, maxSessionsPerYear: 40 },
  'mock-insurance-3': { name: 'UnitedHealth Choice', coversMentalHealth: true, copayAmount: 35, coveragePercent: 75, maxSessionsPerYear: 25 },
};

const isMockPlan = (id: string) => id in MOCK_PLANS;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { insurancePlanId, serviceType } = body;

    if (!insurancePlanId || !serviceType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check mock plans first (no DB required)
    if (isMockPlan(insurancePlanId)) {
      const mockPlan = { id: insurancePlanId, ...MOCK_PLANS[insurancePlanId] };
      const isMentalHealthService = serviceType.toLowerCase().includes('therapy') ||
        serviceType.toLowerCase().includes('psych') ||
        serviceType.toLowerCase().includes('counsel');
      const covered = mockPlan.coversMentalHealth && isMentalHealthService;

      return NextResponse.json({
        insurancePlanId: mockPlan.id,
        insurancePlanName: mockPlan.name,
        serviceType,
        covered,
        copayAmount: covered ? mockPlan.copayAmount : null,
        coveragePercent: covered ? mockPlan.coveragePercent : null,
        maxSessionsPerYear: mockPlan.maxSessionsPerYear,
        message: covered
          ? `✓ ${mockPlan.name} covers ${serviceType}. You pay a $${mockPlan.copayAmount} copay.`
          : `✗ ${mockPlan.name} does not cover ${serviceType}.`,
      });
    }

    // DB lookup for real plans
    let plan = null;
    try {
      plan = await prisma.insurancePlan.findUnique({
        where: { id: insurancePlanId },
      });
    } catch (dbError) {
      console.error('DB lookup failed:', dbError);
    }

    if (!plan) {
      return NextResponse.json({ error: 'Insurance plan not found' }, { status: 404 });
    }

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
    // Return mock insurance plans as fallback
    return NextResponse.json([
      { id: 'mock-insurance-1', name: 'Aetna PPO', provider: 'Aetna', copayAmount: 30, coveragePercent: 80, maxSessionsPerYear: 30 },
      { id: 'mock-insurance-2', name: 'BlueCross BlueShield', provider: 'BlueCross', copayAmount: 25, coveragePercent: 85, maxSessionsPerYear: 40 },
      { id: 'mock-insurance-3', name: 'UnitedHealth Choice', provider: 'UnitedHealth', copayAmount: 35, coveragePercent: 75, maxSessionsPerYear: 25 },
    ]);
  }
}
