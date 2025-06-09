import React, { useEffect, useState } from "react";
import { useQuiz } from "../context/QuizContext";
import "../styles/CastCombo.css";
import { useNavigate } from "react-router-dom";

// Demo questions (would need TMDb for perfect accuracy, but kept realistic)
const quizData = [
  {
    actors: ["Rajinikanth", "Nayanthara", "Anirudh Ravichander"],
    movie: "Darbar",
    type: "normal"
  },
  {
    actors: ["Vijay", "Samantha", "Sathyaraj"],
    movie: "Mersal",
    type: "normal"
  },
  {
    actors: ["Kamal Haasan", "Vijay Sethupathi", "Fahadh Faasil"],
    movie: "Vikram",
    type: "normal"
  },
  {
    actors: ["Suriya", "Jyothika", "Karthi", "Vijay"],
    movie: "Suriya, Jyothika, Karthi are related, Vijay is odd-one!",
    type: "bonus",
    odd: "Vijay"
  },
  {
    actors: ["Dhanush", "Sneha", "Prakash Raj"],
    movie: "Pudhu Pettai",
    type: "normal"
  }
];

// PUBLIC_INTERFACE
export default function CastCombo() {
  const [qIndex, setQIndex] = useState(0);
  const [userGuess, setUserGuess] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  const { finishQuiz, resetQuiz } = useQuiz();

  useEffect(() => {
    resetQuiz();
    setQIndex(0);
    setScore(0);
    setFeedback("");
    setShowAnswer(false);
    setUserGuess("");
  }, [resetQuiz]);

  const curr = quizData[qIndex];

  function handleSubmit(e) {
    e.preventDefault();
    let correct = false;
    if (curr.type === "bonus") {
      correct = userGuess.trim().toLowerCase() === (curr.odd || "").toLowerCase();
    } else {
      correct = userGuess.trim().toLowerCase() === (curr.movie || "").toLowerCase();
    }
    setFeedback(correct ? "🎉 Correct!" : "❌ Wrong!");
    if (correct) setScore(s => s + 1);
    setShowAnswer(true);
    setTimeout(() => {
      setFeedback("");
      setShowAnswer(false);
      setUserGuess("");
      if (qIndex < quizData.length - 1) setQIndex(i => i + 1);
      else finishQuiz(score + (correct ? 1 : 0), {});
    }, 1200);
  }

  const navigate = useNavigate();

  if (qIndex >= quizData.length) {
    return (
      <div className="game-complete">
        <div>Game Complete!</div>
        <a href="/result" className="btn btn-large">See Results</a>
        <button className="btn btn-skip" style={{marginLeft:"10px"}} onClick={() => navigate("/")}>Back</button>
      </div>
    );
  }

  return (
    <div className="cast-combo-game">
      <div className="quiz-title">Cast Combo</div>
      <button className="btn btn-skip" style={{marginBottom: 10}} onClick={() => navigate("/")}>Back</button>
      <div className="cc-actors">
        {curr.actors.map(a => (
          <span key={a} className="cc-actor">{a}</span>
        ))}
      </div>
      <div className="cc-instruction">
        {curr.type === "bonus"
          ? "Bonus: Who is NOT part of the same movie/relation as the others?"
          : "Guess the Kollywood movie featuring all the above actors:"}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder={curr.type === "bonus" ? "Type actor's name": "Type movie title"}
          value={userGuess}
          onChange={e => setUserGuess(e.target.value)}
          autoFocus
        />
        <button className="btn" type="submit">Submit</button>
      </form>
      {feedback && <div className="game-feedback">{feedback}</div>}
      {showAnswer && (
        <div className="game-answer">
          {curr.type === "bonus" 
            ? `Answer: ${curr.odd}` 
            : `Movie: ${curr.movie}`}
        </div>
      )}
      <div className="progress">Q{qIndex + 1} / {quizData.length}</div>
    </div>
  );
}
