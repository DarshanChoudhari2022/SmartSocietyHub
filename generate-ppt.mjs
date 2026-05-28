// SmartSocietyHub — Marketing PPT v2 (Full Feature Coverage)
// Theme: Clean White + Deep Indigo + Gold  |  24 slides
// node generate-ppt.mjs  →  SmartSocietyHub-Presentation.pptx
import pptxgen from "pptxgenjs";
const prs = new pptxgen();
prs.layout = "LAYOUT_WIDE";

// ── Palette ──────────────────────────────────────────────────────────
const C = {
  indigo:  "312E81", navy:   "1E1B4B", mid:    "4338CA",
  soft:    "6366F1", lilac:  "EEF2FF", white:  "FFFFFF",
  gold:    "D97706", lgold:  "FEF3C7", amber:  "F59E0B",
  charcoal:"111827", slate:  "374151", gray:   "6B7280",
  lgray:   "F3F4F6", mgray:  "E5E7EB", green:  "065F46",
  lgreen:  "D1FAE5", red:    "991B1B", lred:   "FEE2E2",
  teal:    "0D9488", lteal:  "CCFBF1", orange: "C2410C",
  lorange: "FFEDD5",
};

// ── Generic helpers ──────────────────────────────────────────────────
const bg  = (s, color=C.white) => s.addShape(prs.ShapeType.rect,{x:0,y:0,w:"100%",h:"100%",fill:{color},line:{color,width:0}});
const rect= (s,x,y,w,h,fill,border=fill) => s.addShape(prs.ShapeType.rect,{x,y,w,h,fill:{color:fill},line:{color:border,width:1}});
const line= (s,x,y,w,col) => s.addShape(prs.ShapeType.line,{x,y,w,h:0,line:{color:col,width:1.5}});
const txt = (s,t,x,y,w,h,sz,bold,color,align="left",wrap=true,italic=false) =>
  s.addText(t,{x,y,w,h,fontSize:sz,bold,color,align,fontFace:"Calibri",valign:"middle",wrap,italic});
const shad=(s,x,y,w,h,fill,bdr=fill) =>
  s.addShape(prs.ShapeType.rect,{x,y,w,h,fill:{color:fill},line:{color:bdr,width:1},
    shadow:{type:"outer",blur:5,offset:2,angle:45,color:"CCCCCC",opacity:0.25}});

// ── Slide chrome ─────────────────────────────────────────────────────
function chrome(s, tag, title, sub="") {
  bg(s);
  rect(s, 0, 0, "100%", 0.08, C.indigo, C.indigo);
  rect(s, 0, 7.1, "100%", 0.4, C.navy, C.navy);
  rect(s, 0.5, 0.15, 1.9, 0.28, C.soft, C.soft);
  txt(s, tag.toUpperCase(), 0.5,0.15,1.9,0.28, 7.5, true, C.white, "center");
  txt(s, title, 0.5,0.55,12.4,0.65, 24, true, C.navy, "left");
  if (sub) txt(s, sub, 0.5,1.18,12,0.35, 11.5, false, C.gray, "left");
  line(s, 0.5, 1.48, 12.3, C.mgray);
  txt(s, "SmartSocietyHub  ·  Complete Society Management Platform",
      0,7.1,"100%",0.4, 8.5, false, C.soft, "center");
}

// ── Two-column section header ─────────────────────────────────────────
function colHead(s, titleL, titleR, y=1.62) {
  rect(s, 0.4, y, 5.95, 0.34, C.indigo, C.indigo);
  txt(s, titleL, 0.4,y,5.95,0.34, 10, true, C.white, "center");
  rect(s, 6.7, y, 5.95, 0.34, C.gold, C.gold);
  txt(s, titleR, 6.7,y,5.95,0.34, 10, true, C.white, "center");
}

function painRow(s, prob, sol, y) {
  shad(s, 0.4, y, 5.75, 0.58, C.lred, "FCA5A5");
  txt(s, "✗  "+prob, 0.55, y+0.1, 5.45, 0.38, 10, false, C.red, "left");
  shad(s, 6.7, y, 5.75, 0.58, C.lgreen, "86EFAC");
  txt(s, "✓  "+sol,  6.85, y+0.1, 5.45, 0.38, 10, false, C.green,"left");
}

