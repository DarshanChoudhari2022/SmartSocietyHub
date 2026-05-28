// SmartSocietyHub — NotebookLM Source PDF Generator
// node generate-source-pdf.mjs  →  SmartSocietyHub-Source.pdf
import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";

const doc = new PDFDocument({ margin: 50, size: "A4" });
doc.pipe(createWriteStream("./SmartSocietyHub-Source.pdf"));

// ── Palette ──────────────────────────────────────────────────────────
const INDIGO  = "#312E81";
const TEAL    = "#0D9488";
const GOLD    = "#D97706";
const DARK    = "#111827";
const SLATE   = "#374151";
const GRAY    = "#6B7280";
const WHITE   = "#FFFFFF";
const LGRAY   = "#F3F4F6";

// ── Helpers ───────────────────────────────────────────────────────────
const W = 595 - 100; // usable width

function heading1(text) {
  doc.addPage();
  doc.rect(0, 0, 595, 60).fill(INDIGO);
  doc.fillColor(WHITE).fontSize(22).font("Helvetica-Bold")
     .text(text, 50, 18, { width: W });
  doc.moveDown(2);
  doc.fillColor(DARK).fontSize(11).font("Helvetica");
}

function heading2(text, color = INDIGO) {
  doc.moveDown(0.6);
  doc.rect(50, doc.y, W, 24).fill(color);
  doc.fillColor(WHITE).fontSize(12).font("Helvetica-Bold")
     .text(text, 58, doc.y - 20, { width: W - 16 });
  doc.moveDown(0.8);
  doc.fillColor(DARK).fontSize(10).font("Helvetica");
}

function heading3(text) {
  doc.moveDown(0.5);
  doc.fillColor(INDIGO).fontSize(11).font("Helvetica-Bold").text(text, 50);
  doc.moveDown(0.2);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(INDIGO).lineWidth(0.5).stroke();
  doc.moveDown(0.3);
  doc.fillColor(DARK).fontSize(10).font("Helvetica");
}

function bullet(label, desc = "") {
  const x = doc.x;
  doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(10).text("▸", 58, doc.y, { continued: true, width: 12 });
  if (desc) {
    doc.fillColor(DARK).font("Helvetica-Bold").text("  " + label + ": ", { continued: true });
    doc.fillColor(SLATE).font("Helvetica").text(desc, { width: W - 20 });
  } else {
    doc.fillColor(SLATE).font("Helvetica").text("  " + label, { width: W - 20 });
  }
}

function painRow(prob, sol) {
  const y = doc.y;
  doc.rect(50, y, W / 2 - 5, 30).fill("#FEE2E2");
  doc.fillColor("#991B1B").fontSize(9).font("Helvetica")
     .text("✗  " + prob, 55, y + 6, { width: W / 2 - 15 });
  doc.rect(50 + W / 2 + 5, y, W / 2 - 5, 30).fill("#D1FAE5");
  doc.fillColor("#065F46").fontSize(9).font("Helvetica")
     .text("✓  " + sol, 55 + W / 2 + 5, y + 6, { width: W / 2 - 15 });
  doc.moveDown(2.2);
}

function tag(text, color = INDIGO) {
  doc.rect(50, doc.y, 120, 18).fill(color);
  doc.fillColor(WHITE).fontSize(9).font("Helvetica-Bold")
     .text(text, 54, doc.y - 14, { width: 112 });
  doc.moveDown(1.2);
}

function hr() {
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#E5E7EB").lineWidth(0.5).stroke();
  doc.moveDown(0.4);
}

function note(text) {
  doc.fillColor(GRAY).fontSize(9).font("Helvetica-Oblique").text(text, 58, doc.y, { width: W - 10 });
  doc.moveDown(0.4);
  doc.fillColor(DARK).font("Helvetica").fontSize(10);
}

// ════════════════════════════════════════════════════════════════════════
// COVER PAGE
// ════════════════════════════════════════════════════════════════════════
doc.rect(0, 0, 595, 842).fill(INDIGO);
doc.rect(0, 0, 8, 842).fill(GOLD);
doc.rect(0, 770, 595, 72).fill("#1E1B4B");

doc.fillColor(WHITE).fontSize(36).font("Helvetica-Bold")
   .text("SmartSocietyHub", 50, 180, { width: W });
doc.moveDown(0.4);
doc.fillColor(GOLD).fontSize(16).font("Helvetica")
   .text("Complete Society Management Platform", 50, doc.y, { width: W });
doc.moveDown(1.5);
doc.rect(50, doc.y, W, 2).fill(GOLD);
doc.moveDown(1);
doc.fillColor("#A5B4FC").fontSize(12).font("Helvetica")
   .text("Product Documentation — NotebookLM Source Material", 50, doc.y, { width: W });
doc.moveDown(0.8);
doc.fillColor(WHITE).fontSize(11).font("Helvetica")
   .text("This document provides a comprehensive description of SmartSocietyHub — every feature,\nevery module, every problem it solves, technical architecture, pricing, and onboarding.\nPrepared for use as a knowledge base in AI-assisted presentation and content generation.", 50, doc.y, { width: W });

doc.moveDown(3);
const modules = ["30+ Modules", "Web + Mobile App", "UPI Payments", "Works Offline", "Multi-Society", "Indian Fiscal Year"];
modules.forEach((m, i) => {
  const x = 50 + (i % 3) * 165;
  const y = 560 + Math.floor(i / 3) * 38;
  doc.rect(x, y, 155, 28).fill("#1E1B4B");
  doc.fillColor(GOLD).fontSize(10).font("Helvetica-Bold").text(m, x + 8, y + 8, { width: 139 });
});

doc.fillColor("#818CF8").fontSize(9).font("Helvetica")
   .text("SmartSocietyHub  ·  Billing · Security · Complaints · Parking · Staff · Finance · Mobile App",
         50, 785, { width: W, align: "center" });

// ════════════════════════════════════════════════════════════════════════
// PAGE 2 — EXECUTIVE SUMMARY
// ════════════════════════════════════════════════════════════════════════
heading1("Executive Summary");

doc.fillColor(DARK).fontSize(11).font("Helvetica")
   .text("SmartSocietyHub is a complete all-in-one digital platform built specifically for Indian " +
         "residential housing societies. It replaces paper registers, Excel spreadsheets, and " +
         "WhatsApp-based communication with a single unified smart platform that manages every " +
         "aspect of society operations.", 50, doc.y, { width: W });
