"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Download } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useLiveData } from "@/lib/use-live-data";

type IEReport = {
  from: string;
  to: string;
  income: { code: string; name: string; amount: number }[];
  expenses: { code: string; name: string; amount: number }[];
  totalIncome: number;
  totalExpense: number;
  surplus: number;
};

function currentFYDates() {
  const now = new Date();
  const fyStart = now.getMonth() >= 3
    ? new Date(now.getFullYear(), 3, 1)
    : new Date(now.getFullYear() - 1, 3, 1);
  return {
    from: fyStart.toISOString().split("T")[0],
    to: now.toISOString().split("T")[0],
  };
}

export default function IncomeExpenditurePage() {
  const fy = currentFYDates();
  const [from, setFrom] = useState(fy.from);
  const [to, setTo] = useState(fy.to);
  const [applied, setApplied] = useState({ from: fy.from, to: fy.to });

  const { data, loading } = useLiveData<{ report: IEReport }>({
    url: `/api/accounting/income-expenditure?from=${applied.from}&to=${applied.to}`,
    interval: 0,
    deps: [applied.from, applied.to],
  });

  const report = data?.report;

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Income & Expenditure Statement</h1>
          <p className="text-sm text-gray-500">Not-for-profit format · AGM ready</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          <span className="text-gray-400 text-sm">to</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          <button
            onClick={() => setApplied({ from, to })}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Apply
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" /> Print / PDF
          </button>
        </div>
      </div>

      {loading && <div className="h-64 animate-pulse rounded-2xl bg-gray-100" />}

      {report && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden print:border-0 print:shadow-none">
          {/* Print header */}
          <div className="hidden print:block p-4 text-center border-b">
            <h2 className="text-xl font-bold">Income & Expenditure Statement</h2>
            <p className="text-sm text-gray-500">Period: {applied.from} to {applied.to}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            {/* Expenditure (left) */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="h-5 w-5 text-red-400" />
                <h2 className="text-base font-semibold text-gray-700">Expenditure</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="pb-2 font-medium text-gray-500">Head</th>
                    <th className="pb-2 text-right font-medium text-gray-500">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {report.expenses.map((e) => (
                    <tr key={e.code}>
                      <td className="py-2 text-gray-700">{e.name}</td>
                      <td className="py-2 text-right text-red-600 font-medium">{formatCurrency(e.amount)}</td>
                    </tr>
                  ))}
                  {report.surplus >= 0 && (
                    <tr className="border-t-2 border-gray-300 font-semibold">
                      <td className="pt-3 text-emerald-700">Surplus (transferred to Corpus)</td>
                      <td className="pt-3 text-right text-emerald-700">{formatCurrency(report.surplus)}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-800 bg-gray-50">
                    <td className="py-3 font-bold text-gray-900">Total Expenditure</td>
                    <td className="py-3 text-right font-bold text-gray-900">{formatCurrency(report.totalExpense + (report.surplus >= 0 ? report.surplus : 0))}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Income (right) */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <h2 className="text-base font-semibold text-gray-700">Income</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="pb-2 font-medium text-gray-500">Head</th>
                    <th className="pb-2 text-right font-medium text-gray-500">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {report.income.map((i) => (
                    <tr key={i.code}>
                      <td className="py-2 text-gray-700">{i.name}</td>
                      <td className="py-2 text-right text-emerald-600 font-medium">{formatCurrency(i.amount)}</td>
                    </tr>
                  ))}
                  {report.surplus < 0 && (
                    <tr className="border-t-2 border-gray-300 font-semibold">
                      <td className="pt-3 text-red-600">Deficit (transferred from Corpus)</td>
                      <td className="pt-3 text-right text-red-600">{formatCurrency(Math.abs(report.surplus))}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-800 bg-gray-50">
                    <td className="py-3 font-bold text-gray-900">Total Income</td>
                    <td className="py-3 text-right font-bold text-gray-900">{formatCurrency(report.totalIncome + (report.surplus < 0 ? Math.abs(report.surplus) : 0))}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Summary banner */}
          <div className={`p-4 text-center font-semibold text-sm ${report.surplus >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
            {report.surplus >= 0
              ? `Net Surplus for the period: ${formatCurrency(report.surplus)}`
              : `Net Deficit for the period: (${formatCurrency(Math.abs(report.surplus))})`}
          </div>
        </div>
      )}
    </div>
  );
}
