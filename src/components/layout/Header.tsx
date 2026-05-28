"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, LogOut, Settings, User, Shield, ChevronDown, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import NotificationCenter from "@/components/ui/NotificationCenter";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageSelector from "@/components/ui/LanguageSelector";
import toast from "react-hot-toast";
import { useI18n } from "@/lib/i18n";

interface HeaderProps {
  userName?: string;
  userRole?: string;
  userEmail?: string;
  joinCode?: string;
  onMenuToggle?: () => void;
}

const roleLabels: Record<string, string> = {
  chairman: "Chairman",
  secretary: "Secretary",
  treasurer: "Treasurer",
  member: "Flat Member",
  tenant: "Tenant",
  guard: "Security Guard",
  watchman: "Watchman",
  vendor_staff: "Vendor",
  facility_manager: "Facility Manager",
};

const roleBadgeColors: Record<string, string> = {
  chairman: "text-primary",
  secretary: "text-primary",
  treasurer: "text-primary",
  member: "text-emerald-600",
  tenant: "text-blue-600",
  guard: "text-orange-600",
  watchman: "text-orange-600",
  vendor_staff: "text-purple-600",
  facility_manager: "text-teal-600",
};

export default function Header({
  userName = "Admin",
  userRole = "chairman",
  userEmail = "",
  joinCode,
  onMenuToggle,
}: HeaderProps) {
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t } = useI18n();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch { /* ignore */ }
    router.push("/login");
    router.refresh();
  };

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const canShareJoinCode = ["chairman", "secretary"].includes(userRole) && !!joinCode;

  const copyJoinCode = () => {
    if (!joinCode) return;
    navigator.clipboard.writeText(joinCode);
    toast.success("Join code copied");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 border-b border-border px-4 backdrop-blur lg:px-6 dark:bg-[#0f172a]/95">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-surface transition-colors"
          >
            <Menu className="w-5 h-5 text-text-secondary" />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-sm font-medium text-text-secondary">
              {t("SmartSocietyHub")}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {canShareJoinCode && (
            <button
              type="button"
              onClick={copyJoinCode}
              className="hidden md:flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-primary hover:bg-primary/10 transition-colors"
              title={t("Copy society join code")}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary/70">
                {t("Join Code")}
              </span>
              <span className="font-mono text-sm font-black tracking-widest">
                {joinCode}
              </span>
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}
          <LanguageSelector />
          <ThemeToggle />
          <NotificationCenter />

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 pl-3 border-l border-border hover:bg-surface/50 rounded-xl px-2 py-1.5 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">{initials}</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-text-primary leading-tight">{userName}</p>
                <p className="text-[10px] text-text-tertiary capitalize">{t(roleLabels[userRole] || userRole)}</p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-text-tertiary hidden sm:block transition-transform ${showProfile ? "rotate-180" : ""}`} />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-border/60 shadow-2xl shadow-black/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50 dark:bg-[#111827]">
                {/* Profile Info */}
                <div className="p-4 bg-surface/30 border-b border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-bold">{initials}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-text-primary truncate">{userName}</p>
                      <p className="text-[10px] text-text-tertiary truncate">{userEmail}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Shield className={`w-3 h-3 ${roleBadgeColors[userRole] || "text-primary"}`} />
                        <span className={`text-[9px] font-bold uppercase ${roleBadgeColors[userRole] || "text-primary"}`}>{t(roleLabels[userRole] || userRole)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-1.5">
                  <button
                    onClick={() => { setShowProfile(false); router.push("/settings"); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-primary hover:bg-surface transition-colors text-left"
                  >
                    <User className="w-4 h-4 text-text-tertiary" /> {t("My Profile")}
                  </button>
                  {["chairman", "secretary", "treasurer"].includes(userRole) && (
                    <button
                      onClick={() => { setShowProfile(false); router.push("/settings"); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-primary hover:bg-surface transition-colors text-left"
                    >
                      <Settings className="w-4 h-4 text-text-tertiary" /> {t("Society Settings")}
                    </button>
                  )}
                  <div className="my-1.5 border-t border-border/30" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" /> {t("Sign Out")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
