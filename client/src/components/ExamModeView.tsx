import React, { useState, useEffect } from 'react';
import {
  Timer,
  AlertTriangle,
  Play,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  Code2,
  Clock,
  RotateCcw
} from 'lucide-react';
import { QuestionSummary } from '../types';

interface ExamModeViewProps {
  questions: QuestionSummary[];
  onOpenWorkspaceQuestion: (questionId: string) => void;
}

export const ExamModeView: React.FC<ExamModeViewProps> = ({
  questions,
  onOpenWorkspaceQuestion
}) => {
  const [examActive, setExamActive] = useState(false);
  const [examDurationMinutes, setExamDurationMinutes] = useState<number>(45);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(45 * 60);
  const [selectedExamQuestions, setSelectedExamQuestions] = useState<QuestionSummary[]>([]);
  const [examFinished, setExamFinished] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (!examActive || examFinished) return;

    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [examActive, examFinished]);

  const handleStartExam = () => {
    // Pick 3 balanced questions (1 Easy, 1 Medium, 1 Hard or 3 Medium/Hard)
    const easy = questions.filter((q) => q.difficulty === 'Easy');
    const medium = questions.filter((q) => q.difficulty === 'Medium');
    const hard = questions.filter((q) => q.difficulty === 'Hard');

    const chosen: QuestionSummary[] = [];
    if (easy.length > 0) chosen.push(easy[Math.floor(Math.random() * easy.length)]);
    if (medium.length > 0) chosen.push(medium[Math.floor(Math.random() * medium.length)]);
    if (hard.length > 0) chosen.push(hard[Math.floor(Math.random() * hard.length)]);

    // Fallback if any category empty
    while (chosen.length < 3 && questions.length > chosen.length) {
      const q = questions[Math.floor(Math.random() * questions.length)];
      if (!chosen.find((c) => c.id === q.id)) chosen.push(q);
    }

    setSelectedExamQuestions(chosen);
    setTimeLeftSeconds(examDurationMinutes * 60);
    setExamActive(true);
    setExamFinished(false);
  };

  const handleFinishExam = () => {
    setExamActive(false);
    setExamFinished(true);
    setShowSubmitConfirm(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isTimeCritical = timeLeftSeconds < 300; // < 5 mins

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-900/60 via-slate-900 to-slate-900 rounded-2xl p-6 border border-amber-800/40 shadow-lg text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white m-0">
              Neo Lab Exam Simulator
            </h1>
            <p className="text-xs text-amber-200/80 mt-0.5">
              Simulate actual university lab exams: timed execution, no hints, strict test evaluation.
            </p>
          </div>
        </div>
      </div>

      {!examActive && !examFinished && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Configure Your Practice Exam
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              You will be assigned 3 curated Java problems (Easy, Medium, Hard). Work through them in the workspace and submit all solutions before the timer expires.
            </p>
          </div>

          {/* Duration Selector */}
          <div className="flex items-center justify-center gap-3">
            {[30, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => setExamDurationMinutes(mins)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  examDurationMinutes === mins
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {mins} Minutes
              </button>
            ))}
          </div>

          {/* Exam Rules Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-left max-w-lg mx-auto space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
              Examination Guidelines:
            </span>
            <ul className="list-disc list-inside space-y-1">
              <li>Open each question into the live Java workspace to code and submit.</li>
              <li>Reference solutions and hints are disabled to simulate true test conditions.</li>
              <li>Every submission is compiled with <span className="font-mono text-amber-500">javac 27</span> and tested against hidden test cases.</li>
              <li>Timer runs continuously until you finish or time runs out.</li>
            </ul>
          </div>

          <button
            onClick={handleStartExam}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Practice Exam ({examDurationMinutes}m)</span>
          </button>
        </div>
      )}

      {/* Active Exam Interface */}
      {examActive && (
        <div className="space-y-6">
          {/* Timer Sticky Bar */}
          <div className={`p-4 rounded-xl border flex items-center justify-between shadow-md transition-colors ${
            isTimeCritical
              ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 animate-pulse'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
          }`}>
            <div className="flex items-center gap-3">
              <Clock className={`w-5 h-5 ${isTimeCritical ? 'text-rose-500' : 'text-amber-500'}`} />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Time Remaining
                </span>
                <span className="text-2xl font-mono font-extrabold tracking-tight">
                  {formatTime(timeLeftSeconds)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors"
            >
              Finish & Submit Exam
            </button>
          </div>

          {/* Exam Questions Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Exam Questions ({selectedExamQuestions.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedExamQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        Problem {idx + 1}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {q.difficulty}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                      {q.title}
                    </h4>

                    <span className="text-xs text-slate-500 block">
                      {q.topic}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      {q.solved ? (
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Solved</span>
                        </span>
                      ) : (
                        <span className="text-xs text-amber-500 font-semibold">
                          Incomplete
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onOpenWorkspaceQuestion(q.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 inline-flex items-center gap-1 shadow-sm"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Code Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Finished Exam Results Score Card */}
      {examFinished && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Practice Exam Finished!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Here is your performance summary for this exam attempt.
            </p>
          </div>

          {/* Results Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Problems Solved</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {selectedExamQuestions.filter((q) => q.solved).length} / {selectedExamQuestions.length}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Time Taken</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {Math.round((examDurationMinutes * 60 - timeLeftSeconds) / 60)} min
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
              <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                {Math.round((selectedExamQuestions.filter((q) => q.solved).length / (selectedExamQuestions.length || 1)) * 100)}%
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setExamFinished(false);
                setExamActive(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Return to Setup
            </button>

            <button
              onClick={handleStartExam}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
            >
              Take Another Exam
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Submit & End Exam?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to end your exam session now? Your current score will be calculated based on your submissions.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Keep Coding
              </button>
              <button
                onClick={handleFinishExam}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
              >
                End Exam Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
