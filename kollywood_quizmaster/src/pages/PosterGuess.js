import React, { useEffect, useState } from "react";
import { fetchPopularTamilMovies } from "../tmdbApi";
import { useQuiz } from "../context/QuizContext";
import "../styles/PosterGuess.css";
import { useNavigate } from "react-router-dom";

// Harder: Subtle clue generator, with less info, placeholder for auto-clues if overview too revealing
function getHardClues(movie) {
  const clues = [];
  if (!movie) return clues;
  // Only give two clues, both subtle
  if (movie.release_date) {
    const year = movie.release_date.slice(0, 4);
    clues.push("Released in: " + year);
  }
  if (movie.title) {
    // Instead of first letter, give letter count + a random letter
    const visibleChar = movie.title.replace(/[^a-zA-Z]/g, "")[1] || "?";
    clues.push(`Title has ${movie.title.length} letters, 2nd is '${visibleChar.toUpperCase()}'`);
  }
  // If available, give a single generic genre clue (harder if omitted sometimes)
  if (movie.genre_ids && Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0) {
    // Genres are just numbers, so omit detailed info!
    //clues.push("Genre code: " + movie.genre_ids[0]); // deliberately unhelpful
  }
  // Omit plot, as it gives away too much in many cases
  return clues;
}

// Helper to fetch random less-popular movies (by picking from deeper pages, higher page number is less popular)
async function fetchHardPosterQuestions() {
  // Use TMDb discover: page 8-15 for niche/less popular movies
  const randPage = Math.floor(Math.random() * 8) + 8; // pages 8-15
  const res = await fetchPopularTamilMovies(randPage);
  // Shuffle, return 10
  let candidates = (res.results || []).filter(m => m.poster_path && m.title && m.release_date);
  // Avoid blockbusters: skip first 3 most popular on page
  if (candidates.length > 13) candidates = candidates.slice(3, 13);
  return candidates.sort(() => 0.5 - Math.random()).slice(0, 10);
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
  const navigate = useNavigate();

  const { finishQuiz, resetQuiz } = useQuiz();

  useEffect(() => {
    async function getMovies() {
      setLoading(true);
      setApiError("");
      try {
        const movies = await fetchHardPosterQuestions();
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

  function handleBack() {
    navigate("/");
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
        <button className="btn btn-large" onClick={handleBack} style={{marginLeft:"10px"}}>Back</button>
      </div>
    );

  const movie = questions[qIndex];

  return (
    <div className="poster-guess-game">
      <div className="quiz-title">Blurred Poster Guess</div>
      <button className="btn btn-skip" style={{marginBottom: 10}} onClick={handleBack}>Back</button>
      <div className="poster-container">
        {movie?.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt="Blurred Poster"
            className="blurred-poster-hard"
          />
        ) : (
          <div className="no-poster">No Poster</div>
        )}
        <div className="clues-list">
          {getHardClues(movie).map((clue, i) => (
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
