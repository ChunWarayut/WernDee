import { PrismaClient, Role, Qualification, SpecialCondition } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default shifts
  console.log('📅 Creating default shifts...');
  
  // Check if shifts already exist
  const existingShifts = await prisma.shift.count();
  if (existingShifts === 0) {
    await prisma.shift.createMany({
      data: [
        { name: 'เช้า', start_time: '08:00', end_time: '16:00' },
        { name: 'บ่าย', start_time: '16:00', end_time: '00:00' },
        { name: 'ดึก', start_time: '00:00', end_time: '08:00' },
      ],
    });
  }

  // Create default schedule rules
  console.log('⚙️ Creating default schedule rules...');
  await prisma.scheduleRule.create({
    data: {
      min_nurses_per_shift: 2,
      max_consecutive_days: 5,
    },
  });

  // Create admin user and nurse
  console.log('👨‍💼 Creating admin user...');
  const adminNurse = await prisma.nurse.create({
    data: {
      first_name: 'ผู้ดูแล',
      last_name: 'ระบบ',
      qualification: Qualification.RN,
      special_condition: SpecialCondition.HEAD_NURSE,
    },
  });

  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      username: 'admin',
      password_hash: hashedPassword,
      role: Role.ADMIN,
      nurse_id: adminNurse.id,
    },
  });

  // Create sample nurses
  console.log('👩‍⚕️ Creating sample nurses...');
  const sampleNurses = [
    {
      first_name: 'สมใจ',
      last_name: 'ใจดี',
      qualification: Qualification.RN,
      special_condition: SpecialCondition.SENIOR,
    },
    {
      first_name: 'มาลี',
      last_name: 'สวยงาม',
      qualification: Qualification.RN,
      special_condition: SpecialCondition.NONE,
    },
    {
      first_name: 'วิไล',
      last_name: 'รักษาคน',
      qualification: Qualification.PN,
      special_condition: SpecialCondition.NONE,
    },
    {
      first_name: 'สุดา',
      last_name: 'ช่วยเหลือ',
      qualification: Qualification.RN,
      special_condition: SpecialCondition.NONE,
    },
    {
      first_name: 'นิภา',
      last_name: 'ดูแลดี',
      qualification: Qualification.PN,
      special_condition: SpecialCondition.PREGNANT,
    },
  ];

  for (const nurseData of sampleNurses) {
    const nurse = await prisma.nurse.create({
      data: nurseData,
    });

    // Create user account for each nurse
    const username = `${nurseData.first_name.toLowerCase()}${nurseData.last_name.toLowerCase()}`;
    const password = await bcrypt.hash('password123', 10);
    
    await prisma.user.create({
      data: {
        username: username,
        password_hash: password,
        role: Role.USER,
        nurse_id: nurse.id,
      },
    });
  }

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📝 Default accounts created:');
  console.log('👨‍💼 Admin: username=admin, password=admin123');
  console.log('👩‍⚕️ Sample nurses: password=password123');
  console.log('   - สมใจใจดี (somjaijaidi)');
  console.log('   - มาลีสวยงาม (maleesawiyangam)');
  console.log('   - วิไลรักษาคน (wilairaksakhon)');
  console.log('   - สุดาช่วยเหลือ (sudachuayleau)');
  console.log('   - นิภาดูแลดี (niphadulaedi)');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });