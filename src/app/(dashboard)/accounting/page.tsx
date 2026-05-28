"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertCircle,
  BarChart3,
  Receipt,
  Scale,
  Building2,
  RefreshCcw,
  FileText,
  ChevronRight,
  Landmark,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useLiveData } from "@/lib/use-live-data";
import { formatCurrency } from "@/lib/utils";

type DashboardData = {
  kpis: {
    collectionsThisMonth: number;
    collectionsYTD: number;
    expensesThisMonth: number;
    expensesYTD: number;
    surplusYTD: number;
    outstandingReceivables: number;
    gstPayable: number;
    tdsPending: number;
    budgetUtilization: number;
    bankAccounts: number;
  };
  recentIncome: { code: string; name: string; amount: number }[];
  recentExpenses: { code: string; name: string; amount: number }[];
};

const QUICK_LINKS = [
  { href: "/accounting/trial-balance", label: "Trial Balance", icon: Scale, desc: "Debit / Credit totals per account" },
  { href: "/accounting/income-expenditure", label: "Income & Expenditure", icon: TrendingUp, desc: "I&E statement — AGM ready" },
  { href: "/accounting/balance-sheet", label: "Balance Sheet", icon: BarChart3, desc: "Assets, liabilities & equity" },
  { href: "/accounting/receipts-payments", label: "Receipts & Payments", icon: Receipt, desc: "Cash-basis R&P account" },
  { href: "/accounting/ledger", label: "Account Ledger", icon: BookOpen, desc: "Per-account statement" },
  { href: "/accounting/journal-vouchers", label: "Journal Vouchers", icon: FileText, desc: "Post & review JVs" },
  { href: "/accounting/bank-reconciliation", label: "Bank Reconciliation", icon: Landmark, desc: "Match bank vs books" },
  { href: "/accounting/tds", label: "TDS Management", icon: ShieldCheck, desc: "Form 26Q & challans" },
  { href: "/accounting/gst", label: "GST Summary", icon: Building2, desc: "Output tax vs input tax" },
  { href: "/accounting/depreciation", label: "Depreciation", icon: RefreshCcw, desc: "Monthly WDV asset depreciation" },
  { href: "/accounting/year-end-close", label: "Year-End Close", icon: Scale, desc: "Annual closing & surplus transfer" },
  { href: "/accounting/opening-balance", label: "Opening Balances", icon: BookOpen, desc: "Enter starting balances for new society" },
];

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  positive,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  accent: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
        {positive !== undefined && (
          positive
            ? <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            : <ArrowDownRight className="h-4 w-4 text-red-400" />
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export default function AccountingPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, loading } = useLiveData<DashboardData>({
    url: "/api/accounting/dashboard",
    interval: 120_000,
    deps: [refreshKey],
  });

  const kpis = data?.kpis;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounting</h1>
          <p className="text-sm text-gray-500 mt-0.5">Double-entry books, statutory reports & compliance</p>
        </div>
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* KPI Grid */}
      {loading && !kpis ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : kpis ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiCard
            label="Collections This Month"
            value={formatCurrency(kpis.collectionsThisMonth)}
            sub={`YTD: ${formatCurrency(kpis.collectionsYTD)}`}
            icon={TrendingUp}
            accent="bg-emerald-50 text-emerald-600"
            positive
          />
          <KpiCard
            label="Expenses This Month"
            value={formatCurrency(kpis.expensesThisMonth)}
            sub={`YTD: ${formatCurrency(kpis.expensesYTD)}`}
            icon={TrendingDown}
            accent="bg-red-50 text-red-500"
          />
          <KpiCard
            label="YTD Surplus / (Deficit)"
            value={formatCurrency(kpis.surplusYTD)}
            icon={Wallet}
            accent={kpis.surplusYTD >= 0 ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-500"}
            positive={kpis.surplusYTD >= 0}
          />
          <KpiCard
            label="Outstanding Receivables"
            value={formatCurrency(kpis.outstandingReceivables)}
            sub="Dues from members"
            icon={AlertCircle}
            accent="bg-amber-50 text-amber-600"
          />
          <KpiCard
            label="GST Payable (YTD)"
            value={formatCurrency(kpis.gstPayable)}
            sub="Output − Input tax"
            icon={Building2}
            accent="bg-purple-50 text-purple-600"
          />
          <KpiCard
            label="TDS Pending"
            value={formatCurrency(kpis.tdsPending)}
            sub="Deducted, not yet remitted"
            icon={ShieldCheck}
            accent="bg-indigo-50 text-indigo-600"
          />
          <KpiCard
            label="Budget Utilization"
            value={`${kpis.budgetUtilization}%`}
            sub="Actual vs planned spend"
            icon={BarChart3}
            accent={kpis.budgetUtilization > 90 ? "bg-red-50 text-red-500" : "bg-teal-50 text-teal-600"}
          />
          <KpiCard
            label="Bank Accounts Linked"
            value={String(kpis.bankAccounts)}
            sub="For reconciliation"
            icon={Landmark}
            accent="bg-gray-100 text-gray-600"
          />
        </div>
      ) : null}

      {/* Quick Links Grid */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-800">Accounting Modules</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map(({ href, label, icon: Icon, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/30 hover:shadow"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-500 truncate">{desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-300" />
            </Link>
          ))}
        </div>
      </div>

      {/* Chairman's Quick-Start Guide */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Chairman&apos;s Accounting Guide</h2>
        <p className="text-xs text-gray-500 mb-4">Follow these steps every month to keep your society compliant</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { step: 1, title: "Set Up (One-Time)", desc: "Enter Opening Balances → Link Bank Accounts → Review Chart of Accounts", link: "/accounting/opening-balance" },
            { step: 2, title: "Record Daily Transactions", desc: "Expenses, salary payments, and maintenance collections auto-post to ledger", link: "/accounting/journal-vouchers" },
            { step: 3, title: "Monthly Reconciliation", desc: "Upload bank statement → Match transactions → Resolve differences", link: "/accounting/bank-reconciliation" },
            { step: 4, title: "Run Monthly Depreciation", desc: "Click Run Depreciation to compute WDV for all society assets", link: "/accounting/depreciation" },
            { step: 5, title: "File GST & TDS", desc: "Review GST summary → File returns → Record TDS challans quarterly", link: "/accounting/gst" },
            { step: 6, title: "Check Trial Balance", desc: "Ensure debits = credits. If not, check for unposted transactions", link: "/accounting/trial-balance" },
            { step: 7, title: "Generate Reports for AGM", desc: "Income & Expenditure + Balance Sheet → Share with auditor", link: "/accounting/income-expenditure" },
            { step: 8, title: "Year-End Closing (Annual)", desc: "Complete checklist → Close FY → Transfer surplus to equity", link: "/accounting/year-end-close" },
          ].map((s) => (
            <Link key={s.step} href={s.link}
              className="flex gap-3 rounded-xl border border-gray-100 bg-white p-3 hover:border-blue-200 hover:bg-blue-50/30 transition group">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 text-sm font-bold group-hover:bg-blue-200">
                {s.step}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{s.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* This Month Breakdown */}
      {data && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Income This Month
            </h3>
            {data.recentIncome.length === 0 ? (
              <p className="text-sm text-gray-400">No income entries this month</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {data.recentIncome.map((r) => (
                  <li key={r.code} className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">{r.name}</span>
                    <span className="text-sm font-medium text-emerald-600">{formatCurrency(r.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-700 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-400" /> Expenses This Month
            </h3>
            {data.recentExpenses.length === 0 ? (
              <p className="text-sm text-gray-400">No expense entries this month</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {data.recentExpenses.map((r) => (
                  <li key={r.code} className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">{r.name}</span>
                    <span className="text-sm font-medium text-red-500">{formatCurrency(r.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
