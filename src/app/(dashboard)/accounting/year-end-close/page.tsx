"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { CalendarCheck, AlertTriangle, CheckCircle, Shield, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useLiveData } from "@/lib/use-live-data";

type DashboardData = {
  kpis: {
    collectionsYTD: number;
    expensesYTD: number;
    surplusYTD: number;
    gstPayable: number;
    tdsPending: number;
  };
};

const CHECKLIST = [
  { id: "recon", label: "Bank reconciliation completed for all accounts", tip: "Go to Accounting → Bank Reconciliation" },
  { id: "tds", label: "All TDS challans paid & 26Q filed", tip: "Go to Accounting → TDS Management" },
  { id: "gst", label: "All GST returns filed", tip: "Go to Accounting → GST Summary" },
  { id: "dep", label: "Monthly depreciation run for all 12 months", tip: "Go to Accounting → Depreciation" },
  { id: "audit", label: "Auditor review completed (I&E + Balance Sheet)", tip: "Download reports from respective pages" },
  { id: "agm", label: "AGM approval received for financial statements", tip: "Upload minutes in Documents module" },
];

function currentFY() {
  const now = new Date();
  return now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
}

export default function YearEndClosePage() {
  const fy = currentFY();
  const fyLabel = `${fy}-${String(fy + 1).slice(2)}`;
  const fyEndDate = `${fy + 1}-03-31`;

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [closing, setClosing] = useState(false);
  const [closed, setClosed] = useState(false);

  const { data } = useLiveData<DashboardData>({ url: "/api/accounting/dashboard", interval: 0 });
  const kpis = data?.kpis;

  const allChecked = CHECKLIST.every((c) => checked[c.id]);

  const handleClose = async () => {
    if (!allChecked) {
      toast.error("Complete all checklist items before closing");
      return;
    }
    if (!confirm(`This will close all Income & Expense accounts for FY ${fyLabel} and transfer the surplus/deficit to equity. This action cannot be undone. Proceed?`)) {
      return;
    }
    setClosing(true);
    try {
      const res = await fetch("/api/accounting/year-end-close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fiscalYearEnd: fyEndDate }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error);
      }
      toast.success("Year-end closing completed successfully!");
      setClosed(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Year-end close failed");
    } finally {
      setClosing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CalendarCheck className="h-6 w-6 text-orange-600" /> Year-End Closing
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Close FY {fyLabel} (April {fy} – March {fy + 1}) · Transfer surplus/deficit to equity
        </p>
      </div>

      {/* Pre-close summary */}
      {kpis && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-lg font-bold text-emerald-600">{formatCurrency(kpis.collectionsYTD)}</p>
            <p className="text-xs text-gray-500">Total Income (YTD)</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-lg font-bold text-red-500">{formatCurrency(kpis.expensesYTD)}</p>
            <p className="text-xs text-gray-500">Total Expenses (YTD)</p>
          </div>
          <div className={`rounded-2xl border p-4 shadow-sm ${kpis.surplusYTD >= 0 ? "border-blue-200 bg-blue-50" : "border-orange-200 bg-orange-50"}`}>
            <p className={`text-lg font-bold ${kpis.surplusYTD >= 0 ? "text-blue-700" : "text-orange-700"}`}>{formatCurrency(kpis.surplusYTD)}</p>
            <p className="text-xs text-gray-500">{kpis.surplusYTD >= 0 ? "Surplus" : "Deficit"} (to transfer)</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-1">
              {(kpis.tdsPending > 0 || kpis.gstPayable > 0) && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
              <p className="text-lg font-bold text-gray-900">{formatCurrency(kpis.tdsPending + kpis.gstPayable)}</p>
            </div>
            <p className="text-xs text-gray-500">Outstanding Tax (TDS + GST)</p>
          </div>
        </div>
      )}

      {/* Compliance checklist */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-800">Pre-Close Compliance Checklist</h2>
        </div>
        <p className="text-sm text-gray-500">
          Complete all items before closing. This ensures the society&apos;s books are audit-ready.
        </p>
        <div className="space-y-3">
          {CHECKLIST.map((item) => (
            <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={checked[item.id] || false}
                onChange={(e) => setChecked((c) => ({ ...c, [item.id]: e.target.checked }))}
                className="mt-0.5 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <p className={`text-sm font-medium ${checked[item.id] ? "text-emerald-700 line-through" : "text-gray-800"}`}>
                  {item.label}
                </p>
                <p className="text-xs text-gray-400">{item.tip}</p>
              </div>
              {checked[item.id] && <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />}
            </label>
          ))}
        </div>
      </div>

      {/* What happens section */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" /> What happens when you close?
        </h3>
        <ul className="text-sm text-amber-700 space-y-1.5 ml-6 list-disc">
          <li>All <strong>Income</strong> account balances are zeroed out</li>
          <li>All <strong>Expense</strong> account balances are zeroed out</li>
          <li>Net surplus or deficit is transferred to <strong>Current Year Surplus / (Deficit)</strong> equity account (3003)</li>
          <li>A closing journal voucher is posted automatically</li>
          <li>This action <strong>cannot be undone</strong></li>
        </ul>
      </div>

      {/* Close button */}
      {closed ? (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 p-5">
          <CheckCircle className="h-6 w-6 text-emerald-600" />
          <div>
            <p className="font-semibold text-emerald-800">FY {fyLabel} has been closed successfully</p>
            <p className="text-sm text-emerald-600">All income/expense accounts are now zeroed. Check Journal Vouchers for the closing entry.</p>
          </div>
        </div>
      ) : (
        <button
          onClick={handleClose}
          disabled={!allChecked || closing}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
            allChecked && !closing
              ? "bg-orange-600 text-white hover:bg-orange-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {closing ? "Closing..." : `Close FY ${fyLabel}`}
          {!closing && <ArrowRight className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
