import React, { useEffect, useState } from 'react';
import {
  Users,
  FileText,
  ArrowLeftRight,
  BookOpen,
  Briefcase,
  Scale,
  Download,
  WifiOff,
  CheckCircle2
} from 'lucide-react';
import { AdvocateProfile, ClientMatter, SavedDocument } from './types';
import { DEFAULT_ADVOCATE_PROFILE, INITIAL_SAMPLE_CLIENTS } from './utils';
import { ClientsModule } from './components/ClientsModule';
import { DrafterModule } from './components/DrafterModule';
import { ConverterModule } from './components/ConverterModule';
import { LawCorpusModule } from './components/LawCorpusModule';
import { ToolsAndInstallModule } from './components/ToolsAndInstallModule';

type MainTab = 'clients' | 'drafter' | 'converter' | 'laws' | 'tools';

export function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('clients');

  // Persistent Local State (Offline-first)
  const [clients, setClients] = useState<ClientMatter[]>(() => {
    try {
      const saved = localStorage.getItem('nyayadesk_clients_v1');
      return saved ? JSON.parse(saved) : INITIAL_SAMPLE_CLIENTS;
    } catch {
      return INITIAL_SAMPLE_CLIENTS;
    }
  });

  const [profile, setProfile] = useState<AdvocateProfile>(() => {
    try {
      const saved = localStorage.getItem('nyayadesk_profile_v1');
      return saved ? JSON.parse(saved) : DEFAULT_ADVOCATE_PROFILE;
    } catch {
      return DEFAULT_ADVOCATE_PROFILE;
    }
  });

  const [savedDocs, setSavedDocs] = useState<SavedDocument[]>(() => {
    try {
      const saved = localStorage.getItem('nyayadesk_docs_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Cross-module navigation state
  const [drafterPreselect, setDrafterPreselect] = useState<{
    clientId: string;
    docType: SavedDocument['docType'];
  } | null>(null);

  const [corpusTarget, setCorpusTarget] = useState<{
    actCode: string;
    sectionNum?: string;
    query?: string;
  } | null>(null);

  // PWA Install Prompt & Offline Cache Status
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    localStorage.setItem('nyayadesk_clients_v1', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('nyayadesk_profile_v1', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('nyayadesk_docs_v1', JSON.stringify(savedDocs));
  }, [savedDocs]);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      setActiveTab('tools');
    }
  };

  const NAV_ITEMS: Array<{ id: MainTab; label: string; shortLabel: string; icon: React.ReactNode }> = [
    {
      id: 'clients',
      label: 'Clients & Fees',
      shortLabel: 'Clients',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'drafter',
      label: 'Agreements & Quotations',
      shortLabel: 'Drafts',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: 'converter',
      label: 'IPC/BNS • CrPC/BNSS • IEA/BSA',
      shortLabel: 'Converter',
      icon: <ArrowLeftRight className="w-4 h-4" />
    },
    {
      id: 'laws',
      label: 'Indian Laws & Case Laws',
      shortLabel: 'Bare Acts',
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      id: 'tools',
      label: 'Lawyer Tools & Phone Install',
      shortLabel: 'Tools/App',
      icon: <Briefcase className="w-4 h-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20 md:pb-10">
      {/* Top Professional Chamber Header */}
      <header className="bg-slate-950 text-white sticky top-0 z-40 border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs shrink-0">
              <Scale className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg tracking-tight leading-none">
                  NyayaDesk
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                  Advocate Suite
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5 truncate max-w-[210px] sm:max-w-md">
                {profile.advocateName} • {profile.enrollmentNo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                isOnline ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {isOnline ? (
                <>
                  <CheckCircle2 className="w-3 h-3" /> Offline-Ready
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3" /> Working Offline
                </>
              )}
            </span>

            <button
              onClick={triggerInstall}
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install on Android / iOS</span>
              <span className="sm:hidden">Install</span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation Bar */}
        <div className="hidden md:block bg-slate-900 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
                    active
                      ? 'border-amber-400 text-amber-400 bg-slate-800/50'
                      : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/30'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
        {activeTab === 'clients' && (
          <ClientsModule
            clients={clients}
            setClients={setClients}
            profile={profile}
            onOpenDrafterForClient={(client, docType) => {
              setDrafterPreselect({ clientId: client.id, docType });
              setActiveTab('drafter');
            }}
            onJumpToSectionSearch={(query) => {
              setCorpusTarget({ actCode: '', query });
              setActiveTab('laws');
            }}
          />
        )}

        {activeTab === 'drafter' && (
          <DrafterModule
            clients={clients}
            profile={profile}
            savedDocs={savedDocs}
            setSavedDocs={setSavedDocs}
            preselectedClientId={drafterPreselect?.clientId}
            preselectedDocType={drafterPreselect?.docType}
          />
        )}

        {activeTab === 'converter' && (
          <ConverterModule
            onOpenSectionInCorpus={(actCode, sectionNum) => {
              setCorpusTarget({ actCode, sectionNum });
              setActiveTab('laws');
            }}
          />
        )}

        {activeTab === 'laws' && (
          <LawCorpusModule
            externalTarget={corpusTarget}
            onClearExternalTarget={() => setCorpusTarget(null)}
          />
        )}

        {activeTab === 'tools' && (
          <ToolsAndInstallModule
            profile={profile}
            setProfile={setProfile}
            clients={clients}
            setClients={setClients}
            savedDocs={savedDocs}
            setSavedDocs={setSavedDocs}
            deferredInstallPrompt={deferredPrompt}
            onTriggerInstall={triggerInstall}
          />
        )}
      </main>

      {/* Mobile Bottom Tab Bar (Native iOS / Android Ergonomics) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950 text-white border-t border-slate-800 grid grid-cols-5 pb-safe">
        {NAV_ITEMS.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-2.5 px-1 text-[10px] font-semibold transition cursor-pointer ${
                active ? 'text-amber-400' : 'text-slate-400'
              }`}
            >
              {item.icon}
              <span className="mt-1 truncate max-w-full">{item.shortLabel}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default App;
