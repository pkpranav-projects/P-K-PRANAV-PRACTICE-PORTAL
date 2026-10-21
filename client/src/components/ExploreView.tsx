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
  title: string;
  description: string;
  gradientClass: string;
  itemsCount: string;
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
    return (
      <div
        key={card.id}
        onClick={card.onClick}
        className="rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-[#1f1f1f] border border-slate-200 dark:border-neutral-800 hover:border-amber-400 dark:hover:border-amber-500/60 overflow-hidden cursor-pointer group flex flex-col justify-between select-none"
      >
        {/* Card Top: Gradient Banner with Title & Badge */}
        <div className={`relative p-4 flex flex-col justify-between min-h-[100px] ${card.gradientClass}`}>
          <div className="flex items-start justify-between gap-2 z-10">
            <h4 className="text-[15px] font-bold text-white leading-snug drop-shadow line-clamp-1 group-hover:translate-x-0.5 transition-transform">
              {card.title}
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/25 text-white backdrop-blur-sm border border-white/20 whitespace-nowrap shadow-sm">
              {card.badge}
            </span>
          </div>

          <p className="text-xs text-white/85 line-clamp-1 mt-1 drop-shadow-sm">
            {card.description}
          </p>
        </div>

        {/* Card Bottom: Simple Stats & Clean Action */}
        <div className="bg-slate-50 dark:bg-[#1a1a1a] px-4 py-3 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between transition-colors">
          <div className="flex flex-col gap-1 w-2/3">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-neutral-400 font-medium">
              <span>{card.itemsCount}</span>
              {card.progressPercent > 0 && (
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{card.progressPercent}%</span>
              )}
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${card.progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-neutral-300 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
            <span>{card.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
  onNavigateToBank: (bank: 'bank1' | 'bank2' | 'bank3' | 'bank4' | 'dbms' | 'all') => void;
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
    (q) => q.bank === 'bank4' || (!q.bank && q.id.startsWith('bank4-'))
  );
  const dbmsQuestions = questions.filter(
    (q) => q.bank === 'dbms' || (!q.bank && q.id.startsWith('dbms-'))
  );

  const bank1Solved = bank1Questions.filter((q) => q.solved).length;
  const bank2Solved = bank2Questions.filter((q) => q.solved).length;
  const bank3Solved = bank3Questions.filter((q) => q.solved).length;
  const bank4Solved = bank4Questions.filter((q) => q.solved).length;
  const dbmsSolved = dbmsQuestions.filter((q) => q.solved).length;
  const totalSolved = stats?.solvedCount ?? questions.filter((q) => q.solved).length;
  const totalQuestions = questions.length || 145;

  const bank1Percent = Math.round((bank1Solved / (bank1Questions.length || 1)) * 100);
  const bank2Percent = Math.round((bank2Solved / (bank2Questions.length || 1)) * 100);
  const bank3Percent = Math.round((bank3Solved / (bank3Questions.length || 1)) * 100);
  const bank4Percent = Math.round((bank4Solved / (bank4Questions.length || 1)) * 100);
  const dbmsPercent = Math.round((dbmsSolved / (dbmsQuestions.length || 1)) * 100);
  const totalPercent = Math.round((totalSolved / totalQuestions) * 100);

  const bookmarkCount = stats?.bookmarkCount ?? questions.filter((q) => q.isBookmarked).length;
  const revisionCount = stats?.revisionCount ?? questions.filter((q) => q.isRevision).length;

  // Section 1: Practice Tracks
  const practiceCards: ExploreCardData[] = [
    {
      id: 'bank-1',
      badge: `${bank1Questions.length} Problems`,
      title: 'Bank 1: Photo Portal',
      description: 'Original lab exam questions with screenshot testcases and constraints.',
      gradientClass: 'lc-gradient-java',
      itemsCount: `${bank1Solved}/${bank1Questions.length} solved`,
      progressPercent: bank1Percent,
      actionText: 'Explore',
      onClick: () => onNavigateToBank('bank1')
    },
    {
      id: 'bank-2',
      badge: `${bank2Questions.length} Problems`,
      title: 'Bank 2: Modern Java',
      description: 'Java SE 21+ algorithmic challenges on Collections, Streams, and Records.',
      gradientClass: 'lc-gradient-algo',
      itemsCount: `${bank2Solved}/${bank2Questions.length} solved`,
      progressPercent: bank2Percent,
      actionText: 'Explore',
      onClick: () => onNavigateToBank('bank2')
    },
    {
      id: 'bank-3',
      badge: `${bank3Questions.length} Problems`,
      title: 'Bank 3: Lab Tests',
      description: 'Attended lab problems on Collections, Stacks, Maps, and Multithreading.',
      gradientClass: 'lc-gradient-purple',
      itemsCount: `${bank3Solved}/${bank3Questions.length} solved`,
      progressPercent: bank3Percent,
      actionText: 'Explore',
      onClick: () => onNavigateToBank('bank3')
    },
    {
      id: 'bank-4',
      badge: `${bank4Questions.length} Problems`,
      title: 'Bank 4: Video Projects',
      description: 'OOP to File Handling problems and interactive console mini projects.',
      gradientClass: 'lc-gradient-crimson',
      itemsCount: `${bank4Solved}/${bank4Questions.length} solved`,
      progressPercent: bank4Percent,
      actionText: 'Explore',
      onClick: () => onNavigateToBank('bank4')
    },
    {
      id: 'bank-dbms',
      badge: `${dbmsQuestions.length} Challenges`,
      title: 'DBMS & SQL Lab',
      description: 'MySQL database triggers, audit logging, and stored procedures with live execution.',
      gradientClass: 'lc-gradient-algo',
      itemsCount: `${dbmsSolved}/${dbmsQuestions.length} solved`,
      progressPercent: dbmsPercent,
      actionText: 'Explore',
      onClick: () => {
        if (onNavigateToDBMS) onNavigateToDBMS();
        else onNavigateToBank('dbms');
      }
    },
    {
      id: 'topic-mode',
      badge: 'All 145',
      title: 'Topic Mode',
      description: 'All 145 problems grouped and categorized under subject accordions.',
      gradientClass: 'lc-gradient-blue',
      itemsCount: `${totalSolved}/${totalQuestions} solved`,
      progressPercent: totalPercent,
      actionText: 'Browse',
      onClick: () => {
        if (onNavigateToTopicMode) onNavigateToTopicMode();
        else onNavigateToBank('all');
      }
    },
    {
      id: 'exam-simulator',
      badge: 'Timed Mock',
      title: 'Exam Simulator',
      description: 'Simulate a university lab exam with countdown clock, flags, and scorecards.',
      gradientClass: 'lc-gradient-crimson',
      itemsCount: '3 Mock Modes',
      progressPercent: 0,
      actionText: 'Launch',
      onClick: onNavigateToExam
    },
    {
      id: 'revision-queue',
      badge: `${bookmarkCount + revisionCount} Saved`,
      title: 'Revision Queue',
      description: 'Targeted review queue for flagged and bookmarked difficult problems.',
      gradientClass: 'lc-gradient-orange',
      itemsCount: `${bookmarkCount + revisionCount} items`,
      progressPercent: Math.min(100, Math.round(((bookmarkCount + revisionCount) / (totalQuestions || 1)) * 100)),
      actionText: 'Review',
      onClick: () => {
        if (onNavigateToRevision) onNavigateToRevision();
        else onNavigateToBank('all');
      }
    }
  ];

  // Section 2: Reference & Tools
  const knowledgeCards: ExploreCardData[] = [
    {
      id: 'masterclass',
      badge: '64 Methods',
      title: 'Java Masterclass',
      description: '18 modules and 64 fundamental Java standard library methods with examples.',
      gradientClass: 'lc-gradient-blue',
      itemsCount: '64 Methods',
      progressPercent: 100,
      actionText: 'Open',
      onClick: onNavigateToMasterclass
    },
    {
      id: 'curriculum',
      badge: '27 Guides',
      title: 'Study Guides',
      description: 'Official university courseware presentations, study guides, and handouts.',
      gradientClass: 'lc-gradient-green',
      itemsCount: '27 Docs',
      progressPercent: 100,
      actionText: 'Browse',
      onClick: onNavigateToCurriculum
    },
    {
      id: 'workspace',
      badge: 'Runner',
      title: 'Code Workspace',
      description: 'Interactive IDE with compiler execution for Java, C++, and Python.',
      gradientClass: 'lc-gradient-dark',
      itemsCount: '3 Languages',
      progressPercent: 100,
      actionText: 'Code',
      onClick: () => {
        if (onNavigateToWorkspace) onNavigateToWorkspace();
        else onPickRandom();
      }
    },
    {
      id: 'dashboard',
      badge: 'Radar',
      title: 'Analytics Dashboard',
      description: 'Progress radar, difficulty breakdown, accuracy rate, and daily target.',
      gradientClass: 'lc-gradient-amber',
      itemsCount: `${stats?.accuracy || 0}% Accuracy`,
      progressPercent: stats?.completionPercentage || totalPercent,
      actionText: 'View',
      onClick: () => {
        if (onNavigateToDashboard) onNavigateToDashboard();
        else onNavigateToBank('all');
      }
    }
  ];

  return (
    <div className="w-full pb-16">
      {/* Header Banner: Clean Brand Typography + On-Point Summary */}
      <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#202020] border border-slate-200 dark:border-neutral-800 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <PranavJavaSymbol className="h-7 w-7 flex-shrink-0" />
              <div className="flex items-baseline gap-2">
                <span className="text-slate-900 dark:text-white font-extrabold text-xl tracking-tight">
                  PRANAV
                </span>
                <span className="text-slate-600 dark:text-neutral-300 font-medium text-lg">
                  Practice
                </span>
                <span className="text-[#FFA116] font-bold text-lg">
                  JAVA
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 max-w-xl">
              145 problems across 5 banks • Java, C++, Python & SQL • Instant test runner
            </p>
          </div>

          {/* Quick Metrics & View Toggle */}
          <div className="flex items-center gap-3">
            {/* Live Progress Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-neutral-700/80 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-900 dark:text-white">
                {totalSolved} / {totalQuestions} Solved
              </span>
              <span className="text-slate-400 dark:text-neutral-500 font-mono">
                ({totalPercent}%)
              </span>
            </div>

            {/* Layout Mode Switcher */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  layoutMode === 'grid'
                    ? 'bg-white dark:bg-[#252525] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setLayoutMode('carousel')}
                className={`p-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  layoutMode === 'carousel'
                    ? 'bg-white dark:bg-[#252525] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Carousel View"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Practice Tracks */}
      <ExploreSection
        title="Practice Tracks"
        subtitle="Choose a question bank or explore problems by topic."
        icon={<BookOpen className="w-5 h-5 text-amber-500" />}
        cards={practiceCards}
        layoutMode={layoutMode}
        onMoreClick={() => onNavigateToBank('all')}
      />

      {/* Section 2: Reference & Study Hub */}
      <ExploreSection
        title="Resources & Reference"
        subtitle="Study guides, standard library methods, and compiler arena."
        icon={<Sparkles className="w-5 h-5 text-sky-500" />}
        cards={knowledgeCards}
        layoutMode={layoutMode}
        onMoreClick={onNavigateToMasterclass}
      />
    </div>
  );
};
