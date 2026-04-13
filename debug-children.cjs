const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const children = await prisma.anak.findMany({
        include: {
            user: {
                include: {
                    wilayah: true
                }
            }
        }
    });

    console.log('Children found:', children.length);
    children.forEach(c => {
        console.log(`Child: ${c.nama}, ID: ${c.id}`);
        console.log(`Parent: ${c.user.email}, Role: ${c.user.role}, Wilayah: ${c.user.wilayah?.nama_wilayah || 'None'} (ID: ${c.user.wilayah_id})`);
    });

    const kaders = await prisma.user.findMany({
        where: { role: 'kader' },
        include: { wilayah: true }
    });

    console.log('\nKaders found:', kaders.length);
    kaders.forEach(k => {
        console.log(`Kader: ${k.name}, Email: ${k.email}, Wilayah: ${k.wilayah?.nama_wilayah || 'None'} (ID: ${k.wilayah_id})`);
    });

    await prisma.$disconnect();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
