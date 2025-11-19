
export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
}

export interface QuizData {
  title: string;
  description: string;
  questions: Question[];
}

export interface UserAnswers {
  [questionId: string]: string; // maps questionId to selected optionId
}

export interface UserInfo {
  username: string;
  topic: string;
}

export interface QuizResult {
  username: string;
  topic: string;
  score: number;
  totalQuestions: number;
  timestamp: number;
}
