import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  Search,
  Printer,
  Table2,
  BookOpen,
  WifiOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ConcordanceRow } from '../types';
import { DATA_BASE_URL, printLegalDocument } from '../utils';

type ConcordanceKey =
  | 'ipc_to_bns'
  | 'bns_to_ipc'
  | 'crpc_to_bnss'
  | 'bnss_to_crpc'
  | 'iea_to_bsa'
  | 'bsa_to_iea';

interface ConverterModuleProps {
  onOpenSectionInCorpus: (actCode: string, sectionNumber: string) => void;
}

const PAIR_META: Record<
  ConcordanceKey,
  { label: string; srcCode: string; tgtCode: string; srcFull: string; tgtFull: string }
> = {
  ipc_to_bns: {
    label: 'IPC (1860) → BNS (2023)',
    srcCode: 'IPC',
    tgtCode: 'BNS',
    srcFull: 'Indian Penal Code, 1860',
    tgtFull: 'Bharatiya Nyaya Sanhita, 2023'
  },
  bns_to_ipc: {
    label: 'BNS (2023) → IPC (1860)',
    srcCode: 'BNS',
    tgtCode: 'IPC',
    srcFull: 'Bharatiya Nyaya Sanhita, 2023',
    tgtFull: 'Indian Penal Code, 1860'
  },
  crpc_to_bnss: {
    label: 'CrPC (1973) → BNSS (2023)',
    srcCode: 'CRPC',
    tgtCode: 'BNSS',
    srcFull: 'Code of Criminal Procedure, 1973',
    tgtFull: 'Bharatiya Nagarik Suraksha Sanhita, 2023'
  },
  bnss_to_crpc: {
    label: 'BNSS (2023) → CrPC (1973)',
    srcCode: 'BNSS',
    tgtCode: 'CRPC',
    srcFull: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
    tgtFull: 'Code of Criminal Procedure, 1973'
  },
  iea_to_bsa: {
    label: 'IEA (1872) → BSA (2023)',
    srcCode: 'IEA',
    tgtCode: 'BSA',
    srcFull: 'Indian Evidence Act, 1872',
    tgtFull: 'Bharatiya Sakshya Adhiniyam, 2023'
  },
  bsa_to_iea: {
    label: 'BSA (2023) → IEA (1872)',
    srcCode: 'BSA',
    tgtCode: 'IEA',
    srcFull: 'Bharatiya Sakshya Adhiniyam, 2023',
    tgtFull: 'Indian Evidence Act, 1872'
  }
};

