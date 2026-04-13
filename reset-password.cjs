const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const p = new PrismaClient();

(async () => {
    const newPassword = 'password123';
    const hashed = await bcrypt.hash(newPassword, 10);

    const users = await p.user.findMany({ select: { id: true, email: true, name: true, role: true } });

    for (const user of users) {
        await p.user.update({
            where: { id: user.id },
            data: { password: hashed }
        });
        console.log(`Reset: ${user.email} (${user.role})`);
    }

    console.log(`\nSemua password telah direset ke: ${newPassword}`);
    await p.$disconnect();
})();
