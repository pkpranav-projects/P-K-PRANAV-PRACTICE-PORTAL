# ☕ Java Practice Arena — Complete Exam-Style Coding Platform

A personal, production-grade Java programming practice and exam portal built from real skipped university lab exam screenshots.

---

## 🌟 Key Highlights & Features

- **Dual Question Banks**:
  - **📁 Question Bank 1 (30 Problems)**: Original authentic skipped Java programming questions extracted from portal screenshots.
  - **🚀 Question Bank 2 (15 Problems)**: Comprehensive modern challenges adapted from *Modern Java* (by Bob McCue) and standard interview patterns (Collatz, Roman Numerals, Anagrams, Matrix Rotation, Traffic Light State Machine, Bank Account Invariants, etc.).
- **🔤 Java Masterclass & A-to-Z Reference (Adapted from `javabook.mccue.dev`)**:
  - **18 Structured Textbook Modules**: Complete learning path covering toolchains, primitives, booleans, arithmetic, text blocks, Scanner traps, loops, OOP, enums, switch expressions, exceptions, and collections.
  - **A-to-Z Methods & Functions Encyclopedia**: Over 64 interactive method cards with signatures, parameter tables, return specifications, common pitfalls, and copyable Java code snippets.
- **Sleek Side Navigation**: Linear/Raycast-inspired collapsible sidebar with micro-indicators and direct access to Question Banks, Masterclass, Workspace, Study Curriculum, and Exam Mode.
- **Java Study Curriculum (27 Guides from `documentss`)**: Structured sequential study roadmap ordering all 27 study materials (PDFs, PPTXs, DOCXs) from Java foundations to advanced multithreading, each with an exact 4-line breakdown.
- **Native OS Viewer Launch (Zero Downloads)**: Direct "Open Local File" button launches the file on the user's computer via system default viewer without downloading or duplicating files.
- **Emerald Green Solved Indicator (`SOLVED ✓`)**: Solved problem cards turn emerald green with an active checkmark badge, green border glow, and green review buttons.
- **Compiler Diagnostic Intelligence**: Dedicated compilation error troubleshooting box parsing javac output, error carats (`^`), and line numbers.
- **100% Test-Pass Verified**: Every question across both banks includes complete starter templates, sample test cases, hidden test cases, verified reference solutions, and explanations tested with local **OpenJDK 27** (`javac 27` / `java 27`).
- **Real Sandboxed Execution**: Isolated temporary folders, execution timeouts, memory limits (`-Xmx256m`), output size caps (1MB), and line-ending/whitespace-normalized comparison.
- **Monaco Code Editor**: VS Code Monaco editor with Java syntax highlighting, font scaling, auto-saving drafts, and keyboard shortcuts (`Ctrl+Enter` to Run, `Ctrl+Shift+Enter` to Submit).
- **Exam Integrity & Privacy Shield**: Hidden test cases are evaluated securely on the backend without leaking expected outputs to the client.
- **Authentic Portal Screenshots**: Built-in screenshot inspector modal allowing you to view the original exam portal screenshot alongside the question.
- **Exam Mode Simulator**: Configurable timed exams (30m, 45m, 60m) with randomized question sets, live countdown timer, and exam summary report.
- **Persistent Progress Tracking**: Backed by high-performance SQLite (`node:sqlite` in Node.js 24) for zero-dependency persistence of submissions, accuracy, topics, daily goals, bookmarks, and revision queue.
- **Theme & System Sync**: Polished dark obsidian (`#070b12`) and light themes with FOUC prevention and system preference detection.
- **Data Export & Restore**: One-click JSON backup export, import, and clean progress reset.

---

## 📁 Repository Structure

```
javapractice/
├── documentss/                 # 27 Java study guides (PDF, PPTX, DOCX)
├── questions/                  # Original exam portal screenshots (78 files)
├── questions.json              # Structured question bank (30 verified questions)
├── manifest.json               # Extraction audit manifest
├── server/                     # Backend API & Execution Engine (Express + SQLite)
│   ├── src/
│   │   ├── server.js           # REST API endpoints, static SPA & file launcher
│   │   ├── curriculum.js       # 27-item sequential study roadmap & 4-line descriptions
│   │   ├── db.js               # Node.js native SQLite database & schema
│   │   └── executor.js         # Sandboxed Java compilation & execution engine
│   └── package.json
├── client/                     # Modern React + TypeScript + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.tsx             # Collapsible modern side navigation
│   │   │   ├── DashboardView.tsx       # KPI metrics, topic/difficulty bars, timeline
│   │   │   ├── QuestionBankView.tsx    # Filterable & searchable question library
│   │   │   ├── ProblemWorkspaceView.tsx# Split-pane Monaco workspace & test runner
│   │   │   ├── CurriculumView.tsx      # Study roadmap (27 guides & native launch)
│   │   │   ├── ExamModeView.tsx        # Timed exam simulator
│   │   │   ├── SettingsModal.tsx       # Theme, daily target, backup export/restore
│   │   │   ├── ScreenshotModal.tsx     # Authentic screenshot viewer
│   │   │   └── SolutionModal.tsx       # Safe reference solution & logic reveal
│   │   ├── services/api.ts             # API client
│   │   ├── types/index.ts              # TypeScript interfaces
│   │   ├── App.tsx                     # Main application container
│   │   └── index.css                   # Tailwind styles & scrollbars
│   ├── dist/                           # Compiled production build
│   └── package.json
└── scripts/
    ├── extract_all_questions.py# Offline OCR & extraction pipeline
    ├── verify_all_questions.py # Automated Java compilation & test-case verifier
    ├── verify_curriculum.py    # Curriculum ordering & launcher verification
    └── verify_e2e.py           # End-to-end integration test suite (12 checks)
```

