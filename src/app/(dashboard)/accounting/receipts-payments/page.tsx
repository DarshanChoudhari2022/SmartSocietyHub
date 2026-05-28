"use client";

import { useState } from "react";
import { Receipt, Download, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useLiveData } from "@/lib/use-live-data";

type RPEntry = { date: string; description: string; amount: number; account: string };
type RPReport = {
  from: string;
  to: string;
  receipts: RPEntry[];
  payments: RPEntry[];
  totalReceipts: number;
  totalPayments: number;
  closingBalance: number;
};

function currentFYDates() {
  const now = new Date();
  const fyStart = now.getMonth() >= 3 ? new Date(now.getFullYear(), 3, 1) : new Date(now.getFullYear() - 1, 3, 1);
  return { from: fyStart.toISOString().split("T")[0], to: now.toISOString().split("T")[0] };
}

export default function ReceiptsPaymentsPage() {
  const fy = currentFYDates();
  const [from, setFrom] = useState(fy.from);
  const [to, setTo] = useState(fy.to);
  const [applied, setApplied] = useState({ from: fy.from, to: fy.to });

  const { data, loading } = useLiveData<{ report: RPReport }>({
    url: `/api/accounting/receipts-payments?from=${applied.from}&to=${applied.to}`,
    interval: 0,
    deps: [applied.from, applied.to],
  });

  const report = data?.report;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="h-6 w-6 text-blue-600" /> Receipts & Payments Account
          </h1>
          <p className="text-sm text-gray-500">Cash-basis summary · AGM standard format</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          <span className="text-gray-400 text-sm">to</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          <button onClick={() => setApplied({ from, to })}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Apply</button>
          <button onClick={() => window.print()}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <Download className="h-4 w-4" /> PDF
          </button>
        </div>
      </div>

      {loading && <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />}

      {report && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm text-center">
              <ArrowDownLeft className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-emerald-600">{formatCurrency(report.totalReceipts)}</p>
              <p className="text-sm text-gray-500">Total Receipts</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm text-center">
              <ArrowUpRight className="h-5 w-5 text-red-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-red-500">{formatCurrency(report.totalPayments)}</p>
              <p className="text-sm text-gray-500">Total Payments</p>
            </div>
            <div className={`rounded-2xl border p-5 shadow-sm text-center ${report.closingBalance >= 0 ? "border-blue-100 bg-blue-50" : "border-red-100 bg-red-50"}`}>
              <p className={`text-xl font-bold ${report.closingBalance >= 0 ? "text-blue-700" : "text-red-600"}`}>{formatCurrency(report.closingBalance)}</p>
              <p className="text-sm text-gray-500">Closing Balance</p>
            </div>
          </div>

          {/* Two-column R&P */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ArrowDownLeft className="h-4 w-4 text-emerald-500" /> Receipts
              </h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="pb-2 font-medium text-gray-500">Date</th>
                    <th className="pb-2 font-medium text-gray-500">Description</th>
                    <th className="pb-2 text-right font-medium text-gray-500">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {report.receipts.map((r, i) => (
                    <tr key={i}>
                      <td className="py-2 text-xs text-gray-500">{formatDate(r.date)}</td>
                      <td className="py-2 text-gray-700">{r.description}</td>
                      <td className="py-2 text-right font-medium text-emerald-600">{formatCurrency(r.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-800 bg-gray-50">
                    <td className="py-3 font-bold text-gray-900" colSpan={2}>Total Receipts</td>
                    <td className="py-3 text-right font-bold text-gray-900">{formatCurrency(report.totalReceipts)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-red-400" /> Payments
              </h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="pb-2 font-medium text-gray-500">Date</th>
                    <th className="pb-2 font-medium text-gray-500">Description</th>
                    <th className="pb-2 text-right font-medium text-gray-500">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {report.payments.map((p, i) => (
                    <tr key={i}>
                      <td className="py-2 text-xs text-gray-500">{formatDate(p.date)}</td>
                      <td className="py-2 text-gray-700">{p.description}</td>
                      <td className="py-2 text-right font-medium text-red-500">{formatCurrency(p.amount)}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-gray-200">
                    <td colSpan={2} className="py-2 text-gray-600">Closing Balance</td>
                    <td className="py-2 text-right font-medium text-blue-700">{formatCurrency(report.closingBalance)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-800 bg-gray-50">
                    <td className="py-3 font-bold text-gray-900" colSpan={2}>Total Payments + Balance</td>
                    <td className="py-3 text-right font-bold text-gray-900">{formatCurrency(report.totalReceipts)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
