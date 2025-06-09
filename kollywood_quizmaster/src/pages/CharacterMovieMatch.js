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

  // New state for result feedback
  const [resultMsg, setResultMsg] = useState(""); // Shows correct count etc.

  useEffect(() => {
    // Use harder set, randomize slice window for slight unpredictability.
    const start = Math.floor(Math.random() * (charactersHard.length - 4));
    const contestants = shuffleArray(charactersHard.slice(start, start + 5));
    setPairs(contestants);
    setDropTargets(shuffleArray(contestants.map(c => c.movie)));
    setMatches({});
    setIsDone(false);
    setResultMsg("");
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
    // Evaluate number of correct matches and highlight immediately
    let correctCount = 0;
    pairs.forEach(char => {
      if (matches[char.name] === char.movie) correctCount++;
    });
    setIsDone(true);

    // Clear, enthusiastic feedback
    if (correctCount === pairs.length) {
      setResultMsg(`🎉 All correct! You got ${correctCount} / ${pairs.length} matches.`);
    } else if (correctCount > 0) {
      setResultMsg(
        `👍 You got ${correctCount} / ${pairs.length} correct. Wrong matches are highlighted.`
      );
    } else {
      setResultMsg(`❌ No correct matches. Try again or see the correct answers below!`);
    }
    finishQuiz(correctCount, { matches });
  }

  function resetGame() {
    setMatches({});
    setIsDone(false);
    setDropTargets(shuffleArray(dropTargets));
    setResultMsg("");
  }

  // Visual highlight helpers for drop targets after checking answers
  function getDroptargetClass(movie) {
    if (!isDone) return "movie-droptarget";
    const matchedChar = Object.keys(matches).find(key => matches[key] === movie);
    // Find the character that was placed (if any), is it correct?
    if (matchedChar && pairs.find(c => c.name === matchedChar && c.movie === movie)) {
      return "movie-droptarget movie-correct";
    }
    if (matchedChar) {
      return "movie-droptarget movie-wrong";
    }
    return "movie-droptarget";
  }

  function getPlacedCharacterClass(movie) {
    if (!isDone) return "placed-character";
    const matchedChar = Object.keys(matches).find(key => matches[key] === movie);
    if (matchedChar && pairs.find(c => c.name === matchedChar && c.movie === movie)) {
      return "placed-character correct-char";
    }
    if (matchedChar) {
      return "placed-character wrong-char";
    }
    return "placed-character";
  }

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
              style={isDone && (!matches[char.name] ? { opacity: 0.5 } : {})}
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
              className={getDroptargetClass(movie)}
              onDrop={e => handleDrop(e, movie)}
              onDragOver={handleDragOver}
              tabIndex={0}
            >
              <span className="movie-droptarget-label">{movie}</span>
              <span className={getPlacedCharacterClass(movie)}>
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

      {/* Result feedback message */}
      {isDone && (
        <div
          className="game-feedback"
          style={{ fontSize: "1.13em", marginTop: 10 }}
          tabIndex={-1}
          ref={el => {
            // Accessibility: focus result area when shown
            if (isDone && el) {
              el.focus();
              // Also scroll into view on mobile/long pages
              setTimeout(() => {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
              }, 200);
            }
          }}
          aria-live="polite"
        >
          {resultMsg}
        </div>
      )}

      {/* Detailed per-character feedback */}
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
