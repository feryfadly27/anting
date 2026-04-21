import { Link, useLocation } from "react-router";
import styles from "./mobile-parent-nav.module.css";

export function MobileParentNav() {
  const location = useLocation();
  const path = location.pathname;

  const isDashboard = path === "/m/parent/dashboard";
  const isStatus = path === "/m/parent/status";
  const isAddAnak = path === "/m/parent/anak/new";
  const isAnak = path === "/m/parent/anak" || (path.startsWith("/m/parent/anak/") && path !== "/m/parent/anak/new");

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.navInner}>
        <Link className={isDashboard ? styles.navItemActive : styles.navItem} to="/m/parent/dashboard">
          <span className={styles.iconFilled}>home</span>
          <span>Beranda</span>
        </Link>
        <Link className={isStatus ? styles.navItemActive : styles.navItem} to="/m/parent/status">
          <span className={styles.icon}>monitoring</span>
          <span>Status</span>
        </Link>
        <Link className={isAnak ? styles.navItemActive : styles.navItem} to="/m/parent/anak">
          <span className={styles.icon}>groups</span>
          <span>Anak</span>
        </Link>
        <Link className={isAddAnak ? styles.navItemActive : styles.navItem} to="/m/parent/anak/new">
          <span className={styles.icon}>person_add</span>
          <span>Tambah</span>
        </Link>
      </div>
    </nav>
  );
}
