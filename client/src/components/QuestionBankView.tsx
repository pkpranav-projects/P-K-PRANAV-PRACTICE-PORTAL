import React, { useState, useMemo, useEffect } from 'react';
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
  Check,
  FolderTree,
  ChevronDown,
  ChevronRight,
  Database
} from 'lucide-react';
import { Difficulty, QuestionSummary } from '../types';

// Visual color palette and icons per topic category
const getTopicBadgeStyle = (topic: string) => {
  const t = topic.toLowerCase();
  if (t.includes('sql') || t.includes('dbms') || t.includes('trigger') || t.includes('procedure')) {
    return {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      bar: 'bg-emerald-500',
      iconColor: 'text-emerald-500'
    };
  }
  if (t.includes('class') || t.includes('oop')) {
    return {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      bar: 'bg-emerald-500',
      iconColor: 'text-emerald-500'
    };
  }
  if (t.includes('string')) {
    return {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      bar: 'bg-amber-500',
      iconColor: 'text-amber-500'
    };
  }
  if (t.includes('array')) {
    return {
      bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
      bar: 'bg-indigo-500',
      iconColor: 'text-indigo-500'
    };
  }
  if (t.includes('file')) {
    return {
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
      bar: 'bg-rose-500',
      iconColor: 'text-rose-500'
    };
  }
  if (t.includes('exception')) {
    return {
      bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
      bar: 'bg-purple-500',
      iconColor: 'text-purple-500'
    };
  }
  if (t.includes('loop') || t.includes('control')) {
    return {
      bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
      bar: 'bg-cyan-500',
      iconColor: 'text-cyan-500'
    };
  }
  return {
    bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    bar: 'bg-blue-500',
    iconColor: 'text-blue-500'
  };
};

const RecommendedLanguageBadge: React.FC<{ language?: string; size?: 'sm' | 'md' }> = ({ language = 'Java', size = 'sm' }) => {
  const lang = language || 'Java';
  const colorMap: Record<string, string> = {
    'Java': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    'Python': 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
    'C++': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    'SQL': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  };
  const color = colorMap[lang] || colorMap['Java'];

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-md border ${color} ${
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
      title={`Recommended Language: ${lang}`}
    >
      <span className="opacity-70 font-normal">Recommended:</span>
      <span className="font-bold">{lang}</span>
    </span>
  );
};

const getBankBadge = (q: QuestionSummary) => {
  if (q.bank === 'dbms' || q.id.startsWith('dbms-')) {
    return {
      label: 'Bank 4 (DBMS & SQL Lab)',
      shortLabel: 'Bank 4 (DBMS)',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
    };
  }
  if (q.bank === 'bank3' || q.id.startsWith('bank3-')) {
    return {
      label: 'Bank 3 (Lab Tests)',
      shortLabel: 'Bank 3',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
    };
  }
  if (q.bank === 'bank2' || q.id.startsWith('bank2-')) {
    return {
      label: 'Bank 2 (Masterclass)',
      shortLabel: 'Bank 2',
      color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
    };
  }
  return {
    label: 'Bank 1 (Photos)',
    shortLabel: 'Bank 1',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
  };
};

