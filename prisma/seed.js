const { prisma } = require("../utils/database");
const bcrypt = require("bcrypt");

const main = async () => {
  console.log("seeding started");

  const adminPassword = await bcrypt.hash(
    "admin123",
    parseInt(process.env.SALT_ROUNDS || "10", 10)
  );

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@email.com",
    },
    update: {},
    create: {
      email: "admin@email.com",
      username: "admin",
      firstName: "mr.",
      lastName: "admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("Created admin user", admin);
};

main()
  .catch((error) => {
    console.log("error during seeding", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