doc.moveDown(0.8);

doc.text("The platform serves multiple user roles — Chairman, Secretary, Treasurer, Members, " +
         "Tenants, and Guards — each with a dedicated scoped experience. It runs on the web and " +
         "as a native Android and iOS mobile app, both included under one subscription.", { width: W });
doc.moveDown(0.8);

doc.text("SmartSocietyHub is purpose-built for India: UPI payment integration, GST calculations, " +
         "WhatsApp reminder templates in English and Marathi, Indian fiscal year (April–March), " +
         "rupee formatting, and national emergency helplines are all built-in.", { width: W });
doc.moveDown(1.2);

heading3("Target Audience");
const audience = [
  ["Primary", "Society Chairman — decision maker, needs financial control and accountability"],
  ["Secondary", "Secretary — manages operations, complaints, notices, and visitor logs"],
  ["Tertiary", "Treasurer — manages billing, payments, expenses, salaries, and reports"],
  ["Users", "Residents (Members/Tenants) — pay bills, raise complaints, book amenities"],
  ["Operations", "Security Guards — gate management, visitor logs, package tracking"],
];
audience.forEach(([r, d]) => bullet(r, d));
doc.moveDown(0.8);

heading3("Technology Stack");
const tech = [
  ["Frontend", "Next.js 16 + React 19 + TypeScript + TailwindCSS + Radix UI"],
  ["Mobile App", "Capacitor v6 — wraps web app as native Android & iOS application"],
  ["Backend", "Next.js API Routes (88+ endpoints) — all protected by JWT session auth"],
  ["Database", "PostgreSQL with Prisma ORM v7 — 50+ entity models, multi-tenant"],
  ["Payments", "UPI deep-link + QR generation + manual UTR confirmation flow"],
  ["Notifications", "Web Push API for push notifications + WhatsApp API integration"],
  ["Offline", "IndexedDB local cache + request queue with exponential backoff retry"],
  ["Auth", "JWT encryption via jose library + bcryptjs password hashing"],
];
tech.forEach(([r, d]) => bullet(r, d));

// ════════════════════════════════════════════════════════════════════════
// PAGE 3 — PROBLEMS & SOLUTIONS
// ════════════════════════════════════════════════════════════════════════
heading1("Problems Solved — Before vs After SmartSocietyHub");

doc.fillColor(DARK).font("Helvetica").fontSize(10)
   .text("The following table shows the 10 most critical pain points faced by society chairmen " +
         "and how SmartSocietyHub solves each one:", 50, doc.y, { width: W });
doc.moveDown(1);

doc.rect(50, doc.y, W / 2 - 5, 24).fill("#991B1B");
doc.fillColor(WHITE).fontSize(10).font("Helvetica-Bold")
   .text("WITHOUT SmartSocietyHub", 56, doc.y - 18, { width: W / 2 - 12 });
doc.rect(50 + W / 2 + 5, doc.y, W / 2 - 5, 24).fill("#065F46");
doc.fillColor(WHITE).fontSize(10).font("Helvetica-Bold")
   .text("WITH SmartSocietyHub", 56 + W / 2 + 5, doc.y - 18, { width: W / 2 - 12 });
doc.moveDown(1.5);

const pairs = [
  ["Bills sent on paper or WhatsApp — residents ignore them",
   "Auto-generated bills sent via app + WhatsApp — no paper needed"],
  ["No idea which flat has paid — tracked in Excel sheet",
   "Live dashboard: paid/pending/defaulters visible in one click"],
  ["Residents pay cash to watchman — no receipt, no proof",
   "UPI payment inside app — auto-receipt generated and stored"],
  ["Paper visitor register — anyone can write false entry",
   "Digital gate log with OTP, photo and real-time resident approval"],
  ["Complaints told verbally — forgotten with no follow-up",
   "App complaints with SLA timer, escalation and satisfaction rating"],
  ["Parking disputes — no record of who was assigned what slot",
   "Full slot assignment history with timestamps and vehicle details"],
  ["Staff attendance in notebook — salary disputes every month",
   "Digital attendance + payroll — salary auto-added to expenses"],
  ["AGM notices on paper/WhatsApp — no formal record kept",
   "Push notification to all residents + PDF minutes stored forever"],
  ["No financial report ready for auditor or CA",
   "Trial balance, ledger and P&L generated in one click"],
  ["Sinking fund balance unknown — no one knows the figure",
   "Fund accounts with every debit/credit transaction tracked"],
];
pairs.forEach(([p, s]) => painRow(p, s));

// ════════════════════════════════════════════════════════════════════════
// PAGE 4 — FINANCE MODULE
// ════════════════════════════════════════════════════════════════════════
heading1("Finance Module — Billing, Expenses, Accounts & Reports");

heading3("1. Maintenance Billing");
note("The core module — generates invoices for all flats and manages the complete payment lifecycle.");
const billing = [
  ["Generate Bills", "One click generates maintenance bills for every flat simultaneously"],
  ["Bill Types", "Maintenance, Sinking Fund, Repair, Parking, One-time, Advance Deposit"],
  ["Billing Cycles", "Monthly, Quarterly, Half-yearly, Yearly, and One-time options"],
  ["Configure Once", "Set maintenance amount, due day of month, and late fee percentage once — auto-applies every month"],
  ["Auto Late Fees", "Late fee applied automatically after the due date — configurable amount or percentage"],
  ["GST Calculation", "18% GST auto-applied on bills exceeding ₹7,500 threshold (configurable)"],
  ["Edit / Delete", "Modify amount or due date of any unpaid bill before it is locked and sent"],
  ["4 Payment Modes", "UPI, Cash, NEFT/RTGS, Cheque — all accepted and recorded"],
  ["UPI Deep Link", "Resident taps a payment link that opens their UPI app pre-filled with amount and UPI ID"],
  ["UTR Confirmation", "Resident submits UTR number after UPI payment — admin confirms and marks paid"],
  ["Auto Receipt", "Unique receipt number generated on payment — downloadable by resident"],
  ["Live Dashboard", "Total Generated / Total Collected / Total Pending / Collection Rate % updated in real time"],
  ["WhatsApp Reminder", "Send payment reminder to any defaulter flat directly from the billing screen"],
  ["CSV Export", "Download complete billing data for the month for CA or audit purposes"],
  ["Bill Search", "Search by flat number, status, period, or owner name"],
];
billing.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.6);

