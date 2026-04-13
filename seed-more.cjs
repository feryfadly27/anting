const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding additional parent and child data...');

    // Ambil wilayah desa untuk orang tua
    const wilayah = await prisma.wilayah.findFirst({
        where: { tipe: 'desa' }
    });

    if (!wilayah) {
        console.error('❌ Wilayah desa tidak ditemukan!');
        return;
    }

    // Password di-hash
    const hashedPassword = await bcrypt.hash('budi123', 10);

    // Buat Parent
    const parent = await prisma.user.create({
        data: {
            name: 'Budi Santoso (Orang Tua Baru)',
            email: 'budi@parent.com',
            password: hashedPassword,
            role: 'orang_tua',
            wilayah_id: wilayah.id,
        }
    });

    console.log(`✅ Parent created: ${parent.name} (${parent.email})`);

    // Buat Anak
    const anak = await prisma.anak.create({
        data: {
            user_id: parent.id,
            nama: 'Aisyah Santoso',
            tanggal_lahir: new Date('2024-05-15T00:00:00Z'), // Umur ~22 bulan
            jenis_kelamin: 'perempuan',
        }
    });

    console.log(`✅ Anak created: ${anak.nama} (Lahir: ${anak.tanggal_lahir})`);

    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
