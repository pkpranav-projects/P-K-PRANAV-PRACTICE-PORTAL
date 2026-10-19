import React, { useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play
} from 'lucide-react';
import { PranavJavaSymbol } from './PranavJavaSymbol';
import { DashboardStats, QuestionSummary } from '../types';

interface ExploreCardData {
  id: string;
  subtitle: string;
  title: string;
  gradientClass: string;
  chaptersCount: number | string;
  chaptersLabel: string;
  itemsCount: number | string;
  itemsLabel: string;
  progressPercent: number;
  onClick: () => void;
}

interface ExploreSectionProps {
  title: string;
  cards: ExploreCardData[];
  onMoreClick?: () => void;
}

const ExploreSection: React.FC<ExploreSectionProps> = ({ title, cards, onMoreClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-10">
      {/* Section Header with Title & More Button */}
      <div className="mb-4 mt-6 flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-white tracking-tight">
          {title}
        </h3>
        {onMoreClick && (
          <button
            onClick={onMoreClick}
            className="bg-[#282828] hover:bg-[#333333] px-3 h-6 rounded-full text-xs text-[#00c1de] hover:text-[#38d4eb] font-medium transition-colors"
          >
            More
          </button>
        )}
      </div>

      {/* Showcase Row Container with Scroll Buttons */}
      <div className="relative group">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute -translate-y-1/2 rounded-full z-20 left-1 top-1/2 w-9 h-9 bg-[#262626]/90 hover:bg-[#333333] text-white flex items-center justify-center shadow-xl border border-neutral-700/60 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Cards Wrapper */}
        <div
          ref={scrollRef}
          className="flex flex-nowrap overflow-x-auto scrollbar-hide gap-5 py-2 scroll-smooth"
        >
          {cards.map((card) => {
            const circumference = 175.9;
            const strokeDashoffset = circumference - (circumference * Math.min(100, Math.max(0, card.progressPercent))) / 100;

            return (
              <div
                key={card.id}
                className="w-[280px] flex-none select-none"
              >
                <div
                  onClick={card.onClick}
                  className="rounded-2xl shadow-md hover:shadow-2xl transition-all duration-200 bg-[#262626] border border-neutral-800 overflow-hidden cursor-pointer group/card"
                >
                  {/* Card Top Header with LeetCode Gradient */}
                  <div className={`relative h-44 rounded-t-2xl p-5 flex flex-col justify-between ${card.gradientClass}`}>
                    <div className="text-white z-10">
                      <div className="mb-1.5 text-xs font-medium leading-tight text-white/80 drop-shadow">
                        {card.subtitle}
                      </div>
                      <div className="text-xl font-semibold leading-tight text-white drop-shadow line-clamp-2">
                        {card.title}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Chapters, Items, Solved % + Floating Play Button */}
                  <div className="relative h-[84px] bg-[#262626] p-3 text-center border-t border-neutral-800">
                    {/* Floating Circular Play / Progress Button */}
                    <div className="relative">
                      <div
                        className="z-10 absolute flex h-[62px] w-[62px] cursor-pointer items-center justify-center rounded-full bg-[#262626] border border-neutral-700/50 shadow-xl transition-all duration-200 -top-8 right-3 group-hover/card:scale-105"
                      >
                        {/* Circular Progress Ring */}
                        <svg height="62" width="62" className="absolute left-0 top-0 -rotate-90">
                          <circle
                            cx="31"
                            cy="31"
                            r="28"
                            fill="transparent"
                            stroke="#3e3e3e"
                            strokeWidth="3.5"
                          />
                          <circle
                            cx="31"
                            cy="31"
                            r="28"
                            fill="transparent"
                            stroke="#2cbb5d"
                            strokeWidth="3.5"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                          />
                        </svg>

                        {/* Play Triangle Icon */}
                        <div className="relative text-white group-hover/card:text-[#2cbb5d] transition-colors ml-0.5">
                          <Play className="w-5 h-5 fill-current" />
                        </div>
                      </div>
                    </div>

                    {/* Stats columns */}
                    <div className="flex h-full items-end justify-between pr-18 pl-2">
                      <div className="flex h-full flex-col items-start justify-between py-0.5">
                        <div className="text-xl font-semibold text-white font-mono">
                          {card.chaptersCount}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {card.chaptersLabel}
                        </div>
                      </div>
                      <div className="flex h-full flex-col items-start justify-between py-0.5">
                        <div className="text-xl font-semibold text-white font-mono">
                          {card.itemsCount}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {card.itemsLabel}
                        </div>
                      </div>
                      <div className="flex h-full flex-col justify-end">
                        <div className="font-semibold text-xs text-neutral-400 font-mono">
                          {card.progressPercent}%
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute -translate-y-1/2 rounded-full z-20 right-1 top-1/2 w-9 h-9 bg-[#262626]/90 hover:bg-[#333333] text-white flex items-center justify-center shadow-xl border border-neutral-700/60 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

interface ExploreViewProps {
  stats: DashboardStats | null;
  questions: QuestionSummary[];
  onSelectQuestion: (questionId: string) => void;
  onNavigateToBank: (bank: 'bank1' | 'bank2' | 'all') => void;
  onNavigateToMasterclass: () => void;
  onNavigateToCurriculum: () => void;
  onNavigateToExam: () => void;
  onPickRandom: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  stats,
  questions,
  onNavigateToBank,
  onNavigateToMasterclass,
  onNavigateToCurriculum,
  onNavigateToExam
}) => {
  const bank1Questions = questions.filter(
    (q) => q.bank === 'bank1' || (!q.bank && q.id.startsWith('java-'))
  );
  const bank2Questions = questions.filter(
    (q) => q.bank === 'bank2' || (!q.bank && q.id.startsWith('bank2-'))
  );

  const bank1Solved = bank1Questions.filter((q) => q.solved).length;
  const bank2Solved = bank2Questions.filter((q) => q.solved).length;

  const bank1Percent = Math.round((bank1Solved / (bank1Questions.length || 1)) * 100);
  const bank2Percent = Math.round((bank2Solved / (bank2Questions.length || 1)) * 100);

  // Section 1: Featured Cards
  const featuredCards: ExploreCardData[] = [
    {
      id: 'bank-1',
      subtitle: "Photo Portal Exam Bank",
      title: "Question Bank 1: Authentic Skipped Questions",
      gradientClass: 'lc-gradient-java',
      chaptersCount: 6,
      chaptersLabel: 'Topics',
      itemsCount: bank1Questions.length || 30,
      itemsLabel: 'Questions',
      progressPercent: bank1Percent,
      onClick: () => onNavigateToBank('bank1')
    },
    {
      id: 'bank-2',
      subtitle: "Modern Java Standards",
      title: "Question Bank 2: Modern Java SE 21+ Challenges",
      gradientClass: 'lc-gradient-algo',
      chaptersCount: 4,
      chaptersLabel: 'Topics',
      itemsCount: bank2Questions.length || 15,
      itemsLabel: 'Questions',
      progressPercent: bank2Percent,
      onClick: () => onNavigateToBank('bank2')
    },
    {
      id: 'masterclass',
      subtitle: "A-Z Encyclopedia",
      title: "Java Full Masterclass & Methods Reference",
      gradientClass: 'lc-gradient-purple',
      chaptersCount: 18,
      chaptersLabel: 'Chapters',
      itemsCount: 64,
      itemsLabel: 'Methods',
      progressPercent: stats?.solvedCount ? Math.min(100, Math.round((stats.solvedCount / 45) * 100)) : 0,
      onClick: onNavigateToMasterclass
    },
    {
      id: 'curriculum',
      subtitle: "University Study Material",
      title: "27 Study Guides from documentss Folder",
      gradientClass: 'lc-gradient-green',
      chaptersCount: 7,
      chaptersLabel: 'Modules',
      itemsCount: 27,
      itemsLabel: 'Guides',
      progressPercent: 100,
      onClick: onNavigateToCurriculum
    },
    {
      id: 'exam',
      subtitle: "Mock Tests",
      title: "Neo Portal Timed Exam Simulator",
      gradientClass: 'lc-gradient-crimson',
      chaptersCount: 3,
      chaptersLabel: 'Modes',
      itemsCount: 'Timed',
      itemsLabel: 'Mocks',
      progressPercent: 0,
      onClick: onNavigateToExam
    }
  ];

  // Section 2: Interview Cards
  const interviewCards: ExploreCardData[] = [
    {
      id: 'int-strings',
      subtitle: "Core Algorithms",
      title: "String Slicing, Anagrams & Palindromes",
      gradientClass: 'lc-gradient-orange',
      chaptersCount: 4,
      chaptersLabel: 'Chapters',
      itemsCount: 8,
      itemsLabel: 'Problems',
      progressPercent: bank1Percent,
      onClick: () => onNavigateToBank('all')
    },
    {
      id: 'int-matrix',
      subtitle: "Arrays & Grids",
      title: "Matrix Rotations, Spiral Walks & 2D Arrays",
      gradientClass: 'lc-gradient-blue',
      chaptersCount: 5,
      chaptersLabel: 'Chapters',
      itemsCount: 10,
      itemsLabel: 'Problems',
      progressPercent: bank2Percent,
      onClick: () => onNavigateToBank('bank2')
    },
    {
      id: 'int-oop',
      subtitle: "Object-Oriented Design",
      title: "Classes, Inheritance, Interfaces & Polymorphism",
      gradientClass: 'lc-gradient-purple',
      chaptersCount: 5,
      chaptersLabel: 'Chapters',
      itemsCount: 7,
      itemsLabel: 'Problems',
      progressPercent: bank1Percent,
      onClick: () => onNavigateToBank('bank1')
    },
    {
      id: 'int-exceptions',
      subtitle: "Robust Code",
      title: "Exception Handling, Try-Catch & File I/O",
      gradientClass: 'lc-gradient-crimson',
      chaptersCount: 3,
      chaptersLabel: 'Chapters',
      itemsCount: 5,
      itemsLabel: 'Problems',
      progressPercent: 0,
      onClick: () => onNavigateToBank('bank1')
    },
    {
      id: 'int-collections',
      subtitle: "Data Collections",
      title: "ArrayList, HashMap & Frequency Counts",
      gradientClass: 'lc-gradient-sql',
      chaptersCount: 4,
      chaptersLabel: 'Chapters',
      itemsCount: 6,
      itemsLabel: 'Problems',
      progressPercent: 0,
      onClick: () => onNavigateToBank('bank2')
    }
  ];

  // Section 3: Learn Cards
  const learnCards: ExploreCardData[] = [
    {
      id: 'learn-beginner',
      subtitle: "Getting Started",
      title: "The Modern Java Beginner's Guide",
      gradientClass: 'lc-gradient-algo',
      chaptersCount: 4,
      chaptersLabel: 'Chapters',
      itemsCount: 12,
      itemsLabel: 'Guides',
      progressPercent: 100,
      onClick: onNavigateToCurriculum
    },
    {
      id: 'learn-methods',
      subtitle: "A-Z Standard Library",
      title: "Detailed Explanation of Methods & Functions",
      gradientClass: 'lc-gradient-purple',
      chaptersCount: 18,
      chaptersLabel: 'Chapters',
      itemsCount: 64,
      itemsLabel: 'Functions',
      progressPercent: 50,
      onClick: onNavigateToMasterclass
    },
    {
      id: 'learn-curriculum-1',
      subtitle: "Core Foundations",
      title: "Curriculum Modules 01 to 14: Java Fundamentals",
      gradientClass: 'lc-gradient-green',
      chaptersCount: 4,
      chaptersLabel: 'Modules',
      itemsCount: 14,
      itemsLabel: 'Guides',
      progressPercent: 100,
      onClick: onNavigateToCurriculum
    },
    {
      id: 'learn-curriculum-2',
      subtitle: "Advanced Concepts",
      title: "Curriculum Modules 15 to 27: OOP & Concurrency",
      gradientClass: 'lc-gradient-amber',
      chaptersCount: 3,
      chaptersLabel: 'Modules',
      itemsCount: 13,
      itemsLabel: 'Guides',
      progressPercent: 100,
      onClick: onNavigateToCurriculum
    }
  ];

  return (
    <div className="w-full pb-16">
      {/* Exact LeetCode Explore Page Header (clean, uncluttered) */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="text-sm text-neutral-400">Welcome to</div>
          <div className="text-[26px] font-bold text-white tracking-tight flex items-center gap-3">
            <PranavJavaSymbol className="h-7 w-7 inline-block flex-shrink-0" />
            <div className="flex items-baseline gap-2">
              <span className="text-white font-extrabold">PRANAV</span>
              <span className="text-neutral-300 font-medium text-[24px]">Practice</span>
              <span className="text-[#FFA116] font-bold text-[24px]">JAVA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sections: Featured, Interview, Learn */}
      <ExploreSection
        title="Featured"
        cards={featuredCards}
        onMoreClick={() => onNavigateToBank('all')}
      />

      <ExploreSection
        title="Interview"
        cards={interviewCards}
        onMoreClick={() => onNavigateToBank('bank1')}
      />

      <ExploreSection
        title="Learn"
        cards={learnCards}
        onMoreClick={onNavigateToCurriculum}
      />
    </div>
  );
};