heading3("2. Resident Bill View (My Bills)");
const myBills = [
  ["Resident Portal", "Residents see only their own bills — maintenance invoices and rent invoices"],
  ["Bill Details", "Amount due, due date, status (pending/paid/overdue), payment method displayed"],
  ["UPI Payment", "One-tap UPI payment link from the bill — opens any UPI app on the phone"],
  ["Copy UPI ID", "Resident can copy society UPI ID to pay manually from their banking app"],
  ["UTR Submit", "Resident submits their UTR number after paying — proof of payment"],
  ["Receipt Download", "Download official receipt as PDF after payment is confirmed"],
  ["Rent Invoices", "Tenant-specific section showing rent invoices separately from maintenance"],
  ["Staff Payment", "Resident can pay domestic staff (maid/cook/driver) salary through the app"],
];
myBills.forEach(([l, d]) => bullet(l, d));

// ════════════════════════════════════════════════════════════════════════
// PAGE 5 — EXPENSES & ACCOUNTING
// ════════════════════════════════════════════════════════════════════════
doc.addPage();
doc.fillColor(DARK).font("Helvetica").fontSize(10);

heading3("3. Expense Management");
note("40+ sub-categories across 5 groups — every society expense captured with vendor and proof.");

const expGroups = {
  "Maintenance & Operations": [
    "Maintenance, Repairs, Civil Work, Plumbing, Electrical, Painting, Waterproofing",
    "Carpentry, Pest Control, Housekeeping, Garbage Collection, Garden Maintenance",
    "STP Maintenance, Lift Maintenance, DG Generator Maintenance",
    "Fire Safety, CCTV Maintenance, Intercom Maintenance, Security System Maintenance"
  ],
  "Staff & Payroll": [
    "Security Salary, Housekeeping Salary, Manager Salary, Electrician Salary",
    "Plumber Salary, Gardener Salary, Admin Staff Salary, Staff Bonus",
    "PF / ESIC Contributions, Contractor Payments"
  ],
  "Utilities": [
    "Electricity (Common Area), Water Bill, Diesel, Gas, Internet/WiFi, Mobile/Phone, AMC Charges"
  ],
  "Amenities & Events": [
    "Gym, Clubhouse, Swimming Pool, Sports Area, Kids Play Area",
    "Events & Festivals, Legal & Audit Fees, Admin & Printing, Software Subscriptions"
  ],
};
Object.entries(expGroups).forEach(([grp, lines]) => {
  doc.fillColor(TEAL).font("Helvetica-Bold").fontSize(10).text("  " + grp + ":", 58, doc.y);
  lines.forEach(l => {
    doc.fillColor(SLATE).font("Helvetica").fontSize(9).text("      " + l, 58, doc.y, { width: W - 20 });
  });
  doc.moveDown(0.3);
});
doc.moveDown(0.3);

const expFeats = [
  ["Bill Proof Upload", "Attach photo or scanned copy of invoice — admin verifies digitally"],
  ["Vendor Linking", "Link each expense to a registered vendor or contractor"],
  ["TDS Tracking", "Track TDS percentage, amount deducted, and net payable per vendor"],
  ["Fund Debit Link", "Expenses can debit directly from sinking or reserve fund account"],
  ["Category Totals", "Auto-calculates total spent per category for the month"],
  ["CSV Export", "Export all expense records for a period to Excel"],
];
expFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("4. Budget Planning");
const budgetFeats = [
  ["Fiscal Year", "Indian fiscal year format — April to March (2025-26, 2026-27)"],
  ["Category Budgets", "Set planned spend amount for each expense category at the start of the year"],
  ["Auto-Pull Actuals", "System automatically pulls actual spend from expenses and fund debits"],
  ["Variance Tracking", "See exactly where you are over budget or under budget per category"],
  ["Visual Chart", "Planned vs actual bar chart comparison for quick visual review"],
  ["Annual Planning", "Use at AGM to present next year's budget to members for approval"],
];
budgetFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("5. Fund Accounts");
const fundFeats = [
  ["Fund Types", "Sinking Fund, Corpus Fund, Reserve Fund — each tracked separately"],
  ["Transactions", "Credit (deposit) and debit (spend) transactions with full history"],
  ["Auto Expense", "When you debit a fund, it automatically creates a linked expense entry"],
  ["Balance View", "Running balance shown for each fund with every transaction"],
  ["No Double Entry", "Fund debit creates expense automatically — no manual duplicate work"],
  ["Insurance Ready", "Total fund balances available for insurance and audit declarations"],
];
fundFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("6. Tenant Rent Invoices");
const rentFeats = [
  ["Separate Invoices", "Generate monthly rent invoices for each tenant flat independently"],
  ["Lease Tracking", "Track lease start date, end date, monthly rent and billing responsibility"],
  ["Billing Responsibility", "Owner pays / Tenant pays / Split — configurable per flat"],
  ["Tenant Portal", "Tenant views and pays rent in their own scoped app login"],
  ["Owner View", "Owner sees all rent receipts without accessing the tenant's personal data"],
  ["Lease Expiry Alert", "System alerts committee on approaching lease expiry for renewal action"],
];
rentFeats.forEach(([l, d]) => bullet(l, d));

// ════════════════════════════════════════════════════════════════════════
// PAGE 6 — SALARIES & ACCOUNTING
// ════════════════════════════════════════════════════════════════════════
doc.addPage();

