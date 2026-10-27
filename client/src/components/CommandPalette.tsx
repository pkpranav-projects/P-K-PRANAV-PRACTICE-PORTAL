import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Code2,
  Compass,
  BookOpen,
  Sparkles,
  GraduationCap,
  Timer,
  LayoutDashboard,
  Moon,
  Sun,
  Maximize2,
  Volume2,
  VolumeX,
  Shuffle,
  X,
  CornerDownLeft,
  FolderTree
} from 'lucide-react';
import { QuestionSummary } from '../types';
import { LeetCodeTab } from './LeetCodeNavbar';
import { soundManager } from '../services/sound';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuestionSummary[];
  onSelectQuestion: (questionId: string) => void;
  setActiveTab: (tab: LeetCodeTab) => void;
  onPickRandom: () => void;
  theme: 'dark' | 'oled' | 'light' | 'system';
  setTheme: (theme: 'dark' | 'oled' | 'light' | 'system') => void;
  onToggleFullscreen: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
}

interface PaletteAction {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions' | 'Theme';
  icon: React.ReactNode;
  shortcut?: string;
  perform: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  questions,
  onSelectQuestion,
  setActiveTab,
  onPickRandom,
  theme,
  setTheme,
  onToggleFullscreen,
  isSoundEnabled,
  onToggleSound
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input whenever opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Base navigation and action items
  const baseActions: PaletteAction[] = [
    {
      id: 'tab-explore',
      title: 'Explore Overview & Featured Rows',
      category: 'Navigation',
      icon: <Compass className="w-4 h-4 text-[#FFA116]" />,
      perform: () => {
        setActiveTab('explore');
        onClose();
      }
    },
    {
      id: 'tab-problems',
      title: 'Problem Bank (All 145+ Questions across 5 Banks)',
      category: 'Navigation',
      icon: <BookOpen className="w-4 h-4 text-blue-400" />,
      perform: () => {
        setActiveTab('problems');
        onClose();
      }
    },
    {
      id: 'tab-topic-mode',
      title: 'Topic Mode: Problems Grouped & Sorted by Topic',
      category: 'Navigation',
      icon: <FolderTree className="w-4 h-4 text-amber-500" />,
      perform: () => {
        try { localStorage.setItem('arena_question_view_mode', 'topic'); } catch {}
        setActiveTab('problems');
        onClose();
      }
    },
    {
      id: 'tab-sql-course',
      title: 'W3Schools SQL Master Handbook (77 Topics, Continuous Reader & Runner)',
      category: 'Navigation',
      icon: <BookOpen className="w-4 h-4 text-emerald-400" />,
      perform: () => {
        setActiveTab('sql-course');
        onClose();
      }
    },
    {
      id: 'tab-masterclass',
      title: 'Java Masterclass (18 Modules & 64 A-Z Methods)',
      category: 'Navigation',
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      perform: () => {
        setActiveTab('masterclass');
        onClose();
      }
    },
    {
      id: 'tab-curriculum',
      title: 'Curriculum & 27 Study Guides (from Documents)',
      category: 'Navigation',
      icon: <GraduationCap className="w-4 h-4 text-purple-400" />,
      perform: () => {
        setActiveTab('curriculum');
        onClose();
      }
    },
    {
      id: 'tab-exam',
      title: 'Contest / Timed Exam Simulator',
      category: 'Navigation',
      icon: <Timer className="w-4 h-4 text-rose-400" />,
      perform: () => {
        setActiveTab('exam');
        onClose();
      }
    },
    {
      id: 'tab-dashboard',
      title: 'Analytics Dashboard & Stats',
      category: 'Navigation',
      icon: <LayoutDashboard className="w-4 h-4 text-indigo-400" />,
      perform: () => {
        setActiveTab('dashboard');
        onClose();
      }
    },
    {
      id: 'act-random',
      title: 'Pick Random Problem to Practice',
      category: 'Actions',
      icon: <Shuffle className="w-4 h-4 text-amber-500" />,
      perform: () => {
        onPickRandom();
        onClose();
      }
    },
    {
      id: 'act-fullscreen',
      title: 'Toggle Absolute Fullscreen Mode',
      category: 'Actions',
      icon: <Maximize2 className="w-4 h-4 text-blue-400" />,
      shortcut: 'Alt+Enter',
      perform: () => {
        onToggleFullscreen();
        onClose();
      }
    },
    {
      id: 'act-sound',
      title: isSoundEnabled ? 'Mute Audio Sound Effects' : 'Enable Audio Sound Effects',
      category: 'Actions',
      icon: isSoundEnabled ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />,
      perform: () => {
        onToggleSound();
        onClose();
      }
    },
    {
      id: 'theme-oled',
      title: 'Switch to OLED Pitch-Black Mode (#000000)',
      category: 'Theme',
      icon: <span className="w-3.5 h-3.5 rounded-full bg-black border border-[#FFA116]" />,
      perform: () => {
        setTheme('oled');
        onClose();
      }
    },
    {
      id: 'theme-dark',
      title: 'Switch to Dark Charcoal Mode (#1a1a1a)',
      category: 'Theme',
      icon: <Moon className="w-4 h-4 text-neutral-400" />,
      perform: () => {
        setTheme('dark');
        onClose();
      }
    },
    {
      id: 'theme-light',
      title: 'Switch to Light Mode',
      category: 'Theme',
      icon: <Sun className="w-4 h-4 text-amber-400" />,
      perform: () => {
        setTheme('light');
        onClose();
      }
    }
  ];

