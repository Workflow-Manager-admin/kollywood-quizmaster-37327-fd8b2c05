import React, { useEffect, useState } from "react";
import { fetchObscureTamilMovies } from "../tmdbApi";
import { useQuiz } from "../context/QuizContext";
import "../styles/PosterGuess.css";
import { useNavigate } from "react-router-dom";

/**
 * Generate more subtle/harder clues about the movie:
 * - Only year, length of title (not count all letters), one or two random inner letters, sometimes production co or runtime if available.
 * - Omit plot and genre completely.
 * - Occasionally obfuscate with a deliberately vague clue.
 */
function getHardClues(movie) {
  const clues = [];
  if (!movie) return clues;

  // Always: year
  if (movie.release_date) {
    const year = movie.release_date.slice(0, 4);
    clues.push("Released in: " + year);
  }
  // Give title letter count (no spaces) and a random letter (not first or last)
  if (movie.title) {
    const rawTitle = movie.title.replace(/[^a-zA-Z]/g, "");
    const len = rawTitle.length;
    // random mid-letter, exclude index 0 or last
    let randomIdx = 1 + Math.floor(Math.random() * Math.max(1, len - 2));
    if (len <= 2) randomIdx = 1;
    let clueLetter = rawTitle[randomIdx] || "?";
    // Use only when len > 2
    if (len > 2) {
      clues.push(`Title has ${len} letters; letter ${randomIdx + 1} is '${clueLetter.toUpperCase()}'`);
    } else if (len > 0) {
      clues.push(`Short title (${len} letters)`);
    }
  }
  // Extra subtle: Sometimes give production company name, if present
  if (movie.production_companies && movie.production_companies.length > 0) {
    // Reveal only the LAST word of first company (which is usually most generic)
    const pc = movie.production_companies[0].name.split(" ");
    clues.push("Production " + pc[pc.length - 1]);
  }
  // Rarely: runtime
  if (movie.runtime && Math.random() < 0.4) {
    clues.push("Runtime: about " + (movie.runtime > 95 ? "over 1.5 hrs" : "under 2 hrs"));
  }
  // With low chance add a fake out generic clue
  if (Math.random() < 0.3) {
    clues.push("Title starts with: '" + (movie.title ? movie.title[0].toUpperCase() : "?") + "'");
  }
  // No genre/overview clues
  return clues;
}

// Fetches "hard" (obscure) poster questions via TMDB discover, random mid/late page for maximal obscurity.
// Also, optionally mixes the results.
async function fetchHardPosterQuestions() {
  // Choose a random high page (TMDb supports ~page 20-25, but often sparse)
  const randPage = Math.floor(Math.random() * 8) + 12; // pages 12-19 = more obscure
  const res = await fetchObscureTamilMovies(randPage);
  let candidates = (res.results || []).filter(
    m => m.poster_path && m.title && m.release_date
  );
  // For each, try to fetch extra details for even harder/real clues
  // But for speed, sample just 10
  candidates = candidates.sort(() => 0.5 - Math.random()).slice(0, 10);
  return candidates;
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
