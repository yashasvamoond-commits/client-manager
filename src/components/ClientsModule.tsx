import React, { useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Phone,
  Mail,
  Calendar,
  FileText,
  IndianRupee,
  CheckCircle2,
  Clock,
  Scale,
  Trash2,
  Edit3,
  MessageSquare,
  ChevronRight,
  Receipt,
  Briefcase,
  Building2,
  X
} from 'lucide-react';
import {
  AdvocateProfile,
  CaseStage,
  CaseType,
  ClientMatter,
  ExpenseRecord,
  HearingNote,
  PaymentRecord
} from '../types';
import {
  formatINR,
  getBalanceDue,
  getReimbursableExpenses,
  getTotalPaid,
  getTotalQuoted,
  numberToIndianWords,
  printLegalDocument
} from '../utils';

interface ClientsModuleProps {
  clients: ClientMatter[];
  setClients: React.Dispatch<React.SetStateAction<ClientMatter[]>>;
  profile: AdvocateProfile;
  onOpenDrafterForClient: (
    client: ClientMatter,
    docType: 'Fee Quotation' | 'Engagement / Retainer Agreement' | 'Vakalatnama'
  ) => void;
  onJumpToSectionSearch?: (query: string) => void;
}

const CASE_TYPES: CaseType[] = [
  'Criminal (BNS / BNSS / IPC)',
  'Civil Suit / Property',
  'Matrimonial / Family',
  'Cheque Bounce (Sec. 138 NIA)',
  'Constitutional / Writ',
  'Commercial / Arbitration',
  'Corporate / NCLT / IBC',
  'Consumer / RERA',
  'Advisory / Transactional'
];

const CASE_STAGES: CaseStage[] = [
  'Consultation / Pre-Litigation',
  'Notice / Drafting Stage',
  'Filing / Scrutiny',
  'Summons / Appearance',
  'Bail / Interim Relief',
  'Pleadings / Written Statement',
  'Evidence / Cross-Examination',
  'Final Arguments',
  'Reserved for Judgment',
  'Decreed / Disposed'
];

