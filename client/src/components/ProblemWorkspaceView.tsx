import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import {
  Play,
  Send,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Sparkles,
  Image,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCode,
  Eye,
  Check,
  Columns,
  Download,
  Upload,
  Wand2,
  FileText,
  ArrowLeft,
  Copy
} from 'lucide-react';
import {
  QuestionDetail,
  QuestionSolution,
  RunResult,
  SubmissionRecord,
  SubmitResult,
  SupportedLanguage
} from '../types';
import { api } from '../services/api';
import { soundManager } from '../services/sound';
import { ScreenshotModal } from './ScreenshotModal';
import { SolutionModal } from './SolutionModal';
import { MarkdownRenderer } from './MarkdownRenderer';
import { copyToClipboard } from '../utils/clipboard';

interface BoilerplateTemplate {
  name: string;
  description: string;
  code: string;
}

// Pre-configured Multi-Language Boilerplate Templates
const TEMPLATES_BY_LANGUAGE: Record<SupportedLanguage, BoilerplateTemplate[]> = {
  java: [
    {
      name: 'Scanner (Standard I/O)',
      description: 'Basic Scanner template for standard input and output',
      code: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your solution here\n        \n        scanner.close();\n    }\n}\n`
    },
    {
      name: 'Fast I/O (BufferedReader)',
      description: 'High-performance input reading for large inputs',
      code: `import java.io.BufferedReader;\nimport java.io.InputStreamReader;\nimport java.io.IOException;\nimport java.util.StringTokenizer;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        StringTokenizer st = null;\n        \n        String line;\n        while ((line = br.readLine()) != null) {\n            st = new StringTokenizer(line);\n            // Process tokens here\n        }\n    }\n}\n`
    },
    {
      name: 'OOP & Modular Solution',
      description: 'Separation of concerns with a Solution class',
      code: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        Solution solution = new Solution();\n        \n        // Read input and invoke solution\n        \n        scanner.close();\n    }\n}\n\nclass Solution {\n    // Add modular methods here\n}\n`
    },
    {
      name: 'Array & Math Utilities',
      description: 'Pre-imported Arrays, Math, Collections for contest solving',
      code: `import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        \n        // Write your logic here\n        \n        sc.close();\n    }\n}\n`
    }
  ],
  python: [
    {
      name: 'Standard sys.stdin.read',
      description: 'Fast whole-stream input parsing for competitive coding',
      code: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution here\n\nif __name__ == '__main__':\n    main()\n`
    },
    {
      name: 'Line-by-Line (sys.stdin)',
      description: 'Iterates through standard input line by line',
      code: `import sys\n\ndef main():\n    for line in sys.stdin:\n        line = line.strip()\n        if not line:\n            continue\n        # Process line\n\nif __name__ == '__main__':\n    main()\n`
    },
    {
      name: 'Modular Solution Class',
      description: 'Object-oriented Solution class pattern',
      code: `import sys\n\nclass Solution:\n    def solve(self, data):\n        # Implement logic\n        pass\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    sol = Solution()\n    sol.solve(input_data)\n\nif __name__ == '__main__':\n    main()\n`
    },
    {
      name: 'Math & Data Structures',
      description: 'Pre-imported math, collections, heapq, itertools',
      code: `import sys\nimport math\nfrom collections import defaultdict, deque, Counter\nimport heapq\nimport itertools\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    # Logic here\n\nif __name__ == '__main__':\n    main()\n`
    }
  ],
  cpp: [
    {
      name: 'Fast I/O & Standard STL',
      description: 'Optimized cin/cout with vector, string, algorithm',
      code: `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    // Write your solution here\n    \n    return 0;\n}\n`
    },
    {
      name: 'Multi-Testcase Runner',
      description: 'Reads number of test cases t and loops',
      code: `#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nvoid solve() {\n    // Solve single testcase\n}\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    int t = 1;\n    if (cin >> t) {\n        while (t--) {\n            solve();\n        }\n    }\n    return 0;\n}\n`
    },
    {
      name: 'Competitive STL Collection',
      description: 'Header with map, set, queue, cmath and vector',
      code: `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <cmath>\n#include <map>\n#include <set>\n#include <queue>\n\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    // Write solution\n    \n    return 0;\n}\n`
    }
  ],
  sql: [
    {
      name: 'MySQL Trigger (BEFORE/AFTER)',
      description: 'Trigger template with delimiter and NEW/OLD qualifiers',
      code: `DELIMITER //\nCREATE TRIGGER check_condition\nBEFORE INSERT ON table_name\nFOR EACH ROW\nBEGIN\n    -- Your trigger logic here\nEND //\nDELIMITER ;\n`
    },
    {
      name: 'MySQL Stored Procedure',
      description: 'Stored Procedure with IN/OUT parameters',
      code: `DELIMITER //\nCREATE PROCEDURE ProcessData(IN p_id INT, OUT p_result INT)\nBEGIN\n    -- Your procedure logic here\nEND //\nDELIMITER ;\n`
    },
    {
      name: 'Standard SQL Query (SELECT/JOIN)',
      description: 'Standard SQL select query with filtering and aggregation',
      code: `SELECT \n    column1, \n    COUNT(*) AS total\nFROM table_name\nWHERE condition\nGROUP BY column1\nORDER BY total DESC;\n`
    }
  ]
};

const DEFAULT_CODE: Record<SupportedLanguage, string> = {
  java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your solution here\n        \n        scanner.close();\n    }\n}\n`,
  python: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    \n    # Write your solution here\n\nif __name__ == '__main__':\n    main()\n`,
  cpp: `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    // Write your solution here\n    \n    return 0;\n}\n`,
  sql: `-- Write your SQL / MySQL Trigger or Stored Procedure here\n-- Ready for instant execution\n`
};

// Clean terminal ANSI escape sequences from execution diagnostics
function stripAnsi(text: string | undefined | null): string {
  if (!text) return '';
  // eslint-disable-next-line no-control-regex
  return text.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, '');
}

// Offline lightweight Code Beautifier & Indentation Formatter
function formatSourceCode(source: string, lang: SupportedLanguage): string {
  if (lang === 'python' || lang === 'sql') {
    return source.split(/\r?\n/).map(l => l.trimEnd()).join('\n');
  }

  const lines = source.split(/\r?\n/);
  let indentLevel = 0;
  const formatted: string[] = [];

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      formatted.push('');
      continue;
    }

    // Check if line starts with closing braces
    let leadingCloses = 0;
    for (const char of trimmed) {
      if (char === '}') leadingCloses++;
      else if (char !== ' ' && char !== '\t') break;
    }

    const currentIndent = Math.max(0, indentLevel - leadingCloses);
    formatted.push('    '.repeat(currentIndent) + trimmed);

    // Count braces outside string literals & comments
    let opens = 0;
    let closes = 0;
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < trimmed.length; i++) {
      const ch = trimmed[i];
      const prev = i > 0 ? trimmed[i - 1] : '';

      if ((ch === '"' || ch === '\'') && prev !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = ch;
        } else if (stringChar === ch) {
          inString = false;
        }
      }
      if (!inString) {
        if (ch === '/' && trimmed[i + 1] === '/') break;
        if (ch === '{') opens++;
        if (ch === '}') closes++;
      }
    }

    indentLevel = Math.max(0, indentLevel + opens - closes);
  }

  return formatted.join('\n');
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-semibold border border-slate-200/50 dark:border-slate-700/50"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className="font-semibold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function FormattedContent({ text, className = '' }: { text: string; className?: string }) {
  if (!text) return null;
  return <MarkdownRenderer content={text} className={className} />;
}

// Built-in Live Templates & Snippets (sout -> System.out.println, souf, serr, psvm, fori, etc.)
interface CodeSnippet {
  label: string;
  detail: string;
  documentation: string;
  snippet: string;
  fallbackText: string;
  cursorOffset: number;
}

