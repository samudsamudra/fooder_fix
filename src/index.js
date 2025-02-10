const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Example query: Fetch all users
  const allUsers = await prisma.user.findMany();
  console.log(allUsers);
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
