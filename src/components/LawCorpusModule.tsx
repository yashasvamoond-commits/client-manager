import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  BookOpen,
  Scale,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  Bookmark,
  Layers,
  Filter
} from 'lucide-react';
import { ActMeta, BareActSection, CentralStatuteRegistryItem } from '../types';
import { buildDynamicSectionInsight } from '../data';

interface LawCorpusModuleProps {
  externalTarget?: { actCode: string; sectionNum?: string; query?: string } | null;
  onClearExternalTarget?: () => void;
}

type SearchIndexTuple = [string, string, string, string]; // [actCode, secNum, secTitle, chapTitle]

interface SCJudgmentItem {
  id: string;
  name: string;
  aka?: string;
  decided?: string;
  citation?: string;
  bench?: string;
  result?: string;
  status?: string;
  tags?: string[];
  summary?: string;
  question?: string;
  principles?: string[];
}

const ACT_ALIASES: Record<string, string> = {
  bns: 'BNS',
  bnss: 'BNSS',
  bsa: 'BSA',
  ipc: 'IPC',
  crpc: 'CRPC',
  iea: 'IEA',
  evidence: 'BSA',
  coi: 'COI',
  constitution: 'COI',
  article: 'COI',
  art: 'COI',
  cpc: 'CPC',
  nia: 'NIA',
  ni: 'NIA',
  cheque: 'NIA',
  contract: 'ICA',
  ica: 'ICA',
  hma: 'HMA',
  hindu: 'HMA',
  ibc: 'IBC',
  insolvency: 'IBC',
  aca: 'ACA',
  arbitration: 'ACA',
  pmla: 'PMLA',
  ndps: 'NDPS',
  pocso: 'POCSO',
  rera: 'RERA',
  companies: 'CA',
  ca: 'CA',
  it: 'IT_ACT',
  dpdp: 'DPDPA',
  dpdpa: 'DPDPA',
  limitation: 'LA',
  tpa: 'TPA',
  sra: 'SRA',
  mva: 'MVA',
  gst: 'CGST',
  cgst: 'CGST',
  incometax: 'ITA',
  ita: 'ITA',
  rti: 'RTI',
  sarfaesi: 'SARFAESI',
  cpa: 'CPA',
  consumer: 'CPA',
  dv: 'DV',
  pwdva: 'DV',
  posh: 'POSH'
};

