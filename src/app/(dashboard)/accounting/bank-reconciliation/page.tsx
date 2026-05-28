"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Landmark, Plus, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useLiveData } from "@/lib/use-live-data";

type BankAccount = { id: string; accountName: string; bankName: string; accountNumber: string; accountType: string };
type Reconciliation = { id: string; period: string; statementBalance: number; ledgerBalance: number; difference: number; status: string; reconciledItems: number; unreconciledItems: number };
type Statement = { id: string; transactionDate: string; description: string; debit: number; credit: number; balance: number | null; reconciled: boolean };

type ReconData = { reconciliations: Reconciliation[]; statements: Statement[] };
type AccountsData = { accounts: BankAccount[] };

const STATUS_ICON: Record<string, React.ReactNode> = {
  RECONCILED: <CheckCircle className="h-4 w-4 text-emerald-500" />,
  DRAFT: <Clock className="h-4 w-4 text-amber-500" />,
  UNDER_REVIEW: <AlertCircle className="h-4 w-4 text-blue-500" />,
};

export default function BankReconciliationPage() {
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [accountForm, setAccountForm] = useState({ accountName: "", bankName: "", accountNumber: "", ifscCode: "", accountType: "SAVINGS", openingBalance: "0" });
  const [saving, setSaving] = useState(false);

  const { data: accountsData, refetch: refetchAccounts } = useLiveData<AccountsData>({ url: "/api/accounting/bank-accounts", interval: 60_000 });
  const { data: reconData, refetch: refetchRecon } = useLiveData<ReconData>({
    url: `/api/accounting/bank-reconciliation?bankAccountId=${selectedAccountId}`,
    interval: 0,
    deps: [selectedAccountId],
  });

  const accounts = accountsData?.accounts ?? [];
  const reconciliations = reconData?.reconciliations ?? [];
  const statements = reconData?.statements ?? [];

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountForm.accountName || !accountForm.bankName || !accountForm.accountNumber) { toast.error("Name, bank, and account number required"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/accounting/bank-accounts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(accountForm) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast.success("Bank account added");
      setShowAddAccount(false);
      refetchAccounts();
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed"); }
    finally { setSaving(false); }
  };

  const handleMarkReconciled = async (ids: string[]) => {
    const res = await fetch("/api/accounting/bank-reconciliation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark_reconciled", statementIds: ids }),
    });
    if (res.ok) { toast.success("Marked as reconciled"); refetchRecon(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Landmark className="h-6 w-6 text-blue-600" /> Bank Reconciliation
          </h1>
          <p className="text-sm text-gray-500">Match bank statement vs ledger books</p>
        </div>
        <button onClick={() => setShowAddAccount(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Add Bank Account
        </button>
      </div>

      {/* Account selector */}
      {accounts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {accounts.map((a) => (
            <button key={a.id} onClick={() => setSelectedAccountId(a.id)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${selectedAccountId === a.id ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
              {a.accountName}
              <span className="ml-1 text-xs text-gray-400">{a.accountType}</span>
            </button>
          ))}
        </div>
      )}

      {accounts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
          <Landmark className="h-8 w-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No bank accounts linked. Add one to begin reconciliation.</p>
        </div>
      )}

      {selectedAccountId && (
        <>
          {/* Reconciliation history */}
          {reconciliations.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 font-semibold text-gray-800">Reconciliation History</div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-500">Period</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Statement Balance</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Ledger Balance</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Difference</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reconciliations.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-gray-900">{r.period}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(r.statementBalance)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(r.ledgerBalance)}</td>
                      <td className={`px-4 py-3 text-right tabular-nums font-medium ${Math.abs(r.difference) < 1 ? "text-emerald-600" : "text-red-500"}`}>
                        {formatCurrency(r.difference)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5">
                          {STATUS_ICON[r.status]} {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Unreconciled statements */}
          {statements.filter((s) => !s.reconciled).length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <span className="font-semibold text-gray-800">Unreconciled Transactions</span>
                <button
                  onClick={() => handleMarkReconciled(statements.filter((s) => !s.reconciled).map((s) => s.id))}
                  className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100">
                  Mark All Reconciled
                </button>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Description</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Debit</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Credit</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Balance</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {statements.filter((s) => !s.reconciled).map((s) => (
                    <tr key={s.id} className="hover:bg-amber-50/30">
                      <td className="px-4 py-2.5 text-xs text-gray-500">{formatDate(s.transactionDate)}</td>
                      <td className="px-4 py-2.5 text-gray-700">{s.description}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-red-500">{s.debit > 0 ? formatCurrency(s.debit) : "—"}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-emerald-600">{s.credit > 0 ? formatCurrency(s.credit) : "—"}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-gray-700">{s.balance != null ? formatCurrency(s.balance) : "—"}</td>
                      <td className="px-4 py-2.5">
                        <button onClick={() => handleMarkReconciled([s.id])}
                          className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100">
                          Reconcile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Add bank account modal */}
      {showAddAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleAddAccount} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Add Bank Account</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Account Label *</label>
                <input placeholder="HDFC Savings - Maintenance" value={accountForm.accountName} onChange={(e) => setAccountForm((f) => ({ ...f, accountName: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Bank Name *</label>
                <input value={accountForm.bankName} onChange={(e) => setAccountForm((f) => ({ ...f, bankName: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Account Type</label>
                <select value={accountForm.accountType} onChange={(e) => setAccountForm((f) => ({ ...f, accountType: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                  {["SAVINGS", "CURRENT", "FD", "RD"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Account Number *</label>
                <input value={accountForm.accountNumber} onChange={(e) => setAccountForm((f) => ({ ...f, accountNumber: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">IFSC Code</label>
                <input value={accountForm.ifscCode} onChange={(e) => setAccountForm((f) => ({ ...f, ifscCode: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 uppercase" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Opening Balance (₹)</label>
                <input type="number" min="0" value={accountForm.openingBalance} onChange={(e) => setAccountForm((f) => ({ ...f, openingBalance: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowAddAccount(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={saving}
                className="flex-1 rounded-xl bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
                {saving ? "Saving…" : "Add Account"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
