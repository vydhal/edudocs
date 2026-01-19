const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function check() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@edudocs.com' } });
  if (!user) {
    console.log('User NOT found');
    return;
  }
  console.log('User found:', user.email);
  console.log('Stored Hash:', user.password);
  
  const isMatch = await bcrypt.compare('admin123', user.password);
  console.log('Password "admin123" match:', isMatch);

  const testHash = await bcrypt.hash('admin123', 10);
  console.log('Test Hash generated now:', testHash);
}

check()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