// ── Module header strip ───────────────────────────────────────────────
function modHead(s, emoji, modTitle, accentColor=C.indigo) {
  rect(s, 0.4, 1.6, 12.53, 0.42, accentColor, accentColor);
  txt(s, emoji+"  "+modTitle, 0.4, 1.6, 12.53, 0.42, 12, true, C.white, "center");
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 1 — TITLE
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  bg(s, C.navy);
  rect(s, 0, 0, 0.2, "100%", C.gold, C.gold);
  rect(s, 0.2, 0, "100%", 0.07, C.soft, C.soft);

  // Brand name
  txt(s, "SmartSocietyHub", 0.55, 1.05, 10, 1.3, 56, true, C.white, "left");
  // Tagline
  rect(s, 0.55, 2.45, 9.5, 0.07, C.gold, C.gold);
  txt(s, "The All-in-One Digital Platform for Residential Societies", 0.55,2.62,10.5,0.6, 20, false, "A5B4FC", "left");
  txt(s, "Billing  ·  Security  ·  Complaints  ·  Parking  ·  Staff  ·  Finance  ·  Mobile App",
      0.55,3.3,11,0.4, 12, false, "818CF8","left");

  // badge row
  const badges=[
    {l:"30+ Modules",c:C.soft},{l:"Web + Mobile App",c:C.teal},
    {l:"UPI Payments",c:C.gold},{l:"Works Offline",c:"7C3AED"},
    {l:"Multi-Society",c:C.orange},
  ];
  badges.forEach((b,i)=>{
    rect(s, 0.55+i*2.55, 4.0, 2.35, 0.45, "1E1B4B","4338CA");
    txt(s, b.l, 0.55+i*2.55,4.0,2.35,0.45, 10.5, true, b.c, "center");
  });

  // Bottom
  rect(s, 0, 6.85, "100%", 0.65, "0D0B2E","0D0B2E");
  txt(s, "Presented to: Society Chairman  |  SmartSocietyHub Team",
      0,6.85,"100%",0.65, 10, false, "818CF8","center");

  // Decorative dots
  ["5.5","5.9","6.3"].forEach((y,i)=>{
    rect(s,11.5+i*0.3,parseFloat(y),0.1,0.1, C.soft, C.soft);
  });
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 2 — WHAT IS SMARTSOCIETYHUB
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  chrome(s,"Overview","What is SmartSocietyHub?",
    "One complete digital platform — every need of your society, solved in one place.");

  txt(s,"SmartSocietyHub replaces paper registers, WhatsApp chaos, and Excel sheets with a "+
     "single smart platform that manages billing, security, complaints, parking, staff, "+
     "accounting and governance — for societies of any size.",
     0.5,1.62,12.3,0.75, 11.5, false, C.slate,"left");

  const pillars=[
    {e:"💰",t:"Finance & Billing",     d:"Auto bills, UPI payments, receipts, ledger, budgets, fund accounts, salary, reports",    c:C.indigo},
    {e:"🔐",t:"Security & Access",     d:"Digital visitor gate, guard patrol, blacklist, QR entry, packages, gate incidents",      c:C.teal},
    {e:"🏘️",t:"Resident Services",    d:"Complaints, notices, forum, polls, events, meetings, facility booking, marketplace",     c:C.gold},
    {e:"👥",t:"People & Property",     d:"Members, tenants, staff, vendors, assets, parking, move-in/out, credential management", c:"7C3AED"},
  ];
  pillars.forEach((p,i)=>{
    const x=0.35+i*3.27;
    rect(s,x,2.5,3.05,4.2,C.lilac,C.soft);
    rect(s,x,2.5,3.05,0.5,p.c,p.c);
    txt(s,p.e,x,2.5,3.05,0.5,18,false,C.white,"center");
    txt(s,p.t,x,3.1,3.05,0.35,11.5,true,p.c,"center");
    txt(s,p.d,x+0.12,3.52,2.82,3.1, 9.5,false,C.slate,"left");
  });
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 3 — COMPLETE PROBLEM STATEMENT
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  chrome(s,"Pain Points","Problems Every Chairman Faces Daily",
    "Before SmartSocietyHub → After SmartSocietyHub");

  rect(s,0.4,1.62,5.75,0.36,C.red,C.red);
  txt(s,"❌  WITHOUT SmartSocietyHub",0.4,1.62,5.75,0.36,10,true,C.white,"center");
  rect(s,6.7,1.62,5.75,0.36,C.green,C.green);
  txt(s,"✅  WITH SmartSocietyHub",6.7,1.62,5.75,0.36,10,true,C.white,"center");

  const pairs=[
    ["Bills sent on paper or WhatsApp — residents ignore them",
     "Auto-generated bills sent via app + WhatsApp — no paper needed"],
    ["No idea which flat has paid — track in Excel sheet",
     "Live dashboard: paid/pending/defaulters visible in one click"],
    ["Residents pay cash to watchman — no receipt, no proof",
     "UPI payment in app — auto-receipt generated & stored"],
    ["Paper visitor register — anyone can enter false entry",
     "Digital gate log with OTP, photo & real-time resident approval"],
    ["Complaints told verbally — forgotten, no follow-up",
     "App complaints with SLA timer, escalation & satisfaction rating"],
    ["Parking disputes — no record of who was assigned what",
     "Full slot assignment history with timestamps & vehicle details"],
    ["Staff attendance in notebook — salary disputes monthly",
     "Digital attendance + payroll — salary auto-added to expenses"],
    ["AGM notices on paper/WhatsApp — no formal record",
     "Push notification to all residents + PDF minutes stored"],
    ["No financial report ready for auditor or CA",
     "Trial balance, ledger & P&L generated in one click"],
    ["Sinking fund balance unknown — no one knows the figure",
     "Fund accounts with every debit/credit transaction tracked"],
  ];
  pairs.forEach(([prob,sol],i)=>{
    painRow(s, prob, sol, 2.1+i*0.508);
  });

  // Arrow between columns
  txt(s,"→",6.2,3.45,0.5,0.5,20,true,C.soft,"center");
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 4 — MAINTENANCE BILLING (detailed)
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  chrome(s,"Finance · 1 of 4","Maintenance Billing — Fully Automated",
    "From generating bills to collecting payments — zero manual effort.");
  modHead(s,"🧾","Billing & Invoice Engine");

  // Flow boxes
  const steps=[
    {n:"1",t:"Configure",  d:"Set maintenance amount,\ndue day & late fee once"},
    {n:"2",t:"Generate",   d:"Click once — bills auto-\ncreated for every flat"},
    {n:"3",t:"Notify",     d:"WhatsApp + push\nalert sent instantly"},
    {n:"4",t:"Resident Pays",d:"UPI deep-link / QR /\ncash / NEFT / cheque"},
    {n:"5",t:"Receipt",    d:"Auto-generated receipt\nwith unique number"},
    {n:"6",t:"Accounts",   d:"Ledger auto-updated\n(double-entry)"},
  ];
  steps.forEach((st,i)=>{
    const x=0.35+i*2.17;
    rect(s,x,2.12,2.0,1.55,i===3?C.gold:C.indigo,i===3?C.gold:C.indigo);
    txt(s,st.n,   x,2.15,2.0,0.4, 22,true, C.white,"center");
    txt(s,st.t,   x,2.56,2.0,0.32,11,true, C.white,"center");
    txt(s,st.d,   x+0.05,2.88,1.9,0.72,8.5,false,C.white,"center");
    if(i<5) txt(s,"→",x+1.96,2.55,0.28,0.38,14,true,C.soft,"center");
  });

  // Features grid
  const feats=[
    {e:"🔢",t:"Bill Types",  d:"Maintenance, sinking, repair, parking, one-time, advance deposit"},
    {e:"📅",t:"Billing Cycles",d:"Monthly, quarterly, half-yearly, yearly, one-time"},
    {e:"⚠️",t:"Auto Late Fees",d:"Applied automatically after due date — configurable per society"},
    {e:"🇮🇳",t:"GST Ready",  d:"18% GST auto-applied on bills exceeding ₹7,500 threshold"},
    {e:"📊",t:"Live Dashboard",d:"Total generated, collected, pending & collection % at a glance"},
    {e:"✏️",t:"Edit / Delete", d:"Modify amount or due date of any unpaid bill before locking"},
    {e:"💳",t:"4 Payment Modes",d:"UPI · Cash · NEFT / RTGS · Cheque — all accepted"},
    {e:"📤",t:"CSV Export",  d:"Download full billing data for CA, auditor or archival"},
  ];
  const cW=3.0, cH=1.0;
  feats.forEach((f,i)=>{
    const col=i%4, row=Math.floor(i/4);
    const x=0.35+col*(cW+0.18), y=3.85+row*(cH+0.1);
    shad(s,x,y,cW,cH,C.lgray,C.mgray);
    txt(s,f.e+"  "+f.t, x+0.1,y+0.07,cW-0.2,0.3, 10,true,C.navy,"left");
    txt(s,f.d,           x+0.1,y+0.38,cW-0.2,0.55, 8.8,false,C.gray,"left");
  });
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 5 — EXPENSES, BUDGETS, FUND ACCOUNTS
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  chrome(s,"Finance · 2 of 4","Expenses, Budgets & Fund Accounts",
    "Track every rupee spent — with proof, categories, and fund-level control.");

  // Expenses column
  modHead(s,"💸","Expense Management  ·  Budget Planning  ·  Fund Accounts",C.teal);

  const expCats=[
    "Maintenance & Repairs","Civil / Plumbing / Electrical",
    "Staff Salaries & Payroll","PF / ESIC / Contractor Payments",
    "Utilities — Electricity, Water, Diesel","Lift / Generator / CCTV Maintenance",
    "Gym / Clubhouse / Pool Upkeep","Events & Festivals",
    "Legal & Audit Fees","Admin & Printing Expenses",
  ];
  txt(s,"📌  Expense Categories (40+ sub-types)", 0.4,2.1,6.1,0.32, 10,true,C.navy,"left");
  expCats.forEach((c,i)=>{
    const col=i%2, row=Math.floor(i/2);
    txt(s,"▸  "+c, 0.4+col*3.1, 2.52+row*0.44, 2.95,0.36, 9.5,false,C.slate,"left");
  });

  // Expense features
  const ef=[
    {e:"📎",t:"Bill Proof Upload",d:"Attach photo/scan of invoice — admin verifies digitally"},
    {e:"🏭",t:"Vendor Linking",   d:"Link each expense to a registered vendor/contractor"},
    {e:"💰",t:"TDS Tracking",     d:"Track TDS %, amount deducted & net payable per vendor"},
    {e:"🗂️",t:"Fund Debit Link",  d:"Expenses can debit directly from sinking/reserve fund"},
  ];
  ef.forEach((f,i)=>{
    shad(s,0.4+i%2*3.1, 4.74+Math.floor(i/2)*0.72, 3.0,0.65, C.lgray,C.mgray);
    txt(s,f.e+"  "+f.t, 0.52+i%2*3.1, 4.78+Math.floor(i/2)*0.72, 2.8,0.26, 9.5,true,C.navy,"left");
    txt(s,f.d,           0.52+i%2*3.1, 5.02+Math.floor(i/2)*0.72, 2.8,0.36, 8.5,false,C.gray,"left");
  });

  // Vertical divider
  line(s, 6.55, 1.65, 0, C.mgray);
  s.addShape(prs.ShapeType.line,{x:6.55,y:1.65,w:0,h:5.3,line:{color:C.mgray,width:1}});

  // Budgets
  txt(s,"📊  Budget Planning", 6.7,2.1,6.1,0.32, 10,true,C.navy,"left");
  const budg=[
    "Set category-wise planned budget for each fiscal year (Apr–Mar)",
    "System auto-pulls actual spend from expenses & fund debits",
    "Variance tracking: see exactly where you are over/under budget",
    "Visual bar chart — planned vs actual side by side",
    "Indian fiscal year format (2025-26, 2026-27) built-in",
  ];
  budg.forEach((b,i)=>{
    shad(s,6.7,2.52+i*0.52,6.1,0.45,C.lgray,C.mgray);
    txt(s,"✔  "+b, 6.82,2.56+i*0.52, 5.86,0.35, 9.5,false,C.slate,"left");
  });

  // Fund accounts
  txt(s,"🏦  Fund Accounts", 6.7,5.2,6.1,0.32, 10,true,C.navy,"left");
  const funds=[
    "Types: Sinking Fund · Corpus Fund · Reserve Fund",
    "Credit (deposit) and debit (spend) with full transaction log",
    "Debit auto-creates linked expense entry — no double entry",
    "Balance shown per fund with running history",
  ];
  funds.forEach((f,i)=>{
    txt(s,"▸  "+f, 6.7,5.58+i*0.38, 6.1,0.32, 9.5,false,C.slate,"left");
  });
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 6 — RENT, SALARIES & DOUBLE-ENTRY ACCOUNTING
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  chrome(s,"Finance · 3 of 4","Rent, Staff Salaries & Double-Entry Accounting",
    "Complete financial control — from rent invoices to journal vouchers.");
  modHead(s,"💼","Tenant Rent  ·  Staff Payroll  ·  Accounting Ledger",C.orange);

  // Rent
  txt(s,"🏠  Tenant Rent Invoices",0.4,2.12,6.1,0.3,10,true,C.navy,"left");
  const rent=[
    "Generate monthly rent invoices for each tenant flat separately",
    "Track lease period, monthly rent amount & billing responsibility",
    "Billing responsibility: owner pays / tenant pays / split mode",
    "Tenant can view & pay rent directly in their app login",
    "Owner sees all rent receipts without accessing tenant data",
    "Lease expiry alerts — renew or mark tenant as terminated",
  ];
  rent.forEach((r,i)=>{
    shad(s,0.4,2.5+i*0.52,5.95,0.45,C.lgray,C.mgray);
    txt(s,"▸  "+r,0.55,2.54+i*0.52,5.65,0.35,9.5,false,C.slate,"left");
  });

  s.addShape(prs.ShapeType.line,{x:6.55,y:2.1,w:0,h:4.8,line:{color:C.mgray,width:1}});

  // Salaries
  txt(s,"👷  Staff Payroll",6.7,2.12,6.1,0.3,10,true,C.navy,"left");
  const sal=[
    "Monthly salary entry: basic pay, overtime, deductions, bonus",
    "Roles: Security · Housekeeping · Manager · Electrician · Plumber",
    "Net pay auto-calculated after deductions and additions",
    "Mark as paid — auto-creates expense entry for that month",
    "Payment modes: Cash · NEFT · Cheque · UPI",
    "Month-wise salary history for every staff member",
  ];
  sal.forEach((r,i)=>{
    shad(s,6.7,2.5+i*0.52,5.95,0.45,C.lgray,C.mgray);
    txt(s,"▸  "+r,6.85,2.54+i*0.52,5.65,0.35,9.5,false,C.slate,"left");
  });

  // Accounting strip
  rect(s,0.4,5.72,12.53,0.36,C.indigo,C.indigo);
  txt(s,"📒  Double-Entry Accounting: Ledger Accounts · Journal Vouchers (Draft/Posted/Void) · Trial Balance · P&L Report",
      0.4,5.72,12.53,0.36,9.5,false,C.white,"center");
  const acc=[
    {e:"📘",t:"Chart of Accounts",d:"ASSET, LIABILITY, INCOME, EXPENSE, EQUITY tree structure"},
    {e:"📋",t:"Journal Vouchers",  d:"DRAFT → POSTED → VOID workflow with full audit trail"},
    {e:"⚖️",t:"Trial Balance",    d:"Instant trial balance matching income vs expense for CA"},
    {e:"📉",t:"Ledger Entries",   d:"Every payment, expense & bill auto-generates a ledger entry"},
  ];
  acc.forEach((a,i)=>{
    shad(s,0.4+i*3.27,6.15,3.1,0.78,C.lilac,C.soft);
    txt(s,a.e+"  "+a.t,0.52+i*3.27,6.19,2.9,0.28,9.5,true,C.navy,"left");
    txt(s,a.d,           0.52+i*3.27,6.48,2.9,0.4, 8.5,false,C.gray,"left");
  });
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 7 — REPORTS
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  chrome(s,"Finance · 4 of 4","Financial Reports — One Click to Board-Ready Data",
    "Every report your CA, auditor, or AGM will ever ask for — generated instantly.");
  modHead(s,"📊","Reports Dashboard",C.teal);

  const reports=[
    {
      icon:"📅", title:"Monthly Collection Report",
      pts:[
        "Total flats: active, vacant, new move-ins",
        "Bills generated vs collected vs pending",
        "Collection rate % for the month",
        "Payment method breakdown: Cash · UPI · NEFT · Cheque",
        "List of defaulter flats with owner name & contact",
        "CSV export for follow-up calls",
      ],
    },
    {
      icon:"📆", title:"Annual Report (12-Month View)",
      pts:[
        "Month-by-month billing, collection & pending data",
        "Year-on-year collection rate trend",
        "Total generated, total collected, total pending",
        "Bar chart with monthly trends",
        "Annual totals summary row",
        "Export full year to Excel",
      ],
    },
    {
      icon:"💹", title:"Financial Report (P&L)",
      pts:[
        "Income: Maintenance + Marketplace + Other",
        "Expenses by category with breakdowns",
        "Profit or Loss for the period",
        "Fund account balances snapshot",
        "Budget vs actual variance table",
        "Charts: Donut (expense split), Line (trend)",
      ],
    },
  ];

  reports.forEach((r,i)=>{
    const x=0.35+i*4.35;
    rect(s,x,2.12,4.1,0.4,r.icon===" 📅"?C.teal:r.icon==="📆"?C.indigo:C.gold,
         r.icon==="📅"?C.teal:r.icon==="📆"?C.indigo:C.gold);
    shad(s,x,2.12,4.1,0.4,r.icon==="📅"?C.teal:r.icon==="📆"?C.indigo:C.gold,
         r.icon==="📅"?C.teal:r.icon==="📆"?C.indigo:C.gold);
    // card
    shad(s,x,2.12,4.1,4.65,C.lgray,C.mgray);
    rect(s,x,2.12,4.1,0.42,i===0?C.teal:i===1?C.indigo:C.gold,
         i===0?C.teal:i===1?C.indigo:C.gold);
    txt(s,r.icon+"  "+r.title,x+0.1,2.12,3.9,0.42,10,true,C.white,"left");
    r.pts.forEach((p,j)=>{
      txt(s,"▸  "+p,x+0.12,2.64+j*0.52,3.86,0.45,9.2,false,C.slate,"left");
    });
  });

  // Bottom bar
  rect(s,0.4,6.92,12.53,0.38,C.lgray,C.mgray);
  txt(s,"📤  All reports export to CSV / Excel  ·  Bar charts, Donut charts & Line trend charts built-in  ·  No external tools needed",
      0.5,6.92,12.33,0.38,9.5,false,C.navy,"center");
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 8 — VISITOR MANAGEMENT
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  chrome(s,"Security · 1 of 3","Digital Visitor Gate Management",
    "Replace the paper register — every visitor logged, verified & tracked in real time.");
  modHead(s,"🚪","Visitor Entry & Exit System",C.teal);

  // How it works flow
  const vsteps=[
    {n:"1",e:"📲",t:"Pre-Approve",  d:"Resident pre-approves visitor in app before arrival"},
    {n:"2",e:"🔢",t:"OTP/Passcode", d:"Visitor shows passcode or QR at gate — guard verifies"},
    {n:"3",e:"📸",t:"Log Entry",    d:"Guard logs name, phone, purpose, vehicle & photo"},
    {n:"4",e:"✅",t:"Notify Resident",d:"Resident gets push notification — can approve/reject"},
    {n:"5",e:"⏰",t:"Exit Logged",  d:"Exit time auto-stamped — full visit duration saved"},
  ];
  vsteps.forEach((st,i)=>{
    const x=0.35+i*2.57;
    shad(s,x,2.12,2.4,1.58,C.lilac,C.soft);
    rect(s,x,2.12,2.4,0.38,C.teal,C.teal);
    txt(s,st.n+"  "+st.e,x,2.12,2.4,0.38,12,true,C.white,"center");
    txt(s,st.t,  x+0.1,2.58,2.2,0.3,10,true,C.navy,"center");
    txt(s,st.d,  x+0.08,2.92,2.24,0.72,9,false,C.gray,"center");
    if(i<4) txt(s,"→",x+2.36,2.65,0.25,0.3,14,true,C.teal,"center");
  });

  // Visitor types & extra features
  colHead(s,"Visitor Types Supported","Advanced Gate Features",3.88);
  const vt=[
    "🛵  Delivery boy (Swiggy, Zomato, Amazon etc.)",
    "👤  Guest / Relative visit",
    "🔧  Service technician / plumber / electrician",
    "🚕  Cab / auto (OLA, Uber, Rapido)",
    "🏢  Contractor / vendor visit",
    "❓  Walk-in / other",
  ];
  vt.forEach((v,i)=>{
    txt(s,v, 0.5, 4.3+i*0.46, 5.8,0.38, 9.5,false,C.slate,"left");
  });
  const gf=[
    {e:"🚫",t:"Blacklist",     d:"Block known threats — auto-rejected at gate"},
    {e:"📦",t:"Package Log",   d:"Parcel in/out tracking per flat — guard logs courier name"},
    {e:"🗂️",t:"Visitor History",d:"Full searchable visitor log by flat, name or date"},
    {e:"📋",t:"Gate Incidents", d:"Guards log security incidents with description & evidence"},
    {e:"🕐",t:"Expected Visitor",d:"Schedule arrival time — guard sees 'expected list' in advance"},
    {e:"📊",t:"Gate Stats",    d:"Live count: visitors in, expected, pending approval, packages"},
  ];
  gf.forEach((f,i)=>{
    const col=i%2, row=Math.floor(i/2);
    shad(s,6.75+col*3.0,4.3+row*0.72,2.85,0.62,C.lgray,C.mgray);
    txt(s,f.e+"  "+f.t, 6.88+col*3.0,4.33+row*0.72,2.6,0.24,9.5,true,C.navy,"left");
    txt(s,f.d,           6.88+col*3.0,4.56+row*0.72,2.6,0.3, 8.5,false,C.gray,"left");
  });
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 9 — GUARD SYSTEM & PATROL
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  chrome(s,"Security · 2 of 3","Guard Management & Patrol System",
    "Dedicated guard app — separate login, separate data, complete accountability.");
  modHead(s,"👮","Guard Gate App  ·  Patrol Logs  ·  Incident Reports","0D9488");

  colHead(s,"Guard App Features","Guard Patrol System",2.1);

  const guardFeats=[
    {e:"🔑",t:"Separate Guard Login",  d:"Guards have their own app login — they never see resident financial data"},
    {e:"🏠",t:"Flat Directory View",   d:"Guard can lookup flat → current occupant name & phone for verification"},
    {e:"🚦",t:"Live Gate Dashboard",   d:"Visitors inside, expected arrivals, pending approvals & pending packages"},
    {e:"📦",t:"Package Management",    d:"Log incoming parcels with courier name & flat number — resident notified"},
    {e:"👷",t:"Staff Check-in/out",    d:"Daily staff (maid, cook, driver) entry & exit logged by guard separately"},
    {e:"🚫",t:"Reject Visitor",        d:"Guard can reject entry — logs the reason for incident tracking"},
  ];
  guardFeats.forEach((f,i)=>{
    shad(s,0.4,2.58+i*0.73,6.1,0.62,C.lgray,C.mgray);
    txt(s,f.e+"  "+f.t,0.55,2.62+i*0.73,5.8,0.26,9.5,true,C.navy,"left");
    txt(s,f.d,          0.55,2.88+i*0.73,5.8,0.3, 8.5,false,C.gray,"left");
  });

  const patrol=[
    {e:"📍",t:"Checkpoint Marking",   d:"Guard marks each physical checkpoint on patrol round — timestamped"},
    {e:"🗺️",t:"Patrol Routes",       d:"Define custom patrol routes with multiple checkpoints per round"},
    {e:"🕒",t:"Round Timing",         d:"System records start time, end time & total duration of each patrol"},
    {e:"📝",t:"Incident Reporting",   d:"Guard files incident report with category (theft, damage, suspicious person)"},
    {e:"📈",t:"Patrol History",       d:"Full log of all guard rounds — see gaps, missed rounds & patterns"},
    {e:"🚨",t:"Gate Incidents",       d:"Serious incidents escalated to chairman — timestamp + full description"},
  ];
  patrol.forEach((f,i)=>{
    shad(s,6.7,2.58+i*0.73,6.1,0.62,C.lgray,C.mgray);
    txt(s,f.e+"  "+f.t,6.85,2.62+i*0.73,5.8,0.26,9.5,true,C.navy,"left");
    txt(s,f.d,          6.85,2.88+i*0.73,5.8,0.3, 8.5,false,C.gray,"left");
  });
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 10 — EMERGENCY & SAFETY
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  chrome(s,"Security · 3 of 3","Emergency Response & Safety System",
    "One-tap SOS, built-in helplines, and vendor emergency contacts — always ready.");
  modHead(s,"🆘","Emergency SOS  ·  Contact Book  ·  Safety Features",C.red);

  colHead(s,"Emergency SOS System","Emergency Contact Book",2.1);

  const sos=[
    {e:"🔥",t:"Fire Alert",      d:"One tap triggers Fire SOS — alerts all committee members simultaneously"},
    {e:"❤️",t:"Medical Emergency", d:"Medical SOS with built-in 102 (Ambulance) helpline shortcut"},
    {e:"🛡️",t:"Security Alert",  d:"Security SOS sent to guards + chairman instantly on trigger"},
    {e:"⚠️",t:"Other Emergency", d:"Generic SOS for any situation — alerts nearest responders"},
    {e:"📢",t:"Broadcast Alert",  d:"Chairman can send emergency broadcast to all residents in 1 click"},
    {e:"📞",t:"National Helplines",d:"100 (Police) · 101 (Fire) · 102 (Ambulance) · 1091 (Women) · 108 (Disaster)"},
  ];
  sos.forEach((f,i)=>{
    shad(s,0.4,2.58+i*0.73,6.1,0.62,C.lred,"FCA5A5");
    txt(s,f.e+"  "+f.t, 0.55,2.62+i*0.73,5.8,0.26,9.5,true,C.red,"left");
    txt(s,f.d,           0.55,2.88+i*0.73,5.8,0.3, 8.5,false,C.slate,"left");
  });

  const eContacts=[
    {e:"🔧",t:"Plumber",          d:"Save society plumber with phone — available/unavailable toggle"},
    {e:"⚡",t:"Electrician",      d:"Immediate call contact with one tap from any resident"},
    {e:"🚑",t:"Ambulance / Hospital",d:"Society-linked hospital or doctor on speed contact"},
    {e:"🚒",t:"Fire Brigade",     d:"Local fire station number with area address stored"},
    {e:"🏥",t:"Pest Control",     d:"Pest control vendor with contact & service area"},
    {e:"⚖️",t:"Legal Adviser",   d:"Society legal adviser name & phone — stored in settings"},
  ];
  eContacts.forEach((f,i)=>{
    shad(s,6.7,2.58+i*0.73,6.1,0.62,C.lgray,C.mgray);
    txt(s,f.e+"  "+f.t, 6.85,2.62+i*0.73,5.8,0.26,9.5,true,C.navy,"left");
    txt(s,f.d,           6.85,2.88+i*0.73,5.8,0.3, 8.5,false,C.gray,"left");
  });
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 11 — COMPLAINTS & SLA
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  chrome(s,"Resident Services · 1 of 3","Complaints & SLA Management",
    "Residents raise issues in the app — tracked, assigned & closed with accountability.");
  modHead(s,"🔧","Complaint Lifecycle  ·  SLA Enforcement  ·  Satisfaction Rating",C.orange);

  // SLA flow
  const cflow=[
    {n:"1",t:"Raise Complaint",   d:"Category, priority\n(low/medium/high/urgent)\n+ photo/video"},
    {n:"2",t:"SLA Timer Starts",  d:"Plumbing=24h\nElectrical=12h\nGeneral=48h\n(configurable)"},
    {n:"3",t:"Assigned to Staff", d:"Committee assigns\nto vendor / internal\nstaff"},
    {n:"4",t:"Escalation",        d:"Breaches SLA?\nAuto-escalates to\nSecretary→Chairman"},
    {n:"5",t:"Resolved + Proof",  d:"Staff adds resolution\nnotes and proof\nphoto/video"},
    {n:"6",t:"Resident Rates",    d:"1–5 star satisfaction\nrating + comment\nleft by resident"},
  ];
  cflow.forEach((st,i)=>{
    const x=0.35+i*2.17;
    shad(s,x,2.12,2.0,1.72,C.lgray,C.mgray);
    rect(s,x,2.12,2.0,0.4,C.orange,C.orange);
    txt(s,st.n,x,2.12,2.0,0.4,14,true,C.white,"center");
    txt(s,st.t,x+0.05,2.6,1.9,0.32,9.5,true,C.navy,"center");
    txt(s,st.d,x+0.05,2.96,1.9,0.82,8.5,false,C.gray,"center");
    if(i<5) txt(s,"→",x+1.96,2.85,0.24,0.3,13,true,C.orange,"center");
  });

  // Categories & features
  colHead(s,"Complaint Categories & Priorities","Additional Features",4.0);
  const cats=[
    "🔧  Plumbing — pipe leaks, clog, water pump issues",
    "⚡  Electrical — wiring, meter, power supply faults",
    "🧹  Cleanliness — garbage, common area hygiene",
    "🔐  Security — unauthorised entry, guard behaviour",
    "🚗  Parking — illegal parking, damage, disputes",
    "📋  General — lift, garden, signage, others",
  ];
  cats.forEach((c,i)=>txt(s,c,0.45,4.44+i*0.44,5.9,0.36,9.5,false,C.slate,"left"));

  const extras=[
    {e:"📊",t:"Stats Dashboard",d:"Open / In-progress / Resolved / Total count live"},
    {e:"🔍",t:"Filter & Search",d:"Filter by status, category, flat number or date range"},
    {e:"📱",t:"Media Attachments",d:"Resident attaches photo/video when raising complaint"},
    {e:"📤",t:"Share Complaint",d:"Share complaint link — committee members can view details"},
    {e:"🌟",t:"Satisfaction Score",d:"Monthly CSAT score helps committee assess service quality"},
    {e:"⏱️",t:"SLA Config",     d:"Each category has its own SLA hours — chairman configures once"},
  ];
  extras.forEach((f,i)=>{
    const col=i%2, row=Math.floor(i/2);
    shad(s,6.7+col*3.0,4.44+row*0.66,2.88,0.58,C.lgray,C.mgray);
    txt(s,f.e+"  "+f.t,6.82+col*3.0,4.48+row*0.66,2.65,0.24,9.2,true,C.navy,"left");
    txt(s,f.d,          6.82+col*3.0,4.71+row*0.66,2.65,0.26,8.3,false,C.gray,"left");
  });
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 12 — NOTICES, FORUM, POLLS, EVENTS & MEETINGS
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  chrome(s,"Resident Services · 2 of 3","Community Communication & Governance",
    "Notices · Forum · Polls · Events · Meeting Minutes — all in one digital board.");

  const modules=[
    {
      icon:"📢", title:"Notice Board", color:C.indigo,
      items:[
        "Categories: General, Event, Maintenance, Emergency, Meeting",
        "Pin important notices to top — expiry date setting",
        "Read receipt tracking — see who has read each notice",
        "Push notification sent to every resident instantly",
        "Archive old notices — searchable by category & date",
      ],
    },
    {
      icon:"💬", title:"Community Forum", color:C.teal,
      items:[
        "Threaded discussions — residents post & reply",
        "Replace WhatsApp groups with structured forum",
        "Topic-based threads — no message getting lost",
        "Committee can moderate or close any thread",
        "Forum linked to resident login — no anonymous posts",
      ],
    },
    {
      icon:"🗳️", title:"Polls & Voting", color:C.gold,
      items:[
        "Create polls with custom options for any society decision",
        "One vote per flat number — no stuffing",
        "Set poll close date/time — auto-closes at deadline",
        "Live result view — chairman sees count in real time",
        "Use for AGM resolutions, rule changes, event decisions",
      ],
    },
    {
      icon:"📅", title:"Events & Meeting Minutes", color:"7C3AED",
      items:[
        "Create society events — Diwali, sports, clean-up drives",
        "RSVP tracking — see who is coming",
        "Meeting types: AGM · SGM · Committee · General",
        "Record attendees, agenda, minutes & decisions formally",
        "Meeting minutes stored as permanent society record",
      ],
    },
  ];

  modules.forEach((m,i)=>{
    const x=0.35+i*3.27;
    shad(s,x,1.62,3.08,5.3,C.lgray,C.mgray);
    rect(s,x,1.62,3.08,0.45,m.color,m.color);
    txt(s,m.icon+"  "+m.title,x,1.62,3.08,0.45,11,true,C.white,"center");
    m.items.forEach((it,j)=>{
      txt(s,"▸  "+it, x+0.12, 2.15+j*0.58, 2.84,0.5, 9.2,false,C.slate,"left");
    });
  });
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 13 — PARKING MANAGEMENT
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  chrome(s,"Resident Services · 3 of 3","Parking Management System",
    "Complete parking control — zones, slots, assignments, vehicles & peer sharing.");
  modHead(s,"🚗","Parking Zones  ·  Slot Assignment  ·  Vehicle Registry  ·  Sharing Marketplace","7C3AED");

  colHead(s,"Parking Core Features","Vehicle & EV Management",2.1);

  const pkgFeats=[
    {e:"🏗️",t:"Zone Management",   d:"Create parking zones by wing, level or area — e.g. B1/B2/Open"},
    {e:"🟩",t:"Slot Types",        d:"CAR · BIKE · EV · VISITOR · STAFF — each slot has its own type"},
    {e:"👤",t:"Slot Assignment",   d:"Assign slot to flat/occupancy — owner, tenant, temporary or visitor"},
    {e:"🗓️",t:"Assignment History",d:"Full history of who had which slot — with date ranges"},
    {e:"🔄",t:"Reassignment",      d:"Easily reassign when a tenant moves out — no gaps or disputes"},
    {e:"📊",t:"Occupancy View",    d:"Color-coded grid: see assigned, vacant & blocked slots at a glance"},
  ];
  pkgFeats.forEach((f,i)=>{
    shad(s,0.4,2.58+i*0.72,6.1,0.62,C.lgray,C.mgray);
    txt(s,f.e+"  "+f.t,0.55,2.62+i*0.72,5.8,0.26,9.5,true,C.navy,"left");
    txt(s,f.d,          0.55,2.88+i*0.72,5.8,0.3, 8.5,false,C.gray,"left");
  });

  const vehicle=[
    {e:"🚘",t:"Vehicle Registry",   d:"Register car/bike with number, sticker ID per flat"},
    {e:"⚡",t:"EV Charging Slot",    d:"Dedicated EV slot type with charging status tracking"},
    {e:"🔁",t:"Parking Sharing",    d:"Owner with empty slot can share/rent to another resident"},
    {e:"📬",t:"Parking Request",    d:"Resident raises a parking request — admin approves & assigns"},
    {e:"💰",t:"Paid Parking",       d:"Marketplace: set price for slot sharing between residents"},
    {e:"🚫",t:"Blocked Slots",      d:"Mark slots as BLOCKED or MAINTENANCE — prevents assignment"},
  ];
  vehicle.forEach((f,i)=>{
    shad(s,6.7,2.58+i*0.72,6.1,0.62,C.lgray,C.mgray);
    txt(s,f.e+"  "+f.t,6.85,2.62+i*0.72,5.8,0.26,9.5,true,C.navy,"left");
    txt(s,f.d,          6.85,2.88+i*0.72,5.8,0.3, 8.5,false,C.gray,"left");
  });
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 14 — AMENITIES & FACILITY BOOKING
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  chrome(s,"Amenities","Amenity & Facility Booking System",
    "Book gym, hall, pool or any facility online — no calls, no conflicts, no overlap.");
  modHead(s,"🏊","Facility Booking  ·  Policies  ·  Waitlist  ·  Penalties",C.teal);

  colHead(s,"Facilities & Booking Features","Booking Policies & Controls",2.1);

  const af=[
    {e:"🏋️",t:"Gym",              d:"Book gym slot by hour — max capacity enforced per slot"},
    {e:"🏊",t:"Swimming Pool",     d:"Lane or full pool booking with time slots & cooling period"},
    {e:"🎉",t:"Party / Banquet Hall",d:"Event hall booking with purpose & guest count limit"},
    {e:"🏸",t:"Sports Courts",     d:"Badminton, tennis, basketball — per-hour booking"},
    {e:"🌳",t:"Garden / Terrace",  d:"Open area booking for events, photoshoots or BBQ"},
    {e:"📋",t:"Meeting Room",      d:"Committee or corporate meeting room with time blocks"},
  ];
  af.forEach((f,i)=>{
    shad(s,0.4,2.58+i*0.72,6.1,0.62,C.lgray,C.mgray);
    txt(s,f.e+"  "+f.t,0.55,2.62+i*0.72,5.8,0.26,9.5,true,C.navy,"left");
    txt(s,f.d,          0.55,2.88+i*0.72,5.8,0.3, 8.5,false,C.gray,"left");
  });

  const bp=[
    {e:"⏱️",t:"Max Hours / Day",     d:"Limit how many hours one flat can book per day per facility"},
    {e:"🔄",t:"Cooldown Period",      d:"Force gap between bookings — prevent back-to-back monopoly"},
    {e:"👥",t:"Guest Limit",          d:"Set max number of guests allowed per booking"},
    {e:"🛑",t:"Cancellation Cutoff",  d:"Booking can only be cancelled N hours before start"},
    {e:"✅",t:"Approval Required",    d:"Admin approves booking before it is confirmed (optional)"},
    {e:"⚠️",t:"Usage Penalties",      d:"Log damage or misuse — generate penalty invoice automatically"},
  ];
  bp.forEach((f,i)=>{
    shad(s,6.7,2.58+i*0.72,6.1,0.62,C.lgray,C.mgray);
    txt(s,f.e+"  "+f.t,6.85,2.62+i*0.72,5.8,0.26,9.5,true,C.navy,"left");
    txt(s,f.d,          6.85,2.88+i*0.72,5.8,0.3, 8.5,false,C.gray,"left");
  });

  // Bottom strip
  rect(s,0.4,6.9,12.53,0.38,C.lgray,C.mgray);
  txt(s,"📋  Waitlist system for fully booked slots  ·  Blackout / Maintenance schedules  ·  No-show & damage logging",
      0.5,6.9,12.33,0.38,9.5,false,C.navy,"center");
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 15 — MEMBERS, TENANTS & DOMESTIC STAFF
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  chrome(s,"People Management","Members, Tenants & Domestic Staff",
    "Complete registry for owners, tenants, and every domestic worker in your society.");

  const panels=[
    {
      icon:"👤", title:"Member / Resident Registry", color:C.indigo,
      items:[
        "Flat-wise owner & family member records",
        "Wing filter, occupancy status, flat type (1BHK–4BHK)",
        "Owner contact: name, phone, email, alternate phone",
        "Search by flat number or owner name instantly",
        "Bulk CSV import for initial onboarding",
        "Export full member list with contact details",
        "Paginated list — handles 500+ flats with ease",
      ],
    },
    {
      icon:"🏠", title:"Tenant Management", color:"7C3AED",
      items:[
        "Add tenant: name, phone, email, lease start/end, rent",
        "Lease status: Pending → Active → Expired → Terminated",
        "Billing responsibility: Owner / Tenant / Split mode",
        "App login created for tenant — own portal to pay rent",
        "Society join code shared with tenant for onboarding",
        "Owner notified on lease expiry for renewal action",
        "Move-in / move-out checklists linked to tenancy",
      ],
    },
    {
      icon:"🧹", title:"Domestic Staff (per Flat)", color:C.teal,
      items:[
        "Categories: Maid · Cook · Driver · Nanny · Gardener · Watchman",
        "Link staff to one or more flats with agreed monthly pay",
        "Entry code for staff gate check-in via guard app",
        "Daily attendance marked by guard on arrival/departure",
        "Active / inactive toggle per staff member",
        "Staff contact details available to linked flat owners",
        "Salary payments tracked via resident staff payment module",
      ],
    },
  ];

  panels.forEach((p,i)=>{
    const x=0.35+i*4.35;
    shad(s,x,1.62,4.1,5.42,C.lgray,C.mgray);
    rect(s,x,1.62,4.1,0.45,p.color,p.color);
    txt(s,p.icon+"  "+p.title,x,1.62,4.1,0.45,11,true,C.white,"center");
    p.items.forEach((it,j)=>{
      txt(s,"▸  "+it,x+0.12,2.15+j*0.54,3.86,0.47,9.2,false,C.slate,"left");
    });
  });
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 16 — ASSETS, VENDORS, DOCUMENTS & MOVE EVENTS
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  chrome(s,"Operations","Asset Register · Vendor Directory · Documents · Move Events",
    "Track physical assets, approved vendors, society documents, and move-in/out events.");

  // Assets
  txt(s,"🏗️  Asset Register",0.4,1.65,6.1,0.3,10,true,C.navy,"left");
  const assets=[
    "Asset types: Generator · Elevator · Pump · Gym Equip · CCTV · Furniture",
    "Purchase date, purchase amount & current (depreciated) value",
    "Warranty end date alert — never miss a claim window",
    "Maintenance schedule in days — auto-flags overdue assets",
    "Condition tracking: Excellent → Good → Fair → Poor → Out of Order",
    "Total asset value shown on dashboard for insurance reference",
  ];
  assets.forEach((a,i)=>{
    shad(s,0.4,2.0+i*0.52,5.95,0.45,C.lgray,C.mgray);
    txt(s,"▸  "+a,0.55,2.04+i*0.52,5.65,0.35,9.2,false,C.slate,"left");
  });

  s.addShape(prs.ShapeType.line,{x:6.55,y:1.62,w:0,h:5.6,line:{color:C.mgray,width:1}});

  // Vendors
  txt(s,"🔧  Vendor Directory",6.7,1.65,6.1,0.3,10,true,C.navy,"left");
  const vendors=[
    "Categories: Plumbing · Electrical · Civil · Housekeeping · Security · IT",
    "Phone, email and service area for each vendor",
    "AMC (Annual Maintenance Contract) tracking per vendor",
    "AMC start/end date + monthly/annual AMC amount",
    "Vendor linked to complaints — assign directly when logging",
    "Vendor linked to expenses — auto-fills vendor name on payment",
  ];
  vendors.forEach((v,i)=>{
    shad(s,6.7,2.0+i*0.52,5.95,0.45,C.lgray,C.mgray);
    txt(s,"▸  "+v,6.85,2.04+i*0.52,5.65,0.35,9.2,false,C.slate,"left");
  });

  // Documents & Move Events bottom strip
  rect(s,0.4,5.14,12.53,0.38,C.indigo,C.indigo);
  txt(s,"📂  Documents Store  ·  🚛  Move-In / Move-Out Events",
      0.4,5.14,12.53,0.38,10,true,C.white,"center");

  const bottom=[
    {e:"📄",t:"Document Categories",  d:"Bylaws, Society Rules, NOC letters, Meeting Minutes, Financial statements, General"},
    {e:"🔒",t:"Secure Storage",        d:"Files uploaded with name, size & uploader — always accessible to committee"},
    {e:"📤",t:"Document Sharing",      d:"Share bylaws or NOC with specific residents — one link, no email chains"},
    {e:"🚛",t:"Move-In Checklist",     d:"Digital checklist for move-in: key handover, parking, meter reading, deposit"},
    {e:"📦",t:"Move-Out Checklist",    d:"Move-out checklist: NOC, pending dues, flat condition, key return"},
    {e:"📊",t:"Move Event Status",     d:"Pending or Completed — chairman tracks all move events for the month"},
  ];
  bottom.forEach((b,i)=>{
    const col=i%3, row=Math.floor(i/3);
    shad(s,0.4+col*4.22,5.62+row*0.74,4.1,0.65,C.lgray,C.mgray);
    txt(s,b.e+"  "+b.t,0.52+col*4.22,5.66+row*0.74,3.85,0.24,9.2,true,C.navy,"left");
    txt(s,b.d,          0.52+col*4.22,5.89+row*0.74,3.85,0.3, 8.3,false,C.gray,"left");
  });
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 17 — WHATSAPP REMINDERS & PUSH NOTIFICATIONS
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  chrome(s,"Communication","WhatsApp Reminders & Push Notifications",
    "Residents who don't open the app still get payment reminders — on WhatsApp.");
  modHead(s,"📲","WhatsApp Reminder Engine  ·  Push Notifications  ·  Resident Marketplace",C.gold);

  colHead(s,"WhatsApp Payment Reminders","Push Notification System",2.1);

  const wa=[
    {e:"💬",t:"Defaulter Reminders",  d:"Send payment reminder to specific flat or all pending flats in one click"},
    {e:"📝",t:"Custom Templates",      d:"English + Marathi templates built-in — edit before sending"},
    {e:"🔢",t:"Template Variables",    d:"Auto-fills flat number, owner name, amount due & due date in message"},
    {e:"📲",t:"Direct WhatsApp Link",  d:"Resident taps link → WhatsApp opens with pre-filled message to pay"},
    {e:"🌐",t:"API Integration",       d:"WhatsApp Business API (optional) for bulk automated sending"},
    {e:"🗓️",t:"Last Reminder Date",   d:"System tracks last reminder sent per flat — avoids duplicate spam"},
  ];
  wa.forEach((f,i)=>{
    shad(s,0.4,2.58+i*0.72,6.1,0.62,C.lgray,C.mgray);
    txt(s,f.e+"  "+f.t,0.55,2.62+i*0.72,5.8,0.26,9.5,true,C.navy,"left");
    txt(s,f.d,          0.55,2.88+i*0.72,5.8,0.3, 8.5,false,C.gray,"left");
  });

  const push=[
    {e:"🔔",t:"Bill Due Alert",        d:"Sent when maintenance bill is generated for that flat"},
    {e:"✅",t:"Payment Confirmed",     d:"Resident gets confirmation push when payment is marked"},
    {e:"🔧",t:"Complaint Update",      d:"Push on status change: In Progress / Resolved"},
    {e:"📢",t:"New Notice",            d:"Instant push to all residents when committee posts a notice"},
    {e:"🗳️",t:"New Poll",             d:"All residents notified when a new poll is created"},
    {e:"🚪",t:"Visitor at Gate",       d:"Resident gets push when guard logs a visitor for their flat"},
  ];
  push.forEach((f,i)=>{
    shad(s,6.7,2.58+i*0.72,6.1,0.62,C.lgray,C.mgray);
    txt(s,f.e+"  "+f.t,6.85,2.62+i*0.72,5.8,0.26,9.5,true,C.navy,"left");
    txt(s,f.d,          6.85,2.88+i*0.72,5.8,0.3, 8.5,false,C.gray,"left");
  });

  // Marketplace strip
  rect(s,0.4,6.9,12.53,0.38,C.lgold,C.amber);
  txt(s,"🛒  Resident Marketplace: Buy/sell furniture, electronics, appliances within society — with moderation & interest tracking",
      0.5,6.9,12.33,0.38,9.2,false,C.navy,"center");
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 18 — MOBILE APP & OFFLINE
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  bg(s, C.navy);
  rect(s,0,0,"100%",0.08,C.gold,C.gold);
  rect(s,0,7.1,"100%",0.4,C.indigo,C.indigo);
  rect(s,0.5,0.15,2.2,0.28,C.soft,C.soft);
  txt(s,"MOBILE APP",0.5,0.15,2.2,0.28,7.5,true,C.white,"center");
  txt(s,"Web + Android + iOS App",0.5,0.55,10,0.65,26,true,C.white,"left");
  txt(s,"One subscription — full web app AND a native Android/iOS app. No extra cost.",
      0.5,1.28,10,0.4,12,false,"A5B4FC","left");
  line(s,0.5,1.75,12.3,C.soft);

  colHead(s,"App Features by User Role","Offline-First Technology",2.0);

  const appFeats=[
    {e:"👤",t:"Resident App",    d:"Pay bills, raise complaints, book amenities, view notices, forum & polls"},
    {e:"🏛️",t:"Chairman / Admin",d:"Full dashboard: billing, expenses, reports, settings, credentials"},
    {e:"💰",t:"Treasurer View",  d:"Payments, receipts, fund accounts, salary, expense management"},
    {e:"👮",t:"Guard App",       d:"Separate secure login — visitor log, packages, staff check-in only"},
    {e:"🏠",t:"Tenant Portal",   d:"View & pay rent, raise complaints, see notices — scoped access"},
    {e:"📲",t:"Owner Portal",    d:"View rent invoices, occupant details, billing — even from NRI"},
  ];
  appFeats.forEach((f,i)=>{
    shad(s,0.4,2.5+i*0.72,6.1,0.62,"0D2F52","1C4F7E");
    txt(s,f.e+"  "+f.t,0.55,2.54+i*0.72,5.8,0.26,9.5,true,C.teal,"left");
    txt(s,f.d,          0.55,2.8+i*0.72, 5.8,0.3, 8.5,false,"A5B4FC","left");
  });

  const offline=[
    {e:"📴",t:"Works Offline",        d:"App caches data locally — guards in basements can still log entries"},
    {e:"📥",t:"Request Queue",         d:"Actions taken offline are queued — auto-sync when internet returns"},
    {e:"🔁",t:"Exponential Backoff",  d:"Failed requests retry automatically with smart backoff — no data loss"},
    {e:"🔔",t:"Sync on Reconnect",    d:"All queued actions flush immediately when connectivity is restored"},
    {e:"📊",t:"Offline Diagnostics",  d:"Mobile diagnostics log errors for debugging without affecting users"},
    {e:"⚡",t:"Capacitor 6 Engine",  d:"Built on Capacitor v6 — wraps Next.js web app as native mobile app"},
  ];
  offline.forEach((f,i)=>{
    shad(s,6.7,2.5+i*0.72,6.1,0.62,"0D2F52","1C4F7E");
    txt(s,f.e+"  "+f.t,6.85,2.54+i*0.72,5.8,0.26,9.5,true,C.gold,"left");
    txt(s,f.d,          6.85,2.8+i*0.72, 5.8,0.3, 8.5,false,"A5B4FC","left");
  });

  txt(s,"SmartSocietyHub  ·  Your Society in Your Pocket",0,7.1,"100%",0.4,8.5,false,C.soft,"center");
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 19 — ADMIN TOOLS: CREDENTIALS, AUDIT LOG, SETTINGS
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  chrome(s,"Admin Tools","Credentials · Activity Log · Sessions · Society Settings",
    "Full administrative control — user management, audit trails & security settings.");

  const panels=[
    {
      icon:"🔑", title:"Credential Management", color:C.indigo,
      items:[
        "View all accounts: Admins, Members, Tenants, Guards",
        "Generate app logins for all flat owners in bulk",
        "Assign roles: Chairman · Secretary · Treasurer · Member · Guard",
        "Display society join code — residents join using this code",
        "CSV export of all credentials for distribution",
        "Password visibility toggle for shared setup sessions",
      ],
    },
    {
      icon:"📋", title:"Activity Audit Log", color:C.teal,
      items:[
        "Every action logged: created · updated · deleted · paid",
        "Modules tracked: bill, expense, complaint, parking, flat",
        "Actor name + timestamp + IP address recorded",
        "Who changed what, when — full accountability",
        "Searchable by module, action type or date range",
        "Tamper-proof log — nobody can delete audit history",
      ],
    },
    {
      icon:"⚙️", title:"Society Settings & Sessions", color:C.gold,
      items:[
        "Society name, logo, address, UPI ID, bank details",
        "Maintenance amount, due day & late fee configuration",
        "SLA hours per complaint category (plumbing=24h etc.)",
        "Emergency phone & legal adviser details",
        "Subscription plan tier & recharge history tracking",
        "View active login sessions — revoke from any device",
      ],
    },
  ];

  panels.forEach((p,i)=>{
    const x=0.35+i*4.35;
    shad(s,x,1.62,4.1,5.42,C.lgray,C.mgray);
    rect(s,x,1.62,4.1,0.45,p.color,p.color);
    txt(s,p.icon+"  "+p.title,x,1.62,4.1,0.45,11,true,C.white,"center");
    p.items.forEach((it,j)=>{
      txt(s,"▸  "+it,x+0.12,2.15+j*0.54,3.86,0.47,9.2,false,C.slate,"left");
    });
  });
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 20 — TRUST, DATA SECURITY & MULTI-TENANCY
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  chrome(s,"Security & Trust","Enterprise-Grade Security — Built for Indian Societies",
    "Your society data is 100% isolated, encrypted, and audit-trailed at all times.");
  modHead(s,"🔒","Data Security  ·  Role-Based Access  ·  Multi-Society Isolation",C.indigo);

  const sec=[
    {e:"🔐",t:"JWT Session Encryption",     d:"All logins secured with encrypted JWT tokens — sessions auto-expire"},
    {e:"👤",t:"6-Level Role-Based Access",  d:"Chairman · Secretary · Treasurer · Member · Tenant · Guard — each scoped"},
    {e:"🏢",t:"Multi-Society Data Isolation",d:"Society A cannot see Society B data — complete tenant isolation"},
    {e:"📜",t:"Full Audit Trail",            d:"Every action logged with user, timestamp, module and IP address"},
    {e:"⚡",t:"Rate Limiting on Auth",       d:"Brute-force protection — login attempts rate-limited at server level"},
    {e:"🛡️",t:"HTTP Security Headers",      d:"Industry-standard security headers on every page and API endpoint"},
    {e:"🗄️",t:"PostgreSQL + Prisma ORM",    d:"Enterprise-grade relational database with type-safe query layer"},
    {e:"🔄",t:"Multi-Device Session Control",d:"View all active sessions — revoke any suspicious device instantly"},
  ];

  sec.forEach((f,i)=>{
    const col=i%2, row=Math.floor(i/4)*2+Math.floor((i%4)/2);
    // 2 columns of 4 rows each
    const c=i%2, r=Math.floor(i/2);
    shad(s,0.4+c*6.3,2.12+r*0.88,6.1,0.78,C.lilac,C.soft);
    txt(s,f.e+"  "+f.t,0.55+c*6.3,2.16+r*0.88,5.8,0.3,10,true,C.navy,"left");
    txt(s,f.d,          0.55+c*6.3,2.46+r*0.88,5.8,0.36,9,false,C.gray,"left");
  });
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 21 — HOW TO GET STARTED (3-STEP ONBOARDING)
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  bg(s, C.navy);
  rect(s,0,0,"100%",0.08,C.gold,C.gold);
  rect(s,0,7.1,"100%",0.4,C.indigo,C.indigo);
  txt(s,"GETTING STARTED",0.5,0.18,3,0.28,8,true,C.gold,"left");
  txt(s,"Up & Running in 24 Hours",0.5,0.55,12,0.65,30,true,C.white,"left");
  txt(s,"No IT team. No training. No technical knowledge needed — we set everything up for you.",
      0.5,1.28,12,0.4,13,false,"A5B4FC","left");
  line(s,0.5,1.75,12.3,C.soft);

  const steps=[
    {
      n:"01", icon:"📋", color:C.indigo,
      title:"We Onboard Your Society",
      pts:[
        "Share society name, address & flat list with us",
        "We create your database in less than 1 working day",
        "Your society logo and UPI ID are configured",
        "Admin (Chairman) account created & handed over",
        "WhatsApp & push notification settings activated",
      ],
    },
    {
      n:"02", icon:"👥", color:C.teal,
      title:"Residents Join the App",
      pts:[
        "Residents download SmartSocietyHub from Play/App Store",
        "Join with unique society code shared by chairman",
        "Profile auto-linked to their flat number",
        "Guard gets separate login for gate management",
        "Tenants get scoped login — only see their data",
      ],
    },
    {
      n:"03", icon:"🚀", color:C.gold,
      title:"Go Digital Immediately",
      pts:[
        "Generate first month's maintenance bills in 1 click",
        "Residents pay via UPI — receipts auto-generated",
        "Guard starts digital visitor log from day one",
        "Post first notice — all residents notified instantly",
        "WhatsApp reminders sent to defaulters automatically",
      ],
    },
  ];

  steps.forEach((st,i)=>{
    const x=0.35+i*4.35;
    shad(s,x,1.9,4.1,5.0,"0D2F52","1C4F7E");
    rect(s,x,1.9,4.1,0.55,st.color,st.color);
    txt(s,st.n,x,1.9,4.1,0.55,22,true,C.white,"center");
    txt(s,st.icon,x+0.1,2.53,4.1,0.42,22,false,C.white,"center");
    txt(s,st.title,x,3.02,4.1,0.38,12,true,C.white,"center");
    s.addShape(prs.ShapeType.line,{x:x+0.3,y:3.48,w:3.5,h:0,line:{color:"1C4F7E",width:1}});
    st.pts.forEach((p,j)=>{
      txt(s,"✓  "+p,x+0.2,3.6+j*0.54,3.7,0.46,9.2,false,"A5B4FC","left");
    });
  });

  txt(s,"SmartSocietyHub  ·  From Paper to Digital in 24 Hours",0,7.1,"100%",0.4,8.5,false,C.soft,"center");
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 22 — PLANS & PRICING
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  chrome(s,"Pricing","Transparent Plans — No Hidden Costs",
    "One flat price per month. All features included. Cancel anytime.");
  modHead(s,"💳","Starter  ·  Professional  ·  Enterprise — 30-Day Free Trial on All Plans",C.indigo);

  const plans=[
    {
      name:"Starter", price:"₹999", tag:"Up to 50 Flats",
      color:C.indigo, highlight:false,
      features:[
        "Maintenance Billing & UPI",
        "Visitor Gate Log",
        "Complaints & Notices",
        "Member Directory",
        "Basic Financial Reports",
        "Android App",
        "Email Support",
        "Activity Audit Log",
      ],
    },
    {
      name:"Professional", price:"₹2,499", tag:"Up to 200 Flats  ★ Popular",
      color:C.teal, highlight:true,
      features:[
        "Everything in Starter",
        "Parking Management",
        "Amenity / Facility Booking",
        "Staff Attendance & Payroll",
        "Tenant Management & Rent",
        "Polls, Events & Meeting Minutes",
        "WhatsApp Reminders",
        "Priority Support",
      ],
    },
    {
      name:"Enterprise", price:"₹5,999", tag:"Unlimited Flats",
      color:C.gold, highlight:false,
      features:[
        "Everything in Professional",
        "Double-Entry Accounting Ledger",
        "Trial Balance & Journal Vouchers",
        "Budget Planning & Fund Accounts",
        "Asset Register & Vendor Directory",
        "Multi-Society Dashboard",
        "Custom Branding & API Access",
        "Dedicated Account Manager",
      ],
    },
  ];

  plans.forEach((plan,i)=>{
    const x=0.35+i*4.35;
    const yOff=plan.highlight?0:0.18;
    if(plan.highlight){
      rect(s,x-0.1,2.08,4.3,5.22,C.teal,C.teal);
    }
    shad(s,x,2.08+yOff,4.1,4.85,C.lgray,C.mgray);
    rect(s,x,2.08+yOff,4.1,0.48,plan.color,plan.color);
    txt(s,plan.name,x,2.08+yOff,4.1,0.48,14,true,C.white,"center");
    txt(s,plan.tag, x,2.62+yOff,4.1,0.3, 8.5,false,C.gray,"center");
    txt(s,plan.price,x,2.96+yOff,4.1,0.72,30,true,plan.highlight?C.teal:C.navy,"center");
    txt(s,"/month + GST",x,3.7+yOff,4.1,0.28,9,false,C.gray,"center");
    s.addShape(prs.ShapeType.line,{x:x+0.3,y:4.04+yOff,w:3.5,h:0,line:{color:C.mgray,width:1}});
    plan.features.forEach((f,j)=>{
      txt(s,"✓  "+f,x+0.2,4.16+yOff+j*0.38,3.7,0.32,9,j===0&&i>0?false:false,C.slate,"left");
    });
  });

  rect(s,0.4,6.9,12.53,0.38,C.lgold,C.amber);
  txt(s,"🎁  30-day free trial · 20% off on annual billing · Onboarding support included on all plans",
      0.5,6.9,12.33,0.38,10,false,C.navy,"center");
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 23 — WHY SMARTSOCIETYHUB (SUMMARY)
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  chrome(s,"Why Us","5 Reasons Society Chairmen Choose SmartSocietyHub",
    "Built for India. Priced for India. Designed for every society, big or small.");

  const stats=[
    {v:"30+",  l:"Modules\nBuilt-in"},
    {v:"50+",  l:"Database\nEntities"},
    {v:"100%", l:"Digital\nAudit Trail"},
    {v:"24 hrs",l:"Setup\nTime"},
    {v:"₹0",   l:"Extra Cost\nfor Mobile App"},
  ];
  stats.forEach((st,i)=>{
    shad(s,0.35+i*2.6,1.62,2.48,1.1,C.lilac,C.soft);
    txt(s,st.v,0.35+i*2.6,1.68,2.48,0.62,28,true,C.indigo,"center");
    txt(s,st.l,0.35+i*2.6,2.28,2.48,0.4, 9, false,C.gray,"center");
  });

  const reasons=[
    {
      n:"1", icon:"🇮🇳", title:"Built for India — Not Adapted",
      desc:"UPI payment links, GST compliance, WhatsApp reminders in Hindi/Marathi, "+
           "Indian fiscal year (Apr–Mar), rupee formatting — every detail designed for Indian societies.",
    },
    {
      n:"2", icon:"📱", title:"Web + Mobile for One Price",
      desc:"You get a full web dashboard AND native Android + iOS apps for all user roles — "+
           "Chairman, Resident, Tenant, Guard — all included in the same subscription.",
    },
    {
      n:"3", icon:"🔄", title:"Truly Works Offline",
      desc:"Guards in the basement, residents in lifts — the app still works. Data queues "+
           "offline and syncs the moment internet returns. No data loss, ever.",
    },
    {
      n:"4", icon:"📊", title:"CA & AGM Ready Instantly",
      desc:"Trial balance, ledger, P&L, fund accounts, journal vouchers — all generated in one click. "+
           "No CA needs to chase the secretary for Excel files before audit.",
    },
    {
      n:"5", icon:"🚀", title:"Zero IT Overhead",
      desc:"We handle hosting, backups, security patches and updates. You manage your society — "+
           "we manage the technology. No server, no IT person, no maintenance cost.",
    },
  ];

  reasons.forEach((r,i)=>{
    shad(s,0.35,2.92+i*0.84,12.53,0.74,C.lgray,C.mgray);
    rect(s,0.35,2.92+i*0.84,0.6,0.74,C.indigo,C.indigo);
    txt(s,r.n,0.35,2.92+i*0.84,0.6,0.74,18,true,C.white,"center");
    txt(s,r.icon+"  "+r.title,1.05,2.96+i*0.84,4.5,0.32,10.5,true,C.navy,"left");
    txt(s,r.desc,1.05,3.27+i*0.84,11.62,0.34,9.2,false,C.gray,"left");
  });
}

