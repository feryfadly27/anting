import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/m.puskesmas.kader";
import { getCurrentUser } from "~/utils/auth";
import { toast } from "~/hooks/use-toast";
import { MobilePuskesmasNav } from "~/components/mobile-puskesmas-nav";
import styles from "./m.puskesmas.kader.module.css";

type KaderItem = {
  id: string;
  name: string;
  email: string;
  wilayah_name: string | null;
  totalBalita: number;
  totalPemeriksaan: number;
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
  getKaders: () => puskesmasApi.fetchWithError("/api/puskesmas/dashboard?action=kaders"),
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Kader - Puskesmas Anting" },
    { name: "description", content: "Daftar kader posyandu pada puskesmas" },
  ];
}

export default function MobilePuskesmasKaderPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [kaders, setKaders] = useState<KaderItem[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const data = await puskesmasApi.getKaders();
      setKaders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setLoadError("Gagal memuat data kader.");
      toast({ title: "Error", description: "Gagal memuat data kader", variant: "destructive" });
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
        <h1 className={styles.title}>Kader</h1>
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
        ) : kaders.length === 0 ? (
          <section className={styles.emptyCard}>
            <p>Belum ada data kader.</p>
          </section>
        ) : (
          <section className={styles.list}>
            {kaders.map((kader) => (
              <article key={kader.id} className={styles.item}>
                <div>
                  <h2 className={styles.itemTitle}>{kader.name}</h2>
                  <p className={styles.itemSub}>{kader.wilayah_name || "Wilayah tidak tersedia"}</p>
                  <p className={styles.itemMeta}>{kader.email}</p>
                </div>
                <div className={styles.metrics}>
                  <span>{kader.totalBalita} balita</span>
                  <span>{kader.totalPemeriksaan} pemeriksaan</span>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <MobilePuskesmasNav />
    </div>
  );
}
