const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Get the first child
    const anak = await prisma.anak.findFirst();
    if (!anak) {
        console.log('No child found!');
        return;
    }

    console.log('Child found:', anak.nama, 'ID:', anak.id);
    console.log('Gender:', anak.jenis_kelamin);
    console.log('DOB:', anak.tanggal_lahir);

    // Try to create a pertumbuhan record directly
    try {
        const result = await prisma.pertumbuhan.create({
            data: {
                anak_id: anak.id,
                tanggal_pengukuran: new Date('2026-03-10'),
                berat_badan: 10.5,
                tinggi_badan: 75.0,
                umur_bulan: 12,
            }
        });
        console.log('✅ Created pertumbuhan directly:', result.id);

        // Check count
        const count = await prisma.pertumbuhan.count();
        console.log('Pertumbuhan count now:', count);

        // Read back
        const saved = await prisma.pertumbuhan.findFirst({
            orderBy: { created_at: 'desc' }
        });
        console.log('Latest pertumbuhan:', JSON.stringify(saved, null, 2));
    } catch (e) {
        console.error('❌ Error creating pertumbuhan:', e);
    }

    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
