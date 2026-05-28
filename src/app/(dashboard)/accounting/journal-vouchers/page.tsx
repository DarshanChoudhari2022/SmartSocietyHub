"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FileText, Plus, CheckCircle, Clock, XCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useLiveData } from "@/lib/use-live-data";

type JVLine = { account: { code: string; name: string }; debit: number; credit: number; memo: string | null };
type JournalVoucher = {
  id: string;
  voucherNumber: string;
  voucherDate: string;
  narration: string;
  status: string;
  createdAt: string;
  lines: JVLine[];
};

type JVData = { vouchers: JournalVoucher[] };

const STATUS_ICON: Record<string, React.ReactNode> = {
  POSTED: <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />,
  DRAFT: <Clock className="h-3.5 w-3.5 text-amber-400" />,
  VOID: <XCircle className="h-3.5 w-3.5 text-red-400" />,
};

export default function JournalVouchersPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [narration, setNarration] = useState("");
  const [lines, setLines] = useState([
    { accountCode: "", debit: "", credit: "", memo: "" },
    { accountCode: "", debit: "", credit: "", memo: "" },
  ]);

  const { data, refetch } = useLiveData<JVData>({ url: "/api/accounting/journal-vouchers", interval: 60_000 });
  const vouchers = data?.vouchers ?? [];

  const addLine = () => setLines((l) => [...l, { accountCode: "", debit: "", credit: "", memo: "" }]);
  const removeLine = (i: number) => setLines((l) => l.filter((_, idx) => idx !== i));
  const updateLine = (i: number, field: string, value: string) =>
    setLines((l) => l.map((line, idx) => (idx === i ? { ...line, [field]: value } : line)));

  const totalDebit = lines.reduce((s, l) => s + Number(l.debit || 0), 0);
  const totalCredit = lines.reduce((s, l) => s + Number(l.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!narration) { toast.error("Narration is required"); return; }
    if (!isBalanced) { toast.error("Debit total must equal Credit total"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/accounting/journal-vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          narration,
          lines: lines
            .filter((l) => l.accountCode)
            .map((l) => ({ accountCode: l.accountCode, debit: Number(l.debit || 0), credit: Number(l.credit || 0), memo: l.memo || null })),
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast.success("Journal voucher posted");
      setShowForm(false);
      setNarration("");
      setLines([{ accountCode: "", debit: "", credit: "", memo: "" }, { accountCode: "", debit: "", credit: "", memo: "" }]);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to post JV");
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" /> Journal Vouchers
          </h1>
          <p className="text-sm text-gray-500">Post manual double-entry accounting entries</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> New JV
        </button>
      </div>

      {/* Voucher list */}
      {vouchers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-400">
          <FileText className="h-8 w-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No journal vouchers posted yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {vouchers.map((jv) => (
            <div key={jv.id} className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <button
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50/50 transition"
                onClick={() => setExpanded(expanded === jv.id ? null : jv.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {STATUS_ICON[jv.status]}
                    <span className="font-mono text-xs font-semibold text-gray-500">{jv.voucherNumber}</span>
                    <span className="text-xs text-gray-400">{formatDate(jv.voucherDate)}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 truncate">{jv.narration}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-700">
                    Dr {formatCurrency(jv.lines.reduce((s, l) => s + l.debit, 0))}
                  </p>
                  <p className="text-xs text-gray-400">{jv.lines.length} lines</p>
                </div>
              </button>

              {expanded === jv.id && (
                <div className="border-t border-gray-100 px-5 pb-4">
                  <table className="w-full text-sm mt-3">
                    <thead>
                      <tr className="border-b border-gray-100 text-left">
                        <th className="pb-2 font-medium text-gray-500">Account</th>
                        <th className="pb-2 font-medium text-gray-500">Memo</th>
                        <th className="pb-2 text-right font-medium text-gray-500">Debit</th>
                        <th className="pb-2 text-right font-medium text-gray-500">Credit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {jv.lines.map((line, i) => (
                        <tr key={i}>
                          <td className="py-2">
                            <span className="font-mono text-xs text-gray-400 mr-1">{line.account.code}</span>
                            <span className="text-gray-700">{line.account.name}</span>
                          </td>
                          <td className="py-2 text-gray-500 text-xs">{line.memo ?? "—"}</td>
                          <td className="py-2 text-right tabular-nums text-red-500">{line.debit > 0 ? formatCurrency(line.debit) : "—"}</td>
                          <td className="py-2 text-right tabular-nums text-emerald-600">{line.credit > 0 ? formatCurrency(line.credit) : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {jv.status === "POSTED" && (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={async () => {
                          if (!confirm(`Void ${jv.voucherNumber}? This will post a reversing entry and cannot be undone.`)) return;
                          try {
                            const res = await fetch("/api/accounting/journal-vouchers", {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ voucherId: jv.id, action: "void" }),
                            });
                            if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
                            toast.success(`${jv.voucherNumber} voided`);
                            refetch();
                          } catch (err) {
                            toast.error(err instanceof Error ? err.message : "Failed to void");
                          }
                        }}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition"
                      >
                        <XCircle className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                        Void Voucher
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* New JV Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-16 overflow-y-auto">
          <form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-900">Post Journal Voucher</h3>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Narration *</label>
              <input value={narration} onChange={(e) => setNarration(e.target.value)} placeholder="Describe this transaction..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>

            {/* Lines */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="pb-2 font-medium text-gray-500">Account Code</th>
                    <th className="pb-2 font-medium text-gray-500">Memo</th>
                    <th className="pb-2 font-medium text-gray-500">Debit (₹)</th>
                    <th className="pb-2 font-medium text-gray-500">Credit (₹)</th>
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, i) => (
                    <tr key={i}>
                      <td className="py-1 pr-2">
                        <input value={line.accountCode} onChange={(e) => updateLine(i, "accountCode", e.target.value)}
                          placeholder="e.g. 5003" className="w-24 rounded-lg border border-gray-200 px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-300" />
                      </td>
                      <td className="py-1 pr-2">
                        <input value={line.memo} onChange={(e) => updateLine(i, "memo", e.target.value)}
                          placeholder="Optional" className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                      </td>
                      <td className="py-1 pr-2">
                        <input type="number" min="0" value={line.debit} onChange={(e) => updateLine(i, "debit", e.target.value)}
                          className="w-28 rounded-lg border border-gray-200 px-2 py-1.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-300" />
                      </td>
                      <td className="py-1 pr-2">
                        <input type="number" min="0" value={line.credit} onChange={(e) => updateLine(i, "credit", e.target.value)}
                          className="w-28 rounded-lg border border-gray-200 px-2 py-1.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-300" />
                      </td>
                      <td className="py-1">
                        {lines.length > 2 && (
                          <button type="button" onClick={() => removeLine(i)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500">✕</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-200">
                    <td colSpan={2} className="pt-2 text-xs text-gray-400">Totals</td>
                    <td className={`pt-2 font-semibold tabular-nums ${isBalanced ? "text-emerald-600" : "text-red-500"}`}>{formatCurrency(totalDebit)}</td>
                    <td className={`pt-2 font-semibold tabular-nums ${isBalanced ? "text-emerald-600" : "text-red-500"}`}>{formatCurrency(totalCredit)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>

            {!isBalanced && totalDebit > 0 && (
              <p className="text-xs text-red-500">Debit ({formatCurrency(totalDebit)}) ≠ Credit ({formatCurrency(totalCredit)}) — must balance</p>
            )}

            <button type="button" onClick={addLine}
              className="text-sm text-blue-600 hover:underline">+ Add Line</button>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={saving || !isBalanced}
                className="flex-1 rounded-xl bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                {saving ? "Posting…" : "Post Voucher"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
