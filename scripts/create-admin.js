const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const email = args[0] || process.env.ADMIN_EMAIL;
  const password = args[1] || process.env.ADMIN_PASSWORD;
  const name = args[2] || 'MMG Owner';
  const role = args[3] || 'ADMIN';

  if (!email || !password) {
    console.error('Usage: node scripts/create-admin.js <email> <password> [name] [role]');
    console.error('Or set ADMIN_EMAIL and ADMIN_PASSWORD environment variables.');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email: email.toLowerCase().trim() },
    update: {
      password: hashedPassword,
      role: role,
      name: name,
    },
    create: {
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: name,
      phone: '+91 98290 12345',
      role: role,
      staffProfile: {
        create: {
          role: role,
          department: 'Executive Administration',
          permissions: 'all',
        },
      },
    },
  });

  console.log(`Administrator account successfully provisioned:`);
  console.log(`- Name: ${user.name}`);
  console.log(`- Email: ${user.email}`);
  console.log(`- Role: ${user.role}`);
}

main()
  .catch((e) => {
    console.error('Error creating admin:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
