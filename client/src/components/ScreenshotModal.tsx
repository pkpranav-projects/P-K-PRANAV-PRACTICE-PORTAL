import React from 'react';
import { X, ExternalLink, Image } from 'lucide-react';

interface ScreenshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  screenshotName: string;
  questionTitle: string;
}

export const ScreenshotModal: React.FC<ScreenshotModalProps> = ({
  isOpen,
  onClose,
  screenshotName,
  questionTitle
}) => {
  if (!isOpen) return null;

  const imageUrl = `/api/screenshots/${encodeURIComponent(screenshotName)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Original Exam Screenshot
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {screenshotName} — {questionTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Open full image in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Display */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 flex items-center justify-center min-h-[300px]">
          <img
            src={imageUrl}
            alt={`Screenshot of ${questionTitle}`}
            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-md"
            onError={(e) => {
              (e.target as HTMLImageElement).alt = 'Screenshot image could not be loaded';
            }}
          />
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Source: Local Exam Portal Screenshot</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
