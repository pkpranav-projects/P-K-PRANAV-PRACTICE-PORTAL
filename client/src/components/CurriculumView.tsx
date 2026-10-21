import React, { useState, useMemo, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Globe,
  Monitor,
  FolderOpen,
  Code2,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Presentation,
  FileText,
  ExternalLink
} from 'lucide-react';
import { CurriculumItem } from '../types';
import { api } from '../services/api';

interface CurriculumViewProps {
  onSelectQuestion: (questionId: string) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({ onSelectQuestion }) => {
  const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState('All');
  const [openingFile, setOpeningFile] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const modules = useMemo(() => {
    const set = new Set<string>();
    curriculum.forEach((c) => set.add(c.module));
    return ['All', ...Array.from(set)];
  }, [curriculum]);

  const filteredItems = useMemo(() => {
    return curriculum.filter((item) => {
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
    }).sort((a, b) => a.sequence - b.sequence);
  }, [curriculum, selectedModule, search]);

  const handleOpenFile = async (filename: string, targetApp: 'edge' | 'office' | 'system' = 'edge') => {
    const actionKey = `${filename}-${targetApp}`;
    try {
      setOpeningFile(actionKey);
      const isPdf = filename.toLowerCase().endsWith('.pdf');
      const isPpt = filename.toLowerCase().includes('.ppt');
      const isWord = filename.toLowerCase().includes('.doc');

      let appName = 'Desktop Application';
      if (isPdf && targetApp === 'edge') {
        appName = 'Microsoft Edge PDF Viewer';
      } else if (isPpt) {
        appName = 'Microsoft PowerPoint';
      } else if (isWord) {
        appName = 'Microsoft Word';
      } else {
        appName = 'Microsoft Office';
      }

      setToastMessage(`Opening ${filename} in ${appName} (Zero download)...`);

      // If already browsing in Microsoft Edge, open directly in a new tab immediately
      const isEdgeBrowser = /Edg\//i.test(navigator.userAgent);
      if (isPdf && targetApp === 'edge' && isEdgeBrowser) {
        window.open(`/api/documents/raw/${encodeURIComponent(filename)}`, '_blank');
      }

      const res = await api.openDocument(filename, targetApp);
      setTimeout(() => {
        setToastMessage(`✓ ${res.message}`);
        setTimeout(() => setToastMessage(null), 3500);
      }, 300);
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
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900/95 backdrop-blur-md text-white border border-slate-700 shadow-2xl text-xs font-mono flex items-center gap-2 animate-bounce">
          <Globe className="w-4 h-4 text-sky-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Master Study Order · 27 Curated Guides & Lectures</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white m-0">
            Recommended Java Study Curriculum
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Follow this sequential 27-step roadmap organized in chronological order from foundations to concurrency. Open <strong>PDFs in Microsoft Edge</strong> and <strong>presentations / documents in Microsoft Office</strong> directly with zero downloads.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-indigo-200/90 font-mono">
            <span>📚 27 Guides in Pedagogical Order</span>
            <span>·</span>
            <span>🌐 PDFs in Microsoft Edge</span>
            <span>·</span>
            <span>📊 Slides in PowerPoint</span>
            <span>·</span>
            <span>📝 Docs in Word</span>
            <span>·</span>
            <span>⚡ Zero Browser Downloads</span>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0c121e] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search guides by title, topic, filename (e.g. Exception, Generics, Section6)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Module Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {modules.map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
                    {doc.format}
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

                {/* Exact 4-Line Structured Description */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {doc.description.map((line, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-500 font-mono font-bold text-[10px] select-none mt-0.5">
                        L{idx + 1}:
                      </span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions & Related Question */}
              <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end justify-between gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800/80 min-w-[210px]">
                {isPdf ? (
                  <>
                    {/* Primary: Open in Microsoft Edge (PDFs only) */}
                    <button
                      onClick={() => handleOpenFile(doc.filename, 'edge')}
                      disabled={Boolean(openingFile)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white shadow-sm hover:shadow-indigo-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 whitespace-nowrap cursor-pointer w-full"
                      title="Opens directly in Microsoft Edge's built-in PDF viewer without downloading"
                    >
                      <Globe className="w-3.5 h-3.5 text-sky-200" />
                      <span>{isOpeningEdge ? 'Opening Edge...' : 'Open in Microsoft Edge'}</span>
                    </button>

                    <div className="flex items-center gap-1.5 w-full">
                      {/* Direct Browser Tab View Link */}
                      <a
                        href={`/api/documents/raw/${encodeURIComponent(doc.filename)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors whitespace-nowrap cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
                        title="View PDF directly in a new browser tab without downloading"
                      >
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                        <span>View Tab</span>
                      </a>

                      {/* Secondary: Open in Desktop PDF Viewer */}
                      <button
                        onClick={() => handleOpenFile(doc.filename, 'system')}
                        disabled={Boolean(openingFile)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors whitespace-nowrap cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
                        title="Opens in default desktop PDF application"
                      >
                        <Monitor className="w-3 h-3 text-slate-400" />
                        <span>{isOpeningSystem ? 'Launching...' : 'Desktop'}</span>
                      </button>
                    </div>
                  </>
                ) : isPpt ? (
                  <>
                    {/* Primary: Open in PowerPoint (Office) */}
                    <button
                      onClick={() => handleOpenFile(doc.filename, 'office')}
                      disabled={Boolean(openingFile)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white shadow-sm hover:shadow-orange-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 whitespace-nowrap cursor-pointer"
                      title="Opens presentation directly in Microsoft PowerPoint (Office)"
                    >
                      <Presentation className="w-3.5 h-3.5 text-orange-200" />
                      <span>{isOpeningOffice || isOpeningSystem ? 'Opening PowerPoint...' : 'Open in PowerPoint'}</span>
                    </button>

                    {/* Secondary: Open in Office / Desktop App */}
                    <button
                      onClick={() => handleOpenFile(doc.filename, 'system')}
                      disabled={Boolean(openingFile)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors whitespace-nowrap cursor-pointer"
                      title="Opens in Microsoft Office / Desktop app without downloading"
                    >
                      <Monitor className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isOpeningSystem ? 'Launching...' : 'Open in Office'}</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Primary: Open in Word (Office) */}
                    <button
                      onClick={() => handleOpenFile(doc.filename, 'office')}
                      disabled={Boolean(openingFile)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white shadow-sm hover:shadow-blue-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 whitespace-nowrap cursor-pointer"
                      title="Opens document directly in Microsoft Word (Office)"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-200" />
                      <span>{isOpeningOffice || isOpeningSystem ? 'Opening Word...' : 'Open in Word'}</span>
                    </button>

                    {/* Secondary: Open in Office / Desktop App */}
                    <button
                      onClick={() => handleOpenFile(doc.filename, 'system')}
                      disabled={Boolean(openingFile)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors whitespace-nowrap cursor-pointer"
                      title="Opens in Microsoft Office / Desktop app without downloading"
                    >
                      <Monitor className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isOpeningSystem ? 'Launching...' : 'Open in Office'}</span>
                    </button>
                  </>
                )}

                {/* Related Practice Challenge Button */}
                {relatedQ && (
                  <button
                    onClick={() => onSelectQuestion(relatedQ)}
                    className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60 transition-colors mt-1 cursor-pointer"
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
