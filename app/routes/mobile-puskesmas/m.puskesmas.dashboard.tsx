import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/m.puskesmas.dashboard";
import { getCurrentUser, logout } from "~/utils/auth";
import { toast } from "~/hooks/use-toast";
import { MobilePuskesmasNav } from "~/components/mobile-puskesmas-nav";
import styles from "./m.puskesmas.dashboard.module.css";

type PuskesmasStats = {
  totalBalita: number;
  totalKader: number;
  totalWilayah: number;
  stuntingCount: number;
  underweightCount: number;
  wastedCount: number;
  normalCount: number;
  prevalensiStunting: number;
  cakupanPemeriksaan: number;
};

type WilayahStats = {
  wilayah_id: string;
  nama_wilayah: string;
  totalBalita: number;
  stuntingCount: number;
  prevalensi: number;
};

type KaderItem = {
  id: string;
  name: string;
  email: string;
  wilayah?: { nama_wilayah: string } | null;
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
  getStats: () => puskesmasApi.fetchWithError("/api/puskesmas/dashboard?action=stats"),
  getWilayahStats: () => puskesmasApi.fetchWithError("/api/puskesmas/dashboard?action=wilayah-stats"),
  getKaders: () => puskesmasApi.fetchWithError("/api/puskesmas/dashboard?action=kaders"),
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Beranda Puskesmas - Anting" },
    { name: "description", content: "Dashboard mobile untuk puskesmas di Anting" },
  ];
}

export default function MobilePuskesmasDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Puskesmas");
  const [stats, setStats] = useState<PuskesmasStats | null>(null);
  const [wilayahStats, setWilayahStats] = useState<WilayahStats[]>([]);
  const [kaders, setKaders] = useState<KaderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const topWilayah = useMemo(() => {
    return [...wilayahStats].sort((a, b) => b.prevalensi - a.prevalensi).slice(0, 5);
  }, [wilayahStats]);

  const loadData = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const [statsData, wilayahData, kadersData] = await Promise.all([
        puskesmasApi.getStats(),
        puskesmasApi.getWilayahStats(),
        puskesmasApi.getKaders(),
      ]);
      setStats(statsData);
      setWilayahStats(Array.isArray(wilayahData) ? wilayahData : []);
      setKaders(Array.isArray(kadersData) ? kadersData : []);
    } catch (error) {
      console.error(error);
      setLoadError("Gagal memuat data puskesmas. Coba lagi.");
      toast({ title: "Error", description: "Gagal memuat data", variant: "destructive" });
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
      if (user.name) setUserName(user.name);
      loadData();
    });
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  if (loading && !stats) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (loadError && !stats) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <section className={styles.errorCard}>
            <p>{loadError}</p>
            <button type="button" className={styles.primaryBtn} onClick={loadData}>
              Coba Lagi
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerAvatar}>
          <span className={styles.iconFilled}>local_hospital</span>
        </div>
        <div className={styles.headerInfo}>
          <h1 className={styles.headerName}>Halo, {userName}</h1>
          <p className={styles.headerSub}>Ringkasan layanan wilayah puskesmas</p>
        </div>
        <button type="button" className={styles.headerBtn} onClick={handleLogout} aria-label="Logout">
          <span className={styles.icon}>logout</span>
        </button>
      </header>

      <main className={styles.main}>
        <section className={styles.statsGrid}>
          <article className={styles.statCard}>
            <p className={styles.statLabel}>Total Balita</p>
            <p className={styles.statValue}>{stats?.totalBalita ?? 0}</p>
          </article>
          <article className={styles.statCard}>
            <p className={styles.statLabel}>Total Kader</p>
            <p className={styles.statValue}>{stats?.totalKader ?? 0}</p>
          </article>
          <article className={styles.statCard}>
            <p className={styles.statLabel}>Prevalensi Stunting</p>
            <p className={styles.statValue}>{(stats?.prevalensiStunting ?? 0).toFixed(1)}%</p>
          </article>
          <article className={styles.statCard}>
            <p className={styles.statLabel}>Cakupan Pemeriksaan</p>
            <p className={styles.statValue}>{(stats?.cakupanPemeriksaan ?? 0).toFixed(1)}%</p>
          </article>
        </section>

        <section className={styles.sectionCard}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Wilayah Prioritas</h2>
            <button type="button" className={styles.linkBtn} onClick={loadData}>
              Refresh
            </button>
          </div>
          {topWilayah.length === 0 ? (
            <p className={styles.emptyText}>Belum ada data wilayah.</p>
          ) : (
            <div className={styles.list}>
              {topWilayah.map((w) => (
                <div key={w.wilayah_id} className={styles.listItem}>
                  <div>
                    <p className={styles.itemTitle}>{w.nama_wilayah}</p>
                    <p className={styles.itemSub}>
                      {w.totalBalita} balita • {w.stuntingCount} stunting
                    </p>
                  </div>
                  <span className={styles.badge}>{w.prevalensi.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Kader Aktif</h2>
          {kaders.length === 0 ? (
            <p className={styles.emptyText}>Belum ada data kader.</p>
          ) : (
            <div className={styles.list}>
              {kaders.slice(0, 6).map((kader) => (
                <div key={kader.id} className={styles.listItem}>
                  <div>
                    <p className={styles.itemTitle}>{kader.name}</p>
                    <p className={styles.itemSub}>{kader.wilayah?.nama_wilayah || "Wilayah tidak tersedia"}</p>
                  </div>
                  <span className={styles.itemMeta}>{kader.email}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <Link to="/puskesmas/dashboard" className={styles.desktopLink}>
          Buka Dashboard Lengkap
        </Link>
      </main>
      <MobilePuskesmasNav />
    </div>
  );
}
