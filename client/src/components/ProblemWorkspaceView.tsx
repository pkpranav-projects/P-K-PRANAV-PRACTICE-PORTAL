import React, { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import {
  Play,
  Send,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Sparkles,
  Image,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Terminal,
  FileCode,
  HelpCircle,
  Eye,
  Check,
  Copy,
  Columns
} from 'lucide-react';
import {
  QuestionDetail,
  QuestionSolution,
  RunResult,
  SubmissionRecord,
  SubmitResult
} from '../types';
import { api } from '../services/api';
import { ScreenshotModal } from './ScreenshotModal';
import { SolutionModal } from './SolutionModal';

interface ProblemWorkspaceViewProps {
  questionId: string;
  theme: 'dark' | 'oled' | 'light' | 'system';
  onNavigateQuestion: (newQuestionId: string) => void;
  onQuestionSolved?: () => void;
  allQuestionIds: string[];
  isAbsoluteFullscreen?: boolean;
  onToggleAbsoluteFullscreen?: () => void;
}

export const ProblemWorkspaceView: React.FC<ProblemWorkspaceViewProps> = ({
  questionId,
  theme,
  onNavigateQuestion,
  onQuestionSolved,
  allQuestionIds,
  isAbsoluteFullscreen = false,
  onToggleAbsoluteFullscreen
}) => {
  // Data states
  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

  // Layout & Tabs
  const [leftTab, setLeftTab] = useState<'problem' | 'examples' | 'hints'>('problem');
  const [bottomTab, setBottomTab] = useState<'run' | 'submit' | 'history'>('run');
  const [fontSize, setFontSize] = useState<number>(14);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  // Toggle Zen Focus Mode (Code Only Fullscreen)
  const toggleZenMode = useCallback(() => {
    setIsZenMode((prev) => {
      const next = !prev;
      if (next) {
        if (!document.fullscreenElement && onToggleAbsoluteFullscreen) {
          onToggleAbsoluteFullscreen();
        }
      }
      return next;
    });
  }, [onToggleAbsoluteFullscreen]);

  // Keyboard shortcut: Alt + Z toggles Zen Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        toggleZenMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleZenMode]);

  // Execution states
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [history, setHistory] = useState<SubmissionRecord[]>([]);

  // Modals & Revelations
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [solutionData, setSolutionData] = useState<QuestionSolution | null>(null);
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Editor ref
  const editorRef = useRef<any>(null);

  // Determine Monaco editor theme
  const isDark =
    theme === 'dark' ||
    theme === 'oled' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const editorTheme = theme === 'oled' ? 'oled-black' : isDark ? 'vs-dark' : 'light';

  // Load question details
  const loadQuestion = useCallback(async () => {
    try {
      setLoading(true);
      const q = await api.getQuestion(questionId);
      setQuestion(q);
      
      // Initialize code: userDraft > starterCode > default template
      const initialCode = q.userDraft || q.starterCode || `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your solution here\n        \n    }\n}\n`;
      setCode(initialCode);
      setCustomInput(q.sampleInput || '');
      setRunResult(null);
      setSubmitResult(null);
      setRevealedHints({});

      // Fetch submission history for this question
      const subs = await api.getSubmissions(questionId, 10);
      setHistory(subs);
    } catch (err) {
      console.error('Failed to load question:', err);
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  // Debounced auto-save draft code
  useEffect(() => {
    if (!question || loading || !code) return;

    const timeout = setTimeout(async () => {
      try {
        setIsSavingDraft(true);
        await api.saveDraft(questionId, code);
        setDraftSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (err) {
        console.error('Auto-save error:', err);
      } finally {
        setIsSavingDraft(false);
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [code, questionId, question, loading]);

  // Keyboard shortcuts (Ctrl+Enter to Run, Ctrl+Shift+Enter to Submit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          handleSubmit();
        } else {
          handleRun();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, customInput, questionId]);

  // Run code against custom or sample input
  const handleRun = async () => {
    if (isRunning || !code) return;
    try {
      setIsRunning(true);
      setBottomTab('run');
      const res = await api.runCode(code, customInput);
      setRunResult(res);
    } catch (err: any) {
      setRunResult({
        status: 'Error',
        stdout: '',
        stderr: err.message || 'Execution failed',
        executionTimeMs: 0,
        exitCode: 1
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit code for full test-case evaluation
  const handleSubmit = async () => {
    if (isSubmitting || !code) return;
    try {
      setIsSubmitting(true);
      setBottomTab('submit');
      const res = await api.submitCode(questionId, code);
      setSubmitResult(res);

      if (res.status === 'Accepted') {
        setQuestion((prev) => prev ? { ...prev, solved: true } : null);
        if (onQuestionSolved) onQuestionSolved();
      }

      // Refresh history
      const subs = await api.getSubmissions(questionId, 10);
      setHistory(subs);
    } catch (err: any) {
      setSubmitResult({
        status: 'Internal Execution Error',
        passedCount: 0,
        totalCount: question?.testCases.length || 0,
        executionTimeMs: 0,
        errorMessage: err.message,
        testResults: []
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Bookmark
  const handleToggleBookmark = async () => {
    if (!question) return;
    const res = await api.toggleBookmark(question.id);
    setQuestion({ ...question, isBookmarked: res.isBookmarked });
  };

  // Toggle Revision
  const handleToggleRevision = async () => {
    if (!question) return;
    const res = await api.toggleRevision(question.id);
    setQuestion({ ...question, isRevision: res.isRevision });
  };

  // Fetch and show solution
  const handleOpenSolution = async () => {
    try {
      if (!solutionData) {
        const sol = await api.getSolution(questionId);
        setSolutionData(sol);
      }
      setShowSolutionModal(true);
    } catch (err) {
      console.error('Failed to load solution:', err);
    }
  };

  // Reset code to starter template
  const handleResetCode = () => {
    if (!question) return;
    const starter = question.starterCode || `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        \n    }\n}\n`;
    setCode(starter);
    setShowResetConfirm(false);
  };

  // Navigation indices
  const currentIndex = allQuestionIds.indexOf(questionId);
  const prevId = currentIndex > 0 ? allQuestionIds[currentIndex - 1] : null;
  const nextId = currentIndex < allQuestionIds.length - 1 ? allQuestionIds[currentIndex + 1] : null;

  if (loading || !question) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const diffColors = {
    Easy: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    Medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    Hard: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800'
  }[question.difficulty];

  const activeFullscreen = isFullscreen || isAbsoluteFullscreen || isZenMode;

  return (
    <div className={`space-y-4 pb-12 ${activeFullscreen ? 'fixed inset-0 z-50 bg-[#1a1a1a] dark:bg-[#000000] p-4 overflow-y-auto' : ''}`}>
      
      {/* Workspace Top Bar */}
      <div className="bg-white dark:bg-[#0c121e] px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Left: ID, Title, Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <button
              disabled={!prevId}
              onClick={() => prevId && onNavigateQuestion(prevId)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Previous Question"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
              {question.id}
            </span>
            <button
              disabled={!nextId}
              onClick={() => nextId && onNavigateQuestion(nextId)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Next Question"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white m-0">
            {question.title}
          </h2>

          <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${diffColors}`}>
            {question.difficulty}
          </span>

          <span className="hidden sm:inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {question.topic}
          </span>

          {question.solved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 px-3 py-1 rounded-full shadow-md shadow-emerald-600/30 animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SOLVED ✓</span>
            </span>
          )}
        </div>

        {/* Right: Action Buttons & Controls */}
        <div className="flex items-center gap-2">
          {/* View Screenshot button (Bank 1 only) or Bank 2 Badge */}
          {question.sourceScreenshot && question.sourceScreenshot.includes('.png') ? (
            <button
              onClick={() => setShowScreenshot(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Inspect original exam portal screenshot"
            >
              <Image className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Screenshot</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">Bank 2 Masterclass</span>
            </span>
          )}

          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              question.isBookmarked
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Bookmark this question"
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>

          {/* Revision Button */}
          <button
            onClick={handleToggleRevision}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              question.isRevision
                ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Flag for Revision"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Solution Modal Trigger */}
          <button
            onClick={handleOpenSolution}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900 border border-amber-200 dark:border-amber-800 transition-colors"
            title="View verified reference solution and explanation"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Solution</span>
          </button>

          {/* Zen Focus Mode: Hide Everything Except Coding */}
          <button
            onClick={toggleZenMode}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isZenMode
                ? 'bg-[#FFA116] text-black shadow-md shadow-[#FFA116]/30 ring-1 ring-[#FFA116]'
                : 'text-neutral-300 hover:text-white bg-[#262626] hover:bg-[#333333] border border-[#3e3e3e]'
            }`}
            title="Zen Focus: Hide everything except code editor (Alt + Z)"
            aria-label="Zen Focus Mode"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isZenMode ? 'Split View' : 'Zen Focus'}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => {
              if (onToggleAbsoluteFullscreen) {
                onToggleAbsoluteFullscreen();
              } else {
                setIsFullscreen(!isFullscreen);
              }
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              activeFullscreen
                ? 'text-[#FFA116] bg-[#FFA116]/10 ring-1 ring-[#FFA116]/40'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={activeFullscreen ? 'Exit Absolute Fullscreen (Esc)' : 'Absolute Fullscreen Workspace'}
            aria-label={activeFullscreen ? 'Exit Absolute Fullscreen' : 'Enter Absolute Fullscreen'}
          >
            {activeFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Workspace Split Grid */}
      <div className={`grid gap-4 ${isZenMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}>
        
        {/* Left Column: Problem Specs, Examples, Hints (5 cols - hidden in Zen Mode) */}
        {!isZenMode && (
          <div className="lg:col-span-5 bg-white dark:bg-[#0c121e] rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col h-[700px] overflow-hidden">
          {/* Sub-tabs header */}
          <div className="flex items-center border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-[#090d16] px-2 pt-2">
            <button
              onClick={() => setLeftTab('problem')}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
                leftTab === 'problem'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Problem Statement
            </button>
            <button
              onClick={() => setLeftTab('examples')}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
                leftTab === 'examples'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Test Cases ({question.testCases.length})
            </button>
            <button
              onClick={() => setLeftTab('hints')}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-1 ${
                leftTab === 'hints'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Hints ({question.hints?.length || 0})</span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {leftTab === 'problem' && (
              <div className="space-y-5 text-sm">
                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Description
                  </h4>
                  <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {question.description}
                  </div>
                </div>

                {/* Input Format */}
                {question.inputFormat && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Input Format
                    </h4>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-line leading-relaxed">
                      {question.inputFormat}
                    </div>
                  </div>
                )}

                {/* Output Format */}
                {question.outputFormat && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Output Format
                    </h4>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-line leading-relaxed">
                      {question.outputFormat}
                    </div>
                  </div>
                )}

                {/* Constraints */}
                {question.constraints && question.constraints.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Constraints
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      {question.constraints.map((c, i) => (
                        <li key={i} className="font-mono">{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sample Overview */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Sample 1
                    </h4>
                    <button
                      onClick={() => setCustomInput(question.sampleInput)}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      Use as Custom Input
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase">Input</span>
                      <pre className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">
                        {question.sampleInput || '(no input)'}
                      </pre>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase">Expected Output</span>
                      <pre className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">
                        {question.sampleOutput}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {leftTab === 'examples' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Every submission is rigorously compiled and executed against all {question.testCases.length} authentic test cases.
                </p>

                {question.testCases.map((tc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Test Case {idx + 1} {tc.isHidden ? '(Hidden)' : '(Sample)'}
                      </span>
                      {!tc.isHidden && (
                        <button
                          onClick={() => {
                            setCustomInput(tc.input);
                            setBottomTab('run');
                          }}
                          className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Load to Runner
                        </button>
                      )}
                    </div>

                    {tc.isHidden ? (
                      <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-500 text-center font-mono">
                        🔒 Hidden Test Case (Evaluated on submission)
                      </div>
                    ) : (
                      <div className="space-y-2 text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block mb-1">Input</span>
                          <pre className="p-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 overflow-x-auto">
                            {tc.input}
                          </pre>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block mb-1">Expected Output</span>
                          <pre className="p-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 overflow-x-auto">
                            {tc.expectedOutput}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {leftTab === 'hints' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Need a hint without spoiling the entire solution? Reveal progressive hints one by one.
                </p>

                {question.hints && question.hints.length > 0 ? (
                  question.hints.map((hint, idx) => {
                    const isRevealed = revealedHints[idx];
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            Hint {idx + 1}
                          </span>
                          {!isRevealed && (
                            <button
                              onClick={() => setRevealedHints((prev) => ({ ...prev, [idx]: true }))}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Reveal</span>
                            </button>
                          )}
                        </div>

                        {isRevealed ? (
                          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed animate-fadeIn">
                            {hint}
                          </div>
                        ) : (
                          <div className="p-2 text-center text-xs text-slate-400 italic">
                            Click reveal to view this progressive hint.
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center p-8 text-xs text-slate-400">
                    No progressive hints recorded for this problem.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

        {/* Right Column: Code Editor & Execution Drawers (Full width in Zen Mode) */}
        <div className={`${isZenMode ? 'w-full flex flex-col space-y-4' : 'lg:col-span-7 flex flex-col space-y-4'}`}>
          
          {/* Editor Header Bar */}
          <div className="bg-white dark:bg-[#0c121e] rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-[#090d16]">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  Main.java
                </span>
                {isSavingDraft ? (
                  <span className="text-[10px] text-amber-500 animate-pulse font-mono">
                    Saving draft...
                  </span>
                ) : draftSavedAt ? (
                  <span className="text-[10px] text-slate-400 font-mono">
                    Saved {draftSavedAt}
                  </span>
                ) : null}
              </div>

              {/* Editor controls: Font size, Zen Focus, Reset */}
              <div className="flex items-center gap-3">
                {/* Zen Code-Only toggle on Editor header */}
                <button
                  onClick={toggleZenMode}
                  className={`px-2 py-0.5 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer ${
                    isZenMode
                      ? 'text-[#FFA116] bg-[#FFA116]/10 font-bold border border-[#FFA116]/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Toggle Zen Focus: Code Only (Alt+Z)"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>{isZenMode ? 'Split' : 'Zen'}</span>
                </button>

                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <span className="text-[10px] uppercase font-semibold">Font</span>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="bg-slate-100 dark:bg-slate-800 border-none rounded text-xs px-1.5 py-0.5 text-slate-700 dark:text-slate-200 focus:outline-none"
                  >
                    <option value={12}>12px</option>
                    <option value={14}>14px</option>
                    <option value={16}>16px</option>
                    <option value={18}>18px</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="p-1 rounded text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                  title="Reset code to starter template"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Monaco Editor Container */}
            <div className={`w-full transition-all duration-200 ${isZenMode ? 'h-[calc(100vh-270px)] min-h-[500px]' : activeFullscreen ? 'h-[550px]' : 'h-[400px]'}`}>
              <Editor
                height="100%"
                language="java"
                theme={editorTheme}
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={(editor, monaco) => {
                  editorRef.current = editor;
                  try {
                    monaco.editor.defineTheme('oled-black', {
                      base: 'vs-dark',
                      inherit: true,
                      rules: [],
                      colors: {
                        'editor.background': '#000000',
                        'editorGutter.background': '#000000',
                        'editorLineNumber.foreground': '#555555',
                        'editorLineNumber.activeForeground': '#FFA116',
                        'editor.lineHighlightBackground': '#0c0c0c'
                      }
                    });
                    if (theme === 'oled') {
                      monaco.editor.setTheme('oled-black');
                    }
                  } catch (e) {}
                }}
                options={{
                  fontSize,
                  fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true,
                  tabSize: 4,
                  lineNumbers: 'on',
                  renderLineHighlight: 'all',
                  scrollbar: {
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8
                  }
                }}
              />
            </div>

            {/* Editor Action Bottom Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                Ctrl+Enter to Run · Ctrl+Shift+Enter to Submit
              </span>

              <div className="flex items-center gap-2 ml-auto">
                {/* Run Button */}
                <button
                  onClick={handleRun}
                  disabled={isRunning || isSubmitting}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-500 fill-current" />
                  <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                </button>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isRunning || isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 shadow-sm transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Evaluating...' : 'Submit Code'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Execution & Results Panel (Drawer) */}
          <div className="bg-white dark:bg-[#0c121e] rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden flex flex-col h-[280px]">
            {/* Drawer Tabs */}
            <div className="flex items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-[#090d16]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBottomTab('run')}
                  className={`py-2 text-xs font-semibold border-b-2 transition-colors ${
                    bottomTab === 'run'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Console & Custom Run
                </button>
                <button
                  onClick={() => setBottomTab('submit')}
                  className={`py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                    bottomTab === 'submit'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <span>Test Results</span>
                  {submitResult && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        submitResult.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {submitResult.passedCount}/{submitResult.totalCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setBottomTab('history')}
                  className={`py-2 text-xs font-semibold border-b-2 transition-colors ${
                    bottomTab === 'history'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  History ({history.length})
                </button>
              </div>

              {/* Status summary pill */}
              <div className="text-[11px] font-mono text-slate-400">
                {bottomTab === 'run' && runResult && (
                  <span>Status: {runResult.status} ({runResult.executionTimeMs}ms)</span>
                )}
                {bottomTab === 'submit' && submitResult && (
                  <span className={submitResult.status === 'Accepted' ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                    {submitResult.status} ({submitResult.executionTimeMs}ms)
                  </span>
                )}
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4">
              
              {/* Tab 1: Run & Custom Input */}
              {bottomTab === 'run' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Custom Input Textarea */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold uppercase text-slate-400">
                          Standard Input (stdin)
                        </label>
                        <button
                          onClick={() => setCustomInput('')}
                          className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          Clear
                        </button>
                      </div>
                      <textarea
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="Enter input for Scanner..."
                        className="w-full h-24 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Standard Output Preview */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold uppercase text-slate-400">
                          Standard Output (stdout)
                        </label>
                        {runResult?.executionTimeMs ? (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {runResult.executionTimeMs}ms
                          </span>
                        ) : null}
                      </div>
                      <pre className="w-full h-24 p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 overflow-auto whitespace-pre-wrap">
                        {runResult ? (
                          runResult.stderr ? (
                            <span className="text-rose-400">{runResult.stderr}</span>
                          ) : (
                            runResult.stdout || <span className="text-slate-600">(no output)</span>
                          )
                        ) : (
                          <span className="text-slate-600">Click &quot;Run Code&quot; to execute Java code against input.</span>
                        )}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Test Case Evaluation Results */}
              {bottomTab === 'submit' && (
                <div className="space-y-4">
                  {!submitResult ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      Click &quot;Submit Code&quot; to evaluate your Java program against all hidden and sample test cases.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Overall Verdict Banner */}
                      <div
                        className={`p-3.5 rounded-xl border flex items-center justify-between ${
                          submitResult.status === 'Accepted'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {submitResult.status === 'Accepted' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-500" />
                          )}
                          <div>
                            <div className="text-sm font-bold">
                              {submitResult.status}
                            </div>
                            <div className="text-[11px] opacity-80">
                              {submitResult.passedCount} of {submitResult.totalCount} test cases passed ({submitResult.executionTimeMs}ms total)
                            </div>
                          </div>
                        </div>

                        {submitResult.status === 'Accepted' && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-sm">
                            🎉 100% Correct
                          </span>
                        )}
                      </div>

                      {/* Formatted compiler diagnostics if compilation failed */}
                      {submitResult.errorMessage && (
                        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 space-y-3 animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5 font-mono">
                              <AlertTriangle className="w-4 h-4 text-rose-400" />
                              <span>Java Compiler (javac) Diagnostics</span>
                            </span>
                            <span className="text-[10px] font-mono text-rose-400 bg-rose-900/60 px-2 py-0.5 rounded border border-rose-700">
                              Exit Code 1
                            </span>
                          </div>

                          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-rose-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {submitResult.errorMessage}
                          </div>

                          <div className="text-[11px] text-slate-300 space-y-1 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                            <span className="font-semibold text-rose-300 block">💡 Troubleshooting Hints:</span>
                            <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                              <li>Check line numbers and carat markers (^) shown above.</li>
                              <li>Verify semicolons, curly braces, and variable declarations.</li>
                              <li>Ensure public class is named Main or matches filename.</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Test case breakdown list */}
                      <div className="space-y-2">
                        {submitResult.testResults.map((tr) => (
                          <div
                            key={tr.testIndex}
                            className={`p-3 rounded-lg border text-xs ${
                              tr.passed
                                ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-800 dark:text-slate-200'
                                : 'bg-rose-500/5 border-rose-500/20 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold flex items-center gap-1.5">
                                {tr.passed ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                                )}
                                <span>Test Case #{tr.testIndex} {tr.isHidden ? '(Hidden Exam Test)' : '(Sample Test)'}</span>
                              </span>
                              <span className="font-mono text-[10px] text-slate-400">
                                {tr.executionTimeMs ? `${tr.executionTimeMs}ms` : ''}
                              </span>
                            </div>

                            {/* Failure details if sample test case */}
                            {!tr.passed && !tr.isHidden && (
                              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1 font-mono text-[11px]">
                                {tr.expectedOutput !== undefined && (
                                  <div>
                                    <span className="text-slate-400">Expected: </span>
                                    <span className="text-emerald-400 font-bold">{tr.expectedOutput}</span>
                                  </div>
                                )}
                                {tr.actualOutput !== undefined && (
                                  <div>
                                    <span className="text-slate-400">Your Output: </span>
                                    <span className="text-rose-400 font-bold">{tr.actualOutput}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Failure explanation for hidden test */}
                            {!tr.passed && tr.isHidden && (
                              <div className="mt-1 text-[11px] text-slate-400 italic">
                                Hidden test case failed. Check corner cases, boundary conditions, zero values, or line breaks.
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Submission History */}
              {bottomTab === 'history' && (
                <div className="space-y-3">
                  {history.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No previous submissions recorded for this question.
                    </div>
                  ) : (
                    history.map((h) => (
                      <div
                        key={h.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                              h.status === 'Accepted'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {h.status}
                          </span>
                          <span className="text-slate-500 font-mono text-[11px]">
                            {h.passedCount}/{h.totalCount} passed
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-slate-400 font-mono text-[10px]">
                          <span>{h.executionTimeMs}ms</span>
                          <span>{h.submittedAt}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* Screenshot Modal */}
      <ScreenshotModal
        isOpen={showScreenshot}
        onClose={() => setShowScreenshot(false)}
        screenshotName={question.sourceScreenshot}
        questionTitle={question.title}
      />

      {/* Solution Modal */}
      <SolutionModal
        isOpen={showSolutionModal}
        onClose={() => setShowSolutionModal(false)}
        solution={solutionData}
        onLoadCodeToEditor={(newCode) => setCode(newCode)}
      />

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-amber-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reset Code to Template?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to discard your edits and restore the starter Java code? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleResetCode}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
              >
                Reset Code
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