export const LawCorpusModule: React.FC<LawCorpusModuleProps> = ({
  externalTarget,
  onClearExternalTarget
}) => {
  const [fullTextActs, setFullTextActs] = useState<ActMeta[]>([]);
  const [centralRegistry, setCentralRegistry] = useState<CentralStatuteRegistryItem[]>([]);
  const [searchIndex, setSearchIndex] = useState<SearchIndexTuple[]>([]);
  const [scJudgments, setScJudgments] = useState<SCJudgmentItem[]>([]);
  const [loadingManifest, setLoadingManifest] = useState(true);

  // Active sub-tab
  const [subTab, setSubTab] = useState<'bare_acts' | 'all_statutes_registry' | 'sc_landmarks'>('bare_acts');

  // Search & Act selection
  const [globalQuery, setGlobalQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedActCode, setSelectedActCode] = useState<string>('BNS');
  const [actSections, setActSections] = useState<BareActSection[]>([]);
  const [loadingAct, setLoadingAct] = useState(false);
  const [selectedSectionNum, setSelectedSectionNum] = useState<string>('1');
  const [sectionFilter, setSectionFilter] = useState('');
  const [copiedSec, setCopiedSec] = useState(false);

  // Registry filter
  const [registrySearch, setRegistrySearch] = useState('');
  const [judgmentSearch, setJudgmentSearch] = useState('');
  const [bookmarkedKeys, setBookmarkedKeys] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('nyayadesk_bookmarks') || '["BNS:318","BNSS:482","BSA:63","NIA:138","COI:21"]');
    } catch {
      return [];
    }
  });

  const actCacheRef = useRef<Record<string, BareActSection[]>>({});

  useEffect(() => {
    localStorage.setItem('nyayadesk_bookmarks', JSON.stringify(bookmarkedKeys));
  }, [bookmarkedKeys]);

  // Load manifest, search index, and SC judgments
  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetch('./data/acts_manifest.json').then((r) => r.json()),
      fetch('./data/search_index.json').then((r) => r.json()),
      fetch('./data/sc_judgments.json').then((r) => r.json())
    ])
      .then(([manifest, sIdx, judgments]) => {
        if (!mounted) return;
        setFullTextActs(manifest.fullTextActs || []);
        setCentralRegistry(manifest.centralActsRegistry || []);
        setSearchIndex(sIdx || []);
        setScJudgments(judgments || []);
        setLoadingManifest(false);
      })
      .catch(() => {
        if (mounted) setLoadingManifest(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Load individual act JSON on selection
  useEffect(() => {
    if (!selectedActCode) return;
    if (actCacheRef.current[selectedActCode]) {
      const cached = actCacheRef.current[selectedActCode];
      setActSections(cached);
      if (cached.length > 0 && !cached.some((s) => s.s === selectedSectionNum)) {
        setSelectedSectionNum(cached[0].s);
      }
      return;
    }
    let mounted = true;
    setLoadingAct(true);
    fetch(`./data/acts/${selectedActCode}.json`)
      .then((r) => r.json())
      .then((d) => {
        if (!mounted) return;
        const secs: BareActSection[] = d.sections || [];
        actCacheRef.current[selectedActCode] = secs;
        setActSections(secs);
        if (secs.length > 0 && !secs.some((s) => s.s === selectedSectionNum)) {
          setSelectedSectionNum(secs[0].s);
        }
        setLoadingAct(false);
      })
      .catch(() => {
        if (mounted) setLoadingAct(false);
      });
    return () => {
      mounted = false;
    };
  }, [selectedActCode]);

  // Handle jump from Converter or Client docket
  useEffect(() => {
    if (!externalTarget) return;
    setSubTab('bare_acts');
    if (externalTarget.actCode) {
      setSelectedActCode(externalTarget.actCode);
      if (externalTarget.sectionNum) {
        setSelectedSectionNum(externalTarget.sectionNum);
      }
      setGlobalQuery('');
    } else if (externalTarget.query) {
      setGlobalQuery(externalTarget.query);
    }
    if (onClearExternalTarget) onClearExternalTarget();
  }, [externalTarget, onClearExternalTarget]);

  const actMap = useMemo(() => {
    const m: Record<string, ActMeta> = {};
    fullTextActs.forEach((a) => {
      m[a.code] = a;
    });
    return m;
  }, [fullTextActs]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    fullTextActs.forEach((a) => set.add(a.category));
    return ['All', ...Array.from(set)];
  }, [fullTextActs]);

  const filteredActs = useMemo(() => {
    return fullTextActs.filter((a) => categoryFilter === 'All' || a.category === categoryFilter);
  }, [fullTextActs, categoryFilter]);

  // Smart Global Section Search Parser (e.g., "BNS 103", "Section 138 NI Act", "Article 21", "482 BNSS", "murder", "anticipatory bail")
  const globalSearchResults = useMemo(() => {
    const q = globalQuery.trim();
    if (!q || searchIndex.length === 0) return [];
    const lower = q.toLowerCase();

    // Detect patterns like "BNS 318", "Sec 420 IPC", "Article 21", "138 NIA"
    let detectedAct: string | null = null;
    let detectedSec: string | null = null;

    const tokens = lower
      .replace(/[(),.:;-]/g, ' ')
      .split(/\s+/)
      .filter((t) => !['sec', 'section', 'sections', 'act', 'of', 'the', 'under', 'u/s'].includes(t));

    for (const tok of tokens) {
      if (ACT_ALIASES[tok]) {
        detectedAct = ACT_ALIASES[tok];
      } else if (/^\d+[a-z]?$/i.test(tok)) {
        detectedSec = tok.toUpperCase();
      }
    }

    const scored: Array<{ tuple: SearchIndexTuple; score: number }> = [];
    for (let i = 0; i < searchIndex.length; i++) {
      const tup = searchIndex[i];
      const [ac, sn, st, ct] = tup;
      let score = 0;

      if (detectedAct && ac === detectedAct) score += 50;
      if (detectedSec && sn.toUpperCase() === detectedSec) score += 80;
      else if (detectedSec && sn.toUpperCase().startsWith(detectedSec)) score += 35;

      const titleLower = st.toLowerCase();
      if (titleLower.includes(lower)) score += 45;
      else {
        let matchedWords = 0;
        for (const tok of tokens) {
          if (tok.length > 2 && (titleLower.includes(tok) || ac.toLowerCase() === tok || ct.toLowerCase().includes(tok))) {
            matchedWords++;
          }
        }
        if (matchedWords > 0) score += matchedWords * 15;
      }

      if (score >= 30) {
        scored.push({ tuple: tup, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 40).map((x) => x.tuple);
  }, [globalQuery, searchIndex]);

  const currentActMeta = actMap[selectedActCode];
  const currentSection = useMemo(() => {
    return actSections.find((s) => s.s === selectedSectionNum) || actSections[0] || null;
  }, [actSections, selectedSectionNum]);

  const filteredSectionsInAct = useMemo(() => {
    const q = sectionFilter.trim().toLowerCase();
    if (!q) return actSections;
    return actSections.filter(
      (s) =>
        s.s.toLowerCase().includes(q) ||
        s.t.toLowerCase().includes(q) ||
        (s.ct || '').toLowerCase().includes(q)
    );
  }, [actSections, sectionFilter]);

  // Compute rich Bare Act + Commentary + Case Laws for currentSection
  const currentInsight = useMemo(() => {
    if (!currentSection || !currentActMeta) return null;
    // Also match relevant SC Judgments from the 125-judgment library by keyword/article
    const extraMatchedJudgments = scJudgments
      .filter((j) => {
        if (selectedActCode === 'COI') return false; // COI already has inline cases on articles
        const sTitle = (currentSection.t || '').toLowerCase();
        if (sTitle.length < 5) return false;
        const sum = `${j.summary || ''} ${(j.tags || []).join(' ')}`.toLowerCase();
        return (
          (sTitle.includes('bail') && sum.includes('bail')) ||
          (sTitle.includes('privacy') && sum.includes('privacy')) ||
          (sTitle.includes('defamation') && sum.includes('defamation')) ||
          (sTitle.includes('sedition') && sum.includes('sedition')) ||
          (sTitle.includes('preventive detention') && sum.includes('detention'))
        );
      })
      .slice(0, 2)
      .map((j) => ({
        name: j.name,
        citation: j.citation,
        year: j.decided || '',
        bench: j.bench,
        status: 'good' as const,
        held: j.summary || '',
        why: j.principles?.[0]
      }));

    return buildDynamicSectionInsight({
      actCode: selectedActCode,
      actName: currentActMeta.name,
      actStatus: currentActMeta.status,
      replacedBy: currentActMeta.replacedBy,
      sectionNum: currentSection.s,
      sectionTitle: currentSection.t,
      chapterTitle: currentSection.ct,
      bareText: currentSection.b,
      existingCommentary: currentSection.cm,
      existingCases: [...(currentSection.cl || []), ...extraMatchedJudgments],
      crossRefs: currentSection.x
    });
  }, [currentSection, currentActMeta, selectedActCode, scJudgments]);

  const filteredRegistry = useMemo(() => {
    const q = registrySearch.trim().toLowerCase();
    if (!q) return centralRegistry;
    return centralRegistry.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        String(r.year || '').includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }, [centralRegistry, registrySearch]);

  const filteredJudgments = useMemo(() => {
    const q = judgmentSearch.trim().toLowerCase();
    if (!q) return scJudgments;
    return scJudgments.filter(
      (j) =>
        (j.name || '').toLowerCase().includes(q) ||
        (j.aka || '').toLowerCase().includes(q) ||
        (j.summary || '').toLowerCase().includes(q) ||
        (j.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [scJudgments, judgmentSearch]);

  const toggleBookmark = (actCode: string, secNum: string) => {
    const key = `${actCode}:${secNum}`;
    setBookmarkedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [key, ...prev]
    );
  };

  const copySectionCitation = () => {
    if (!currentSection || !currentActMeta) return;
    const label = selectedActCode === 'COI' ? 'Article' : 'Section';
    const txt = `${currentActMeta.name} — ${label} ${currentSection.s}: ${currentSection.t}\n\nBARE ACT:\n${currentSection.b}\n\nCOMMENTARY:\n${currentInsight?.commentary || ''}`;
    navigator.clipboard.writeText(txt);
    setCopiedSec(true);
    setTimeout(() => setCopiedSec(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Top Hero Search & Mode Tabs */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              All-India Statutory Corpus, Bare Acts, Commentary &amp; Case Laws
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              103 Complete Bare Acts (12,238 Full-Text Sections Offline) • 849 Central Statutes Master Registry (1836–2026) • Supreme Court Landmark &amp; Latest Rulings
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSubTab('bare_acts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                subTab === 'bare_acts' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              Bare Acts + Commentary (12,238 Secs)
            </button>
            <button
              onClick={() => setSubTab('all_statutes_registry')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                subTab === 'all_statutes_registry'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              All 849 Central Statutes Directory
            </button>
            <button
              onClick={() => setSubTab('sc_landmarks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                subTab === 'sc_landmarks'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              SC Landmark Judgments ({scJudgments.length})
            </button>
          </div>
        </div>

        {/* Universal Instant Section Search Box */}
        {subTab === 'bare_acts' && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={globalQuery}
              onChange={(e) => setGlobalQuery(e.target.value)}
              placeholder='Instant Global Section Search — Try "BNS 103", "BNSS 482", "BSA 63", "NIA 138", "Article 21", "HMA 13B", "Arbitration 34", "cheating"...'
              className="w-full pl-10 pr-24 py-3 rounded-xl bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {globalQuery && (
              <button
                onClick={() => setGlobalQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md cursor-pointer"
              >
                Clear
              </button>
            )}

            {/* Instant Global Search Dropdown */}
            {globalQuery.trim().length > 0 && (
              <div className="mt-2 bg-white text-slate-900 rounded-xl border border-slate-200 shadow-xl max-h-80 overflow-y-auto divide-y divide-slate-100">
                {globalSearchResults.length === 0 ? (
                  <div className="p-4 text-xs text-slate-500">
                    No direct section title match in full-text index — check the "All 849 Central Statutes Directory" tab for specialised statutes.
                  </div>
                ) : (
                  globalSearchResults.map(([ac, sn, st, ct], idx) => (
                    <button
                      key={`${ac}-${sn}-${idx}`}
                      onClick={() => {
                        setSelectedActCode(ac);
                        setSelectedSectionNum(sn);
                        setGlobalQuery('');
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-amber-50/70 flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          <span className="inline-block bg-slate-900 text-amber-300 px-2 py-0.5 rounded mr-2 text-[11px]">
                            {ac} {ac === 'COI' ? 'Art.' : 'Sec.'} {sn}
                          </span>
                          {st}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {actMap[ac]?.name} {ct ? `• ${ct}` : ''}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-amber-600 shrink-0" />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Saved Bookmarks Strip */}
        {subTab === 'bare_acts' && bookmarkedKeys.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-slate-400 inline-flex items-center gap-1 mr-1">
              <Bookmark className="w-3.5 h-3.5 text-amber-400" /> Pinned Sections:
            </span>
            {bookmarkedKeys.map((bk) => {
              const [ac, sn] = bk.split(':');
              return (
                <button
                  key={bk}
                  onClick={() => {
                    setSelectedActCode(ac);
                    setSelectedSectionNum(sn);
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold cursor-pointer"
                >
                  {ac} {sn}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {loadingManifest ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">
          Initialising Indian Statutory Corpus...
        </div>
      ) : subTab === 'bare_acts' ? (
        /* THREE-PANE BARE ACT + COMMENTARY + CASE LAW READER */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Statute Selector + Section List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filter Domain
                </label>
                <span className="text-[11px] font-semibold text-slate-500">{filteredActs.length} Acts</span>
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold bg-slate-50"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Select Statute / Code
                </label>
                <select
                  value={selectedActCode}
                  onChange={(e) => setSelectedActCode(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 bg-white"
                >
                  {filteredActs.map((a) => (
                    <option key={a.code} value={a.code}>
                      [{a.code}] {a.name} ({a.sectionCount} secs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <input
                  type="text"
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  placeholder={`Filter ${selectedActCode} sections (e.g. 482, bail)...`}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div className="max-h-[460px] overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-lg">
                {loadingAct ? (
                  <div className="p-4 text-xs text-slate-500 text-center">Loading bare act sections...</div>
                ) : (
                  filteredSectionsInAct.map((s) => {
                    const active = currentSection?.s === s.s;
                    return (
                      <button
                        key={s.s}
                        onClick={() => setSelectedSectionNum(s.s)}
                        className={`w-full text-left px-3 py-2.5 text-xs transition cursor-pointer ${
                          active ? 'bg-slate-900 text-white font-semibold' : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <span className={active ? 'text-amber-400 font-bold' : 'font-bold text-slate-900'}>
                          {selectedActCode === 'COI' ? 'Art.' : 'Sec.'} {s.s}:
                        </span>{' '}
                        <span>{s.t || 'Provision'}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Bare Act Text + Commentary + Case Laws */}
          <div className="lg:col-span-8 space-y-4">
            {!currentSection || !currentActMeta ? (
              <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">
                Select any Statute and Section to read the Bare Act, Commentary, and Case Laws.
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                {/* Section Header */}
                <div className="p-5 border-b border-slate-200 bg-slate-50">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-slate-900 text-amber-300">
                        {currentActMeta.code}
                      </span>
                      <span className="text-xs font-semibold text-slate-600">{currentActMeta.name}</span>
                      {currentActMeta.status === 'repealed' && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
                          Repealed — Replaced by {currentActMeta.replacedBy}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBookmark(selectedActCode, currentSection.s)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                          bookmarkedKeys.includes(`${selectedActCode}:${currentSection.s}`)
                            ? 'bg-amber-100 border-amber-300 text-amber-900'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        {bookmarkedKeys.includes(`${selectedActCode}:${currentSection.s}`) ? 'Pinned' : 'Pin'}
                      </button>
                      <button
                        onClick={copySectionCitation}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer"
                      >
                        {copiedSec ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedSec ? 'Copied' : 'Copy Provision'}
                      </button>
                    </div>
                  </div>

                  {currentSection.ct && (
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-2">
                      {currentSection.c ? `Chapter ${currentSection.c} — ` : ''}
                      {currentSection.ct}
                    </p>
                  )}
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    {selectedActCode === 'COI' ? 'Article' : 'Section'} {currentSection.s} — {currentSection.t}
                  </h3>

                  {/* Cross-Reference Banner (IPC<->BNS, CrPC<->BNSS, IEA<->BSA) */}
                  {currentSection.x && currentSection.x.length > 0 && (
                    <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="text-amber-950">
                        <strong className="font-bold">Concordance Equivalent: </strong>
                        {currentSection.x.map((xr, idx) => (
                          <span key={idx} className="mr-2">
                            <button
                              onClick={() => {
                                if (xr.targetAct && xr.baseTargetSec) {
                                  setSelectedActCode(xr.targetAct);
                                  setSelectedSectionNum(xr.baseTargetSec);
                                }
                              }}
                              className="font-bold underline hover:text-amber-700 cursor-pointer"
                            >
                              {xr.targetAct} Sec. {xr.targetSec}
                            </button>{' '}
                            ({xr.status})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-6 space-y-6">
                  {/* 1. OFFICIAL BARE ACT TEXT */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 mb-2.5">
                      <BookOpen className="w-4 h-4 text-amber-600" />
                      1. Statutory Bare Act Text
                    </h4>
                    <div
                      className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5 text-slate-900 whitespace-pre-wrap leading-relaxed"
                      style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '15px' }}
                    >
                      {currentSection.b}
                    </div>
                  </div>

                  {/* 2. PRACTITIONER COMMENTARY & INGREDIENTS */}
                  {currentInsight && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 mb-2.5">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        2. Analytical Commentary &amp; Statutory Notes
                      </h4>
                      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 space-y-3 text-sm text-slate-700 leading-relaxed">
                        <div className="whitespace-pre-line">{currentInsight.commentary}</div>

                        {currentInsight.essentials && currentInsight.essentials.length > 0 && (
                          <div className="pt-3 border-t border-slate-100">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                              Key Statutory Ingredients &amp; Structural Indicators
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
                              {currentInsight.essentials.map((ess, i) => (
                                <li key={i}>{ess}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {currentInsight.practiceTip && (
                          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                            <strong>Courtroom Practice Tip: </strong>
                            {currentInsight.practiceTip}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 3. LANDMARK & LATEST CASE LAWS */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 mb-2.5">
                      <Scale className="w-4 h-4 text-amber-600" />
                      3. Landmark &amp; Important Latest Case Laws
                    </h4>
                    {currentInsight && currentInsight.cases.length > 0 ? (
                      <div className="space-y-3">
                        {currentInsight.cases.map((c, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-slate-200 p-4 bg-slate-50/60 space-y-1.5"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h5 className="font-bold text-sm text-slate-900">{c.name}</h5>
                              <div className="flex items-center gap-1.5 text-[11px]">
                                {c.citation && (
                                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono font-semibold">
                                    {c.citation}
                                  </span>
                                )}
                                <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-semibold">
                                  {c.year}
                                </span>
                                {c.status === 'latest' && (
                                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">
                                    Latest Ruling
                                  </span>
                                )}
                              </div>
                            </div>
                            {c.facts && (
                              <p className="text-xs text-slate-600">
                                <strong>Facts:</strong> {c.facts}
                              </p>
                            )}
                            <p className="text-xs text-slate-800 leading-relaxed">
                              <strong>Held / Ratio Decidendi:</strong> {c.held}
                            </p>
                            {c.why && (
                              <p className="text-xs text-amber-900 bg-amber-50/80 px-2.5 py-1.5 rounded border border-amber-200/70">
                                <strong>Significance:</strong> {c.why}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-800">
                            Search Live Judgments Citing {currentActMeta.name} Sec. {currentSection.s}
                          </p>
                          <p className="mt-0.5">
                            For specialised/procedural provisions without a standalone Supreme Court locus classicus bundled offline, tap to pull reported Supreme Court &amp; High Court citations on Indian Kanoon / eSCR.
                          </p>
                        </div>
                        <a
                          href={`https://indiankanoon.org/search/?formInput=${encodeURIComponent(
                            `"Section ${currentSection.s}" "${currentActMeta.name}"`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white font-semibold shrink-0 hover:bg-slate-800"
                        >
                          Search Judgments <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : subTab === 'all_statutes_registry' ? (
        /* ALL 849 CENTRAL STATUTES MASTER REGISTRY (1836–2026) */
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                Complete Registry of All Existing Central Statutes in India ({centralRegistry.length} Acts, 1836–2026)
              </h3>
              <p className="text-xs text-slate-500">
                Every enacted Central Act of India indexed with Year, Act Number, Domain, Offline Bare Act link (for 103 primary statutes), and Official India Code Gazette link.
              </p>
            </div>
            <input
              type="text"
              value={registrySearch}
              onChange={(e) => setRegistrySearch(e.target.value)}
              placeholder="Search any Indian Act by title or year (e.g. Waqf, Passport,Merchant Shipping, 2025)..."
              className="w-full sm:w-96 px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          <p className="text-xs text-slate-500">
            Showing <strong>{filteredRegistry.length}</strong> Central Statutes
          </p>

          <div className="border border-slate-200 rounded-xl overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-700 sticky top-0 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-left">Year &amp; Act No.</th>
                  <th className="py-3 px-4 text-left">Short Title of Statute</th>
                  <th className="py-3 px-4 text-left">Legal Domain</th>
                  <th className="py-3 px-4 text-right">Access Bare Act</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegistry.slice(0, 300).map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 whitespace-nowrap text-xs font-semibold text-slate-600">
                      {r.year || '—'} {r.actNumber ? `(Act ${r.actNumber})` : ''}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{r.title}</td>
                    <td className="py-2.5 px-4 text-xs text-slate-600">{r.category}</td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      {r.fullTextCode ? (
                        <button
                          onClick={() => {
                            setSelectedActCode(r.fullTextCode!);
                            setSubTab('bare_acts');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3" /> Read Offline ({r.fullTextCode})
                        </button>
                      ) : (
                        <a
                          href={r.indiaCodeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                        >
                          India Code <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* SUPREME COURT LANDMARK JUDGMENTS LIBRARY */
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Supreme Court Landmark &amp; Constitution Bench Judgments Compendium ({scJudgments.length})
              </h3>
              <p className="text-xs text-slate-500">
                Full cause titles, citations, bench strength, constitutional questions, and binding legal principles.
              </p>
            </div>
            <input
              type="text"
              value={judgmentSearch}
              onChange={(e) => setJudgmentSearch(e.target.value)}
              placeholder="Search case name, doctrine, privacy, basic structure, bail..."
              className="w-full sm:w-96 px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[650px] overflow-y-auto pr-1">
            {filteredJudgments.map((j) => (
              <div key={j.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{j.name}</h4>
                    {j.aka && <p className="text-xs font-semibold text-amber-700">Popularly: {j.aka}</p>}
                  </div>
                  {j.bench && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white shrink-0">
                      {j.bench}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                  {j.citation && <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">{j.citation}</span>}
                  {j.decided && <span>Decided: {j.decided}</span>}
                </div>
                {j.summary && <p className="text-xs text-slate-700 leading-relaxed">{j.summary}</p>}
                {j.principles && j.principles.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80 text-xs text-slate-600">
                    <strong className="text-slate-800">Core Principle: </strong>
                    {j.principles[j.principles.length - 1]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
