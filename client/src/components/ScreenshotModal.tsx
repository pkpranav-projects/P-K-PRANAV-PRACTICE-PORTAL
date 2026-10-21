import React, { useState, useEffect, useMemo } from 'react';
import { X, ExternalLink, Image, ChevronLeft, ChevronRight } from 'lucide-react';

interface ScreenshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  screenshotName: string;
  questionTitle: string;
}

export function parseScreenshotList(raw: string): string[] {
  if (!raw || typeof raw !== 'string') return [];
  const trimmed = raw.trim();
  if (!trimmed || trimmed === 'Screenshot') return [];

  const files: string[] = [];

  // Match ranges like: "Screenshot (159).png - Screenshot (162).png"
  const rangeRegex = /Screenshot\s*\((\d+)\)\.png\s*-\s*Screenshot\s*\((\d+)\)\.png/gi;
  let match: RegExpExecArray | null;
  while ((match = rangeRegex.exec(trimmed)) !== null) {
    const start = parseInt(match[1], 10);
    const end = parseInt(match[2], 10);
    const min = Math.min(start, end);
    const max = Math.max(start, end);
    for (let n = min; n <= max; n++) {
      files.push(`Screenshot (${n}).png`);
    }
  }

  // Also check for trailing comma numbers like ", (228).png"
  const extraRegex = /,\s*\((\d+)\)\.png/gi;
  while ((match = extraRegex.exec(trimmed)) !== null) {
    files.push(`Screenshot (${match[1]}).png`);
  }

  if (files.length > 0) {
    return Array.from(new Set(files));
  }

  // If no range, look for individual "Screenshot (xyz).png"
  const singleRegex = /Screenshot\s*\(\d+\)\.png/gi;
  const singleMatches = trimmed.match(singleRegex);
  if (singleMatches && singleMatches.length > 0) {
    return Array.from(new Set(singleMatches));
  }

  if (trimmed.toLowerCase().endsWith('.png')) {
    return [trimmed];
  }

  return [];
}

export const ScreenshotModal: React.FC<ScreenshotModalProps> = ({
  isOpen,
  onClose,
  screenshotName,
  questionTitle
}) => {
  const images = useMemo(() => parseScreenshotList(screenshotName), [screenshotName]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when opened or when screenshot changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen, screenshotName]);

  // Keyboard navigation (Escape to close, Left/Right arrows for slides)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => Math.min(images.length - 1, prev + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex] || screenshotName;
  const imageUrl = `/api/screenshots/${encodeURIComponent(currentImage)}`;
  const hasMultiple = images.length > 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fadeIn [isolation:isolate]"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-[#1a1a1a] rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-[#202020]">
          <div className="flex items-center gap-2.5 min-w-0">
            <Image className="w-5 h-5 text-indigo-500 flex-shrink-0" />
            <div className="truncate">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                Original Exam Screenshot
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 truncate">
                {currentImage} — {questionTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasMultiple && (
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-neutral-700 text-slate-700 dark:text-neutral-200 font-semibold">
                {currentIndex + 1} / {images.length}
              </span>
            )}

            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-neutral-800 transition-colors"
              title="Open full image in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Display Area with Left/Right Overlays */}
        <div className="relative flex-1 overflow-auto p-4 bg-slate-950 flex items-center justify-center min-h-[360px] select-none">
          {hasMultiple && currentIndex > 0 && (
            <button
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center shadow-lg border border-white/20 transition-all cursor-pointer"
              title="Previous Page (Left Arrow)"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <img
            key={imageUrl}
            src={imageUrl}
            alt={`Screenshot of ${questionTitle}`}
            className="max-w-full max-h-[72vh] object-contain rounded-lg shadow-md transition-opacity duration-200"
            onError={(e) => {
              (e.target as HTMLImageElement).alt = 'Screenshot image could not be loaded';
            }}
          />

          {hasMultiple && currentIndex < images.length - 1 && (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center shadow-lg border border-white/20 transition-all cursor-pointer"
              title="Next Page (Right Arrow)"
              aria-label="Next Page"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Footer with Page Selector / Navigation Pills */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-[#202020] border-t border-slate-200 dark:border-neutral-800 text-xs text-slate-500 dark:text-neutral-400 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {hasMultiple ? (
              images.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => setCurrentIndex(idx)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                    idx === currentIndex
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 hover:bg-slate-300 dark:hover:bg-neutral-700'
                  }`}
                >
                  Page {idx + 1}
                </button>
              ))
            ) : (
              <span>Source: Authentic Lab Exam Screenshot</span>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-200 dark:bg-neutral-800 text-slate-700 dark:text-neutral-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-neutral-700 cursor-pointer flex-shrink-0"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