heading3("7. Staff Salary & Payroll");
const salaryFeats = [
  ["Staff Roles", "Security, Housekeeping, Manager, Electrician, Plumber, Gardener, Admin Staff"],
  ["Monthly Entry", "Enter basic pay, overtime hours, deductions, bonus per staff per month"],
  ["Net Pay Calc", "Net pay automatically calculated as: basic + overtime + bonus - deductions"],
  ["Mark Paid", "Mark salary as paid — auto-creates expense entry for that month's payroll"],
  ["Payment Modes", "Cash, NEFT/RTGS, Cheque, UPI — all payment modes supported"],
  ["Salary History", "Month-wise salary history maintained for every society staff member"],
  ["Audit Ready", "Full payroll records available for labour law compliance and PF/ESIC"],
];
salaryFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("8. Double-Entry Accounting & Ledger");
note("Full professional accounting module — not just a cash book, but a proper double-entry system.");
const accFeats = [
  ["Chart of Accounts", "Tree-structured ledger accounts: ASSET, LIABILITY, INCOME, EXPENSE, EQUITY"],
  ["Journal Vouchers", "Create vouchers with line items — workflow: DRAFT → POSTED → VOID"],
  ["Auto Ledger Entries", "Every payment, expense, and bill automatically generates ledger entries"],
  ["Trial Balance", "Instant trial balance: total debits vs total credits — CA-ready report"],
  ["P&L Statement", "Profit and Loss: total income minus total expenses for any period"],
  ["Audit Trail", "Every journal voucher linked to the actor who created and posted it"],
];
accFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("9. Financial Reports");
const reportGroups = [
  {
    title: "Monthly Collection Report",
    items: [
      "Total flats: active occupants, vacant flats, new move-ins",
      "Bills generated vs collected vs pending for the month",
      "Collection rate percentage for the month",
      "Payment method breakdown: Cash / UPI / NEFT / Cheque",
      "List of defaulter flats with owner name and contact number",
      "CSV export for follow-up calls and records",
    ]
  },
  {
    title: "Annual Report (12-Month View)",
    items: [
      "Month-by-month billing, collection, and pending amounts",
      "Year-on-year collection rate trend comparison",
      "Annual totals: total generated, total collected, total pending",
      "Bar chart showing monthly collection trends visually",
      "Export full year to Excel for AGM presentation",
    ]
  },
  {
    title: "Financial Report (Profit & Loss)",
    items: [
      "Income breakdown: Maintenance + Marketplace fees + Other income",
      "Expenses broken down by all 40+ categories",
      "Net profit or loss for the period",
      "Fund account balances snapshot at point in time",
      "Budget vs actual variance table for the year",
      "Charts: Donut (expense split), Line (income/expense trend)",
    ]
  }
];
reportGroups.forEach(rg => {
  doc.fillColor(TEAL).font("Helvetica-Bold").fontSize(10).text(rg.title + ":", 58, doc.y);
  rg.items.forEach(it => {
    doc.fillColor(SLATE).font("Helvetica").fontSize(9).text("    ▸  " + it, 58, doc.y, { width: W - 20 });
  });
  doc.moveDown(0.4);
});

// ════════════════════════════════════════════════════════════════════════
// PAGE 7 — SECURITY MODULE
// ════════════════════════════════════════════════════════════════════════
heading1("Security Module — Gate, Visitors, Guard & Emergency");

heading3("10. Digital Visitor Gate Management");
note("Replaces the paper visitor register completely. Every visitor is logged, verified, and tracked.");
const visitorFlow = [
  "Step 1 — Pre-Approve: Resident pre-approves expected visitor in the app before they arrive",
  "Step 2 — OTP/Passcode: Visitor shows passcode or QR code at gate — guard scans to verify",
  "Step 3 — Log Entry: Guard records visitor name, phone, purpose, vehicle number and photo",
  "Step 4 — Notify Resident: Resident receives push notification and can approve or reject",
  "Step 5 — Exit Logged: Exit time auto-stamped — full visit duration saved in system",
];
visitorFlow.forEach(s => {
  doc.fillColor(TEAL).font("Helvetica-Bold").fontSize(9).text("  " + s.split("—")[0], 58, doc.y, { continued: true });
  doc.fillColor(SLATE).font("Helvetica").text("— " + s.split("—")[1], { width: W - 20 });
});
doc.moveDown(0.4);

const visitorFeats = [
  ["Visitor Types", "Delivery (Swiggy/Zomato/Amazon), Guest/Relative, Service technician, Cab (OLA/Uber/Rapido), Contractor, Walk-in"],
  ["Blacklist", "Block known threats — auto-rejected at gate without needing guard to make a call"],
  ["Package Tracking", "Log incoming parcels with courier name and flat number — resident notified"],
  ["Visitor History", "Full searchable visitor log by flat number, visitor name, date, or purpose"],
  ["Gate Incidents", "Guards log security incidents with description, category, and timestamp"],
  ["Expected List", "Guard dashboard shows expected visitors for the day with scheduled arrival time"],
  ["Gate Stats", "Live count on guard dashboard: visitors inside / expected / pending approval / packages"],
];
visitorFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("11. Guard Gate App");
note("Guards have a completely separate, scoped app login. They cannot see any financial or personal resident data.");
const guardFeats = [
  ["Separate Login", "Guards log in with guard credentials — sees only gate-relevant screens"],
  ["Flat Directory", "Guard can look up any flat number to see occupant name and phone for verification"],
  ["Live Dashboard", "Real-time count: visitors inside, expected arrivals, pending approvals, pending packages"],
  ["Staff Check-in", "Daily domestic staff (maid, cook, driver) entry and exit logged by guard"],
  ["Package Log", "Incoming parcel logged with courier, tracking number, flat — resident notified"],
  ["Reject Visitor", "Guard can reject entry — system logs the reason automatically"],
  ["Patrol Rounds", "Guard marks checkpoints during patrol — timestamped, route tracked"],
  ["Patrol History", "Full history of all patrol rounds — see gaps, missed checkpoints, timing"],
];
guardFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("12. Emergency Response System");
const emergencyFeats = [
  ["SOS Types", "Fire, Medical, Security, and Other — each triggers different alert chain"],
  ["One-Tap SOS", "Single tap sends emergency alert to all committee members simultaneously"],
  ["Emergency Broadcast", "Chairman sends broadcast to all residents in one click"],
  ["National Helplines", "100 (Police), 101 (Fire Brigade), 102 (Ambulance), 1091 (Women), 108 (Disaster)"],
  ["Contact Book", "Plumber, Electrician, Ambulance/Hospital, Fire Brigade, Pest Control, Legal Adviser"],
  ["Legal Adviser", "Society legal adviser name and phone stored in settings — accessible to all committee"],
];
emergencyFeats.forEach(([l, d]) => bullet(l, d));

// ════════════════════════════════════════════════════════════════════════
// PAGE 8 — RESIDENT SERVICES
// ════════════════════════════════════════════════════════════════════════
heading1("Resident Services — Complaints, Notices, Forum, Polls & Events");

