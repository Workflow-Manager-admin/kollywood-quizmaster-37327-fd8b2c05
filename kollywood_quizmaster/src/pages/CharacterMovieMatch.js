import React, { useEffect, useState } from "react";
import { fetchPopularTamilMovies } from "../tmdbApi";
import { useQuiz } from "../context/QuizContext";
import "../styles/CharacterMovieMatch.css";

// Fake character data for demo (could fetch actor names from TMDb for real app)
const characters = [
  { name: "Chitti", movie: "Enthiran" },
  { name: "Anniyan", movie: "Anniyan" },
  { name: "Bhavani", movie: "Master" },
  { name: "Aaranya Kaandam Sappai", movie: "Aaranya Kaandam" },
  { name: "Vikram", movie: "Vikram" },
  { name: "Vasool Raja", movie: "Vasool Raja MBBS" },
  { name: "Subramani", movie: "16 Vayathinile" },
];

// Helper to shuffle array
function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// PUBLIC_INTERFACE
export default function CharacterMovieMatch() {
  const [pairs, setPairs] = useState([]);
  const [dropTargets, setDropTargets] = useState([]);
  const [dragValue, setDragValue] = useState(null);
  const [matches, setMatches] = useState({});
  const [isDone, setIsDone] = useState(false);

  const { finishQuiz, resetQuiz } = useQuiz();

  useEffect(() => {
    // Mix character list and their movies
    setPairs(shuffleArray(characters.slice(0, 5)));
    setDropTargets(shuffleArray(characters.slice(0, 5).map(c => c.movie)));
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

  return (
    <div className="char-match-game">
      <div className="quiz-title">Character-Movie Match</div>
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
