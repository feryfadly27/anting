const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding WHO Reference data (Subset for testing)...');

    const whoData = [
        // TB/U Boys
        { jenis_kelamin: 'laki_laki', umur_bulan: 0, indikator: 'TB/U', l: 1, m: 49.9, s: 0.038 },
        { jenis_kelamin: 'laki_laki', umur_bulan: 6, indikator: 'TB/U', l: 1, m: 67.6, s: 0.039 },
        { jenis_kelamin: 'laki_laki', umur_bulan: 12, indikator: 'TB/U', l: 1, m: 75.7, s: 0.038 },
        { jenis_kelamin: 'laki_laki', umur_bulan: 24, indikator: 'TB/U', l: 1, m: 87.1, s: 0.039 },
        { jenis_kelamin: 'laki_laki', umur_bulan: 36, indikator: 'TB/U', l: 1, m: 96.1, s: 0.040 },
        { jenis_kelamin: 'laki_laki', umur_bulan: 48, indikator: 'TB/U', l: 1, m: 103.3, s: 0.041 },
        { jenis_kelamin: 'laki_laki', umur_bulan: 60, indikator: 'TB/U', l: 1, m: 110.0, s: 0.042 },

        // TB/U Girls
        { jenis_kelamin: 'perempuan', umur_bulan: 0, indikator: 'TB/U', l: 1, m: 49.1, s: 0.038 },
        { jenis_kelamin: 'perempuan', umur_bulan: 6, indikator: 'TB/U', l: 1, m: 65.7, s: 0.039 },
        { jenis_kelamin: 'perempuan', umur_bulan: 12, indikator: 'TB/U', l: 1, m: 74.0, s: 0.038 },
        { jenis_kelamin: 'perempuan', umur_bulan: 24, indikator: 'TB/U', l: 1, m: 85.7, s: 0.039 },
        { jenis_kelamin: 'perempuan', umur_bulan: 36, indikator: 'TB/U', l: 1, m: 95.1, s: 0.040 },
        { jenis_kelamin: 'perempuan', umur_bulan: 48, indikator: 'TB/U', l: 1, m: 102.7, s: 0.041 },
        { jenis_kelamin: 'perempuan', umur_bulan: 60, indikator: 'TB/U', l: 1, m: 109.4, s: 0.042 },

        // BB/U Boys
        { jenis_kelamin: 'laki_laki', umur_bulan: 0, indikator: 'BB/U', l: 0.3487, m: 3.3, s: 0.146 },
        { jenis_kelamin: 'laki_laki', umur_bulan: 12, indikator: 'BB/U', l: -0.1493, m: 9.6, s: 0.108 },
        { jenis_kelamin: 'laki_laki', umur_bulan: 24, indikator: 'BB/U', l: -0.1601, m: 12.2, s: 0.108 },
        { jenis_kelamin: 'laki_laki', umur_bulan: 60, indikator: 'BB/U', l: 0.0412, m: 18.3, s: 0.127 },

        // BB/U Girls
        { jenis_kelamin: 'perempuan', umur_bulan: 0, indikator: 'BB/U', l: 0.4349, m: 3.2, s: 0.141 },
        { jenis_kelamin: 'perempuan', umur_bulan: 12, indikator: 'BB/U', l: -0.1852, m: 8.9, s: 0.110 },
        { jenis_kelamin: 'perempuan', umur_bulan: 24, indikator: 'BB/U', l: -0.2144, m: 11.5, s: 0.111 },
        { jenis_kelamin: 'perempuan', umur_bulan: 60, indikator: 'BB/U', l: -0.0125, m: 18.2, s: 0.140 },

        // BB/TB Boys (Weight-for-Height)
        { jenis_kelamin: 'laki_laki', umur_bulan: 0, indikator: 'BB/TB', tinggi_cm: 50, l: -0.3128, m: 3.3, s: 0.134 },
        { jenis_kelamin: 'laki_laki', umur_bulan: 0, indikator: 'BB/TB', tinggi_cm: 75, l: -0.3128, m: 9.5, s: 0.110 },
        { jenis_kelamin: 'laki_laki', umur_bulan: 0, indikator: 'BB/TB', tinggi_cm: 100, l: -0.3128, m: 15.6, s: 0.105 },

        // BB/TB Girls
        { jenis_kelamin: 'perempuan', umur_bulan: 0, indikator: 'BB/TB', tinggi_cm: 50, l: -0.3521, m: 3.2, s: 0.131 },
        { jenis_kelamin: 'perempuan', umur_bulan: 0, indikator: 'BB/TB', tinggi_cm: 75, l: -0.3521, m: 8.9, s: 0.112 },
        { jenis_kelamin: 'perempuan', umur_bulan: 0, indikator: 'BB/TB', tinggi_cm: 100, l: -0.3521, m: 15.2, s: 0.114 },
    ];

    for (const item of whoData) {
        await prisma.whoReference.create({
            data: item
        });
    }

    console.log('✅ Seeding complete!');
    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