heading3("13. Complaint & SLA Management");
note("Residents raise complaints in the app — committee tracks, assigns, and closes with full accountability.");
const complaintFeats = [
  ["Categories", "Plumbing, Electrical, Cleanliness, Security, Parking, General — each with own SLA"],
  ["Priority Levels", "Low, Medium, High, Urgent — affects escalation timeline"],
  ["SLA Timer", "Each category has configurable SLA hours — timer starts when complaint is raised"],
  ["Auto Escalation", "Breaches SLA? Auto-escalates: Level 1 (Secretary) → Level 2 (Chairman)"],
  ["Assignment", "Committee assigns complaint to a specific vendor or internal staff member"],
  ["Media Attachments", "Resident can attach photo or video as evidence when raising complaint"],
  ["Resolution Proof", "Staff adds resolution notes and proof photo/video when marking resolved"],
  ["Satisfaction Rating", "Resident rates resolution 1–5 stars with optional comment"],
  ["Stats Dashboard", "Live count of Open / In-Progress / Resolved / Total complaints"],
  ["Filter & Search", "Filter by status, category, priority, flat number, or date range"],
];
complaintFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("14. Notice Board");
const noticeFeats = [
  ["Categories", "General, Event, Maintenance, Emergency, Meeting — color-coded by type"],
  ["Pin Notices", "Important notices can be pinned to top — always visible above regular notices"],
  ["Expiry Date", "Set expiry date — notice auto-archives after the date"],
  ["Read Receipts", "Track which residents have read each notice — see unread count"],
  ["Push Notification", "All residents instantly notified via push notification on new notice"],
  ["Archive", "Old notices searchable by category, date, or keyword"],
];
noticeFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("15. Community Forum");
const forumFeats = [
  ["Threaded Discussions", "Residents create topics and reply in structured threads"],
  ["Replace WhatsApp", "No more important messages getting lost in WhatsApp groups"],
  ["Moderation", "Committee can moderate, close, or delete any thread"],
  ["Identity Linked", "All posts linked to resident login — no anonymous or fake posts"],
  ["Searchable", "Search forum by topic keyword, date, or resident"],
];
forumFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("16. Polls & Voting");
const pollFeats = [
  ["Custom Options", "Create polls with any number of custom voting options"],
  ["One Vote Per Flat", "System enforces one vote per flat number — no vote stuffing"],
  ["Close Deadline", "Set poll close date and time — auto-closes at deadline"],
  ["Live Results", "Chairman sees vote count in real time as residents vote"],
  ["Use Cases", "AGM resolutions, rule changes, event decisions, colour schemes, bylaws"],
];
pollFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("17. Events & Meeting Minutes");
const eventFeats = [
  ["Events", "Create society events: Diwali, sports day, clean-up drive, tree plantation"],
  ["RSVP Tracking", "Residents confirm attendance — committee sees headcount in advance"],
  ["Meeting Types", "AGM (Annual General Meeting), SGM (Special), Committee, General Body"],
  ["Minutes Recording", "Record attendees, agenda items, decisions taken formally"],
  ["Permanent Record", "Meeting minutes stored as official society records — never lost"],
];
eventFeats.forEach(([l, d]) => bullet(l, d));

// ════════════════════════════════════════════════════════════════════════
// PAGE 9 — PROPERTY MANAGEMENT
// ════════════════════════════════════════════════════════════════════════
heading1("Property & Facility Management — Parking, Amenities, Assets");

heading3("18. Parking Management System");
const parkingFeats = [
  ["Zones", "Create parking zones by wing, level, or area (B1, B2, Open, Terrace)"],
  ["Slot Types", "CAR, BIKE, EV (Electric Vehicle), VISITOR, STAFF — each slot typed"],
  ["Assignment Types", "Owner, Tenant, Temporary, Staff, Visitor — full flexibility"],
  ["Assignment History", "Full date-ranged history of who had which slot — timestamped"],
  ["Occupancy Grid", "Color-coded visual grid: green=assigned, gray=vacant, red=blocked"],
  ["Vehicle Registry", "Register vehicle number and sticker ID per flat"],
  ["EV Charging", "Dedicated EV slot type with charging status tracking"],
  ["Parking Sharing", "Owner with unused slot can share or rent it to another resident"],
  ["Parking Request", "Resident raises parking request — admin approves and assigns"],
  ["Blocked Slots", "Mark slots as BLOCKED or MAINTENANCE — prevents any assignment"],
  ["Paid Parking", "Marketplace: owner can set a price for slot sharing between residents"],
  ["Audit Trail", "Every assignment, release, and sharing transaction is logged"],
];
parkingFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("19. Amenity & Facility Booking");
note("Online booking with capacity control, policies, waitlists, and automatic penalty invoicing.");
const amenityFeats = [
  ["Facilities", "Gym, Swimming Pool, Party/Banquet Hall, Sports Courts, Garden, Terrace, Club House, Meeting Room"],
  ["Time Booking", "Book by date, start time, and end time — overlap prevented automatically"],
  ["Capacity Control", "Maximum capacity enforced per time slot — no overbooking"],
  ["Rate Per Hour", "Set hourly rate for each facility — billing auto-calculated on booking"],
  ["Max Hours/Day", "Limit total hours one flat can book per day per facility"],
  ["Cooldown Period", "Force a gap between consecutive bookings — prevents monopoly"],
  ["Guest Limit", "Set maximum number of guests allowed per booking"],
  ["Cancellation Cutoff", "Booking can only be cancelled N hours before the start time"],
  ["Approval Mode", "Admin approval required before booking is confirmed (optional toggle)"],
  ["Waitlist", "Waitlist system for fully booked time slots — auto-notify on cancellation"],
  ["Usage Logs", "Check-in, Check-out, No-show, Damage, Extended — all logged"],
  ["Penalty Invoice", "Damage or misuse logged → penalty invoice auto-generated"],
  ["Blackout Schedules", "Mark facility as OPEN, BLACKOUT, or MAINTENANCE for specific dates"],
];
amenityFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("20. Asset Register");
const assetFeats = [
  ["Asset Types", "Generator, Elevator/Lift, Water Pump, Gym Equipment, CCTV, Furniture, Other"],
  ["Purchase Details", "Purchase date, purchase amount, vendor, serial number"],
  ["Current Value", "Current (depreciated) value tracked — useful for insurance declarations"],
  ["Warranty Alert", "Warranty end date tracked — alert before warranty expires"],
  ["Maintenance Schedule", "Set maintenance cycle in days — system auto-flags overdue assets"],
  ["Condition Tracking", "Excellent / Good / Fair / Poor / Out of Order — updated after each service"],
  ["Total Value", "Sum of all asset values shown on dashboard for insurance and AGM reporting"],
];
assetFeats.forEach(([l, d]) => bullet(l, d));

// ════════════════════════════════════════════════════════════════════════
// PAGE 10 — PEOPLE & COMMUNICATION
// ════════════════════════════════════════════════════════════════════════
heading1("People Management, Communication & Admin Tools");

