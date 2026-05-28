"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Building2, Plus, Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useLiveData } from "@/lib/use-live-data";

type GSTReturn = {
  id: string;
  period: string;
  outputTax: number;
  inputTax: number;
  netTax: number;
  lateFee: number;
  totalPayable: number;
  status: string;
  filedAt: string | null;
  challanNumber: string | null;
};

type GSTData = {
  summary: { outputTax: number; inputTax: number; netPayable: number };
  returns: GSTReturn[];
};

const STATUS_COLOR: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  FILED: "bg-blue-50 text-blue-700",
  PAID: "bg-emerald-50 text-emerald-700",
};

function currentFY() {
  const now = new Date();
  return now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
}

export default function GSTPage() {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    period: new Date().toISOString().slice(0, 7),
    gstNumber: "",
    outputTax: "",
    inputTax: "",
    lateFee: "",
    notes: "",
  });

  const fyStart = new Date(currentFY(), 3, 1).toISOString();
  const fyEnd = new Date().toISOString();

  const { data, refetch } = useLiveData<GSTData>({
    url: `/api/accounting/gst-summary?from=${fyStart}&to=${fyEnd}`,
    interval: 60_000,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.period) { toast.error("Period is required"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/accounting/gst-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast.success("GST return saved");
      setShowForm(false);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally { setSaving(false); }
  };

  const summary = data?.summary;
  const returns = data?.returns ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-purple-600" /> GST Summary
          </h1>
          <p className="text-sm text-gray-500">18% GST on maintenance above ₹7,500/month · SAC 9972</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
          <Plus className="h-4 w-4" /> File Return
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-700">
        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <span>GST @ 18% applies only if maintenance charges exceed ₹7,500/month per member. Societies with annual turnover below ₹20 lakh are exempt from registration.</span>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-2xl font-bold text-amber-600">{formatCurrency(summary.outputTax)}</p>
            <p className="text-sm text-gray-500">Output Tax Collected (YTD)</p>
            <p className="text-xs text-gray-400">GST charged on maintenance bills</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(summary.inputTax)}</p>
            <p className="text-sm text-gray-500">Input Tax Credit (YTD)</p>
            <p className="text-xs text-gray-400">GST paid on eligible expenses</p>
          </div>
          <div className={`rounded-2xl border p-5 shadow-sm ${summary.netPayable > 0 ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"}`}>
            <p className={`text-2xl font-bold ${summary.netPayable > 0 ? "text-red-700" : "text-emerald-700"}`}>{formatCurrency(Math.abs(summary.netPayable))}</p>
            <p className="text-sm text-gray-600">{summary.netPayable > 0 ? "Net GST Payable" : "Input Credit Excess"}</p>
          </div>
        </div>
      )}

      {/* Returns table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">GST Return History</h2>
        </div>
        {returns.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-400">No GST returns filed yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-500">Period</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Output Tax</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Input Credit</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Net Payable</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Late Fee</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {returns.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.period}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-700">{formatCurrency(r.outputTax)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-700">{formatCurrency(r.inputTax)}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium text-gray-900">{formatCurrency(r.netTax)}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-500">{r.lateFee > 0 ? formatCurrency(r.lateFee) : "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[r.status] ?? ""}`}>{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">File / Update GST Return</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Period *</label>
                <input type="month" value={form.period} onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">GST Registration No.</label>
                <input placeholder="27XXXXX..." value={form.gstNumber} onChange={(e) => setForm((f) => ({ ...f, gstNumber: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 uppercase" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Output Tax (₹)</label>
                <input type="number" min="0" value={form.outputTax} onChange={(e) => setForm((f) => ({ ...f, outputTax: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Input Credit (₹)</label>
                <input type="number" min="0" value={form.inputTax} onChange={(e) => setForm((f) => ({ ...f, inputTax: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Late Fee (₹)</label>
                <input type="number" min="0" value={form.lateFee} onChange={(e) => setForm((f) => ({ ...f, lateFee: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
              <textarea rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={saving}
                className="flex-1 rounded-xl bg-purple-600 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-60">
                {saving ? "Saving…" : "Save Return"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
