# Detailed Code Changes Diff

## 1. Core Logic Updates (`src/hooks/useQuizEngine.ts`)
```diff
+  const cancelQuiz = () => {
+    setState(prev => ({
+      ...prev,
+      isFinished: true,
+      endTime: Date.now()
+    }));
+  };

   return {
     ...state,
     currentQuestion,
     startQuiz,
     submitAnswer,
     restartQuiz,
+    cancelQuiz
   };
```

## 2. Type System Enhancements (`src/types.ts`)
```diff
 export type Category = 
   | 'logical_reasoning' 
   | 'number_series' 
   | 'spatial_reasoning' 
   | 'verbal_reasoning' 
   | 'pattern_recognition'
   | 'marathon'
+  | 'general_knowledge'
+  | 'edu_reforms'
+  | 'iq_paper'
+  | 'gk_paper';

+export interface Paper {
+  id: string;
+  title: string;
+  description: string;
+  totalQuestions: number;
+  questions: Question[];
+}
+
+export interface PapersData {
+  iq: Paper[];
+  gk: Paper[];
+}
```

## 3. UI and Navigation (`src/App.tsx`)
```diff
+type Screen = 'home' | 'quiz' | 'results' | 'review' | 'papers_main' | 'papers_list';

+  const handleCancelQuiz = (submit: boolean) => {
+    setShowCancelConfirm(false);
+    if (submit) {
+      engine.cancelQuiz();
+      setScreen('results');
+    } else {
+      setScreen('home');
+    }
+    timer.stop();
+  };
```

## 4. Data Integration
- Created `src/data/papers.json` with 50-question model papers.
- Expanded `src/data/questions.json` with 90+ new questions across IQ, GK, and Edu Reforms.

## 5. README Integration
- Appended this change log to the main project README.
