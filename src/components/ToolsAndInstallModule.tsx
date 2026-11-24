import React, { useMemo, useState } from 'react';
import {
  Calculator,
  Clock,
  IndianRupee,
  Scale,
  Smartphone,
  Download,
  Upload,
  UserCheck,
  CheckCircle2,
  Share
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { AdvocateProfile, ClientMatter, SavedDocument } from '../types';
import { formatINR } from '../utils';

interface ToolsAndInstallModuleProps {
  profile: AdvocateProfile;
  setProfile: React.Dispatch<React.SetStateAction<AdvocateProfile>>;
  clients: ClientMatter[];
  setClients: React.Dispatch<React.SetStateAction<ClientMatter[]>>;
  savedDocs: SavedDocument[];
  setSavedDocs: React.Dispatch<React.SetStateAction<SavedDocument[]>>;
  deferredInstallPrompt: any;
  onTriggerInstall: () => void;
}

const LIMITATION_SCHEDULES = [
  { label: 'Suit for Recovery of Money / Contract Breach / Goods Sold', days: 1095, periodLabel: '3 Years (Art. 14 / 19 / 55 Limitation Act)' },
  { label: 'Suit for Specific Performance of Contract', days: 1095, periodLabel: '3 Years from date fixed or refusal noticed (Art. 54)' },
  { label: 'Suit for Possession of Immovable Property (Based on Title)', days: 4380, periodLabel: '12 Years (Art. 65 Limitation Act)' },
  { label: 'Sec. 138 NI Act — Statutory Demand Notice from Cheque Return Memo', days: 30, periodLabel: '30 Days from receipt of Bank Return Memo [S. 138(b)]' },
  { label: 'Sec. 138 NI Act — Filing Criminal Complaint after 15-day Notice Expiry', days: 30, periodLabel: '1 Month (30 Days) from expiry of 15-day notice period [S. 142(1)(b)]' },
  { label: 'First Appeal to High Court from Civil Decree', days: 90, periodLabel: '90 Days from date of decree (Art. 116(a))' },
  { label: 'First Appeal to District Judge from Civil Decree', days: 30, periodLabel: '30 Days from date of decree (Art. 116(b))' },
  { label: 'Special Leave Petition (SLP) before Supreme Court (Art. 136)', days: 90, periodLabel: '90 Days from High Court judgment (60 days if HC refuses fitness certificate)' },
  { label: 'Arbitration Sec. 34 — Application to Set Aside Award', days: 90, periodLabel: '3 Months (+ max 30 condonable days strictly; S. 5 LA barred)' },
  { label: 'Consumer Complaint under Consumer Protection Act, 2019 (Sec. 69)', days: 730, periodLabel: '2 Years from date on which cause of action arises' },
  { label: 'Written Statement in Commercial Suit (Order VIII Rule 1 CPC)', days: 30, periodLabel: '30 Days (extendable strictly up to max 120 days — SCG Contracts)' },
  { label: 'Criminal Revision Petition before High Court / Sessions Court', days: 90, periodLabel: '90 Days from date of impugned order (Art. 131)' }
];

export const ToolsAndInstallModule: React.FC<ToolsAndInstallModuleProps> = ({
  profile,
  setProfile,
  clients,
  setClients,
  savedDocs,
  setSavedDocs,
  deferredInstallPrompt,
  onTriggerInstall
}) => {
  const [activeTool, setActiveTool] = useState<
    'limitation' | 'interest' | 'court_fee' | 'chamber_profile' | 'mobile_install'
  >('limitation');

  // 1. Limitation Calculator State
  const [limIdx, setLimIdx] = useState(0);
  const [triggerDate, setTriggerDate] = useState(new Date().toISOString().slice(0, 10));
  const [copyingDays, setCopyingDays] = useState(0); // Sec. 12 Limitation Act exclusion of certified copy days

  const limitationResult = useMemo(() => {
    const item = LIMITATION_SCHEDULES[limIdx];
    const d = new Date(triggerDate);
    if (isNaN(d.getTime())) return null;
    // Exclude day of reckoning (S. 12(1)) + add copying days (S. 12(2))
    const deadline = new Date(d);
    deadline.setDate(deadline.getDate() + item.days + Number(copyingDays || 0));
    const today = new Date();
    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return {
      deadlineStr: deadline.toISOString().slice(0, 10),
      diffDays,
      periodLabel: item.periodLabel
    };
  }, [limIdx, triggerDate, copyingDays]);

  // 2. Legal / Award / Section 34 CPC Interest Calculator
  const [principal, setPrincipal] = useState(1000000);
  const [ratePct, setRatePct] = useState(12);
  const [intFrom, setIntFrom] = useState('2024-04-01');
  const [intTo, setIntTo] = useState(new Date().toISOString().slice(0, 10));

  const interestResult = useMemo(() => {
    const d1 = new Date(intFrom);
    const d2 = new Date(intTo);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime()) || d2 < d1) return null;
    const days = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    const years = days / 365;
    const simpleInterest = Math.round((Number(principal) * Number(ratePct) * years) / 100);
    return {
      days,
      years: years.toFixed(2),
      simpleInterest,
      totalClaim: Number(principal) + simpleInterest
    };
  }, [principal, ratePct, intFrom, intTo]);

  // 3. Ad-Valorem Suit Valuation & Court Fee Estimator
  const [suitValuation, setSuitValuation] = useState(1500000);
  const [feeSlabRate, setFeeSlabRate] = useState(5.5); // Typical average ad-valorem % (adjustable per State Court Fees Act)
  const estimatedCourtFee = Math.round((Number(suitValuation || 0) * Number(feeSlabRate || 0)) / 100);

  // Chamber Profile save banner
  const [profileSaved, setProfileSaved] = useState(false);

  // Backup / Restore JSON
  const handleExportBackup = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      app: 'NyayaDesk',
      profile,
      clients,
      savedDocs
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NyayaDesk_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed.profile) setProfile(parsed.profile);
        if (Array.isArray(parsed.clients)) setClients(parsed.clients);
        if (Array.isArray(parsed.savedDocs)) setSavedDocs(parsed.savedDocs);
        alert('Chamber backup restored successfully!');
      } catch {
        alert('Invalid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';

  return (
    <div className="space-y-5">
      {/* Sub-navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTool('limitation')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
            activeTool === 'limitation' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" /> Limitation &amp; Sec. 138 Calculator
        </button>
        <button
          onClick={() => setActiveTool('interest')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
            activeTool === 'interest' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Calculator className="w-4 h-4" /> Sec. 34 CPC / Claim Interest
        </button>
        <button
          onClick={() => setActiveTool('court_fee')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
            activeTool === 'court_fee' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Scale className="w-4 h-4" /> Ad-Valorem Court Fee Estimator
        </button>
        <button
          onClick={() => setActiveTool('chamber_profile')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
            activeTool === 'chamber_profile' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Advocate Chamber &amp; Backup
        </button>
        <button
          onClick={() => setActiveTool('mobile_install')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer ${
            activeTool === 'mobile_install'
              ? 'bg-amber-600 text-white'
              : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          <Smartphone className="w-4 h-4" /> Install on Android &amp; iOS
        </button>
      </div>

      {activeTool === 'limitation' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-3xl space-y-4">
          <h3 className="font-bold text-lg text-slate-900">
            Statutory Limitation Period &amp; Sec. 12 Copying Exclusion Calculator
          </h3>
          <p className="text-xs text-slate-500">
            Computes filing deadlines under the Schedule to the Limitation Act, 1963, Negotiable Instruments Act, 1881, and Commercial Courts / Arbitration statutes.
          </p>
          <div className="space-y-3 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Nature of Proceeding</label>
              <select
                value={limIdx}
                onChange={(e) => setLimIdx(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white font-medium"
              >
                {LIMITATION_SCHEDULES.map((item, i) => (
                  <option key={i} value={i}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Cause of Action / Impugned Order / Memo
                </label>
                <input
                  type="date"
                  value={triggerDate}
                  onChange={(e) => setTriggerDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Certified Copy Preparation Days Excluded (Sec. 12 LA)
                </label>
                <input
                  type="number"
                  min="0"
                  value={copyingDays}
                  onChange={(e) => setCopyingDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>
          </div>

          {limitationResult && (
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
              <p className="text-xs text-amber-300 font-semibold">{limitationResult.periodLabel}</p>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="text-xs text-slate-400 block">Last Date of Limitation</span>
                  <span className="text-2xl font-bold">{limitationResult.deadlineStr}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      limitationResult.diffDays < 0
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {limitationResult.diffDays < 0
                      ? `Expired ${Math.abs(limitationResult.diffDays)} days ago (Check S. 5 LA if Appeal/Application)`
                      : `${limitationResult.diffDays} days remaining`}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Note: Under Section 4 of the Limitation Act, 1963, if the prescribed period expires on a day when the Court is closed, the suit/appeal/application may be instituted on the day when the Court re-opens.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTool === 'interest' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-3xl space-y-4">
          <h3 className="font-bold text-lg text-slate-900">
            Pre-Suit &amp; Pendente Lite Interest Calculator (Sec. 34 CPC / Arbitral Claims / MSME)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Principal Claim Amount (₹)</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Rate of Interest (% p.a.)</label>
              <input
                type="number"
                step="0.5"
                value={ratePct}
                onChange={(e) => setRatePct(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Default / Due Date</label>
              <input
                type="date"
                value={intFrom}
                onChange={(e) => setIntFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Filing / Calculation Date</label>
              <input
                type="date"
                value={intTo}
                onChange={(e) => setIntTo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          {interestResult && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Duration</span>
                <span className="text-lg font-bold text-slate-900">
                  {interestResult.days} Days ({interestResult.years} Yrs)
                </span>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-xs text-amber-800 block">Accrued Simple Interest</span>
                <span className="text-lg font-bold text-amber-900">{formatINR(interestResult.simpleInterest)}</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs text-emerald-800 block">Total Suit Valuation (P + I)</span>
                <span className="text-lg font-bold text-emerald-900">{formatINR(interestResult.totalClaim)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTool === 'court_fee' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-3xl space-y-4">
          <h3 className="font-bold text-lg text-slate-900">
            Ad-Valorem Suit Valuation &amp; Court Fee Quick Estimator
          </h3>
          <p className="text-xs text-slate-500">
            Court fees vary by State Court Fees &amp; Suits Valuation Acts (e.g., Rajasthan, Delhi, Maharashtra, Karnataka, UP). Adjust the effective slab percentage for quick client disbursement estimates.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Total Suit Valuation (₹)</label>
              <input
                type="number"
                value={suitValuation}
                onChange={(e) => setSuitValuation(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State Effective Ad-Valorem Slab (% — e.g. 5% to 7.5%)
              </label>
              <input
                type="number"
                step="0.25"
                value={feeSlabRate}
                onChange={(e) => setFeeSlabRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Estimated Ad-Valorem Court Fee Stamp</span>
              <span className="text-2xl font-bold text-amber-400">{formatINR(estimatedCourtFee)}</span>
            </div>
            <IndianRupee className="w-8 h-8 text-slate-600" />
          </div>
        </div>
      )}

      {activeTool === 'chamber_profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Advocate &amp; Chamber Letterhead Settings</h3>
                <p className="text-xs text-slate-500">
                  Used automatically on all Quotations, Retainer Agreements, Vakalatnamas, Legal Notices, and Fee Receipts.
                </p>
              </div>
              {profileSaved && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved Locally
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Advocate Name</label>
                <input
                  value={profile.advocateName}
                  onChange={(e) => setProfile({ ...profile, advocateName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bar Council Enrollment No.</label>
                <input
                  value={profile.enrollmentNo}
                  onChange={(e) => setProfile({ ...profile, enrollmentNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chamber / Law Firm Title</label>
                <input
                  value={profile.chamberName}
                  onChange={(e) => setProfile({ ...profile, chamberName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chamber Street Address</label>
                <input
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City, State &amp; PIN</label>
                <input
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">UPI ID (for Quotations &amp; Reminders)</label>
                <input
                  value={profile.upiId || ''}
                  onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name &amp; Branch</label>
                <input
                  value={profile.bankName || ''}
                  onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Account No. &amp; IFSC</label>
                <div className="flex gap-2">
                  <input
                    value={profile.accountNo || ''}
                    onChange={(e) => setProfile({ ...profile, accountNo: e.target.value })}
                    placeholder="Account No."
                    className="w-1/2 px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                  <input
                    value={profile.ifscCode || ''}
                    onChange={(e) => setProfile({ ...profile, ifscCode: e.target.value })}
                    placeholder="IFSC"
                    className="w-1/2 px-3 py-2 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setProfileSaved(true);
                setTimeout(() => setProfileSaved(false), 2500);
              }}
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
            >
              Save Chamber Profile
            </button>
          </div>

          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h4 className="font-bold text-base text-slate-900">100% Private On-Device Storage &amp; Backup</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              All client records, fee ledgers, and drafted agreements stay strictly private on your phone/device. Export an encrypted-ready JSON backup anytime to transfer between your iPhone, iPad, Android phone, or laptop.
            </p>
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleExportBackup}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" /> Download Complete Chamber Backup
              </button>
              <label className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold cursor-pointer">
                <Upload className="w-4 h-4" /> Restore from Backup File
                <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTool === 'mobile_install' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                Single Universal Link for Android &amp; iOS
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Install NyayaDesk on Your Android Phone, iPhone, or iPad in 10 Seconds
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                No technical setup, no developer account, and no cables needed. Open this exact link on your phone (or scan the QR code below with your phone camera) to install NyayaDesk onto your Home Screen with full offline access.
              </p>
              {deferredInstallPrompt && (
                <button
                  onClick={onTriggerInstall}
                  className="mt-2 inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Tap Here to Install App Now
                </button>
              )}
            </div>

            {currentUrl && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center shrink-0">
                <QRCodeSVG value={currentUrl} size={136} level="M" />
                <span className="text-[11px] font-semibold text-slate-600 mt-2">Scan with Phone Camera</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                How to Install on Android (Chrome / Samsung)
              </h4>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-700 leading-relaxed">
                <li>Open this single link in <strong>Google Chrome</strong> on your Android phone.</li>
                <li>Tap the <strong>"Install App"</strong> button at the top right of NyayaDesk (or tap Chrome's <strong>⋮ three-dot menu</strong>).</li>
                <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                <li>NyayaDesk now appears on your Android app drawer &amp; works completely offline in courtrooms!</li>
              </ol>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Share className="w-5 h-5 text-blue-600" />
                How to Install on iPhone &amp; iPad (iOS Safari)
              </h4>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-700 leading-relaxed">
                <li>Open this single link in <strong>Safari</strong> on your iPhone or iPad.</li>
                <li>Tap the <strong>Share icon</strong> (square with an upward arrow at the bottom center of Safari).</li>
                <li>Scroll down slightly and tap <strong>"Add to Home Screen"</strong>, then tap <strong>"Add"</strong>.</li>
                <li>NyayaDesk installs as a full-screen native-style iOS app with offline Bare Acts &amp; Sanhita Converter!</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
