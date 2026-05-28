"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  BookOpen,
  Briefcase,
  Building2,
  CalendarCheck,
  Car,
  ChevronDown,
  ClipboardList,
  CreditCard,
  FileText,
  FolderOpen,
  HandCoins,
  HardDrive,
  Home,
  IndianRupee,
  Landmark,
  Megaphone,
  MessageSquare,
  MoreHorizontal,
  Package,
  Phone,
  PiggyBank,
  Receipt,
  RefreshCw,
  Scale,
  Settings,
  Shield,
  ShoppingBag,
  TrendingUp,
  User,
  UserCheck,
  UserPlus,
  Users,
  Vote,
  Wallet,
  Wrench,
} from "lucide-react";
import { useLiveData } from "@/lib/use-live-data";
import { useUser } from "@/lib/user-context";
import { formatCurrency } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface DashboardData {
  totalCollected: number;
  pendingAmount: number;
  totalExpenses: number;
  totalMembers: number;
  paidCount: number;
  partialCount: number;
  pendingCount: number;
  totalFlats: number;
  period: string;
  fundBalance: number;
  openComplaints: number;
  visitorsToday: number;
  activePolls: number;
}

interface MyBillsData {
  stats: { totalPending: number; totalPaid: number };
}

interface ResidentBootstrapData {
  notices?: Array<{ id: string; title: string; category: string; createdAt: string }>;
  visitors?: Array<{ id: string; visitorName: string; purpose: string; status: string; expectedAt?: string | null; entryTime?: string | null; exitTime?: string | null }>;
  packages?: Array<{ id: string; courierName: string | null; status: string; receivedAt: string; collectedAt?: string | null }>;
  staff?: Array<{ id: string; name: string; category: string; phone: string; flatLinks?: Array<{ agreedMonthlyPay: number | null; schedule: string | null }> }>;
  forumThreads?: Array<{ id: string; title: string; author?: { name: string; role: string }; _count?: { replies: number } }>;
  events?: Array<{ id: string; title: string; venue: string | null; startDate: string; category: string }>;
  parkingSlots?: Array<{ id: string; slotNumber: string; slotType: string; level: string | null; wing: string | null; vehicleNo: string | null }>;
}

type Role = string;
type ModuleItem = {
  label: string;
  href: string;
  icon: typeof Shield;
  roles: Role[];
  note: string;
};
type Category = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Shield;
  color: string;
  shadow: string;
  modules: ModuleItem[];
};

const admin = ["chairman", "secretary", "treasurer"];
const resident = ["member", "tenant"];
const everyone = [...admin, ...resident];

