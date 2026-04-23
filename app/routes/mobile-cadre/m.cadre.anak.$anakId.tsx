import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { Route } from "./+types/m.cadre.anak.$anakId";
import type { Database } from "~/db/types";
import { getCurrentUser } from "~/utils/auth";
import { toast } from "~/hooks/use-toast";
import { toIndonesianNutritionStatus } from "~/utils/nutrition-status";
import { MobileCadreNav } from "~/components/mobile-cadre-nav";
import { PertumbuhanFormDialog } from "~/components/pertumbuhan-form-dialog";
import { ImunisasiFormDialog } from "~/components/imunisasi-form-dialog";
import styles from "./m.cadre.anak.$anakId.module.css";

type PertumbuhanInsert = Database["public"]["Tables"]["pertumbuhan"]["Insert"];
type ImunisasiInsert = Database["public"]["Tables"]["imunisasi"]["Insert"];

const cadreApi = {
  fetchWithError: async (url: string) => {
    const r = await fetch(url);
    if (!r.ok) {
      const err = await r.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(err.error || `HTTP ${r.status}`);
    }
    return r.json();
  },
  getAnakDetail: (wilayahId: string, anakId: string) =>
    cadreApi.fetchWithError(
      `/api/cadre/dashboard?action=anak-detail&wilayahId=${encodeURIComponent(wilayahId)}&anakId=${encodeURIComponent(anakId)}`
    ),
  submitAction: async (formData: FormData) => {
    const r = await fetch("/api/cadre/dashboard", { method: "POST", body: formData });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(err.error || `HTTP ${r.status}`);
    }
    return r.json();
  },
};

