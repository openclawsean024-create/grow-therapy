import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.billing.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.therapist.deleteMany();
  await prisma.insurancePlan.deleteMany();

  // Seed Therapists
  const therapists = await Promise.all([
    prisma.therapist.create({
      data: {
        name: 'Dr. Sarah Chen',
        email: 'sarah.chen@growtherapy.com',
        bio: 'Licensed clinical psychologist with 12 years of experience specializing in anxiety, depression, and trauma. Evidence-based approach using CBT and EMDR.',
        specialties: 'Anxiety,Depression,Trauma,EMDR',
        insuranceAccepted: 'Aetna,BlueCross,UnitedHealth',
        hourlyRate: 150,
        profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
    }),
    prisma.therapist.create({
      data: {
        name: 'Dr. Marcus Johnson',
        email: 'marcus.johnson@growtherapy.com',
        bio: 'Marriage and family therapist focusing on relationship issues, stress management, and life transitions. Warm, collaborative style.',
        specialties: 'Relationships,Stress,Life Transitions,Family Therapy',
        insuranceAccepted: 'Cigna,Aetna,BlueCross',
        hourlyRate: 130,
        profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
    }),
    prisma.therapist.create({
      data: {
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@growtherapy.com',
        bio: 'Specialist in child and adolescent therapy, OCD, and eating disorders. Play therapy and DBT techniques for teens and young adults.',
        specialties: 'Child,Adolescent,OCD,Eating Disorders,DBT',
        insuranceAccepted: 'UnitedHealth,BlueCross,Cigna',
        hourlyRate: 140,
        profileImage: 'https://randomuser.me/api/portraits/women/65.jpg',
      },
    }),
    prisma.therapist.create({
      data: {
        name: 'Dr. James Park',
        email: 'james.park@growtherapy.com',
        bio: 'Psychiatrist with expertise in mood disorders, ADHD, and psychopharmacology. Offers both medication management and talk therapy.',
        specialties: 'ADHD,Mood Disorders,Psychiatry,Medication Management',
        insuranceAccepted: 'Aetna,Cigna,UnitedHealth',
        hourlyRate: 180,
        profileImage: 'https://randomuser.me/api/portraits/men/75.jpg',
      },
    }),
    prisma.therapist.create({
      data: {
        name: 'Dr. Linda Thompson',
        email: 'linda.thompson@growtherapy.com',
        bio: 'Grief counselor and trauma specialist. 15 years helping individuals navigate loss, PTSD, and major life changes with compassion.',
        specialties: 'Grief,Trauma,PTSD,Mindfulness',
        insuranceAccepted: 'BlueCross,Aetna,Cigna',
        hourlyRate: 135,
        profileImage: 'https://randomuser.me/api/portraits/women/22.jpg',
      },
    }),
  ]);

  // Seed Insurance Plans
  const insurancePlans = await Promise.all([
    prisma.insurancePlan.create({
      data: {
        name: 'Aetna PPO',
        provider: 'Aetna',
        coversMentalHealth: true,
        copayAmount: 30,
        coveragePercent: 80,
        maxSessionsPerYear: 30,
      },
    }),
    prisma.insurancePlan.create({
      data: {
        name: 'BlueCross BlueShield',
        provider: 'BlueCross',
        coversMentalHealth: true,
        copayAmount: 25,
        coveragePercent: 85,
        maxSessionsPerYear: 40,
      },
    }),
    prisma.insurancePlan.create({
      data: {
        name: 'UnitedHealth Choice',
        provider: 'UnitedHealth',
        coversMentalHealth: true,
        copayAmount: 35,
        coveragePercent: 75,
        maxSessionsPerYear: 25,
      },
    }),
  ]);

  // Seed Patients
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        name: 'Alex Rivera',
        email: 'alex.rivera@email.com',
        phone: '555-0101',
        dateOfBirth: new Date('1990-05-15'),
      },
    }),
    prisma.patient.create({
      data: {
        name: 'Jordan Kim',
        email: 'jordan.kim@email.com',
        phone: '555-0102',
        dateOfBirth: new Date('1985-08-22'),
      },
    }),
    prisma.patient.create({
      data: {
        name: 'Taylor Morgan',
        email: 'taylor.morgan@email.com',
        phone: '555-0103',
        dateOfBirth: new Date('1995-02-10'),
      },
    }),
  ]);

  // Seed Appointments (10 slots)
  const now = new Date();
  const appointmentData = [
    { therapist: therapists[0], patient: patients[0], daysFromNow: 1, hour: 10, status: 'scheduled' },
    { therapist: therapists[0], patient: patients[1], daysFromNow: 2, hour: 14, status: 'scheduled' },
    { therapist: therapists[1], patient: patients[0], daysFromNow: 1, hour: 11, status: 'scheduled' },
    { therapist: therapists[2], patient: patients[2], daysFromNow: 3, hour: 9, status: 'scheduled' },
    { therapist: therapists[3], patient: patients[1], daysFromNow: 4, hour: 15, status: 'scheduled' },
    { therapist: therapists[4], patient: patients[2], daysFromNow: 2, hour: 10, status: 'completed' },
    { therapist: therapists[0], patient: patients[0], daysFromNow: -1, hour: 13, status: 'completed' },
    { therapist: therapists[1], patient: patients[1], daysFromNow: -2, hour: 16, status: 'completed' },
    { therapist: therapists[2], patient: patients[0], daysFromNow: 5, hour: 11, status: 'scheduled' },
    { therapist: therapists[3], patient: patients[2], daysFromNow: 6, hour: 14, status: 'scheduled' },
  ];

  for (const apt of appointmentData) {
    const appointment = await prisma.appointment.create({
      data: {
        therapistId: apt.therapist.id,
        patientId: apt.patient.id,
        dateTime: new Date(now.getTime() + apt.daysFromNow * 24 * 60 * 60 * 1000 + apt.hour * 60 * 60 * 1000),
        durationMins: 50,
        status: apt.status,
        type: 'therapy',
      },
    });

    // Create billing for completed appointments
    if (apt.status === 'completed') {
      const insurancePlan = insurancePlans[0];
      const totalAmount = apt.therapist.hourlyRate;
      const copayAmount = insurancePlan.copayAmount;
      const insuranceCoverage = (totalAmount - copayAmount) * (insurancePlan.coveragePercent / 100);
      const amountDue = copayAmount;

      await prisma.billing.create({
        data: {
          appointmentId: appointment.id,
          patientId: apt.patient.id,
          insurancePlanId: insurancePlan.id,
          totalAmount,
          copayAmount,
          insuranceCoverage,
          amountDue,
          status: 'submitted',
        },
      });
    }
  }

  console.log('✅ Seed data created successfully');
  console.log(`   - ${therapists.length} therapists`);
  console.log(`   - ${insurancePlans.length} insurance plans`);
  console.log(`   - ${patients.length} patients`);
  console.log(`   - ${appointmentData.length} appointments`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