---

## 🚀 Quick Start

### 1. Requirements
- **Node.js**: v22+ or v24+
- **Java Development Kit (JDK)**: OpenJDK 17, 21, or 27 installed and accessible via `java` and `javac` on your PATH.

### 2. Start the Application
Run the backend server (which also serves the compiled frontend on port 5000):

```powershell
cd "c:\Users\P K PRANAV\Pictures\javapractice\server"
node src/server.js
```

Then open your browser at:
👉 **[http://localhost:5000](http://localhost:5000)**

### 3. Development Mode (Optional)
If you want live hot-reloading for frontend modifications:

```powershell
# Terminal 1: Backend
cd "c:\Users\P K PRANAV\Pictures\javapractice\server"
node src/server.js

# Terminal 2: Frontend Vite Dev Server
cd "c:\Users\P K PRANAV\Pictures\javapractice\client"
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)**.

---

## 📊 Question Bank Overview (30 Questions)

| ID | Title | Topic | Difficulty | Test Cases | Source Screenshot |
|:---|:---|:---|:---:|:---:|:---|
| `java-001` | Substring Insertion at Position | Strings | Easy | 5 | `Screenshot (159).png` |
| `java-002` | Print Alternate Characters | Strings | Easy | 5 | `Screenshot (160).png` |
| `java-003` | Invert Triangle Character Pattern | Strings | Medium | 5 | `Screenshot (161).png` |
| `java-004` | Word Scramble Game with Seeded Random | Strings | Medium | 5 | `Screenshot (162).png` |
| `java-005` | Count String Occurrences in Array | Strings | Medium | 5 | `Screenshot (163).png` |
| `java-006` | Product Discount Based on Category and Festival | Control Flow | Easy | 5 | `Screenshot (164).png` |
| `java-007` | Merge Two Float Arrays Alternately | Arrays | Medium | 5 | `Screenshot (165).png` |
| `java-008` | Student Details and Age Verification | Classes and Objects | Medium | 5 | `Screenshot (166).png` |
| `java-009` | Library Book Return and Overdue Fine | Classes and Objects | Medium | 5 | `Screenshot (167).png` |
| `java-010` | Online Store Shopping Cart Total | Classes and Objects | Medium | 5 | `Screenshot (168).png` |
| `java-011` | Hotel Room Booking Cost Calculation | Classes and Objects | Medium | 5 | `Screenshot (169).png` |
| `java-012` | Movie Ticket Booking with Discounts | Classes and Objects | Medium | 5 | `Screenshot (170).png` |
| `java-013` | Employee Details and Salary Calculation | Classes and Objects | Medium | 5 | `Screenshot (171).png` |
| `java-014` | Customer Bank Account Management | Classes and Objects | Medium | 5 | `Screenshot (172).png` |
| `java-015` | Matrix Multiplication with Validity Check | Arrays | Medium | 5 | `Screenshot (173).png` |
| `java-016` | Rotate Square Matrix 90 Degrees Clockwise | Arrays | Medium | 5 | `Screenshot (174).png` |
| `java-017` | Sort Matrix Rows and Columns | Arrays | Medium | 5 | `Screenshot (175).png` |
| `java-018` | Count Words and Characters in Text File | File Handling | Hard | 5 | `Screenshot (176).png` |
| `java-019` | Append Text to Existing File | File Handling | Hard | 5 | `Screenshot (177).png` |
| `java-020` | Copy Image File Using Byte Streams | File Handling | Hard | 5 | `Screenshot (178).png` |
| `java-021` | Read and Write Binary Data Using Streams | File Handling | Hard | 5 | `Screenshot (179).png` |
| `java-022` | Bank Account Deserialization | File Handling | Hard | 5 | `Screenshot (180).png` |
| `java-023` | Validate Integer Within Range | Exception Handling | Hard | 5 | `Screenshot (181).png` |
| `java-024` | Catch Negative Value Exception for Natural Numbers | Exception Handling | Hard | 5 | `Screenshot (182).png` |
| `java-025` | Parse Binary String to Integer Primitive and Object | Wrapper Class | Hard | 5 | `Screenshot (183).png` |
| `java-026` | Parse Float String to Primitive and Object | Wrapper Class | Hard | 5 | `Screenshot (184).png` |
| `java-027` | Merge Two Sorted Lists | Algorithms | Hard | 5 | `Screenshot (185).png` |
| `java-028` | Method Overloading for Calculating Area | Methods | Hard | 5 | `Screenshot (186).png` |
| `java-029` | Method Overloading for Volume Calculation | Methods | Hard | 5 | `Screenshot (187).png` |
| `java-030` | Bank Account with Custom Deposit and Withdraw Limits | Classes and Objects | Medium | 5 | `Screenshot (188).png` |

---

## 🧪 Verification & Automated Testing

You can run automated verification anytime:

```powershell
# Verify all 30 Java reference solutions compile and pass 100% of test cases:
python scripts/verify_all_questions.py

# Verify the complete end-to-end API and workflow:
python scripts/verify_e2e.py
```

Both test suites run completely offline and verify live with your local Java compiler.