interface QuestionBankViewProps {
  questions: QuestionSummary[];
  onSelectQuestion: (questionId: string) => void;
  onToggleBookmark: (questionId: string) => Promise<void>;
  onToggleRevision: (questionId: string) => Promise<void>;
  initialFilterStatus?: string;
  initialBank?: 'bank1' | 'bank2' | 'bank3' | 'dbms' | 'all';
  initialViewMode?: 'table' | 'cards' | 'topic';
  onPickRandom?: () => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  questions,
  onSelectQuestion,
  onToggleBookmark,
  onToggleRevision,
  initialFilterStatus = 'All',
  initialBank = 'all',
  initialViewMode,
  onPickRandom
}) => {
  const [selectedBank, setSelectedBank] = useState<'bank1' | 'bank2' | 'bank3' | 'dbms' | 'all'>(initialBank);
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>(initialFilterStatus);
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'id' | 'title' | 'difficulty' | 'topic'>('id');
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'topic'>(() => {
    return initialViewMode || (localStorage.getItem('arena_question_view_mode') as any) || 'table';
  });
  const [collapsedTopics, setCollapsedTopics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialBank) {
      setSelectedBank(initialBank);
    }
  }, [initialBank]);

  useEffect(() => {
    if (initialViewMode) {
      setViewMode(initialViewMode);
    }
  }, [initialViewMode]);

  // Compute bank counts & progress
  const bank1Questions = useMemo(() => {
    return questions.filter(q => (q.bank === 'bank1' || (!q.bank && q.id.startsWith('java-'))));
  }, [questions]);

  const bank2Questions = useMemo(() => {
    return questions.filter(q => (q.bank === 'bank2' || (!q.bank && q.id.startsWith('bank2-'))));
  }, [questions]);

  const bank3Questions = useMemo(() => {
    return questions.filter(q => (q.bank === 'bank3' || (!q.bank && q.id.startsWith('bank3-'))));
  }, [questions]);

  const bank4Questions = useMemo(() => {
    return questions.filter(q => (q.bank === 'dbms' || (!q.bank && q.id.startsWith('dbms-'))));
  }, [questions]);

  const bank1SolvedCount = useMemo(() => bank1Questions.filter(q => q.solved).length, [bank1Questions]);
  const bank2SolvedCount = useMemo(() => bank2Questions.filter(q => q.solved).length, [bank2Questions]);
  const bank3SolvedCount = useMemo(() => bank3Questions.filter(q => q.solved).length, [bank3Questions]);
  const bank4SolvedCount = useMemo(() => bank4Questions.filter(q => q.solved).length, [bank4Questions]);

  // Questions in currently active bank
  const bankScopedQuestions = useMemo(() => {
    if (selectedBank === 'bank1') return bank1Questions;
    if (selectedBank === 'bank2') return bank2Questions;
    if (selectedBank === 'bank3') return bank3Questions;
    if (selectedBank === 'dbms') return bank4Questions;
    return questions;
  }, [selectedBank, bank1Questions, bank2Questions, bank3Questions, bank4Questions, questions]);

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

      // Recommended Language filter
      if (selectedLanguageFilter !== 'All') {
        const rec = q.recommendedLanguage || 'Java';
        if (rec.toLowerCase() !== selectedLanguageFilter.toLowerCase()) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'id') return a.id.localeCompare(b.id, undefined, { numeric: true });
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'topic') {
        const tComp = a.topic.localeCompare(b.topic);
        if (tComp !== 0) return tComp;
        return a.id.localeCompare(b.id, undefined, { numeric: true });
      }
      if (sortBy === 'difficulty') {
        const weight: Record<Difficulty, number> = { Easy: 1, Medium: 2, Hard: 3 };
        return weight[a.difficulty] - weight[b.difficulty];
      }
      return 0;
    });
  }, [bankScopedQuestions, search, selectedTopic, selectedDifficulty, selectedStatus, selectedLanguageFilter, sortBy]);

  // Group questions by topic for Topic Mode
  const topicGroups = useMemo(() => {
    const map = new Map<string, QuestionSummary[]>();
    for (const q of filteredQuestions) {
      const topicName = q.topic || 'General Java';
      if (!map.has(topicName)) {
        map.set(topicName, []);
      }
      map.get(topicName)!.push(q);
    }

    const groups: {
      topic: string;
      questions: QuestionSummary[];
      totalCount: number;
      solvedCount: number;
      easyCount: number;
      mediumCount: number;
      hardCount: number;
      progressPercent: number;
    }[] = [];

    map.forEach((qList, topic) => {
      // Sort questions inside this topic
      const sortedInTopic = [...qList].sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'difficulty') {
          const weight: Record<Difficulty, number> = { Easy: 1, Medium: 2, Hard: 3 };
          return weight[a.difficulty] - weight[b.difficulty];
        }
        return a.id.localeCompare(b.id, undefined, { numeric: true });
      });

      const totalCount = sortedInTopic.length;
      const solvedCount = sortedInTopic.filter(q => q.solved).length;
      const easyCount = sortedInTopic.filter(q => q.difficulty === 'Easy').length;
      const mediumCount = sortedInTopic.filter(q => q.difficulty === 'Medium').length;
      const hardCount = sortedInTopic.filter(q => q.difficulty === 'Hard').length;
      const progressPercent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

      groups.push({
        topic,
        questions: sortedInTopic,
        totalCount,
        solvedCount,
        easyCount,
        mediumCount,
        hardCount,
        progressPercent
      });
    });

    // Sort topic groups: topics with highest question count first, then alphabetical
    return groups.sort((a, b) => b.totalCount - a.totalCount || a.topic.localeCompare(b.topic));
  }, [filteredQuestions, sortBy]);

  const toggleTopicCollapse = (topicName: string) => {
    setCollapsedTopics(prev => ({
      ...prev,
      [topicName]: !prev[topicName]
    }));
  };

  const handleExpandAllTopics = () => setCollapsedTopics({});
  const handleCollapseAllTopics = () => {
    const allCollapsed: Record<string, boolean> = {};
    topicGroups.forEach(g => {
      allCollapsed[g.topic] = true;
    });
    setCollapsedTopics(allCollapsed);
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedTopic('All');
    setSelectedDifficulty('All');
    setSelectedStatus('All');
    setSelectedLanguageFilter('All');
    setSortBy('id');
  };

  const isFiltered = search !== '' || selectedTopic !== 'All' || selectedDifficulty !== 'All' || selectedStatus !== 'All' || selectedLanguageFilter !== 'All';

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

          <button
            onClick={() => {
              setSelectedBank('bank3');
              setSelectedTopic('All');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedBank === 'bank3'
                ? 'bg-purple-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-[#202020] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bank 3 (Lab Tests - {bank3Questions.length})</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-black/20 text-white">
              {bank3SolvedCount} Solved
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedBank('dbms');
              setSelectedTopic('All');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedBank === 'dbms'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-[#202020] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Bank 4 (DBMS & SQL - {bank4Questions.length})</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-black/20 text-white">
              {bank4SolvedCount} Solved
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

          {/* View Mode Toggle: Table, Cards, Topic Mode */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-[#202020] border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                setViewMode('table');
                try { localStorage.setItem('arena_question_view_mode', 'table'); } catch {}
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-[#2c2c2c] text-slate-900 dark:text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Table View (LeetCode Style)"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>

            <button
              onClick={() => {
                setViewMode('cards');
                try { localStorage.setItem('arena_question_view_mode', 'cards'); } catch {}
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-[#2c2c2c] text-slate-900 dark:text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Card Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>

            <button
              onClick={() => {
                setViewMode('topic');
                try { localStorage.setItem('arena_question_view_mode', 'topic'); } catch {}
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-all cursor-pointer ${
                viewMode === 'topic'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm ring-1 ring-amber-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Topic Mode: Questions Grouped & Sorted Under Topic Headings"
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Topic Mode</span>
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
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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

          {/* Recommended Language */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Language</label>
            <select
              value={selectedLanguageFilter}
              onChange={(e) => setSelectedLanguageFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#242424] border border-slate-200 dark:border-[#333333] rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All Languages</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
              <option value="Python">Python</option>
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
                  const bankBadge = getBankBadge(q);
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
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-slate-400 text-[11px] font-semibold">{q.id}.</span>
                          <span className={`font-semibold hover:text-amber-500 transition-colors ${
                            q.solved ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {q.title}
                          </span>
                          <RecommendedLanguageBadge language={q.recommendedLanguage} />
                          {q.solved && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-600 text-white font-mono">
                              SOLVED ✓
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Bank Tag */}
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${bankBadge.color}`}>
                          {bankBadge.label}
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

      {/* VIEW MODE 2: CARD GRID VIEW (TILED CARDS WITH CRISP OUTLINES & ELEVATION) */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredQuestions.map((q) => {
            const bankBadge = getBankBadge(q);
            const diffColors = {
              Easy: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
              Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
              Hard: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
            }[q.difficulty];

            return (
              <div
                key={q.id}
                onClick={() => onSelectQuestion(q.id)}
                className={`arena-card-tile p-5 flex flex-col justify-between group cursor-pointer relative overflow-hidden transition-all ${
                  q.solved
                    ? '!border-emerald-500/60 dark:!border-emerald-500/50 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.08]'
                    : ''
                }`}
              >
                <div>
                  {/* Top Bar: ID Badge, Bank Pill, Difficulty & Bookmark Action */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md border ${
                        q.solved
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-100 dark:bg-[#282828] text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-[#3a3a3a]'
                      }`}>
                        #{q.id}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${bankBadge.color}`}>
                        {bankBadge.label}
                      </span>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md border ${diffColors}`}>
                        {q.difficulty}
                      </span>
                      <RecommendedLanguageBadge language={q.recommendedLanguage} />
                      {q.solved && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>SOLVED</span>
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
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#282828]'
                        }`}
                        title="Bookmark"
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="flex items-start gap-2 mb-2">
                    {q.solved && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    )}
                    <h3
                      className={`text-[15px] font-bold line-clamp-2 transition-colors leading-snug ${
                        q.solved
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-[#FFA116]'
                      }`}
                    >
                      {q.title}
                    </h3>
                  </div>

                  {/* Topic tag */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-[#282828] border border-slate-200 dark:border-[#383838]">
                      <Tag className="w-3 h-3 text-amber-500" />
                      <span>{q.topic}</span>
                    </span>
                  </div>
                </div>

                {/* Card Footer: Status & Solve Button */}
                <div className="pt-3 border-t border-slate-100 dark:border-[#2e2e2e] flex items-center justify-between mt-auto">
                  <div>
                    {q.solved ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Solved ✓</span>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectQuestion(q.id);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      q.solved
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm shadow-emerald-600/30'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md hover:shadow-lg'
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

      {/* VIEW MODE 3: TOPIC MODE (SORTED & GROUPED UNDER TOPIC HEADINGS) */}
      {viewMode === 'topic' && filteredQuestions.length > 0 && (
        <div className="space-y-4">
          {/* Topic Mode Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-[#282828] text-xs shadow-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <FolderTree className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">
                Topic Mode: <strong className="text-slate-900 dark:text-white">{topicGroups.length}</strong> Topics
              </span>
              <span className="text-slate-400 hidden sm:inline">
                ({filteredQuestions.length} tests/problems sorted under their respective headings)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExpandAllTopics}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#252525] hover:bg-slate-200 dark:hover:bg-[#333] text-slate-700 dark:text-slate-300 font-semibold transition-colors cursor-pointer text-xs"
              >
                Expand All
              </button>
              <button
                onClick={handleCollapseAllTopics}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#252525] hover:bg-slate-200 dark:hover:bg-[#333] text-slate-700 dark:text-slate-300 font-semibold transition-colors cursor-pointer text-xs"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* List of Topic Sections */}
          <div className="space-y-4">
            {topicGroups.map((group) => {
              const isCollapsed = !!collapsedTopics[group.topic];
              const style = getTopicBadgeStyle(group.topic);

              return (
                <div
                  key={group.topic}
                  className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-[#282828] overflow-hidden shadow-sm transition-all"
                >
                  {/* Topic Header Accordion Banner */}
                  <div
                    onClick={() => toggleTopicCollapse(group.topic)}
                    className="flex flex-wrap items-center justify-between p-4 bg-slate-50/90 dark:bg-[#222222] hover:bg-slate-100/90 dark:hover:bg-[#262626] cursor-pointer transition-colors border-b border-slate-200/60 dark:border-[#2c2c2c] gap-3 select-none"
                  >
                    {/* Left: Icon, Title, Counts */}
                    <div className="flex items-center gap-3">
                      <div className="p-1 rounded text-slate-400 hover:text-white">
                        {isCollapsed ? (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Tag className={`w-4 h-4 ${style.iconColor}`} />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white m-0">
                          {group.topic}
                        </h3>
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-[#333] text-slate-700 dark:text-neutral-300">
                          {group.totalCount} {group.totalCount === 1 ? 'problem' : 'problems'}
                        </span>
                      </div>
                    </div>

                    {/* Right: Progress bar & Badges */}
                    <div className="flex items-center gap-4 ml-auto sm:ml-0">
                      {/* Difficulty breakdown pills */}
                      <div className="hidden md:flex items-center gap-1.5 text-[10px] font-semibold">
                        {group.easyCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            {group.easyCount} Easy
                          </span>
                        )}
                        {group.mediumCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            {group.mediumCount} Med
                          </span>
                        )}
                        {group.hardCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20">
                            {group.hardCount} Hard
                          </span>
                        )}
                      </div>

                      {/* Solved Progress Bar */}
                      <div className="flex items-center gap-2">
                        <div className="w-24 sm:w-32 h-2 rounded-full bg-slate-200 dark:bg-neutral-800 overflow-hidden">
                          <div
                            className={`h-full ${style.bar} transition-all duration-300`}
                            style={{ width: `${group.progressPercent}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-700 dark:text-neutral-200 whitespace-nowrap">
                          {group.solvedCount}/{group.totalCount} ({group.progressPercent}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Topic Questions List (Collapsible Table) */}
                  {!isCollapsed && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-[#282828] bg-slate-50/40 dark:bg-[#1e1e1e] text-slate-400 font-semibold uppercase text-[10px]">
                            <th className="py-2.5 px-4 w-12 text-center">Status</th>
                            <th className="py-2.5 px-4">Title</th>
                            <th className="py-2.5 px-4 w-28">Bank</th>
                            <th className="py-2.5 px-4 w-28">Difficulty</th>
                            <th className="py-2.5 px-4 w-28 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-[#252525]">
                          {group.questions.map((q) => {
                            const bankBadge = getBankBadge(q);
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
                                    ? 'bg-emerald-500/[0.04] dark:bg-emerald-500/[0.07] hover:bg-emerald-500/[0.12]'
                                    : 'hover:bg-slate-50 dark:hover:bg-[#222222]'
                                }`}
                              >
                                {/* Status */}
                                <td className="py-2.5 px-4 text-center">
                                  {q.solved ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                                  ) : q.attempted ? (
                                    <Clock className="w-4 h-4 text-amber-500 mx-auto" />
                                  ) : (
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 dark:border-neutral-600 mx-auto" />
                                  )}
                                </td>

                                {/* Title with ID */}
                                <td className="py-2.5 px-4">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-mono text-[11px] text-slate-400">
                                      {q.id}
                                    </span>
                                    <span
                                      className={`font-semibold hover:underline ${
                                        q.solved
                                          ? 'text-emerald-600 dark:text-emerald-300'
                                          : 'text-slate-900 dark:text-white'
                                      }`}
                                    >
                                      {q.title}
                                    </span>
                                    <RecommendedLanguageBadge language={q.recommendedLanguage} />
                                    {q.isRevision && (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                        Revision
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Bank */}
                                <td className="py-2.5 px-4">
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${bankBadge.color}`}
                                  >
                                    {bankBadge.shortLabel}
                                  </span>
                                </td>

                                {/* Difficulty */}
                                <td className="py-2.5 px-4">
                                  <span className={diffColor}>{q.difficulty}</span>
                                </td>

                                {/* Actions */}
                                <td className="py-2.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      onClick={() => onToggleBookmark(q.id)}
                                      className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-[#333] transition-colors cursor-pointer ${
                                        q.isBookmarked
                                          ? 'text-amber-500 fill-current'
                                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                                      }`}
                                      title="Bookmark"
                                    >
                                      <Bookmark className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => onSelectQuestion(q.id)}
                                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                                        q.solved
                                          ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm shadow-emerald-600/30 font-bold'
                                          : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-sm'
                                      }`}
                                    >
                                      {q.solved ? 'Review ✓' : 'Solve'}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
