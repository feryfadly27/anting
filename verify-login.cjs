const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
    const user = await p.user.findUnique({ where: { email: 'siti@parent.com' } });
    if (!user) { console.log('USER NOT FOUND'); return; }
    console.log('Email:', user.email);
    console.log('Hash stored:', user.password.substring(0, 20) + '...');
    const ok = await bcrypt.compare('password123', user.password);
    console.log('password123 valid:', ok);
    await p.$disconnect();
})();
