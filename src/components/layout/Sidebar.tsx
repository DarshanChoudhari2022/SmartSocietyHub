"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Receipt,
  Bell,
  BarChart3,
  Wallet,
  Settings,
  LogOut,
  Building2,
  X,
  Megaphone,
  AlertTriangle,
  UserCheck,
  Car,
  CalendarCheck,
  Phone,
  FileText,
  Vote,
  FolderOpen,
  History,
  Search,
  Wrench,
  Briefcase,
  Package,
  UserPlus,
  ChevronDown,
  Shield,
  CreditCard,
  KeyRound,
  ClipboardList,
  BookOpen,
  MessageSquare,
  ShoppingBag,
  PiggyBank,
  TrendingUp,
  HardDrive,
  HandCoins,
  PanelLeftClose,
} from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles?: string[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["chairman", "secretary", "treasurer", "member", "tenant", "facility_manager"] },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { href: "/visitors", label: "Security Gate", icon: Shield, roles: ["chairman", "secretary", "treasurer", "security", "guard", "watchman"] },
      { href: "/my-visitors", label: "My Visitors", icon: UserCheck, roles: ["member", "tenant"] },
      { href: "/staff", label: "Staff & Daily Help", icon: Briefcase, roles: ["chairman", "secretary", "treasurer", "member", "tenant"] },
      { href: "/packages", label: "Parcel Desk", icon: Package, roles: ["chairman", "secretary", "treasurer", "member", "tenant", "watchman", "guard"] },
    ],
  },
  {
    title: "FINANCE",
    items: [
      { href: "/maintenance", label: "Billing & Ledger", icon: Receipt, roles: ["chairman", "secretary", "treasurer"] },
      { href: "/my-bills", label: "My Bills", icon: CreditCard, roles: ["member", "tenant"] },
      { href: "/expenses", label: "Expenses", icon: Wallet, roles: ["chairman", "secretary", "treasurer"] },
      { href: "/funds", label: "Fund Accounts", icon: PiggyBank, roles: ["chairman", "treasurer"] },
      { href: "/budgets", label: "Budget Planning", icon: TrendingUp, roles: ["chairman", "treasurer"] },
      { href: "/salaries", label: "Staff Payroll", icon: HandCoins, roles: ["chairman", "treasurer"] },
      { href: "/accounting", label: "Accounting", icon: BookOpen, roles: ["chairman", "secretary", "treasurer"] },
      { href: "/reports", label: "Reports", icon: BarChart3, roles: ["chairman", "secretary", "treasurer"] },
    ],
  },
  {
    title: "COMMUNITY",
    items: [
      { href: "/notices", label: "Announcements", icon: Megaphone, roles: ["chairman", "secretary", "treasurer", "member", "tenant"] },
      { href: "/complaints", label: "Helpdesk", icon: AlertTriangle, roles: ["chairman", "secretary", "treasurer", "member", "tenant"] },
      { href: "/directory", label: "Resident Directory", icon: BookOpen, roles: ["chairman", "secretary", "treasurer"] },
      { href: "/forum", label: "Discussion Forum", icon: MessageSquare, roles: ["chairman", "secretary", "treasurer", "member", "tenant"] },
      { href: "/events", label: "Events & Calendar", icon: CalendarCheck, roles: ["chairman", "secretary", "treasurer", "member", "tenant"] },
      { href: "/amenities", label: "Amenity Booking", icon: Building2, roles: ["chairman", "secretary", "treasurer", "member", "tenant"] },
      { href: "/marketplace", label: "Buy & Sell", icon: ShoppingBag, roles: ["chairman", "secretary", "treasurer", "member", "tenant"] },
      { href: "/parking", label: "Parking", icon: Car, roles: ["chairman", "secretary", "treasurer", "member", "tenant"] },
      { href: "/emergency", label: "SOS & Safety", icon: Phone, roles: ["chairman", "secretary", "treasurer", "member", "tenant"] },
    ],
  },
  {
    title: "GOVERNANCE",
    items: [
      { href: "/meetings", label: "Meetings", icon: FileText, roles: ["chairman", "secretary", "treasurer", "member", "tenant"] },
      { href: "/polls", label: "Polls & Voting", icon: Vote, roles: ["chairman", "secretary", "treasurer", "member", "tenant"] },
      { href: "/documents", label: "Document Vault", icon: FolderOpen, roles: ["chairman", "secretary", "treasurer", "member", "tenant"] },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { href: "/members", label: "Residents", icon: Users, roles: ["chairman", "secretary", "treasurer"] },
      { href: "/tenants", label: "Tenants", icon: UserPlus, roles: ["chairman", "secretary", "treasurer"] },
      { href: "/move-events", label: "Move In / Out", icon: ClipboardList, roles: ["chairman", "secretary", "treasurer"] },
      { href: "/vendors", label: "Vendor Hub", icon: Wrench, roles: ["chairman", "secretary", "treasurer"] },
      { href: "/assets", label: "Asset Register", icon: HardDrive, roles: ["chairman", "secretary", "treasurer"] },
      { href: "/reminders", label: "Smart Nudges", icon: Bell, roles: ["chairman", "secretary", "treasurer"] },
      { href: "/credentials", label: "Access Control", icon: KeyRound, roles: ["chairman", "secretary"] },
      { href: "/activity-log", label: "Audit Trail", icon: History, roles: ["chairman", "secretary", "treasurer"] },
      { href: "/settings", label: "Settings", icon: Settings, roles: ["chairman", "secretary"] },
    ],
  },
];