const categories: Category[] = [
  {
    id: "operations",
    title: "Operations",
    subtitle: "Daily Services",
    description: "Gate, staff, parcels, and daily movement.",
    icon: Shield,
    color: "from-violet-600 via-indigo-600 to-blue-700",
    shadow: "shadow-violet-500/20",
    modules: [
      { label: "Security Gate", href: "/visitors", icon: Shield, roles: [...admin, "guard", "watchman"], note: "Visitors and gate records" },
      { label: "My Visitors", href: "/my-visitors", icon: UserCheck, roles: resident, note: "Guests and approvals" },
      { label: "Staff & Daily Help", href: "/staff", icon: Briefcase, roles: everyone, note: "Daily help and attendance" },
      { label: "Parcel Desk", href: "/packages", icon: Package, roles: [...everyone, "guard", "watchman"], note: "Deliveries and pickups" },
    ],
  },
  {
    id: "finance",
    title: "Finance",
    subtitle: "Payments & Funds",
    description: "Bills, expenses, funds, payroll, and reports.",
    icon: IndianRupee,
    color: "from-emerald-700 via-teal-700 to-cyan-700",
    shadow: "shadow-emerald-500/20",
    modules: [
      { label: "Billing & Ledger", href: "/maintenance", icon: Receipt, roles: admin, note: "Raise and collect dues" },
      { label: "My Bills", href: "/my-bills", icon: CreditCard, roles: resident, note: "Dues, rent, staff payments" },
      { label: "Expenses", href: "/expenses", icon: Wallet, roles: ["chairman", "treasurer"], note: "Society spending" },
      { label: "Fund Accounts", href: "/funds", icon: PiggyBank, roles: ["chairman", "treasurer"], note: "Reserve and corpus" },
      { label: "Budget Planning", href: "/budgets", icon: TrendingUp, roles: ["chairman", "treasurer"], note: "Plan vs actuals" },
      { label: "Staff Payroll", href: "/salaries", icon: HandCoins, roles: ["chairman", "treasurer"], note: "Society staff salary" },
      { label: "Reports", href: "/reports", icon: FileText, roles: admin, note: "Financial summaries" },
    ],
  },
  {
    id: "legal",
    title: "Free Legal Advice",
    subtitle: "Legal Help",
    description: "Free legal guidance, adviser contact, and society compliance notes.",
    icon: Scale,
    color: "from-slate-800 via-zinc-800 to-stone-700",
    shadow: "shadow-slate-500/20",
    modules: [
      { label: "Legal Adviser Contact", href: "/settings", icon: Scale, roles: admin, note: "Advisor phone and profile" },
      { label: "Legal Documents", href: "/documents", icon: FolderOpen, roles: admin, note: "Bylaws and legal records" },
      { label: "Committee Guidance", href: "/meetings", icon: FileText, roles: admin, note: "AGM, notices, and resolutions" },
    ],
  },
  {
    id: "community",
    title: "Community",
    subtitle: "People & Shared Life",
    description: "Announcements, helpdesk, amenities, parking, and safety.",
    icon: Megaphone,
    color: "from-blue-700 via-indigo-600 to-violet-700",
    shadow: "shadow-blue-500/20",
    modules: [
      { label: "Announcements", href: "/notices", icon: Megaphone, roles: everyone, note: "Society updates" },
      { label: "Helpdesk", href: "/complaints", icon: AlertTriangle, roles: everyone, note: "Complaints and requests" },
      { label: "Resident Directory", href: "/directory", icon: BookOpen, roles: everyone, note: "Find residents" },
      { label: "Discussion Forum", href: "/forum", icon: MessageSquare, roles: everyone, note: "Neighbourhood discussions" },
      { label: "Events & Calendar", href: "/events", icon: CalendarCheck, roles: everyone, note: "Society events" },
      { label: "Amenity Booking", href: "/amenities", icon: Building2, roles: everyone, note: "Book shared spaces" },
      { label: "Buy & Sell", href: "/marketplace", icon: ShoppingBag, roles: everyone, note: "Resident marketplace" },
      { label: "Parking", href: "/parking", icon: Car, roles: everyone, note: "Slots and vehicles" },
      { label: "SOS & Safety", href: "/emergency", icon: Phone, roles: everyone, note: "Emergency help" },
    ],
  },
  {
    id: "governance",
    title: "Governance",
    subtitle: "Decisions & Records",
    description: "Meetings, voting, and documents.",
    icon: Vote,
    color: "from-fuchsia-700 via-purple-700 to-indigo-700",
    shadow: "shadow-fuchsia-500/20",
    modules: [
      { label: "Meetings", href: "/meetings", icon: FileText, roles: everyone, note: "Agenda and minutes" },
      { label: "Polls & Voting", href: "/polls", icon: Vote, roles: everyone, note: "Resident decisions" },
      { label: "Document Vault", href: "/documents", icon: FolderOpen, roles: everyone, note: "Society records" },
    ],
  },
  {
    id: "management",
    title: "Management",
    subtitle: "Setup & Control",
    description: "Residents, tenants, vendors, assets, audit, and settings.",
    icon: Settings,
    color: "from-rose-700 via-red-700 to-orange-700",
    shadow: "shadow-rose-500/20",
    modules: [
      { label: "Residents", href: "/members", icon: Users, roles: admin, note: "Owners and members" },
      { label: "Tenants", href: "/tenants", icon: UserPlus, roles: admin, note: "Tenant lifecycle" },
      { label: "Move In / Out", href: "/move-events", icon: ClipboardList, roles: admin, note: "Occupancy changes" },
      { label: "Vendor Hub", href: "/vendors", icon: Wrench, roles: admin, note: "Vendors and AMCs" },
      { label: "Asset Register", href: "/assets", icon: HardDrive, roles: admin, note: "Society assets" },
      { label: "Audit Trail", href: "/activity-log", icon: FileText, roles: admin, note: "Action history" },
      { label: "Settings", href: "/settings", icon: Settings, roles: ["chairman", "secretary"], note: "Society setup" },
    ],
  },
];

