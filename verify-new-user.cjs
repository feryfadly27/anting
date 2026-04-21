const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const newUser = await prisma.user.findFirst({
    where: { email: "rini.test@parent.com" },
    include: { wilayah: true },
  });

  console.log("✅ New User Verification:");
  console.log("  Name:", newUser.name);
  console.log("  Email:", newUser.email);
  console.log("  Role:", newUser.role);
  console.log("  Wilayah ID:", newUser.wilayah_id);
  console.log("  Wilayah Name:", newUser.wilayah?.nama_wilayah);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
