const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Vydhal@112358', 10);
  const user = await prisma.user.upsert({
    where: { email: 'vydhal@gmail.com' },
    update: {
      password,
      role: 'ADMIN',
    },
    create: {
      email: 'vydhal@gmail.com',
      name: 'Admin Vydhal',
      password,
      role: 'ADMIN',
    },
  });
  console.log({ user });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
