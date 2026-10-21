import React, { useState, useMemo } from 'react';
import {
  Database,
  Terminal,
  Play,
  Sparkles,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  ExternalLink,
  Code2,
  Table,
  Check,
  ChevronRight,
  ChevronDown,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileCode2,
  AlertCircle
} from 'lucide-react';
import { QuestionSummary } from '../types';
import { ScreenshotModal } from './ScreenshotModal';
import { api } from '../services/api';
import { soundManager } from '../services/sound';

interface DBMSPracticeViewProps {
  questions: QuestionSummary[];
  onSelectQuestion: (questionId: string) => void;
  onNavigateToBank?: (bank: 'bank1' | 'bank2' | 'bank3' | 'bank4' | 'dbms' | 'all') => void;
}

interface SQLTemplate {
  name: string;
  category: string;
  code: string;
  input?: string;
  questionId?: string;
  description: string;
}

const PRELOADED_SQL_TEMPLATES: SQLTemplate[] = [
  {
    name: '1. Banking Fraud Trigger (Balance < 500)',
    category: 'Trigger (4FDF1)',
    questionId: 'dbms-001',
    description: 'Enforces minimum balance of 500 and prevents negative balance withdrawals.',
    input: '101 200\n101 400',
    code: `DELIMITER //
CREATE TRIGGER check_fraud_and_low_balance
BEFORE INSERT ON Transaction
FOR EACH ROW
BEGIN
    DECLARE cur_balance INT;
    SELECT balance INTO cur_balance FROM Account WHERE acc_no = NEW.acc_no;
    
    IF cur_balance - NEW.amount < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Fraud detected: Account balance cannot be negative';
    ELSEIF cur_balance - NEW.amount < 500 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Transaction rejected: Minimum balance of 500 must be maintained';
    END IF;
END //
DELIMITER ;`
  },
  {
    name: '2. SumOfDigits Stored Procedure',
    category: 'Procedure (35167)',
    questionId: 'dbms-007',
    description: 'Iterative procedure calculating the sum of digits of a non-negative integer.',
    input: '12345',
    code: `DELIMITER //
CREATE PROCEDURE SumOfDigits(IN num INT, OUT sum INT)
BEGIN
    SET sum = 0;
    WHILE num > 0 DO
        SET sum = sum + (num % 10);
        SET num = num DIV 10;
    END WHILE;
END //
DELIMITER ;`
  },
  {
    name: '3. CheckPalindrome Stored Procedure',
    category: 'Procedure (35167)',
    questionId: 'dbms-008',
    description: 'Determines whether an input string or integer reads identically backwards.',
    input: 'MADAM',
    code: `DELIMITER //
CREATE PROCEDURE CheckPalindrome(IN inputStr VARCHAR(255), OUT isPalindrome BOOLEAN)
BEGIN
    DECLARE reversedStr VARCHAR(255);
    SET reversedStr = REVERSE(inputStr);
    IF inputStr = reversedStr THEN
        SET isPalindrome = TRUE;
    ELSE
        SET isPalindrome = FALSE;
    END IF;
END //
DELIMITER ;`
  },
  {
    name: '4. Late Delivery Audit Trigger',
    category: 'Trigger (2AEFB)',
    questionId: 'dbms-004',
    description: 'Automated trigger logging delayed delivery records into an audit table with delayed status.',
    input: '101 2026-10-15 2026-10-18 Traffic delay',
    code: `DELIMITER //
CREATE TRIGGER log_late_deliveries
AFTER INSERT ON Deliveries
FOR EACH ROW
BEGIN
    IF NEW.actual_date > NEW.expected_date THEN
        INSERT INTO LateDeliveriesAudit (delivery_id, expected_date, actual_date, reason)
        VALUES (NEW.delivery_id, NEW.expected_date, NEW.actual_date, NEW.reason);
    END IF;
END //
DELIMITER ;`
  },
  {
    name: '5. FindLongestWordLength Procedure',
    category: 'Procedure (F5867)',
    questionId: 'dbms-011',
    description: 'Analyzes string tokens delimited by spaces to determine the length of the longest word.',
    input: 'Database Management Systems VTU Lab',
    code: `DELIMITER //
CREATE PROCEDURE FindLongestWordLength(IN text_string TEXT, OUT max_len INT)
BEGIN
    DECLARE word VARCHAR(255);
    DECLARE space_pos INT;
    SET max_len = 0;
    
    WHILE LENGTH(text_string) > 0 DO
        SET space_pos = LOCATE(' ', text_string);
        IF space_pos > 0 THEN
            SET word = SUBSTRING(text_string, 1, space_pos - 1);
            SET text_string = SUBSTRING(text_string, space_pos + 1);
        ELSE
            SET word = text_string;
            SET text_string = '';
        END IF;
        
        IF LENGTH(word) > max_len THEN
            SET max_len = LENGTH(word);
        END IF;
    END WHILE;
END //
DELIMITER ;`
  }
];

