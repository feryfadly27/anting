import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 0. Seed WHO reference data used for z-score calculations
  const whoData = [
    // TB/U Boys
    { jenis_kelamin: "laki_laki", umur_bulan: 0, indikator: "TB/U", l: 1, m: 49.9, s: 0.038 },
    { jenis_kelamin: "laki_laki", umur_bulan: 6, indikator: "TB/U", l: 1, m: 67.6, s: 0.039 },
    { jenis_kelamin: "laki_laki", umur_bulan: 12, indikator: "TB/U", l: 1, m: 75.7, s: 0.038 },
    { jenis_kelamin: "laki_laki", umur_bulan: 24, indikator: "TB/U", l: 1, m: 87.1, s: 0.039 },
    { jenis_kelamin: "laki_laki", umur_bulan: 36, indikator: "TB/U", l: 1, m: 96.1, s: 0.04 },
    { jenis_kelamin: "laki_laki", umur_bulan: 48, indikator: "TB/U", l: 1, m: 103.3, s: 0.041 },
    { jenis_kelamin: "laki_laki", umur_bulan: 60, indikator: "TB/U", l: 1, m: 110.0, s: 0.042 },

    // TB/U Girls
    { jenis_kelamin: "perempuan", umur_bulan: 0, indikator: "TB/U", l: 1, m: 49.1, s: 0.038 },
    { jenis_kelamin: "perempuan", umur_bulan: 6, indikator: "TB/U", l: 1, m: 65.7, s: 0.039 },
    { jenis_kelamin: "perempuan", umur_bulan: 12, indikator: "TB/U", l: 1, m: 74.0, s: 0.038 },
    { jenis_kelamin: "perempuan", umur_bulan: 24, indikator: "TB/U", l: 1, m: 85.7, s: 0.039 },
    { jenis_kelamin: "perempuan", umur_bulan: 36, indikator: "TB/U", l: 1, m: 95.1, s: 0.04 },
    { jenis_kelamin: "perempuan", umur_bulan: 48, indikator: "TB/U", l: 1, m: 102.7, s: 0.041 },
    { jenis_kelamin: "perempuan", umur_bulan: 60, indikator: "TB/U", l: 1, m: 109.4, s: 0.042 },

    // BB/U Boys
    { jenis_kelamin: "laki_laki", umur_bulan: 0, indikator: "BB/U", l: 0.3487, m: 3.3, s: 0.146 },
    { jenis_kelamin: "laki_laki", umur_bulan: 12, indikator: "BB/U", l: -0.1493, m: 9.6, s: 0.108 },
    { jenis_kelamin: "laki_laki", umur_bulan: 24, indikator: "BB/U", l: -0.1601, m: 12.2, s: 0.108 },
    { jenis_kelamin: "laki_laki", umur_bulan: 60, indikator: "BB/U", l: 0.0412, m: 18.3, s: 0.127 },

    // BB/U Girls
    { jenis_kelamin: "perempuan", umur_bulan: 0, indikator: "BB/U", l: 0.4349, m: 3.2, s: 0.141 },
    { jenis_kelamin: "perempuan", umur_bulan: 12, indikator: "BB/U", l: -0.1852, m: 8.9, s: 0.11 },
    { jenis_kelamin: "perempuan", umur_bulan: 24, indikator: "BB/U", l: -0.2144, m: 11.5, s: 0.111 },
    { jenis_kelamin: "perempuan", umur_bulan: 60, indikator: "BB/U", l: -0.0125, m: 18.2, s: 0.14 },

    // BB/TB Boys
    { jenis_kelamin: "laki_laki", umur_bulan: 0, indikator: "BB/TB", tinggi_cm: 50, l: -0.3128, m: 3.3, s: 0.134 },
    { jenis_kelamin: "laki_laki", umur_bulan: 0, indikator: "BB/TB", tinggi_cm: 75, l: -0.3128, m: 9.5, s: 0.11 },
    { jenis_kelamin: "laki_laki", umur_bulan: 0, indikator: "BB/TB", tinggi_cm: 100, l: -0.3128, m: 15.6, s: 0.105 },

    // BB/TB Girls
    { jenis_kelamin: "perempuan", umur_bulan: 0, indikator: "BB/TB", tinggi_cm: 50, l: -0.3521, m: 3.2, s: 0.131 },
    { jenis_kelamin: "perempuan", umur_bulan: 0, indikator: "BB/TB", tinggi_cm: 75, l: -0.3521, m: 8.9, s: 0.112 },
    { jenis_kelamin: "perempuan", umur_bulan: 0, indikator: "BB/TB", tinggi_cm: 100, l: -0.3521, m: 15.2, s: 0.114 },
  ] as const;

  await prisma.whoReference.deleteMany();
  await prisma.whoReference.createMany({ data: whoData as any[] });
  console.log("✅ WHO reference seeded.");

  // 1. Seed Wilayah
  const wilayahIds = {
    puskesmas: "puskesmas-id-1",
    desa1: "desa-id-1",
    desa2: "desa-id-2",
    desa3: "desa-id-3",
    kelurahan1: "kelurahan-id-1",
    kelurahan2: "kelurahan-id-2",
  };

  await prisma.wilayah.upsert({
    where: { id: wilayahIds.puskesmas },
    update: {},
    create: {
      id: wilayahIds.puskesmas,
      nama_wilayah: "Puskesmas Banting",
      tipe: "puskesmas",
    },
  });

  await prisma.wilayah.upsert({
    where: { id: wilayahIds.desa1 },
    update: {},
    create: {
      id: wilayahIds.desa1,
      nama_wilayah: "Desa Banting Kidul",
      tipe: "desa",
    },
  });

  await prisma.wilayah.upsert({
    where: { id: wilayahIds.desa2 },
    update: {},
    create: {
      id: wilayahIds.desa2,
      nama_wilayah: "Desa Banting Utara",
      tipe: "desa",
    },
  });

  await prisma.wilayah.upsert({
    where: { id: wilayahIds.desa3 },
    update: {},
    create: {
      id: wilayahIds.desa3,
      nama_wilayah: "Desa Banting Timur",
      tipe: "desa",
    },
  });

  await prisma.wilayah.upsert({
    where: { id: wilayahIds.kelurahan1 },
    update: {},
    create: {
      id: wilayahIds.kelurahan1,
      nama_wilayah: "Kelurahan Banting Barat",
      tipe: "kelurahan",
    },
  });

  await prisma.wilayah.upsert({
    where: { id: wilayahIds.kelurahan2 },
    update: {},
    create: {
      id: wilayahIds.kelurahan2,
      nama_wilayah: "Kelurahan Banting Tengah",
      tipe: "kelurahan",
    },
  });

  console.log("✅ Wilayah seeded.");

  // 2. Seed Users
  const users = [
    {
      name: "Admin Puskesmas",
      email: "budi@puskesmas.com",
      password: "puskesmas123", // In prod, use bcrypt!
      role: "puskesmas",
      wilayah_id: wilayahIds.puskesmas,
    },
    {
      name: "Kader Aminah",
      email: "aminah@cadre.com",
      password: "cadre123",
      role: "kader",
      wilayah_id: wilayahIds.desa1,
    },
    {
      name: "Siti (Orang Tua)",
      email: "siti@parent.com",
      password: "parent123",
      role: "orang_tua",
      wilayah_id: wilayahIds.desa1,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user as any,
    });
  }

  console.log("✅ Users seeded.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
