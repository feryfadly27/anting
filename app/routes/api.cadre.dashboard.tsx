import { cadreService } from "~/db/services/cadre.service";
import { getAuthUser } from "~/utils/auth.server";

export async function loader({ request }: { request: Request }) {
    const user = await getAuthUser(request);
    if (!user || user.role !== "kader") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const action = url.searchParams.get("action");
    const wilayahId = url.searchParams.get("wilayahId") || user.wilayah_id || "";

    try {
        if (action === "anak") {
            const data = await cadreService.getAnakByWilayah(wilayahId);
            return Response.json(data);
        }
        if (action === "stats") {
            const data = await cadreService.getCadreStats(wilayahId);
            return Response.json(data);
        }
        if (action === "recaps") {
            const data = await cadreService.getRecentMonthlyRecaps(wilayahId);
            return Response.json(data);
        }

        // Default: return all data
        const [anakList, stats, recaps] = await Promise.all([
            cadreService.getAnakByWilayah(wilayahId),
            cadreService.getCadreStats(wilayahId),
            cadreService.getRecentMonthlyRecaps(wilayahId),
        ]);
        return Response.json({ anakList, stats, recaps, wilayahId });
    } catch (error) {
        console.error("Cadre dashboard API error:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function action({ request }: { request: Request }) {
    const user = await getAuthUser(request);
    if (!user || user.role !== "kader") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const intent = formData.get("intent") as string;

    const { pertumbuhanService } = await import("~/db/services/pertumbuhan.service");
    const { imunisasiService } = await import("~/db/services/imunisasi.service");

    try {
        if (intent === "create-pertumbuhan") {
            const rawData = JSON.parse(formData.get("data") as string);
            const data = {
                anak_id: rawData.anak_id,
                tanggal_pengukuran: new Date(rawData.tanggal_pengukuran),
                berat_badan: Number(rawData.berat_badan),
                tinggi_badan: Number(rawData.tinggi_badan),
            };
            console.log("Cadre creating pertumbuhan with data:", JSON.stringify(data));
            const result = await pertumbuhanService.createPertumbuhan(data);
            console.log("Cadre pertumbuhan created:", result.id);
            return Response.json(result);
        }

        if (intent === "create-imunisasi") {
            const rawData = JSON.parse(formData.get("data") as string);
            const data = {
                anak_id: rawData.anak_id,
                tanggal: new Date(rawData.tanggal),
                nama_vaksin: rawData.nama_imunisasi || rawData.nama_vaksin,
                keterangan: rawData.keterangan || ""
            };
            console.log("Cadre creating imunisasi with data:", data);
            const result = await imunisasiService.createImunisasi(data);
            return Response.json(result);
        }

        return Response.json({ error: "Unknown intent" }, { status: 400 });
    } catch (error) {
        console.error("Cadre dashboard action error:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
