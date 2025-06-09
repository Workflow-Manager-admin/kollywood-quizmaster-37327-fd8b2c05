import React, { useEffect, useState } from "react";
import { fetchPopularTamilMovies } from "../tmdbApi";
import { useQuiz } from "../context/QuizContext";
import "../styles/PosterGuess.css";

// Utility to blur poster and give basic clues (mock for demo)
function getClues(movie) {
  const clues = [];
  if (movie && movie.title) {
    clues.push("First letter: " + movie.title[0]);
    if (movie.release_date) {
      clues.push("Released in: " + movie.release_date.slice(0, 4));
    }
    if (movie.overview) clues.push("Plot: " + movie.overview.split(" ").slice(0, 7).join(" ") + "...");
  }
  return clues;
}

// PUBLIC_INTERFACE
export default function PosterGuess() {
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const { finishQuiz, resetQuiz } = useQuiz();

  useEffect(() => {
    async function getMovies() {
      setLoading(true);
      setApiError("");
      try {
        const res = await fetchPopularTamilMovies(1);
        // Shuffle and pick 10
        const movies = [...(res.results || [])].sort(() => 0.5 - Math.random()).slice(0, 10);
        setQuestions(movies);
      } catch (e) {
        setApiError(e.message || "Error fetching movies.");
      }
      setLoading(false);
    }
    getMovies();
    resetQuiz();
  }, [resetQuiz]);

  function handleGuess(e) {
    e.preventDefault();
    if (!userInput.trim()) return;
    const isCorrect = userInput.trim().toLowerCase() === questions[qIndex]?.title?.toLowerCase();
    setFeedback(isCorrect ? "🎉 Correct!" : "❌ Incorrect!");
    setShowAnswer(isCorrect ? false : true);
    setTimeout(() => {
      setFeedback("");
      setShowAnswer(false);
      setUserInput("");
      if (qIndex < questions.length - 1) setQIndex(i => i + 1);
      else {
        finishQuiz(0, { message: "You've finished the game!" });
      }
    }, 1100);
  }

  function handleSkip() {
    setFeedback("");
    setUserInput("");
    setShowAnswer(true);
    setTimeout(() => {
      setShowAnswer(false);
      if (qIndex < questions.length - 1) setQIndex(i => i + 1);
      else finishQuiz(0, { message: "You've finished the game!" });
    }, 1200);
  }

  if (loading)
    return <div className="game-loading">Loading game...</div>;
  if (apiError)
    return <div className="api-error">Error: {apiError}</div>;
  if (qIndex >= questions.length)
    return (
      <div className="game-complete">
        <div>🎉 All done!</div>
        <a href="/result" className="btn btn-large">See Results</a>
      </div>
    );

  const movie = questions[qIndex];

  return (
    <div className="poster-guess-game">
      <div className="quiz-title">Blurred Poster Guess</div>
      <div className="poster-container">
        {movie?.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt="Blurred Poster"
            className="blurred-poster"
          />
        ) : (
          <div className="no-poster">No Poster</div>
        )}
        <div className="clues-list">
          {getClues(movie).map((clue, i) => (
            <div key={i} className="clue">{clue}</div>
          ))}
        </div>
      </div>
      <form className="guess-form" onSubmit={handleGuess}>
        <input
          className="input guess-input"
          type="text"
          placeholder="Guess the movie title..."
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          autoFocus
        />
        <button className="btn" type="submit">Submit</button>
        <button className="btn btn-skip" type="button" onClick={handleSkip}>Skip</button>
      </form>
      {feedback && <div className="game-feedback">{feedback}</div>}
      {showAnswer && <div className="game-answer">Answer: <strong>{movie?.title}</strong></div>}
      <div className="progress">Question {qIndex + 1} / {questions.length}</div>
    </div>
  );
}
