import React, { useEffect, useState } from "react";
import { fetchPopularTamilMovies, fetchMovieCredits } from "../tmdbApi";
import { useQuiz } from "../context/QuizContext";
import "../styles/PosterGuess.css";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";

/**
 * Get easy and helpful clues for moderately popular movies:
 * - Clue 1: Always actor name
 * - Clue 2: Genre or overview keyword, always informational (never fake/obscure)
 */
function getHelpfulClues(movie) {
  const clues = [];
  if (!movie) return clues;

  // Always: Release year as a small bonus
  if (movie.release_date) {
    const year = movie.release_date.slice(0, 4);
    clues.push("Release year: " + year);
  }

  // Genre clue
  if (Array.isArray(movie.genres) && movie.genres.length > 0) {
    clues.push("Genre: " + movie.genres[0].name);
  } else if (Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0) {
    // Not expanded, fallback to genre id map (Tamil genre id 10402=Music, 28=Action, 10751=Family, 18=Drama, etc.)
    const genreMap = {
      28: "Action", 10749: "Romance", 35: "Comedy", 80: "Crime",
      18: "Drama", 10751: "Family", 27: "Horror", 53: "Thriller", 10402: "Music"
    };
    let g = genreMap[movie.genre_ids[0]];
    if (g) clues.push("Genre: " + g);
  }

  // Overview/plot keyword
  if (movie.overview) {
    // Pick 1-2 keywords or summary words that help, not too obscure
    const words = movie.overview.split(/[ .,!?\n]+/).filter(w => w && w.length > 4 && /^[A-Za-z]/.test(w));
    if (words.length) {
      // pick a random one, but deterministic for same question
      const sel = words[Math.min(words.length - 1, Math.floor(words.length / 3))];
      clues.push("Story keyword: " + sel);
    }
  }

  return clues.slice(0, 1); // Only ONE secondary clue, not to overwhelm
}

/**
 * Fetches moderately popular Tamil movies and also fetches a main actor name (for the first clue) for each movie.
 * Returns array of objects: [{...movie, actorClue: "<actor name or fallback>"}]
 */
async function fetchModeratePosterQuestionsWithActorClues() {
  // Pages 1-2: popular, 3-5: moderate-popular; skip most obscure
  const randPage = Math.floor(Math.random() * 3) + 2; // page 2-4 for moderate
  const res = await fetchPopularTamilMovies(randPage);
  let candidates = (res.results || []).filter(
    m => m.poster_path && m.title && m.release_date
  );
  // Randomly sample just 10 for quiz speed and variety
  candidates = candidates.sort(() => 0.5 - Math.random()).slice(0, 10);

  // For each movie, fetch the main actor (first in cast if available)
  // Run requests in parallel, but throttle if rate limited!
  const withActors = await Promise.all(
    candidates.map(async (movie) => {
      try {
        const credits = await fetchMovieCredits(movie.id);
        let clue;
        if (Array.isArray(credits.cast) && credits.cast.length > 0) {
          // Sort by order, pick first actor with profile
          const sorted = credits.cast.filter(x => !!x.name).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
          clue = sorted[0]?.name || "Actor information not available";
        } else {
          clue = "Actor information not available";
        }
        return { ...movie, actorClue: clue, genres: movie.genres }; // propagate genres if available
      } catch {
        return { ...movie, actorClue: "Actor information not available", genres: movie.genres };
      }
    })
  );
  return withActors;
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
        const movies = await fetchModeratePosterQuestionsWithActorClues();
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

  // BackButton handles the navigation

  if (loading)
    return <div className="game-loading">Loading game...</div>;
  if (apiError)
    return <div className="api-error">Error: {apiError}</div>;
  if (qIndex >= questions.length)
    return (
      <div className="game-complete">
        <div>🎉 All done!</div>
        <a href="/result" className="btn btn-large">See Results</a>
        <BackButton style={{marginLeft: "10px"}} />
      </div>
    );

  const movie = questions[qIndex];

  // Compose clues: actor is always first hint, then a moderately helpful genre or keyword
  const clues = [
    movie?.actorClue ? `Actor: ${movie.actorClue}` : "Actor information not available",
    ...getHelpfulClues(movie)
  ].slice(0, 2); // Only actor + 1 additional clue

  return (
    <div className="poster-guess-game">
      <div className="quiz-title">Blurred Poster Guess</div>
      <BackButton />
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
          {clues.map((clue, i) => (
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
