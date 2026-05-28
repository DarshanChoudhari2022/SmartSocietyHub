"use client";

import { useState } from "react";
import { Scale, Download } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useLiveData } from "@/lib/use-live-data";

type TrialBalanceRow = {
  accountId: string;
  code: string;
  name: string;
  type: string;
  debit: number;
  credit: number;
  balance: number;
};

const TYPE_ORDER: Record<string, number> = { ASSET: 1, LIABILITY: 2, EQUITY: 3, INCOME: 4, EXPENSE: 5 };
const TYPE_COLOR: Record<string, string> = {
  ASSET: "text-blue-700 bg-blue-50",
  LIABILITY: "text-amber-700 bg-amber-50",
  EQUITY: "text-purple-700 bg-purple-50",
  INCOME: "text-emerald-700 bg-emerald-50",
  EXPENSE: "text-red-700 bg-red-50",
};

export default function TrialBalancePage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState(new Date().toISOString().split("T")[0]);
  const [applied, setApplied] = useState({ from: "", to: new Date().toISOString().split("T")[0] });

  const params = new URLSearchParams();
  if (applied.from) params.set("from", applied.from);
  params.set("to", applied.to);

  const { data, loading } = useLiveData<{ trialBalance: { rows: TrialBalanceRow[]; totals: { debit: number; credit: number } } }>({
    url: `/api/accounting/reports/trial-balance?${params}`,
    interval: 0,
    deps: [applied.from, applied.to],
  });

  const tb = data?.trialBalance;
  const sorted = tb?.rows
    .filter((r) => r.debit !== 0 || r.credit !== 0)
    .sort((a, b) => (TYPE_ORDER[a.type] ?? 9) - (TYPE_ORDER[b.type] ?? 9) || a.code.localeCompare(b.code));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Scale className="h-6 w-6 text-blue-600" /> Trial Balance
          </h1>
          <p className="text-sm text-gray-500">All ledger accounts with debit/credit totals</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="From (optional)"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          <span className="text-gray-400 text-sm">to</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          <button onClick={() => setApplied({ from, to })}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Apply
          </button>
          <button onClick={() => window.print()}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <Download className="h-4 w-4" /> PDF
          </button>
        </div>
      </div>

      {loading && <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />}

      {sorted && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Code</th>
                <th className="px-4 py-3 font-medium text-gray-600">Account Name</th>
                <th className="px-4 py-3 font-medium text-gray-600">Type</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Debit (₹)</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Credit (₹)</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Balance (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.map((row) => (
                <tr key={row.accountId} className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{row.code}</td>
                  <td className="px-4 py-2.5 text-gray-800">{row.name}</td>
                  <td className="px-4 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLOR[row.type] ?? ""}`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-gray-700">{row.debit > 0 ? formatCurrency(row.debit) : "—"}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-gray-700">{row.credit > 0 ? formatCurrency(row.credit) : "—"}</td>
                  <td className={`px-4 py-2.5 text-right tabular-nums font-medium ${row.balance >= 0 ? "text-blue-700" : "text-red-600"}`}>
                    {formatCurrency(Math.abs(row.balance))}{row.balance < 0 ? " Cr" : " Dr"}
                  </td>
                </tr>
              ))}
            </tbody>
            {tb && (
              <tfoot className="border-t-2 border-gray-800 bg-gray-50 font-bold">
                <tr>
                  <td className="px-4 py-3" colSpan={3}>Totals</td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-900">{formatCurrency(tb.totals.debit)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-900">{formatCurrency(tb.totals.credit)}</td>
                  <td className={`px-4 py-3 text-right text-sm ${Math.abs(tb.totals.debit - tb.totals.credit) < 1 ? "text-emerald-600" : "text-red-600"}`}>
                    {Math.abs(tb.totals.debit - tb.totals.credit) < 1 ? "✓ Balanced" : "✗ Unbalanced"}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  );
}