heading3("21. Member / Resident Registry");
const memberFeats = [
  ["Flat-Wise Records", "Owner name, phone, email, alternate phone — linked to flat number"],
  ["Wing Filter", "Filter by wing (A/B/C/D) — useful for wing-specific communications"],
  ["Flat Types", "1BHK, 2BHK, 3BHK, 4BHK, Shop, Office, Penthouse"],
  ["Occupancy Status", "Owner occupied, Tenant occupied, Vacant — real-time status"],
  ["Search", "Search by flat number, owner name, or phone number instantly"],
  ["Bulk Import", "CSV bulk import for initial onboarding of all flats in one go"],
  ["Export", "Export full member directory with contact details to CSV"],
  ["Pagination", "Handles 500+ flats — paginated for performance"],
];
memberFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("22. Tenant Management");
const tenantFeats = [
  ["Tenant Details", "Name, phone, email, lease start, lease end, monthly rent"],
  ["Lease Status", "Pending → Active → Expired → Terminated workflow"],
  ["Billing Responsibility", "Owner pays maintenance / Tenant pays / Split between owner and tenant"],
  ["Tenant App Login", "Separate scoped login for tenant — only sees own rent, notices, complaints"],
  ["Society Join Code", "Unique code given to tenant to join the app and link to their flat"],
  ["Lease Expiry Alert", "Automatic notification to committee before lease expiry"],
  ["Move-in/out Linked", "Tenancy linked to move-in and move-out event checklists"],
];
tenantFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("23. Domestic Staff Management (Per-Flat)");
const staffFeats = [
  ["Staff Categories", "Maid, Cook, Driver, Nanny, Gardener, Watchman, Other"],
  ["Multi-Flat Link", "One staff member can be linked to multiple flats with different agreed pay"],
  ["Entry Code", "Staff entry code used by guard app for daily check-in verification"],
  ["Attendance", "Guard marks daily attendance — entry time and exit time per staff"],
  ["Active Toggle", "Mark any staff as inactive when they stop working"],
  ["Salary Tracking", "Resident records monthly salary payment per staff from resident portal"],
];
staffFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("24. Vendor Directory");
const vendorFeats = [
  ["Categories", "Plumbing, Electrical, Civil, Housekeeping, Security, IT, Pest Control, Others"],
  ["Contact Details", "Phone, email, service area, address"],
  ["AMC Tracking", "Annual Maintenance Contract: start date, end date, annual amount per vendor"],
  ["Complaint Link", "Vendor can be assigned directly when logging a new complaint"],
  ["Expense Link", "When recording an expense, vendor name auto-fills from the registered directory"],
];
vendorFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("25. WhatsApp Reminders");
const waFeats = [
  ["Defaulter Reminders", "Send payment reminder to one specific flat or all pending flats in one click"],
  ["English + Marathi", "Built-in templates in both languages — edit before sending"],
  ["Auto Fill", "Template auto-fills flat number, owner name, amount due, and due date"],
  ["Direct Link", "Resident receives a WhatsApp message with UPI payment deep-link"],
  ["API Integration", "Optional WhatsApp Business API for automated bulk sending"],
  ["Last Reminder Date", "Tracks date of last reminder per flat — prevents spamming"],
];
waFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("26. Push Notification System");
const pushFeats = [
  ["Bill Due", "Sent when maintenance bill is generated for a flat"],
  ["Payment Confirmed", "Confirmation push when payment is marked as received"],
  ["Complaint Update", "Alert when complaint status changes: In Progress / Resolved"],
  ["New Notice", "Instant push to all residents when committee posts a notice"],
  ["New Poll", "All residents alerted when a new poll is available for voting"],
  ["Visitor at Gate", "Resident gets push notification when guard logs a visitor for their flat"],
  ["Late Fee Applied", "Resident notified when late fee is added to their bill"],
];
pushFeats.forEach(([l, d]) => bullet(l, d));

// ════════════════════════════════════════════════════════════════════════
// PAGE 11 — ADMIN & SECURITY
// ════════════════════════════════════════════════════════════════════════
heading1("Admin Tools, Security & Mobile Application");

heading3("27. Credential Management");
const credFeats = [
  ["View All Accounts", "See all registered users: Admins, Members, Tenants, and Guards"],
  ["Bulk Generate", "Generate app login credentials for all flat owners in one operation"],
  ["Role Assignment", "Assign role: Chairman, Secretary, Treasurer, Member, Tenant, Guard"],
  ["Join Code", "Society join code displayed — share with residents for app onboarding"],
  ["CSV Export", "Export all user accounts with credentials to CSV for distribution"],
  ["Password Toggle", "Show/hide password visibility during setup sessions"],
];
credFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("28. Activity Audit Log");
note("Every action in the system is logged — who did what, when, from where. Tamper-proof.");
const auditFeats = [
  ["Actions Logged", "Created, Updated, Deleted, Paid, Generated, Sent, Resolved, Approved"],
  ["Modules Tracked", "Bill, Expense, Complaint, Notice, Visitor, Flat, Poll, Meeting, Facility, Parking, Document, Settings"],
  ["Actor + Timestamp", "User name, action time, and IP address recorded for every event"],
  ["Accountability", "Chairman can see every change made by any committee member"],
  ["Tamper-Proof", "Nobody can delete or edit audit log entries — permanent record"],
  ["Searchable", "Filter audit log by module, action type, actor, or date range"],
];
auditFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("29. Society Settings");
const settingsFeats = [
  ["Basic Info", "Society name, logo URL, address, city, pincode"],
  ["Payment Config", "Society UPI ID, bank name, account number, IFSC code"],
  ["Billing Config", "Maintenance amount per flat, due day of month, late fee"],
  ["SLA Config", "Hours per complaint category — e.g. Plumbing=24h, Electrical=12h, General=48h"],
  ["Emergency", "Emergency phone number, legal adviser name and contact"],
  ["Subscription", "Plan tier, subscription end date, recharge history"],
];
settingsFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("30. Enterprise Security Architecture");
const secFeats = [
  ["JWT Sessions", "All logins secured with encrypted JWT tokens — automatic session expiry"],
  ["6-Level RBAC", "Role-Based Access Control: Chairman / Secretary / Treasurer / Member / Tenant / Guard"],
  ["Multi-Society Isolation", "Complete data isolation between societies — Society A cannot see Society B"],
  ["Audit Trail", "Every action logged with user, timestamp, module, and IP address"],
  ["Rate Limiting", "Brute-force protection — authentication endpoints rate-limited at server level"],
  ["Security Headers", "Industry-standard HTTP security headers on every page and API response"],
  ["PostgreSQL", "Enterprise-grade relational database — ACID compliant, fully indexed"],
  ["Session Revocation", "View all active login sessions — revoke any suspicious device remotely"],
];
secFeats.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.5);

