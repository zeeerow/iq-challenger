import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../types';
import { Timer, Brain, X, AlertCircle } from 'lucide-react';

interface QuizCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  remainingSeconds: number;
  onSelectOption: (optionId: string) => void;
  selectedOptionId?: string;
  onCancel: () => void;
  onComplete: () => void;
}

export function QuizCard({
  question,
  currentIndex,
  totalQuestions,
  remainingSeconds,
  onSelectOption,
  selectedOptionId,
  onCancel,
  onComplete
}: QuizCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const progress = ((currentIndex) / totalQuestions) * 100;

  return (
    <div className="w-full max-w-md mx-auto space-y-6 relative">
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl space-y-6"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                  <AlertCircle size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">சவாலை நிறுத்தலாமா?</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    நீங்கள் இப்போது நிறுத்தினால், இதுவரை அளித்த பதில்களின் அடிப்படையில் முடிவுகளைப் பார்க்கலாம்.
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    onComplete();
                  }}
                  className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                  முடிவுகளைக் காண்
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    onCancel();
                  }}
                  className="w-full bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-colors"
                >
                  வெளியேற
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="w-full py-4 text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors"
                >
                  தொடர்ந்து விளையாடு
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-indigo-500"
        />
      </div>

      <div className="flex justify-between items-center px-1">
        <button
          onClick={() => setShowConfirm(true)}
          className="p-2 -ml-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
        >
          <X size={20} />
        </button>
        
        <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase">
          கேள்வி {currentIndex + 1}/{totalQuestions}
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
          remainingSeconds <= 5 
            ? 'bg-rose-50 border-rose-100 text-rose-600 animate-pulse' 
            : 'bg-indigo-50 border-indigo-100 text-indigo-600'
        }`}>
          <div className={`w-2 h-2 rounded-full ${remainingSeconds <= 5 ? 'bg-rose-500' : 'bg-indigo-500'}`} />
          {remainingSeconds < 10 ? `00:0${remainingSeconds}` : `00:${remainingSeconds}`}
        </div>
      </div>

      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50"
      >
        <div className="mb-2">
          <span className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
            {question.category === 'number_series' ? 'எண் தொடர்' :
             question.category === 'pattern_recognition' ? 'உருவ அமைப்பு' :
             question.category === 'logical_reasoning' ? 'தர்க்க சிந்தனை' :
             question.category === 'spatial_reasoning' ? 'இடஞ்சார்ந்த அறிவு' :
             question.category === 'verbal_reasoning' ? 'மொழித் திறன்' : 'பொது'}
          </span>
          <h2 className="text-xl font-bold text-slate-800 leading-snug mt-2">
            {question.question}
          </h2>
        </div>

        <div className="grid gap-3 mt-8">
          {question.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrect = selectedOptionId && option.id === question.correctOptionId;
            const isWrong = isSelected && option.id !== question.correctOptionId;

            return (
              <button
                key={option.id}
                onClick={() => !selectedOptionId && onSelectOption(option.id)}
                disabled={!!selectedOptionId}
                className={`
                  w-full text-left p-4 rounded-2xl border-2 font-semibold transition-all flex justify-between items-center group
                  ${!selectedOptionId ? 'border-slate-50 hover:border-indigo-400 hover:bg-slate-50 active:scale-[0.98]' : ''}
                  ${isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : ''}
                  ${isWrong ? 'bg-rose-50 border-rose-500 text-rose-900' : ''}
                  ${isSelected && !isCorrect && !isWrong ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : ''}
                  ${!isSelected && selectedOptionId ? 'opacity-40 grayscale' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold uppercase ${isCorrect ? 'text-emerald-600' : isWrong ? 'text-rose-600' : 'text-slate-400'}`}>
                    {option.id})
                  </span>
                  {option.text}
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                  ${isCorrect ? 'bg-emerald-500 border-emerald-500' : isWrong ? 'bg-rose-500 border-rose-500' : 'border-slate-200 group-hover:border-indigo-400'}
                  ${isSelected ? 'border-indigo-600' : ''}
                `}>
                   {(isCorrect || isWrong || isSelected) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
      
      {selectedOptionId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-indigo-50/50 rounded-2xl border border-dashed border-indigo-200"
        >
          <p className="text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-indigo-600 uppercase mr-2 tracking-tighter">விளக்கம்:</span>
            {question.explanation}
          </p>
        </motion.div>
      )}
    </div>
  );
}
