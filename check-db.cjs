const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
    const imun = await p.imunisasi.findMany();
    console.log('Imunisasi count:', imun.length);
    imun.forEach(i => console.log('  ', JSON.stringify(i)));

    const pert = await p.pertumbuhan.findMany();
    console.log('Pertumbuhan count:', pert.length);
    pert.forEach(i => console.log('  ', JSON.stringify(i)));

    await p.$disconnect();
})();
