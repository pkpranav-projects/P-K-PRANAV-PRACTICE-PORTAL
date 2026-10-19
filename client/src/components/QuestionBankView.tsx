import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Bookmark,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Code2,
  Tag,
  AlertTriangle,
  Layers,
  Image as ImageIcon,
  Rocket,
  Shuffle,
  List,
  Grid,
  FileCode,
  Check
} from 'lucide-react';
import { Difficulty, QuestionSummary } from '../types';

interface QuestionBankViewProps {
  questions: QuestionSummary[];
  onSelectQuestion: (questionId: string) => void;
  onToggleBookmark: (questionId: string) => Promise<void>;
  onToggleRevision: (questionId: string) => Promise<void>;
  initialFilterStatus?: string;
  initialBank?: 'bank1' | 'bank2' | 'all';
  onPickRandom?: () => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  questions,
  onSelectQuestion,
  onToggleBookmark,
  onToggleRevision,
  initialFilterStatus = 'All',
  initialBank = 'all',
  onPickRandom
}) => {
  const [selectedBank, setSelectedBank] = useState<'bank1' | 'bank2' | 'all'>(initialBank);
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>(initialFilterStatus);
  const [sortBy, setSortBy] = useState<'id' | 'title' | 'difficulty' | 'topic'>('id');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Compute bank counts & progress
  const bank1Questions = useMemo(() => {
    return questions.filter(q => (q.bank === 'bank1' || (!q.bank && q.id.startsWith('java-'))));
  }, [questions]);

  const bank2Questions = useMemo(() => {
    return questions.filter(q => (q.bank === 'bank2' || (!q.bank && q.id.startsWith('bank2-'))));
  }, [questions]);

  const bank1SolvedCount = useMemo(() => bank1Questions.filter(q => q.solved).length, [bank1Questions]);
  const bank2SolvedCount = useMemo(() => bank2Questions.filter(q => q.solved).length, [bank2Questions]);

  // Questions in currently active bank
  const bankScopedQuestions = useMemo(() => {
    if (selectedBank === 'bank1') return bank1Questions;
    if (selectedBank === 'bank2') return bank2Questions;
    return questions;
  }, [selectedBank, bank1Questions, bank2Questions, questions]);

  // Extract unique topics for the current bank
  const topics = useMemo(() => {
    const set = new Set<string>();
    bankScopedQuestions.forEach(q => set.add(q.topic));
    return ['All', ...Array.from(set).sort()];
  }, [bankScopedQuestions]);

  // Filter and sort questions
  const filteredQuestions = useMemo(() => {
    return bankScopedQuestions.filter((q) => {
      // Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(query);
        const matchesId = q.id.toLowerCase().includes(query);
        const matchesTopic = q.topic.toLowerCase().includes(query);
        if (!matchesTitle && !matchesId && !matchesTopic) return false;
      }

      // Topic filter
      if (selectedTopic !== 'All' && q.topic !== selectedTopic) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) {
        return false;
      }

      // Status filter
      if (selectedStatus === 'Solved' && !q.solved) return false;
      if (selectedStatus === 'Attempted' && (!q.attempted || q.solved)) return false;
      if (selectedStatus === 'Unsolved' && q.solved) return false;
      if (selectedStatus === 'Bookmarked' && !q.isBookmarked) return false;
      if (selectedStatus === 'Revision' && !q.isRevision) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'id') return a.id.localeCompare(b.id, undefined, { numeric: true });
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'topic') return a.topic.localeCompare(b.topic);
      if (sortBy === 'difficulty') {
        const weight: Record<Difficulty, number> = { Easy: 1, Medium: 2, Hard: 3 };
        return weight[a.difficulty] - weight[b.difficulty];
      }
      return 0;
    });
  }, [bankScopedQuestions, search, selectedTopic, selectedDifficulty, selectedStatus, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedTopic('All');
    setSelectedDifficulty('All');
    setSelectedStatus('All');
    setSortBy('id');
  };

  const isFiltered = search !== '' || selectedTopic !== 'All' || selectedDifficulty !== 'All' || selectedStatus !== 'All';

  // Local Pick Random handler if none provided
  const handlePickRandom = () => {
    if (onPickRandom) {
      onPickRandom();
      return;
    }
    const pool = filteredQuestions.length > 0 ? filteredQuestions : questions;
    const unsolved = pool.filter(q => !q.solved);
    const targetList = unsolved.length > 0 ? unsolved : pool;
    if (targetList.length > 0) {
      const randomQ = targetList[Math.floor(Math.random() * targetList.length)];
      onSelectQuestion(randomQ.id);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn max-w-[1500px] mx-auto select-none">
      {/* Top Header Row with Bank Switcher Pills + Pick Random Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Bank Selection Tabs (LeetCode style tab pills) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => {
              setSelectedBank('all');
              setSelectedTopic('All');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedBank === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-[#202020] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Problems ({questions.length})</span>
          </button>

          <button
            onClick={() => {
              setSelectedBank('bank1');
              setSelectedTopic('All');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedBank === 'bank1'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-[#202020] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Bank 1 (Photo Portal - {bank1Questions.length})</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-black/20 text-slate-800 dark:text-white">
              {bank1SolvedCount} Solved
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedBank('bank2');
              setSelectedTopic('All');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedBank === 'bank2'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-[#202020] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Bank 2 (Masterclass - {bank2Questions.length})</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-black/20 text-slate-800 dark:text-white">
              {bank2SolvedCount} Solved
            </span>
          </button>
        </div>

        {/* Right Utility: View Switcher (Table vs Cards) & Pick Random */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* Pick Random Question */}
          <button
            onClick={handlePickRandom}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-sm hover:scale-[1.02]"
            title="Pick a random question"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Pick One</span>
          </button>

          {/* View Mode Toggle (Table / Card) */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-[#202020] border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-[#2c2c2c] text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Table View (LeetCode Style)"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-[#2c2c2c] text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Card Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="p-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-[#202020]"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* LeetCode Search & Filter Bar */}
      <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-slate-200 dark:border-[#282828] shadow-sm space-y-3">
        {/* Search row */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search problems by name, ID (e.g. java-005, bank2-001), or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#242424] border border-slate-200 dark:border-[#333333] rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
          />
        </div>

        {/* Filter selectors row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Difficulty */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#242424] border border-slate-200 dark:border-[#333333] rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#242424] border border-slate-200 dark:border-[#333333] rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All Statuses</option>
              <option value="Solved">Solved</option>
              <option value="Attempted">Attempted</option>
              <option value="Unsolved">Todo / Unsolved</option>
              <option value="Bookmarked">Bookmarked</option>
              <option value="Revision">Marked for Revision</option>
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#242424] border border-slate-200 dark:border-[#333333] rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {topics.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#242424] border border-slate-200 dark:border-[#333333] rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="id">Problem ID</option>
              <option value="title">Title (A-Z)</option>
              <option value="difficulty">Difficulty</option>
              <option value="topic">Topic</option>
            </select>
          </div>
        </div>

        {/* Counter summary */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filteredQuestions.length}</strong> of {bankScopedQuestions.length} problems
          </span>
          <span className="font-mono text-emerald-500 font-semibold">
            {filteredQuestions.filter(q => q.solved).length} Solved in view
          </span>
        </div>
      </div>

      {/* VIEW MODE 1: LEETCODE PROBLEMS TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-[#282828] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#282828] bg-slate-50/70 dark:bg-[#222222] text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-4 w-12 text-center">Status</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4 w-28">Bank</th>
                  <th className="py-3 px-4 w-28">Difficulty</th>
                  <th className="py-3 px-4">Topic</th>
                  <th className="py-3 px-4 w-28 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#282828]">
                {filteredQuestions.map((q) => {
                  const isBank2 = q.bank === 'bank2' || q.id.startsWith('bank2-');
                  const diffColor = {
                    Easy: 'text-emerald-500 font-semibold',
                    Medium: 'text-amber-500 font-semibold',
                    Hard: 'text-rose-500 font-semibold'
                  }[q.difficulty];

                  return (
                    <tr
                      key={q.id}
                      onClick={() => onSelectQuestion(q.id)}
                      className={`cursor-pointer transition-colors ${
                        q.solved
                          ? 'bg-emerald-500/[0.05] dark:bg-emerald-500/[0.08] hover:bg-emerald-500/[0.12]'
                          : 'hover:bg-slate-50 dark:hover:bg-[#222222]'
                      }`}
                    >
                      {/* Status Icon */}
                      <td className="py-3 px-4 text-center">
                        {q.solved ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        ) : q.attempted ? (
                          <Clock className="w-4 h-4 text-amber-500 mx-auto" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 mx-auto" />
                        )}
                      </td>

                      {/* Title + ID */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-400 text-[11px] font-semibold">{q.id}.</span>
                          <span className={`font-semibold hover:text-amber-500 transition-colors ${
                            q.solved ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {q.title}
                          </span>
                          {q.solved && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-600 text-white font-mono">
                              SOLVED ✓
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Bank Tag */}
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          isBank2
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}>
                          {isBank2 ? 'Bank 2 (Masterclass)' : 'Bank 1 (Photos)'}
                        </span>
                      </td>

                      {/* Difficulty */}
                      <td className={`py-3 px-4 ${diffColor}`}>
                        {q.difficulty}
                      </td>

                      {/* Topic */}
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        {q.topic}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectQuestion(q.id);
                          }}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                            q.solved
                              ? 'bg-emerald-600 text-white hover:bg-emerald-500 font-bold'
                              : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                          }`}
                        >
                          {q.solved ? 'Review ✓' : 'Solve'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: CARD GRID VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuestions.map((q) => {
            const isBank2 = q.bank === 'bank2' || q.id.startsWith('bank2-');
            const diffColors = {
              Easy: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
              Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
              Hard: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
            }[q.difficulty];

            return (
              <div
                key={q.id}
                className={`rounded-xl p-5 shadow-sm transition-all flex flex-col justify-between group border ${
                  q.solved
                    ? 'border-emerald-500/60 dark:border-emerald-500/50 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.08] shadow-emerald-500/10 hover:border-emerald-500'
                    : 'bg-white dark:bg-[#1a1a1a] border-slate-200 dark:border-[#282828] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Bar: ID, Bank Pill, Difficulty & Actions */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`font-mono text-xs font-bold ${q.solved ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {q.id}
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                        isBank2 
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      }`}>
                        {isBank2 ? 'Bank 2' : 'Bank 1'}
                      </span>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${diffColors}`}>
                        {q.difficulty}
                      </span>
                      {q.solved && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>SOLVED ✓</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(q.id);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          q.isBookmarked
                            ? 'text-amber-500 bg-amber-500/10'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="Bookmark"
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="flex items-start gap-1.5 mb-2">
                    {q.solved && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    )}
                    <h3
                      onClick={() => onSelectQuestion(q.id)}
                      className={`text-sm font-bold cursor-pointer line-clamp-2 transition-colors ${
                        q.solved
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-slate-900 dark:text-white group-hover:text-amber-500'
                      }`}
                    >
                      {q.title}
                    </h3>
                  </div>

                  {/* Topic tag */}
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mb-4">
                    <Tag className="w-3 h-3 text-slate-400" />
                    <span>{q.topic}</span>
                  </div>
                </div>

                {/* Card Footer: Status & Solve Button */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    {q.solved ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>SOLVED ✓</span>
                      </span>
                    ) : q.attempted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Attempted</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        Not Started
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectQuestion(q.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      q.solved
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm shadow-emerald-600/30 font-bold'
                        : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-sm'
                    }`}
                  >
                    <span>{q.solved ? 'Review ✓' : 'Solve'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredQuestions.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-[#282828]">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            No matching problems found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try adjusting your search query, bank selection, or reset the filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
