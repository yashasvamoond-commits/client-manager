export type CaseStage =
  | 'Consultation / Pre-Litigation'
  | 'Notice / Drafting Stage'
  | 'Filing / Scrutiny'
  | 'Summons / Appearance'
  | 'Bail / Interim Relief'
  | 'Pleadings / Written Statement'
  | 'Evidence / Cross-Examination'
  | 'Final Arguments'
  | 'Reserved for Judgment'
  | 'Decreed / Disposed';

export type CaseType =
  | 'Criminal (BNS / BNSS / IPC)'
  | 'Civil Suit / Property'
  | 'Matrimonial / Family'
  | 'Cheque Bounce (Sec. 138 NIA)'
  | 'Constitutional / Writ'
  | 'Commercial / Arbitration'
  | 'Corporate / NCLT / IBC'
  | 'Consumer / RERA'
  | 'Advisory / Transactional';

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  mode: 'UPI' | 'Bank Transfer (NEFT/RTGS/IMPS)' | 'Cheque' | 'Cash' | 'Demand Draft';
  reference?: string;
  milestone?: string;
  receiptNo: string;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  reimbursable: boolean;
}

export interface HearingNote {
  id: string;
  date: string;
  purpose: string;
  outcome?: string;
  nextDate?: string;
}

export interface ClientMatter {
  id: string;
  clientName: string;
  fatherOrSpouseName?: string;
  phone: string;
  email?: string;
  address: string;
  idProofRef?: string; // PAN / Aadhaar masked ref
  matterTitle: string; // What the lawyer is dealing with
  caseType: CaseType;
  courtName: string;
  caseNumber?: string; // CNR / Case No / FIR No
  opposingParty?: string;
  opposingCounsel?: string;
  sectionsInvolved?: string; // e.g., "BNS Sec. 318(4), 316(2) (Old IPC 420, 406)"
  stage: CaseStage;
  nextHearingDate?: string;
  quotedFee: number; // Total professional fee quoted (INR)
  clerkageAndMiscQuoted?: number; // Clerkage / filing / misc quoted
  payments: PaymentRecord[];
  expenses: ExpenseRecord[];
  hearings: HearingNote[];
  notes: string;
  createdAt: string;
  status: 'Active' | 'Closed' | 'On Hold';
}

export interface AdvocateProfile {
  advocateName: string;
  enrollmentNo: string; // e.g., R/1425/2018
  chamberName: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  panNo?: string;
  gstin?: string;
  bankName?: string;
  accountHolder?: string;
  accountNo?: string;
  ifscCode?: string;
  upiId?: string;
}

export interface SavedDocument {
  id: string;
  clientId?: string;
  clientName: string;
  docType:
    | 'Fee Quotation'
    | 'Engagement / Retainer Agreement'
    | 'Vakalatnama'
    | 'Payment Receipt'
    | 'Legal Notice'
    | 'Sec. 63(4) BSA Electronic Evidence Certificate';
  title: string;
  docNumber: string;
  createdAt: string;
  contentHtml: string;
}

export interface ActMeta {
  code: string;
  name: string;
  year: number | null;
  status: 'current' | 'repealed';
  replacedBy: string | null;
  category: string;
  sectionCount: number;
  hasFullText: boolean;
}

export interface CentralStatuteRegistryItem {
  title: string;
  year: number | null;
  actNumber: string;
  category: string;
  fullTextCode: string | null;
  indiaCodeUrl: string;
  sectionsUrl: string;
}

export interface BareActSection {
  s: string; // section_number
  t: string; // section_title
  c: string | null; // chapter_number
  ct: string | null; // chapter_title
  b: string; // bare act text
  cm?: string; // commentary
  cl?: Array<{
    name: string;
    short?: string;
    year: string;
    bench?: string;
    status?: 'good' | 'partly' | 'overruled' | 'historic' | 'latest';
    facts?: string;
    held: string;
    why?: string;
  }>;
  x?: Array<{
    targetAct: string;
    targetSec: string;
    baseTargetSec: string;
    targetTitle: string;
    status: string;
    note: string;
  }>;
}

export interface ConcordanceRow {
  id: string;
  lookup: string;
  status: string;
  srcSec: string;
  srcSub: string | null;
  srcTitle: string;
  srcChap: string;
  tgtSec: string;
  tgtSub: string | null;
  tgtTitle: string;
  tgtChap: string;
  note: string;
}
