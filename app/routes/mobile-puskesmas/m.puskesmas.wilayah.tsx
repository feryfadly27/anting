import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/m.puskesmas.wilayah";
import { getCurrentUser } from "~/utils/auth";
import { toast } from "~/hooks/use-toast";
import { MobilePuskesmasNav } from "~/components/mobile-puskesmas-nav";
import styles from "./m.puskesmas.wilayah.module.css";

type WilayahStats = {
  wilayah_id: string;
  nama_wilayah: string;
  totalBalita: number;
  stuntingCount: number;
  prevalensi: number;
};

const puskesmasApi = {
  fetchWithError: async (url: string) => {
    const r = await fetch(url);
    if (!r.ok) {
      const err = await r.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(err.error || `HTTP ${r.status}`);
    }
    return r.json();
  },
  getWilayahStats: () => puskesmasApi.fetchWithError("/api/puskesmas/dashboard?action=wilayah-stats"),
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Wilayah - Puskesmas Anting" },
    { name: "description", content: "Ringkasan wilayah kerja puskesmas" },
  ];
}

export default function MobilePuskesmasWilayahPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [wilayahStats, setWilayahStats] = useState<WilayahStats[]>([]);

  const sorted = useMemo(() => {
    return [...wilayahStats].sort((a, b) => b.prevalensi - a.prevalensi);
  }, [wilayahStats]);

  const loadData = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const data = await puskesmasApi.getWilayahStats();
      setWilayahStats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setLoadError("Gagal memuat data wilayah.");
      toast({ title: "Error", description: "Gagal memuat data wilayah", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    getCurrentUser().then((user) => {
      if (!mounted) return;
      if (!user || user.role !== "puskesmas") {
        navigate("/login", { replace: true });
        return;
      }
      loadData();
    });
    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Wilayah</h1>
        <button className={styles.refreshBtn} type="button" onClick={loadData}>
          Refresh
        </button>
      </header>

      <main className={styles.main}>
        {loading ? (
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} />
          </div>
        ) : loadError ? (
          <section className={styles.errorCard}>
            <p>{loadError}</p>
          </section>
        ) : sorted.length === 0 ? (
          <section className={styles.emptyCard}>
            <p>Belum ada data wilayah.</p>
          </section>
        ) : (
          <section className={styles.list}>
            {sorted.map((w) => (
              <article key={w.wilayah_id} className={styles.item}>
                <div>
                  <h2 className={styles.itemTitle}>{w.nama_wilayah}</h2>
                  <p className={styles.itemSub}>
                    {w.totalBalita} balita • {w.stuntingCount} stunting
                  </p>
                </div>
                <span className={styles.badge}>{w.prevalensi.toFixed(1)}%</span>
              </article>
            ))}
          </section>
        )}
      </main>

      <MobilePuskesmasNav />
    </div>
  );
}