const SNIPPETS: Record<string, CodeSnippet[]> = {
  java: [
    {
      label: 'sout',
      detail: 'System.out.println();',
      documentation: 'Prints argument to standard output followed by a newline.',
      snippet: 'System.out.println(${1});',
      fallbackText: 'System.out.println();',
      cursorOffset: 19
    },
    {
      label: 'souf',
      detail: 'System.out.printf("", ...);',
      documentation: 'Prints formatted string to standard output.',
      snippet: 'System.out.printf("${1:%s}\\n", ${2});',
      fallbackText: 'System.out.printf("%s\\n", );',
      cursorOffset: 23
    },
    {
      label: 'serr',
      detail: 'System.err.println();',
      documentation: 'Prints argument to standard error followed by a newline.',
      snippet: 'System.err.println(${1});',
      fallbackText: 'System.err.println();',
      cursorOffset: 19
    },
    {
      label: 'psvm',
      detail: 'public static void main(String[] args)',
      documentation: 'Standard Java main method declaration.',
      snippet: 'public static void main(String[] args) {\n    ${1}\n}',
      fallbackText: 'public static void main(String[] args) {\n    \n}',
      cursorOffset: 45
    },
    {
      label: 'main',
      detail: 'public static void main(String[] args)',
      documentation: 'Standard Java main method declaration.',
      snippet: 'public static void main(String[] args) {\n    ${1}\n}',
      fallbackText: 'public static void main(String[] args) {\n    \n}',
      cursorOffset: 45
    },
    {
      label: 'fori',
      detail: 'for (int i = 0; i < n; i++)',
      documentation: 'Standard 0-indexed for loop.',
      snippet: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n    ${3}\n}',
      fallbackText: 'for (int i = 0; i < n; i++) {\n    \n}',
      cursorOffset: 35
    },
    {
      label: 'foreach',
      detail: 'for (Type item : collection)',
      documentation: 'Enhanced for-each loop over an Iterable.',
      snippet: 'for (${1:Object} ${2:item} : ${3:collection}) {\n    ${4}\n}',
      fallbackText: 'for (Object item : collection) {\n    \n}',
      cursorOffset: 36
    },
    {
      label: 'sc',
      detail: 'Scanner scanner = new Scanner(System.in);',
      documentation: 'Initialize a standard Scanner instance from System.in.',
      snippet: 'Scanner ${1:scanner} = new Scanner(System.in);',
      fallbackText: 'Scanner scanner = new Scanner(System.in);',
      cursorOffset: 40
    },
    {
      label: 'scanner',
      detail: 'Scanner scanner = new Scanner(System.in);',
      documentation: 'Initialize a standard Scanner instance from System.in.',
      snippet: 'Scanner ${1:scanner} = new Scanner(System.in);',
      fallbackText: 'Scanner scanner = new Scanner(System.in);',
      cursorOffset: 40
    }
  ],
  python: [
    {
      label: 'sout',
      detail: 'print(...)',
      documentation: 'Prints expression to standard output.',
      snippet: 'print(${1})',
      fallbackText: 'print()',
      cursorOffset: 6
    },
    {
      label: 'print',
      detail: 'print(...)',
      documentation: 'Prints expression to standard output.',
      snippet: 'print(${1})',
      fallbackText: 'print()',
      cursorOffset: 6
    },
    {
      label: 'main',
      detail: 'if __name__ == "__main__":',
      documentation: 'Boilerplate main module check in Python.',
      snippet: "if __name__ == '__main__':\n    ${1:main()}",
      fallbackText: "if __name__ == '__main__':\n    main()",
      cursorOffset: 33
    }
  ],
  cpp: [
    {
      label: 'sout',
      detail: 'cout << ... << endl;',
      documentation: 'Prints expression to stdout with newline.',
      snippet: 'cout << ${1} << endl;',
      fallbackText: 'cout <<  << endl;',
      cursorOffset: 8
    },
    {
      label: 'cout',
      detail: 'cout << ... << endl;',
      documentation: 'Prints expression to stdout with newline.',
      snippet: 'cout << ${1} << endl;',
      fallbackText: 'cout <<  << endl;',
      cursorOffset: 8
    },
    {
      label: 'cin',
      detail: 'cin >> ...;',
      documentation: 'Reads standard input into variable.',
      snippet: 'cin >> ${1};',
      fallbackText: 'cin >> ;',
      cursorOffset: 7
    },
    {
      label: 'fori',
      detail: 'for (int i = 0; i < n; i++)',
      documentation: 'Standard 0-indexed for loop in C++.',
      snippet: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n    ${3}\n}',
      fallbackText: 'for (int i = 0; i < n; i++) {\n    \n}',
      cursorOffset: 35
    }
  ]
};

const SNIPPET_MAP: Record<string, Record<string, CodeSnippet>> = {
  java: {},
  python: {},
  cpp: {}
};

for (const lang of Object.keys(SNIPPETS)) {
  for (const item of SNIPPETS[lang]) {
    SNIPPET_MAP[lang][item.label] = item;
  }
}

let areSnippetsRegistered = false;

function registerMonacoSnippets(monaco: any) {
  if (areSnippetsRegistered || !monaco?.languages) return;
  areSnippetsRegistered = true;

  const languages = ['java', 'python', 'cpp'];
  for (const lang of languages) {
    const list = SNIPPETS[lang];
    if (!list) continue;

    try {
      monaco.languages.registerCompletionItemProvider(lang, {
        provideCompletionItems: (model: any, position: any) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          };

          const suggestions = list.map((snip, idx) => ({
            label: snip.label,
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: snip.documentation,
            detail: `${snip.detail} [Tab]`,
            insertText: snip.snippet,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
            sortText: `000${idx}`
          }));

          return { suggestions };
        }
      });
    } catch (e) {
      console.warn('Failed to register snippet provider for ' + lang, e);
    }
  }
}

interface ProblemWorkspaceViewProps {
  questionId: string;
  theme: 'dark' | 'oled' | 'light' | 'system';
  onNavigateQuestion: (newQuestionId: string) => void;
  onQuestionSolved?: () => void;
  allQuestionIds: string[];
  isAbsoluteFullscreen?: boolean;
  onToggleAbsoluteFullscreen?: () => void;
  onBack?: () => void;
  backLabel?: string;
}

