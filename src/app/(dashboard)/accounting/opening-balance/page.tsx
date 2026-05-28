"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BookOpen, Save, Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type LedgerAccount = { id: string; code: string; name: string; type: string };

export default function OpeningBalancePage() {
  const [accounts, setAccounts] = useState<LedgerAccount[]>([]);
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/accounting/chart-of-accounts")
      .then((r) => r.json())
      .then((d) => {
        const accs: LedgerAccount[] = d.accounts ?? [];
        setAccounts(accs);
        const initial: Record<string, string> = {};
        accs.forEach((a) => (initial[a.code] = ""));
        setBalances(initial);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateBalance = (code: string, value: string) => {
    setBalances((b) => ({ ...b, [code]: value }));
  };

  const debitAccounts = accounts.filter((a) => ["ASSET", "EXPENSE"].includes(a.type));
  const creditAccounts = accounts.filter((a) => ["LIABILITY", "EQUITY", "INCOME"].includes(a.type));

  const totalDebit = debitAccounts.reduce((s, a) => s + Number(balances[a.code] || 0), 0);
  const totalCredit = creditAccounts.reduce((s, a) => s + Number(balances[a.code] || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && (totalDebit + totalCredit) > 0;

  const handleSave = async () => {
    const lines: { accountCode: string; debit: number; credit: number; memo: string }[] = [];

    for (const acc of debitAccounts) {
      const amt = Number(balances[acc.code] || 0);
      if (amt > 0) lines.push({ accountCode: acc.code, debit: amt, credit: 0, memo: `Opening balance: ${acc.name}` });
    }
    for (const acc of creditAccounts) {
      const amt = Number(balances[acc.code] || 0);
      if (amt > 0) lines.push({ accountCode: acc.code, debit: 0, credit: amt, memo: `Opening balance: ${acc.name}` });
    }

    if (lines.length < 2) {
      toast.error("Enter at least 2 account balances");
      return;
    }

    const debitTotal = lines.reduce((s, l) => s + l.debit, 0);
    const creditTotal = lines.reduce((s, l) => s + l.credit, 0);
    if (Math.abs(debitTotal - creditTotal) > 0.01) {
      toast.error("Debit and Credit totals must match");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/accounting/journal-vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          narration: "Opening balances entry",
          lines,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error);
      }
      toast.success("Opening balances posted as journal voucher");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to post opening balances");
    } finally {
      setSaving(false);
    }
  };

  function AccountGroup({ title, accs, side }: { title: string; accs: LedgerAccount[]; side: "debit" | "credit" }) {
    const groups = Array.from(new Set(accs.map((a) => a.type)));
    return (
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">{title}</h2>
          <p className="text-xs text-gray-400">{side === "debit" ? "Assets & Expenses (Debit balances)" : "Liabilities, Equity & Income (Credit balances)"}</p>
        </div>
        <div className="p-4 space-y-4">
          {groups.map((type) => (
            <div key={type}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{type}</p>
              <div className="space-y-2">
                {accs.filter((a) => a.type === type).map((acc) => (
                  <div key={acc.code} className="flex items-center gap-3">
                    <span className="font-mono text-xs text-gray-400 w-12">{acc.code}</span>
                    <span className="text-sm text-gray-700 flex-1 truncate">{acc.name}</span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={balances[acc.code] || ""}
                        onChange={(e) => updateBalance(acc.code, e.target.value)}
                        placeholder="0"
                        className="w-32 rounded-lg border border-gray-200 pl-7 pr-3 py-1.5 text-sm tabular-nums text-right focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" /> Opening Balances
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Enter your society&apos;s starting account balances. This posts a single journal voucher.</p>
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-700">
        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <div>
          <p><strong>How it works:</strong> Enter the opening balance for each account from your previous audited books.</p>
          <p className="mt-1">Asset/Expense accounts are debits. Liability/Equity/Income accounts are credits. Totals must match.</p>
          <p className="mt-1">Use account <strong>3002 — Opening Balance (Accumulated Surplus)</strong> as the balancing figure.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AccountGroup title="Debit Side" accs={debitAccounts} side="debit" />
        <AccountGroup title="Credit Side" accs={creditAccounts} side="credit" />
      </div>

      {/* Totals bar */}
      <div className={`rounded-2xl border p-5 flex items-center justify-between ${isBalanced ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-white"}`}>
        <div className="flex gap-8">
          <div>
            <p className="text-xs text-gray-500">Total Debits</p>
            <p className="text-xl font-bold text-gray-900 tabular-nums">{formatCurrency(totalDebit)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Credits</p>
            <p className="text-xl font-bold text-gray-900 tabular-nums">{formatCurrency(totalCredit)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Difference</p>
            <p className={`text-xl font-bold tabular-nums ${Math.abs(totalDebit - totalCredit) < 0.01 ? "text-emerald-600" : "text-red-500"}`}>
              {formatCurrency(Math.abs(totalDebit - totalCredit))}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={!isBalanced || saving}
          className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition ${
            isBalanced && !saving
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Save className="h-4 w-4" />
          {saving ? "Posting…" : "Post Opening Balances"}
        </button>
      </div>
    </div>
  );
}
