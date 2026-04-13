const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding 3 additional parents and children...');

    const wilayah = await prisma.wilayah.findFirst({
        where: { tipe: 'desa' }
    });

    if (!wilayah) {
        console.error('❌ Wilayah desa tidak ditemukan!');
        return;
    }

    const hashedPassword = await bcrypt.hash('password123', 10);

    const dataToSeed = [
        {
            parentName: 'Siti Aminah',
            parentEmail: 'siti.aminah@parent.com',
            childName: 'Rama Aminah',
            childDob: new Date('2025-01-10T00:00:00Z'),
            childGender: 'laki_laki'
        },
        {
            parentName: 'Andi Saputra',
            parentEmail: 'andi.saputra@parent.com',
            childName: 'Bima Saputra',
            childDob: new Date('2023-11-20T00:00:00Z'),
            childGender: 'laki_laki'
        },
        {
            parentName: 'Dewi Lestari',
            parentEmail: 'dewi.lestari@parent.com',
            childName: 'Sari Lestari',
            childDob: new Date('2024-08-05T00:00:00Z'),
            childGender: 'perempuan'
        }
    ];

    for (const data of dataToSeed) {
        const parent = await prisma.user.create({
            data: {
                name: data.parentName,
                email: data.parentEmail,
                password: hashedPassword,
                role: 'orang_tua',
                wilayah_id: wilayah.id,
            }
        });
        console.log(`✅ Parent created: ${parent.name} (${parent.email})`);

        const anak = await prisma.anak.create({
            data: {
                user_id: parent.id,
                nama: data.childName,
                tanggal_lahir: data.childDob,
                jenis_kelamin: data.childGender,
            }
        });
        console.log(`  ✅ Anak created: ${anak.nama}`);
    }

    await prisma.$disconnect();
    console.log('🎉 Selesai menambahkan 3 orang tua dan anak!');
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
