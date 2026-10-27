import React, { useState } from 'react';
import { Database, Table, Copy, Check, Code2, Layers, Info } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

interface TableData {
  headers: string[];
  alignments: ('left' | 'center' | 'right')[];
  rows: string[][];
  rawMarkdown: string;
}

export function renderInlineMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  // Split by inline code, bold, italics
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      const codeVal = part.slice(1, -1);
      const isSqlType = /^(?:INT|VARCHAR|DECIMAL|DATE|DATETIME|BOOLEAN|TEXT|BIGINT|FLOAT|PRIMARY KEY|FOREIGN KEY|NOT NULL|AUTO_INCREMENT)/i.test(codeVal.trim());
      
      return (
        <code
          key={index}
          className={`px-1.5 py-0.5 mx-0.5 rounded font-mono text-[11px] font-semibold border select-text ${
            isSqlType
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25'
              : 'bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-slate-700/60'
          }`}
        >
          {codeVal}
        </code>
      );
    }

    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className="font-bold text-slate-900 dark:text-white select-text">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={index} className="italic text-slate-800 dark:text-slate-200 select-text">
          {part.slice(1, -1)}
        </em>
      );
    }

    return (
      <span key={index} className="select-text">
        {part}
      </span>
    );
  });
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const [copiedTableIdx, setCopiedTableIdx] = useState<number | null>(null);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  if (!content) return null;

  // Pre-process: strip duplicate input/output format headers if accidentally attached
  const cleanContent = content.split(/###\s*Input(?:\s*Format)?/i)[0].trim();
  const rawLines = cleanContent.split('\n');

  // Parse lines into structured blocks
  type Block =
    | { type: 'heading'; level: number; text: string }
    | { type: 'hr' }
    | { type: 'table'; data: TableData; id: number }
    | { type: 'code'; language: string; code: string; id: number }
    | { type: 'ordered-list'; items: string[] }
    | { type: 'unordered-list'; items: string[] }
    | { type: 'paragraph'; lines: string[] };

  const blocks: Block[] = [];
  let i = 0;
  let tableCounter = 0;
  let codeCounter = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // 1. Skip completely empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // 2. Fenced Code Blocks (```sql ... ```)
    if (trimmed.startsWith('```')) {
      const language = trimmed.replace(/^```/, '').trim() || 'sql';
      const codeLines: string[] = [];
      i++;
      while (i < rawLines.length && !rawLines[i].trim().startsWith('```')) {
        codeLines.push(rawLines[i]);
        i++;
      }
      if (i < rawLines.length && rawLines[i].trim().startsWith('```')) {
        i++; // skip closing ```
      }
      blocks.push({
        type: 'code',
        language,
        code: codeLines.join('\n'),
        id: codeCounter++
      });
      continue;
    }

    // 3. Horizontal Rule
    if (/^(?:---|\*\*\*|___)\s*$/.test(trimmed)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // 4. Headings (#, ##, ###, ####)
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2]
      });
      i++;
      continue;
    }

    // 5. Markdown Tables (| Col 1 | Col 2 |)
    // Check if current line looks like table header and next line is separator
    if (
      trimmed.startsWith('|') &&
      trimmed.endsWith('|') &&
      i + 1 < rawLines.length &&
      rawLines[i + 1].trim().startsWith('|') &&
      /^[|\s:-]+$/.test(rawLines[i + 1].trim())
    ) {
      const headerLine = trimmed;
      const separatorLine = rawLines[i + 1].trim();

      const parseCells = (row: string) => {
        // Strip leading & trailing pipe, then split by pipe
        const inner = row.replace(/^\|/, '').replace(/\|$/, '');
        return inner.split('|').map((c) => c.trim());
      };

      const headers = parseCells(headerLine);
      const sepCells = parseCells(separatorLine);
      const alignments = sepCells.map((s) => {
        const leftColon = s.startsWith(':');
        const rightColon = s.endsWith(':');
        if (leftColon && rightColon) return 'center';
        if (rightColon) return 'right';
        return 'left';
      });

      const tableRows: string[][] = [];
      const rawTableLines: string[] = [headerLine, separatorLine];
      i += 2;

      while (i < rawLines.length && rawLines[i].trim().startsWith('|') && rawLines[i].trim().endsWith('|')) {
        const rowLine = rawLines[i].trim();
        rawTableLines.push(rowLine);
        tableRows.push(parseCells(rowLine));
        i++;
      }

      blocks.push({
        type: 'table',
        data: {
          headers,
          alignments,
          rows: tableRows,
          rawMarkdown: rawTableLines.join('\n')
        },
        id: tableCounter++
      });
      continue;
    }

    // 6. Ordered list (1. item)
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < rawLines.length) {
        const currentTrim = rawLines[i].trim();
        if (/^\d+\.\s+/.test(currentTrim)) {
          items.push(currentTrim.replace(/^\d+\.\s+/, ''));
          i++;
        } else if (currentTrim.startsWith('- ') || currentTrim.startsWith('* ') || currentTrim.startsWith('• ')) {
          // Sub-item attached to ordered list
          items.push(currentTrim);
          i++;
        } else if (currentTrim && !currentTrim.startsWith('#') && !currentTrim.startsWith('|') && !currentTrim.startsWith('---')) {
          // Continuation line of previous list item
          if (items.length > 0) {
            items[items.length - 1] += ' ' + currentTrim;
          } else {
            items.push(currentTrim);
          }
          i++;
        } else {
          break;
        }
      }
      blocks.push({ type: 'ordered-list', items });
      continue;
    }

    // 7. Unordered list (- item, * item, • item)
    if (/^[-*•]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < rawLines.length) {
        const currentTrim = rawLines[i].trim();
        if (/^[-*•]\s+/.test(currentTrim)) {
          items.push(currentTrim.replace(/^[-*•]\s+/, ''));
          i++;
        } else if (currentTrim && !currentTrim.startsWith('#') && !currentTrim.startsWith('|') && !currentTrim.startsWith('---') && !/^\d+\.\s+/.test(currentTrim)) {
          // Continuation line
          if (items.length > 0) {
            items[items.length - 1] += ' ' + currentTrim;
          } else {
            items.push(currentTrim);
          }
          i++;
        } else {
          break;
        }
      }
      blocks.push({ type: 'unordered-list', items });
      continue;
    }

    // 8. Regular paragraph
    const pLines: string[] = [];
    while (
      i < rawLines.length &&
      rawLines[i].trim() &&
      !rawLines[i].trim().startsWith('#') &&
      !rawLines[i].trim().startsWith('```') &&
      !rawLines[i].trim().startsWith('|') &&
      !/^(?:---|\*\*\*|___)\s*$/.test(rawLines[i].trim()) &&
      !/^\d+\.\s+/.test(rawLines[i].trim()) &&
      !/^[-*•]\s+/.test(rawLines[i].trim())
    ) {
      pLines.push(rawLines[i].trim());
      i++;
    }

    if (pLines.length > 0) {
      blocks.push({ type: 'paragraph', lines: pLines });
    }
  }

  const handleCopyTable = async (rawMarkdown: string, id: number) => {
    const success = await copyToClipboard(rawMarkdown);
    if (success) {
      setCopiedTableIdx(id);
      setTimeout(() => setCopiedTableIdx(null), 2000);
    }
  };

  const handleCopyCode = async (code: string, id: number) => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopiedCodeIdx(id);
      setTimeout(() => setCopiedCodeIdx(null), 2000);
    }
  };

  return (
    <div className={`space-y-4 text-slate-800 dark:text-slate-200 select-text cursor-text leading-relaxed ${className}`}>
      {blocks.map((block, bIdx) => {
        // Headings
        if (block.type === 'heading') {
          const isSchema = /schema|table/i.test(block.text);
          const isRequirements = /requirements|rules|specification/i.test(block.text);

          if (block.level === 1) {
            return (
              <h1
                key={bIdx}
                className="text-lg font-extrabold text-slate-900 dark:text-white pt-2 pb-1 border-b border-slate-200 dark:border-slate-800 select-text"
              >
                {renderInlineMarkdown(block.text)}
              </h1>
            );
          }

          if (block.level === 2) {
            return (
              <h2
                key={bIdx}
                className="text-base font-bold text-slate-900 dark:text-white pt-2.5 pb-1 select-text flex items-center gap-2"
              >
                {renderInlineMarkdown(block.text)}
              </h2>
            );
          }

          if (block.level === 3) {
            return (
              <div
                key={bIdx}
                className="pt-3 pb-1 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center gap-2 select-text"
              >
                {isSchema ? (
                  <Database className="w-4 h-4 text-amber-500 shrink-0" />
                ) : isRequirements ? (
                  <Layers className="w-4 h-4 text-indigo-500 shrink-0" />
                ) : (
                  <Info className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-[#FFA116]">
                  {renderInlineMarkdown(block.text)}
                </h3>
              </div>
            );
          }

          // Level 4 and deeper (e.g. "Table 1: accounts")
          return (
            <h4
              key={bIdx}
              className="text-xs font-bold text-slate-800 dark:text-slate-200 pt-2 pb-0.5 flex items-center gap-1.5 select-text font-mono"
            >
              <Table className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>{renderInlineMarkdown(block.text)}</span>
            </h4>
          );
        }

        // Horizontal Rule
        if (block.type === 'hr') {
          return <hr key={bIdx} className="my-3 border-t border-slate-200/90 dark:border-slate-800/90" />;
        }

        // Markdown Table
        if (block.type === 'table') {
          const { headers, alignments, rows, rawMarkdown } = block.data;
          const isCopied = copiedTableIdx === block.id;

          return (
            <div
              key={bIdx}
              className="my-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] shadow-xs"
            >
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100/70 dark:bg-[#141b27] border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  <Table className="w-3 h-3 text-amber-500" />
                  <span>Table Schema ({rows.length} attributes)</span>
                </div>
                <button
                  onClick={() => handleCopyTable(rawMarkdown, block.id)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-white dark:bg-[#1f2937] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  title="Copy Table as Markdown"
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
                  <span>{isCopied ? 'Copied' : 'Copy Table'}</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#0f1622] border-b border-slate-200 dark:border-slate-800">
                      {headers.map((h, hIdx) => (
                        <th
                          key={hIdx}
                          style={{ textAlign: alignments[hIdx] || 'left' }}
                          className="py-2.5 px-3.5 font-bold uppercase tracking-wider text-[11px] text-slate-700 dark:text-slate-300 select-text"
                        >
                          {renderInlineMarkdown(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                    {rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="hover:bg-slate-50/80 dark:hover:bg-[#141b28]/80 transition-colors"
                      >
                        {row.map((cell, cIdx) => {
                          const isColumnName = cIdx === 0;
                          const isType = cIdx === 1;

                          return (
                            <td
                              key={cIdx}
                              style={{ textAlign: alignments[cIdx] || 'left' }}
                              className={`py-2 px-3.5 text-slate-700 dark:text-slate-300 select-text ${
                                isColumnName ? 'font-mono text-xs font-semibold' : ''
                              }`}
                            >
                              {isColumnName && !cell.startsWith('`') ? (
                                <code className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-[11px] border border-indigo-200/50 dark:border-slate-700/60 font-bold">
                                  {cell}
                                </code>
                              ) : isType && !cell.startsWith('`') ? (
                                <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                                  {cell}
                                </span>
                              ) : (
                                renderInlineMarkdown(cell)
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

        // Fenced Code Block
        if (block.type === 'code') {
          const isCopied = copiedCodeIdx === block.id;

          return (
            <div
              key={bIdx}
              className="my-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-xs"
            >
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px]">
                <div className="flex items-center gap-1.5 font-mono uppercase">
                  <Code2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>{block.language}</span>
                </div>
                <button
                  onClick={() => handleCopyCode(block.code, block.id)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                  title="Copy Code"
                >
                  {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3.5 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed select-text">
                <code>{block.code}</code>
              </pre>
            </div>
          );
        }

        // Ordered List
        if (block.type === 'ordered-list') {
          return (
            <div key={bIdx} className="space-y-2.5 my-2">
              {block.items.map((item, itIdx) => {
                const isSubItem = item.startsWith('- ') || item.startsWith('* ') || item.startsWith('• ');
                const cleanItem = isSubItem ? item.replace(/^[-*•]\s+/, '') : item;

                if (isSubItem) {
                  return (
                    <div key={itIdx} className="flex items-start gap-2 pl-7 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <div className="select-text">{renderInlineMarkdown(cleanItem)}</div>
                    </div>
                  );
                }

                return (
                  <div key={itIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {itIdx + 1}
                    </span>
                    <div className="flex-1 select-text pt-0.5">{renderInlineMarkdown(item)}</div>
                  </div>
                );
              })}
            </div>
          );
        }

        // Unordered List
        if (block.type === 'unordered-list') {
          return (
            <div key={bIdx} className="space-y-1.5 my-2 pl-1">
              {block.items.map((item, itIdx) => (
                <div key={itIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                  <div className="flex-1 select-text">{renderInlineMarkdown(item)}</div>
                </div>
              ))}
            </div>
          );
        }

        // Paragraph
        return (
          <p key={bIdx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 select-text leading-relaxed">
            {block.lines.map((l, lIdx) => (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                {renderInlineMarkdown(l)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
};

export default MarkdownRenderer;
