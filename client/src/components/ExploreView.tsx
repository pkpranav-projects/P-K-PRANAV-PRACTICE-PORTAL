import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  BookOpen,
  Sparkles,
  GraduationCap,
  Timer,
  LayoutDashboard,
  BookmarkCheck,
  Code2,
  FolderTree,
  LayoutGrid,
  SlidersHorizontal,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Layers,
  FileText
} from 'lucide-react';
import { PranavJavaSymbol } from './PranavJavaSymbol';
import { DashboardStats, QuestionSummary } from '../types';

export interface ExploreCardData {
  id: string;
  badge: string;
  subtitle: string;
  title: string;
  description: string;
  gradientClass: string;
  chaptersCount: number | string;
  chaptersLabel: string;
  itemsCount: number | string;
  itemsLabel: string;
  progressPercent: number;
  actionText: string;
  onClick: () => void;
}

interface ExploreSectionProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  cards: ExploreCardData[];
  layoutMode: 'grid' | 'carousel';
  onMoreClick?: () => void;
}

const ExploreSection: React.FC<ExploreSectionProps> = ({
  title,
  subtitle,
  icon,
  cards,
  layoutMode,
  onMoreClick
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const renderCard = (card: ExploreCardData) => {
    const circumference = 175.9;
    const strokeDashoffset =
      circumference - (circumference * Math.min(100, Math.max(0, card.progressPercent))) / 100;

    return (
      <div
        key={card.id}
        onClick={card.onClick}
        className="rounded-2xl shadow-sm hover:shadow-xl transition-all duration-200 bg-white dark:bg-[#232323] border border-slate-200 dark:border-neutral-700/80 hover:border-amber-400 dark:hover:border-amber-500/60 overflow-hidden cursor-pointer group flex flex-col justify-between select-none"
      >
        {/* Card Top: Gradient Banner with Subtitle, Title & Badge */}
        <div className={`relative p-5 flex flex-col justify-between min-h-[155px] ${card.gradientClass}`}>
          {/* Top Row: Subtitle + Badge */}
          <div className="flex items-start justify-between gap-2 z-10">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-white/90 drop-shadow-sm font-mono">
              {card.subtitle}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/25 text-white backdrop-blur-sm border border-white/20 whitespace-nowrap shadow-sm">
              {card.badge}
            </span>
          </div>

          {/* Title & Description */}
          <div className="z-10 mt-2">
            <h4 className="text-lg font-bold text-white leading-snug drop-shadow line-clamp-2">
              {card.title}
            </h4>
            <p className="text-xs text-white/85 line-clamp-2 mt-1 drop-shadow-sm leading-relaxed">
              {card.description}
            </p>
          </div>
        </div>

        {/* Card Bottom: Metrics + Floating Play Button */}
        <div className="relative bg-slate-50 dark:bg-[#1e1e1e] p-3.5 border-t border-slate-200 dark:border-neutral-800 transition-colors">
          {/* Floating Circular Play / Progress Button */}
          <div className="relative">
            <div
              className="z-10 absolute flex h-[58px] w-[58px] cursor-pointer items-center justify-center rounded-full bg-white dark:bg-[#262626] border border-slate-200 dark:border-neutral-700 shadow-lg transition-all duration-200 -top-7 right-3 group-hover:scale-105 group-hover:border-amber-400 dark:group-hover:border-amber-400"
              title={card.actionText}
            >
              {/* Circular Progress Ring */}
              <svg height="58" width="58" className="absolute left-0 top-0 -rotate-90">
                <circle
                  cx="29"
                  cy="29"
                  r="26"
                  fill="transparent"
                  stroke="#cbd5e1"
                  strokeWidth="3.5"
                  className="dark:stroke-[#3a3a3a]"
                />
                <circle
                  cx="29"
                  cy="29"
                  r="26"
                  fill="transparent"
                  stroke="#2cbb5d"
                  strokeWidth="3.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>

              {/* Play Triangle Icon */}
              <div className="relative text-slate-700 dark:text-white group-hover:text-[#2cbb5d] transition-colors ml-0.5">
                <Play className="w-4 h-4 fill-current" />
              </div>
            </div>
          </div>

          {/* Stats Summary Columns */}
          <div className="flex items-end justify-between pr-16 pl-1 pt-1">
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 dark:text-white font-mono leading-none">
                {card.chaptersCount}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1 font-medium">
                {card.chaptersLabel}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-900 dark:text-white font-mono leading-none">
                {card.itemsCount}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 mt-1 font-medium">
                {card.itemsLabel}
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                {card.progressPercent}%
              </span>
              <span className="text-[10px] text-slate-400 dark:text-neutral-500 uppercase tracking-wider">
                Progress
              </span>
            </div>
          </div>

          {/* Action text footer link */}
          <div className="mt-2.5 pt-2 border-t border-slate-200/70 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-slate-600 dark:text-neutral-400 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors font-medium">
            <span>{card.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-12">
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-200 border border-slate-200 dark:border-neutral-700">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {onMoreClick && (
          <button
            onClick={onMoreClick}
            className="bg-slate-100 dark:bg-[#282828] hover:bg-slate-200 dark:hover:bg-[#333333] px-3.5 py-1.5 rounded-full text-xs text-sky-600 dark:text-[#00c1de] hover:text-sky-700 dark:hover:text-[#38d4eb] font-semibold transition-colors flex items-center gap-1 border border-slate-200 dark:border-neutral-700 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Render Cards according to chosen layout mode */}
      {layoutMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {cards.map((card) => renderCard(card))}
        </div>
      ) : (
        <div className="relative group">
          {/* Scroll Left Button */}
          <button
            onClick={() => scroll('left')}
            className="absolute -translate-y-1/2 rounded-full z-20 left-1 top-1/2 w-9 h-9 bg-white/95 dark:bg-[#262626]/95 hover:bg-slate-100 dark:hover:bg-[#333333] text-slate-800 dark:text-white flex items-center justify-center shadow-xl border border-slate-200 dark:border-neutral-700 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Horizontal Scrollable Row */}
          <div
            ref={scrollRef}
            className="flex flex-nowrap overflow-x-auto scrollbar-hide gap-5 py-2 scroll-smooth"
          >
            {cards.map((card) => (
              <div key={card.id} className="w-[300px] flex-none">
                {renderCard(card)}
              </div>
            ))}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => scroll('right')}
            className="absolute -translate-y-1/2 rounded-full z-20 right-1 top-1/2 w-9 h-9 bg-white/95 dark:bg-[#262626]/95 hover:bg-slate-100 dark:hover:bg-[#333333] text-slate-800 dark:text-white flex items-center justify-center shadow-xl border border-slate-200 dark:border-neutral-700 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export interface ExploreViewProps {
  stats: DashboardStats | null;
  questions: QuestionSummary[];
  onSelectQuestion: (questionId: string) => void;
  onNavigateToBank: (bank: 'bank1' | 'bank2' | 'bank3' | 'dbms' | 'all') => void;
  onNavigateToDBMS?: () => void;
  onNavigateToTopicMode?: () => void;
  onNavigateToMasterclass: () => void;
  onNavigateToCurriculum: () => void;
  onNavigateToExam: () => void;
  onNavigateToRevision?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToWorkspace?: () => void;
  onPickRandom: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  stats,
  questions,
  onNavigateToBank,
  onNavigateToDBMS,
  onNavigateToTopicMode,
  onNavigateToMasterclass,
  onNavigateToCurriculum,
  onNavigateToExam,
  onNavigateToRevision,
  onNavigateToDashboard,
  onNavigateToWorkspace,
  onPickRandom
}) => {
  const [layoutMode, setLayoutMode] = useState<'grid' | 'carousel'>('grid');

  // Question calculations
  const bank1Questions = questions.filter(
    (q) => q.bank === 'bank1' || (!q.bank && q.id.startsWith('java-'))
  );
  const bank2Questions = questions.filter(
    (q) => q.bank === 'bank2' || (!q.bank && q.id.startsWith('bank2-'))
  );
  const bank3Questions = questions.filter(
    (q) => q.bank === 'bank3' || (!q.bank && q.id.startsWith('bank3-'))
  );
  const bank4Questions = questions.filter(
    (q) => q.bank === 'dbms' || (!q.bank && q.id.startsWith('dbms-'))
  );

  const bank1Solved = bank1Questions.filter((q) => q.solved).length;
  const bank2Solved = bank2Questions.filter((q) => q.solved).length;
  const bank3Solved = bank3Questions.filter((q) => q.solved).length;
  const bank4Solved = bank4Questions.filter((q) => q.solved).length;
  const totalSolved = stats?.solvedCount ?? questions.filter((q) => q.solved).length;
  const totalQuestions = questions.length || 113;

  const bank1Percent = Math.round((bank1Solved / (bank1Questions.length || 1)) * 100);
  const bank2Percent = Math.round((bank2Solved / (bank2Questions.length || 1)) * 100);
  const bank3Percent = Math.round((bank3Solved / (bank3Questions.length || 1)) * 100);
  const bank4Percent = Math.round((bank4Solved / (bank4Questions.length || 1)) * 100);
  const totalPercent = Math.round((totalSolved / totalQuestions) * 100);

  const bookmarkCount = stats?.bookmarkCount ?? questions.filter((q) => q.isBookmarked).length;
  const revisionCount = stats?.revisionCount ?? questions.filter((q) => q.isRevision).length;

  // Section 1: Practice & Challenge Arenas (Genuine Explorables)
  const practiceCards: ExploreCardData[] = [
    {
      id: 'bank-1',
      badge: 'Photo Portal',
      subtitle: 'Original Exam Bank',
      title: 'Question Bank 1: Skipped Lab Questions',
      description: '30 authentic lab exam questions with original screenshot photos, testcases, constraints, and hints.',
      gradientClass: 'lc-gradient-java',
      chaptersCount: 6,
      chaptersLabel: 'Topics',
      itemsCount: bank1Questions.length || 30,
      itemsLabel: 'Questions',
      progressPercent: bank1Percent,
      actionText: 'Explore Bank 1',
      onClick: () => onNavigateToBank('bank1')
    },
    {
      id: 'bank-2',
      badge: 'Modern SE 21+',
      subtitle: 'Modern Algorithmic Bank',
      title: 'Question Bank 2: Modern Java SE 21+ Challenges',
      description: '15 algorithmic challenges covering Collections, Streams, Record classes, and modern design patterns.',
      gradientClass: 'lc-gradient-algo',
      chaptersCount: 4,
      chaptersLabel: 'Topics',
      itemsCount: bank2Questions.length || 15,
      itemsLabel: 'Questions',
      progressPercent: bank2Percent,
      actionText: 'Explore Bank 2',
      onClick: () => onNavigateToBank('bank2')
    },
    {
      id: 'bank-3',
      badge: 'Lab Sessions (Day 8-12)',
      subtitle: 'Attended Lab Exam Bank',
      title: 'Question Bank 3: 56 Attended Lab Problems',
      description: '56 newly attended lab problems covering Collections, Comparable/Comparator, Vectors, Iterators, Stacks, Queues, HashMaps, and Multithreading.',
      gradientClass: 'lc-gradient-purple',
      chaptersCount: 11,
      chaptersLabel: 'Topics',
      itemsCount: bank3Questions.length || 56,
      itemsLabel: 'Questions',
      progressPercent: bank3Percent,
      actionText: 'Explore Bank 3',
      onClick: () => onNavigateToBank('bank3')
    },
    {
      id: 'bank-4',
      badge: 'MySQL 8.0 & Triggers',
      subtitle: 'DBMS & SQL Engineering Lab',
      title: 'Question Bank 4: 12 DBMS & SQL Lab Challenges',
      description: '12 authentic lab challenges covering automated triggers, audit logging, and stored procedures with live execution.',
      gradientClass: 'lc-gradient-algo',
      chaptersCount: 4,
      chaptersLabel: 'Lab Modules',
      itemsCount: bank4Questions.length || 12,
      itemsLabel: 'Challenges',
      progressPercent: bank4Percent,
      actionText: 'Explore DBMS Lab',
      onClick: () => {
        if (onNavigateToDBMS) onNavigateToDBMS();
        else onNavigateToBank('dbms');
      }
    },
    {
      id: 'topic-mode',
      badge: 'Structured Path',
      subtitle: 'Organized by Subject',
      title: `Topic Mode: All ${totalQuestions} Questions by Subject`,
      description: `Browse and solve all ${totalQuestions} problems grouped under clear topic headings with progress tracking.`,
      gradientClass: 'lc-gradient-blue',
      chaptersCount: 12,
      chaptersLabel: 'Core Topics',
      itemsCount: totalQuestions,
      itemsLabel: 'Total Problems',
      progressPercent: totalPercent,
      actionText: 'Browse by Topic',
      onClick: () => {
        if (onNavigateToTopicMode) onNavigateToTopicMode();
        else onNavigateToBank('all');
      }
    },
    {
      id: 'exam-simulator',
      badge: 'Timed Mock',
      subtitle: 'Realistic Exam Portal',
      title: 'Pranav Portal Timed Exam Simulator',
      description: 'Simulate a real university lab exam with a countdown clock, question palette, review flags, and instant scorecards.',
      gradientClass: 'lc-gradient-crimson',
      chaptersCount: '3',
      chaptersLabel: 'Exam Modes',
      itemsCount: 'Timed',
      itemsLabel: 'Evaluation',
      progressPercent: 0,
      actionText: 'Launch Simulator',
      onClick: onNavigateToExam
    },
    {
      id: 'revision-queue',
      badge: 'Targeted Review',
      subtitle: 'Revision & Starred',
      title: 'Revision & Starred Problems Queue',
      description: 'Dedicated queue to revisit bookmarked and flagged tricky questions to solidify weak areas before exams.',
      gradientClass: 'lc-gradient-orange',
      chaptersCount: bookmarkCount,
      chaptersLabel: 'Bookmarked',
      itemsCount: revisionCount,
      itemsLabel: 'Revision',
      progressPercent: Math.min(100, Math.round(((bookmarkCount + revisionCount) / (totalQuestions || 1)) * 100)),
      actionText: 'Open Revision Queue',
      onClick: () => {
        if (onNavigateToRevision) onNavigateToRevision();
        else onNavigateToBank('all');
      }
    }
  ];

  // Section 2: Learning & Reference Hub (4 Genuine Explorables)
  const knowledgeCards: ExploreCardData[] = [
    {
      id: 'masterclass',
      badge: '64 Methods',
      subtitle: 'A-Z Encyclopedia',
      title: 'Java Masterclass & Methods Reference',
      description: '18 comprehensive chapters detailing 64 fundamental Java standard library methods with runnable code examples.',
      gradientClass: 'lc-gradient-blue',
      chaptersCount: 18,
      chaptersLabel: 'Chapters',
      itemsCount: 64,
      itemsLabel: 'Methods',
      progressPercent: totalPercent,
      actionText: 'Open Masterclass',
      onClick: onNavigateToMasterclass
    },
    {
      id: 'curriculum',
      badge: '27 Documents',
      subtitle: 'Courseware Docs',
      title: '27 Study Guides (documentss Folder)',
      description: '27 official lecture presentations (.pptx), study guides (.docx), and handouts (.pdf) launchable in native desktop apps.',
      gradientClass: 'lc-gradient-green',
      chaptersCount: 7,
      chaptersLabel: 'Modules',
      itemsCount: 27,
      itemsLabel: 'Study Guides',
      progressPercent: 100,
      actionText: 'Browse Guides',
      onClick: onNavigateToCurriculum
    },
    {
      id: 'workspace',
      badge: 'Java / C++ / Python',
      subtitle: 'Live Compiler Workspace',
      title: 'Live Coding Arena (Java, C++, Python)',
      description: 'Full Monaco editor with multi-language backend execution for Java 27, C++20, and Python 3.12 with test runner.',
      gradientClass: 'lc-gradient-dark',
      chaptersCount: 3,
      chaptersLabel: 'Compilers',
      itemsCount: 'Monaco',
      itemsLabel: 'IDE Runner',
      progressPercent: 100,
      actionText: 'Open Workspace',
      onClick: () => {
        if (onNavigateToWorkspace) onNavigateToWorkspace();
        else onPickRandom();
      }
    },
    {
      id: 'dashboard',
      badge: 'Live Analytics',
      subtitle: 'Progress Radar',
      title: 'Performance Dashboard & Radar',
      description: 'Complete breakdown of solved questions by difficulty, topic mastery radar, daily target streak, and health check.',
      gradientClass: 'lc-gradient-amber',
      chaptersCount: stats?.dailyGoal || 3,
      chaptersLabel: 'Daily Target',
      itemsCount: `${stats?.accuracy || 0}%`,
      itemsLabel: 'Accuracy',
      progressPercent: stats?.completionPercentage || totalPercent,
      actionText: 'View Dashboard',
      onClick: () => {
        if (onNavigateToDashboard) onNavigateToDashboard();
        else onNavigateToBank('all');
      }
    }
  ];

  return (
    <div className="w-full pb-16">
      {/* Header Banner: Clean Brand Typography + On-Point Summary */}
      <div className="mb-8 p-6 rounded-2xl bg-white dark:bg-[#202020] border border-slate-200 dark:border-neutral-800 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <PranavJavaSymbol className="h-8 w-8 flex-shrink-0" />
              <div className="flex items-baseline gap-2">
                <span className="text-slate-900 dark:text-white font-extrabold text-2xl tracking-tight">
                  PRANAV
                </span>
                <span className="text-slate-600 dark:text-neutral-300 font-medium text-xl">
                  Practice
                </span>
                <span className="text-[#FFA116] font-bold text-xl">
                  JAVA
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-neutral-400 mt-2 max-w-2xl leading-relaxed">
              Explore everything available in the arena: {totalQuestions} authentic problem challenges across 3 question banks, 3 compiled languages (Java, C++, Python), 64 masterclass methods, 27 university lecture documents, and a timed exam simulator.
            </p>
          </div>

          {/* Quick Metrics & View Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Live Progress Pill */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-neutral-700/80">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-xs">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {totalSolved} / {totalQuestions} Solved
                </span>
                <span className="text-slate-400 dark:text-neutral-500 ml-1.5 font-mono">
                  ({totalPercent}%)
                </span>
              </div>
            </div>

            {/* Layout Mode Switcher (Grid vs Carousel) */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  layoutMode === 'grid'
                    ? 'bg-white dark:bg-[#252525] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Grid View (See all modules at once)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setLayoutMode('carousel')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  layoutMode === 'carousel'
                    ? 'bg-white dark:bg-[#252525] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Carousel View (LeetCode horizontal rows)"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Carousel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Feature Badges Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-neutral-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 dark:text-neutral-500 font-medium">Included:</span>
          <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-mono font-medium">
            {totalQuestions} Coding Problems
          </span>
          <span className="px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20 font-mono font-medium">
            Java 27 • C++20 • Python 3.12
          </span>
          <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 font-mono font-medium">
            64 Standard Library Methods
          </span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-mono font-medium">
            27 Curriculum Documents
          </span>
          <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 font-mono font-medium">
            Timed Exam Simulator
          </span>
        </div>
      </div>

      {/* Section 1: Practice & Challenge Arenas (Strictly Genuine) */}
      <ExploreSection
        title="Practice & Problem Arenas"
        subtitle="Solve authentic exam questions, test modern Java algorithms, practice by topic, or take timed mocks."
        icon={<BookOpen className="w-5 h-5 text-amber-500" />}
        cards={practiceCards}
        layoutMode={layoutMode}
        onMoreClick={() => onNavigateToBank('all')}
      />

      {/* Section 2: Learning & Reference Hub (Strictly Genuine) */}
      <ExploreSection
        title="Learning & Reference Hub"
        subtitle="Explore the standard library methods encyclopedia, official lecture documents, live compiler, and analytics."
        icon={<Sparkles className="w-5 h-5 text-sky-500" />}
        cards={knowledgeCards}
        layoutMode={layoutMode}
        onMoreClick={onNavigateToMasterclass}
      />
    </div>
  );
};
