const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const whoCount = await prisma.whoReference.count();
    const growthCount = await prisma.pertumbuhan.count();
    const latestGrowth = await prisma.pertumbuhan.findFirst({
        orderBy: { created_at: 'desc' }
    });
    const anakCount = await prisma.anak.count();
    const userCount = await prisma.user.count();

    console.log('WHO Reference count:', whoCount);
    console.log('Pertumbuhan count:', growthCount);
    console.log('Anak count:', anakCount);
    console.log('User count:', userCount);

    if (latestGrowth) {
        console.log('Latest Pertumbuhan data:', JSON.stringify(latestGrowth, null, 2));
    } else {
        console.log('No Pertumbuhan data found.');
    }

    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