// ════════════════════════════════════════════════════════════════════
// SLIDE 24 — CALL TO ACTION
// ════════════════════════════════════════════════════════════════════
{
  const s = prs.addSlide();
  bg(s, C.navy);
  rect(s,0,0,"100%",0.08,C.gold,C.gold);
  rect(s,0,0,0.2,"100%",C.soft,C.soft);
  rect(s,0,7.0,"100%",0.5,C.indigo,C.indigo);

  txt(s,"Transform Your Society Today",0.5,0.7,12.5,0.8,36,true,C.white,"center");
  txt(s,"Start Your FREE 30-Day Trial — No Credit Card, No Commitment",
      0.5,1.6,12.5,0.5,18,false,C.gold,"center");

  rect(s,0.5,2.25,12.3,0.06,C.soft,C.soft);

  // 3 action buttons
  const btns=[
    {l:"📞  Book a Free Demo",c:C.teal},
    {l:"🚀  Start Free Trial",c:C.gold},
    {l:"💬  WhatsApp Us Now",c:"7C3AED"},
  ];
  btns.forEach((b,i)=>{
    rect(s,1.2+i*4.0,2.55,3.6,0.7,b.c,b.c);
    txt(s,b.l,1.2+i*4.0,2.55,3.6,0.7,13,true,C.white,"center");
  });

  // Contact
  const contacts=[
    {e:"📱",l:"WhatsApp / Call",v:"+91 98765 43210"},
    {e:"📧",l:"Email",          v:"hello@smartsocietyhub.in"},
    {e:"🌐",l:"Website",        v:"www.smartsocietyhub.in"},
  ];
  contacts.forEach((c,i)=>{
    shad(s,0.5+i*4.35,3.55,4.1,1.2,"0D2F52","1C4F7E");
    txt(s,c.e+"  "+c.l,0.5+i*4.35,3.65,4.1,0.35,10,false,C.teal,"center");
    txt(s,c.v,          0.5+i*4.35,3.98,4.1,0.42,13,true,C.white,"center");
  });

  // Tagline
  txt(s,'"From paper registers to a fully digital society — in 24 hours."',
      0.5,5.0,12.5,0.55,16,false,"A5B4FC","center",true,true);

  // Feature reminder grid
  const reminders=[
    "🧾 Auto Billing","💳 UPI Payments","🚪 Digital Gate","🔧 Complaints",
    "🅿️ Parking","🏊 Amenities","👷 Staff & Payroll","📊 Reports",
    "🔔 WhatsApp Alerts","📱 Mobile App","📴 Offline Mode","🔒 Audit Log",
  ];
  reminders.forEach((r,i)=>{
    const col=i%6, row=Math.floor(i/6);
    shad(s,0.35+col*2.18,5.72+row*0.52,2.1,0.44,"0D2F52","1C4F7E");
    txt(s,r,0.35+col*2.18,5.72+row*0.52,2.1,0.44,8.5,false,C.soft,"center");
  });

  txt(s,"SmartSocietyHub  ·  Complete Society Management Platform",
      0,7.0,"100%",0.5,9,false,C.soft,"center");
}

// ════════════════════════════════════════════════════════════════════
// SAVE
// ════════════════════════════════════════════════════════════════════
prs.writeFile({fileName:"./SmartSocietyHub-Marketing-v2.pptx"}).then(()=>{
  console.log("\n✅  PowerPoint generated!");
  console.log("📁  SmartSocietyHub-Marketing-v2.pptx");
  console.log("📊  Slides: 24");
  console.log("🎨  Theme: White + Indigo + Gold");
  console.log("✅  All features from codebase included\n");
}).catch(e=>{ console.error("❌ Error:",e); process.exit(1); });