const roleLabels: Record<string, string> = {
  chairman: "Chairman",
  secretary: "Secretary",
  treasurer: "Treasurer",
  member: "Flat Member",
  tenant: "Tenant",
};

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function CategoryCard({ category, expanded, count, onClick }: { category: Category; expanded: boolean; count: number; onClick: () => void }) {
  const Icon = category.icon;
  const { t } = useI18n();
  return (
    <motion.button
      layout
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      className={`relative flex h-[176px] w-full overflow-hidden rounded-2xl bg-gradient-to-br ${category.color} p-4 text-left text-white transition-all duration-300 ${
        expanded
          ? `shadow-lg ${category.shadow} ring-2 ring-white/70`
          : "shadow-sm opacity-95 hover:opacity-100"
      }`}
    >
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">{t(category.subtitle)}</p>
            <h2 className="mt-1.5 text-2xl font-black tracking-tight">{t(category.title)}</h2>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div>
          <p className="line-clamp-2 max-w-md text-sm leading-5 text-white/85">{t(category.description)}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold">{count} {t("modules")}</span>
            <span className="flex items-center gap-1 text-xs font-black">
              {expanded ? t("Hide") : t("Open")} <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </span>
          </div>
        </div>
      </div>
      <Icon className="absolute -bottom-10 -right-8 h-40 w-40 text-white/10" />
    </motion.button>
  );
}

function ModuleCard({ module }: { module: ModuleItem }) {
  const Icon = module.icon;
  const { t } = useI18n();
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
      <Link href={module.href} className="group flex min-h-[104px] flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_4px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20 dark:hover:border-primary/40">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/7 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <Icon className="h-4 w-4" />
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-black text-slate-950 dark:text-slate-50">{t(module.label)}</h3>
          <p className="mt-1 line-clamp-1 text-xs font-medium text-slate-500">{t(module.note)}</p>
        </div>
      </Link>
    </motion.div>
  );
}

