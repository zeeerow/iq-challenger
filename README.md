<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/f353b65c-51fe-4a93-94d8-e84e86e9686d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Project Evolution & Modifications log

The 다음과 같은 modifications were made to the original `iq-challenger` repository to enhance its features and content:

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

## 5. Summary of New Features
- **General Knowledge & Edu Reforms**: Two new main categories with 30 questions each.
- **Cancel Button**: Available in all categories, allowing instant submission and review of attended questions.
- **Full Papers**: New model papers section with 50-question sets for IQ and General Knowledge.
