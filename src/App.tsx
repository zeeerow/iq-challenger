import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import questionsData from './data/questions.json';
import papersData from './data/papers.json';
import { useQuizEngine } from './hooks/useQuizEngine';
import { useCountdown } from './hooks/useCountdown';
import { QuizCard } from './components/QuizCard';
import { Results } from './components/Results';
import { ReviewScreen } from './components/ReviewScreen';
import { InstallPrompt } from './components/InstallPrompt';
import { Brain, Play, Trophy, Gauge, Globe, BookOpen, ChevronRight, FileText, X } from 'lucide-react';
import { Question, PapersData, Paper } from './types';

type Screen = 'home' | 'quiz' | 'results' | 'review' | 'papers_main' | 'papers_list';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>();
  const [selectedPaperType, setSelectedPaperType] = useState<'iq' | 'gk' | null>(null);
  
  const engine = useQuizEngine({ 
    questions: questionsData as Question[],
    numQuestions: 10 
  });

  const timer = useCountdown({
    initialSeconds: 30,
    onComplete: () => {
      if (screen === 'quiz' && !selectedOptionId) {
        handleNext();
      }
    }
  });

  const handleStart = (mode: 'sprint' | 'logic' | 'visual' | 'math' | 'marathon' | 'gk' | 'edu') => {
    let filtered = [...questionsData] as Question[];
    let count = 10;

    switch (mode) {
      case 'logic':
        filtered = filtered.filter(q => q.category === 'logical_reasoning' || q.category === 'verbal_reasoning');
        break;
      case 'visual':
        filtered = filtered.filter(q => q.category === 'spatial_reasoning' || q.category === 'pattern_recognition');
        break;
      case 'math':
        filtered = filtered.filter(q => q.category === 'number_series');
        break;
      case 'gk':
        filtered = filtered.filter(q => q.category === 'general_knowledge');
        count = 30;
        break;
      case 'edu':
        filtered = filtered.filter(q => q.category === 'edu_reforms');
        count = 30;
        break;
      case 'marathon':
        count = filtered.length;
        break;
      default:
        count = 10;
    }

    engine.startQuiz(filtered, count);
    setScreen('quiz');
    setSelectedOptionId(undefined);
    timer.reset(30);
    timer.start();
  };

  const handleStartPaper = (paper: Paper) => {
    engine.startQuiz(paper.questions, paper.questions.length);
    setScreen('quiz');
    setSelectedOptionId(undefined);
    timer.reset(30);
    timer.start();
  };

  const handleRestart = () => {
     // Restart with the same settings as previous run
     engine.restartQuiz();
     setScreen('quiz');
     setSelectedOptionId(undefined);
     timer.reset(30);
     timer.start();
  };

  const handleNext = () => {
    setSelectedOptionId(undefined);
    if (engine.currentQuestionIndex + 1 >= engine.quizQuestions.length) {
      engine.nextQuestion(); // This triggers isFinished
    } else {
      engine.nextQuestion();
      timer.reset(30);
      timer.start();
    }
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    timer.stop();
    engine.submitAnswer(engine.currentQuestion.id, optionId);
    
    // Auto-move after short delay
    setTimeout(handleNext, 1500);
  };

  useEffect(() => {
    if (engine.isFinished) {
      setScreen('results');
    }
  }, [engine.isFinished]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="w-full h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">IQ</div>
          <span className="text-slate-800 font-bold text-sm tracking-tight hidden sm:block">CHALLENGER <span className="text-slate-400 font-normal">v2.0</span></span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">சிறந்த மதிப்பெண்</span>
          <span className="text-slate-700 font-mono font-bold text-sm leading-none">{localStorage.getItem('iq_challenger_best') || '0'}</span>
        </div>
      </header>

      <div className="mx-auto max-w-md px-6 py-8 min-h-[calc(100vh-64px)] flex flex-col">
        
        <AnimatePresence mode="wait">
          {screen === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 space-y-10"
            >
              <div className="text-center space-y-4 pt-4">
                <div className="inline-flex w-16 h-16 bg-indigo-600 text-white rounded-2xl items-center justify-center shadow-xl shadow-indigo-200">
                  <Brain size={32} />
                </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-800 uppercase">
                  பிரிவைத் தேர்ந்தெடு
                </h1>
                <p className="text-slate-400 font-medium text-xs uppercase tracking-widest mt-1">
                  உங்கள் சவாலைத் தடையின்றித் தொடங்குங்கள்
                </p>
              </div>
              </div>

              <div className="grid gap-4">
                <button
                  onClick={() => handleStart('sprint')}
                  className="w-full bg-indigo-600 text-white p-6 rounded-[2rem] font-bold flex items-center justify-between shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <Play size={24} fill="currentColor" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg leading-tight uppercase font-black italic">விரைவு ஓட்டம்</h3>
                      <p className="text-xs text-indigo-100 font-medium opacity-80">10 சீரற்ற கேள்விகள்</p>
                    </div>
                  </div>
                  <Gauge size={20} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleStart('logic')}
                    className="p-5 bg-white border border-slate-100 rounded-[2rem] text-left hover:border-indigo-200 transition-all active:scale-[0.96]"
                  >
                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 mb-4">
                      <Brain size={20} />
                    </div>
                    <h4 className="font-bold text-sm uppercase mb-1">தர்க்க அறிவு</h4>
                    <p className="text-[10px] text-slate-400 font-medium leading-tight">காரணமறிதல் மற்றும் மொழித் திறன்</p>
                  </button>
                  <button
                    onClick={() => handleStart('math')}
                    className="p-5 bg-white border border-slate-100 rounded-[2rem] text-left hover:border-indigo-200 transition-all active:scale-[0.96]"
                  >
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
                      <Gauge size={20} />
                    </div>
                    <h4 className="font-bold text-sm uppercase mb-1">கணித வல்லுநர்</h4>
                    <p className="text-[10px] text-slate-400 font-medium leading-tight">சிக்கலான எண் தொடர்கள்</p>
                  </button>
                  <button
                    onClick={() => handleStart('gk')}
                    className="p-5 bg-white border border-slate-100 rounded-[2rem] text-left hover:border-indigo-200 transition-all active:scale-[0.96]"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                      <Globe size={20} />
                    </div>
                    <h4 className="font-bold text-sm uppercase mb-1">General Knowledge</h4>
                    <p className="text-[10px] text-slate-400 font-medium leading-tight">பொது அறிவு மற்றும் நடப்பு நிகழ்வுகள்</p>
                  </button>
                  <button
                    onClick={() => handleStart('edu')}
                    className="p-5 bg-white border border-slate-100 rounded-[2rem] text-left hover:border-indigo-200 transition-all active:scale-[0.96]"
                  >
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                      <BookOpen size={20} />
                    </div>
                    <h4 className="font-bold text-sm uppercase mb-1">Edu Reforms</h4>
                    <p className="text-[10px] text-slate-400 font-medium leading-tight">கல்விச் சீர்திருத்தங்கள் மற்றும் கொள்கைகள்</p>
                  </button>
                  <button
                    onClick={() => handleStart('visual')}
                    className="p-5 bg-white border border-slate-100 rounded-[2rem] text-left hover:border-indigo-200 transition-all active:scale-[0.96]"
                  >
                    <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 mb-4">
                      <Trophy size={20} />
                    </div>
                    <h4 className="font-bold text-sm uppercase mb-1">காட்சித் திறன்</h4>
                    <p className="text-[10px] text-slate-400 font-medium leading-tight">வடிவம் மற்றும் இடஞ்சார்ந்த அறிவு</p>
                  </button>
                  <button
                    onClick={() => handleStart('marathon')}
                    className="p-5 bg-white border border-slate-100 rounded-[2rem] text-left hover:border-indigo-200 transition-all active:scale-[0.96]"
                  >
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-4">
                      <Brain size={20} />
                    </div>
                    <h4 className="font-bold text-sm uppercase mb-1">மாரத்தான்</h4>
                    <p className="text-[10px] text-slate-400 font-medium leading-tight">அனைத்து 30 சவால்கள்</p>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPaperType(null);
                      setScreen('papers_main');
                    }}
                    className="col-span-2 p-6 bg-slate-800 text-white rounded-[2rem] text-left hover:bg-slate-900 transition-all active:scale-[0.98] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg uppercase leading-tight">Full Papers</h4>
                        <p className="text-xs text-slate-400 font-medium">மாதிரி வினாத்தாள்கள் (50 வினாக்கள்)</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="pt-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  பயிற்சியைத் தொடங்க ஒரு பிரிவைத் தேர்ந்தெடுக்கவும்
                </p>
              </div>
            </motion.div>
          )}

          {screen === 'papers_main' && (
            <motion.div
              key="papers_main"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 space-y-8"
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setScreen('home')}
                  className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
                <h1 className="text-2xl font-bold text-slate-800">முழுமையான தாள்கள்</h1>
              </div>

              <div className="grid gap-4">
                <button
                  onClick={() => {
                    setSelectedPaperType('iq');
                    setScreen('papers_list');
                  }}
                  className="w-full bg-white border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between hover:border-indigo-200 transition-all shadow-sm group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                      <Brain size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-slate-800">IQ (தர்க்க அறிவு)</h3>
                      <p className="text-xs text-slate-400 font-medium tracking-tight">50 வினாக்கள் கொண்ட தாள்கள்</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
                </button>

                <button
                  onClick={() => {
                    setSelectedPaperType('gk');
                    setScreen('papers_list');
                  }}
                  className="w-full bg-white border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between hover:border-indigo-200 transition-all shadow-sm group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <Globe size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-slate-800">General Knowledge</h3>
                      <p className="text-xs text-slate-400 font-medium tracking-tight">50 வினாக்கள் கொண்ட தாள்கள்</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
                </button>
              </div>
            </motion.div>
          )}

          {screen === 'papers_list' && selectedPaperType && (
            <motion.div
              key="papers_list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 space-y-6"
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setScreen('papers_main')}
                  className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <ChevronRight size={20} className="rotate-180" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">
                    {selectedPaperType === 'iq' ? 'IQ வினாத்தாள்கள்' : 'GK வினாத்தாள்கள்'}
                  </h1>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">மாதிரித் தாள்கள்</p>
                </div>
              </div>

              <div className="grid gap-4">
                {((papersData as any)[selectedPaperType] as Paper[]).map((paper) => (
                  <button
                    key={paper.id}
                    onClick={() => handleStartPaper(paper)}
                    className="w-full bg-white border border-slate-100 p-5 rounded-3xl text-left hover:border-indigo-200 hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-slate-800">{paper.title}</h3>
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg uppercase">50 வினாக்கள்</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{paper.description}</p>
                    <div className="mt-4 flex items-center text-indigo-600 text-[10px] font-bold uppercase tracking-wider gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      தொடங்குக <ChevronRight size={10} />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {screen === 'quiz' && engine.currentQuestion && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <QuizCard
                question={engine.currentQuestion}
                currentIndex={engine.currentQuestionIndex}
                totalQuestions={engine.quizQuestions.length}
                remainingSeconds={timer.remainingSeconds}
                onSelectOption={handleSelectOption}
                selectedOptionId={selectedOptionId}
                onCancel={() => setScreen('home')}
                onComplete={() => engine.completeQuiz()}
              />
            </motion.div>
          )}

          {screen === 'results' && engine.results && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <Results
                results={engine.results}
                questions={engine.attendedQuestions.length > 0 ? engine.attendedQuestions : engine.quizQuestions}
                selectedAnswers={engine.selectedAnswers}
                onRestart={handleRestart}
                onHome={() => setScreen('home')}
                onReview={() => setScreen('review')}
              />
            </motion.div>
          )}

          {screen === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <ReviewScreen 
                questions={engine.attendedQuestions.length > 0 ? engine.attendedQuestions : engine.quizQuestions}
                selectedAnswers={engine.selectedAnswers}
                onBack={() => setScreen('results')}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <InstallPrompt />
      </div>
    </div>
  );
}
