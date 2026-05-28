# SmartSocietyHub — End-to-End Accounting Module PRD

## Problem Statement

Society committees spend ₹12,000–₹40,000/year on chartered accountants just to maintain basic books, generate AGM reports, and file TDS/GST. The existing system records expenses and bills but does not close the loop with:
- Proper double-entry posting on every financial event
- Statutory reports (I&E, Balance Sheet, Receipts & Payments)
- TDS deduction tracking and challan management
- GST liability computation on maintenance collections
- Bank reconciliation to catch discrepancies
- Year-end closing so the next fiscal year starts clean

**Goal:** Replace the external CA for routine bookkeeping. Societies should be able to produce AGM-ready financial statements, file TDS/GST, and reconcile their bank accounts entirely within SmartSocietyHub.

---

## Existing Finance Foundation (Already Built)

| Layer | What Exists |
|---|---|
| Schema | LedgerAccount, LedgerEntry, JournalVoucher, FinancialTransaction, Expense, FundAccount, Budget, StaffSalary, SocietyAsset |
| Domain | `accounting-engine.ts` — `postJournalVoucher`, `getTrialBalance`, `ensureDefaultChartOfAccounts` |
| APIs | `/api/accounting/chart-of-accounts`, `/api/accounting/journal-vouchers`, `/api/accounting/reports/trial-balance` |
| CoA | 14 default accounts |

---

## New Module Scope

### 1. Extended Chart of Accounts (Society-Specific)

A full 60-account CoA covering income, expenses, assets, liabilities, and equity as required by the Model Bye-Laws for Cooperative Housing Societies (Maharashtra / MCS Act 1960 and equivalents).

```
1xxx  ASSETS
  1000  Cash in Hand
  1010  Bank — Savings Account
  1011  Bank — Fixed Deposit
  1012  Bank — Current Account
  1100  Maintenance Receivable (Members)
  1101  Interest Receivable
  1102  Other Receivables
  1200  Sinking Fund Deposit
  1201  Corpus Fund Deposit
  1202  Repair Fund Deposit
  1300  Prepaid Expenses
  1400  Society Assets (Net)

2xxx  LIABILITIES
  2000  Vendor Payables
  2001  Salary Payables
  2002  Audit Fee Payable
  2100  Security Deposits (Members)
  2200  TDS Payable
  2201  GST Payable
  2202  Professional Tax Payable
  2300  Advance Collections

3xxx  EQUITY / CORPUS
  3000  Corpus / Reserve Fund
  3001  Sinking Fund Reserve
  3002  Opening Balance (Accumulated Surplus)
  3003  Current Year Surplus / (Deficit)

4xxx  INCOME
  4000  Maintenance Charges Collected
  4001  NOC / Transfer Charges
  4002  Late Payment Charges
  4003  Parking Charges
  4004  Amenity / Hall Booking Income
  4005  Interest on FD / Savings
  4006  Misc. Income
  4007  GST Collected (Output Tax)

5xxx  EXPENSES
  5000  Salaries & Wages
  5001  Security Agency Charges
  5002  Housekeeping / Cleaning Charges
  5003  Repairs & Maintenance
  5004  Lift AMC
  5005  Generator Fuel & AMC
  5006  Water Charges
  5007  Electricity — Common Areas
  5008  Property Tax / Municipal Charges
  5009  Legal & Professional Fees
  5010  Audit Fees
  5011  Printing & Stationery
  5012  Postage & Communication
  5013  Bank Charges
  5014  Insurance Premium
  5015  Pest Control
  5016  CCTV & Security Equipment Maintenance
  5017  Events & Cultural Programs
  5018  Sinking Fund Contribution
  5019  TDS Deducted at Source
  5020  Depreciation
  5021  Miscellaneous Expenses
  5022  GST Paid (Input Tax)
```

### 2. Auto-Journal Posting Hooks

Every financial event automatically posts a balanced journal voucher:

| Event | Dr | Cr |
|---|---|---|
| Invoice generated | 1100 Maintenance Receivable | 4000 Maintenance Charges |
| GST on invoice (>₹7500) | 1100 | 4007 GST Collected |
| Payment received | 1010 Bank | 1100 Receivable |
| Expense paid (cash) | 5xxx Expense | 1000 Cash |
| Expense paid (bank) | 5xxx Expense | 1010 Bank |
| TDS deducted | 2000 Vendor Payable | 2200 TDS Payable |
| TDS remitted | 2200 TDS Payable | 1010 Bank |
| Staff salary paid | 5000 Salaries | 1010 Bank |
| FD created | 1011 Bank FD | 1010 Bank Savings |
| Asset purchased | 1400 Society Assets | 1010 Bank |
| Depreciation | 5020 Depreciation | 1400 Society Assets |

### 3. Financial Statements

#### 3a. Income & Expenditure Statement (I&E)
- Standard not-for-profit format
- Period: monthly / quarterly / annual / custom
- Groups income by category; groups expenses by category
- Shows surplus / deficit