function CategoryWorkspace({ category, isAdmin }: { category: Category; isAdmin: boolean }) {
  const { t } = useI18n();
  const quickActions = {
    operations: [
      { label: isAdmin ? "Gate Activity" : "Approve Visitors", href: isAdmin ? "/visitors" : "/my-visitors", icon: Shield },
      { label: "Parcel Desk", href: "/packages", icon: Package },
      { label: "Emergency Contacts", href: "/emergency", icon: Phone },
    ],
    finance: [
      { label: isAdmin ? "Raise Invoice" : "Pay Dues", href: isAdmin ? "/maintenance" : "/my-bills", icon: Receipt },
      { label: "Record Expense", href: "/expenses", icon: Wallet },
      { label: "View Collections", href: "/reports", icon: TrendingUp },
    ],
    community: [
      { label: "Create Notice", href: "/notices", icon: Megaphone },
      { label: "Open Complaints", href: "/complaints", icon: AlertTriangle },
      { label: "Upcoming Events", href: "/events", icon: CalendarCheck },
    ],
    legal: [
      { label: "Update Adviser", href: "/settings", icon: Scale },
      { label: "Open Documents", href: "/documents", icon: FolderOpen },
      { label: "Meeting Records", href: "/meetings", icon: FileText },
    ],
    governance: [
      { label: "New Poll", href: "/polls", icon: Vote },
      { label: "Meeting Records", href: "/meetings", icon: FileText },
      { label: "Documents", href: "/documents", icon: FolderOpen },
    ],
    management: [
      { label: "Residents", href: "/members", icon: Users },
      { label: "Tenants", href: "/tenants", icon: UserPlus },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  }[category.id] || [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-b-2xl"
    >
      <div className="relative rounded-[1.75rem] border border-white/80 bg-white/95 p-5 shadow-md shadow-slate-900/5 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-black/20 sm:p-6">
        <div className={`absolute left-8 top-0 h-1.5 w-24 rounded-b-full bg-gradient-to-r ${category.color}`} />
        <div className="absolute -top-3 left-10 h-3 w-10 rounded-t-xl bg-white/95 dark:bg-slate-900/95" />

        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">{t("Workspace")}</p>
            <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-slate-50">{t(category.title)}</h2>
            <p className="mt-1 text-xs font-medium text-slate-500">{t(category.description)}</p>
          </div>
          <span className="hidden rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:bg-slate-800 dark:text-slate-300 sm:inline">
            {t("No crowded menus")}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {category.modules.map((module) => <ModuleCard key={module.href} module={module} />)}
        </div>

        {quickActions.length > 0 && (
          <div className="mt-5">
            <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-500">{t("Quick Actions")}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex min-h-[72px] flex-col justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-950 shadow-[0_1px_4px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:text-primary hover:shadow-[0_8px_20px_rgba(15,23,42,0.07)] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:shadow-black/20 dark:hover:border-primary/40"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{t(action.label)}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70">
          <BellRing className="h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <p className="text-xs font-black text-slate-950 dark:text-slate-50">{t("Recent activity")}</p>
            <p className="mt-0.5 text-xs font-medium text-slate-500">{t("Latest updates from this area appear in notifications and module pages.")}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function formatShortDate(date: string | null | undefined, language: string) {
  if (!date) return "";
  const locale = language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN";
  return new Date(date).toLocaleDateString(locale, { day: "numeric", month: "short" });
}

function formatShortTime(date: string | null | undefined, language: string) {
  if (!date) return "";
  const locale = language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN";
  return new Date(date).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}

function PriorityCard({
  href,
  label,
  value,
  icon: Icon,
  gradient,
  reverse = false,
}: {
  href: string;
  label: string;
  value: string;
  icon: typeof Shield;
  gradient: string;
  reverse?: boolean;
}) {
  return (
    <Link href={href} className="group block">
      <div className={`relative flex min-h-[112px] items-center overflow-hidden border border-white/40 bg-gradient-to-br ${gradient} p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1 ${reverse ? "rounded-[2rem_1.5rem_2rem_1.5rem]" : "rounded-[1.5rem_2rem_1.5rem_2rem]"}`}>
        <Icon className="absolute -bottom-3 -right-3 h-20 w-20 text-white opacity-[0.08] transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110" />
        <div className="relative z-10 flex w-full items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/20 shadow-sm backdrop-blur-md">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="h-10 w-px shrink-0 bg-white/20" />
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 truncate border-b border-white/20 pb-1 text-base font-black leading-tight text-white">{label}</h3>
            <p className="truncate text-xs font-semibold text-white/85">{value}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyMiniState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs font-bold text-text-secondary dark:border-slate-700 dark:bg-slate-800/70">
      {text}
    </div>
  );
}

function ResidentDashboard({
  user,
  data,
  myBills,
  bootstrap,
}: {
  user: ReturnType<typeof useUser>["user"];
  data: DashboardData | null;
  myBills: MyBillsData | null;
  bootstrap: ResidentBootstrapData | null;
}) {
  const { language, t } = useI18n();
  const notices = bootstrap?.notices || [];
  const visitors = bootstrap?.visitors || [];
  const packages = bootstrap?.packages || [];
  const staff = bootstrap?.staff || [];
  const forumThreads = bootstrap?.forumThreads || [];
  const events = bootstrap?.events || [];
  const parkingSlot = bootstrap?.parkingSlots?.[0];
  const pendingPackages = packages.filter((pkg) => !["collected", "returned"].includes(pkg.status)).length;
  const activeVisitors = visitors.filter((visitor) => ["pending_approval", "expected", "inside", "approved"].includes(visitor.status)).length;

  return (
    <div className="-m-4 min-h-full bg-[#f8f4f2] p-4 dark:bg-[#07111f] lg:-m-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6 pb-24 lg:pb-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full flex-1 space-y-6 lg:w-2/3 xl:w-[70%]">
            <section className="relative flex min-h-[210px] items-center justify-between overflow-hidden rounded-[2rem] bg-[#000328] p-6 shadow-sm lg:min-h-[230px] lg:p-8">
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80"
                  alt={t("Society building")}
                  className="h-full w-full object-cover opacity-60"
                />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,3,40,0.96)_0%,rgba(0,69,142,0.42)_100%)]" />
              <div className="relative z-10 max-w-xl">
                <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-white drop-shadow-md lg:text-5xl">
                  {t(greeting().charAt(0).toUpperCase() + greeting().slice(1))}, <br className="hidden lg:block" />
                  <span className="text-emerald-400">{user?.name?.split(" ")[0] || t("Residents")}</span>
                </h1>
                <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-medium text-white/75 lg:text-base">
                  <Building2 className="h-4 w-4 text-white/50" />
                  <span>{user?.societyName || t("Your society")}</span>
                  {user?.flatNumber && <span className="h-1.5 w-1.5 rounded-full bg-white/25" />}
                  {user?.flatNumber && <span className="font-bold text-white">{t("Unit")} {user.flatNumber}</span>}
                </p>
              </div>
              <div className="relative z-10 hidden shrink-0 pr-2 sm:block lg:pr-6">
                <div className="relative h-32 w-32 rounded-full border border-white/40 bg-white/20 p-2 shadow-xl backdrop-blur-md lg:h-44 lg:w-44">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-blue-600 text-4xl font-black text-white lg:text-6xl">
                    {user?.name?.slice(0, 1) || "R"}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-white/95 px-4 py-1.5 shadow-sm backdrop-blur-sm dark:bg-slate-900/95">
                    <UserCheck className="h-4 w-4 text-emerald-600" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-text-primary">{user?.role === "tenant" ? t("Tenant") : t("Residents")}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-3 lg:gap-4 xl:grid-cols-4">
              <PriorityCard href="/my-bills" label={t("My Bills")} value={`${t("Pending")}: ${formatCurrency(myBills?.stats?.totalPending || 0)}`} icon={CreditCard} gradient="from-emerald-500 to-emerald-700" />
              <PriorityCard href="/staff" label={t("Staff & Daily Help")} value={`${t("Scheduled")}: ${staff.length}`} icon={Wrench} gradient="from-blue-500 to-blue-700" reverse />
              <PriorityCard href="/packages" label={t("Parcel Desk")} value={`${t("Pending")}: ${pendingPackages}`} icon={Package} gradient="from-purple-500 to-purple-700" />
              <PriorityCard href="/emergency" label={t("SOS & Safety")} value={t("Alert security")} icon={Phone} gradient="from-rose-500 to-rose-700" reverse />
            </section>

            <section className="grid grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-2">
              <div className="flex flex-col rounded-[2rem_2.5rem_2rem_2.5rem] border border-border bg-white p-5 shadow-sm dark:bg-slate-900 lg:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-black tracking-tight text-text-primary">{t("Visitors")}</h3>
                  <Link href="/my-visitors" className="rounded-full bg-primary/5 px-3 py-1.5 text-xs font-black text-primary">{t("Approve visitors")}</Link>
                </div>
                <div className="flex-1 space-y-3">
                  {visitors.length === 0 ? <EmptyMiniState text={t("No recent visitors.")} /> : visitors.slice(0, 3).map((visitor) => (
                    <Link key={visitor.id} href="/my-visitors" className="flex items-center justify-between rounded-2xl border border-border bg-surface p-3.5 transition-all hover:bg-white hover:shadow-sm dark:hover:bg-slate-800">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                          <User className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-text-primary">{visitor.visitorName}</p>
                          <p className="truncate text-xs font-semibold text-text-secondary">{visitor.purpose} · {formatShortTime(visitor.entryTime || visitor.expectedAt, language)}</p>
                        </div>
                      </div>
                      <span className="ml-2 shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-amber-800">{t(visitor.status.replace("_", " "))}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col rounded-[2.5rem_2rem_2.5rem_2rem] border border-border bg-white p-5 shadow-sm dark:bg-slate-900 lg:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-black tracking-tight text-text-primary">{t("Discussion Forum")}</h3>
                  <Link href="/forum" className="text-xs font-black text-text-secondary hover:text-text-primary">{t("View All")}</Link>
                </div>
                <div className="flex-1 space-y-3">
                  {forumThreads.length === 0 ? <EmptyMiniState text={t("No discussions yet.")} /> : forumThreads.slice(0, 3).map((thread) => (
                    <Link key={thread.id} href="/forum" className="block rounded-2xl border border-border bg-surface p-3.5 transition-all hover:bg-white hover:shadow-sm dark:hover:bg-slate-800">
                      <h4 className="line-clamp-1 text-sm font-black text-text-primary">{thread.title}</h4>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="truncate text-xs font-semibold text-text-secondary">{thread.author?.name || t("Resident")}</span>
                        <span className="flex items-center gap-1.5 text-xs font-black text-text-secondary"><MessageSquare className="h-3.5 w-3.5" />{thread._count?.replies || 0}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between px-1">
                <h3 className="text-xl font-black tracking-tight text-text-primary">{t("Community Quick Links")}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
                {[
                  { href: "/amenities", label: "Amenities", icon: Building2, bg: "from-teal-400 to-emerald-500", shadow: "shadow-emerald-500/30" },
                  { href: "/complaints", label: "Helpdesk", icon: AlertTriangle, bg: "from-rose-400 to-pink-500", shadow: "shadow-rose-500/30" },
                  { href: "/directory", label: "Directory", icon: BookOpen, bg: "from-violet-400 to-purple-500", shadow: "shadow-violet-500/30" },
                  { href: "/events", label: "Events", icon: CalendarCheck, bg: "from-amber-400 to-orange-500", shadow: "shadow-orange-500/30" },
                  { href: "/marketplace", label: "Buy & Sell", icon: ShoppingBag, bg: "from-sky-400 to-blue-500", shadow: "shadow-blue-500/30" },
                  { href: "/parking", label: "Parking", icon: Car, bg: "from-lime-400 to-emerald-500", shadow: "shadow-lime-500/30" },
                  { href: "/polls", label: "Polls", icon: Vote, bg: "from-fuchsia-400 to-purple-500", shadow: "shadow-fuchsia-500/30" },
                  { href: "/documents", label: "Docs", icon: FolderOpen, bg: "from-slate-500 to-slate-700", shadow: "shadow-slate-500/30" },
                ].map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <Link key={service.href} href={service.href} className={`group relative flex flex-col items-center justify-center gap-4 overflow-hidden border border-border bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-lg dark:bg-slate-900 ${index % 2 === 0 ? "rounded-[2rem_2.5rem_2rem_2.5rem]" : "rounded-[2.5rem_2rem_2.5rem_2rem]"}`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${service.bg} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.04]`} />
                      <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.bg} shadow-lg ${service.shadow} transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <span className="relative z-10 text-sm font-black text-text-primary">{t(service.label)}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="flex w-full flex-col gap-6 lg:w-1/3 xl:w-[30%]">
            <div className="relative rounded-[2rem_2.5rem_2rem_2.5rem] border border-border bg-white p-5 shadow-sm dark:bg-slate-900 lg:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-black tracking-tight text-text-primary">{t("Announcements")}</h3>
                <Link href="/notices" className="flex h-8 w-8 items-center justify-center rounded-full bg-surface"><MoreHorizontal className="h-5 w-5 text-text-secondary" /></Link>
              </div>
              <div className="relative h-[170px] overflow-hidden">
                {notices.length === 0 ? <EmptyMiniState text={t("No notices posted yet.")} /> : (
                  <div className="space-y-4 border-l-2 border-border pl-4">
                    {notices.slice(0, 4).map((notice, index) => (
                      <div key={notice.id} className="relative">
                        <span className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white dark:ring-slate-900 ${index === 0 ? "bg-primary" : "bg-slate-300"}`} />
                        <p className="mb-1 text-[11px] font-black uppercase tracking-wider text-primary">{formatShortDate(notice.createdAt, language)}</p>
                        <h4 className="line-clamp-1 text-sm font-black text-text-primary">{notice.title}</h4>
                        <p className="mt-1 text-xs font-semibold text-text-secondary">{notice.category}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-24 items-end justify-center rounded-b-[2rem] bg-gradient-to-t from-white via-white to-transparent pb-5 dark:from-slate-900 dark:via-slate-900">
                <Link href="/notices" className="pointer-events-auto text-sm font-black text-primary hover:underline">{t("View All Notices")}</Link>
              </div>
            </div>

            <div className="relative rounded-[2.5rem_2rem_2.5rem_2rem] border border-border bg-white p-5 shadow-sm dark:bg-slate-900 lg:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-black tracking-tight text-text-primary">{t("Events & Calendar")}</h3>
                <Link href="/events" className="flex h-8 w-8 items-center justify-center rounded-full bg-surface"><CalendarCheck className="h-5 w-5 text-text-secondary" /></Link>
              </div>
              <div className="relative h-[170px] overflow-hidden">
                {events.length === 0 ? <EmptyMiniState text={t("No upcoming events.")} /> : (
                  <div className="space-y-1">
                    {events.slice(0, 4).map((event) => (
                      <Link key={event.id} href="/events" className="group flex items-center gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-border hover:bg-surface">
                        <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                          <span className="text-[10px] font-black uppercase leading-tight text-primary">{new Date(event.startDate).toLocaleDateString(language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-IN", { month: "short" })}</span>
                          <span className="text-lg font-black leading-none text-primary">{new Date(event.startDate).getDate()}</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-black text-text-primary">{event.title}</h4>
                          <p className="mt-0.5 truncate text-xs font-semibold text-text-secondary">{event.venue || t("Society")} · {formatShortTime(event.startDate, language)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-24 items-end justify-center rounded-b-[2rem] bg-gradient-to-t from-white via-white to-transparent pb-5 dark:from-slate-900 dark:via-slate-900">
                <Link href="/events" className="pointer-events-auto text-sm font-black text-primary hover:underline">{t("View All Events")}</Link>
              </div>
            </div>

            <Link href="/parking" className="group relative block h-[220px] overflow-hidden rounded-[2rem_2.5rem_2rem_2.5rem] border border-border bg-white shadow-sm transition-all duration-500 hover:border-emerald-200 dark:bg-slate-900">
              <div className="absolute bottom-0 right-0 z-0 h-44 w-56">
                <img src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80" alt={t("Parking")} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff_0%,#fff_30%,transparent_100%)] dark:bg-[linear-gradient(to_right,#111827_0%,#111827_30%,transparent_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,#fff_0%,transparent_60%)] dark:bg-[linear-gradient(to_top,#111827_0%,transparent_60%)]" />
              </div>
              <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 lg:p-7">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col items-start gap-2">
                    <h3 className="text-xl font-black tracking-tight text-text-primary">{t("Parking")}</h3>
                    <div className="flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1.5 shadow-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">{parkingSlot ? t("Assigned") : t("Not assigned")}</span>
                    </div>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white shadow-sm transition-colors group-hover:border-emerald-200 group-hover:bg-emerald-50 dark:bg-slate-800 dark:group-hover:bg-emerald-950">
                    <Car className="h-5 w-5 text-text-secondary transition-colors group-hover:text-emerald-600" />
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-text-secondary">{t("Assigned Slot")}</p>
                  <div className="flex items-end gap-3">
                    <h3 className="font-mono text-4xl font-black tracking-tight text-text-primary lg:text-5xl">{parkingSlot?.slotNumber || "--"}</h3>
                    <span className="pb-1 text-sm font-black text-text-secondary lg:pb-1.5">{parkingSlot?.level || parkingSlot?.wing || t("Parking")}</span>
                  </div>
                </div>
              </div>
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, loaded } = useUser();
  const [expanded, setExpanded] = useState("");
  const isAdmin = admin.includes(user?.role || "");
  const { t } = useI18n();

  const { data, loading, isStale } = useLiveData<DashboardData>({ url: "/api/dashboard", interval: 60_000, enabled: true });
  const { data: myBills } = useLiveData<MyBillsData>({
    url: "/api/my-bills",
    interval: 60_000,
    enabled: loaded && !isAdmin && !!user?.flatNumber,
  });
  const { data: residentBootstrap } = useLiveData<ResidentBootstrapData>({
    url: "/api/mobile/bootstrap",
    interval: 120_000,
    enabled: loaded && !isAdmin,
  });

  const visibleCategories = useMemo(() => {
    const role = user?.role || "member";
    const filtered = categories
      .map((category) => ({ ...category, modules: category.modules.filter((module) => module.roles.includes(role)) }))
      .filter((category) => category.modules.length > 0);
    if (!admin.includes(role)) return filtered;

    const adminOrder = ["management", "operations", "finance", "legal", "community", "governance"];
    return [...filtered].sort((a, b) => adminOrder.indexOf(a.id) - adminOrder.indexOf(b.id));
  }, [user?.role]);

  const dueAmount = isAdmin ? data?.pendingAmount || 0 : myBills?.stats.totalPending || 0;
  const paidAmount = isAdmin ? data?.totalCollected || 0 : myBills?.stats.totalPaid || 0;

  if (loaded && !isAdmin) {
    return (
      <ResidentDashboard
        user={user}
        data={data}
        myBills={myBills}
        bootstrap={residentBootstrap}
      />
    );
  }

  return (
    <div className="-m-4 min-h-full bg-[#fbf7f5] p-4 dark:bg-[#07111f] lg:-m-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/85 sm:p-7">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                  {t(roleLabels[user?.role || ""] || user?.role || "User")}
                </span>
                {isStale && <RefreshCw className="h-4 w-4 animate-spin text-primary" />}
              </div>
              <h1 className="text-3xl font-black tracking-tight text-text-primary sm:text-5xl">{t("Manage Society")}</h1>
              <p className="mt-2 text-sm text-text-secondary">
                {t(greeting().charAt(0).toUpperCase() + greeting().slice(1))}, {user?.name || t("User")} · {user?.societyName || t("Your society")} {user?.flatNumber ? `· ${t("Flat")} ${user.flatNumber}` : ""}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[360px] lg:grid-cols-2">
              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4 dark:bg-primary/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{isAdmin ? t("Pending") : t("My Dues")}</p>
                <p className="mt-1 text-xl font-black text-primary">{formatCurrency(dueAmount)}</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/40">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{isAdmin ? t("Collected") : t("Paid")}</p>
                <p className="mt-1 text-xl font-black text-emerald-700">{formatCurrency(paidAmount)}</p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/40">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{t("Visitors")}</p>
                <p className="mt-1 text-xl font-black text-amber-700">{loading ? "--" : data?.visitorsToday || 0}</p>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/60 dark:bg-blue-950/40">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{t("Helpdesk")}</p>
                <p className="mt-1 text-xl font-black text-blue-700">{loading ? "--" : data?.openComplaints || 0}</p>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
          {visibleCategories.map((category) => (
            <motion.div key={category.id} layout className={expanded === category.id ? "space-y-3 md:col-span-2" : "space-y-3"}>
              <CategoryCard
                category={category}
                expanded={expanded === category.id}
                count={category.modules.length}
                onClick={() => setExpanded((current) => current === category.id ? "" : category.id)}
              />
              <AnimatePresence initial={false}>
                {expanded === category.id && (
                  <CategoryWorkspace category={category} isAdmin={isAdmin} />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link href={isAdmin ? "/maintenance" : "/my-bills"} className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-slate-900">
            <Receipt className="mb-4 h-6 w-6 text-primary" />
            <h3 className="font-black text-text-primary">{isAdmin ? t("Raise invoices") : t("Pay bills")}</h3>
            <p className="mt-1 text-xs text-text-secondary">{t("Fast access to the most common finance action.")}</p>
          </Link>
          <Link href={isAdmin ? "/visitors" : "/my-visitors"} className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-slate-900">
            <Shield className="mb-4 h-6 w-6 text-emerald-600" />
            <h3 className="font-black text-text-primary">{isAdmin ? t("Gate activity") : t("Approve visitors")}</h3>
            <p className="mt-1 text-xs text-text-secondary">{t("Visitor and security flows in one tap.")}</p>
          </Link>
          <Link href="/notices" className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-slate-900">
            <BellRing className="mb-4 h-6 w-6 text-amber-600" />
            <h3 className="font-black text-text-primary">{t("Latest updates")}</h3>
            <p className="mt-1 text-xs text-text-secondary">{t("Announcements and important society communication.")}</p>
          </Link>
        </section>
      </div>
    </div>
  );
}
