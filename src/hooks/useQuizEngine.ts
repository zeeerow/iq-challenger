import { useState, useCallback, useMemo } from 'react';
import { Question, QuizState, QuizResults } from '../types';

interface UseQuizEngineProps {
  questions: Question[];
  numQuestions?: number;
}

export function useQuizEngine({ questions, numQuestions = 10 }: UseQuizEngineProps) {
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswers: {},
    isFinished: false,
    startTime: null,
    endTime: null,
  });

  const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const startQuiz = useCallback((targetQuestions?: Question[], targetNum?: number) => {
    const pool = targetQuestions ?? questions;
    const limit = targetNum ?? numQuestions;
    const shuffled = shuffleArray(pool).slice(0, limit);
    setQuizQuestions(shuffled);
    setState({
      currentQuestionIndex: 0,
      selectedAnswers: {},
      isFinished: false,
      startTime: Date.now(),
      endTime: null,
    });
  }, [questions, numQuestions]);

  const completeQuiz = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isFinished: true,
      endTime: Date.now(),
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentQuestionIndex + 1;
      if (nextIndex >= quizQuestions.length) {
        completeQuiz();
        return prev;
      }
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
      };
    });
  }, [quizQuestions.length, completeQuiz]);

  const submitAnswer = useCallback((questionId: string, optionId: string) => {
    setState((prev) => {
      const newAnswers = { ...prev.selectedAnswers, [questionId]: optionId };
      return {
        ...prev,
        selectedAnswers: newAnswers,
      };
    });
  }, []);

  const skipQuestion = useCallback(() => {
    nextQuestion();
  }, [nextQuestion]);

  const restartQuiz = useCallback(() => {
    startQuiz();
  }, [startQuiz]);

  const results = useMemo((): QuizResults | null => {
    if (!state.isFinished || !state.startTime || !state.endTime) return null;

    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    // Use attended count for results if finished early
    const answeredCount = Object.keys(state.selectedAnswers).length;
    const lastAttendedIndex = Math.max(state.currentQuestionIndex, 0);
    // If the last question was answered, we count it. 
    // If not, we count up to the previous one for the "total attended".
    const totalAttended = state.selectedAnswers[quizQuestions[lastAttendedIndex]?.id] 
      ? lastAttendedIndex + 1 
      : lastAttendedIndex;

    // However, the user might want the original total? 
    // "calculates score upto the attended question"
    // Let's use the number of questions seen so far as the denominator if they finished early
    const isEarlyFinish = state.currentQuestionIndex < quizQuestions.length - 1 || (state.currentQuestionIndex === quizQuestions.length - 1 && !state.selectedAnswers[quizQuestions[state.currentQuestionIndex]?.id]);
    
    const relevantQuestions = isEarlyFinish 
      ? quizQuestions.slice(0, totalAttended || 1) // At least 1 to avoid div by zero
      : quizQuestions;

    relevantQuestions.forEach((q) => {
      const answer = state.selectedAnswers[q.id];
      if (!answer) {
        unanswered++;
      } else if (answer === q.correctOptionId) {
        correct++;
      } else {
        wrong++;
      }
    });

    const total = relevantQuestions.length;
    const score = correct;
    const percentage = Math.round((correct / total) * 100);
    const timeTaken = Math.round((state.endTime - state.startTime) / 1000);

    return {
      totalQuestions: total,
      correctAnswers: correct,
      wrongAnswers: wrong,
      unanswered,
      score,
      percentage,
      timeTaken,
    };
  }, [state, quizQuestions]);

  const attendedQuestions = useMemo(() => {
    if (!state.isFinished) return [];
    
    const lastAttendedIndex = Math.max(state.currentQuestionIndex, 0);
    const hasAnsweredLast = !!state.selectedAnswers[quizQuestions[lastAttendedIndex]?.id];
    const count = hasAnsweredLast ? lastAttendedIndex + 1 : lastAttendedIndex;
    
    // If not early finish, return all
    const isEarlyFinish = state.currentQuestionIndex < quizQuestions.length - 1 || 
                         (state.currentQuestionIndex === quizQuestions.length - 1 && !hasAnsweredLast);
    
    return isEarlyFinish ? quizQuestions.slice(0, count || 1) : quizQuestions;
  }, [state, quizQuestions]);

  return {
    quizQuestions,
    attendedQuestions,
    currentQuestion: quizQuestions[state.currentQuestionIndex],
    currentQuestionIndex: state.currentQuestionIndex,
    selectedAnswers: state.selectedAnswers,
    isFinished: state.isFinished,
    results,
    startQuiz,
    submitAnswer,
    skipQuestion,
    nextQuestion,
    restartQuiz,
    completeQuiz,
  };
}