function formatTanggal(tanggal: string) {
  return new Date(tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function calculateAgeMonths(birthDate: string) {
  const birth = new Date(birthDate);
  const now = new Date();
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();
  if (now.getDate() < birth.getDate()) months--;
  return months < 0 ? 0 : months;
}

function needsAttention(anak: any) {
  const p = anak.latest_pertumbuhan;
  if (!p) return false;
  return (
    (p.zscore_tbu !== null && p.zscore_tbu < -2) ||
    (p.zscore_bbu !== null && p.zscore_bbu < -2) ||
    (p.zscore_bbtb !== null && p.zscore_bbtb < -2)
  );
}

function getNutritionTone(status: string | null | undefined): "normal" | "warning" | "danger" | "none" {
  if (!status) return "none";
  const v = status.toLowerCase();
  if (v.includes("severely") || v.includes("wasted") || v.includes("stunted") || v.includes("underweight")) {
    if (v.includes("severely")) return "danger";
    return "warning";
  }
  if (v.includes("normal")) return "normal";
  return "none";
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Profil Anak - Kader" }, { name: "description", content: "Profil pemeriksaan dan imunisasi anak" }];
}

export default function MobileCadreAnakDetailPage() {
  const navigate = useNavigate();
  const { anakId = "" } = useParams();
  const [wilayahId, setWilayahId] = useState<string | null>(null);
  const [anak, setAnak] = useState<any>(null);
  const [pertumbuhan, setPertumbuhan] = useState<any[]>([]);
  const [imunisasi, setImunisasi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showPertumbuhan, setShowPertumbuhan] = useState(false);
  const [showImunisasi, setShowImunisasi] = useState(false);

  useEffect(() => {
    let m = true;
    getCurrentUser().then((user) => {
      if (!m) return;
      if (!user || user.role !== "kader") {
        navigate("/login", { replace: true });
        return;
      }
      setWilayahId(user.wilayah_id || "wilayah_001");
    });
    return () => {
      m = false;
    };
  }, [navigate]);

  const loadDetail = useCallback(async (wid: string) => {
    try {
      setLoading(true);
      setLoadError(null);
      const data = await cadreApi.getAnakDetail(wid, anakId);
      setAnak(data.anak);
      setPertumbuhan(Array.isArray(data.pertumbuhan) ? data.pertumbuhan : []);
      setImunisasi(Array.isArray(data.imunisasi) ? data.imunisasi : []);
    } catch (e) {
      console.error(e);
      setLoadError("Gagal memuat profil anak.");
      toast({ title: "Error", description: "Gagal memuat profil anak", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [anakId]);

  useEffect(() => {
    if (wilayahId && anakId) loadDetail(wilayahId);
  }, [wilayahId, anakId, loadDetail]);

  const latestPertumbuhan = useMemo(() => pertumbuhan[0] ?? null, [pertumbuhan]);

  const handlePertumbuhanSubmit = async (data: PertumbuhanInsert) => {
    const fd = new FormData();
    fd.append("intent", "create-pertumbuhan");
    fd.append("data", JSON.stringify(data));
    await cadreApi.submitAction(fd);
    setShowPertumbuhan(false);
    if (wilayahId) await loadDetail(wilayahId);
    toast({ title: "Tersimpan", description: "Data BB/TB berhasil ditambahkan." });
  };

  const handleImunisasiSubmit = async (data: ImunisasiInsert) => {
    const fd = new FormData();
    fd.append("intent", "create-imunisasi");
    fd.append("data", JSON.stringify(data));
    await cadreApi.submitAction(fd);
    setShowImunisasi(false);
    if (wilayahId) await loadDetail(wilayahId);
    toast({ title: "Tersimpan", description: "Data imunisasi berhasil ditambahkan." });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={() => navigate("/m/cadre/anak")} aria-label="Kembali">
          <span className={styles.icon} aria-hidden>
            arrow_back
          </span>
        </button>
        <div>
          <h1 className={styles.title}>Profil Anak</h1>
          <p className={styles.subtitle}>Detail pemeriksaan dan imunisasi</p>
        </div>
      </header>

      <main className={styles.main}>
        {loading && !anak ? (
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} />
          </div>
        ) : loadError && !anak ? (
          <div className={styles.errorCard}>
            <p>{loadError}</p>
            <button type="button" className={styles.retryBtn} onClick={() => wilayahId && loadDetail(wilayahId)}>
              Coba Lagi
            </button>
          </div>
        ) : anak ? (
          <>
            <section className={styles.card}>
              <div className={styles.profileHead}>
                <div>
                  <p className={styles.name}>{anak.nama}</p>
                  <p className={styles.meta}>Orang tua: {anak.parent_name || "-"}</p>
                  <p className={styles.meta}>
                    Umur: {calculateAgeMonths(anak.tanggal_lahir)} bln · JK: {anak.jenis_kelamin === "laki_laki" ? "L" : "P"}
                  </p>
                </div>
                {!latestPertumbuhan ? (
                  <span className={styles.badgeNone}>Belum ada data</span>
                ) : needsAttention(anak) ? (
                  <span className={styles.badgeWarn}>Perlu perhatian</span>
                ) : (
                  <span className={styles.badgeNormal}>Normal</span>
                )}
              </div>
              <div className={styles.stats}>
                <span>Catatan BB/TB: {pertumbuhan.length}</span>
                <span>Catatan imunisasi: {imunisasi.length}</span>
                {latestPertumbuhan ? (
                  <span>
                    Terakhir: {latestPertumbuhan.berat_badan} kg / {latestPertumbuhan.tinggi_badan} cm
                  </span>
                ) : null}
              </div>
              {latestPertumbuhan ? (
                <div className={styles.nutriGroup}>
                  <span className={styles.nutriLabel}>TB/U</span>
                  <span className={styles[`nutriBadge_${getNutritionTone(latestPertumbuhan.kategori_tbu)}`]}>
                    {toIndonesianNutritionStatus(latestPertumbuhan.kategori_tbu)}
                  </span>
                  <span className={styles.nutriLabel}>BB/U</span>
                  <span className={styles[`nutriBadge_${getNutritionTone(latestPertumbuhan.kategori_bbu)}`]}>
                    {toIndonesianNutritionStatus(latestPertumbuhan.kategori_bbu)}
                  </span>
                  <span className={styles.nutriLabel}>BB/TB</span>
                  <span className={styles[`nutriBadge_${getNutritionTone(latestPertumbuhan.kategori_bbtb)}`]}>
                    {toIndonesianNutritionStatus(latestPertumbuhan.kategori_bbtb)}
                  </span>
                </div>
              ) : null}
            </section>

            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>Tambah Catatan</h2>
              <div className={styles.actionRow}>
                <button type="button" className={styles.actionBtn} onClick={() => setShowPertumbuhan(true)}>
                  <span className={styles.icon} aria-hidden>
                    monitor_weight
                  </span>
                  BB/TB
                </button>
                <button type="button" className={styles.actionBtn} onClick={() => setShowImunisasi(true)}>
                  <span className={styles.icon} aria-hidden>
                    vaccines
                  </span>
                  Imunisasi
                </button>
              </div>
            </section>

            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>Riwayat Pemeriksaan BB/TB</h2>
              {pertumbuhan.length === 0 ? (
                <p className={styles.empty}>Belum ada riwayat pemeriksaan.</p>
              ) : (
                <div className={styles.list}>
                  {pertumbuhan.map((p) => (
                    <div key={p.id} className={styles.item}>
                      <div className={styles.itemTop}>
                        <p className={styles.itemStrong}>
                          {p.berat_badan} kg · {p.tinggi_badan} cm
                        </p>
                        <p className={styles.itemDate}>{formatTanggal(p.tanggal_pengukuran)}</p>
                      </div>
                      <p className={styles.muted}>
                        TB/U: {p.zscore_tbu !== null ? p.zscore_tbu.toFixed(2) : "-"} · BB/U:{" "}
                        {p.zscore_bbu !== null ? p.zscore_bbu.toFixed(2) : "-"} · BB/TB:{" "}
                        {p.zscore_bbtb !== null ? p.zscore_bbtb.toFixed(2) : "-"}
                      </p>
                      <div className={styles.nutriGroup} style={{ marginTop: "0.25rem" }}>
                        <span className={styles.nutriLabel}>TB/U</span>
                        <span className={styles[`nutriBadge_${getNutritionTone(p.kategori_tbu)}`]}>
                          {toIndonesianNutritionStatus(p.kategori_tbu)}
                        </span>
                        <span className={styles.nutriLabel}>BB/U</span>
                        <span className={styles[`nutriBadge_${getNutritionTone(p.kategori_bbu)}`]}>
                          {toIndonesianNutritionStatus(p.kategori_bbu)}
                        </span>
                        <span className={styles.nutriLabel}>BB/TB</span>
                        <span className={styles[`nutriBadge_${getNutritionTone(p.kategori_bbtb)}`]}>
                          {toIndonesianNutritionStatus(p.kategori_bbtb)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>Riwayat Imunisasi</h2>
              {imunisasi.length === 0 ? (
                <p className={styles.empty}>Belum ada riwayat imunisasi.</p>
              ) : (
                <div className={styles.list}>
                  {imunisasi.map((i) => (
                    <div key={i.id} className={styles.item}>
                      <div className={styles.itemTop}>
                        <p className={styles.itemStrong}>{i.nama_vaksin || i.nama_imunisasi || "-"}</p>
                        <p className={styles.itemDate}>{formatTanggal(i.tanggal)}</p>
                      </div>
                      {i.keterangan ? <p className={styles.muted}>{i.keterangan}</p> : null}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : null}
      </main>

      {anakId && (
        <>
          <PertumbuhanFormDialog
            open={showPertumbuhan}
            onOpenChange={setShowPertumbuhan}
            anakId={anakId}
            onSubmit={handlePertumbuhanSubmit}
          />
          <ImunisasiFormDialog
            open={showImunisasi}
            onOpenChange={setShowImunisasi}
            anakId={anakId}
            onSubmit={handleImunisasiSubmit}
          />
        </>
      )}

      <MobileCadreNav />
    </div>
  );
}