interface SidebarProps {
  societyName?: string;
  societyAddress?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onHide?: () => void;
  userRole?: string;
}

export default function Sidebar({
  societyName = "SmartSocietyHub",
  societyAddress = "",
  isOpen = false,
  onClose,
  onHide,
  userRole = "member",
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCompact, setIsCompact] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const { t } = useI18n();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const visibleSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.roles || item.roles.includes(userRole)),
    }))
    .filter((section) => section.items.length > 0);
  const displaySocietyName = societyName?.trim() || "SmartSocietyHub";
  const displaySocietyAddress = societyAddress?.trim() || "Society";

  const toggleSection = (title: string) => {
    setCollapsedSections((current) => ({ ...current, [title]: !current[title] }));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-[100dvh] pb-safe overflow-hidden border-r border-blue-100/80 bg-white/95 shadow-xl shadow-blue-950/5 backdrop-blur flex flex-col transition-[width,transform] duration-300 ease-in-out dark:border-slate-800 dark:bg-[#0f172a]/95 lg:translate-x-0 lg:rounded-r-[2rem] ${
          isCompact ? "w-[5.25rem]" : "w-72 max-w-[18rem]"
        } ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:z-auto`}
      >
        {/* Society header */}
        <div className={`relative overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 text-white ${isCompact ? "p-3" : "p-4"} ${!isCompact ? "rounded-br-[1.75rem]" : ""}`}>
          <div className={`flex w-full items-center ${isCompact ? "justify-center" : "gap-3"}`}>
            <div className="flex h-11 w-11 min-w-11 items-center justify-center rounded-2xl bg-white/18 shadow-sm ring-1 ring-white/20 backdrop-blur">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            {!isCompact && (
              <div className="min-w-0 flex-1 overflow-hidden">
                <h2 className="text-sm font-black leading-tight text-white truncate" title={displaySocietyName}>
                  {displaySocietyName}
                </h2>
                <p className="mt-0.5 text-[10px] font-black uppercase tracking-widest text-white/75 truncate" title={displaySocietyAddress}>
                  {displaySocietyAddress}
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsCompact((current) => !current)}
              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/12 text-white transition-colors hover:bg-white/20 lg:flex"
              title={isCompact ? t("Expand sidebar") : t("Compact sidebar")}
            >
              <Search className="h-4 w-4" />
            </button>
            {onHide && (
              <button
                type="button"
                onClick={onHide}
                className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/12 text-white transition-colors hover:bg-white/20 lg:flex"
                title={t("Hide sidebar")}
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg bg-white/12 hover:bg-white/20 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <nav className={`flex-1 overflow-y-auto ${isCompact ? "px-3 py-4" : "p-4"}`}>
          <div className={isCompact ? "space-y-2" : "space-y-4"}>
            {visibleSections.map((section) => (
              <div key={section.title || "main"}>
                {section.title && !isCompact && (
                  <button
                    type="button"
                    onClick={() => toggleSection(section.title)}
                    className="flex w-full items-center justify-between px-2 pb-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400"
                  >
                    <span>{t(section.title)}</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${collapsedSections[section.title] ? "-rotate-90" : ""}`} />
                  </button>
                )}
                <div className={`${collapsedSections[section.title] && !isCompact ? "hidden" : "block"} ${isCompact ? "space-y-2" : "space-y-1"}`}>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={t(item.label)}
                        className={`group flex items-center gap-3 rounded-xl font-bold transition-all ${
                          isCompact
                            ? `h-12 w-12 justify-center ${isActive ? "bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-500/15 dark:text-blue-200" : "text-slate-500 hover:bg-slate-50 hover:text-blue-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-200"}`
                            : `px-3 py-3 text-sm ${isActive ? "bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-500/15 dark:text-blue-200" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"}`
                        }`}
                        onClick={onClose}
                      >
                        <Icon className={`${isCompact ? "h-5 w-5" : "h-[18px] w-[18px]"} shrink-0`} />
                        {!isCompact && <span className="truncate">{t(item.label)}</span>}
                      </Link>
                    );
                  })}
                </div>
                {isCompact && section.title && <div className="mx-auto my-2 h-px w-8 bg-slate-100 dark:bg-slate-800" />}
              </div>
            ))}
          </div>
        </nav>

        {/* User info + Logout */}
        <div className={`mt-auto ${isCompact ? "p-3" : "p-4"}`}>
          {!isCompact && (
            <div className="flex items-center gap-2 px-3 py-2 mb-2">
              <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider dark:text-slate-400">
                {t(userRole.charAt(0).toUpperCase() + userRole.slice(1))}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={t("Sign Out")}
            className={`flex items-center gap-3 bg-rose-600 font-black text-white shadow-sm transition-all hover:bg-rose-700 ${
              isCompact
                ? "h-12 w-12 justify-center rounded-2xl"
                : "w-full rounded-2xl px-4 py-4 text-sm"
            }`}
          >
            <LogOut className="h-[18px] w-[18px]" />
            {!isCompact && t("Sign Out")}
          </button>
        </div>
      </aside>
    </>
  );
}
