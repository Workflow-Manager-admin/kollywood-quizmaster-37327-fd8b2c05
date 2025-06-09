import React, { useEffect, useState } from "react";
import { fetchMovieDetails, fetchPopularTamilMovies } from "../tmdbApi";
import { useQuiz } from "../context/QuizContext";
import "../styles/SpinTheWheel.css";

// Simple mock actor/year pools for demo
const actors = [
  "Rajinikanth", "Vijay", "Kamal Haasan", "Nayanthara", "Trisha",
  "Vikram", "Jyothika", "Dhanush", "Suriya", "Samantha"
];
const years = [1999, 2005, 2010, 2015, 2017, 2019, 2022];

// PUBLIC_INTERFACE
export default function SpinTheWheel() {
  const [spun, setSpun] = useState(false);
  const [actor, setActor] = useState("");
  const [year, setYear] = useState("");
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correctMovie, setCorrectMovie] = useState("");
  const [done, setDone] = useState(false);

  const { finishQuiz, resetQuiz } = useQuiz();

  function spinWheel() {
    setSpun(true);
    setDone(false);
    setFeedback("");
    setGuess("");
    setCorrectMovie("");
    // Pick random for demo
    setActor(actors[Math.floor(Math.random() * actors.length)]);
    setYear(years[Math.floor(Math.random() * years.length)]);
  }

  async function handleGuess(e) {
    e.preventDefault();
    // For demo, accept any guess, reveal a movie
    setFeedback("Answer submitted!");
    setDone(true);
    // Normally verify by searching TMDb for actor/year movies
    setCorrectMovie("Sample Kollywood Blockbuster");
    finishQuiz(1, { actor, year, userGuess: guess });
  }

  useEffect(() => {
    resetQuiz();
    setSpun(false);
  }, [resetQuiz]);

  return (
    <div className="spin-wheel-game">
      <div className="quiz-title">Spin the Wheel</div>
      {!spun ? (
        <button className="btn btn-large" onClick={spinWheel}>
          Spin!
        </button>
      ) : (
        <div className="wheel-result">
          <div className="wheel-row">
            <span className="wheel-label">Actor/Actress:</span>
            <span className="wheel-value">{actor}</span>
          </div>
          <div className="wheel-row">
            <span className="wheel-label">Year:</span>
            <span className="wheel-value">{year}</span>
          </div>
          <form className="wheel-form" onSubmit={handleGuess}>
            <input
              className="input"
              type="text"
              placeholder="Guess a movie starring them in that year"
              value={guess}
              onChange={e => setGuess(e.target.value)}
              disabled={done}
            />
            <button className="btn" type="submit" disabled={done}>Submit</button>
          </form>
          {feedback && <div className="wheel-feedback">{feedback}</div>}
          {done && <div className="correct-movie">
            Correct answer: <strong>{correctMovie}</strong>
            <br/>
            <a href="/result" className="btn btn-large">See Results</a>
          </div>}
        </div>
      )}
    </div>
  );
}
