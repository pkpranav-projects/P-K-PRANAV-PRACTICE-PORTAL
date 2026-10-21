import React, { useState } from 'react';
import {
  X,
  Settings,
  Download,
  Upload,
  RotateCcw,
  Sun,
  Moon,
  Laptop,
  Target,
  Check,
  AlertTriangle,
  Server
} from 'lucide-react';
import { api } from '../services/api';
import { SystemHealth } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'oled' | 'light' | 'system';
  setTheme: (theme: 'dark' | 'oled' | 'light' | 'system') => void;
  dailyGoal: number;
  onUpdateDailyGoal: (goal: number) => void;
  systemHealth: SystemHealth | null;
  onDataReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  setTheme,
  dailyGoal,
  onUpdateDailyGoal,
  systemHealth,
  onDataReset
}) => {
  const [goalInput, setGoalInput] = useState(dailyGoal);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  if (!isOpen) return null;

  const handleSaveGoal = async () => {
    try {
      await api.updateSetting('daily_goal', goalInput.toString());
      onUpdateDailyGoal(goalInput);
    } catch (err) {
      console.error('Failed to update goal setting:', err);
    }
  };

  const handleExportBackup = async () => {
    try {
      setIsExporting(true);
      const data = await api.exportBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `java_arena_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const text = await file.text();
      const json = JSON.parse(text);
      await api.importBackup(json);
      setImportMessage('Backup successfully restored!');
      setTimeout(() => {
        setImportMessage(null);
        onDataReset(); // Reload stats and data
      }, 1500);
    } catch (err: any) {
      setImportMessage(`Import error: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleResetProgress = async () => {
    try {
      setResetting(true);
      await api.resetProgress();
      setShowResetConfirm(false);
      onDataReset();
      onClose();
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-fadeIn [isolation:isolate]">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Platform Settings
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Theme Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Color Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-neutral-800 border-amber-500 text-white shadow-sm ring-1 ring-amber-500'
                    : 'border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-neutral-850'
                }`}
              >
                <Moon className="w-4 h-4 text-neutral-300" />
                <span>Dark</span>
              </button>

              <button
                onClick={() => setTheme('oled')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  theme === 'oled'
                    ? 'bg-black border-[#FFA116] text-[#FFA116] shadow-sm ring-1 ring-[#FFA116]'
                    : 'border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-300 hover:bg-black hover:text-white'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-black border-[1.5px] border-[#FFA116]" />
                <span>OLED Black</span>
              </button>

              <button
                onClick={() => setTheme('light')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  theme === 'light'
                    ? 'bg-neutral-100 border-amber-500 text-slate-900 shadow-sm ring-1 ring-amber-500'
                    : 'border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-neutral-850'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light</span>
              </button>

              <button
                onClick={() => setTheme('system')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  theme === 'system'
                    ? 'bg-neutral-800 border-amber-500 text-white shadow-sm ring-1 ring-amber-500'
                    : 'border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-neutral-850'
                }`}
              >
                <Laptop className="w-4 h-4" />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* Daily Goal Config */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Daily Target Goal
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={15}
                value={goalInput}
                onChange={(e) => setGoalInput(Math.max(1, Math.min(15, Number(e.target.value))))}
                className="w-24 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                questions per day
              </span>
              <button
                onClick={handleSaveGoal}
                className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Save Target
              </button>
            </div>
          </div>

          {/* Environment Diagnostics */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Execution Environment
            </label>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Java Runtime:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {systemHealth?.java.version || 'OpenJDK 27'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Java Compiler:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {systemHealth?.javac.version || 'javac 27'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Local Database:</span>
                <span className="font-mono text-emerald-500 font-semibold">
                  Node SQLite (arena.db)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Exam Question Bank:</span>
                <span className="font-mono font-semibold text-indigo-500">
                  30 Extracted & Verified Problems
                </span>
              </div>
            </div>
          </div>

          {/* Backup & Restore */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Data Management & Backup
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportBackup}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Exporting...' : 'Export JSON Backup'}</span>
              </button>

              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>{isImporting ? 'Restoring...' : 'Import JSON Backup'}</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>

            {importMessage && (
              <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-1">
                {importMessage}
              </p>
            )}
          </div>

          {/* Danger Zone: Reset Progress */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 block">
                  Reset Practice Data
                </span>
                <span className="text-[11px] text-rose-600/80 dark:text-rose-400/70">
                  Clears all submissions, draft code, bookmarks, and revision tags.
                </span>
              </div>

              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
          >
            Done
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 [isolation:isolate]">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Confirm Complete Reset
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure? This will reset all your progress, submissions, accuracy stats, and drafts back to a fresh state.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleResetProgress}
                disabled={resetting}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
              >
                {resetting ? 'Resetting...' : 'Yes, Reset All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
