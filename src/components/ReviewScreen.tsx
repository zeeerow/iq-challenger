import { motion } from 'motion/react';
import { Question } from '../types';
import { ArrowLeft, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';

interface ReviewScreenProps {
  questions: Question[];
  selectedAnswers: Record<string, string>;
  onBack: () => void;
}

export function ReviewScreen({ questions, selectedAnswers, onBack }: ReviewScreenProps) {
  return (
    <div className="w-full max-w-md mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 bg-white rounded-full shadow-md hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-800">விடைகளை மதிப்பாய்வு செய்</h2>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => {
          const userAnswerId = selectedAnswers[q.id];
          const isCorrect = userAnswerId === q.correctOptionId;
          const isUnanswered = !userAnswerId;

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-slate-100 p-6 rounded-3xl shadow-lg shadow-slate-200/40 space-y-4"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase">கேள்வி {idx + 1}</span>
                {isCorrect ? (
                  <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-[10px] font-bold">
                    <CheckCircle2 size={12} /> சரி
                  </div>
                ) : isUnanswered ? (
                  <div className="flex items-center gap-1 text-slate-500 bg-slate-50 px-2 py-1 rounded-full text-[10px] font-bold">
                    <MinusCircle size={12} /> பதிலளிக்கவில்லை
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-1 rounded-full text-[10px] font-bold">
                    <XCircle size={12} /> தவறு
                  </div>
                )}
              </div>

              <h3 className="font-bold text-slate-800 leading-tight">
                {q.question}
              </h3>

              <div className="space-y-2">
                {q.options.map((option) => {
                  const isUserSelection = userAnswerId === option.id;
                  const isCorrectOption = option.id === q.correctOptionId;

                  let borderClass = "border-slate-50 bg-slate-50/50";
                  let textClass = "text-slate-600";

                  if (isCorrectOption) {
                    borderClass = "border-emerald-500 bg-emerald-50";
                    textClass = "text-emerald-700 font-bold";
                  } else if (isUserSelection && !isCorrect) {
                    borderClass = "border-rose-500 bg-rose-50";
                    textClass = "text-rose-700 font-bold";
                  }

                  return (
                    <div 
                      key={option.id}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${borderClass} ${textClass}`}
                    >
                      <span>{option.id}) {option.text}</span>
                      {isCorrectOption && <CheckCircle2 size={14} className="text-emerald-500" />}
                      {isUserSelection && !isCorrect && <XCircle size={14} className="text-rose-500" />}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <div className="p-4 bg-indigo-50 rounded-2xl">
                  <p className="text-[10px] leading-relaxed text-indigo-900/70">
                    <span className="font-bold text-indigo-600 mr-2">விளக்கம்:</span>
                    {q.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
