const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
    try {
        const users = await p.user.findMany({
            select: { id: true, email: true, name: true, role: true }
        });
        console.log('Users found:', users.length);
        users.forEach(u => console.log(`  ${u.role} | ${u.email} | ${u.name}`));
    } catch(e) {
        console.error('Error:', e.message);
    }
    await p.$disconnect();
})();