heading3("31. Mobile App — Web + Android + iOS");
note("Built with Capacitor v6 — the same Next.js web app runs natively on Android and iOS.");
const appRoles = [
  ["Resident App", "Pay bills, raise complaints, book amenities, view notices, forum, polls, marketplace"],
  ["Chairman/Admin", "Full dashboard access: billing, expenses, reports, settings, credentials, analytics"],
  ["Treasurer", "Payments, receipts, fund accounts, salary management, expense tracking"],
  ["Guard App", "Scoped login: visitor log, package tracking, staff check-in, patrol — no financial data"],
  ["Tenant Portal", "View and pay rent, raise complaints, see notices — scoped to own flat only"],
  ["Owner Portal", "View rent invoices, occupant details, billing — accessible from anywhere (NRI-friendly)"],
];
appRoles.forEach(([l, d]) => bullet(l, d));
doc.moveDown(0.4);

const offlineFeats = [
  ["Works Offline", "App caches data using IndexedDB — guards in basements can still log visitor entries"],
  ["Request Queue", "Actions taken while offline are queued and auto-synced when internet returns"],
  ["Exponential Backoff", "Failed API requests retry automatically with smart delay — zero data loss"],
  ["Sync on Reconnect", "All queued actions are flushed immediately on reconnection"],
  ["Mobile Diagnostics", "Logging for error debugging without disrupting the user experience"],
];
offlineFeats.forEach(([l, d]) => bullet(l, d));

// ════════════════════════════════════════════════════════════════════════
// PAGE 12 — PRICING & ONBOARDING
// ════════════════════════════════════════════════════════════════════════
heading1("Pricing Plans & Onboarding Process");

heading3("Pricing Plans");
const plans = [
  {
    name: "Starter — ₹999/month", tag: "Up to 50 Flats",
    features: [
      "Maintenance Billing & UPI Payments", "Visitor Gate Log",
      "Complaints & Notice Board", "Member Directory",
      "Basic Financial Reports", "Android Mobile App",
      "Activity Audit Log", "Email Support",
    ]
  },
  {
    name: "Professional — ₹2,499/month", tag: "Up to 200 Flats  ★ Most Popular",
    features: [
      "Everything in Starter, plus:",
      "Parking Management System", "Amenity / Facility Booking",
      "Staff Attendance & Payroll", "Tenant Management & Rent Invoices",
      "Polls, Events & Meeting Minutes", "WhatsApp Reminder Engine",
      "iOS + Android App", "Priority Support",
    ]
  },
  {
    name: "Enterprise — ₹5,999/month", tag: "Unlimited Flats",
    features: [
      "Everything in Professional, plus:",
      "Double-Entry Accounting & Ledger", "Trial Balance & Journal Vouchers",
      "Budget Planning & Fund Accounts", "Asset Register & Vendor Directory",
      "Multi-Society Dashboard", "Document Management",
      "Custom Branding & API Access", "Dedicated Account Manager",
    ]
  }
];
plans.forEach(plan => {
  doc.fillColor(INDIGO).font("Helvetica-Bold").fontSize(11).text(plan.name, 58, doc.y);
  doc.fillColor(GOLD).font("Helvetica").fontSize(9).text("  " + plan.tag, 58, doc.y, { width: W - 20 });
  plan.features.forEach(f => {
    doc.fillColor(SLATE).font("Helvetica").fontSize(9).text("    ✓  " + f, 58, doc.y, { width: W - 20 });
  });
  doc.moveDown(0.5);
  hr();
});

note("All plans include: 30-day free trial · 20% off on annual billing · Onboarding support included");
doc.moveDown(0.5);

heading3("3-Step Onboarding Process");
const onboarding = [
  {
    n: "Step 1 — We Onboard Your Society (Day 1)",
    pts: [
      "Share society name, address, and flat list with us",
      "We create your society database within 1 working day",
      "Society logo, UPI ID, and billing settings configured",
      "Chairman account created and handed over securely",
      "WhatsApp and push notification settings activated",
    ]
  },
  {
    n: "Step 2 — Residents Join the App (Day 2–3)",
    pts: [
      "Residents download SmartSocietyHub from Play Store or App Store",
      "Join using the unique society code shared by chairman",
      "Profile automatically linked to their flat number",
      "Guard receives separate login credentials for gate app",
      "Tenants receive scoped login — only see their own data",
    ]
  },
  {
    n: "Step 3 — Go Fully Digital (Day 3 onwards)",
    pts: [
      "Generate first month's maintenance bills with one click",
      "Residents pay via UPI — receipts auto-generated and stored",
      "Guard begins digital visitor log from the first day",
      "Post first notice — all residents notified instantly via push",
      "WhatsApp payment reminders sent to defaulters automatically",
    ]
  }
];
onboarding.forEach(step => {
  doc.fillColor(TEAL).font("Helvetica-Bold").fontSize(10).text(step.n, 58, doc.y);
  step.pts.forEach(p => {
    doc.fillColor(SLATE).font("Helvetica").fontSize(9).text("    ▸  " + p, 58, doc.y, { width: W - 20 });
  });
  doc.moveDown(0.4);
});

// ════════════════════════════════════════════════════════════════════════
// PAGE 13 — COMPETITIVE ADVANTAGES & SUMMARY
// ════════════════════════════════════════════════════════════════════════
heading1("Competitive Advantages & Summary");