export const ProblemWorkspaceView: React.FC<ProblemWorkspaceViewProps> = ({
  questionId,
  theme,
  onNavigateQuestion,
  onQuestionSolved,
  allQuestionIds,
  isAbsoluteFullscreen = false,
  onToggleAbsoluteFullscreen,
  onBack,
  backLabel = 'Questions'
}) => {
  // Data states
  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('java');
  const selectedLanguageRef = useRef<SupportedLanguage>(selectedLanguage);
  useEffect(() => {
    selectedLanguageRef.current = selectedLanguage;
  }, [selectedLanguage]);
  const [code, setCode] = useState('');
  const codeRef = useRef<string>('');
  const [customInput, setCustomInput] = useState('');
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

  // Layout & Tabs
  const [leftTab, setLeftTab] = useState<'problem' | 'examples' | 'hints'>('problem');
  const [bottomTab, setBottomTab] = useState<'run' | 'submit' | 'history'>('run');
  const [mobileWorkspaceTab, setMobileWorkspaceTab] = useState<'problem' | 'code' | 'console'>('problem');
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  const [fontSize, setFontSize] = useState<number>(14);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  // Sync isDesktop on window resize
  useEffect(() => {
    const handleWinResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleWinResize);
    return () => window.removeEventListener('resize', handleWinResize);
  }, []);

  // Split pane horizontal resizing: width percentage for left panel
  const [splitPercent, setSplitPercent] = useState<number>(() => {
    const saved = localStorage.getItem('arena_split_percent');
    return saved ? Math.min(75, Math.max(22, parseFloat(saved))) : 42;
  });
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);

  // Bottom drawer vertical resizing: height in pixels
  const [drawerHeight, setDrawerHeight] = useState<number>(() => {
    const saved = localStorage.getItem('arena_drawer_height');
    return saved ? Math.min(600, Math.max(120, parseInt(saved, 10))) : 260;
  });
  const [isDraggingDrawer, setIsDraggingDrawer] = useState(false);

  // Monaco and code features
  const [isMinimapEnabled, setIsMinimapEnabled] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workspaceContainerRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const autoSaveTimeoutRef = useRef<any>(null);
  const isSwitchingLanguageRef = useRef<boolean>(false);

  // Question & test case copy states
  const [copiedQuestion, setCopiedQuestion] = useState(false);
  const [copiedTcInput, setCopiedTcInput] = useState<number | null>(null);
  const [copiedTcOutput, setCopiedTcOutput] = useState<number | null>(null);

  const handleCopyEntireQuestion = async () => {
    if (!question) return;
    const sections: string[] = [];
    sections.push(`[${question.id}] ${question.title}`);
    sections.push(`Difficulty: ${question.difficulty} | Topic: ${question.topic || 'General'}\n`);
    sections.push(`Description:\n${question.description}\n`);
    if (question.inputFormat) {
      sections.push(`Input Format:\n${question.inputFormat}\n`);
    }
    if (question.outputFormat) {
      sections.push(`Output Format:\n${question.outputFormat}\n`);
    }
    if (question.constraints && question.constraints.length > 0) {
      sections.push(`Constraints:\n${question.constraints.map((c) => `- ${c}`).join('\n')}\n`);
    }
    if (question.testCases && question.testCases.length > 0) {
      sections.push(`Sample Test Cases:`);
      question.testCases.forEach((tc, idx) => {
        if (!tc.isHidden) {
          sections.push(`Test Case ${idx + 1}:\nInput:\n${tc.input}\nExpected Output:\n${tc.expectedOutput}\n`);
        }
      });
    }
    const fullText = sections.join('\n');
    const success = await copyToClipboard(fullText);
    if (success) {
      setCopiedQuestion(true);
      setTimeout(() => setCopiedQuestion(false), 2000);
    }
  };

  const handleCopyTestCaseInput = async (inputStr: string, idx: number) => {
    const success = await copyToClipboard(inputStr);
    if (success) {
      setCopiedTcInput(idx);
      setTimeout(() => setCopiedTcInput(null), 2000);
    }
  };

  const handleCopyTestCaseOutput = async (outputStr: string, idx: number) => {
    const success = await copyToClipboard(outputStr);
    if (success) {
      setCopiedTcOutput(idx);
      setTimeout(() => setCopiedTcOutput(null), 2000);
    }
  };

  // Memoized Monaco Editor configuration with fixed overflow widgets to prevent page jumps
  const editorOptions = useMemo<any>(() => ({
    fontSize,
    fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
    minimap: { enabled: isMinimapEnabled },
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    automaticLayout: true,
    tabSize: 4,
    lineNumbers: 'on',
    renderLineHighlight: 'all',
    fixedOverflowWidgets: true,
    tabCompletion: 'on',
    snippetSuggestions: 'top',
    suggest: {
      snippetsPreventQuickSuggestions: false
    },
    quickSuggestions: { other: true, comments: false, strings: false },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on',
    wordBasedSuggestions: 'currentDocument',
    scrollbar: {
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
      alwaysConsumeMouseWheel: false
    },
    overviewRulerBorder: false,
    cursorBlinking: 'smooth',
    smoothScrolling: true
  }), [fontSize, isMinimapEnabled]);

  // Toggle Zen Focus Mode (Code Only Fullscreen)
  const toggleZenMode = useCallback(() => {
    setIsZenMode((prev) => {
      const next = !prev;
      if (next) {
        if (!document.fullscreenElement && onToggleAbsoluteFullscreen) {
          onToggleAbsoluteFullscreen();
        }
      }
      return next;
    });
  }, [onToggleAbsoluteFullscreen]);

  // Keyboard shortcut: Alt + Z toggles Zen Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        toggleZenMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleZenMode]);

  // Recalculate Monaco layout on window resize (resolves zoom & split layout lag)
  useEffect(() => {
    const handleResize = () => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };
    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []);

  // Split pane horizontal resize handler
  const startSplitResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingSplit(true);

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!workspaceContainerRef.current) return;
      const rect = workspaceContainerRef.current.getBoundingClientRect();
      const newPercent = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(75, Math.max(22, newPercent));
      setSplitPercent(clamped);
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };

    const onMouseUp = () => {
      setIsDraggingSplit(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      setSplitPercent((curr) => {
        localStorage.setItem('arena_split_percent', curr.toFixed(1));
        return curr;
      });
      if (editorRef.current) {
        setTimeout(() => editorRef.current?.layout(), 50);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

  // Bottom drawer vertical resize handler
  const startDrawerResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingDrawer(true);
    const startY = e.clientY;
    const startH = drawerHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = startY - moveEvent.clientY; // upward drag increases height
      const newH = Math.min(600, Math.max(120, startH + delta));
      setDrawerHeight(newH);
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };

    const onMouseUp = () => {
      setIsDraggingDrawer(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      setDrawerHeight((curr) => {
        localStorage.setItem('arena_drawer_height', curr.toString());
        return curr;
      });
      if (editorRef.current) {
        setTimeout(() => editorRef.current?.layout(), 50);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [drawerHeight]);

  // Format code
  const handleFormatCode = useCallback(() => {
    const current = editorRef.current?.getValue() ?? codeRef.current;
    if (!current) return;
    const formatted = formatSourceCode(current, selectedLanguage);
    codeRef.current = formatted;
    if (editorRef.current) {
      const pos = editorRef.current.getPosition();
      editorRef.current.setValue(formatted);
      if (pos) editorRef.current.setPosition(pos);
    }
    setCode(formatted);
  }, [selectedLanguage]);

  // Apply template
  const handleApplyTemplate = (templateCode: string) => {
    codeRef.current = templateCode;
    setCode(templateCode);
    if (editorRef.current) {
      editorRef.current.setValue(templateCode);
    }
    setShowTemplateMenu(false);
  };

  // Download code with extension based on active language
  const handleDownloadCode = () => {
    const current = editorRef.current?.getValue() ?? codeRef.current;
    const filename =
      selectedLanguage === 'java' ? 'Main.java' :
      selectedLanguage === 'python' ? 'solution.py' :
      selectedLanguage === 'cpp' ? 'solution.cpp' : 'solution.sql';
    const blob = new Blob([current], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Switch programming language (Java, C++, Python, SQL) with draft auto-saving & restoring
  const handleLanguageChange = async (newLang: SupportedLanguage) => {
    if (newLang === selectedLanguage) return;

    // 1. Cancel pending auto-save timeout and set switching guard
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    isSwitchingLanguageRef.current = true;

    // 2. Save draft for current language if code exists
    const current = editorRef.current?.getValue() ?? codeRef.current;
    if (current && current.trim()) {
      try {
        await api.saveDraft(questionId, current, selectedLanguage);
      } catch (err) {
        console.warn('Auto-save on language switch failed:', err);
      }
    }

    setSelectedLanguage(newLang);
    selectedLanguageRef.current = newLang;

    // 3. Fetch or restore code for the selected new language
    let nextCode = '';
    try {
      const draft = await api.getDraft(questionId, newLang);
      if (draft.draftCode && draft.draftCode.trim()) {
        nextCode = draft.draftCode;
      }
    } catch (err) {}

    if (!nextCode) {
      if ((newLang === 'java' || newLang === 'sql') && question?.starterCode) {
        nextCode = question.starterCode;
      } else {
        nextCode = DEFAULT_CODE[newLang];
      }
    }

    codeRef.current = nextCode;
    setCode(nextCode);
    if (editorRef.current) {
      editorRef.current.setValue(nextCode);
    }

    setTimeout(() => {
      isSwitchingLanguageRef.current = false;
    }, 150);
  };

  // Upload local file to editor
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        codeRef.current = text;
        setCode(text);
        if (editorRef.current) {
          editorRef.current.setValue(text);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Execution states
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [history, setHistory] = useState<SubmissionRecord[]>([]);

  // Modals & Revelations
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [solutionData, setSolutionData] = useState<QuestionSolution | null>(null);
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Editor ref
  const editorRef = useRef<any>(null);

  // Determine Monaco editor theme
  const isDark =
    theme === 'dark' ||
    theme === 'oled' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const editorTheme = theme === 'oled' ? 'oled-black' : isDark ? 'vs-dark' : 'vs';

  // Dynamically update Monaco editor theme on theme changes
  useEffect(() => {
    try {
      const monaco = (window as any).monaco;
      if (monaco?.editor) {
        monaco.editor.setTheme(editorTheme);
      }
    } catch {}
  }, [editorTheme]);

  // Load question details
  const loadQuestion = useCallback(async () => {
    try {
      setLoading(true);
      const q = await api.getQuestion(questionId);
      setQuestion(q);
      
      const rec = (q.recommendedLanguage || 'Java').toLowerCase();
      const defaultLang: SupportedLanguage =
        rec.includes('sql') || q.bank === 'dbms' || q.id.startsWith('dbms-') ? 'sql' :
        rec.includes('c++') || rec.includes('cpp') ? 'cpp' :
        rec.includes('python') || rec.includes('py') ? 'python' : 'java';
      setSelectedLanguage(defaultLang);

      // Check if draft exists for this language
      let initialCode = '';
      try {
        const draft = await api.getDraft(questionId, defaultLang);
        if (draft.draftCode && draft.draftCode.trim()) {
          initialCode = draft.draftCode;
        }
      } catch (e) {}

      if (!initialCode) {
        if (defaultLang === 'sql' || defaultLang === 'java') {
          initialCode = q.userDraft || q.starterCode || DEFAULT_CODE[defaultLang];
        } else {
          initialCode = DEFAULT_CODE[defaultLang];
        }
      }

      codeRef.current = initialCode;
      setCode(initialCode);
      if (editorRef.current) {
        editorRef.current.setValue(initialCode);
      }
      setCustomInput(q.sampleInput || '');
      setRunResult(null);
      setSubmitResult(null);
      setRevealedHints({});

      // Fetch submission history for this question
      const subs = await api.getSubmissions(questionId, 10);
      setHistory(subs);
    } catch (err) {
      console.error('Failed to load question:', err);
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  // Debounced auto-save draft code without triggering React component re-renders
  const handleCodeChange = useCallback((newVal: string) => {
    codeRef.current = newVal;
    if (isSwitchingLanguageRef.current || !questionId) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        const textToSave = codeRef.current;
        if (!textToSave || !textToSave.trim()) return;
        setIsSavingDraft(true);
        await api.saveDraft(questionId, textToSave, selectedLanguage);
        setDraftSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (err) {
        console.error('Auto-save error:', err);
      } finally {
        setIsSavingDraft(false);
      }
    }, 1500);
  }, [questionId, selectedLanguage]);

  // Clean up auto-save on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Run code against custom or sample input
  const handleRun = useCallback(async () => {
    const currentCode = editorRef.current?.getValue() ?? codeRef.current;
    if (isRunning || isSubmitting || !currentCode) return;
    try {
      soundManager.playRun();
      setIsRunning(true);
      setBottomTab('run');
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setMobileWorkspaceTab('console');
      }
      const res = await api.runCode(currentCode, customInput, selectedLanguage, questionId);
      setRunResult(res);
      if (res.exitCode !== 0 || res.stderr) {
        soundManager.playError();
      }
    } catch (err: any) {
      soundManager.playError();
      setRunResult({
        status: 'Error',
        stdout: '',
        stderr: err.message || 'Execution failed',
        executionTimeMs: 0,
        exitCode: 1
      });
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, isSubmitting, customInput, selectedLanguage, questionId]);

  // Submit code for full test-case evaluation
  const handleSubmit = useCallback(async () => {
    const currentCode = editorRef.current?.getValue() ?? codeRef.current;
    if (isRunning || isSubmitting || !currentCode) return;
    try {
      soundManager.playRun();
      setIsSubmitting(true);
      setBottomTab('submit');
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setMobileWorkspaceTab('console');
      }
      const res = await api.submitCode(questionId, currentCode, selectedLanguage);
      setSubmitResult(res);

      if (res.status === 'Accepted') {
        soundManager.playSuccess();
        setQuestion((prev) => prev ? { ...prev, solved: true } : null);
        if (onQuestionSolved) onQuestionSolved();
      } else {
        soundManager.playError();
      }

      // Refresh history
      const subs = await api.getSubmissions(questionId, 10);
      setHistory(subs);
    } catch (err: any) {
      soundManager.playError();
      setSubmitResult({
        status: 'Internal Execution Error',
        passedCount: 0,
        totalCount: question?.testCases.length || 0,
        executionTimeMs: 0,
        errorMessage: err.message,
        testResults: []
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [isRunning, isSubmitting, questionId, selectedLanguage, question, onQuestionSolved]);

  // Keyboard shortcuts (Ctrl+Enter to Run, Ctrl+Shift+Enter to Submit, Alt+F to format, Alt+R to reset, Esc to step back)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          handleSubmit();
        } else {
          handleRun();
        }
      } else if (e.altKey && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        handleFormatCode();
      } else if (e.altKey && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        setShowResetConfirm(true);
      } else if (e.key === 'Escape' && !showSolutionModal && !showScreenshot && !showResetConfirm && !showTemplateMenu) {
        if (isZenMode) {
          e.preventDefault();
          setIsZenMode(false);
        } else if (isFullscreen) {
          e.preventDefault();
          setIsFullscreen(false);
        } else if (isAbsoluteFullscreen) {
          e.preventDefault();
          if (onToggleAbsoluteFullscreen) {
            onToggleAbsoluteFullscreen();
          }
        } else if (onBack) {
          e.preventDefault();
          onBack();
        }
      } else if (e.altKey && e.key === 'ArrowLeft') {
        if (onBack) {
          e.preventDefault();
          onBack();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRun, handleSubmit, handleFormatCode, onBack, showSolutionModal, showScreenshot, showResetConfirm, showTemplateMenu]);

  // Toggle Bookmark
  const handleToggleBookmark = async () => {
    if (!question) return;
    const res = await api.toggleBookmark(question.id);
    setQuestion({ ...question, isBookmarked: res.isBookmarked });
  };

  // Toggle Revision
  const handleToggleRevision = async () => {
    if (!question) return;
    const res = await api.toggleRevision(question.id);
    setQuestion({ ...question, isRevision: res.isRevision });
  };

  // Fetch and show solution
  const handleOpenSolution = async () => {
    try {
      if (!solutionData) {
        const sol = await api.getSolution(questionId);
        setSolutionData(sol);
      }
      setShowSolutionModal(true);
    } catch (err) {
      console.error('Failed to load solution:', err);
    }
  };

  // Reset code to starter template
  const handleResetCode = () => {
    if (!question) return;
    let nextCode = '';
    if ((selectedLanguage === 'java' || selectedLanguage === 'sql') && question.starterCode) {
      nextCode = question.starterCode;
    } else {
      nextCode = DEFAULT_CODE[selectedLanguage];
    }
    codeRef.current = nextCode;
    setCode(nextCode);
    if (editorRef.current) {
      editorRef.current.setValue(nextCode);
    }
    setShowResetConfirm(false);
  };

  // Navigation indices
  const currentIndex = allQuestionIds.indexOf(questionId);
  const prevId = currentIndex > 0 ? allQuestionIds[currentIndex - 1] : null;
  const nextId = currentIndex < allQuestionIds.length - 1 ? allQuestionIds[currentIndex + 1] : null;

  if (loading || !question) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const diffColors = {
    Easy: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    Medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    Hard: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800'
  }[question.difficulty];

  const activeFullscreen = isFullscreen || isAbsoluteFullscreen || isZenMode;

  return (
    <div className={`space-y-4 pb-12 ${activeFullscreen ? 'fixed inset-0 z-50 bg-[#1a1a1a] dark:bg-[#000000] p-4 overflow-y-auto' : ''}`}>
      
      {/* Workspace Top Bar */}
      <div className="bg-white dark:bg-[#0c121e] px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Left: Back Button, ID, Title, Badges */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 border border-slate-300/80 dark:border-slate-700 transition-all hover:scale-[1.02] cursor-pointer shadow-sm group shrink-0"
              title={`Return to ${backLabel} (or press Browser Back / Esc)`}
            >
              <ArrowLeft className="w-4 h-4 text-amber-500 group-hover:-translate-x-1 transition-transform" />
              <span>Back to {backLabel}</span>
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <button
              disabled={!prevId}
              onClick={() => prevId && onNavigateQuestion(prevId)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Previous Question"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
              {question.id}
            </span>
            <button
              disabled={!nextId}
              onClick={() => nextId && onNavigateQuestion(nextId)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Next Question"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white m-0">
            {question.title}
          </h2>

          <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${diffColors}`}>
            {question.difficulty}
          </span>

          {/* Language Badge */}
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border shadow-sm ${
            (question.recommendedLanguage || 'Java').toLowerCase().includes('python')
              ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30'
              : (question.recommendedLanguage || 'Java').toLowerCase().includes('c++') || (question.recommendedLanguage || 'Java').toLowerCase().includes('cpp')
              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
              : (question.recommendedLanguage || 'Java').toLowerCase().includes('sql')
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
          }`}>
            <span>{question.recommendedLanguage || 'Java'}</span>
          </span>

          <span className="hidden sm:inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {question.topic}
          </span>

          {question.solved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 px-2.5 py-0.5 rounded-full shadow-sm shadow-emerald-600/30 animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Solved ✓</span>
            </span>
          )}
        </div>

        {/* Right: Action Buttons & Controls */}
        <div className="flex items-center gap-2">
          {/* Bank Badge */}
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
            question.bank === 'bank4' || question.id.startsWith('bank4-')
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
              : question.bank === 'dbms' || question.id.startsWith('dbms-')
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              : question.bank === 'bank3' || question.id.startsWith('bank3-')
              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
              : question.bank === 'bank2' || question.id.startsWith('bank2-')
              ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
          }`}>
            {question.bank === 'bank4' || question.id.startsWith('bank4-')
              ? 'Bank 4'
              : question.bank === 'dbms' || question.id.startsWith('dbms-')
              ? 'DBMS'
              : question.bank === 'bank3' || question.id.startsWith('bank3-')
              ? 'Bank 3'
              : question.bank === 'bank2' || question.id.startsWith('bank2-')
              ? 'Bank 2'
              : 'Bank 1'}
          </span>

          {/* View Screenshot button (Bank 1 and Bank 3) */}
          {question.sourceScreenshot && question.sourceScreenshot.includes('.png') && (
            <button
              onClick={() => setShowScreenshot(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Inspect original exam portal screenshot"
            >
              <Image className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Screenshot</span>
            </button>
          )}

          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              question.isBookmarked
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Bookmark this question"
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>

          {/* Revision Button */}
          <button
            onClick={handleToggleRevision}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              question.isRevision
                ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Flag for Revision"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Solution Modal Trigger */}
          <button
            onClick={handleOpenSolution}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900 border border-amber-200 dark:border-amber-800 transition-colors"
            title="View verified reference solution and explanation"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Solution</span>
          </button>

          {/* Zen Focus Mode: Hide Everything Except Coding */}
          <button
            onClick={toggleZenMode}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isZenMode
                ? 'bg-[#FFA116] text-black shadow-md shadow-[#FFA116]/30 ring-1 ring-[#FFA116]'
                : 'text-neutral-300 hover:text-white bg-[#262626] hover:bg-[#333333] border border-[#3e3e3e]'
            }`}
            title="Zen Focus: Hide everything except code editor (Alt + Z)"
            aria-label="Zen Focus Mode"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isZenMode ? 'Split View' : 'Zen Focus'}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => {
              if (onToggleAbsoluteFullscreen) {
                onToggleAbsoluteFullscreen();
              } else {
                setIsFullscreen(!isFullscreen);
              }
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              activeFullscreen
                ? 'text-[#FFA116] bg-[#FFA116]/10 ring-1 ring-[#FFA116]/40'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={activeFullscreen ? 'Exit Absolute Fullscreen (Esc)' : 'Absolute Fullscreen Workspace'}
            aria-label={activeFullscreen ? 'Exit Absolute Fullscreen' : 'Enter Absolute Fullscreen'}
          >
            {activeFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Segmented Workspace Control (Only on <lg screens) */}
      <div className="lg:hidden flex items-center bg-slate-200/90 dark:bg-[#181818] p-1 rounded-xl border border-slate-300/70 dark:border-neutral-800 text-xs font-semibold shadow-sm">
        <button
          onClick={() => setMobileWorkspaceTab('problem')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileWorkspaceTab === 'problem'
              ? 'bg-white dark:bg-[#282828] text-slate-900 dark:text-white shadow-sm font-bold'
              : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-amber-500" />
          <span>Problem</span>
        </button>

        <button
          onClick={() => {
            setMobileWorkspaceTab('code');
            setTimeout(() => editorRef.current?.layout(), 60);
          }}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileWorkspaceTab === 'code'
              ? 'bg-white dark:bg-[#282828] text-slate-900 dark:text-white shadow-sm font-bold'
              : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-indigo-500" />
          <span>Code</span>
        </button>

        <button
          onClick={() => setMobileWorkspaceTab('console')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileWorkspaceTab === 'console'
              ? 'bg-white dark:bg-[#282828] text-slate-900 dark:text-white shadow-sm font-bold'
              : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Play className="w-3.5 h-3.5 text-emerald-500" />
          <span>Console</span>
          {submitResult && (
            <span
              className={`w-2 h-2 rounded-full ${
                submitResult.status === 'Accepted' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
          )}
        </button>
      </div>

      {/* Main Workspace Split Container */}
      <div
        ref={workspaceContainerRef}
        className={`w-full flex flex-col lg:flex-row items-stretch relative ${
          isDraggingSplit || isDraggingDrawer ? 'select-none pointer-events-auto' : ''
        }`}
      >
        
        {/* Left Column: Problem Specs, Examples, Hints (Full width on mobile, split on desktop) */}
        {(!isDesktop ? mobileWorkspaceTab === 'problem' : !isZenMode) && (
          <div
            style={!isDesktop ? { width: '100%' } : { width: `${splitPercent}%` }}
            className={`w-full lg:w-auto bg-white dark:bg-[#0c121e] rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col ${
              !isDesktop ? 'min-h-[500px]' : 'h-[740px]'
            } overflow-hidden flex-shrink-0`}
          >
          {/* Sub-tabs header */}
          <div className="flex items-center border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-[#090d16] px-2 pt-2">
            <button
              onClick={() => setLeftTab('problem')}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
                leftTab === 'problem'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Problem Statement
            </button>
            <button
              onClick={() => setLeftTab('examples')}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
                leftTab === 'examples'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Test Cases ({question.testCases.length})
            </button>
            <button
              onClick={() => setLeftTab('hints')}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-1 ${
                leftTab === 'hints'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Hints ({question.hints?.length || 0})</span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 select-text cursor-text">
            {leftTab === 'problem' && (
              <div className="space-y-5 text-sm select-text">
                {/* Description */}
                <div className="space-y-2 select-text">
                  <div className="flex items-center justify-between pb-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Description
                    </h4>
                    <button
                      onClick={handleCopyEntireQuestion}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shadow-xs"
                      title="Copy full problem statement, formats, constraints and sample test cases (Ctrl+C)"
                    >
                      {copiedQuestion ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copiedQuestion ? 'Question Copied!' : 'Copy Full Question'}</span>
                    </button>
                  </div>
                  <MarkdownRenderer content={question.description} className="text-sm select-text" />
                </div>

                {/* Input Format */}
                {question.inputFormat && (
                  <div className="space-y-2 select-text">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Input Format
                    </h4>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs font-mono select-text cursor-text">
                      <MarkdownRenderer content={question.inputFormat} />
                    </div>
                  </div>
                )}

                {/* Output Format */}
                {question.outputFormat && (
                  <div className="space-y-2 select-text">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Output Format
                    </h4>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs font-mono select-text cursor-text">
                      <MarkdownRenderer content={question.outputFormat} />
                    </div>
                  </div>
                )}

                {/* Constraints */}
                {question.constraints && question.constraints.length > 0 && (
                  <div className="space-y-2 select-text">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Constraints
                    </h4>
                    <ul className="grid grid-cols-1 gap-1.5 text-xs select-text">
                      {question.constraints.map((c, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2.5 font-mono px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 select-text cursor-text"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                          <span className="select-text">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sample Overview */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3 select-text">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Sample 1
                    </h4>
                    <button
                      onClick={() => setCustomInput(question.sampleInput)}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                    >
                      Use as Custom Input
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 select-text">
                    <div className="space-y-1 select-text">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 uppercase">Input</span>
                        <button
                          onClick={() => handleCopyTestCaseInput(question.sampleInput, 999)}
                          className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                          title="Copy Sample Input"
                        >
                          {copiedTcInput === 999 ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedTcInput === 999 ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto select-text cursor-text">
                        {question.sampleInput || '(no input)'}
                      </pre>
                    </div>
                    <div className="space-y-1 select-text">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 uppercase">Expected Output</span>
                        <button
                          onClick={() => handleCopyTestCaseOutput(question.sampleOutput, 999)}
                          className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                          title="Copy Sample Output"
                        >
                          {copiedTcOutput === 999 ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedTcOutput === 999 ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 overflow-x-auto select-text cursor-text">
                        {question.sampleOutput}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {leftTab === 'examples' && (
              <div className="space-y-4 select-text cursor-text">
                <p className="text-xs text-slate-500 dark:text-slate-400 select-text">
                  Every submission is rigorously compiled and executed against all {question.testCases.length} authentic test cases.
                </p>

                {question.testCases.map((tc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2 select-text"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 select-text">
                        Test Case {idx + 1} {tc.isHidden ? '(Hidden)' : '(Sample)'}
                      </span>
                      {!tc.isHidden && (
                        <button
                          onClick={() => {
                            setCustomInput(tc.input);
                            setBottomTab('run');
                          }}
                          className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                          Load to Runner
                        </button>
                      )}
                    </div>

                    {tc.isHidden ? (
                      <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-500 text-center font-mono select-text">
                        🔒 Hidden Test Case (Evaluated on submission)
                      </div>
                    ) : (
                      <div className="space-y-2 text-xs font-mono select-text">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-slate-400 uppercase">Input</span>
                            <button
                              onClick={() => handleCopyTestCaseInput(tc.input, idx)}
                              className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                              title="Copy Testcase Input"
                            >
                              {copiedTcInput === idx ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedTcInput === idx ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          <pre className="p-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 overflow-x-auto select-text cursor-text">
                            {tc.input}
                          </pre>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-slate-400 uppercase">Expected Output</span>
                            <button
                              onClick={() => handleCopyTestCaseOutput(tc.expectedOutput, idx)}
                              className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                              title="Copy Expected Output"
                            >
                              {copiedTcOutput === idx ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedTcOutput === idx ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          <pre className="p-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 overflow-x-auto select-text cursor-text">
                            {tc.expectedOutput}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {leftTab === 'hints' && (
              <div className="space-y-4 select-text cursor-text">
                <p className="text-xs text-slate-500 dark:text-slate-400 select-text">
                  Need a hint without spoiling the entire solution? Reveal progressive hints one by one.
                </p>

                {question.hints && question.hints.length > 0 ? (
                  question.hints.map((hint, idx) => {
                    const isRevealed = revealedHints[idx];
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2 select-text"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 select-text">
                            Hint {idx + 1}
                          </span>
                          {!isRevealed && (
                            <button
                              onClick={() => setRevealedHints((prev) => ({ ...prev, [idx]: true }))}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Reveal</span>
                            </button>
                          )}
                        </div>

                        {isRevealed ? (
                          <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed animate-fadeIn select-text cursor-text">
                            {hint}
                          </div>
                        ) : (
                          <div className="p-2 text-center text-xs text-slate-400 italic">
                            Click reveal to view this progressive hint.
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center p-8 text-xs text-slate-400">
                    No progressive hints recorded for this problem.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

        {/* Draggable Vertical Splitter Handle (Desktop) */}
        {isDesktop && !isZenMode && (
          <div
            onMouseDown={startSplitResize}
            onDoubleClick={() => setSplitPercent(42)}
            className="hidden lg:flex w-2.5 mx-1 cursor-col-resize items-center justify-center group relative z-20 hover:bg-[#FFA116]/20 active:bg-[#FFA116]/40 transition-colors rounded select-none flex-shrink-0"
            title="Drag to resize problem / editor split (Double-click to reset to 42%)"
          >
            <div className="w-1 h-12 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-[#FFA116] group-active:bg-[#FFA116] transition-colors" />
          </div>
        )}

        {/* Right Column: Code Editor & Execution Drawers (Full width in Zen Mode or Mobile) */}
        {(!isDesktop ? (mobileWorkspaceTab === 'code' || mobileWorkspaceTab === 'console') : true) && (
          <div
            style={!isDesktop ? { width: '100%' } : { width: isZenMode ? '100%' : `calc(${100 - splitPercent}% - 14px)` }}
            className="w-full lg:w-auto flex flex-col space-y-3 flex-1 min-w-0"
          >
            {/* Hidden File Input for code upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".java,.py,.cpp,.cc,.cxx,.sql,.txt"
              className="hidden"
            />
          
            {/* Editor Header Bar & Editor Container */}
            {(!isDesktop ? mobileWorkspaceTab === 'code' : true) && (
              <div className="bg-white dark:bg-[#0c121e] rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-[#090d16] flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Language Switcher Dropdown */}
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-neutral-800 rounded-lg px-2 py-1 border border-slate-200 dark:border-neutral-700">
                  <FileCode className="w-3.5 h-3.5 text-amber-500" />
                  <select
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                    className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
                    title="Switch active coding language (Java, C++, Python, SQL)"
                  >
                    <option value="java" className="bg-white dark:bg-[#1a1a1a]">
                      Java {(question.recommendedLanguage || 'Java') === 'Java' ? '★ (Recommended)' : ''}
                    </option>
                    <option value="cpp" className="bg-white dark:bg-[#1a1a1a]">
                      C++ {question.recommendedLanguage === 'C++' ? '★ (Recommended)' : ''}
                    </option>
                    <option value="python" className="bg-white dark:bg-[#1a1a1a]">
                      Python {question.recommendedLanguage === 'Python' ? '★ (Recommended)' : ''}
                    </option>
                    <option value="sql" className="bg-white dark:bg-[#1a1a1a]">
                      SQL / MySQL {question.recommendedLanguage === 'SQL' ? '★ (Recommended)' : ''}
                    </option>
                  </select>
                </div>

                <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                  {selectedLanguage === 'java' ? 'Main.java' : selectedLanguage === 'python' ? 'solution.py' : selectedLanguage === 'cpp' ? 'solution.cpp' : 'query.sql'}
                </span>

                <span className="text-[10px] font-mono min-w-[75px] inline-block">
                  {isSavingDraft ? (
                    <span className="text-amber-500 animate-pulse">
                      Saving...
                    </span>
                  ) : draftSavedAt ? (
                    <span className="text-slate-400 hidden md:inline">
                      Saved {draftSavedAt}
                    </span>
                  ) : null}
                </span>
              </div>

              {/* Editor controls: Templates, Format, Minimap, Download, Upload, Font, Zen, Reset */}
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                {/* Boilerplate Templates Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowTemplateMenu((prev) => !prev)}
                    className="px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 text-slate-600 dark:text-neutral-300 hover:text-white bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 cursor-pointer"
                    title="Code Boilerplate Templates"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden md:inline">Templates</span>
                  </button>

                  {showTemplateMenu && (
                    <div className="absolute right-0 top-full mt-1.5 w-64 bg-white dark:bg-[#1f1f1f] border border-slate-200 dark:border-[#383838] rounded-xl shadow-2xl py-1.5 z-50 text-xs">
                      <div className="px-3 py-1 font-semibold text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-neutral-800">
                        {selectedLanguage.toUpperCase()} Boilerplate Templates
                      </div>
                      {TEMPLATES_BY_LANGUAGE[selectedLanguage].map((tmpl, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleApplyTemplate(tmpl.code)}
                          className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-neutral-800 flex flex-col gap-0.5 transition-colors cursor-pointer"
                        >
                          <span className="font-semibold text-slate-800 dark:text-white">{tmpl.name}</span>
                          <span className="text-[10px] text-slate-500 dark:text-neutral-400 leading-tight">{tmpl.description}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Auto Format Code (Alt+F) */}
                <button
                  onClick={handleFormatCode}
                  className="px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 text-slate-600 dark:text-neutral-300 hover:text-white bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 cursor-pointer"
                  title="Auto-format Java code indentation (Alt + F)"
                >
                  <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden xl:inline">Format</span>
                </button>

                {/* Minimap Toggle */}
                <button
                  onClick={() => setIsMinimapEnabled((prev) => !prev)}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    isMinimapEnabled
                      ? 'text-[#FFA116] bg-[#FFA116]/10 ring-1 ring-[#FFA116]/30'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800'
                  }`}
                  title={isMinimapEnabled ? 'Hide Monaco Minimap' : 'Show Monaco Minimap'}
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>

                {/* Download Main.java */}
                <button
                  onClick={handleDownloadCode}
                  className="p-1.5 rounded text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Download code as Main.java"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                {/* Upload .java file */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 rounded text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Upload local .java or .txt file into editor"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>

                {/* Zen Code-Only toggle on Editor header */}
                <button
                  onClick={toggleZenMode}
                  className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 cursor-pointer ${
                    isZenMode
                      ? 'text-[#FFA116] bg-[#FFA116]/10 font-bold border border-[#FFA116]/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Toggle Zen Focus: Code Only (Alt+Z)"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isZenMode ? 'Split' : 'Zen'}</span>
                </button>

                {/* Font Size Selector */}
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="bg-slate-100 dark:bg-slate-800 border-none rounded text-xs px-1.5 py-0.5 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value={12}>12px</option>
                    <option value={14}>14px</option>
                    <option value={16}>16px</option>
                    <option value={18}>18px</option>
                  </select>
                </div>

                {/* Reset Code Button */}
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="p-1.5 rounded text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  title="Reset code to starter template (Alt + R)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Monaco Editor Container */}
            <div ref={editorContainerRef} className={`w-full ${isZenMode ? 'h-[calc(100vh-270px)] min-h-[500px]' : activeFullscreen ? 'h-[520px]' : !isDesktop ? 'h-[calc(100vh-290px)] min-h-[440px]' : 'h-[430px]'}`}>
              <Editor
                key={`${questionId}-${selectedLanguage}`}
                height="100%"
                language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'python' ? 'python' : selectedLanguage === 'sql' ? 'sql' : 'java'}
                theme={editorTheme}
                defaultValue={code}
                onChange={(value) => handleCodeChange(value || '')}
                onMount={(editor, monaco) => {
                  editorRef.current = editor;
                  registerMonacoSnippets(monaco);
                  try {
                    monaco.editor.defineTheme('oled-black', {
                      base: 'vs-dark',
                      inherit: true,
                      rules: [],
                      colors: {
                        'editor.background': '#000000',
                        'editorGutter.background': '#000000',
                        'editorLineNumber.foreground': '#555555',
                        'editorLineNumber.activeForeground': '#FFA116',
                        'editor.lineHighlightBackground': '#0c0c0c'
                      }
                    });
                    if (theme === 'oled') {
                      monaco.editor.setTheme('oled-black');
                    }
                  } catch (e) {}

                  // Instant Tab snippet expansion (e.g. typing "sout" and pressing Tab expands System.out.println)
                  editor.onKeyDown((e: any) => {
                    const isTab = (e.keyCode === monaco.KeyCode.Tab || e.code === 'Tab' || e.browserEvent?.key === 'Tab') &&
                                  !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey;
                    if (!isTab) return;

                    // If user has a non-empty selection, let Monaco perform normal block indentation
                    const selection = editor.getSelection();
                    if (selection && !selection.isEmpty()) return;

                    const pos = editor.getPosition();
                    const model = editor.getModel();
                    if (!pos || !model) return;

                    const lineContent = model.getLineContent(pos.lineNumber);
                    const textBefore = lineContent.substring(0, pos.column - 1);
                    const textAfter = lineContent.substring(pos.column - 1);
                    const currentLang = selectedLanguageRef.current;

                    const langSnippets = SNIPPET_MAP[currentLang];
                    if (!langSnippets) return;

                    // Do not expand if preceded by a type keyword (e.g. int sout = 5)
                    if (/(?:int|String|double|float|boolean|char|long|byte|short|void|auto|const)\s+[a-zA-Z0-9_]+$/.test(textBefore)) {
                      return;
                    }

                    // Match keyword before cursor (must be preceded by start-of-line, whitespace, or punctuation)
                    const match = textBefore.match(/(^|[\s;{}()])([a-zA-Z0-9_]+)$/);
                    if (!match) return;

                    const keyword = match[2];
                    const entry = langSnippets[keyword];
                    if (!entry) return;

                    // Intercept Tab event immediately
                    e.preventDefault();
                    e.stopPropagation();

                    // If the statement snippet already ends with a semicolon and user already has a semicolon after cursor, overwrite it
                    const hasTrailingSemi = textAfter.startsWith(';') && entry.snippet.endsWith(';');
                    const overwriteAfter = hasTrailingSemi ? 1 : 0;

                    try {
                      const snippetCtrl = editor.getContribution('snippetController2') as any;
                      if (snippetCtrl && typeof snippetCtrl.insert === 'function') {
                        snippetCtrl.insert(entry.snippet, {
                          overwriteBefore: keyword.length,
                          overwriteAfter
                        });
                        return;
                      }
                    } catch (err) {
                      console.warn('Monaco snippetController error, falling back:', err);
                    }

                    // Fallback using direct model edits with exact parenthesis cursor positioning
                    const startCol = pos.column - keyword.length;
                    const endCol = pos.column + overwriteAfter;
                    editor.executeEdits('custom-snippet', [
                      {
                        range: new monaco.Range(pos.lineNumber, startCol, pos.lineNumber, endCol),
                        text: entry.fallbackText,
                        forceMoveMarkers: true
                      }
                    ]);
                    editor.setPosition({
                      lineNumber: pos.lineNumber,
                      column: startCol + entry.cursorOffset
                    });
                  });
                }}
                options={editorOptions}
              />
            </div>

            {/* Editor Action Bottom Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                Ctrl+Enter to Run · Ctrl+Shift+Enter to Submit · sout+Tab for println
              </span>

              <div className="flex items-center gap-2 ml-auto">
                {/* Run Button */}
                <button
                  onClick={handleRun}
                  disabled={isRunning || isSubmitting}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-500 fill-current" />
                  <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                </button>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isRunning || isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Evaluating...' : 'Submit Code'}</span>
                </button>
              </div>
            </div>
          </div>
          )}

          {/* Draggable Drawer Resize Handle (Desktop only) */}
          {isDesktop && (
            <div
              onMouseDown={startDrawerResize}
              onDoubleClick={() => setDrawerHeight(260)}
              className="h-2.5 -my-1 cursor-row-resize flex items-center justify-center hover:bg-[#FFA116]/25 active:bg-[#FFA116]/40 transition-colors group relative z-10 rounded select-none"
              title="Drag to resize console drawer (Double-click to reset to 260px)"
            >
              <div className="w-16 h-1 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-[#FFA116] group-active:bg-[#FFA116] transition-colors" />
            </div>
          )}

          {/* Execution & Results Panel (Drawer) */}
          {(!isDesktop ? mobileWorkspaceTab === 'console' : true) && (
            <div
              style={!isDesktop ? undefined : { height: `${drawerHeight}px` }}
              className={`bg-white dark:bg-[#0c121e] rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden flex flex-col flex-shrink-0 ${
                !isDesktop ? 'h-[calc(100vh-220px)] min-h-[460px]' : ''
              }`}
            >
            {/* Drawer Tabs */}
            <div className="flex items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-[#090d16]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBottomTab('run')}
                  className={`py-2 text-xs font-semibold border-b-2 transition-colors ${
                    bottomTab === 'run'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Console & Custom Run
                </button>
                <button
                  onClick={() => setBottomTab('submit')}
                  className={`py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                    bottomTab === 'submit'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <span>Test Results</span>
                  {submitResult && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        submitResult.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {submitResult.passedCount}/{submitResult.totalCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setBottomTab('history')}
                  className={`py-2 text-xs font-semibold border-b-2 transition-colors ${
                    bottomTab === 'history'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  History ({history.length})
                </button>
              </div>

              {/* Status summary pill */}
              <div className="text-[11px] font-mono text-slate-400">
                {bottomTab === 'run' && runResult && (
                  <span>Status: {runResult.status} ({runResult.executionTimeMs}ms)</span>
                )}
                {bottomTab === 'submit' && submitResult && (
                  <span className={submitResult.status === 'Accepted' ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                    {submitResult.status} ({submitResult.executionTimeMs}ms)
                  </span>
                )}
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4">
              
              {/* Tab 1: Run & Custom Input */}
              {bottomTab === 'run' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Custom Input Textarea */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold uppercase text-slate-400">
                          Standard Input (stdin)
                        </label>
                        <button
                          onClick={() => setCustomInput('')}
                          className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          Clear
                        </button>
                      </div>
                      <textarea
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="Enter standard input (stdin)..."
                        className="w-full h-24 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Standard Output Preview */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold uppercase text-slate-400">
                          Standard Output (stdout)
                        </label>
                        {runResult?.executionTimeMs ? (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {runResult.executionTimeMs}ms
                          </span>
                        ) : null}
                      </div>
                      <pre className="w-full h-24 p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 overflow-auto whitespace-pre-wrap">
                        {runResult ? (
                          runResult.stderr ? (
                            <span className="text-rose-400">{stripAnsi(runResult.stderr)}</span>
                          ) : (
                            stripAnsi(runResult.stdout) || <span className="text-slate-600">(no output)</span>
                          )
                        ) : (
                          <span className="text-slate-600">Click &quot;Run Code&quot; to execute your {selectedLanguage.toUpperCase()} solution.</span>
                        )}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Test Case Evaluation Results */}
              {bottomTab === 'submit' && (
                <div className="space-y-4">
                  {!submitResult ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      Click &quot;Submit Code&quot; to evaluate your {selectedLanguage.toUpperCase()} program against all hidden and sample test cases.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Overall Verdict Banner */}
                      <div
                        className={`p-3.5 rounded-xl border flex items-center justify-between ${
                          submitResult.status === 'Accepted'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {submitResult.status === 'Accepted' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-500" />
                          )}
                          <div>
                            <div className="text-sm font-bold">
                              {submitResult.status}
                            </div>
                            <div className="text-[11px] opacity-80">
                              {submitResult.passedCount} of {submitResult.totalCount} test cases passed ({submitResult.executionTimeMs}ms total)
                            </div>
                          </div>
                        </div>

                        {submitResult.status === 'Accepted' && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-sm">
                            🎉 100% Correct
                          </span>
                        )}
                      </div>

                      {/* Formatted compiler / runtime diagnostics if compilation or execution failed */}
                      {submitResult.errorMessage && (submitResult.status === 'Compilation Error' || submitResult.status === 'Runtime Error') && (
                        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 space-y-3 animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5 font-mono">
                              <AlertTriangle className="w-4 h-4 text-rose-400" />
                              <span>{selectedLanguage.toUpperCase()} {submitResult.status === 'Compilation Error' ? 'Compilation Diagnostics' : 'Runtime Diagnostics'}</span>
                            </span>
                            <span className="text-[10px] font-mono text-rose-400 bg-rose-900/60 px-2 py-0.5 rounded border border-rose-700">
                              {submitResult.status}
                            </span>
                          </div>

                          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-rose-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {stripAnsi(submitResult.errorMessage)}
                          </div>

                          <div className="text-[11px] text-slate-300 space-y-1 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                            <span className="font-semibold text-rose-300 block">💡 Troubleshooting Hints:</span>
                            <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                              <li>Check line numbers and stack trace shown above.</li>
                              <li>Verify data types: if input contains decimals, read with nextDouble() / parseFloat instead of nextInt().</li>
                              <li>Verify array bounds, scanner inputs, and object null checks.</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Test case breakdown list */}
                      <div className="space-y-3">
                        {submitResult.testResults.map((tr) => {
                          const expOut = tr.expectedOutput || (tr as any).expected;
                          const actOut = tr.actualOutput || (tr as any).actual;
                          const tcInput = (tr as any).input;
                          const tcError = tr.errorMessage || (tr as any).stderr;

                          return (
                            <div
                              key={tr.testIndex}
                              className={`p-3.5 rounded-xl border text-xs transition-all ${
                                tr.passed
                                  ? 'bg-emerald-500/5 border-emerald-500/30 text-slate-800 dark:text-slate-200'
                                  : 'bg-rose-500/5 border-rose-500/30 text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold flex items-center gap-1.5 text-xs sm:text-sm">
                                  {tr.passed ? (
                                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                                  )}
                                  <span>Test Case #{tr.testIndex} {tr.isHidden ? '(Hidden Exam Test)' : '(Sample Test)'}</span>
                                </span>
                                <span className={`font-mono text-[11px] px-2 py-0.5 rounded font-bold ${
                                  tr.passed
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : 'bg-rose-500/10 text-rose-500'
                                }`}>
                                  {tr.passed ? 'PASSED ✓' : tr.status || 'FAILED ✗'} {tr.executionTimeMs ? `(${tr.executionTimeMs}ms)` : ''}
                                </span>
                              </div>

                              {/* Input, Expected, and Actual Diff view */}
                              {!tr.passed && (
                                <div className="mt-2.5 pt-2.5 border-t border-slate-200 dark:border-slate-800/80 space-y-2.5 font-mono text-[11px]">
                                  {tcInput && (
                                    <div>
                                      <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider block mb-1">
                                        Test Input:
                                      </span>
                                      <pre className="p-2 rounded-lg bg-slate-900/90 text-slate-200 border border-slate-800 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                                        {tcInput}
                                      </pre>
                                    </div>
                                  )}

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {expOut !== undefined && (
                                      <div>
                                        <span className="text-emerald-400 font-semibold text-[10px] uppercase tracking-wider block mb-1">
                                          Expected Output:
                                        </span>
                                        <pre className="p-2 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                                          {expOut}
                                        </pre>
                                      </div>
                                    )}

                                    {actOut !== undefined && (
                                      <div>
                                        <span className="text-rose-400 font-semibold text-[10px] uppercase tracking-wider block mb-1">
                                          Your Output:
                                        </span>
                                        <pre className="p-2 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-800/60 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                                          {actOut}
                                        </pre>
                                      </div>
                                    )}
                                  </div>

                                  {tcError && (
                                    <div className="p-2.5 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-800/60 text-[11px] leading-relaxed">
                                      <span className="font-bold block mb-0.5">💡 Diagnostic Detail:</span>
                                      <span>{tcError}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Submission History */}
              {bottomTab === 'history' && (
                <div className="space-y-3">
                  {history.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No previous submissions recorded for this question.
                    </div>
                  ) : (
                    history.map((h) => (
                      <div
                        key={h.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                              h.status === 'Accepted'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {h.status}
                          </span>
                          <span className="text-slate-500 font-mono text-[11px]">
                            {h.passedCount}/{h.totalCount} passed
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-slate-400 font-mono text-[10px]">
                          <span>{h.executionTimeMs}ms</span>
                          <span>{h.submittedAt}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>
          </div>
          )}

        </div>
        )}

      </div>

      {/* Screenshot Modal */}
      <ScreenshotModal
        isOpen={showScreenshot}
        onClose={() => setShowScreenshot(false)}
        screenshotName={question.sourceScreenshot}
        questionTitle={question.title}
      />

      {/* Solution Modal */}
      <SolutionModal
        isOpen={showSolutionModal}
        onClose={() => setShowSolutionModal(false)}
        solution={solutionData}
        onLoadCodeToEditor={(newCode) => {
          codeRef.current = newCode;
          setCode(newCode);
          if (editorRef.current) {
            editorRef.current.setValue(newCode);
          }
        }}
      />

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 [isolation:isolate]">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-amber-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reset Code to Template?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to discard your edits and restore the starter Java code? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleResetCode}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
              >
                Reset Code
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
