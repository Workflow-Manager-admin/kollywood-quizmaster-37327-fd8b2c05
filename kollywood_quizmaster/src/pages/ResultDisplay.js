import React from "react";
import { useQuiz } from "../context/QuizContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/ResultDisplay.css";
import BackButton from "../components/BackButton";

// PUBLIC_INTERFACE
export default function ResultDisplay() {
  const { result, resetQuiz } = useQuiz();
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleBackToDashboard() {
    resetQuiz();
    navigate("/");
  }

  if (!result) {
    return (
      <div className="result-display">
        <div>No results to show. Please play a game first!</div>
        <BackButton onClick={handleBackToDashboard} />
      </div>
    );
  }

  return (
    <div className="result-display">
      <h1>Results</h1>
      <div className="result-user">Player: <b>{user?.name || "Unknown"}</b></div>
      <div className="result-score">Your Score: <span>{result.score}</span></div>
      {result.details?.ordered !== undefined && (
        <div>
          Timeline order: <b>{result.details.ordered ? "Correct!" : "Incorrect."}</b>
        </div>
      )}
      {result.details?.matches && (
        <div>
          <h3>Match Results:</h3>
          {Object.entries(result.details.matches).map(([char, movie]) => (
            <div key={char}>{char} → {movie}</div>
          ))}
        </div>
      )}
      <BackButton onClick={handleBackToDashboard} />
    </div>
  );  
}
