export type Category = 'number_series' | 'pattern_recognition' | 'logical_reasoning' | 'spatial_reasoning' | 'verbal_reasoning';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  category: Category;
  difficulty: Difficulty;
  question: string;
  image: string | null;
  options: Option[];
  correctOptionId: string;
  explanation: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string>; // questionId -> optionId
  isFinished: boolean;
  startTime: number | null;
  endTime: number | null;
}

export interface QuizResults {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  score: number;
  percentage: number;
  timeTaken: number; // in seconds
}
