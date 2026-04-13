import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Seed Wilayah
    const wilayahIds = {
        puskesmas: 'puskesmas-id-1',
        desa1: 'desa-id-1',
        desa2: 'desa-id-2',
    };

    await prisma.wilayah.upsert({
        where: { id: wilayahIds.puskesmas },
        update: {},
        create: {
            id: wilayahIds.puskesmas,
            nama_wilayah: 'Puskesmas Banting',
            tipe: 'puskesmas',
        },
    });

    await prisma.wilayah.upsert({
        where: { id: wilayahIds.desa1 },
        update: {},
        create: {
            id: wilayahIds.desa1,
            nama_wilayah: 'Desa Banting Kidul',
            tipe: 'desa',
        },
    });

    console.log('✅ Wilayah seeded.');

    // 2. Seed Users
    const users = [
        {
            name: 'Admin Puskesmas',
            email: 'budi@puskesmas.com',
            password: 'puskesmas123', // In prod, use bcrypt!
            role: 'puskesmas',
            wilayah_id: wilayahIds.puskesmas,
        },
        {
            name: 'Kader Aminah',
            email: 'aminah@cadre.com',
            password: 'cadre123',
            role: 'kader',
            wilayah_id: wilayahIds.desa1,
        },
        {
            name: 'Siti (Orang Tua)',
            email: 'siti@parent.com',
            password: 'parent123',
            role: 'orang_tua',
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

    console.log('✅ Users seeded.');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
