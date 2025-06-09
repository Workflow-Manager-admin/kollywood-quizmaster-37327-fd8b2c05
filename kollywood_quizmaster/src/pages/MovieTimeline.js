import React, { useEffect, useState } from "react";
import { fetchPopularTamilMovies } from "../tmdbApi";
import { useQuiz } from "../context/QuizContext";
import "../styles/MovieTimeline.css";
import { useNavigate } from "react-router-dom";

// Util: insert item into array at new index
function arrayMove(arr, from, to) {
  const temp = arr.slice();
  const val = temp.splice(from, 1)[0];
  temp.splice(to, 0, val);
  return temp;
}

// PUBLIC_INTERFACE
export default function MovieTimeline() {
  const [movies, setMovies] = useState([]);
  const [dragIdx, setDragIdx] = useState(null);
  const [checked, setChecked] = useState(false);

  const { finishQuiz, resetQuiz } = useQuiz();

  useEffect(() => {
    async function getMovies() {
      resetQuiz();
      const res = await fetchPopularTamilMovies(1);
      let picked = (res.results || [])
        .filter(m => m.release_date)
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
      setMovies(picked);
    }
    getMovies();
  }, [resetQuiz]);

  function onDragStart(idx) {
    setDragIdx(idx);
  }
  function onDrop(idx) {
    if (dragIdx !== null) {
      setMovies(old => arrayMove(old, dragIdx, idx));
      setDragIdx(null);
    }
  }
  function allowDrop(e) {
    e.preventDefault();
  }
  function checkAnswer() {
    setChecked(true);
    const isCorrect = movies.every((item, i, arr) =>
      i === 0 || new Date(arr[i - 1].release_date) <= new Date(item.release_date)
    );
    finishQuiz(isCorrect ? 5 : 0, { ordered: isCorrect });
  }

  const navigate = useNavigate();
  function handleBack() {
    navigate("/");
  }

  return (
    <div className="timeline-game">
      <div className="quiz-title">Movie Timeline Challenge</div>
      <button className="btn btn-skip" style={{marginBottom: 10}} onClick={handleBack}>Back</button>
      <div className="timeline-list">
        {movies.map((movie, idx) => (
          <div
            key={movie.id}
            draggable
            onDragStart={() => onDragStart(idx)}
            onDrop={() => onDrop(idx)}
            onDragOver={allowDrop}
            className="timeline-item"
            tabIndex={0}
            aria-grabbed={dragIdx === idx}
          >
            <div>{movie.title}</div>
            <div className="timeline-date">
              {checked ? movie.release_date : "????"}
            </div>
          </div>
        ))}
      </div>
      <div className="game-controls">
        <button className="btn btn-large" onClick={checkAnswer} disabled={checked}>Check Order</button>
        {checked && (
          <a href="/result" className="btn btn-large">See Results</a>
        )}
      </div>
    </div>
  );
}
