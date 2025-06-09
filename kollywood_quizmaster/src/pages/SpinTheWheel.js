import React, { useEffect, useState } from "react";
import { fetchMovieDetails, fetchPopularTamilMovies } from "../tmdbApi";
import { useQuiz } from "../context/QuizContext";
import "../styles/SpinTheWheel.css";
import { useNavigate } from "react-router-dom";

// Harder actor/year pools: more niche
const actors = [
  "Pasupathy", "Aishwarya Rajesh", "Parthiban", "Samuthirakani", "Ramya Krishnan",
  "Radharavi", "Yogi Babu", "Shamna Kasim", "Nasser", "Reema Sen"
];
const years = [2003, 2007, 2011, 2014, 2016, 2018, 2021];

export default function SpinTheWheel() {
  const [spun, setSpun] = useState(false);
  const [actor, setActor] = useState("");
  const [year, setYear] = useState("");
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correctMovie, setCorrectMovie] = useState("");
  const [done, setDone] = useState(false);

  const navigate = useNavigate();
  const { finishQuiz, resetQuiz } = useQuiz();

  function spinWheel() {
    setSpun(true);
    setDone(false);
    setFeedback("");
    setGuess("");
    setCorrectMovie("");
    // Pick random, more niche for demo
    setActor(actors[Math.floor(Math.random() * actors.length)]);
    setYear(years[Math.floor(Math.random() * years.length)]);
  }

  async function handleGuess(e) {
    e.preventDefault();
    setFeedback("Answer submitted!");
    setDone(true);
    // Would normally check TMDb here
    setCorrectMovie("We'll reveal the movie after quiz!");
    finishQuiz(1, { actor, year, userGuess: guess });
  }

  useEffect(() => {
    resetQuiz();
    setSpun(false);
  }, [resetQuiz]);

  function handleBack() {
    navigate("/");
  }

  return (
    <div className="spin-wheel-game">
      <div className="quiz-title">Spin the Wheel</div>
      <button className="btn btn-skip" style={{marginBottom: 10}} onClick={handleBack}>Back</button>
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
            <button className="btn btn-skip" style={{marginLeft:"10px"}} onClick={handleBack}>Back</button>
          </div>}
        </div>
      )}
    </div>
  );
}
