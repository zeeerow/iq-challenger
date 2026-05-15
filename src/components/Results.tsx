import { motion } from 'motion/react';
import { QuizResults, Question } from '../types';
import { Trophy, RotateCcw, Home, CheckCircle2, XCircle, MinusCircle, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ResultsProps {
  results: QuizResults;
  questions: Question[];
  selectedAnswers: Record<string, string>;
  onRestart: () => void;
  onHome: () => void;
  onReview: () => void;
}

export function Results({ results, questions, selectedAnswers, onRestart, onHome, onReview }: ResultsProps) {
  const [bestScore, setBestScore] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('iq_challenger_best');
    const currentBest = saved ? parseInt(saved, 10) : 0;
    if (results.score > currentBest) {
      localStorage.setItem('iq_challenger_best', results.score.toString());
      setBestScore(results.score);
    } else {
      setBestScore(currentBest);
    }
  }, [results.score]);

  const getRank = (percentage: number) => {
    if (percentage === 100) return { label: 'மேதை', color: 'text-purple-600' };
    if (percentage >= 80) return { label: 'விஞ்ஞானி', color: 'text-blue-600' };
    if (percentage >= 60) return { label: 'சிந்தனையாளர்', color: 'text-green-600' };
    if (percentage >= 40) return { label: 'மாணவர்', color: 'text-yellow-600' };
    return { label: 'தொடக்கநிலை', color: 'text-gray-600' };
  };

  const rank = getRank(results.percentage);

  return (
    <div className="w-full max-w-md mx-auto space-y-8 pb-12 rounded-[2.5rem] overflow-hidden bg-white shadow-2xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center bg-indigo-600 pt-12 pb-8 px-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 opacity-10 translate-x-1/2 -translate-y-1/3">
          <Trophy size={160} className="text-white" />
        </div>

        <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2 block">சவால் முடிந்தது</span>
        <h1 className="text-6xl font-bold text-white mb-3">
          {results.percentage}%
        </h1>
        <div className="inline-flex px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold">
          {rank.label} நிலைத் திறன்
        </div>
      </motion.div>

      <div className="px-6 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">துல்லியம்</p>
            <p className="text-2xl font-bold text-slate-800">{results.percentage}%</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">சிறந்த மதிப்பெண்</p>
            <p className="text-2xl font-bold text-slate-800">{bestScore}/{results.totalQuestions}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">செயல்திறன் விவரம்</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500 uppercase">சரி</span>
                <span className="text-emerald-600 font-mono">{results.correctAnswers}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(results.correctAnswers / results.totalQuestions) * 100}%` }}
                  className="h-full bg-emerald-500" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500 uppercase">தவறு / தவிர்க்கப்பட்டது</span>
                <span className="text-rose-600 font-mono">{results.wrongAnswers + results.unanswered}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${((results.wrongAnswers + results.unanswered) / results.totalQuestions) * 100}%` }}
                   className="h-full bg-rose-500" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl">
          <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-slate-400">மதிப்பீட்டுப் பதிவேடு</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const answer = selectedAnswers[q.id];
              const isCorrect = answer === q.correctOptionId;
              const isUnanswered = !answer;

              return (
                <div 
                  key={q.id} 
                  className={`aspect-square flex items-center justify-center rounded-lg text-[10px] font-bold border
                    ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 
                      isUnanswered ? 'bg-slate-800 border-slate-700 text-slate-500' : 
                      'bg-rose-500/10 border-rose-500/50 text-rose-400'}
                  `}
                >
                  {idx + 1}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={onRestart}
            className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 active:scale-95 transition-all"
          >
            <RotateCcw size={18} />
            மீண்டும் முயல்க
          </button>
          
          <button
            onClick={onReview}
            className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all text-sm"
          >
            <Eye size={18} />
            பதில்களை மதிப்பாய்வு செய்க
          </button>

          <button
            onClick={onHome}
            className="w-full bg-white border-2 border-slate-100 text-slate-600 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all text-sm"
          >
            <Home size={18} />
            முகப்புக்குச் செல்க
          </button>
        </div>
      </div>
    </div>
  );
}
