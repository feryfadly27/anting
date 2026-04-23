import {
    getPuskesmasStats,
    getAllWilayah,
    getStatsByWilayah,
    getMonthlyPrevalensi,
    getAllKaders,
    getAllAnakForPuskesmas,
    createKader,
    updateKader,
    deleteKader,
    getExportData,
} from "~/db/services/puskesmas.service";
import { getAuthUser } from "~/utils/auth.server";

export async function loader({ request }: { request: Request }) {
    const user = await getAuthUser(request);
    if (!user || user.role !== "puskesmas") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const action = url.searchParams.get("action");

    try {
        if (action === "stats") {
            return Response.json(await getPuskesmasStats());
        }
        if (action === "wilayah") {
            return Response.json(await getAllWilayah());
        }
        if (action === "wilayah-stats") {
            const filter = url.searchParams.get("filter") || undefined;
            return Response.json(await getStatsByWilayah(filter));
        }
        if (action === "monthly") {
            const months = parseInt(url.searchParams.get("months") || "6");
            return Response.json(await getMonthlyPrevalensi(months));
        }
        if (action === "kaders") {
            return Response.json(await getAllKaders());
        }
        if (action === "anak") {
            return Response.json(await getAllAnakForPuskesmas());
        }
        if (action === "export") {
            return Response.json(await getExportData());
        }

        // Default: return all data
        const [stats, wilayahList, wilayahStats, monthlyData, kaders] = await Promise.all([
            getPuskesmasStats(),
            getAllWilayah(),
            getStatsByWilayah(),
            getMonthlyPrevalensi(6),
            getAllKaders(),
        ]);
        return Response.json({ stats, wilayahList, wilayahStats, monthlyData, kaders });
    } catch (error) {
        console.error("Puskesmas dashboard API error:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function action({ request }: { request: Request }) {
    const user = await getAuthUser(request);
    if (!user || user.role !== "puskesmas") {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const intent = formData.get("intent") as string;

    try {
        if (intent === "create-kader") {
            const data = JSON.parse(formData.get("data") as string);
            const result = await createKader(data);
            return Response.json(result);
        }
        if (intent === "update-kader") {
            const id = formData.get("id") as string;
            const data = JSON.parse(formData.get("data") as string);
            const result = await updateKader(id, data);
            return Response.json(result);
        }
        if (intent === "delete-kader") {
            const id = formData.get("id") as string;
            await deleteKader(id);
            return Response.json({ success: true });
        }

        return Response.json({ error: "Unknown intent" }, { status: 400 });
    } catch (error) {
        console.error("Puskesmas dashboard action error:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
