import React, { createContext, useContext, useState } from "react";

// PUBLIC_INTERFACE
const QuizContext = createContext();

/**
 * QuizProvider: Manages state for current quiz session, game data, and results.
 */
export function QuizProvider({ children }) {
  const [session, setSession] = useState(null); // {mode, questions, currentQ, answers...}
  const [result, setResult] = useState(null);

  function startQuiz(mode, questions) {
    setSession({
      mode,
      questions,
      answers: [],
      current: 0,
    });
    setResult(null);
  }

  function recordAnswer(answer) {
    setSession((prev) => ({
      ...prev,
      answers: [...prev.answers, answer],
      current: prev.current + 1,
    }));
  }

  function finishQuiz(score, details) {
    setResult({ score, details });
  }

  function resetQuiz() {
    setSession(null);
    setResult(null);
  }

  return (
    <QuizContext.Provider value={{
      session, setSession, result, setResult,
      startQuiz, recordAnswer, finishQuiz, resetQuiz
    }}>
      {children}
    </QuizContext.Provider>
  );
}

/**
 * Hook to access quiz context.
 */
// PUBLIC_INTERFACE
export function useQuiz() {
  return useContext(QuizContext);
}
