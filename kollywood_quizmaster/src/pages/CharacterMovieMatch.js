import React, { useEffect, useState } from "react";
import { useQuiz } from "../context/QuizContext";
import "../styles/CharacterMovieMatch.css";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";

// Harder: Less iconic character/movie combos
const charactersHard = [
  { name: "Parthasarathy", movie: "Naan Sirithal" },
  { name: "Jeeva", movie: "Ko" },
  { name: "Meera", movie: "Raja Rani" },
  { name: "Sakthi", movie: "Attakathi" },
  { name: "Arivu", movie: "Soorarai Pottru" },
  { name: "Vedan", movie: "Master" },
  { name: "Shakthi", movie: "Aruvi" },
];

// Helper to shuffle array
function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

/**
 * Character-Movie Match using harder pairs (less iconic, more generic names)
 * Shuffles both character order and movie options for subtlety.
 */

// PUBLIC_INTERFACE
export default function CharacterMovieMatch() {
  const [pairs, setPairs] = useState([]);
  const [dropTargets, setDropTargets] = useState([]);
  const [dragValue, setDragValue] = useState(null);
  const [matches, setMatches] = useState({});
  const [isDone, setIsDone] = useState(false);

  const { finishQuiz, resetQuiz } = useQuiz();

  useEffect(() => {
    // Use harder set, randomize slice window for slight unpredictability.
    const start = Math.floor(Math.random() * (charactersHard.length - 4));
    const contestants = shuffleArray(charactersHard.slice(start, start + 5));
    setPairs(contestants);
    setDropTargets(shuffleArray(contestants.map(c => c.movie)));
    setMatches({});
    setIsDone(false);
    resetQuiz();
  }, [resetQuiz]);

  function handleDrop(ev, movie) {
    ev.preventDefault();
    if (dragValue) {
      setMatches((prev) => ({
        ...prev,
        [dragValue]: movie,
      }));
    }
    setDragValue(null);
  }

  function handleDragStart(ev, character) {
    setDragValue(character);
  }

  function handleDragOver(ev) {
    ev.preventDefault();
  }

  function checkResults() {
    setIsDone(true);
    finishQuiz(0, { matches });
  }

  function resetGame() {
    setMatches({});
    setIsDone(false);
    setDropTargets(shuffleArray(dropTargets));
  }

  // No local back handler needed – use BackButton instead

  return (
    <div className="char-match-game">
      <div className="quiz-title">Character-Movie Match</div>
      <BackButton />
      <div className="char-row">
        <div className="char-col">
          <div className="char-list-label">Characters</div>
          {pairs.map((char, i) => (
            <div
              className="char-draggable"
              key={char.name}
              draggable={!isDone}
              onDragStart={e => handleDragStart(e, char.name)}
            >
              {char.name}
            </div>
          ))}
        </div>
        <div className="match-col">
          <div className="char-list-label">Drop into correct Movie</div>
          {dropTargets.map((movie, i) => (
            <div
              key={movie}
              className="movie-droptarget"
              onDrop={e => handleDrop(e, movie)}
              onDragOver={handleDragOver}
            >
              <span className="movie-droptarget-label">{movie}</span>
              <span className="placed-character">
                {Object.keys(matches).find(
                  key => matches[key] === movie
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="game-controls">
        <button className="btn" onClick={checkResults} disabled={isDone}>
          Check Answers
        </button>
        <button className="btn btn-skip" onClick={resetGame}>
          Restart
        </button>
      </div>
      {isDone && (
        <div className="result-summary">
          {pairs.map(char =>
            matches[char.name] === char.movie ? (
              <div key={char.name} className="result-correct">
                ✔️ {char.name} → {char.movie}
              </div>
            ) : (
              <div key={char.name} className="result-incorrect">
                ❌ {char.name} → {matches[char.name] || "<none>"} (Correct: {char.movie})
              </div>
            )
          )}
          <a href="/result" className="btn btn-large">See Results</a>
        </div>
      )}
    </div>
  );
}