export const ClientsModule: React.FC<ClientsModuleProps> = ({
  clients,
  setClients,
  profile,
  onOpenDrafterForClient,
  onJumpToSectionSearch
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'PendingDues' | 'Closed'>('All');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(clients[0]?.id || null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientMatter | null>(null);

  // Sub-modals for adding payment / hearing / expense
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMode, setPayMode] = useState<PaymentRecord['mode']>('UPI');
  const [payRef, setPayRef] = useState('');
  const [payMilestone, setPayMilestone] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().slice(0, 10));

  const [showHearingModal, setShowHearingModal] = useState(false);
  const [hrDate, setHrDate] = useState(new Date().toISOString().slice(0, 10));
  const [hrPurpose, setHrPurpose] = useState('');
  const [hrOutcome, setHrOutcome] = useState('');
  const [hrNextDate, setHrNextDate] = useState('');

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expDesc, setExpDesc] = useState('');
  const [expAmt, setExpAmt] = useState('');

  // Form state for New / Edit Client
  const [formState, setFormState] = useState({
    clientName: '',
    fatherOrSpouseName: '',
    phone: '',
    email: '',
    address: '',
    idProofRef: '',
    matterTitle: '',
    caseType: 'Criminal (BNS / BNSS / IPC)' as CaseType,
    courtName: '',
    caseNumber: '',
    opposingParty: '',
    opposingCounsel: '',
    sectionsInvolved: '',
    stage: 'Consultation / Pre-Litigation' as CaseStage,
    nextHearingDate: '',
    quotedFee: '',
    clerkageAndMiscQuoted: '',
    initialAdvancePaid: '',
    notes: '',
    status: 'Active' as 'Active' | 'Closed' | 'On Hold'
  });

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      if (statusFilter === 'Active' && c.status !== 'Active') return false;
      if (statusFilter === 'Closed' && c.status !== 'Closed') return false;
      if (statusFilter === 'PendingDues' && getBalanceDue(c) <= 0) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        c.clientName.toLowerCase().includes(q) ||
        c.matterTitle.toLowerCase().includes(q) ||
        c.courtName.toLowerCase().includes(q) ||
        (c.caseNumber || '').toLowerCase().includes(q) ||
        (c.sectionsInvolved || '').toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
      );
    });
  }, [clients, search, statusFilter]);

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId) || null,
    [clients, selectedClientId]
  );

  // Portfolio Fee Totals
  const totals = useMemo(() => {
    const quoted = clients.reduce((s, c) => s + getTotalQuoted(c), 0);
    const collected = clients.reduce((s, c) => s + getTotalPaid(c), 0);
    const due = clients.reduce((s, c) => s + getBalanceDue(c), 0);
    return { quoted, collected, due };
  }, [clients]);

  const openNewClientModal = () => {
    setEditingClient(null);
    setFormState({
      clientName: '',
      fatherOrSpouseName: '',
      phone: '',
      email: '',
      address: '',
      idProofRef: '',
      matterTitle: '',
      caseType: 'Criminal (BNS / BNSS / IPC)',
      courtName: '',
      caseNumber: '',
      opposingParty: '',
      opposingCounsel: '',
      sectionsInvolved: '',
      stage: 'Consultation / Pre-Litigation',
      nextHearingDate: '',
      quotedFee: '',
      clerkageAndMiscQuoted: '',
      initialAdvancePaid: '',
      notes: '',
      status: 'Active'
    });
    setShowFormModal(true);
  };

  const openEditClientModal = (c: ClientMatter) => {
    setEditingClient(c);
    setFormState({
      clientName: c.clientName,
      fatherOrSpouseName: c.fatherOrSpouseName || '',
      phone: c.phone,
      email: c.email || '',
      address: c.address,
      idProofRef: c.idProofRef || '',
      matterTitle: c.matterTitle,
      caseType: c.caseType,
      courtName: c.courtName,
      caseNumber: c.caseNumber || '',
      opposingParty: c.opposingParty || '',
      opposingCounsel: c.opposingCounsel || '',
      sectionsInvolved: c.sectionsInvolved || '',
      stage: c.stage,
      nextHearingDate: c.nextHearingDate || '',
      quotedFee: String(c.quotedFee || 0),
      clerkageAndMiscQuoted: String(c.clerkageAndMiscQuoted || 0),
      initialAdvancePaid: '0',
      notes: c.notes || '',
      status: c.status
    });
    setShowFormModal(true);
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.clientName.trim() || !formState.matterTitle.trim()) return;

    if (editingClient) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === editingClient.id
            ? {
                ...c,
                clientName: formState.clientName.trim(),
                fatherOrSpouseName: formState.fatherOrSpouseName.trim(),
                phone: formState.phone.trim(),
                email: formState.email.trim(),
                address: formState.address.trim(),
                idProofRef: formState.idProofRef.trim(),
                matterTitle: formState.matterTitle.trim(),
                caseType: formState.caseType,
                courtName: formState.courtName.trim(),
                caseNumber: formState.caseNumber.trim(),
                opposingParty: formState.opposingParty.trim(),
                opposingCounsel: formState.opposingCounsel.trim(),
                sectionsInvolved: formState.sectionsInvolved.trim(),
                stage: formState.stage,
                nextHearingDate: formState.nextHearingDate,
                quotedFee: Number(formState.quotedFee || 0),
                clerkageAndMiscQuoted: Number(formState.clerkageAndMiscQuoted || 0),
                notes: formState.notes.trim(),
                status: formState.status
              }
            : c
        )
      );
    } else {
      const newId = `cli-${Date.now()}`;
      const initialPayments: PaymentRecord[] = [];
      const initPaid = Number(formState.initialAdvancePaid || 0);
      if (initPaid > 0) {
        initialPayments.push({
          id: `pay-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          amount: initPaid,
          mode: 'UPI',
          milestone: 'Initial Retainer / Consultation Advance',
          receiptNo: `RCPT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
        });
      }
      const newClient: ClientMatter = {
        id: newId,
        clientName: formState.clientName.trim(),
        fatherOrSpouseName: formState.fatherOrSpouseName.trim(),
        phone: formState.phone.trim(),
        email: formState.email.trim(),
        address: formState.address.trim(),
        idProofRef: formState.idProofRef.trim(),
        matterTitle: formState.matterTitle.trim(),
        caseType: formState.caseType,
        courtName: formState.courtName.trim() || 'District & Sessions Court / High Court',
        caseNumber: formState.caseNumber.trim(),
        opposingParty: formState.opposingParty.trim(),
        opposingCounsel: formState.opposingCounsel.trim(),
        sectionsInvolved: formState.sectionsInvolved.trim(),
        stage: formState.stage,
        nextHearingDate: formState.nextHearingDate,
        quotedFee: Number(formState.quotedFee || 0),
        clerkageAndMiscQuoted: Number(formState.clerkageAndMiscQuoted || 0),
        payments: initialPayments,
        expenses: [],
        hearings: [],
        notes: formState.notes.trim(),
        createdAt: new Date().toISOString().slice(0, 10),
        status: formState.status
      };
      setClients((prev) => [newClient, ...prev]);
      setSelectedClientId(newId);
    }
    setShowFormModal(false);
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !Number(payAmount)) return;
    const newPay: PaymentRecord = {
      id: `pay-${Date.now()}`,
      date: payDate,
      amount: Number(payAmount),
      mode: payMode,
      reference: payRef.trim(),
      milestone: payMilestone.trim() || 'Part Professional Fee',
      receiptNo: `RCPT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
    };
    setClients((prev) =>
      prev.map((c) => (c.id === selectedClient.id ? { ...c, payments: [...c.payments, newPay] } : c))
    );
    setPayAmount('');
    setPayRef('');
    setPayMilestone('');
    setShowPaymentModal(false);
  };

  const handleAddHearing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !hrPurpose.trim()) return;
    const newHr: HearingNote = {
      id: `hr-${Date.now()}`,
      date: hrDate,
      purpose: hrPurpose.trim(),
      outcome: hrOutcome.trim(),
      nextDate: hrNextDate
    };
    setClients((prev) =>
      prev.map((c) =>
        c.id === selectedClient.id
          ? {
              ...c,
              nextHearingDate: hrNextDate || c.nextHearingDate,
              hearings: [newHr, ...c.hearings]
            }
          : c
      )
    );
    setHrPurpose('');
    setHrOutcome('');
    setHrNextDate('');
    setShowHearingModal(false);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !expDesc.trim() || !Number(expAmt)) return;
    const newExp: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      description: expDesc.trim(),
      amount: Number(expAmt),
      reimbursable: true
    };
    setClients((prev) =>
      prev.map((c) => (c.id === selectedClient.id ? { ...c, expenses: [...c.expenses, newExp] } : c))
    );
    setExpDesc('');
    setExpAmt('');
    setShowExpenseModal(false);
  };

  const handlePrintReceipt = (client: ClientMatter, payment: PaymentRecord) => {
    const totalPaidSoFar = getTotalPaid(client);
    const balanceRemaining = getBalanceDue(client);
    const html = `
      <div class="header-box">
        <h2 style="margin:0;">${profile.chamberName}</h2>
        <p style="margin:4px 0 0 0;font-size:10pt;color:#334155;">
          <strong>${profile.advocateName}</strong> (Enrl. No. ${profile.enrollmentNo})<br/>
          ${profile.address}, ${profile.city} | Phone: ${profile.phone} | Email: ${profile.email}
        </p>
      </div>
      <h2 style="text-align:center;text-decoration:underline;letter-spacing:0.5px;">OFFICIAL FEE RECEIPT</h2>
      <p style="display:flex;justify-content:space-between;">
        <span><strong>Receipt No.:</strong> ${payment.receiptNo}</span>
        <span><strong>Date:</strong> ${payment.date}</span>
      </p>
      <p>Received with thanks from <strong>${client.clientName}</strong> ${client.fatherOrSpouseName ? `(${client.fatherOrSpouseName})` : ''}, R/o ${client.address}, a sum of <strong>${formatINR(payment.amount)}</strong> (<em>${numberToIndianWords(payment.amount)}</em>) towards <strong>${payment.milestone || 'Professional Legal Fees'}</strong>.</p>
      <table>
        <tr><th>Matter / Brief</th><td>${client.matterTitle}</td></tr>
        <tr><th>Court & Case Ref.</th><td>${client.courtName} ${client.caseNumber ? `— ${client.caseNumber}` : ''}</td></tr>
        <tr><th>Payment Mode & Ref.</th><td>${payment.mode} ${payment.reference ? `(${payment.reference})` : ''}</td></tr>
        <tr><th>Total Fee Quoted</th><td>${formatINR(getTotalQuoted(client))}</td></tr>
        <tr><th>Cumulative Paid to Date</th><td>${formatINR(totalPaidSoFar)}</td></tr>
        <tr><th>Balance Fee Payable</th><td><strong>${formatINR(balanceRemaining)}</strong></td></tr>
      </table>
      <div class="sig-grid">
        <div class="sig-box">Client / Payer Acknowledgement</div>
        <div class="sig-box" style="text-align:right;">
          <strong>${profile.advocateName}</strong><br/>Advocate (${profile.enrollmentNo})
        </div>
      </div>
    `;
    printLegalDocument(`Fee_Receipt_${payment.receiptNo}`, html);
  };

  const handleDeleteClient = (id: string) => {
    if (!window.confirm('Remove this client record permanently from device storage?')) return;
    setClients((prev) => prev.filter((c) => c.id !== id));
    if (selectedClientId === id) {
      setSelectedClientId(clients.find((c) => c.id !== id)?.id || null);
    }
  };

  const sendWhatsAppFeeReminder = (client: ClientMatter) => {
    const due = getBalanceDue(client);
    const cleanPhone = client.phone.replace(/[^0-9]/g, '');
    const text = `Dear ${client.clientName},\n\nGreetings from ${profile.chamberName}.\n\nRegarding your matter: "${client.matterTitle}" (${client.courtName}${client.nextHearingDate ? `, Next Date: ${client.nextHearingDate}` : ''}).\n\n• Total Fee Quoted: ${formatINR(getTotalQuoted(client))}\n• Amount Paid: ${formatINR(getTotalPaid(client))}\n• Balance Payable: ${formatINR(due)}\n${profile.upiId ? `\nUPI ID for remittance: ${profile.upiId}` : ''}\n\nRegards,\n${profile.advocateName}`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-5">
      {/* Top Financial Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Fees Quoted ({clients.length} Matters)
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{formatINR(totals.quoted)}</p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Total Fee Collected (Paid)
            </p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{formatINR(totals.collected)}</p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Outstanding Balance Receivable
            </p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{formatINR(totals.due)}</p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search, Filter & Add Client Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client name, brief, FIR/case no., court, phone, or section..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(['All', 'Active', 'PendingDues', 'Closed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                statusFilter === tab
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab === 'PendingDues' ? 'Pending Dues' : tab}
            </button>
          ))}
          <button
            onClick={openNewClientModal}
            className="ml-auto md:ml-2 inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Client & Matter
          </button>
        </div>
      </div>

      {/* Master-Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left List of Clients */}
        <div className="lg:col-span-5 space-y-3">
          {filteredClients.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
              <p className="font-medium text-slate-700">No client briefs match your filter.</p>
              <p className="text-xs mt-1">Tap "Add Client & Matter" above to create a new client docket.</p>
            </div>
          ) : (
            filteredClients.map((client) => {
              const quoted = getTotalQuoted(client);
              const paid = getTotalPaid(client);
              const due = getBalanceDue(client);
              const pct = quoted > 0 ? Math.min(100, Math.round((paid / quoted) * 100)) : 100;
              const isSelected = selectedClient?.id === client.id;
              return (
                <div
                  key={client.id}
                  onClick={() => setSelectedClientId(client.id)}
                  className={`rounded-xl border p-4 transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md mb-1.5 ${
                          isSelected ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {client.caseType}
                      </span>
                      <h3 className="font-bold text-base leading-snug">{client.clientName}</h3>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 shrink-0 mt-1 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`}
                    />
                  </div>
                  <p className={`text-xs mt-1 line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                    {client.matterTitle}
                  </p>
                  <div
                    className={`mt-3 pt-3 border-t flex items-center justify-between text-xs ${
                      isSelected ? 'border-slate-800' : 'border-slate-100'
                    }`}
                  >
                    <div>
                      <span className={isSelected ? 'text-slate-400' : 'text-slate-500'}>Quoted: </span>
                      <span className="font-semibold">{formatINR(quoted)}</span>
                    </div>
                    <div>
                      <span className={isSelected ? 'text-emerald-300' : 'text-emerald-700'}>
                        Paid: {formatINR(paid)}
                      </span>
                    </div>
                    <div>
                      <span
                        className={`font-bold ${
                          due > 0
                            ? isSelected
                              ? 'text-amber-300'
                              : 'text-amber-700'
                            : isSelected
                              ? 'text-emerald-300'
                              : 'text-emerald-700'
                        }`}
                      >
                        {due > 0 ? `Due: ${formatINR(due)}` : 'Paid in Full'}
                      </span>
                    </div>
                  </div>
                  <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden ${isSelected ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <div
                      className={`h-full rounded-full ${due === 0 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detailed Client Docket */}
        <div className="lg:col-span-7">
          {!selectedClient ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">
              Select a client from the list to view full matter details, fee ledger, and 1-tap legal drafting.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-slate-200 bg-slate-50/70">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                        {selectedClient.status}
                      </span>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        {selectedClient.stage}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mt-2">{selectedClient.clientName}</h2>
                    {selectedClient.fatherOrSpouseName && (
                      <p className="text-xs text-slate-500">{selectedClient.fatherOrSpouseName}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditClientModal(selectedClient)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClient(selectedClient.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-700 cursor-pointer"
                      title="Delete Client"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Contact strip */}
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                  <a href={`tel:${selectedClient.phone}`} className="inline-flex items-center gap-1.5 hover:text-slate-900 font-medium">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedClient.phone}
                  </a>
                  {selectedClient.email && (
                    <a href={`mailto:${selectedClient.email}`} className="inline-flex items-center gap-1.5 hover:text-slate-900">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedClient.email}
                    </a>
                  )}
                  {selectedClient.nextHearingDate && (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                      <Calendar className="w-3.5 h-3.5" /> Next Hearing: {selectedClient.nextHearingDate}
                    </span>
                  )}
                </div>

                {/* One-Tap Drafting Actions for This Client */}
                <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap gap-2">
                  <button
                    onClick={() => onOpenDrafterForClient(selectedClient, 'Engagement / Retainer Agreement')}
                    className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    Draft Engagement Agreement
                  </button>
                  <button
                    onClick={() => onOpenDrafterForClient(selectedClient, 'Fee Quotation')}
                    className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <IndianRupee className="w-3.5 h-3.5" />
                    Draft Fee Quotation
                  </button>
                  <button
                    onClick={() => onOpenDrafterForClient(selectedClient, 'Vakalatnama')}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    Draft Vakalatnama
                  </button>
                  {getBalanceDue(selectedClient) > 0 && (
                    <button
                      onClick={() => sendWhatsAppFeeReminder(selectedClient)}
                      className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      WhatsApp Fee Reminder
                    </button>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-6">
                {/* What Lawyer is Dealing With */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Matter & Court Particulars (What You Are Dealing With)
                  </h4>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2.5 text-sm">
                    <p className="font-semibold text-slate-900">{selectedClient.matterTitle}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                      <div>
                        <span className="text-slate-500">Forum / Court:</span>{' '}
                        <span className="font-medium">{selectedClient.courtName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Case / FIR / CNR No.:</span>{' '}
                        <span className="font-medium">{selectedClient.caseNumber || 'Yet to be numbered'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Opposite Party:</span>{' '}
                        <span className="font-medium">{selectedClient.opposingParty || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Opposing Counsel:</span>{' '}
                        <span className="font-medium">{selectedClient.opposingCounsel || '—'}</span>
                      </div>
                    </div>
                    {selectedClient.sectionsInvolved && (
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                        <div className="text-xs">
                          <span className="text-slate-500 font-medium">Statutes & Sections Involved: </span>
                          <span className="font-semibold text-slate-900">{selectedClient.sectionsInvolved}</span>
                        </div>
                        {onJumpToSectionSearch && (
                          <button
                            onClick={() => onJumpToSectionSearch(selectedClient.sectionsInvolved || '')}
                            className="text-[11px] font-semibold text-amber-700 hover:underline cursor-pointer"
                          >
                            Look up in Law Corpus →
                          </button>
                        )}
                      </div>
                    )}
                    {selectedClient.notes && (
                      <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
                        <span className="font-semibold text-slate-700">Strategy / Case Notes: </span>
                        {selectedClient.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Fee Quoted vs Paid Ledger */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Fee Account — Quoted vs. Paid & Receipts
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowExpenseModal(true)}
                        className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md cursor-pointer"
                      >
                        + Out-of-Pocket Expense
                      </button>
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded-md cursor-pointer"
                      >
                        + Record Fee Payment
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[11px] text-slate-500 block">Quoted Fee + Clerkage</span>
                      <span className="text-base font-bold text-slate-900">
                        {formatINR(getTotalQuoted(selectedClient))}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                      <span className="text-[11px] text-emerald-700 block">Amount Paid</span>
                      <span className="text-base font-bold text-emerald-800">
                        {formatINR(getTotalPaid(selectedClient))}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <span className="text-[11px] text-amber-700 block">Balance Fee Due</span>
                      <span className="text-base font-bold text-amber-800">
                        {formatINR(getBalanceDue(selectedClient))}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[11px] text-slate-500 block">Client Expenses</span>
                      <span className="text-base font-bold text-slate-800">
                        {formatINR(getReimbursableExpenses(selectedClient))}
                      </span>
                    </div>
                  </div>

                  {selectedClient.payments.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2">No fee payments recorded yet.</p>
                  ) : (
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                          <tr>
                            <th className="py-2 px-3 text-left">Date</th>
                            <th className="py-2 px-3 text-left">Particulars / Mode</th>
                            <th className="py-2 px-3 text-right">Amount</th>
                            <th className="py-2 px-3 text-right">Receipt</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedClient.payments.map((p) => (
                            <tr key={p.id}>
                              <td className="py-2.5 px-3 whitespace-nowrap text-slate-600">{p.date}</td>
                              <td className="py-2.5 px-3">
                                <div className="font-semibold text-slate-800">{p.milestone}</div>
                                <div className="text-[11px] text-slate-500">
                                  {p.mode} {p.reference ? `• ${p.reference}` : ''}
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-right font-bold text-emerald-700 whitespace-nowrap">
                                {formatINR(p.amount)}
                              </td>
                              <td className="py-2.5 px-3 text-right whitespace-nowrap">
                                <button
                                  onClick={() => handlePrintReceipt(selectedClient, p)}
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded cursor-pointer"
                                >
                                  <Receipt className="w-3 h-3" /> PDF
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {selectedClient.expenses.length > 0 && (
                    <div className="mt-2.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-700">Out-of-Pocket Disbursements: </span>
                      {selectedClient.expenses.map((ex) => `${ex.description} (${formatINR(ex.amount)})`).join(' • ')}
                    </div>
                  )}
                </div>

                {/* Case Hearing Diary */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Court Hearing & Proceeding Log
                    </h4>
                    <button
                      onClick={() => setShowHearingModal(true)}
                      className="text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md cursor-pointer"
                    >
                      + Log Hearing / Next Date
                    </button>
                  </div>
                  {selectedClient.hearings.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No hearings logged yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedClient.hearings.map((h) => (
                        <div key={h.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs">
                          <div className="flex justify-between font-semibold text-slate-800">
                            <span>{h.date} — {h.purpose}</span>
                            {h.nextDate && <span className="text-amber-700">Next Date: {h.nextDate}</span>}
                          </div>
                          {h.outcome && <p className="text-slate-600 mt-1">{h.outcome}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Client Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-lg text-slate-900">
                {editingClient ? 'Edit Client & Matter Details' : 'Add New Client & Brief'}
              </h3>
              <button onClick={() => setShowFormModal(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveClient} className="p-5 space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Client Full Name *</label>
                  <input
                    required
                    value={formState.clientName}
                    onChange={(e) => setFormState({ ...formState, clientName: e.target.value })}
                    placeholder="e.g. Shri Rameshwar Prasad"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Father's / Spouse's Name / Director</label>
                  <input
                    value={formState.fatherOrSpouseName}
                    onChange={(e) => setFormState({ ...formState, fatherOrSpouseName: e.target.value })}
                    placeholder="e.g. S/o Shri Mohan Lal"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    required
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="+91 98XXXXXXXX"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email / PAN / GST Ref.</label>
                  <input
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="client@email.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Residential / Registered Address *</label>
                  <input
                    required
                    value={formState.address}
                    onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                    placeholder="Complete postal address for Vakalatnama & Agreement"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3">
                  Matter Particulars (What You Are Dealing With)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Matter / Brief Description *</label>
                    <input
                      required
                      value={formState.matterTitle}
                      onChange={(e) => setFormState({ ...formState, matterTitle: e.target.value })}
                      placeholder="e.g. Anticipatory Bail u/s 482 BNSS in FIR No. 112/2026 PS Vaishali Nagar"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Practice Category</label>
                    <select
                      value={formState.caseType}
                      onChange={(e) => setFormState({ ...formState, caseType: e.target.value as CaseType })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    >
                      {CASE_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Current Proceeding Stage</label>
                    <select
                      value={formState.stage}
                      onChange={(e) => setFormState({ ...formState, stage: e.target.value as CaseStage })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    >
                      {CASE_STAGES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Court / Forum / Tribunal</label>
                    <input
                      value={formState.courtName}
                      onChange={(e) => setFormState({ ...formState, courtName: e.target.value })}
                      placeholder="e.g. High Court / DJ Court / NCLT"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Case / FIR / CNR No.</label>
                    <input
                      value={formState.caseNumber}
                      onChange={(e) => setFormState({ ...formState, caseNumber: e.target.value })}
                      placeholder="e.g. Cr. Misc. Bail No. 502/2026"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Opposite Party</label>
                    <input
                      value={formState.opposingParty}
                      onChange={(e) => setFormState({ ...formState, opposingParty: e.target.value })}
                      placeholder="e.g. State of Rajasthan / Plaintiff"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Next Hearing Date</label>
                    <input
                      type="date"
                      value={formState.nextHearingDate}
                      onChange={(e) => setFormState({ ...formState, nextHearingDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Acts & Sections Involved</label>
                    <input
                      value={formState.sectionsInvolved}
                      onChange={(e) => setFormState({ ...formState, sectionsInvolved: e.target.value })}
                      placeholder="e.g. BNS Sec. 318(4), BNSS Sec. 482"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-3">
                  Fee Quoted & Advance Paid (₹ INR)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Fee Quoted (₹) *</label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={formState.quotedFee}
                      onChange={(e) => setFormState({ ...formState, quotedFee: e.target.value })}
                      placeholder="e.g. 75000"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Clerkage / Filing Quoted (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formState.clerkageAndMiscQuoted}
                      onChange={(e) => setFormState({ ...formState, clerkageAndMiscQuoted: e.target.value })}
                      placeholder="e.g. 5000"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  {!editingClient && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Advance Paid Now (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={formState.initialAdvancePaid}
                        onChange={(e) => setFormState({ ...formState, initialAdvancePaid: e.target.value })}
                        placeholder="e.g. 25000"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Case Strategy / Confidential Notes</label>
                <textarea
                  rows={2}
                  value={formState.notes}
                  onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                  placeholder="Key facts, dates, documents received from client..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold cursor-pointer"
                >
                  {editingClient ? 'Update Client Docket' : 'Save Client & Brief'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && selectedClient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-base text-slate-900">Record Fee Payment — {selectedClient.clientName}</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Current Balance Due: <strong className="text-amber-700">{formatINR(getBalanceDue(selectedClient))}</strong>
            </p>
            <form onSubmit={handleAddPayment} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amount Received (₹) *</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="e.g. 25000"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mode</label>
                  <select
                    value={payMode}
                    onChange={(e) => setPayMode(e.target.value as PaymentRecord['mode'])}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer (NEFT/RTGS/IMPS)">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash</option>
                    <option value="Demand Draft">Demand Draft</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Stage / Milestone Description</label>
                <input
                  value={payMilestone}
                  onChange={(e) => setPayMilestone(e.target.value)}
                  placeholder="e.g. Appearance & Argument Stage Fee"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">UTR / Cheque Reference</label>
                <input
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  placeholder="Optional UTR or Cheque No."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hearing Modal */}
      {showHearingModal && selectedClient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-base text-slate-900">Log Court Proceeding / Next Date</h3>
              <button onClick={() => setShowHearingModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddHearing} className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hearing Date</label>
                  <input
                    type="date"
                    value={hrDate}
                    onChange={(e) => setHrDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Next Hearing Date</label>
                  <input
                    type="date"
                    value={hrNextDate}
                    onChange={(e) => setHrNextDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Stage / Purpose *</label>
                <input
                  required
                  value={hrPurpose}
                  onChange={(e) => setHrPurpose(e.target.value)}
                  placeholder="e.g. Arguments on Interim Relief / Cross-examination of PW-1"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Order / Outcome Summary</label>
                <textarea
                  rows={2}
                  value={hrOutcome}
                  onChange={(e) => setHrOutcome(e.target.value)}
                  placeholder="e.g. Reply filed by State; interim order extended till next date."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowHearingModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold cursor-pointer"
                >
                  Save Hearing Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpenseModal && selectedClient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-base text-slate-900">Record Out-of-Pocket Expense</h3>
              <button onClick={() => setShowExpenseModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expense Description *</label>
                <input
                  required
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="e.g. Court Fee Stamps, Certified Copy, Process Fee"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={expAmt}
                  onChange={(e) => setExpAmt(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold cursor-pointer"
                >
                  Add Disbursement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