  // Filter actions based on query
  const qLower = query.toLowerCase().trim();

  const filteredActions = qLower
    ? baseActions.filter((a) => a.title.toLowerCase().includes(qLower) || a.category.toLowerCase().includes(qLower))
    : baseActions;

  // Question search matches
  const filteredQuestions = qLower
    ? questions
        .filter(
          (q) =>
            q.title.toLowerCase().includes(qLower) ||
            q.id.toLowerCase().includes(qLower) ||
            q.topic.toLowerCase().includes(qLower) ||
            q.difficulty.toLowerCase().includes(qLower)
        )
        .slice(0, 10)
    : [];

  const totalResults = filteredActions.length + filteredQuestions.length;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalResults));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + Math.max(1, totalResults)) % Math.max(1, totalResults));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex < filteredActions.length) {
          filteredActions[selectedIndex]?.perform();
        } else {
          const qIndex = selectedIndex - filteredActions.length;
          const q = filteredQuestions[qIndex];
          if (q) {
            onSelectQuestion(q.id);
            onClose();
          }
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, totalResults, filteredActions, filteredQuestions, onSelectQuestion, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 animate-in fade-in duration-150 [isolation:isolate]">
      <div
        className="relative w-full max-w-2xl bg-[#1e1e1e] border border-[#383838] rounded-xl shadow-2xl overflow-hidden flex flex-col text-[#eff1f6bf]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#333333] bg-[#252525]">
          <Search className="w-5 h-5 text-neutral-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search Java questions (e.g. 'reverse', 'array', 'exam', 'oled')..."
            className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-neutral-500 font-sans"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#333333] text-neutral-400 ml-2">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {/* Question Matches Section */}
          {filteredQuestions.length > 0 && (
            <div className="mb-2">
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Questions ({filteredQuestions.length})
              </div>
              {filteredQuestions.map((q, idx) => {
                const itemIndex = filteredActions.length + idx;
                const isSelected = selectedIndex === itemIndex;
                const diffColor =
                  q.difficulty === 'Easy'
                    ? 'text-emerald-400 bg-emerald-950/60'
                    : q.difficulty === 'Medium'
                    ? 'text-amber-400 bg-amber-950/60'
                    : 'text-rose-400 bg-rose-950/60';

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      onSelectQuestion(q.id);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#FFA116] text-black font-semibold' : 'text-neutral-300 hover:bg-[#2a2a2a]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Code2 className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-black' : 'text-blue-400'}`} />
                      <span className="font-mono text-[11px] opacity-75">{q.id}</span>
                      <span className="truncate">{q.title}</span>
                      {q.solved && (
                        <span className="text-[10px] text-emerald-400 font-bold ml-1">✓</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isSelected ? 'bg-black/20 text-black' : diffColor}`}>
                        {q.difficulty}
                      </span>
                      {isSelected && <CornerDownLeft className="w-3.5 h-3.5 opacity-70" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Actions & Navigation Section */}
          {filteredActions.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                {qLower ? 'Matching Actions' : 'Quick Actions & Pages'}
              </div>
              {filteredActions.map((action, idx) => {
                const isSelected = selectedIndex === idx;

                return (
                  <button
                    key={action.id}
                    onClick={action.perform}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#FFA116] text-black font-semibold' : 'text-neutral-300 hover:bg-[#2a2a2a]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0">{action.icon}</span>
                      <span>{action.title}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {action.shortcut && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isSelected ? 'bg-black/20 text-black' : 'bg-[#2e2e2e] text-neutral-400'}`}>
                          {action.shortcut}
                        </span>
                      )}
                      {isSelected && <CornerDownLeft className="w-3.5 h-3.5 opacity-70" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {totalResults === 0 && (
            <div className="py-12 text-center text-sm text-neutral-400">
              No matching questions or commands found for "{query}".
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#333333] bg-[#1a1a1a] text-[11px] text-neutral-400 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span className="text-[#FFA116] font-bold">45</span>
            <span>Problems Indexed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
