import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon, ChevronDown } from 'lucide-react';
import { soundManager } from '../services/sound';

export const PracticeTimer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [mode, setMode] = useState<'stopwatch' | '15m' | '25m' | '45m'>('stopwatch');
  const timerRef = useRef<any>(null);

  // Initialize seconds on mode change
  const setModeAndReset = (newMode: 'stopwatch' | '15m' | '25m' | '45m') => {
    setMode(newMode);
    setIsRunning(false);
    clearInterval(timerRef.current);
    if (newMode === 'stopwatch') setSeconds(0);
    else if (newMode === '15m') setSeconds(15 * 60);
    else if (newMode === '25m') setSeconds(25 * 60);
    else if (newMode === '45m') setSeconds(45 * 60);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (mode === 'stopwatch') {
            return prev + 1;
          } else {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              setIsRunning(false);
              soundManager.playError();
              return 0;
            }
            return prev - 1;
          }
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, mode]);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    if (mode === 'stopwatch') setSeconds(0);
    else if (mode === '15m') setSeconds(15 * 60);
    else if (mode === '25m') setSeconds(25 * 60);
    else if (mode === '45m') setSeconds(45 * 60);
  };

  return (
    <div className="relative flex items-center">
      {/* Pill Trigger */}
      <div className="flex items-center rounded-lg bg-[#242424] border border-[#383838] px-2 py-1 text-xs font-mono text-neutral-300 gap-1.5 shadow-sm">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`p-0.5 rounded transition-colors ${
            isRunning ? 'text-amber-400 hover:text-amber-300' : 'text-neutral-400 hover:text-white'
          }`}
          title={isRunning ? 'Pause Timer' : 'Start Timer'}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <span
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer font-bold tracking-wider hover:text-white transition-colors"
          title="Click to change timer mode"
        >
          {formatTime(seconds)}
        </span>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-0.5 text-neutral-500 hover:text-neutral-300 transition-colors"
          title="Timer Options"
        >
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[38px] right-0 w-44 bg-[#222222] border border-[#383838] rounded-xl shadow-2xl py-1.5 z-50 text-xs">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono border-b border-[#333333]">
            Timer Presets
          </div>

          <button
            onClick={() => {
              setModeAndReset('stopwatch');
              setIsOpen(false);
            }}
            className={`w-full text-left px-3 py-1.5 hover:bg-[#2c2c2c] transition-colors flex items-center justify-between ${
              mode === 'stopwatch' ? 'text-[#FFA116] font-semibold' : 'text-neutral-300'
            }`}
          >
            <span>Stopwatch (Count Up)</span>
            {mode === 'stopwatch' && <span>✓</span>}
          </button>

          <button
            onClick={() => {
              setModeAndReset('15m');
              setIsOpen(false);
            }}
            className={`w-full text-left px-3 py-1.5 hover:bg-[#2c2c2c] transition-colors flex items-center justify-between ${
              mode === '15m' ? 'text-[#FFA116] font-semibold' : 'text-neutral-300'
            }`}
          >
            <span>15m Quick Drill</span>
            {mode === '15m' && <span>✓</span>}
          </button>

          <button
            onClick={() => {
              setModeAndReset('25m');
              setIsOpen(false);
            }}
            className={`w-full text-left px-3 py-1.5 hover:bg-[#2c2c2c] transition-colors flex items-center justify-between ${
              mode === '25m' ? 'text-[#FFA116] font-semibold' : 'text-neutral-300'
            }`}
          >
            <span>25m Pomodoro</span>
            {mode === '25m' && <span>✓</span>}
          </button>

          <button
            onClick={() => {
              setModeAndReset('45m');
              setIsOpen(false);
            }}
            className={`w-full text-left px-3 py-1.5 hover:bg-[#2c2c2c] transition-colors flex items-center justify-between ${
              mode === '45m' ? 'text-[#FFA116] font-semibold' : 'text-neutral-300'
            }`}
          >
            <span>45m Real Interview</span>
            {mode === '45m' && <span>✓</span>}
          </button>

          <div className="border-t border-[#333333] mt-1 pt-1 px-1">
            <button
              onClick={() => {
                handleReset();
                setIsOpen(false);
              }}
              className="w-full text-left px-2 py-1 text-rose-400 hover:bg-[#2c2c2c] rounded transition-colors flex items-center gap-1.5 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Timer</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
