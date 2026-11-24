import { AdvocateProfile, ClientMatter } from './types';

export const DATA_BASE_URL =
  typeof window !== 'undefined' &&
  (window.location.protocol === 'file:' ||
    window.location.protocol === 'blob:' ||
    window.location.hostname.includes('htmlpreview') ||
    window.location.hostname.includes('githack') ||
    window.location.hostname.includes('jsdelivr'))
    ? 'https://raw.githubusercontent.com/yashasvamoond-commits/client-manager/arena/df2a2b26-client-manager/public/data'
    : './data';

/**
 * Formats a number in the Indian numbering system (₹1,50,000)
 */
export function formatINR(amount: number | undefined | null): string {
  const n = Number(amount || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(n);
}

/**
 * Converts a number into Indian Legal Rupees in words (e.g., "Rupees One Lakh Fifty Thousand Only")
 */
export function numberToIndianWords(num: number): string {
  if (!num || num <= 0) return 'Rupees Zero Only';
  const a = [
    '',
    'One ',
    'Two ',
    'Three ',
    'Four ',
    'Five ',
    'Six ',
    'Seven ',
    'Eight ',
    'Nine ',
    'Ten ',
    'Eleven ',
    'Twelve ',
    'Thirteen ',
    'Fourteen ',
    'Fifteen ',
    'Sixteen ',
    'Seventeen ',
    'Eighteen ',
    'Nineteen '
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = Math.floor(num);
  if (n > 999999999) return `Rupees ${n.toLocaleString('en-IN')} Only`;

  const str = ('000000000' + n).slice(-9);
  const crore = Number(str.slice(0, 2));
  const lakh = Number(str.slice(2, 4));
  const thousand = Number(str.slice(4, 6));
  const hundred = Number(str.slice(6, 7));
  const rest = Number(str.slice(7, 9));

  const twoDigits = (val: number) => {
    if (val === 0) return '';
    if (val < 20) return a[val];
    const tens = Math.floor(val / 10);
    const ones = val % 10;
    return `${b[tens]}${ones ? ' ' + a[ones] : ' '}`;
  };

  let out = '';
  if (crore > 0) out += `${twoDigits(crore)}Crore `;
  if (lakh > 0) out += `${twoDigits(lakh)}Lakh `;
  if (thousand > 0) out += `${twoDigits(thousand)}Thousand `;
  if (hundred > 0) out += `${a[hundred]}Hundred `;
  if (rest > 0) {
    if (out !== '') out += 'and ';
    out += twoDigits(rest);
  }
  return `Rupees ${out.trim()} Only`;
}

export function getTotalPaid(client: ClientMatter): number {
  return (client.payments || []).reduce((sum, p) => sum + Number(p.amount || 0), 0);
}

export function getTotalQuoted(client: ClientMatter): number {
  return Number(client.quotedFee || 0) + Number(client.clerkageAndMiscQuoted || 0);
}

export function getBalanceDue(client: ClientMatter): number {
  return Math.max(0, getTotalQuoted(client) - getTotalPaid(client));
}

export function getReimbursableExpenses(client: ClientMatter): number {
  return (client.expenses || [])
    .filter((e) => e.reimbursable)
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
}

export const DEFAULT_ADVOCATE_PROFILE: AdvocateProfile = {
  advocateName: 'Adv. Rajeshwar Sharma',
  enrollmentNo: 'R/1842/2016',
  chamberName: 'Sharma & Associates — Advocates & Legal Consultants',
  address: 'Chamber No. 214, High Court Chambers Block, Bhagwan Das Road',
  city: 'Jaipur, Rajasthan - 302005',
  phone: '+91 98290 12345',
  email: 'chambers@sharmalaw.in',
  panNo: 'ABCPS1234K',
  bankName: 'State Bank of India — High Court Branch',
  accountHolder: 'Rajeshwar Sharma',
  accountNo: '38912045678',
  ifscCode: 'SBIN0031042',
  upiId: 'sharmachambers@sbi'
};

export const INITIAL_SAMPLE_CLIENTS: ClientMatter[] = [
  {
    id: 'cli-101',
    clientName: 'Vikramaditya Singhania',
    fatherOrSpouseName: 'S/o Late Shri Mahendra Singhania',
    phone: '+91 98291 44550',
    email: 'vikram.singhania@example.com',
    address: 'B-42, Prithviraj Road, C-Scheme, Jaipur, Rajasthan - 302001',
    idProofRef: 'PAN: BDFPS8821M',
    matterTitle: 'Quashing of Commercial FIR & Anticipatory Bail in Supply Contract Dispute',
    caseType: 'Criminal (BNS / BNSS / IPC)',
    courtName: 'Rajasthan High Court, Jaipur Bench',
    caseNumber: 'S.B. Cr. Misc. Petition (u/s 528 BNSS) No. 4128/2026',
    opposingParty: 'State of Rajasthan & M/s Apex Infra Solutions Pvt. Ltd.',
    opposingCounsel: 'Public Prosecutor & Adv. M.K. Gupta',
    sectionsInvolved: 'BNS Sec. 318(4), 316(2), 61(2) [Old IPC Sec. 420, 406, 120B] & BNSS Sec. 482, 528',
    stage: 'Bail / Interim Relief',
    nextHearingDate: '2026-11-28',
    quotedFee: 150000,
    clerkageAndMiscQuoted: 15000,
    payments: [
      {
        id: 'pay-1',
        date: '2026-10-14',
        amount: 75000,
        mode: 'UPI',
        reference: 'UTR 628719402112',
        milestone: 'Filing & Drafting Advance',
        receiptNo: 'RCPT-2026-001'
      },
      {
        id: 'pay-2',
        date: '2026-11-05',
        amount: 40000,
        mode: 'Bank Transfer (NEFT/RTGS/IMPS)',
        reference: 'NEFT SBIN263098812',
        milestone: 'Interim Stay Appearance',
        receiptNo: 'RCPT-2026-004'
      }
    ],
    expenses: [
      {
        id: 'exp-1',
        date: '2026-10-16',
        description: 'Certified Copy of FIR, Vakalatnama Welfare Stamp & E-Filing Charges',
        amount: 2450,
        reimbursable: true
      }
    ],
    hearings: [
      {
        id: 'hr-1',
        date: '2026-10-22',
        purpose: 'Admission & Interim Stay Prayer u/s 528 BNSS',
        outcome: 'Notice issued to Respondent No. 2; interim protection granted citing Delhi Race Club (2024).',
        nextDate: '2026-11-28'
      }
    ],
    notes:
      'Purely civil unpaid invoice dispute cloaked as criminal CBT + Cheating. Rely on Delhi Race Club (1940) Ltd. v. State of U.P. (2024) — S. 316 and S. 318 BNS cannot coexist on same facts.',
    createdAt: '2026-10-12',
    status: 'Active'
  },
  {
    id: 'cli-102',
    clientName: 'M/s Khandelwal Textiles Pvt. Ltd. (through Director Ankit Khandelwal)',
    fatherOrSpouseName: 'S/o Shri Rameshwar Khandelwal',
    phone: '+91 94140 77889',
    email: 'accounts@khandelwaltextiles.example.in',
    address: 'Plot G-118, Sitapura Industrial Area, Jaipur - 302022',
    idProofRef: 'GSTIN: 08AABCK4519L1Z2',
    matterTitle: 'Recovery of ₹28,50,000 Dishonoured Cheques (3 Cheques) + Interim Compensation',
    caseType: 'Cheque Bounce (Sec. 138 NIA)',
    courtName: 'Special Metropolitan Magistrate (NI Act Cases) No. 4, Jaipur Metro-I',
    caseNumber: 'Cr. Complaint No. 1892/2026',
    opposingParty: 'M/s Vogue Garments & Exports',
    opposingCounsel: 'Adv. S.R. Choudhary',
    sectionsInvolved: 'Negotiable Instruments Act Sec. 138, 141, 142, 143A & BSA Sec. 63(4)',
    stage: 'Summons / Appearance',
    nextHearingDate: '2026-12-03',
    quotedFee: 85000,
    clerkageAndMiscQuoted: 8500,
    payments: [
      {
        id: 'pay-3',
        date: '2026-09-19',
        amount: 45000,
        mode: 'Cheque',
        reference: 'HDFC Chq #004512',
        milestone: 'Statutory Notice & Complaint Filing',
        receiptNo: 'RCPT-2026-002'
      }
    ],
    expenses: [
      {
        id: 'exp-2',
        date: '2026-09-20',
        description: 'Speed Post AD Notices (4 Directors) & Court Fee Stamps',
        amount: 3200,
        reimbursable: true
      }
    ],
    hearings: [
      {
        id: 'hr-2',
        date: '2026-10-10',
        purpose: 'Pre-summoning affidavit & cognizance',
        outcome: 'Cognizance taken; bailable warrants / summons issued to accused directors.',
        nextDate: '2026-12-03'
      }
    ],
    notes:
      'Application u/s 143A NIA for 20% interim compensation ready for filing on appearance of accused. Invoice trail & WhatsApp acknowledgement backed by Sec. 63(4) BSA certificate.',
    createdAt: '2026-09-18',
    status: 'Active'
  },
  {
    id: 'cli-103',
    clientName: 'Dr. Meenakshi Rathore',
    fatherOrSpouseName: 'D/o Col. (Retd.) Pratap Singh Rathore',
    phone: '+91 99283 66110',
    email: 'dr.meenakshi@example.com',
    address: 'Flat 602, Emerald Residency, Vaishali Nagar, Jaipur - 302021',
    idProofRef: 'PAN: AULPR3390E',
    matterTitle: 'Mutual Consent Divorce Petition & Permanent Alimony Settlement Deed',
    caseType: 'Matrimonial / Family',
    courtName: 'Family Court No. 1, Jaipur Metropolitan',
    caseNumber: 'Matrimonial Case No. 745/2026',
    opposingParty: 'Dr. Siddharth Chauhan (Joint Petitioner)',
    opposingCounsel: 'Joint Mutual Consent Filing',
    sectionsInvolved: 'Hindu Marriage Act, 1955 Sec. 13B(1) & 13B(2) (Amardeep Singh Cooling-off Waiver)',
    stage: 'Final Arguments',
    nextHearingDate: '2026-11-26',
    quotedFee: 60000,
    clerkageAndMiscQuoted: 5000,
    payments: [
      {
        id: 'pay-4',
        date: '2026-08-05',
        amount: 35000,
        mode: 'UPI',
        reference: 'UTR 621198330129',
        milestone: 'First Motion & MOU Drafting',
        receiptNo: 'RCPT-2026-003'
      },
      {
        id: 'pay-5',
        date: '2026-11-15',
        amount: 30000,
        mode: 'UPI',
        reference: 'UTR 631900248811',
        milestone: 'Second Motion & Waiver Application (Full Settlement)',
        receiptNo: 'RCPT-2026-005'
      }
    ],
    expenses: [],
    hearings: [
      {
        id: 'hr-3',
        date: '2026-08-18',
        purpose: 'First Motion Statement u/s 13B(1) HMA',
        outcome: 'First motion recorded; MOU exhibited.',
        nextDate: '2026-11-26'
      }
    ],
    notes:
      'Parties living separately for 22 months. Demand Draft for permanent alimony ready to be handed over on 26 Nov 2026 during Second Motion statement.',
    createdAt: '2026-08-02',
    status: 'Active'
  }
];

/**
 * Opens a clean, print-ready A4 Legal Document window for PDF Save / Print
 */
export function printLegalDocument(title: string, htmlContent: string) {
  const win = window.open('', '_blank');
  if (!win) {
    alert('Please allow popups in your browser to export/print PDF documents.');
    return;
  }
  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    @page { size: A4; margin: 18mm 18mm 18mm 18mm; }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      color: #0f172a;
      line-height: 1.6;
      font-size: 11.5pt;
      margin: 0;
      padding: 24px;
      background: #fff;
    }
    .no-print-bar {
      background: #0f172a;
      color: #fff;
      padding: 12px 20px;
      margin: -24px -24px 24px -24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
    }
    .no-print-bar button {
      background: #d97706;
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
    }
    h1, h2, h3 { color: #0f172a; margin-top: 0.8em; margin-bottom: 0.4em; }
    table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 10.5pt; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; vertical-align: top; }
    th { background: #f1f5f9; font-weight: bold; }
    .header-box { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 18px; }
    .sig-grid { display: flex; justify-content: space-between; margin-top: 48px; gap: 32px; }
    .sig-box { width: 45%; border-top: 1px solid #334155; padding-top: 8px; }
    @media print {
      .no-print-bar { display: none !important; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <span><strong>${title}</strong> — Ready to Save as PDF or Print</span>
    <div style="display:flex;gap:10px;">
      <button onclick="window.print()">Print / Save as PDF</button>
      <button style="background:#475569" onclick="window.close()">Close</button>
    </div>
  </div>
  ${htmlContent}
</body>
</html>`);
  win.document.close();
}
