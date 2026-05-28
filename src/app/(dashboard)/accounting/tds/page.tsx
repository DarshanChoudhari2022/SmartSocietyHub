"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ShieldCheck, Plus, AlertTriangle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useLiveData } from "@/lib/use-live-data";

type TDSChallan = {
  id: string;
  quarter: string;
  challanNumber: string | null;
  bsrCode: string | null;
  paymentDate: string | null;
  amount: number;
  totalAmount: number;
  section: string;
  vendorName: string | null;
  vendorPAN: string | null;
  status: string;
  notes: string | null;
};

type TDSData = {
  summary: { tdsDeducted: number; tdsRemitted: number; tdsPending: number };
  challans: TDSChallan[];
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  PAID: "bg-emerald-50 text-emerald-700",
  OVERDUE: "bg-red-50 text-red-700",
};

export default function TDSPage() {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    quarter: "",
    section: "194C",
    vendorName: "",
    vendorPAN: "",
    amount: "",
    challanNumber: "",
    bsrCode: "",
    paymentDate: "",
    notes: "",
  });

  const { data, refetch } = useLiveData<TDSData>({ url: "/api/accounting/tds-summary", interval: 60_000 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.quarter || !form.amount) { toast.error("Quarter and amount are required"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/accounting/tds-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast.success("TDS challan recorded");
      setShowForm(false);
      setForm({ quarter: "", section: "194C", vendorName: "", vendorPAN: "", amount: "", challanNumber: "", bsrCode: "", paymentDate: "", notes: "" });
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally { setSaving(false); }
  };

  const summary = data?.summary;
  const challans = data?.challans ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-indigo-600" /> TDS Management
          </h1>
          <p className="text-sm text-gray-500">Track deductions, challans & Form 26Q data</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> Add Challan
        </button>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.tdsDeducted)}</p>
            <p className="text-sm text-gray-500">TDS Deducted (YTD)</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(summary.tdsRemitted)}</p>
            <p className="text-sm text-gray-500">TDS Remitted</p>
          </div>
          <div className={`rounded-2xl border p-5 shadow-sm ${summary.tdsPending > 0 ? "border-amber-200 bg-amber-50" : "border-gray-100 bg-white"}`}>
            <div className="flex items-center gap-2">
              {summary.tdsPending > 0 && <AlertTriangle className="h-4 w-4 text-amber-500" />}
              <p className={`text-2xl font-bold ${summary.tdsPending > 0 ? "text-amber-700" : "text-gray-900"}`}>{formatCurrency(summary.tdsPending)}</p>
            </div>
            <p className="text-sm text-gray-500">TDS Pending Remittance</p>
          </div>
        </div>
      )}

      {/* Challan list */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">TDS Challans</h2>
        </div>
        {challans.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-400">No challans recorded yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-500">Quarter</th>
                <th className="px-4 py-3 font-medium text-gray-500">Section</th>
                <th className="px-4 py-3 font-medium text-gray-500">Vendor</th>
                <th className="px-4 py-3 font-medium text-gray-500">Challan No.</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Amount</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {challans.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.quarter}</td>
                  <td className="px-4 py-3 text-gray-600">{c.section}</td>
                  <td className="px-4 py-3 text-gray-600">{c.vendorName ?? "—"}<br />{c.vendorPAN && <span className="text-xs text-gray-400">{c.vendorPAN}</span>}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{c.challanNumber ?? "—"}{c.bsrCode && <><br /><span className="text-gray-400">BSR: {c.bsrCode}</span></>}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(c.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[c.status] ?? ""}`}>{c.status}</span>
                    {c.paymentDate && <p className="text-xs text-gray-400 mt-0.5">{formatDate(c.paymentDate)}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add challan modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Record TDS Challan</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Quarter *</label>
                <input placeholder="Q1-2026-27" value={form.quarter} onChange={(e) => setForm((f) => ({ ...f, quarter: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Section</label>
                <select value={form.section} onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                  {["194C", "194J", "194I", "194H"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Vendor Name</label>
                <input value={form.vendorName} onChange={(e) => setForm((f) => ({ ...f, vendorName: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Vendor PAN</label>
                <input value={form.vendorPAN} onChange={(e) => setForm((f) => ({ ...f, vendorPAN: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 uppercase" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Amount (₹) *</label>
                <input type="number" min="0" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Payment Date</label>
                <input type="date" value={form.paymentDate} onChange={(e) => setForm((f) => ({ ...f, paymentDate: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Challan No.</label>
                <input value={form.challanNumber} onChange={(e) => setForm((f) => ({ ...f, challanNumber: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">BSR Code</label>
                <input value={form.bsrCode} onChange={(e) => setForm((f) => ({ ...f, bsrCode: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
              <textarea rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={saving}
                className="flex-1 rounded-xl bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
                {saving ? "Saving…" : "Save Challan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