heading3("Why SmartSocietyHub vs. Other Solutions");
const reasons = [
  ["Built for India — Not Adapted",
   "UPI payment links, GST compliance, WhatsApp reminders in English/Marathi/Hindi, Indian fiscal year " +
   "April–March, rupee formatting, national helplines — every detail designed for Indian residential societies."],
  ["Web + Mobile for One Price",
   "Full web dashboard AND native Android + iOS apps for all 6 user roles (Chairman, Secretary, " +
   "Treasurer, Resident, Tenant, Guard) — all included in one subscription at no extra cost."],
  ["Truly Works Offline",
   "Guards in the basement, residents in elevators — the app still works. Data queues locally and " +
   "syncs the moment internet returns. Exponential backoff retry ensures zero data loss."],
  ["CA & AGM Ready in One Click",
   "Trial balance, ledger, P&L, fund accounts, journal vouchers — all generated instantly. " +
   "No CA needs to chase the secretary for Excel files before annual audit."],
  ["Zero IT Overhead",
   "We handle hosting, backups, security patches, and updates. Society committee manages the " +
   "society — we manage the technology. No server, no IT person, no maintenance cost."],
  ["Complete — Not Piecemeal",
   "30+ modules in one platform. No separate app for billing, another for gate, another for complaints. " +
   "One login, one data source, one subscription — everything connected and coherent."],
];
reasons.forEach(([title, desc]) => {
  doc.fillColor(INDIGO).font("Helvetica-Bold").fontSize(10).text("◆  " + title, 58, doc.y);
  doc.fillColor(SLATE).font("Helvetica").fontSize(9).text("    " + desc, 58, doc.y, { width: W - 20 });
  doc.moveDown(0.4);
});
doc.moveDown(0.3);

heading3("Complete Module List (All 30+ Modules)");
const allModules = [
  "Maintenance Billing & Invoice Engine", "Resident Bill Payment Portal (My Bills)",
  "Expense Management (40+ categories)", "Budget Planning & Variance Tracking",
  "Sinking / Corpus / Reserve Fund Accounts", "Tenant Rent Invoice Management",
  "Staff Salary & Payroll Processing", "Double-Entry Accounting & Ledger",
  "Trial Balance & Journal Vouchers", "Financial Reports (Monthly/Annual/P&L)",
  "Digital Visitor Gate Management", "Guard Gate Dedicated App",
  "Package / Parcel Tracking", "Guard Patrol Rounds & Checkpoints",
  "Gate Incident Reporting", "Emergency SOS System",
  "Emergency Contact Book", "Complaint & SLA Management",
  "Notice Board with Push Notifications", "Community Forum",
  "Polls & Voting System", "Events & RSVP Tracking",
  "Meeting Minutes Recording", "Parking Zone & Slot Management",
  "Vehicle Registry & EV Slots", "Parking Sharing Marketplace",
  "Amenity & Facility Booking", "Booking Policies & Penalties",
  "Member / Resident Directory", "Tenant Management & Lease Tracking",
  "Domestic Staff Management (per Flat)", "Asset Register & Maintenance Schedule",
  "Vendor Directory & AMC Tracking", "Document Store",
  "Move-In / Move-Out Event Checklists", "WhatsApp Reminder Engine",
  "Push Notification System", "Resident Marketplace (Buy/Sell)",
  "Credential Management & Bulk Login Generation", "Activity Audit Log",
  "Session Management & Revocation", "Society Settings & Configuration",
  "Role-Based Access Control (6 roles)", "Multi-Society Data Isolation",
  "Mobile App (Android + iOS via Capacitor)", "Offline-First Mode with Sync Queue",
];
const col1 = allModules.slice(0, Math.ceil(allModules.length / 2));
const col2 = allModules.slice(Math.ceil(allModules.length / 2));
const startY = doc.y;
col1.forEach((m, i) => {
  doc.fillColor(SLATE).font("Helvetica").fontSize(8.5)
     .text("▸  " + m, 52, startY + i * 14, { width: W / 2 - 10 });
});
col2.forEach((m, i) => {
  doc.fillColor(SLATE).font("Helvetica").fontSize(8.5)
     .text("▸  " + m, 52 + W / 2 + 5, startY + i * 14, { width: W / 2 - 10 });
});

// ════════════════════════════════════════════════════════════════════════
// FINAL PAGE — KEY STATS
// ════════════════════════════════════════════════════════════════════════
doc.addPage();
doc.rect(0, 0, 595, 842).fill(INDIGO);
doc.rect(0, 0, 8, 842).fill(GOLD);

doc.fillColor(WHITE).fontSize(26).font("Helvetica-Bold")
   .text("SmartSocietyHub — Key Statistics", 50, 80, { width: W });
doc.moveDown(0.5);
doc.rect(50, doc.y, W, 2).fill(GOLD);
doc.moveDown(1.5);

const stats = [
  ["30+", "Modules Built-in", "Every society need covered in one platform"],
  ["50+", "Database Entity Types", "Comprehensive data model for all society operations"],
  ["6", "User Role Types", "Chairman, Secretary, Treasurer, Member, Tenant, Guard"],
  ["88+", "API Endpoints", "Secure, role-protected REST API backend"],
  ["40+", "Expense Categories", "Complete expense classification for Indian societies"],
  ["100%", "Digital Audit Trail", "Every action logged — full accountability guaranteed"],
  ["24 hrs", "Setup Time", "From signup to fully operational in one working day"],
  ["₹0", "Extra Cost for Mobile", "Android + iOS app included in every plan"],
  ["Offline", "Works Without Internet", "Guards and residents in dead zones stay productive"],
  ["UPI", "India-First Payments", "UPI deep-links, QR codes, UTR confirmation built-in"],
];
stats.forEach((st, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 50 + col * 250;
  const y = 150 + row * 100;
  doc.rect(x, y, 230, 80).fill("#1E1B4B");
  doc.rect(x, y, 230, 3).fill(GOLD);
  doc.fillColor(GOLD).fontSize(22).font("Helvetica-Bold").text(st[0], x + 10, y + 10, { width: 210 });
  doc.fillColor(WHITE).fontSize(11).font("Helvetica-Bold").text(st[1], x + 10, y + 38, { width: 210 });
  doc.fillColor("#A5B4FC").fontSize(8.5).font("Helvetica").text(st[2], x + 10, y + 56, { width: 210 });
});

doc.fillColor("#818CF8").fontSize(10).font("Helvetica")
   .text("SmartSocietyHub  ·  Complete Society Management Platform  ·  Built for India",
         50, 780, { width: W, align: "center" });
doc.fillColor(GOLD).fontSize(9).font("Helvetica-Bold")
   .text("hello@smartsocietyhub.in  ·  www.smartsocietyhub.in  ·  +91 98765 43210",
         50, 800, { width: W, align: "center" });

// ── FINALIZE ─────────────────────────────────────────────────────────
doc.end();
console.log("\n✅  PDF generated: SmartSocietyHub-Source.pdf");
console.log("📄  Pages: ~14  |  Full product documentation for NotebookLM");
console.log("📌  Upload this PDF as a source in NotebookLM\n");
