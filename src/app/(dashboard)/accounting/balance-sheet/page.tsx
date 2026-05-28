"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Download } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useLiveData } from "@/lib/use-live-data";

type BalanceSheetReport = {
  asOf: string;
  assets: { code: string; name: string; balance: number }[];
  liabilities: { code: string; name: string; balance: number }[];
  equity: { code: string; name: string; balance: number }[];
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  isBalanced: boolean;
};

export default function BalanceSheetPage() {
  const [asOf, setAsOf] = useState(new Date().toISOString().split("T")[0]);
  const [applied, setApplied] = useState(asOf);

  const { data, loading } = useLiveData<{ report: BalanceSheetReport }>({
    url: `/api/accounting/balance-sheet?asOf=${applied}`,
    interval: 0,
    deps: [applied],
  });

  const report = data?.report;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Balance Sheet</h1>
          <p className="text-sm text-gray-500">Assets = Liabilities + Equity</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">As of</span>
          <input type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          <button onClick={() => setApplied(asOf)}
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

      {report && (
        <>
          {/* Balance indicator */}
          <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${report.isBalanced ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
            {report.isBalanced
              ? <><CheckCircle className="h-4 w-4" /> Books are balanced</>
              : <><XCircle className="h-4 w-4" /> Books are NOT balanced — review journal entries</>}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Assets */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-gray-700 border-b pb-2">Assets</h2>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-50">
                  {report.assets.map((a) => (
                    <tr key={a.code}>
                      <td className="py-2 text-gray-600">{a.name}</td>
                      <td className="py-2 text-right font-medium text-gray-900">{formatCurrency(a.balance)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-800 bg-blue-50">
                    <td className="py-3 font-bold text-blue-900">Total Assets</td>
                    <td className="py-3 text-right font-bold text-blue-900">{formatCurrency(report.totalAssets)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Liabilities + Equity */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-base font-semibold text-gray-700 border-b pb-2">Liabilities</h2>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-50">
                    {report.liabilities.map((l) => (
                      <tr key={l.code}>
                        <td className="py-2 text-gray-600">{l.name}</td>
                        <td className="py-2 text-right font-medium text-gray-900">{formatCurrency(l.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-200">
                      <td className="py-2 font-semibold text-gray-700">Total Liabilities</td>
                      <td className="py-2 text-right font-semibold text-gray-700">{formatCurrency(report.totalLiabilities)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-base font-semibold text-gray-700 border-b pb-2">Corpus / Equity</h2>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-50">
                    {report.equity.map((e) => (
                      <tr key={e.code}>
                        <td className="py-2 text-gray-600">{e.name}</td>
                        <td className="py-2 text-right font-medium text-gray-900">{formatCurrency(e.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-200">
                      <td className="py-2 font-semibold text-gray-700">Total Equity</td>
                      <td className="py-2 text-right font-semibold text-gray-700">{formatCurrency(report.totalEquity)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="rounded-xl bg-blue-600 px-4 py-3 text-white">
                <div className="flex justify-between font-bold">
                  <span>Total Liabilities + Equity</span>
                  <span>{formatCurrency(report.totalLiabilities + report.totalEquity)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
