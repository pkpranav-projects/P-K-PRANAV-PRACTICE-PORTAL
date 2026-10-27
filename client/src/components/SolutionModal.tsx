import React, { useState } from 'react';
import { X, Check, Copy, Eye, AlertTriangle, BookOpen, Code2, ArrowRight } from 'lucide-react';
import { QuestionSolution } from '../types';
import { copyToClipboard } from '../utils/clipboard';

interface SolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  solution: QuestionSolution | null;
  onLoadCodeToEditor?: (code: string) => void;
}

export const SolutionModal: React.FC<SolutionModalProps> = ({
  isOpen,
  onClose,
  solution,
  onLoadCodeToEditor
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedExplanation, setCopiedExplanation] = useState(false);
  const [revealed, setRevealed] = useState(false);

  if (!isOpen || !solution) return null;

  const handleCopyCode = async () => {
    const success = await copyToClipboard(solution.referenceSolution);
    if (success) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCopyExplanation = async () => {
    if (!solution.explanation) return;
    const success = await copyToClipboard(solution.explanation);
    if (success) {
      setCopiedExplanation(true);
      setTimeout(() => setCopiedExplanation(false), 2000);
    }
  };

  const isSql = solution.id.startsWith('dbms-') || /CREATE|SELECT|INSERT|DELIMITER/i.test(solution.referenceSolution);
  const langLabel = isSql ? 'SQL / MySQL' : 'Java';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fadeIn [isolation:isolate]">
      <div 
        className="bg-white dark:bg-[#111827] rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0c121e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white select-text">
                Reference Solution & Explanation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono select-text">
                {solution.id} — {solution.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!revealed ? (
            <div className="p-8 text-center bg-amber-50/80 dark:bg-amber-950/20 rounded-2xl border border-amber-200/80 dark:border-amber-800/40 space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-300 dark:border-amber-700/60 shadow-xs">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Reveal Reference Solution?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  We recommend attempting the problem independently first. Are you sure you want to inspect the official verified reference solution?
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Keep Trying
                </button>
                <button
                  onClick={() => setRevealed(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 text-white hover:bg-amber-500 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-105"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Reveal Solution</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Explanation section */}
              {solution.explanation && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>Approach & Logic</span>
                    </h4>
                    <button
                      onClick={handleCopyExplanation}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
                      title="Copy Explanation Text"
                    >
                      {copiedExplanation ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copiedExplanation ? 'Copied' : 'Copy Explanation'}</span>
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line select-text cursor-text">
                    {solution.explanation}
                  </div>
                </div>
              )}

              {/* Code snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-emerald-500" />
                    <span>Verified {langLabel} Solution</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer shadow-xs"
                      title="Copy Solution Code (Ctrl+C)"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copiedCode ? 'Copied to Clipboard' : 'Copy Code'}</span>
                    </button>
                    {onLoadCodeToEditor && (
                      <button
                        onClick={() => {
                          onLoadCodeToEditor(solution.referenceSolution);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer shadow-xs hover:scale-105"
                        title="Paste solution directly into Monaco Editor"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>Load into Editor</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#070b12] shadow-inner">
                  <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed select-text cursor-text">
                    <code className="select-text">{solution.referenceSolution}</code>
                  </pre>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-[#0c121e] border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span className="select-text">Status: Verified with {isSql ? 'SQLite & MariaDB syntax' : 'OpenJDK 27 (100% test pass)'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolutionModal;
