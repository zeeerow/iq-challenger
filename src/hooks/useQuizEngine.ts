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

    quizQuestions.forEach((q) => {
      const answer = state.selectedAnswers[q.id];
      if (!answer) {
        unanswered++;
      } else if (answer === q.correctOptionId) {
        correct++;
      } else {
        wrong++;
      }
    });

    const total = quizQuestions.length;
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

  return {
    quizQuestions,
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
  };
}
