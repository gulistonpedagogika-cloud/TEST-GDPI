
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number; // For your logic, 0 is always correct initially
}

export interface QuizSettings {
  questionCount: number;
  timeLimitMinutes: number;
}

export interface Subject {
  id: string;
  name: string;
  questions: Question[];
  settings: QuizSettings;
  createdAt: number;
}

export interface TestResult {
  id: string;
  studentName: string;
  group: string;
  subjectName: string;
  score: number;
  total: number;
  date: number;
}

export enum AppView {
  LANDING = 'LANDING',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  ADMIN_RESULTS = 'ADMIN_RESULTS',
  STUDENT_LOGIN = 'STUDENT_LOGIN',
  STUDENT_SUBJECTS = 'STUDENT_SUBJECTS',
  STUDENT_QUIZ = 'STUDENT_QUIZ',
  STUDENT_RESULT = 'STUDENT_RESULT'
}
