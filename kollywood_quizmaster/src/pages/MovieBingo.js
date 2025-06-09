import React, { useEffect, useState } from "react";
import { fetchPopularTamilMovies } from "../tmdbApi";
import { useQuiz } from "../context/QuizContext";
import "../styles/MovieBingo.css";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";

// Demo categories for bingo
const bingoCategories = [
  "Superstar Rajini Movie",
  "Romance",
  "Comedy Hit",
  "Musical",
  "Villain Focused",
  "Vijay Movie",
  "Award Winner",
  "Family Drama",
  "Blockbuster"
];

// PUBLIC_INTERFACE
export default function MovieBingo() {
  const [movies, setMovies] = useState([]);
  const [selected, setSelected] = useState([]);
  const [categories, setCategories] = useState([]);
  const [apiError, setApiError] = useState("");
  const [complete, setComplete] = useState(false);

  const { finishQuiz, resetQuiz } = useQuiz();

  useEffect(() => {
    async function getBingo() {
      try {
        setApiError("");
        setComplete(false);
        resetQuiz();
        const res = await fetchPopularTamilMovies(1);
        setMovies(res.results?.slice(0, 9) || []);
        setCategories([...bingoCategories].sort(() => 0.5 - Math.random()).slice(0, 9));
        setSelected([]);
      } catch (e) {
        setApiError(e.message || "API error");
      }
    }
    getBingo();
  }, [resetQuiz]);

  function handleBoxClick(idx) {
    if (selected.includes(idx)) {
      setSelected(selected.filter(i => i !== idx));
    } else {
      setSelected([...selected, idx]);
    }
  }

  function finishBingo() {
    setComplete(true);
    finishQuiz(selected.length, { selected });
  }

  // No local back handler needed, using BackButton

  return (
    <div className="movie-bingo-game">
      <div className="quiz-title">Movie Bingo</div>
      <BackButton />
      <div className="bingo-grid">
        {movies.map((movie, idx) => (
          <div
            key={movie.id}
            className={"bingo-box" + (selected.includes(idx) ? " bingo-selected" : "")}
            tabIndex={0}
            onClick={() => handleBoxClick(idx)}
            onKeyPress={e => { if (e.key === "Enter") handleBoxClick(idx); }}
          >
            <div className="bingo-movie-title">{movie.title}</div>
            <div className="bingo-cat">{categories[idx]}</div>
          </div>
        ))}
      </div>
      <div className="game-controls">
        <span>{selected.length} boxes selected</span>
        <button className="btn btn-large" onClick={finishBingo}>Finish!</button>
      </div>
      {apiError && <div className="api-error">{apiError}</div>}
      {complete && (
        <div className="game-complete">
          <div>✅ Bingo Complete!</div>
          <a href="/result" className="btn btn-large">See Results</a>
        </div>
      )}
    </div>
  );
}