const MODULE_DEFINITIONS = [
  {
    id: 'all',
    label: 'All Modules (12)',
    testCode: 'ALL',
    description: 'All 12 DBMS lab challenges across Triggers & Stored Procedures'
  },
  {
    id: '4FDF1',
    label: 'Module 1: Fraud & Constraints',
    testCode: '4FDF1',
    description: 'Automated Fraud Detection, Inventory Control & Phone Standardization Triggers'
  },
  {
    id: '2AEFB',
    label: 'Module 2: Audit Logs & Events',
    testCode: '2AEFB',
    description: 'Late Delivery Audits, Defaulter Attendance & Gym Inactivation Triggers'
  },
  {
    id: '35167',
    label: 'Module 3: Math Stored Procedures',
    testCode: '35167',
    description: 'Sum of Digits, Palindrome Check & Greatest of Three Stored Procedures'
  },
  {
    id: 'F5867',
    label: 'Module 4: String Analytics Procedures',
    testCode: 'F5867',
    description: 'Average Score & Grade, Longest Word Length & Word Count Procedures'
  }
];

export const DBMSPracticeView: React.FC<DBMSPracticeViewProps> = ({
  questions,
  onSelectQuestion,
  onNavigateToBank
}) => {
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});
  
  // Playground state
  const [activeTemplate, setActiveTemplate] = useState<SQLTemplate>(PRELOADED_SQL_TEMPLATES[0]);
  const [playgroundCode, setPlaygroundCode] = useState<string>(PRELOADED_SQL_TEMPLATES[0].code);
  const [playgroundInput, setPlaygroundInput] = useState<string>(PRELOADED_SQL_TEMPLATES[0].input || '');
  const [playgroundOutput, setPlaygroundOutput] = useState<string>('');
  const [playgroundError, setPlaygroundError] = useState<string>('');
  const [playgroundExecutionTime, setPlaygroundExecutionTime] = useState<number | null>(null);
  const [isRunningPlayground, setIsRunningPlayground] = useState<boolean>(false);

  // Screenshot modal state
  const [screenshotModalOpen, setScreenshotModalOpen] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState('');
  const [selectedScreenshotTitle, setSelectedScreenshotTitle] = useState('');

  // Filter DBMS questions (Bank 4)
  const dbmsQuestions = useMemo(() => {
    return questions.filter((q) => q.bank === 'dbms' || q.id.startsWith('dbms-'));
  }, [questions]);

  // Solved stats
  const solvedCount = useMemo(() => {
    return dbmsQuestions.filter((q) => q.solved).length;
  }, [dbmsQuestions]);

  const totalCount = dbmsQuestions.length || 12;
  const progressPercent = Math.round((solvedCount / totalCount) * 100);

  // Filtered by selected module
  const filteredQuestions = useMemo(() => {
    if (selectedModule === 'all') return dbmsQuestions;

    const moduleMappings: Record<string, string[]> = {
      '4FDF1': ['dbms-001', 'dbms-002', 'dbms-003'],
      '2AEFB': ['dbms-004', 'dbms-005', 'dbms-006'],
      '35167': ['dbms-007', 'dbms-008', 'dbms-009'],
      'F5867': ['dbms-010', 'dbms-011', 'dbms-012']
    };

    const targetIds = moduleMappings[selectedModule] || [];
    return dbmsQuestions.filter((q) => targetIds.includes(q.id));
  }, [selectedModule, dbmsQuestions]);

  // Switch Playground Template
  const handleSelectTemplate = (tpl: SQLTemplate) => {
    setActiveTemplate(tpl);
    setPlaygroundCode(tpl.code);
    setPlaygroundInput(tpl.input || '');
    setPlaygroundOutput('');
    setPlaygroundError('');
    setPlaygroundExecutionTime(null);
  };

  // Run SQL in Playground
  const handleRunPlayground = async () => {
    if (isRunningPlayground || !playgroundCode.trim()) return;

    try {
      soundManager.playRun();
      setIsRunningPlayground(true);
      setPlaygroundOutput('');
      setPlaygroundError('');

      const res = await api.runCode(
        playgroundCode,
        playgroundInput,
        'sql',
        activeTemplate.questionId
      );

      setPlaygroundExecutionTime(res.executionTimeMs);
      if (res.exitCode === 0) {
        setPlaygroundOutput(res.stdout || 'Query executed successfully with 0 rows affected.');
      } else {
        soundManager.playError();
        setPlaygroundError(res.stderr || res.stdout || 'SQL Execution Error');
      }
    } catch (err: any) {
      soundManager.playError();
      setPlaygroundError(err.message || 'Execution failed');
    } finally {
      setIsRunningPlayground(false);
    }
  };

  const handleOpenScreenshot = (screenshotName: string, title: string) => {
    setSelectedScreenshot(screenshotName);
    setSelectedScreenshotTitle(title);
    setScreenshotModalOpen(true);
  };

  const toggleDetails = (id: string) => {
    setExpandedDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8 pb-16 animate-fadeIn max-w-[1500px] mx-auto select-none">
      {/* 1. Header Hero Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/40 border border-emerald-500/30 dark:border-emerald-500/20 shadow-2xl relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -mb-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>DBMS & SQL Lab</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                MySQL 8.0 & ANSI SQL
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Database & SQL Arena
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Triggers, Stored Procedures, and schema queries with instant sandbox execution.
            </p>
          </div>

          {/* Stat Tile */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-4 bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 min-w-[240px]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 font-medium">Lab Completion</span>
                <div className="text-2xl font-extrabold text-white font-mono mt-0.5">
                  {solvedCount} / {totalCount}
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono">
                {progressPercent}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>4 Modules</span>
              <span>12 Lab Challenges</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive SQL Playground & Sandbox */}
      <div className="rounded-2xl bg-white dark:bg-[#181818] border border-slate-200 dark:border-neutral-800 shadow-lg overflow-hidden">
        {/* Playground Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-[#202020] gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Interactive SQL & Procedure Playground</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-500 font-bold">
                  SANDBOX
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Write and execute triggers or stored procedures instantly with live test parameters
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Template Picker */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 dark:text-neutral-400 hidden sm:inline">Template:</span>
              <select
                value={activeTemplate.name}
                onChange={(e) => {
                  const found = PRELOADED_SQL_TEMPLATES.find((t) => t.name === e.target.value);
                  if (found) handleSelectTemplate(found);
                }}
                className="bg-white dark:bg-[#282828] border border-slate-300 dark:border-neutral-700 text-slate-800 dark:text-neutral-200 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {PRELOADED_SQL_TEMPLATES.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunPlayground}
              disabled={isRunningPlayground}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isRunningPlayground ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute SQL</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Playground Body: Left SQL Editor + Right Input & Terminal Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-neutral-800">
          {/* SQL Editor Area (7 Cols) */}
          <div className="lg:col-span-7 p-4 flex flex-col space-y-2 bg-slate-50/50 dark:bg-[#151515]">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
              <span className="font-mono font-semibold flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-amber-500" />
                <span>MySQL Query / Stored Procedure Script</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {activeTemplate.category}
              </span>
            </div>

            <textarea
              value={playgroundCode}
              onChange={(e) => setPlaygroundCode(e.target.value)}
              rows={12}
              spellCheck={false}
              className="w-full font-mono text-xs p-3 rounded-xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y leading-relaxed"
              placeholder="-- Enter your SQL Trigger, Stored Procedure, or Query script here..."
            />

            <p className="text-[11px] text-slate-400 dark:text-neutral-500 italic">
              Tip: Supports DELIMITER //, BEFORE/AFTER INSERT triggers, SIGNAL SQLSTATE exceptions, and procedure execution.
            </p>
          </div>

          {/* Test Input & Terminal Output Area (5 Cols) */}
          <div className="lg:col-span-5 p-4 flex flex-col space-y-3 bg-white dark:bg-[#181818]">
            {/* Input Parameter */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-neutral-300 flex items-center justify-between">
                <span>Test Parameters / Procedure Input</span>
                <span className="text-[10px] text-slate-400 font-normal">Optional</span>
              </label>
              <input
                type="text"
                value={playgroundInput}
                onChange={(e) => setPlaygroundInput(e.target.value)}
                placeholder="e.g. 101 200 or 12345"
                className="w-full font-mono text-xs px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#202020] border border-slate-200 dark:border-neutral-800 text-slate-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Output Box */}
            <div className="flex-1 flex flex-col space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-neutral-300">
                <span>Live Execution Result</span>
                {playgroundExecutionTime !== null && (
                  <span className="text-[10px] font-mono text-emerald-500 font-bold">
                    {playgroundExecutionTime} ms
                  </span>
                )}
              </div>

              <div className="flex-1 min-h-[140px] p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre leading-relaxed border border-slate-800">
                {isRunningPlayground ? (
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span>Executing in SQL Engine...</span>
                  </div>
                ) : playgroundError ? (
                  <div className="text-rose-400 flex items-start gap-1.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                    <div>{playgroundError}</div>
                  </div>
                ) : playgroundOutput ? (
                  <div className="text-emerald-400">{playgroundOutput}</div>
                ) : (
                  <div className="text-slate-500 italic">
                    Click &ldquo;Execute SQL&rdquo; above to run this script and inspect results.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Module Filter Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Table className="w-5 h-5 text-amber-500" />
              <span>Lab Problem Sets & Original Exam Photos</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Select a module below to inspect full problem statements, schema definitions, and original screenshots
            </p>
          </div>

          {onNavigateToBank && (
            <button
              onClick={() => onNavigateToBank('dbms')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View in Problem Bank View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Module Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {MODULE_DEFINITIONS.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setSelectedModule(mod.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                selectedModule === mod.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold shadow-md scale-[1.02]'
                  : 'bg-white dark:bg-[#202020] text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-neutral-800'
              }`}
            >
              <span>{mod.label}</span>
              {mod.testCode !== 'ALL' && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-500 font-bold">
                  {mod.testCode}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Question Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredQuestions.map((q) => {
          const isExpanded = expandedDetails[q.id];
          const diffBadge = {
            Easy: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
            Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
            Hard: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
          }[q.difficulty];

          return (
            <div
              key={q.id}
              className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-neutral-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/40 transition-all duration-200 shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Top */}
              <div className="p-5 space-y-3">
                {/* Header row: ID, Difficulty, Solved status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {q.id.toUpperCase()}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${diffBadge}`}>
                      {q.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 font-semibold rounded-md border text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                      <span className="opacity-70 font-normal">Lang:</span>
                      <span className="font-bold">SQL</span>
                    </span>

                    {q.solved ? (
                      <span
                        className="p-1 rounded-full bg-emerald-500/10 text-emerald-500"
                        title="Solved"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    ) : (
                      <span
                        className="p-1 rounded-full text-slate-300 dark:text-neutral-700"
                        title="Unsolved"
                      >
                        <Clock className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3
                    onClick={() => onSelectQuestion(q.id)}
                    className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors cursor-pointer line-clamp-2"
                  >
                    {q.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-neutral-400">
                      {q.topic}
                    </span>
                  </div>
                </div>

                {/* Summary / Snippet */}
                <p className="text-xs text-slate-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {q.title.includes('Fraud')
                    ? 'Account transaction trigger preventing negative balance and low balance (<500).'
                    : q.title.includes('Order')
                    ? 'Orders validation trigger ensuring minimum order value >= 100 and sufficient stock.'
                    : q.title.includes('Phone')
                    ? 'Auto-formatting contact numbers by prepending country code (+91).'
                    : q.title.includes('Late')
                    ? 'Delivery tracking trigger archiving delayed deliveries to LateDeliveriesAudit.'
                    : q.title.includes('Attendance')
                    ? 'Student attendance monitoring trigger creating notification alerts for <75%.'
                    : q.title.includes('Gym')
                    ? 'Temporal membership trigger inactivating expired plans and logging warnings.'
                    : q.title.includes('Sum')
                    ? 'Iterative stored procedure computing the sum of digits of a given number.'
                    : q.title.includes('Palindrome')
                    ? 'Stored procedure verifying palindrome property using string reversal.'
                    : q.title.includes('Greatest')
                    ? 'Procedure finding maximum among three numbers using conditional evaluation.'
                    : q.title.includes('Average')
                    ? 'Calculates student exam average score and assigns academic letter grades.'
                    : q.title.includes('Longest')
                    ? 'Tokenizes input text sentence to calculate the character length of longest word.'
                    : 'Counts total word tokens in a space-delimited text string.'}
                </p>

                {/* Expandable Schema Peek */}
                {isExpanded && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-neutral-800 text-[11px] space-y-2 animate-fadeIn font-mono">
                    <div className="text-slate-700 dark:text-slate-300">
                      <span className="text-emerald-500 font-bold block mb-1">Database Schema:</span>
                      <div className="bg-slate-100 dark:bg-[#1c1c1c] p-2 rounded text-[11px] overflow-x-auto text-slate-600 dark:text-neutral-300">
                        {q.id === 'dbms-001' && 'Account (acc_no, balance)\nTransaction (trans_id, acc_no, amount)'}
                        {q.id === 'dbms-002' && 'Inventory (item_id, stock_quantity, price)\nOrders (order_id, item_id, quantity, total_price)'}
                        {q.id === 'dbms-003' && 'Users (user_id, name, phone_number)'}
                        {q.id === 'dbms-004' && 'Deliveries (delivery_id, expected_date, actual_date, reason)\nLateDeliveriesAudit (audit_id, delivery_id, ...)'}
                        {q.id === 'dbms-005' && 'StudentAttendance (student_id, student_name, attendance_percentage)\nDefaultersNotification (...)'}
                        {q.id === 'dbms-006' && 'GymMembership (member_id, expiry_date, status)\nMembershipNotifications (...)'}
                        {q.id === 'dbms-007' && 'Procedure SumOfDigits(IN num INT, OUT sum INT)'}
                        {q.id === 'dbms-008' && 'Procedure CheckPalindrome(IN inputStr VARCHAR(255), OUT isPalindrome BOOLEAN)'}
                        {q.id === 'dbms-009' && 'Procedure FindGreatest(IN num1 INT, IN num2 INT, IN num3 INT, OUT greatest INT)'}
                        {q.id === 'dbms-010' && 'Procedure CalculateAverageScore(IN score1, IN score2, IN score3, OUT avg, OUT grade)'}
                        {q.id === 'dbms-011' && 'Procedure FindLongestWordLength(IN text_string TEXT, OUT max_len INT)'}
                        {q.id === 'dbms-012' && 'Procedure CountWords(IN text_string TEXT, OUT total_words INT)'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Bottom Actions */}
              <div className="px-5 py-3 border-t border-slate-100 dark:border-neutral-800/80 bg-slate-50/50 dark:bg-[#141414] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {/* Original Screenshot Button */}
                  <button
                    onClick={() => handleOpenScreenshot(q.sourceScreenshot || q.id, q.title)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    title="View original lab exam photo"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span>Photo</span>
                  </button>

                  {/* Schema peek toggle */}
                  <button
                    onClick={() => toggleDetails(q.id)}
                    className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                    title="Toggle schema preview"
                  >
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    <span>Schema</span>
                  </button>
                </div>

                {/* Solve in Workspace */}
                <button
                  onClick={() => onSelectQuestion(q.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm hover:scale-[1.02] cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Solve</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Original Screenshot Viewer Modal */}
      <ScreenshotModal
        isOpen={screenshotModalOpen}
        onClose={() => setScreenshotModalOpen(false)}
        screenshotName={selectedScreenshot}
        questionTitle={selectedScreenshotTitle}
      />
    </div>
  );
};
