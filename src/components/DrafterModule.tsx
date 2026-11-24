import React, { useEffect, useMemo, useState } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  Save,
  Trash2,
  Scale,
  IndianRupee,
  ShieldCheck,
  MailWarning
} from 'lucide-react';
import { AdvocateProfile, ClientMatter, SavedDocument } from '../types';
import {
  formatINR,
  getBalanceDue,
  getTotalPaid,
  numberToIndianWords,
  printLegalDocument
} from '../utils';

interface DrafterModuleProps {
  clients: ClientMatter[];
  profile: AdvocateProfile;
  savedDocs: SavedDocument[];
  setSavedDocs: React.Dispatch<React.SetStateAction<SavedDocument[]>>;
  preselectedClientId?: string | null;
  preselectedDocType?: SavedDocument['docType'] | null;
}

export const DrafterModule: React.FC<DrafterModuleProps> = ({
  clients,
  profile,
  savedDocs,
  setSavedDocs,
  preselectedClientId,
  preselectedDocType
}) => {
  const [docType, setDocType] = useState<SavedDocument['docType']>(
    preselectedDocType || 'Engagement / Retainer Agreement'
  );
  const [selectedClientId, setSelectedClientId] = useState<string>(
    preselectedClientId || clients[0]?.id || 'custom'
  );

  // Editable parameters synced from selected client
  const [clientName, setClientName] = useState('');
  const [clientRelation, setClientRelation] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [matterTitle, setMatterTitle] = useState('');
  const [courtName, setCourtName] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [opposingParty, setOpposingParty] = useState('');
  const [sectionsInvolved, setSectionsInvolved] = useState('');

  // Fee Breakdown fields
  const [draftingFee, setDraftingFee] = useState(25000);
  const [filingAndAppearanceFee, setFilingAndAppearanceFee] = useState(50000);
  const [perHearingFee, setPerHearingFee] = useState(5000);
  const [clerkageFee, setClerkageFee] = useState(7500);
  const [alreadyPaid, setAlreadyPaid] = useState(0);
  const [validityDays, setValidityDays] = useState(15);
  const [placeOfExecution, setPlaceOfExecution] = useState(
    profile.city.split(',')[0] || 'Jaipur'
  );
  const [executionDate, setExecutionDate] = useState(new Date().toISOString().slice(0, 10));

  // Extra fields for Legal Notice & Sec 63(4) BSA Certificate
  const [noticeDemandAmount, setNoticeDemandAmount] = useState(500000);
  const [noticePeriodDays, setNoticePeriodDays] = useState(15);
  const [noticeFacts, setNoticeFacts] = useState(
    'That towards discharge of legally enforceable liability, the addressee issued cheque(s) / committed breach of obligation, which upon presentation returned unpaid / remained unfulfilled despite repeated requests.'
  );
  const [deviceDescription, setDeviceDescription] = useState(
    'Apple iPhone 15 / Dell Latitude Laptop (Windows 11) regularly used in ordinary course of activities'
  );
  const [electronicRecordDesc, setElectronicRecordDesc] = useState(
    'WhatsApp Chat Export PDF, Voice Notes & Email Trail dated between Jan 2026 and Oct 2026'
  );
  const [sha256Hash, setSha256Hash] = useState(
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  );

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (preselectedDocType) setDocType(preselectedDocType);
  }, [preselectedDocType]);

  useEffect(() => {
    if (preselectedClientId) setSelectedClientId(preselectedClientId);
  }, [preselectedClientId]);

  useEffect(() => {
    const cli = clients.find((c) => c.id === selectedClientId);
    if (cli) {
      setClientName(cli.clientName);
      setClientRelation(cli.fatherOrSpouseName || '');
      setClientAddress(cli.address);
      setClientPhone(cli.phone);
      setMatterTitle(cli.matterTitle);
      setCourtName(cli.courtName);
      setCaseNumber(cli.caseNumber || '');
      setOpposingParty(cli.opposingParty || '');
      setSectionsInvolved(cli.sectionsInvolved || '');

      const totalProf = Number(cli.quotedFee || 0);
      const draftPart = Math.round(totalProf * 0.35);
      const appearPart = totalProf - draftPart;
      setDraftingFee(draftPart);
      setFilingAndAppearanceFee(appearPart);
      setClerkageFee(Number(cli.clerkageAndMiscQuoted || 0));
      setAlreadyPaid(getTotalPaid(cli));
    }
  }, [selectedClientId, clients]);

  const totalQuotedFee = Number(draftingFee || 0) + Number(filingAndAppearanceFee || 0) + Number(clerkageFee || 0);
  const netBalancePayable = Math.max(0, totalQuotedFee - Number(alreadyPaid || 0));
  const docSerial = useMemo(
    () => `ND/${new Date().getFullYear()}/${String(savedDocs.length + 101)}`,
    [savedDocs.length]
  );

  // Build professional HTML document based on selected template
  const generatedHtml = useMemo(() => {
    const headerBlock = `
      <div class="header-box">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;">
          <div>
            <h2 style="margin:0;font-size:15pt;letter-spacing:0.3px;">${profile.chamberName}</h2>
            <p style="margin:3px 0 0 0;font-size:10pt;color:#334155;">
              <strong>${profile.advocateName}</strong>, Advocate (Bar Council Enrl. No.: ${profile.enrollmentNo})<br/>
              ${profile.address}, ${profile.city}<br/>
              Mob: ${profile.phone} | Email: ${profile.email} ${profile.panNo ? `| PAN: ${profile.panNo}` : ''}
            </p>
          </div>
          <div style="text-align:right;font-size:9.5pt;color:#475569;">
            <strong>Ref No.:</strong> ${docSerial}<br/>
            <strong>Date:</strong> ${executionDate}
          </div>
        </div>
      </div>
    `;

    if (docType === 'Fee Quotation') {
      return `
        ${headerBlock}
        <h2 style="text-align:center;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:14px;">
          MEMORANDUM OF PROFESSIONAL FEE QUOTATION
        </h2>
        <p>
          <strong>To,</strong><br/>
          <strong>${clientName || '[Client Name]'}</strong> ${clientRelation ? `(${clientRelation})` : ''}<br/>
          ${clientAddress || '[Client Address]'}<br/>
          Phone: ${clientPhone || '[Phone]'}
        </p>
        <p>
          <strong>Subject:</strong> Quotation of Professional Legal Fees &amp; Schedule of Engagement for <em>"${matterTitle || '[Brief / Matter Description]'}"</em> before <strong>${courtName || '[Court / Forum]'}</strong> ${caseNumber ? `(${caseNumber})` : ''}.
        </p>
        <p>Dear Client,</p>
        <p>
          Pursuant to our consultation and perusal of the instructions/records shared by you concerning the captioned legal matter ${sectionsInvolved ? `involving <strong>${sectionsInvolved}</strong>` : ''}, pleased to set forth below our professional fee proposal and scope of legal representation:
        </p>

        <h3>1. Scope of Professional Services</h3>
        <ul>
          <li>Detailed legal scrutiny of documents, case papers, statutory compliances, and applicable Supreme Court / High Court precedents.</li>
          <li>Drafting, vetting, and settling of principal pleadings / petition / reply / application and ancillary affidavits before <strong>${courtName || 'the Competent Forum'}</strong>.</li>
          <li>Filing, scrutiny clearance, and appearances at admission, interim relief, and substantive arguments up to disposal before the said Forum.</li>
        </ul>

        <h3>2. Schedule of Professional Fees (INR)</h3>
        <table>
          <thead>
            <tr>
              <th style="width:8%;">S.No.</th>
              <th style="width:62%;">Stage / Particulars of Professional Work</th>
              <th style="width:30%;text-align:right;">Fee Quoted (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1.</td>
              <td>Conference, Record Perusal, Legal Research &amp; Principal Drafting / Settling of Pleadings</td>
              <td style="text-align:right;">${formatINR(draftingFee)}</td>
            </tr>
            <tr>
              <td>2.</td>
              <td>Filing, Admission, Interim Relief Arguments &amp; Substantive Representation before ${courtName || 'Court'}</td>
              <td style="text-align:right;">${formatINR(filingAndAppearanceFee)}</td>
            </tr>
            <tr>
              <td>3.</td>
              <td>Clerkage, Typing, Scanning, Indexing &amp; Miscellaneous Chamber Charges (Consolidated)</td>
              <td style="text-align:right;">${formatINR(clerkageFee)}</td>
            </tr>
            <tr style="background:#f8fafc;font-weight:bold;">
              <td colspan="2">TOTAL CONSOLIDATED FEE QUOTED</td>
              <td style="text-align:right;">${formatINR(totalQuotedFee)}</td>
            </tr>
            <tr>
              <td colspan="2"><em>Less: Advance / Retainer Fee Already Received</em></td>
              <td style="text-align:right;color:#047857;">(-) ${formatINR(alreadyPaid)}</td>
            </tr>
            <tr style="background:#fffbeb;font-weight:bold;">
              <td colspan="2">NET BALANCE PAYABLE (${numberToIndianWords(netBalancePayable)})</td>
              <td style="text-align:right;">${formatINR(netBalancePayable)}</td>
            </tr>
          </tbody>
        </table>
        ${perHearingFee > 0 ? `<p style="font-size:10pt;"><strong>Note on Effective / Outstation Hearings:</strong> Beyond standard package appearances or in case of contested trial evidence exceeding 8 dates, additional effective hearing appearance fee shall be <strong>${formatINR(perHearingFee)}</strong> per effective hearing.</p>` : ''}

        <h3>3. Payment Milestones &amp; Out-of-Pocket Disbursements</h3>
        <ol>
          <li><strong>50%</strong> payable as Retainer Advance upon signing of Vakalatnama / instruction to draft; <strong>25%</strong> upon filing / issuance of notice; and remaining <strong>25%</strong> prior to final arguments.</li>
          <li>Statutory Court Fees, Stamp Duty, Welfare Stamps, Certified Copy fees, Process fees, Notarisation, and Senior Counsel fees (if engaged with Client's prior consent) shall be borne separately on actuals by the Client.</li>
          <li>In accordance with Rule 20, Part VI, Chapter II, Section II of the <strong>Bar Council of India Rules</strong>, fees are strictly non-contingent and are not linked to the outcome of litigation.</li>
          <li>This quotation remains valid for <strong>${validityDays} days</strong> from the date hereof.</li>
        </ol>

        <p style="font-size:10pt;background:#f8fafc;padding:10px;border:1px solid #cbd5e1;">
          <strong>Remittance Details:</strong><br/>
          Account Holder: <strong>${profile.accountHolder || profile.advocateName}</strong> | Bank: <strong>${profile.bankName || '—'}</strong><br/>
          A/c No.: <strong>${profile.accountNo || '—'}</strong> | IFSC: <strong>${profile.ifscCode || '—'}</strong> ${profile.upiId ? `| UPI ID: <strong>${profile.upiId}</strong>` : ''}
        </p>

        <div class="sig-grid">
          <div class="sig-box">
            <strong>Accepted &amp; Confirmed By Client:</strong><br/><br/>
            ${clientName || '[Client Signature]'}<br/>
            Date: _______________
          </div>
          <div class="sig-box" style="text-align:right;">
            <strong>For ${profile.chamberName}</strong><br/><br/>
            <strong>${profile.advocateName}</strong><br/>
            Advocate (${profile.enrollmentNo})
          </div>
        </div>
      `;
    }

    if (docType === 'Engagement / Retainer Agreement') {
      return `
        ${headerBlock}
        <h2 style="text-align:center;text-transform:uppercase;letter-spacing:0.5px;">
          LEGAL ENGAGEMENT &amp; FEE RETAINER AGREEMENT
        </h2>
        <p>
          This <strong>Legal Engagement &amp; Fee Retainer Agreement</strong> ("Agreement") is made and executed at <strong>${placeOfExecution}</strong> on this <strong>${executionDate}</strong>, BY AND BETWEEN:
        </p>
        <p>
          <strong>1. ${clientName || '[Client Name]'}</strong> ${clientRelation ? `(${clientRelation})` : ''}, residing / having office at <strong>${clientAddress || '[Client Address]'}</strong>, Contact: ${clientPhone || '[Phone]'} (hereinafter referred to as the <strong>"CLIENT"</strong>, which expression shall unless repugnant to the context include his/her/its heirs, executors, successors, and permitted assigns) of the <strong>FIRST PART</strong>;
        </p>
        <p style="text-align:center;font-weight:bold;">AND</p>
        <p>
          <strong>2. ${profile.advocateName}</strong>, Advocate (Enrolled with the Bar Council vide Enrl. No. <strong>${profile.enrollmentNo}</strong>), practising under the name and style of <strong>${profile.chamberName}</strong> at ${profile.address}, ${profile.city} (hereinafter referred to as the <strong>"ADVOCATE / COUNSEL"</strong>) of the <strong>SECOND PART</strong>.
        </p>

        <h3>WHEREAS:</h3>
        <ol type="A">
          <li>The Client has approached the Advocate seeking professional legal representation, drafting, and advocacy concerning: <strong>${matterTitle || '[Matter Description]'}</strong> before <strong>${courtName || '[Court / Tribunal]'}</strong> ${caseNumber ? `(Ref: ${caseNumber})` : ''} ${opposingParty ? `against ${opposingParty}` : ''} ${sectionsInvolved ? `involving ${sectionsInvolved}` : ''} ("the Matter").</li>
          <li>The Advocate has agreed to accept the brief and represent the Client strictly in accordance with the <strong>Advocates Act, 1961</strong> and the <strong>Bar Council of India Rules</strong> on the terms and fee schedule recorded herein.</li>
        </ol>

        <h3>NOW THIS AGREEMENT WITNESSETH AS UNDER:</h3>
        <p><strong>1. Scope of Engagement:</strong> The Advocate shall advise the Client, draft and settle requisite pleadings/petitions/replies, and appear before <strong>${courtName || 'the Forum'}</strong> up to the disposal of the captioned proceeding before the said Forum. Appeals, revisions, review petitions, execution proceedings, or proceedings before any other forum shall constitute a separate engagement unless mutually agreed in writing.</p>

        <p><strong>2. Agreed Professional Fees &amp; Acknowledgement of Payment:</strong></p>
        <table>
          <tr><th>Total Agreed Professional Fee (including Clerkage)</th><td><strong>${formatINR(totalQuotedFee)}</strong> (<em>${numberToIndianWords(totalQuotedFee)}</em>)</td></tr>
          <tr><th>Advance / Amount Paid Paid Up-to-Date</th><td><strong>${formatINR(alreadyPaid)}</strong></td></tr>
          <tr><th>Balance Professional Fee Payable</th><td><strong>${formatINR(netBalancePayable)}</strong> (<em>${numberToIndianWords(netBalancePayable)}</em>)</td></tr>
        </table>
        <p>The Client undertakes to clear the balance professional fee punctually as per the agreed stage milestones and in any event prior to the stage of final arguments. Professional fees paid upon commencement of drafting/work are non-refundable.</p>

        <p><strong>3. Out-of-Pocket Expenses:</strong> All statutory court fees, stamp duty, e-filing charges, certified copy expenses, process fees, travel/lodging outside ${placeOfExecution}, and fees of Senior Advocate (if briefed with Client's consent) shall be paid directly or reimbursed on actuals by the Client.</p>

        <p><strong>4. Client's Representations &amp; True Disclosure:</strong> The Client warrants that all facts, instructions, documents, and electronic records supplied to the Advocate are true, genuine, and complete, and that no material fact or prior litigation order has been suppressed. The Advocate relies solely upon instructions verified by the Client.</p>

        <p><strong>5. Non-Contingency &amp; No Guarantee of Judicial Outcome (BCI Compliance):</strong> In strict compliance with Rule 20 of the Bar Council of India Standards of Professional Conduct and Etiquette, the Advocate's fee is strictly fixed for professional labour and is <strong>not</strong> contingent upon the success or outcome of the litigation. While the Advocate shall exercise best professional diligence, no guarantee or warranty of a particular judicial order is or can be given.</p>

        <p><strong>6. Confidentiality &amp; Privileged Communication:</strong> All communications and documents shared by the Client are protected by Advocate–Client privilege under <strong>Section 132 of the Bharatiya Sakshya Adhiniyam, 2023</strong> (erstwhile Section 126 of the Indian Evidence Act, 1872).</p>

        <p><strong>7. Withdrawal / Discharge of Brief:</strong> The Client may discharge the Advocate at any stage upon full settlement of all accrued professional fees and disbursements. Conversely, the Advocate reserves the right to seek discharge from the Hon'ble Court with reasonable notice in the event of non-cooperation, suppression of material facts, or non-payment of agreed fees.</p>

        <p><strong>8. Dispute Resolution &amp; Governing Law:</strong> This Agreement shall be governed by the laws of India, with exclusive jurisdiction vested in the Courts at <strong>${placeOfExecution}</strong>.</p>

        <p>IN WITNESS WHEREOF, the Parties hereto have set their respective hands on the date and place first above written.</p>

        <div class="sig-grid">
          <div class="sig-box">
            <strong>SIGNED BY THE CLIENT:</strong><br/><br/><br/>
            <strong>${clientName || '[Client Name]'}</strong><br/>
            Witness 1: ______________________
          </div>
          <div class="sig-box" style="text-align:right;">
            <strong>SIGNED BY THE ADVOCATE:</strong><br/><br/><br/>
            <strong>${profile.advocateName}</strong><br/>
            Enrl. No.: ${profile.enrollmentNo}<br/>
            Witness 2: ______________________
          </div>
        </div>
      `;
    }

    if (docType === 'Vakalatnama') {
      return `
        <h2 style="text-align:center;text-transform:uppercase;margin-bottom:4px;">
          IN THE COURT OF ${courtName ? courtName.toUpperCase() : '____________________________'}
        </h2>
        <p style="text-align:center;margin-top:0;">
          <strong>Case / Petition / FIR No.:</strong> ${caseNumber || '_____________ of 2026'}<br/>
          <em>(${sectionsInvolved || 'Under Applicable Provisions of Law'})</em>
        </p>
        <table>
          <tr>
            <td style="width:45%;"><strong>${clientName || '____________________'}</strong><br/><span style="font-size:9.5pt;">${clientRelation || ''}</span></td>
            <td style="width:10%;text-align:center;vertical-align:middle;"><strong>VERSUS</strong></td>
            <td style="width:45%;"><strong>${opposingParty || 'State / Respondent / Defendant'}</strong></td>
          </tr>
        </table>
        <h2 style="text-align:center;text-decoration:underline;letter-spacing:1px;">VAKALATNAMA</h2>
        <p>
          KNOW ALL to whom these presents shall come that I/We, <strong>${clientName || '____________________'}</strong> ${clientRelation ? `(${clientRelation})` : ''}, R/o <strong>${clientAddress || '____________________'}</strong>, the undersigned, do herebyiyon appoint, retain, and authorise:
        </p>
        <p style="text-align:center;background:#f8fafc;border:1px solid #cbd5e1;padding:10px;">
          <strong>${profile.advocateName}, Advocate (Enrl. No. ${profile.enrollmentNo})</strong><br/>
          ${profile.chamberName}, ${profile.address}, ${profile.city} | Mob: ${profile.phone}
        </p>
        <p>
          to be my/our Advocate(s) in the above-noted cause/matter and for me/us and on my/our behalf to appear, act, plead, file petitions, plaints, written statements, replies, rejoinders, affidavits, applications, or documents; to withdraw or compromise the matter upon express instructions; to deposit or withdraw moneys, documents, or certified copies; to refer disputes to mediation/arbitration; to engage or instruct another counsel if necessary; and generally to do all lawful acts, deeds, and things necessary for the proper conduct of the said case at all stages including appellate/execution stages if instructed.
        </p>
        <p>
          AND I/We hereby agree to ratify and confirm all lawful acts done by my/our said Advocate(s) as if done by me/us personally, and undertake that I/We or my/our duly authorised agent shall attend the Hon'ble Court whenever required and pay the agreed fee and expenses.
        </p>
        <p>
          IN WITNESS WHEREOF I/We have signed this Vakalatnama at <strong>${placeOfExecution}</strong> on this <strong>${executionDate}</strong>.
        </p>
        <div class="sig-grid">
          <div class="sig-box">
            <strong>Identified &amp; Accepted By:</strong><br/><br/><br/>
            <strong>${profile.advocateName}</strong><br/>
            Advocate (${profile.enrollmentNo})<br/>
            <em>"Satisfied with identity of executant"</em>
          </div>
          <div class="sig-box" style="text-align:right;">
            <strong>Signature / Thumb Impression of Executant (Client):</strong><br/><br/><br/>
            <strong>${clientName || '____________________'}</strong><br/>
            Mob: ${clientPhone || '____________'}
          </div>
        </div>
      `;
    }

    if (docType === 'Legal Notice') {
      return `
        ${headerBlock}
        <p style="text-align:center;font-weight:bold;text-decoration:underline;">
          REGISTERED A.D. / SPEED POST / WHATSAPP / EMAIL<br/>
          STATUTORY LEGAL NOTICE
        </p>
        <p>
          <strong>To,</strong><br/>
          <strong>${opposingParty || '[Name & Address of Addressee / Opposite Party]'}</strong>
        </p>
        <p>
          <strong>Subject:</strong> Legal Notice on behalf of <strong>${clientName || '[Client Name]'}</strong> concerning <em>${matterTitle || '[Subject Matter]'}</em> ${sectionsInvolved ? `(under ${sectionsInvolved})` : ''}.
        </p>
        <p>Sir / Madam,</p>
        <p>
          Under instructions from and on behalf of my client, <strong>${clientName || '[Client Name]'}</strong> ${clientRelation ? `(${clientRelation})` : ''}, R/o ${clientAddress || '[Address]'}, I do hereby serve upon you the following formal Legal Notice:
        </p>
        <ol>
          <li>That my client is a law-abiding citizen / entity carrying on lawful affairs at the address stated hereinabove.</li>
          <li>${noticeFacts}</li>
          <li>That despite repeated reminders and requests by my client, you have wilfully neglected and failed to discharge your lawful liability amounting to <strong>${formatINR(noticeDemandAmount)}</strong> (<em>${numberToIndianWords(noticeDemandAmount)}</em>) along with applicable statutory interest.</li>
          <li>That your aforesaid conduct attracts civil as well as penal consequences under <strong>${sectionsInvolved || 'applicable Indian statutes including BNS, 2023 / Negotiable Instruments Act, 1881 / Contract Act, 1872'}</strong>.</li>
        </ol>
        <p>
          <strong>WHEREFORE</strong>, I hereby call upon you through this Legal Notice to pay/comply with the demand of <strong>${formatINR(noticeDemandAmount)}</strong> together with ₹11,000/- towards the cost of this Legal Notice within <strong>${noticePeriodDays} days</strong> from the date of receipt of this Notice, failing which my client has given me peremptory instructions to initiate appropriate civil and criminal proceedings against you before the competent Court at <strong>${placeOfExecution}</strong> entirely at your risk, cost, and consequences.
        </p>
        <p><em>A copy of this Legal Notice is retained in my chamber for production before the Hon'ble Court.</em></p>
        <div class="sig-grid">
          <div class="sig-box">Counter-signed by Client (Instruction Verified)</div>
          <div class="sig-box" style="text-align:right;">
            <strong>${profile.advocateName}</strong><br/>
            Advocate (${profile.enrollmentNo})
          </div>
        </div>
      `;
    }

    // Sec. 63(4) BSA Electronic Evidence Certificate
    return `
      <h2 style="text-align:center;text-transform:uppercase;margin-bottom:4px;">
        IN THE COURT OF ${courtName ? courtName.toUpperCase() : '____________________________'}
      </h2>
      <p style="text-align:center;margin-top:0;">
        <strong>Case No.:</strong> ${caseNumber || '_____________ of 2026'} | <strong>${clientName || 'Petitioner/Complainant'} v. ${opposingParty || 'Respondent'}</strong>
      </p>
      <h3 style="text-align:center;text-decoration:underline;">
        CERTIFICATE UNDER SECTION 63(4)(c) OF THE BHARATIYA SAKSHYA ADHINIYAM, 2023<br/>
        <span style="font-size:10pt;font-weight:normal;">(As per THE SCHEDULE to BSA, 2023 — Admissibility of Electronic Records)</span>
      </h3>
      <h4>PART A —(To be filled by the Party / Custodian)</h4>
      <p>
        I, <strong>${clientName || '____________________'}</strong> ${clientRelation ? `(${clientRelation})` : ''}, R/o <strong>${clientAddress || '____________________'}</strong>, do hereby solemnly affirm and state as follows:
      </p>
      <ol>
        <li>I have produced the electronic record / output titled: <strong>${electronicRecordDesc}</strong>.</li>
        <li>The said electronic record was produced by/from the computer/communication device: <strong>${deviceDescription}</strong>, owned/operated/lawful control of the deponent in the ordinary course of activities.</li>
        <li>During the said period, the computer/communication device was operating properly without any material malfunction affecting the accuracy of the electronic record or its contents, and nothing has been tampered with or altered.</li>
        <li>Cryptographic Hash Value (SHA-256) of the electronic file(s): <code style="font-size:9.5pt;word-break:break-all;">${sha256Hash}</code></li>
      </ol>
      <p>I state that the above particulars are true and correct to the best of my knowledge and belief.</p>
      <div class="sig-grid" style="margin-top:28px;">
        <div class="sig-box">Date: ${executionDate}<br/>Place: ${placeOfExecution}</div>
        <div class="sig-box" style="text-align:right;"><strong>Signature of Party (${clientName || 'Deponent'})</strong></div>
      </div>
      <hr style="margin:24px 0;border:0;border-top:1px dashed #94a3b8;"/>
      <h4>PART B — (To be filled by the Expert / Examiner, where applicable under Schedule)</h4>
      <p style="font-size:10pt;">
        I, ________________________, working as ________________________, certify that the specified electronic output bearing SHA-256 Hash <code>${sha256Hash}</code> has been verified from the source media/device in accordance with Section 63(4) of the Bharatiya Sakshya Adhiniyam, 2023.
      </p>
    `;
  }, [
    docType,
    profile,
    docSerial,
    executionDate,
    clientName,
    clientRelation,
    clientAddress,
    clientPhone,
    matterTitle,
    courtName,
    caseNumber,
    opposingParty,
    sectionsInvolved,
    draftingFee,
    filingAndAppearanceFee,
    perHearingFee,
    clerkageFee,
    totalQuotedFee,
    alreadyPaid,
    netBalancePayable,
    validityDays,
    placeOfExecution,
    noticeDemandAmount,
    noticePeriodDays,
    noticeFacts,
    deviceDescription,
    electronicRecordDesc,
    sha256Hash
  ]);

  const handleSaveToVault = () => {
    const newDoc: SavedDocument = {
      id: `doc-${Date.now()}`,
      clientId: selectedClientId !== 'custom' ? selectedClientId : undefined,
      clientName: clientName || 'Custom Client',
      docType,
      title: `${docType} — ${clientName || 'Client'}`,
      docNumber: docSerial,
      createdAt: executionDate,
      contentHtml: generatedHtml
    };
    setSavedDocs((prev) => [newDoc, ...prev]);
  };

  const handleCopyPlainText = () => {
    const temp = document.createElement('div');
    temp.innerHTML = generatedHtml;
    navigator.clipboard.writeText(temp.innerText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const DOC_TABS: Array<{ type: SavedDocument['docType']; label: string; icon: React.ReactNode }> = [
    { type: 'Engagement / Retainer Agreement', label: 'Client–Lawyer Agreement', icon: <ShieldCheck className="w-4 h-4" /> },
    { type: 'Fee Quotation', label: 'Fee Quotation', icon: <IndianRupee className="w-4 h-4" /> },
    { type: 'Vakalatnama', label: 'Vakalatnama', icon: <Scale className="w-4 h-4" /> },
    { type: 'Legal Notice', label: 'Legal Notice', icon: <MailWarning className="w-4 h-4" /> },
    {
      type: 'Sec. 63(4) BSA Electronic Evidence Certificate',
      label: 'Sec. 63(4) BSA Certificate',
      icon: <FileText className="w-4 h-4" />
    }
  ];

  return (
    <div className="space-y-5">
      {/* Document Template Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-wrap gap-2">
        {DOC_TABS.map((t) => (
          <button
            key={t.type}
            onClick={() => setDocType(t.type)}
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              docType === t.type
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Form Inputs */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Auto-Fill from Existing Client
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-medium bg-slate-50"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.clientName} — {c.matterTitle.slice(0, 42)}...
                </option>
              ))}
              <option value="custom">+ Enter Custom / Walk-in Client Details</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Client Name</label>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">S/o, D/o, W/o / Director</label>
              <input
                value={clientRelation}
                onChange={(e) => setClientRelation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
              <input
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Client Address</label>
              <input
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Matter / Brief Description</label>
              <input
                value={matterTitle}
                onChange={(e) => setMatterTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Court / Forum</label>
              <input
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Case / Petition No.</label>
              <input
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Opposite Party</label>
              <input
                value={opposingParty}
                onChange={(e) => setOpposingParty(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Place & Date</label>
              <div className="flex gap-1.5">
                <input
                  value={placeOfExecution}
                  onChange={(e) => setPlaceOfExecution(e.target.value)}
                  className="w-1/2 px-2.5 py-2 rounded-lg border border-slate-300 text-xs"
                />
                <input
                  type="date"
                  value={executionDate}
                  onChange={(e) => setExecutionDate(e.target.value)}
                  className="w-1/2 px-2 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>

          {(docType === 'Fee Quotation' || docType === 'Engagement / Retainer Agreement') && (
            <div className="pt-3 border-t border-slate-200 space-y-3 text-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Fee Structure Breakdown (₹ INR)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Drafting & Research (₹)</label>
                  <input
                    type="number"
                    value={draftingFee}
                    onChange={(e) => setDraftingFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Filing & Appearance (₹)</label>
                  <input
                    type="number"
                    value={filingAndAppearanceFee}
                    onChange={(e) => setFilingAndAppearanceFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Clerkage & Misc. (₹)</label>
                  <input
                    type="number"
                    value={clerkageFee}
                    onChange={(e) => setClerkageFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Already Paid by Client (₹)</label>
                  <input
                    type="number"
                    value={alreadyPaid}
                    onChange={(e) => setAlreadyPaid(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>
              {docType === 'Fee Quotation' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Per Effective Hearing (₹)</label>
                    <input
                      type="number"
                      value={perHearingFee}
                      onChange={(e) => setPerHearingFee(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Quotation Validity (Days)</label>
                    <input
                      type="number"
                      value={validityDays}
                      onChange={(e) => setValidityDays(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {docType === 'Legal Notice' && (
            <div className="pt-3 border-t border-slate-200 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Claim / Demand Amount (₹)</label>
                  <input
                    type="number"
                    value={noticeDemandAmount}
                    onChange={(e) => setNoticeDemandAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Compliance Period (Days)</label>
                  <input
                    type="number"
                    value={noticePeriodDays}
                    onChange={(e) => setNoticePeriodDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Brief Facts of Cause of Action</label>
                <textarea
                  rows={3}
                  value={noticeFacts}
                  onChange={(e) => setNoticeFacts(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>
          )}

          {docType === 'Sec. 63(4) BSA Electronic Evidence Certificate' && (
            <div className="pt-3 border-t border-slate-200 space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Electronic Record Description</label>
                <input
                  value={electronicRecordDesc}
                  onChange={(e) => setElectronicRecordDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Source Device Make & Model</label>
                <input
                  value={deviceDescription}
                  onChange={(e) => setDeviceDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">SHA-256 Hash Value</label>
                <input
                  value={sha256Hash}
                  onChange={(e) => setSha256Hash(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Legal Document Preview + Export Bar */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold">Live Legal Draft Preview</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopyPlainText}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
                <button
                  onClick={handleSaveToVault}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" />
                  Save to Vault
                </button>
                <button
                  onClick={() =>
                    printLegalDocument(`${docType.replace(/\s+/g, '_')}_${clientName || 'Draft'}`, generatedHtml)
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
              </div>
            </div>

            {/* Rendered Legal Paper */}
            <div className="p-6 sm:p-8 bg-slate-100 max-h-[700px] overflow-y-auto">
              <div
                className="bg-white shadow-md border border-slate-200 p-6 sm:p-10 mx-auto max-w-3xl text-slate-900 prose prose-slate max-w-none"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '13.5px', lineHeight: 1.65 }}
                dangerouslySetInnerHTML={{ __html: generatedHtml }}
              />
            </div>
          </div>

          {/* Saved Drafts Vault */}
          {savedDocs.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Saved Drafts Vault ({savedDocs.length})
              </h4>
              <div className="divide-y divide-slate-100">
                {savedDocs.map((d) => (
                  <div key={d.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-slate-900">{d.title}</span>
                      <span className="text-slate-500 ml-2">({d.docNumber} • {d.createdAt})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => printLegalDocument(d.title, d.contentHtml)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 font-semibold text-slate-800 cursor-pointer"
                      >
                        Open PDF
                      </button>
                      <button
                        onClick={() => setSavedDocs((prev) => prev.filter((x) => x.id !== d.id))}
                        className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