export const ConverterModule: React.FC<ConverterModuleProps> = ({ onOpenSectionInCorpus }) => {
  const [data, setData] = useState<Record<ConcordanceKey, ConcordanceRow[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePair, setActivePair] = useState<ConcordanceKey>('ipc_to_bns');
  const [mode, setMode] = useState<'browse' | 'fir_builder'>('browse');

  // Browse filters
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Batch FIR / Charge-Sheet Table Generator state
  const [batchInput, setBatchInput] = useState('302, 307, 420, 406, 498A, 120B, 34');
  const [caseCaption, setCaseCaption] = useState('FIR / Charge-Sheet Section Comparative Chart');

  useEffect(() => {
    let mounted = true;
    fetch(`${DATA_BASE_URL}/concordance.json`)
      .then((r) => r.json())
      .then((json) => {
        if (mounted) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const currentRows = useMemo(() => {
    if (!data) return [];
    return data[activePair] || [];
  }, [data, activePair]);

  const statuses = useMemo(() => {
    const s = new Set<string>();
    currentRows.forEach((r) => {
      if (r.status) s.add(r.status);
    });
    return ['All', ...Array.from(s)];
  }, [currentRows]);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return currentRows.filter((r) => {
      if (statusFilter !== 'All' && r.status !== statusFilter) return false;
      if (!q) return true;
      // Prioritize exact section lookup or title match
      return (
        r.srcSec.toLowerCase() === q ||
        r.lookup.toLowerCase() === q ||
        (r.tgtSec && r.tgtSec.toLowerCase() === q) ||
        (r.tgtSub && r.tgtSub.toLowerCase().includes(q)) ||
        r.srcSec.toLowerCase().includes(q) ||
        r.srcTitle.toLowerCase().includes(q) ||
        r.tgtTitle.toLowerCase().includes(q)
      );
    });
  }, [currentRows, query, statusFilter]);

  // Batch FIR / Charge-sheet conversion rows
  const batchGeneratedRows = useMemo(() => {
    if (!currentRows.length) return [];
    const tokens = batchInput
      .split(/[,;\n/]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    return tokens.map((tok) => {
      const clean = tok.replace(/^(sec\.?|section|s\.?)\s*/i, '').trim();
      const matches = currentRows.filter(
        (r) =>
          r.lookup.toLowerCase() === clean.toLowerCase() ||
          r.srcSec.toLowerCase() === clean.toLowerCase()
      );
      return {
        requested: clean,
        matches
      };
    });
  }, [batchInput, currentRows]);

  const handlePrintComparativeTable = () => {
    const meta = PAIR_META[activePair];
    const rowsHtml = batchGeneratedRows
      .map((item, idx) => {
        if (item.matches.length === 0) {
          return `<tr>
            <td>${idx + 1}</td>
            <td><strong>Sec. ${item.requested}</strong></td>
            <td colspan="3"><em>Not found in ${meta.srcCode} table — verify section number</em></td>
          </tr>`;
        }
        return item.matches
          .map(
            (m, subIdx) => `<tr>
              <td>${subIdx === 0 ? idx + 1 : ''}</td>
              <td><strong>${meta.srcCode} Sec. ${m.srcSub || m.srcSec}</strong><br/><span style="font-size:9.5pt;color:#475569;">${m.srcTitle}</span></td>
              <td><strong>${m.tgtSec ? `${meta.tgtCode} Sec. ${m.tgtSub || m.tgtSec}` : 'Omitted / Repealed'}</strong><br/><span style="font-size:9.5pt;color:#475569;">${m.tgtTitle || '—'}</span></td>
              <td>${m.status}</td>
              <td style="font-size:9.5pt;">${m.note}</td>
            </tr>`
          )
          .join('');
      })
      .join('');

    const html = `
      <div class="header-box">
        <h2 style="margin:0;">${caseCaption}</h2>
        <p style="margin:4px 0 0 0;font-size:10pt;color:#334155;">
          Official Statutory Concordance Table: <strong>${meta.srcFull}</strong> &harr; <strong>${meta.tgtFull}</strong>
        </p>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width:6%;">#</th>
            <th style="width:25%;">${meta.srcCode} Provision</th>
            <th style="width:25%;">${meta.tgtCode} Corresponding Provision</th>
            <th style="width:12%;">Status</th>
            <th style="width:32%;">Concordance Note</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
      <p style="font-size:9pt;color:#64748b;margin-top:16px;">
        Generated offline via NyayaDesk Advocate Suite. Substantive offences committed prior to 01.07.2024 remain governed by IPC, 1860 u/s 358 BNS.
      </p>
    `;
    printLegalDocument(caseCaption.replace(/\s+/g, '_'), html);
  };

  const flipDirection = () => {
    const map: Record<ConcordanceKey, ConcordanceKey> = {
      ipc_to_bns: 'bns_to_ipc',
      bns_to_ipc: 'ipc_to_bns',
      crpc_to_bnss: 'bnss_to_crpc',
      bnss_to_crpc: 'crpc_to_bnss',
      iea_to_bsa: 'bsa_to_iea',
      bsa_to_iea: 'iea_to_bsa'
    };
    setActivePair(map[activePair]);
  };

  const meta = PAIR_META[activePair];

  return (
    <div className="space-y-5">
      {/* Offline Badge & Mode Switcher */}
      <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full mb-1.5">
            <WifiOff className="w-3 h-3" /> 100% Offline Criminal Sanhita Concordance Engine
          </div>
          <h2 className="text-lg sm:text-xl font-bold">
            IPC ↔ BNS • CrPC ↔ BNSS • IEA ↔ BSA Converter &amp; Table Generator
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Instant two-way section lookup across all 2,629 statutory mappings + Multi-Section FIR Comparative Chart PDF Generator.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setMode('browse')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              mode === 'browse' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            Instant Converter &amp; Full Table
          </button>
          <button
            onClick={() => setMode('fir_builder')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              mode === 'fir_builder'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <Table2 className="w-3.5 h-3.5" />
            FIR / Charge-Sheet Table Generator
          </button>
        </div>
      </div>

      {/* Code Pair Selector Pills */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PAIR_META) as ConcordanceKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setActivePair(k)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activePair === k
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {PAIR_META[k].label}
            </button>
          ))}
        </div>
        <button
          onClick={flipDirection}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-amber-600" />
          Reverse Direction
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">
          Loading offline concordance tables...
        </div>
      ) : mode === 'fir_builder' ? (
        /* BATCH FIR / CHARGE-SHEET COMPARATIVE TABLE GENERATOR */
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Chart Heading (For Annexing to Bail / Quashing / Written Arguments)
                </label>
                <input
                  value={caseCaption}
                  onChange={(e) => setCaseCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Enter Multiple {meta.srcCode} Sections (comma-separated, e.g. 302, 307, 420, 498A, 120B)
                </label>
                <input
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  placeholder="Enter sections separated by commas..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
            <button
              onClick={handlePrintComparativeTable}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-xs cursor-pointer shrink-0"
            >
              <Printer className="w-4 h-4" />
              Export / Print Court Table (PDF)
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 text-white text-xs">
                <tr>
                  <th className="py-3 px-4 text-left">{meta.srcCode} Section</th>
                  <th className="py-3 px-4 text-left">{meta.tgtCode} Equivalent</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Bare Act Lookup</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {batchGeneratedRows.map((item, idx) =>
                  item.matches.length === 0 ? (
                    <tr key={idx} className="bg-red-50/40">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {meta.srcCode} Sec. {item.requested}
                      </td>
                      <td colSpan={3} className="py-3 px-4 text-xs text-red-700">
                        No matching section found in {meta.srcFull}. Check section number or switch code pair above.
                      </td>
                    </tr>
                  ) : (
                    item.matches.map((m, mIdx) => (
                      <tr key={`${idx}-${mIdx}`} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">
                            {meta.srcCode} Sec. {m.srcSub || m.srcSec}
                          </div>
                          <div className="text-xs text-slate-600">{m.srcTitle}</div>
                        </td>
                        <td className="py-3 px-4">
                          {m.tgtSec ? (
                            <>
                              <div className="font-bold text-amber-800">
                                {meta.tgtCode} Sec. {m.tgtSub || m.tgtSec}
                              </div>
                              <div className="text-xs text-slate-600">{m.tgtTitle}</div>
                            </>
                          ) : (
                            <span className="text-xs font-semibold text-red-700">Omitted / Repealed</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                            {m.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap space-x-2">
                          <button
                            onClick={() => onOpenSectionInCorpus(meta.srcCode, m.srcSec)}
                            className="text-xs font-semibold text-slate-700 hover:text-slate-950 underline cursor-pointer"
                          >
                            Read {meta.srcCode} {m.srcSec}
                          </button>
                          {m.tgtSec && (
                            <button
                              onClick={() => onOpenSectionInCorpus(meta.tgtCode, m.tgtSec)}
                              className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline cursor-pointer"
                            >
                              Read {meta.tgtCode} {m.tgtSec}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* INTERACTIVE SINGLE / KEYWORD CONVERTER & COMPLETE TABLE */
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Type ${meta.srcCode} section number (e.g. 420, 438, 65B) or offence keyword (e.g. murder, bail, electronic)...`}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Jump Popular Lookups */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium mr-1">Quick Pin:</span>
            {(activePair.includes('ipc')
              ? ['302', '304A', '307', '376', '406', '420', '498A', '120B', '124A']
              : activePair.includes('crpc')
                ? ['41', '41A', '125', '154', '167', '438', '439', '482']
                : ['27', '32', '45', '65B', '114A', '126']
            ).map((qPin) => (
              <button
                key={qPin}
                onClick={() => setQuery(qPin)}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold cursor-pointer"
              >
                Sec. {qPin}
              </button>
            ))}
            {query && (
              <button
                onClick={() => setQuery('')}
                className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-semibold cursor-pointer"
              >
                Clear Filter
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Showing <strong>{filteredRows.length}</strong> of {currentRows.length} sections in{' '}
            <strong>{meta.label}</strong>
          </p>

          <div className="border border-slate-200 rounded-xl overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-700 text-xs sticky top-0 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-left">{meta.srcCode} Section</th>
                  <th className="py-3 px-4 text-left">{meta.tgtCode} Corresponding Section</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-right">Read Bare Act &amp; Cases</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.slice(0, 250).map((r, i) => (
                  <tr key={`${r.id}-${i}`} className="hover:bg-slate-50/90">
                    <td className="py-3 px-4 align-top">
                      <div className="font-bold text-slate-900">
                        {meta.srcCode} Sec. {r.srcSub || r.srcSec}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">{r.srcTitle}</div>
                      {r.srcChap && <div className="text-[11px] text-slate-400 mt-0.5">{r.srcChap}</div>}
                    </td>
                    <td className="py-3 px-4 align-top">
                      {r.tgtSec ? (
                        <>
                          <div className="font-bold text-amber-800">
                            {meta.tgtCode} Sec. {r.tgtSub || r.tgtSec}
                          </div>
                          <div className="text-xs text-slate-700 mt-0.5">{r.tgtTitle}</div>
                          {r.tgtChap && <div className="text-[11px] text-slate-400 mt-0.5">{r.tgtChap}</div>}
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700">
                          <AlertCircle className="w-3.5 h-3.5" /> Omitted / No Direct Counterpart
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 align-top">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          r.status.toLowerCase().includes('omit') || r.status.toLowerCase().includes('repeal')
                            ? 'bg-red-50 text-red-700'
                            : r.status.toLowerCase().includes('new')
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 align-top text-right whitespace-nowrap space-y-1">
                      <div>
                        <button
                          onClick={() => onOpenSectionInCorpus(meta.srcCode, r.srcSec)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3" /> {meta.srcCode} {r.srcSec}
                        </button>
                      </div>
                      {r.tgtSec && (
                        <div>
                          <button
                            onClick={() => onOpenSectionInCorpus(meta.tgtCode, r.tgtSec)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded cursor-pointer"
                          >
                            <BookOpen className="w-3 h-3" /> {meta.tgtCode} {r.tgtSec}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
