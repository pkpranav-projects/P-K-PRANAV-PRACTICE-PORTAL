import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  GraduationCap,
  Search,
  Globe,
  Monitor,
  Code2,
  BookOpen,
  Presentation,
  FileText,
  ExternalLink,
  Eye,
  X,
  Maximize2,
  Minimize2,
  ArrowUpDown,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { CurriculumItem } from '../types';
import { api } from '../services/api';

interface CurriculumViewProps {
  onSelectQuestion: (questionId: string) => void;
}

type SortOption = 'sequence-asc' | 'sequence-desc' | 'title-asc' | 'time-asc' | 'format';

export const CurriculumView: React.FC<CurriculumViewProps> = ({ onSelectQuestion }) => {
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('sequence-asc');
  const [openingFile, setOpeningFile] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // In-App Document Viewer Modal State
  const [activeModalDoc, setActiveModalDoc] = useState<CurriculumItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await api.getCurriculum();
        setCurriculum(data);
      } catch (err) {
        console.error('Failed to load curriculum:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (activeModalDoc) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeModalDoc]);

  // Handle ESC key to close modal
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setActiveModalDoc(null);
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const modules = useMemo(() => {
    const set = new Set<string>();
    curriculum.forEach((c) => set.add(c.module));
    return ['All', ...Array.from(set)];
  }, [curriculum]);

  const filteredItems = useMemo(() => {
    let list = curriculum.filter((item) => {
      if (selectedModule !== 'All' && item.module !== selectedModule) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesFile = item.filename.toLowerCase().includes(q);
        const matchesModule = item.module.toLowerCase().includes(q);
        const matchesDesc = item.description.some((d) => d.toLowerCase().includes(q));
        if (!matchesTitle && !matchesFile && !matchesModule && !matchesDesc) return false;
      }
      return true;
    });

    return list.sort((a, b) => {
      switch (sortBy) {
        case 'sequence-asc':
          return a.sequence - b.sequence;
        case 'sequence-desc':
          return b.sequence - a.sequence;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'time-asc':
          return a.estimatedMinutes - b.estimatedMinutes;
        case 'format':
          return a.format.localeCompare(b.format) || a.sequence - b.sequence;
        default:
          return a.sequence - b.sequence;
      }
    });
  }, [curriculum, selectedModule, search, sortBy]);

  const getDocUrls = (filename: string) => {
    const encoded = encodeURIComponent(filename);
    const viewUrl = `/api/documents/view/${encoded}`;
    const rawUrl = `/api/documents/raw/${encoded}`;
    const absoluteViewUrl = `${window.location.origin}${viewUrl}`;
    return { viewUrl, rawUrl, absoluteViewUrl };
  };

  const handleOpenFile = async (filename: string, targetApp: 'edge' | 'office' | 'system' = 'edge') => {
    const actionKey = `${filename}-${targetApp}`;
    const { viewUrl, absoluteViewUrl } = getDocUrls(filename);

    try {
      setOpeningFile(actionKey);
      const isPdf = filename.toLowerCase().endsWith('.pdf');
      const isPpt = filename.toLowerCase().includes('.ppt');
      const isWord = filename.toLowerCase().includes('.doc');

      if (targetApp === 'edge') {
        // 1. Instantly open in a new browser tab (native rendering in Edge/Chrome with zero download)
        window.open(viewUrl, '_blank');

        // 2. Also invoke the native Windows microsoft-edge: protocol to ensure Microsoft Edge launches
        const isEdge = /Edg\//i.test(navigator.userAgent);
        if (!isEdge) {
          const protocolLink = document.createElement('a');
          protocolLink.href = `microsoft-edge:${absoluteViewUrl}`;
          protocolLink.target = '_blank';
          document.body.appendChild(protocolLink);
          protocolLink.click();
          document.body.removeChild(protocolLink);
        }

        setToastMessage(`Opening ${filename} in Microsoft Edge (Zero download)...`);

        // 3. Notify backend to trigger Start-Process msedge via PowerShell as desktop fallback
        const res = await api.openDocument(filename, 'edge');
        setToastMessage(`✓ ${res.message}`);
        setTimeout(() => setToastMessage(null), 3500);
        return;
      }

      if (targetApp === 'office') {
        const appName = isPpt ? 'Microsoft PowerPoint' : isWord ? 'Microsoft Word' : 'Microsoft Office';
        setToastMessage(`Opening ${filename} in ${appName}...`);

        try {
          const res = await api.openDocument(filename, 'office');
          setToastMessage(`✓ ${res.message}`);
        } catch (officeErr: any) {
          // If Office has an error (e.g. 0xc0000142), seamlessly open the web PDF version
          setToastMessage(`⚠️ Office unavailable: Opening web view in Edge/Browser instead...`);
          window.open(viewUrl, '_blank');
        }
        setTimeout(() => setToastMessage(null), 4500);
        return;
      }

      // Default desktop application
      window.open(viewUrl, '_blank');
      await api.openDocument(filename, 'system');
      setToastMessage(`✓ Opened ${filename}`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      setToastMessage(`❌ Error: ${err.message}`);
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setOpeningFile(null);
    }
  };

  // Map modules to related question IDs
  const getRelatedQuestionId = (mod: string, title: string) => {
    if (title.includes('String')) return 'java-001';
    if (title.includes('Array')) return 'java-007';
    if (title.includes('Matrix')) return 'java-015';
    if (title.includes('Custom Exception')) return 'java-023';
    if (title.includes('Exception')) return 'java-024';
    if (title.includes('File') || title.includes('Stream')) return 'java-018';
    if (title.includes('Binary')) return 'java-025';
    if (title.includes('Inheritance') || title.includes('Interface') || title.includes('Constructor')) return 'java-008';
    if (title.includes('List') || title.includes('ArrayList')) return 'java-010';
    if (title.includes('Thread')) return 'java-026';
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 animate-fadeIn max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-2xl text-xs font-mono flex items-center gap-2 animate-bounce [isolation:isolate]">
          <Globe className="w-4 h-4 text-sky-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* In-App Interactive Document Viewer Modal */}
      {activeModalDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-2 sm:p-4 animate-fadeIn [isolation:isolate]">
          <div
            className={`bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
              isFullscreen
                ? 'w-full h-full rounded-none border-0'
                : 'w-[96vw] max-w-6xl h-[92vh]'
            }`}
          >
            {/* Modal Header */}
            <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                  Step {activeModalDoc.sequence < 10 ? `0${activeModalDoc.sequence}` : activeModalDoc.sequence}
                </span>
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30 shrink-0">
                  {activeModalDoc.format === 'PDF' ? 'Native PDF' : `${activeModalDoc.format} · Web PDF`}
                </span>
                <div className="truncate">
                  <h3 className="text-xs sm:text-sm font-bold text-white truncate m-0">
                    {activeModalDoc.title}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 truncate block">
                    {activeModalDoc.filename} · {activeModalDoc.estimatedMinutes}m read · {activeModalDoc.sizeFormatted}
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Open in Edge Button */}
                <button
                  onClick={() => handleOpenFile(activeModalDoc.filename, 'edge')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm transition-all cursor-pointer"
                  title="Open directly in Microsoft Edge browser"
                >
                  <Globe className="w-3.5 h-3.5 text-sky-200" />
                  <span className="hidden sm:inline">Open in Edge</span>
                </button>

                {/* Open in New Tab */}
                <a
                  href={`/api/documents/view/${encodeURIComponent(activeModalDoc.filename)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700"
                  title="Open in new browser tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tab</span>
                </a>

                {/* Toggle Fullscreen */}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close Modal */}
                <button
                  onClick={() => {
                    setActiveModalDoc(null);
                    setIsFullscreen(false);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                  title="Close viewer (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Iframe Content */}
            <div className="flex-1 w-full bg-slate-950 relative">
              <iframe
                src={`/api/documents/view/${encodeURIComponent(activeModalDoc.filename)}`}
                className="w-full h-full border-0"
                title={activeModalDoc.title}
              />
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 p-6 text-white shadow-lg">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            <span>27 Study Guides & Lectures</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white m-0">
            Java Study Curriculum
          </h1>

          <p className="text-xs sm:text-sm text-slate-300">
            Step-by-step roadmap from foundations to concurrency. View inline, open in Edge, or launch in Office.
          </p>
        </div>

        <div className="absolute right-0 bottom-0 w-60 h-60 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Controls Bar: Search, Sorting, and Module Filters */}
      <div className="bg-white dark:bg-[#0c121e] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
        {/* Top Controls: Search + Sorting Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search guides by title, topic, filename (e.g. Exception, Generics, Section6)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Sorting Options Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500" />
              <span className="font-medium text-slate-500 dark:text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort guides order"
                className="bg-transparent text-slate-900 dark:text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="sequence-asc">Recommended Order (Step 1 → 27)</option>
                <option value="sequence-desc">Reverse Order (Step 27 → 1)</option>
                <option value="title-asc">Title (A → Z)</option>
                <option value="time-asc">Read Time (Shortest first)</option>
                <option value="format">Format (PDF, PPTX, DOCX)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Module Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {modules.map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedModule === mod
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>
      </div>

      {/* Curriculum Items List */}
      <div className="space-y-4">
        {filteredItems.map((doc) => {
          const isPdf = doc.format === 'PDF' || doc.filename.toLowerCase().endsWith('.pdf');
          const isPpt = doc.format === 'PPTX' || doc.format === 'PPT' || doc.filename.toLowerCase().includes('.ppt');
          const isWord = doc.format === 'DOCX' || doc.filename.toLowerCase().includes('.doc');

          const formatBadge = isPdf
            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-900/60'
            : isPpt
            ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400 border-orange-200 dark:border-orange-900/60'
            : isWord
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-900/60'
            : 'bg-slate-100 text-slate-700 border-slate-200';

          const relatedQ = getRelatedQuestionId(doc.module, doc.title);
          const isOpeningEdge = openingFile === `${doc.filename}-edge`;
          const isOpeningOffice = openingFile === `${doc.filename}-office`;
          const isOpeningSystem = openingFile === `${doc.filename}-system`;

          return (
            <div
              key={doc.id}
              className="bg-white dark:bg-[#0c121e] rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-start justify-between gap-5 group"
            >
              <div className="space-y-3 flex-1">
                {/* Meta Top: Sequence Number & Module */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/70">
                    Step {doc.sequence < 10 ? `0${doc.sequence}` : doc.sequence}
                  </span>

                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${formatBadge}`}>
                    {doc.format} {doc.format !== 'PDF' ? '· Web PDF' : ''}
                  </span>

                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {doc.module}
                  </span>

                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                    · {doc.estimatedMinutes}m read · {doc.sizeFormatted}
                  </span>
                </div>

                {/* Title & File link */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white m-0">
                    {doc.title}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    {doc.filename}
                  </span>
                </div>

                {/* Description */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {doc.description.map((line, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions & Related Question */}
              <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end justify-between gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800/80 min-w-[240px]">
                {/* 1. Primary Action: View Document in Fullscreen Modal Reader */}
                <button
                  onClick={() => setActiveModalDoc(doc)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-sm hover:shadow-indigo-500/20 transition-all hover:scale-[1.02] cursor-pointer w-full"
                  title="View document in fullscreen reader modal (zero download)"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-200" />
                  <span>{isPpt ? 'View Presentation' : 'View Document'}</span>
                </button>

                {/* 2. Direct Browser / Edge & Desktop Options */}
                <div className="flex items-center gap-1.5 w-full">
                  {/* Open in Microsoft Edge */}
                  <button
                    onClick={() => handleOpenFile(doc.filename, 'edge')}
                    disabled={Boolean(openingFile)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-sm transition-all hover:scale-[1.02] disabled:opacity-50 whitespace-nowrap cursor-pointer"
                    title="Opens directly in Microsoft Edge's built-in PDF viewer without downloading"
                  >
                    <Globe className="w-3.5 h-3.5 text-sky-200" />
                    <span>{isOpeningEdge ? 'Opening...' : 'Open in Edge'}</span>
                  </button>

                  {/* Desktop App Launcher (Office / PDF reader) */}
                  {isPpt ? (
                    <button
                      onClick={() => handleOpenFile(doc.filename, 'office')}
                      disabled={Boolean(openingFile)}
                      className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors whitespace-nowrap cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
                      title="Opens in Microsoft PowerPoint desktop application"
                    >
                      <Presentation className="w-3 h-3 text-orange-400" />
                      <span>{isOpeningOffice ? 'Opening...' : 'PowerPoint'}</span>
                    </button>
                  ) : isWord ? (
                    <button
                      onClick={() => handleOpenFile(doc.filename, 'office')}
                      disabled={Boolean(openingFile)}
                      className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors whitespace-nowrap cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
                      title="Opens in Microsoft Word desktop application"
                    >
                      <FileText className="w-3 h-3 text-blue-400" />
                      <span>{isOpeningOffice ? 'Opening...' : 'Word'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenFile(doc.filename, 'system')}
                      disabled={Boolean(openingFile)}
                      className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors whitespace-nowrap cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
                      title="Opens in default desktop PDF application"
                    >
                      <Monitor className="w-3 h-3 text-slate-400" />
                      <span>{isOpeningSystem ? 'Launching...' : 'Desktop'}</span>
                    </button>
                  )}
                </div>

                {/* Related Practice Challenge Button */}
                {relatedQ && (
                  <button
                    onClick={() => onSelectQuestion(relatedQ)}
                    className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60 transition-colors mt-1 cursor-pointer w-full"
                    title={`Practice related portal challenge (${relatedQ})`}
                  >
                    <Code2 className="w-3 h-3" />
                    <span>Practice {relatedQ}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
