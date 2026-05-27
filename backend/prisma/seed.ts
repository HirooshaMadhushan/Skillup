import { PrismaClient, RoleType, VerificationStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Seed Roles
  console.log('Upserting roles...');
  const roles = Object.values(RoleType);
  const roleRecords: Record<string, any> = {};

  for (const roleName of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
    roleRecords[roleName] = role;
  }

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // 2. Seed Admin User
  console.log('Seeding Admin...');
  await prisma.user.upsert({
    where: { email: 'admin@skillup.com' },
    update: {},
    create: {
      email: 'admin@skillup.com',
      password: hashedPassword,
      fullName: 'System Admin',
      isVerified: true,
      userRoles: {
        create: {
          roleId: roleRecords[RoleType.ADMIN].id,
        },
      },
    },
  });

  // 3. Seed Learner User + Profile
  console.log('Seeding Learner...');
  await prisma.user.upsert({
    where: { email: 'learner@skillup.com' },
    update: {},
    create: {
      email: 'learner@skillup.com',
      password: hashedPassword,
      fullName: 'John Learner',
      userRoles: {
        create: {
          roleId: roleRecords[RoleType.LEARNER].id,
        },
      },
      learnerProfile: {
        create: {
          interests: 'Web Development, UI/UX Design',
          learningGoals: 'Become a Full Stack Developer',
        },
      },
    },
  });

  // 4. Seed Tutor User + Profile
  console.log('Seeding Tutor...');
  await prisma.user.upsert({
    where: { email: 'tutor@skillup.com' },
    update: {},
    create: {
      email: 'tutor@skillup.com',
      password: hashedPassword,
      fullName: 'Jane Tutor',
      userRoles: {
        create: {
          roleId: roleRecords[RoleType.TUTOR].id,
        },
      },
      tutorProfile: {
        create: {
          expertise: 'Node.js, React, Prisma',
          qualification: 'Senior Software Engineer',
          experience: 8,
          hourlyRate: 50.0,
          verificationStatus: VerificationStatus.APPROVED,
        },
      },
    },
  });

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
