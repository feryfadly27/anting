import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Heart, Users, Activity } from "lucide-react";
import type { Route } from "./+types/home";
import styles from "./home.module.css";
import { Button } from "~/components/ui/button/button";
import { getCurrentUser, getDashboardPath } from "~/utils/auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SI Banting - RKP Bayi Cegah Stunting" },
    {
      name: "description",
      content:
        "Sistem Informasi Banting untuk pencegahan stunting pada bayi melalui manajemen data kesehatan terstruktur",
    },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  // Auto-redirect if already logged in - only run once on mount
  useEffect(() => {
    // Async auth check
    getCurrentUser().then(user => {
      if (user) {
        navigate(getDashboardPath(user.role));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Heart className={styles.logoIcon} />
          <span className={styles.logoText}>SI Banting</span>
        </div>
        <div className={styles.headerActions}>
          <Button variant="outline" onClick={() => navigate("/login")}>
            Masuk
          </Button>
          <Button onClick={() => navigate("/register")}>Daftar</Button>
        </div>
      </header>

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>RKP Bayi Cegah Stunting</h1>
        <p className={styles.heroTagline}>
          Sistem informasi kesehatan bayi yang membantu orang tua, kader posyandu, dan puskesmas dalam memantau dan
          mencegah stunting melalui manajemen data kesehatan yang terstruktur
        </p>
        <div className={styles.heroCta}>
          <Button size="lg" onClick={() => navigate("/register")}>
            Mulai Sekarang
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
            Masuk ke Akun
          </Button>
        </div>
      </section>

      <section className={styles.overview}>
        <div className={styles.overviewContainer}>
          <h2 className={styles.overviewTitle}>Manfaat SI Banting</h2>
          <div className={styles.overviewGrid}>
            <div className={styles.overviewCard}>
              <Heart className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Pemantauan Kesehatan Bayi</h3>
              <p className={styles.cardDescription}>
                Catat dan pantau perkembangan kesehatan bayi secara terstruktur dengan data yang mudah diakses kapan
                saja
              </p>
            </div>

            <div className={styles.overviewCard}>
              <Users className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Kolaborasi Tim Kesehatan</h3>
              <p className={styles.cardDescription}>
                Memfasilitasi kerja sama antara orang tua, kader posyandu, dan puskesmas dalam pencegahan stunting
              </p>
            </div>

            <div className={styles.overviewCard}>
              <Activity className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>Data Terstruktur</h3>
              <p className={styles.cardDescription}>
                Sistem manajemen data kesehatan yang terorganisir untuk memudahkan analisis dan pengambilan keputusan
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
