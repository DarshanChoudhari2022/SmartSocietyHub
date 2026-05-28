"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Calculator, Play, CheckCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useLiveData } from "@/lib/use-live-data";

type Asset = {
  id: string;
  name: string;
  category: string;
  purchaseAmount: number | null;
  currentValue: number | null;
  isActive: boolean;
};

type DepEntry = {
  id: string;
  assetId: string;
  period: string;
  openingValue: number;
  depreciationAmount: number;
  closingValue: number;
  depreciationRate: number;
  method: string;
  createdAt: string;
};

type DepData = { entries: DepEntry[]; assets: Asset[] };

function currentPeriod() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function DepreciationPage() {
  const [period, setPeriod] = useState(currentPeriod());
  const [running, setRunning] = useState(false);

  const { data, refetch } = useLiveData<DepData>({
    url: `/api/accounting/depreciation?period=${period}`,
    interval: 0,
    deps: [period],
  });

  const entries = data?.entries ?? [];
  const assets = data?.assets ?? [];
  const assetMap = new Map(assets.map((a) => [a.id, a]));

  const handleRun = async () => {
    if (!confirm(`Run depreciation for ${period}? This will create journal entries for each active asset.`)) return;
    setRunning(true);
    try {
      const res = await fetch("/api/accounting/depreciation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error);
      }
      const result = await res.json();
      toast.success(`Depreciation run complete — ${result.processed} asset(s) processed`);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to run depreciation");
    } finally {
      setRunning(false);
    }
  };

  const totalDep = entries.reduce((s, e) => s + e.depreciationAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calculator className="h-6 w-6 text-teal-600" /> Depreciation
          </h1>
          <p className="text-sm text-gray-500">Monthly WDV depreciation on society assets</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
          >
            <Play className="h-4 w-4" />
            {running ? "Running…" : "Run Depreciation"}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{assets.filter((a) => a.isActive).length}</p>
          <p className="text-sm text-gray-500">Active Assets</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-teal-600">{formatCurrency(totalDep)}</p>
          <p className="text-sm text-gray-500">Depreciation for {period}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-2xl font-bold text-gray-600">{entries.length}</p>
          <p className="text-sm text-gray-500">Entries This Period</p>
        </div>
      </div>

      {/* Entries table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Depreciation Entries — {period}</h2>
        </div>
        {entries.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            <Calculator className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p>No depreciation entries for this period.</p>
            <p className="mt-1">Click &quot;Run Depreciation&quot; to compute and post entries.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-500">Asset</th>
                <th className="px-4 py-3 font-medium text-gray-500">Category</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Opening Value</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Depreciation</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Closing Value</th>
                <th className="px-4 py-3 font-medium text-gray-500">Method</th>
                <th className="px-4 py-3 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {entries.map((e) => {
                const asset = assetMap.get(e.assetId);
                return (
                  <tr key={e.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">{asset?.name ?? "Unknown"}</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{asset?.category ?? "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700">{formatCurrency(e.openingValue)}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-red-500">{formatCurrency(e.depreciationAmount)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-gray-700">{formatCurrency(e.closingValue)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{e.method || "WDV"}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatDate(e.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200 bg-gray-50">
                <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-700">Total</td>
                <td className="px-4 py-3 text-right tabular-nums font-bold text-red-600">{formatCurrency(totalDep)}</td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Active assets */}
      {assets.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Society Assets</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 font-medium text-gray-500">Category</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Purchase Cost</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Current Value</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {assets.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900">{a.name}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{a.category}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-700">{a.purchaseAmount ? formatCurrency(a.purchaseAmount) : "—"}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium text-gray-900">{a.currentValue ? formatCurrency(a.currentValue) : "—"}</td>
                  <td className="px-4 py-3">
                    {a.isActive ? (
                      <span className="flex items-center gap-1 text-emerald-600 text-xs"><CheckCircle className="h-3.5 w-3.5" /> Active</span>
                    ) : (
                      <span className="text-xs text-gray-400">Inactive</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
