import { prisma } from './prisma';

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Yash Doke",
      email: "yash@example.com",
      password: "test123", // for testing, plain text is fine; later hash it
    },
  });

  console.log("User created:", user);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
