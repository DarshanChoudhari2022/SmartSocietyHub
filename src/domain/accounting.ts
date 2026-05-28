export const LEDGER_ACCOUNT_TYPES = ["ASSET", "LIABILITY", "INCOME", "EXPENSE", "EQUITY"] as const;

export type LedgerAccountType = (typeof LEDGER_ACCOUNT_TYPES)[number];

export const EXPENSE_CATEGORY_TO_ACCOUNT: Record<string, string> = {
  salary: "5000",
  security: "5001",
  housekeeping: "5002",
  cleaning: "5002",
  maintenance: "5003",
  repair: "5003",
  lift: "5004",
  generator: "5005",
  water: "5006",
  electricity: "5007",
  tax: "5008",
  legal: "5009",
  audit: "5010",
  printing: "5011",
  postage: "5012",
  bank_charges: "5013",
  insurance: "5014",
  pest: "5015",
  cctv: "5016",
  events: "5017",
  sinking_fund: "5018",
  tds: "5019",
  depreciation: "5020",
  utilities: "5007",
  other: "5021",
};

export const GST_RATE = 0.18;
export const GST_THRESHOLD = 7500;

export const DEFAULT_LEDGER_ACCOUNTS = [
  // ── ASSETS ──────────────────────────────
  { code: "1000", name: "Cash in Hand", type: "ASSET" },
  { code: "1010", name: "Bank — Savings Account", type: "ASSET" },
  { code: "1011", name: "Bank — Fixed Deposit", type: "ASSET" },
  { code: "1012", name: "Bank — Current Account", type: "ASSET" },
  { code: "1100", name: "Maintenance Receivable (Members)", type: "ASSET" },
  { code: "1101", name: "Interest Receivable", type: "ASSET" },
  { code: "1102", name: "Other Receivables", type: "ASSET" },
  { code: "1200", name: "Sinking Fund Deposit", type: "ASSET" },
  { code: "1201", name: "Corpus Fund Deposit", type: "ASSET" },
  { code: "1202", name: "Repair Fund Deposit", type: "ASSET" },
  { code: "1300", name: "Prepaid Expenses", type: "ASSET" },
  { code: "1400", name: "Society Assets (Net Block)", type: "ASSET" },
  // ── LIABILITIES ─────────────────────────
  { code: "2000", name: "Vendor Payables", type: "LIABILITY" },
  { code: "2001", name: "Salary Payables", type: "LIABILITY" },
  { code: "2002", name: "Audit Fee Payable", type: "LIABILITY" },
  { code: "2100", name: "Security Deposits (Members)", type: "LIABILITY" },
  { code: "2200", name: "TDS Payable", type: "LIABILITY" },
  { code: "2201", name: "GST Payable", type: "LIABILITY" },
  { code: "2202", name: "Professional Tax Payable", type: "LIABILITY" },
  { code: "2300", name: "Advance Collections", type: "LIABILITY" },
  // ── EQUITY ──────────────────────────────
  { code: "3000", name: "Corpus / Reserve Fund", type: "EQUITY" },
  { code: "3001", name: "Sinking Fund Reserve", type: "EQUITY" },
  { code: "3002", name: "Opening Balance (Accumulated Surplus)", type: "EQUITY" },
  { code: "3003", name: "Current Year Surplus / (Deficit)", type: "EQUITY" },
  // ── INCOME ──────────────────────────────
  { code: "4000", name: "Maintenance Charges Collected", type: "INCOME" },
  { code: "4001", name: "NOC / Transfer Charges", type: "INCOME" },
  { code: "4002", name: "Late Payment Charges", type: "INCOME" },
  { code: "4003", name: "Parking Charges", type: "INCOME" },
  { code: "4004", name: "Amenity / Hall Booking Income", type: "INCOME" },
  { code: "4005", name: "Interest on FD / Savings", type: "INCOME" },
  { code: "4006", name: "Miscellaneous Income", type: "INCOME" },
  { code: "4007", name: "GST Collected (Output Tax)", type: "INCOME" },
  // ── EXPENSES ────────────────────────────
  { code: "5000", name: "Salaries & Wages", type: "EXPENSE" },
  { code: "5001", name: "Security Agency Charges", type: "EXPENSE" },
  { code: "5002", name: "Housekeeping / Cleaning Charges", type: "EXPENSE" },
  { code: "5003", name: "Repairs & Maintenance", type: "EXPENSE" },
  { code: "5004", name: "Lift AMC", type: "EXPENSE" },
  { code: "5005", name: "Generator Fuel & AMC", type: "EXPENSE" },
  { code: "5006", name: "Water Charges", type: "EXPENSE" },
  { code: "5007", name: "Electricity — Common Areas", type: "EXPENSE" },
  { code: "5008", name: "Property Tax / Municipal Charges", type: "EXPENSE" },
  { code: "5009", name: "Legal & Professional Fees", type: "EXPENSE" },
  { code: "5010", name: "Audit Fees", type: "EXPENSE" },
  { code: "5011", name: "Printing & Stationery", type: "EXPENSE" },
  { code: "5012", name: "Postage & Communication", type: "EXPENSE" },
  { code: "5013", name: "Bank Charges", type: "EXPENSE" },
  { code: "5014", name: "Insurance Premium", type: "EXPENSE" },
  { code: "5015", name: "Pest Control", type: "EXPENSE" },
  { code: "5016", name: "CCTV & Security Equipment Maintenance", type: "EXPENSE" },
  { code: "5017", name: "Events & Cultural Programs", type: "EXPENSE" },
  { code: "5018", name: "Sinking Fund Contribution", type: "EXPENSE" },
  { code: "5019", name: "TDS Deducted at Source", type: "EXPENSE" },
  { code: "5020", name: "Depreciation", type: "EXPENSE" },
  { code: "5021", name: "Miscellaneous Expenses", type: "EXPENSE" },
  { code: "5022", name: "GST Paid (Input Tax)", type: "EXPENSE" },
] as const;

