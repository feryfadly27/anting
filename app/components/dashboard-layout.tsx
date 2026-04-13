import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Heart, LogOut } from "lucide-react";
import styles from "./dashboard-layout.module.css";
import { Button } from "./ui/button/button";
import { getCurrentUser, logout } from "~/utils/auth";
import { toast } from "~/hooks/use-toast";
import type { User, UserRole } from "~/data/users";

interface DashboardLayoutProps {
  /**
   * The main content to display in the dashboard
   * @important
   */
  children: React.ReactNode;
  /**
   * Optional className for custom styling
   */
  className?: string;
}

const roleLabels: Record<UserRole, string> = {
  orang_tua: "Orang Tua",
  kader: "Kader Posyandu",
  puskesmas: "Puskesmas",
};

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<User | null>(null);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;
    
    // Async auth check
    getCurrentUser().then(currentUser => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
      }
    });
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Berhasil keluar",
      description: "Anda telah keluar dari sistem",
    });
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`${styles.layout} ${className || ""}`}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Heart className={styles.logoIcon} />
          <span className={styles.logoText}>SI Banting</span>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.name}</span>
            <span className={styles.userRole}>{roleLabels[user.role]}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className={styles.logoutIcon} />
            Keluar
          </Button>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