#### 3b. Balance Sheet
- Assets (Fixed + Current), Liabilities, Corpus/Equity
- As of any date
- Tied to opening balance + ledger movements

#### 3c. Receipts & Payments Account
- Cash-basis summary (all cash/bank inflows & outflows)
- Standard format for AGM presentation

#### 3d. Trial Balance
- Already exists; enhanced to show opening/closing balance columns

### 4. Bank Reconciliation

- Society adds 1+ bank accounts (name, account number, IFSC, bank)
- Upload bank statement (CSV/manual entry of transactions)
- System auto-matches ledger entries vs bank entries by amount + date
- Unmatched entries flagged for manual resolution
- Reconciliation report with closing balance confirmation

### 5. TDS Management

- Tracks TDS deducted per vendor per quarter
- Calculates TDS based on configured percentage (vendor level)
- Generates Form 26Q quarterly data (CSV export)
- TDS challan entry (date, BSR code, challan number, amount)
- TDS certificate (Form 16A) data export

### 6. GST Compliance

- Auto-calculates GST @ 18% on maintenance > ₹7,500/month (SAC 9972)
- GST ledger showing Output Tax (collected) vs Input Tax (paid on expenses)
- Monthly GST liability = Output − Input
- GSTR-1 / GSTR-3B summary export
- Exemption tracking for small societies

### 7. Asset Depreciation

- Schedule of assets with purchase cost, date, category
- WDV (Written Down Value) method at standard rates:
  - Buildings: 5%, Plant & Machinery: 15%, Furniture: 10%, Electronics: 40%, Vehicles: 15%
- Monthly auto-depreciation journal posting
- Net Block report

### 8. Budget vs Actual Tracking

- Enhances existing Budget model
- Real-time variance tracking per category
- Alerts when actual > 80% of budget

### 9. Year-End Closing

- Closes all income/expense accounts to Surplus/Deficit account (3003)
- Creates opening balance journal for new fiscal year
- Prevents posting to closed periods (optional)
- Generates Year-End Report PDF data

### 10. Accounting Dashboard

KPIs visible at a glance:
- Total collections this month / YTD
- Total expenses this month / YTD
- Outstanding receivables
- Current surplus / deficit
- Bank balance vs ledger balance
- TDS payable
- GST payable
- Budget utilization %

---

## Implementation Plan

### Sprint 1 — Foundation (Week 1)
- [x] Schema: BankAccount, BankStatement, BankReconciliation, TDSChallan, GSTReturn, DepreciationEntry
- [x] Expanded Chart of Accounts (60 accounts)
- [x] Auto-journal hooks for expenses and payments
- [x] I&E and Balance Sheet computations in domain layer

### Sprint 2 — Statements & Reconciliation (Week 2)
- [x] API: income-expenditure, balance-sheet, receipts-payments
- [x] API: bank-accounts CRUD, bank-reconciliation
- [x] API: tds-summary, gst-summary, depreciation
- [x] API: year-end-close

### Sprint 3 — UI (Week 3)
- [x] /accounting — Main dashboard with KPIs
- [x] /accounting/ledger — Account-wise ledger
- [x] /accounting/journal-vouchers — JV entry & listing
- [x] /accounting/trial-balance — Trial balance
- [x] /accounting/income-expenditure — I&E Statement
- [x] /accounting/balance-sheet — Balance Sheet
- [x] /accounting/bank-reconciliation — Reconciliation workflow
- [x] /accounting/tds — TDS tracker
- [x] /accounting/gst — GST summary

---

## Roles & Permissions

| Feature | Chairman | Secretary | Treasurer | Member |
|---|---|---|---|---|
| View all reports | ✓ | ✓ | ✓ | ✗ |
| Post journal vouchers | ✓ | ✗ | ✓ | ✗ |
| Bank reconciliation | ✓ | ✗ | ✓ | ✗ |
| Year-end close | ✓ | ✗ | ✓ | ✗ |
| TDS / GST management | ✓ | ✗ | ✓ | ✗ |
| View own bills/receipts | ✓ | ✓ | ✓ | ✓ |

---

## Integration with Existing Modules

| Module | Integration |
|---|---|
| Expenses | Auto-post DR Expense / CR Bank on save |
| Maintenance Bills / Invoices | Auto-post DR Receivable / CR Income on issue; DR Bank / CR Receivable on payment |
| Staff Salary | Auto-post DR Salary / CR Bank on mark-paid |
| Fund Accounts | FundTransaction maps to Fund asset accounts |
| Asset Management | Auto-depreciation monthly; purchase posts to 1400 |
| Vendor Payments | TDS deduction auto-computes and posts to 2200 |
| Facility Booking | Amenity income posts to 4004 |

---

## Success Metrics

- Society can generate a complete AGM financial report (I&E + Balance Sheet + R&P) in < 2 minutes
- Zero manual CA intervention needed for routine monthly bookkeeping
- TDS filing data export in Form 26Q CSV format
- GST liability computed and reconciled monthly
- Bank reconciliation completable in < 10 minutes