export function assertBalancedLedger(entries: Array<{ debit: number; credit: number }>) {
  const debit = entries.reduce((sum, entry) => sum + entry.debit, 0);
  const credit = entries.reduce((sum, entry) => sum + entry.credit, 0);
  if (Math.round(debit * 100) !== Math.round(credit * 100)) {
    throw new Error(`Ledger transaction is not balanced: debit=${debit}, credit=${credit}`);
  }
}

export function invoiceGeneratedEntries(amount: number, gstAmount = 0) {
  const total = amount + gstAmount;
  const lines = [
    { accountCode: "1100", debit: total, credit: 0, memo: "Maintenance receivable" },
    { accountCode: "4000", debit: 0, credit: amount, memo: "Maintenance income" },
  ];
  if (gstAmount > 0) {
    lines.push({ accountCode: "4007", debit: 0, credit: gstAmount, memo: "GST collected" });
  }
  return lines;
}

export function paymentReceivedEntries(amount: number, bankAccountCode = "1010") {
  return [
    { accountCode: bankAccountCode, debit: amount, credit: 0, memo: "Payment received" },
    { accountCode: "1100", debit: 0, credit: amount, memo: "Receivable cleared" },
  ];
}

export function expensePaidEntries(
  amount: number,
  expenseAccountCode = "5003",
  paidFromAccountCode = "1010",
  tdsAmount = 0,
) {
  const payable = amount - tdsAmount;
  const lines = [
    { accountCode: expenseAccountCode, debit: amount, credit: 0, memo: "Expense recognized" },
    { accountCode: paidFromAccountCode, debit: 0, credit: payable, memo: "Payment made" },
  ];
  if (tdsAmount > 0) {
    lines.push({ accountCode: "2200", debit: 0, credit: tdsAmount, memo: "TDS deducted" });
  }
  return lines;
}

export function salaryPaidEntries(amount: number, bankAccountCode = "1010") {
  return [
    { accountCode: "5000", debit: amount, credit: 0, memo: "Salary expense" },
    { accountCode: bankAccountCode, debit: 0, credit: amount, memo: "Salary paid" },
  ];
}

export function depreciationEntries(amount: number) {
  return [
    { accountCode: "5020", debit: amount, credit: 0, memo: "Depreciation charged" },
    { accountCode: "1400", debit: 0, credit: amount, memo: "Asset value reduced" },
  ];
}

export function tdsRemittanceEntries(amount: number, bankAccountCode = "1010") {
  return [
    { accountCode: "2200", debit: amount, credit: 0, memo: "TDS liability cleared" },
    { accountCode: bankAccountCode, debit: 0, credit: amount, memo: "TDS remitted to Govt" },
  ];
}

export function fdCreatedEntries(amount: number) {
  return [
    { accountCode: "1011", debit: amount, credit: 0, memo: "Fixed deposit created" },
    { accountCode: "1010", debit: 0, credit: amount, memo: "Transferred to FD" },
  ];
}

export function computeGST(maintenanceAmount: number): number {
  if (maintenanceAmount > GST_THRESHOLD) {
    return Math.round(maintenanceAmount * GST_RATE * 100) / 100;
  }
  return 0;
}

export const DEPRECIATION_RATES: Record<string, number> = {
  generator: 0.15,
  elevator: 0.15,
  pump: 0.15,
  gym_equipment: 0.15,
  cctv: 0.4,
  furniture: 0.1,
  vehicle: 0.15,
  other: 0.1,
};

export function computeMonthlyDepreciation(
  currentValue: number,
  category: string,
  method: "WDV" | "SLM" = "WDV",
  originalCost?: number,
  usefulLifeYears?: number,
): number {
  const annualRate = DEPRECIATION_RATES[category] ?? 0.1;
  if (method === "SLM" && originalCost && usefulLifeYears) {
    return Math.round((originalCost / usefulLifeYears / 12) * 100) / 100;
  }
  return Math.round((currentValue * annualRate) / 12 * 100) / 100;
}
