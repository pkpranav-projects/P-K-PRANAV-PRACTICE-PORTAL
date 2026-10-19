import React from 'react';
import {
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  Bookmark,
  Zap,
  Code2,
  TrendingUp,
  Activity,
  ChevronRight,
  Terminal,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { DashboardStats } from '../types';

interface DashboardViewProps {
  stats: DashboardStats | null;
  onSelectQuestion: (questionId: string) => void;
  onNavigateToBank: () => void;
  onNavigateToRevision: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  onSelectQuestion,
  onNavigateToBank,
  onNavigateToRevision
}) => {
  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const hasActivity = stats.totalSubmissions > 0;
  const nextTargetQuestion = stats.recentActivity.length > 0 
    ? stats.recentActivity[0].questionId 
    : 'java-001';

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-6xl mx-auto">
      {/* Top Quick Status Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c121e] border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono uppercase font-semibold text-slate-500 dark:text-slate-400">
              Lab Execution Sandbox Ready
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white m-0">
            {hasActivity ? 'Ready to continue your practice session' : 'Begin your Java portal exam preparation'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectQuestion(nextTargetQuestion)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all hover:scale-[1.02]"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{hasActivity ? `Resume (${nextTargetQuestion})` : 'Start java-001'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onNavigateToBank}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span>Browse {stats.totalQuestions} Questions</span>
          </button>
        </div>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Solved Card */}
        <div className="bg-white dark:bg-[#0c121e] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Problems Solved
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
              {stats.solvedCount}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              / {stats.totalQuestions}
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.completionPercentage}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {stats.completionPercentage}% completion rate
          </p>
        </div>

        {/* Accuracy Card */}
        <div className="bg-white dark:bg-[#0c121e] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Accuracy
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
              {stats.accuracy}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              overall
            </span>
          </div>
          <p className="mt-4 text-[11px] text-slate-500 dark:text-slate-400">
            Based on {stats.totalSubmissions} live submissions
          </p>
        </div>

        {/* Daily Goal Card */}
        <div className="bg-white dark:bg-[#0c121e] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Daily Target
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Target className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
              {stats.solvedToday}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              / {stats.dailyGoal} today
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (stats.solvedToday / stats.dailyGoal) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {stats.solvedToday >= stats.dailyGoal
              ? '🎉 Daily goal completed'
              : `${stats.dailyGoal - stats.solvedToday} more to reach target`}
          </p>
        </div>

        {/* Revision Queue Card */}
        <div 
          onClick={onNavigateToRevision}
          className="bg-white dark:bg-[#0c121e] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Revision Queue
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Bookmark className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
              {stats.revisionCount}
            </span>
            <span className="text-xs text-slate-400">
              flagged
            </span>
          </div>
          <p className="mt-4 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
            <span>Review flagged problems</span>
            <ArrowRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* Two Column Section: Mastery by Difficulty & Topic vs Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Topics & Difficulties (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Difficulty Meters */}
          <div className="bg-white dark:bg-[#0c121e] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Difficulty Distribution
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {stats.difficultyStats.map((diff) => {
                const colors = {
                  Easy: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
                  Medium: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
                  Hard: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
                }[diff.difficulty];

                return (
                  <div
                    key={diff.difficulty}
                    className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {diff.difficulty}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${colors}`}>
                        {diff.solved}/{diff.total}
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full"
                        style={{ width: `${(diff.solved / (diff.total || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Topic Progress Bars */}
          <div className="bg-white dark:bg-[#0c121e] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Core Java Topic Breakdown
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {stats.topicStats.length} Topics
              </span>
            </div>

            <div className="space-y-3">
              {stats.topicStats.map((topic) => {
                const percent = Math.round((topic.solved / (topic.total || 1)) * 100);
                return (
                  <div key={topic.topic} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {topic.topic}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {topic.solved} / {topic.total} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          percent === 100
                            ? 'bg-emerald-500'
                            : percent > 0
                            ? 'bg-indigo-500'
                            : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        style={{ width: `${Math.max(percent, 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Recent Activity (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0c121e] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Live Submission Activity
            </h3>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>

          {!hasActivity ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl my-auto">
              <Terminal className="w-8 h-8 text-slate-400 mb-2" />
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                No submissions recorded yet
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[220px]">
                Run and submit Java programs in the workspace to track execution metrics.
              </p>
              <button
                onClick={() => onSelectQuestion('java-001')}
                className="mt-3 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Start Question 1
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800/60">
              {stats.recentActivity.slice(0, 7).map((act) => {
                const isAccepted = act.status === 'Accepted';
                return (
                  <div
                    key={act.id}
                    onClick={() => onSelectQuestion(act.questionId)}
                    className="pt-2.5 first:pt-0 cursor-pointer group flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {act.title || act.questionId}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {act.submittedAt} · {act.executionTimeMs}ms
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isAccepted
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {act.status}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                        {act.passedCount}/{act.totalCount} tests
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
