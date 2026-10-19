export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type SubmissionStatus = 
  | 'Accepted' 
  | 'Wrong Answer' 
  | 'Compilation Error' 
  | 'Time Limit Exceeded' 
  | 'Runtime Error' 
  | 'Internal Execution Error';

export interface TestCase {
  testIndex: number;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface TestResult {
  testIndex: number;
  passed: boolean;
  status: 'Passed' | 'Failed' | 'Time Limit Exceeded' | 'Runtime Error';
  isHidden?: boolean;
  expectedOutput?: string;
  actualOutput?: string;
  executionTimeMs?: number;
  errorMessage?: string;
}

export interface QuestionSummary {
  id: string;
  title: string;
  topic: string;
  difficulty: Difficulty;
  bank?: 'bank1' | 'bank2';
  solved: boolean;
  attempted: boolean;
  isBookmarked: boolean;
  isRevision: boolean;
  lastStatus?: string;
  lastSubmittedAt?: string;
}

export interface QuestionDetail {
  id: string;
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  sampleInput: string;
  sampleOutput: string;
  testCases: TestCase[];
  topic: string;
  difficulty: Difficulty;
  bank?: 'bank1' | 'bank2';
  sourceScreenshot: string;
  starterCode?: string;
  hints?: string[];
  hasSolution: boolean;
  solved: boolean;
  attempted: boolean;
  isBookmarked: boolean;
  isRevision: boolean;
  revisionReason?: string;
  userDraft?: string;
}

export interface QuestionSolution {
  id: string;
  title: string;
  referenceSolution: string;
  explanation: string;
  extractionStatus: string;
}

export interface RunResult {
  status: string;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  exitCode: number;
}

export interface SubmitResult {
  status: SubmissionStatus;
  passedCount: number;
  totalCount: number;
  executionTimeMs: number;
  errorMessage?: string | null;
  testResults: TestResult[];
}

export interface SubmissionRecord {
  id: number;
  questionId: string;
  title?: string;
  status: SubmissionStatus;
  passedCount: number;
  totalCount: number;
  executionTimeMs: number;
  errorMessage?: string;
  testResults?: TestResult[];
  submittedAt: string;
  code?: string;
}

export interface TopicStat {
  topic: string;
  total: number;
  solved: number;
}

export interface DifficultyStat {
  difficulty: Difficulty;
  total: number;
  solved: number;
}

export interface DashboardStats {
  totalQuestions: number;
  bank1Total?: number;
  bank1Solved?: number;
  bank2Total?: number;
  bank2Solved?: number;
  solvedCount: number;
  attemptedCount: number;
  notStartedCount: number;
  revisionCount: number;
  bookmarkCount: number;
  totalSubmissions: number;
  accuracy: number;
  completionPercentage: number;
  topicStats: TopicStat[];
  difficultyStats: DifficultyStat[];
  recentActivity: SubmissionRecord[];
  dailyGoal: number;
  solvedToday: number;
}

export interface SystemHealth {
  status: 'ok' | 'degraded';
  java: {
    available: boolean;
    version: string;
  };
  javac: {
    available: boolean;
    version: string;
  };
  database: string;
}

export interface CurriculumItem {
  id: string;
  sequence: number;
  title: string;
  filename: string;
  module: string;
  format: 'PDF' | 'PPTX' | 'DOCX';
  estimatedMinutes: number;
  description: string[];
  sizeBytes: number;
  sizeFormatted: string;
}

export interface MasterclassModule {
  id: string;
  title: string;
  subtitle: string;
  overview: string;
  keyTakeaways: string[];
  codeSnippet: string;
}

export interface MasterclassParameter {
  name: string;
  type: string;
  desc: string;
}

export interface MasterclassMethod {
  name: string;
  class: string;
  letter: string;
  category: string;
  signature: string;
  returnType: string;
  description: string;
  parameters: MasterclassParameter[];
  returns: string;
  exceptions: string;
  pitfalls: string;
  snippet: string;
}

export interface MasterclassData {
  modules: MasterclassModule[];
  methods: MasterclassMethod[];
  stats: {
    totalModules: number;
    totalMethods: number;
    categories: string[];
    alphabetIndex: string[];
  };
}

