
export interface Question {
  id: string;
  text: string;
  image?: string; // Savol rasmi (base64)
  options: string[];
  optionImages?: (string | undefined)[]; // Har bir javob varianti uchun rasm (base64)
  correctIndex: number;
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
