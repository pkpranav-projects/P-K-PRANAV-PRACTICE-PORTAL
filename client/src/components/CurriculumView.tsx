import React, { useState, useMemo, useEffect } from 'react';
import {
  GraduationCap,
  ExternalLink,
  Search,
  FileText,
  Clock,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Code2,
  Sparkles,
  Layers,
  FolderOpen
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

  const handleOpenFile = async (filename: string) => {
    try {
      setOpeningFile(filename);
      setToastMessage(`Opening ${filename} in your default application...`);
      const res = await api.openDocument(filename);
      setTimeout(() => {
        setToastMessage(`✓ ${res.message}`);
        setTimeout(() => setToastMessage(null), 3000);
      }, 500);
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
    if (title.includes('File') || title.includes('Stream')) return 'java-018';
    if (title.includes('Binary')) return 'java-025';
    if (title.includes('Class') || title.includes('Inheritance')) return 'java-008';
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
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-2xl text-xs font-mono flex items-center gap-2 animate-bounce">
          <FolderOpen className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Master Study Order · 27 Curated Guides from documentss</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white m-0">
            Recommended Java Study Curriculum
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Follow this sequential roadmap to build complete mastery from core JVM architecture and primitive data types up to multithreading and object sorting. Click <strong>Open Local File</strong> to launch any document in your system viewer without redownloading.
          </p>

          <div className="flex items-center gap-4 pt-2 text-xs text-indigo-200/90 font-mono">
            <span>📚 27 Guides</span>
            <span>·</span>
            <span>📂 documentss Folder</span>
            <span>·</span>
            <span>⚡ Native System Launch</span>
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
          const formatBadge = {
            PDF: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-900/60',
            PPTX: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900/60',
            DOCX: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-900/60'
          }[doc.format];

          const relatedQ = getRelatedQuestionId(doc.module, doc.title);

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
              <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end justify-between gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800/80">
                {/* Main Open File Button */}
                <button
                  onClick={() => handleOpenFile(doc.filename)}
                  disabled={openingFile === doc.filename}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all hover:scale-[1.02] disabled:opacity-50 whitespace-nowrap"
                  title="Opens directly in your default OS reader with zero download"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>{openingFile === doc.filename ? 'Launching...' : 'Open Local File'}</span>
                </button>

                {/* Optional Web Preview */}
                <a
                  href={`/api/documents/raw/${encodeURIComponent(doc.filename)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Preview</span>
                </a>

                {/* Related Practice Challenge Button */}
                {relatedQ && (
                  <button
                    onClick={() => onSelectQuestion(relatedQ)}
                    className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60 transition-colors"
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
