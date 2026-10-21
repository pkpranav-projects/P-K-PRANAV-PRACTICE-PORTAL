import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  category: 'Editor' | 'Workspace' | 'Global';
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const shortcuts: ShortcutItem[] = [
    {
      keys: ['Ctrl', 'Enter'],
      description: 'Run code against sample or custom input',
      category: 'Editor'
    },
    {
      keys: ['Ctrl', 'Shift', 'Enter'],
      description: 'Submit solution for full grading & test-case evaluation',
      category: 'Editor'
    },
    {
      keys: ['Alt', 'F'],
      description: 'Auto-format Java code indentation & braces',
      category: 'Editor'
    },
    {
      keys: ['Alt', 'R'],
      description: 'Reset code to default starter template',
      category: 'Editor'
    },
    {
      keys: ['Alt', 'Z'],
      description: 'Toggle Zen Focus Mode (Hide everything except coding)',
      category: 'Workspace'
    },
    {
      keys: ['Alt', 'Enter'],
      description: 'Toggle Absolute Fullscreen Mode',
      category: 'Workspace'
    },
    {
      keys: ['Ctrl', 'K'],
      description: 'Open Command Palette & Quick Problem Search',
      category: 'Global'
    },
    {
      keys: ['Ctrl', 'B'],
      description: 'Toggle Sidebar collapse / expand',
      category: 'Global'
    },
    {
      keys: ['?'],
      description: 'Show this keyboard shortcuts cheatsheet',
      category: 'Global'
    },
    {
      keys: ['Esc'],
      description: 'Close modals / Exit Fullscreen',
      category: 'Global'
    }
  ];

  const categories = ['Editor', 'Workspace', 'Global'] as const;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-[#1e1e1e] border border-[#383838] rounded-xl shadow-2xl overflow-hidden text-[#eff1f6bf]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#333333] bg-[#252525]">
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-5 h-5 text-[#FFA116]" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#333] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts list grouped by category */}
        <div className="p-5 max-h-[460px] overflow-y-auto space-y-5">
          {categories.map((cat) => (
            <div key={cat} className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                {cat} Shortcuts
              </h4>
              <div className="space-y-1.5">
                {shortcuts
                  .filter((s) => s.category === cat)
                  .map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-[#282828] transition-colors text-xs"
                    >
                      <span className="text-neutral-300">{s.description}</span>
                      <div className="flex items-center gap-1">
                        {s.keys.map((k, kIdx) => (
                          <kbd
                            key={kIdx}
                            className="px-2 py-1 rounded bg-[#2e2e2e] border border-[#444444] text-[11px] font-mono text-neutral-200 shadow-sm"
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#333333] bg-[#1a1a1a] text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#FFA116] text-black hover:bg-[#ffb03a] transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
