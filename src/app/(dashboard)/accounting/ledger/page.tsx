"use client";

import { useState } from "react";
import { BookOpen, Download } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useLiveData } from "@/lib/use-live-data";

type LedgerAccount = { id: string; code: string; name: string; type: string };
type LedgerRow = { id: string; date: string; memo: string | null; debit: number; credit: number; balance: number; sourceType: string };
type LedgerData = { account: LedgerAccount; rows: LedgerRow[]; closingBalance: number };
type AccountsData = { accounts: LedgerAccount[] };

const TYPE_COLOR: Record<string, string> = {
  ASSET: "text-blue-600",
  LIABILITY: "text-amber-600",
  EQUITY: "text-purple-600",
  INCOME: "text-emerald-600",
  EXPENSE: "text-red-600",
};

export default function LedgerPage() {
  const [selectedCode, setSelectedCode] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState(new Date().toISOString().split("T")[0]);
  const [applied, setApplied] = useState({ code: "", from: "", to: new Date().toISOString().split("T")[0] });

  const { data: accountsData } = useLiveData<AccountsData>({ url: "/api/accounting/ledger", interval: 0 });

  const params = new URLSearchParams({ accountCode: applied.code });
  if (applied.from) params.set("from", applied.from);
  params.set("to", applied.to);

  const { data: ledgerData, loading } = useLiveData<{ ledger: LedgerData }>({
    url: `/api/accounting/ledger?${params}`,
    interval: 0,
    deps: [applied.code, applied.from, applied.to],
    enabled: !!applied.code,
  });

  const accounts = accountsData?.accounts ?? [];
  const ledger = ledgerData?.ledger;

  const groupedByType: Record<string, LedgerAccount[]> = {};
  for (const a of accounts) {
    if (!groupedByType[a.type]) groupedByType[a.type] = [];
    groupedByType[a.type].push(a);
  }
  const typeOrder = ["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"];

  return (
    <div className="flex gap-4 h-[calc(100vh-120px)]">
      {/* Sidebar account list */}
      <div className="w-64 flex-shrink-0 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3">
          <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600" /> Chart of Accounts
          </p>
        </div>
        <div className="p-2 space-y-3">
          {typeOrder.map((type) => {
            const accs = groupedByType[type];
            if (!accs?.length) return null;
            return (
              <div key={type}>
                <p className={`px-2 py-1 text-xs font-bold uppercase tracking-wider ${TYPE_COLOR[type]}`}>{type}</p>
                {accs.sort((a, b) => a.code.localeCompare(b.code)).map((a) => (
                  <button key={a.code} onClick={() => setSelectedCode(a.code)}
                    className={`w-full text-left rounded-lg px-3 py-2 text-sm transition ${selectedCode === a.code ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>
                    <span className="font-mono text-xs text-gray-400 mr-2">{a.code}</span>
                    {a.name}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main ledger area */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {/* Filters */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">From</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            <span className="text-sm text-gray-500">to</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <button
            onClick={() => { if (selectedCode) setApplied({ code: selectedCode, from, to }); }}
            disabled={!selectedCode}
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40">
            View Ledger
          </button>
          {ledger && (
            <button onClick={() => window.print()}
              className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 ml-auto">
              <Download className="h-4 w-4" /> PDF
            </button>
          )}
        </div>

        {!selectedCode && (
          <div className="rounded-2xl border border-dashed border-gray-200 p-16 text-center text-gray-400">
            <BookOpen className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Select an account from the left panel to view its ledger</p>
          </div>
        )}

        {loading && selectedCode && <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />}

        {ledger && (
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-gray-400 mr-2">{ledger.account.code}</span>
                <span className="font-semibold text-gray-900">{ledger.account.name}</span>
                <span className={`ml-2 text-xs font-medium rounded-full px-2 py-0.5 ${TYPE_COLOR[ledger.account.type]} bg-gray-50`}>{ledger.account.type}</span>
              </div>
              <div className={`text-sm font-semibold ${ledger.closingBalance >= 0 ? "text-blue-700" : "text-red-600"}`}>
                Closing: {formatCurrency(Math.abs(ledger.closingBalance))} {ledger.closingBalance >= 0 ? "Dr" : "Cr"}
              </div>
            </div>

            {ledger.rows.length === 0 ? (
              <p className="p-8 text-center text-sm text-gray-400">No entries in this period</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Description</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Source</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Debit (₹)</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Credit (₹)</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Balance (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ledger.rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-2.5 text-xs text-gray-500">{formatDate(row.date)}</td>
                      <td className="px-4 py-2.5 text-gray-700">{row.memo ?? "—"}</td>
                      <td className="px-4 py-2.5">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{row.sourceType}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-red-500">{row.debit > 0 ? formatCurrency(row.debit) : "—"}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-emerald-600">{row.credit > 0 ? formatCurrency(row.credit) : "—"}</td>
                      <td className={`px-4 py-2.5 text-right tabular-nums font-medium ${row.balance >= 0 ? "text-blue-700" : "text-red-600"}`}>
                        {formatCurrency(Math.abs(row.balance))}{row.balance < 0 ? " Cr" : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
