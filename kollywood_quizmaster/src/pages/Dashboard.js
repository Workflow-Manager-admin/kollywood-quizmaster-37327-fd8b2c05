import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

// PUBLIC_INTERFACE
export default function Dashboard() {
  const navigate = useNavigate();

  const quizModes = [
    {
      route: "/poster-guess",
      name: "Blurred Poster Guess",
      desc: "Guess the movie from a blurred Kollywood poster & clues.",
      color: "#ff00c8",
      emoji: "🖼️",
    },
    {
      route: "/character-match",
      name: "Character-Movie Match",
      desc: "Match iconic Kollywood characters to their movies (drag/drop).",
      color: "#3DE70D",
      emoji: "👥",
    },
    {
      route: "/movie-bingo",
      name: "Movie Bingo",
      desc: "Pick movies that fit unique Kollywood categories.",
      color: "#00D0FF",
      emoji: "🔢",
    },
    {
      route: "/timeline",
      name: "Movie Timeline Challenge",
      desc: "Arrange Kollywood hits in correct release order.",
      color: "#FFD600",
      emoji: "🗓️",
    },
    {
      route: "/spin-wheel",
      name: "Spin the Wheel",
      desc: "Spin for actor/actress/year, then guess the movie!",
      color: "#E87A41",
      emoji: "🎡",
    },
    {
      route: "/cast-combo",
      name: "Cast Combo",
      desc: "Guess the movie from actor/actress combos; try bonus round.",
      color: "#4325FF",
      emoji: "👑",
    },
  ];

  return (
    <div className="dashboard-main">
      <div className="dashboard-title">Kollywood QuizMaster Dashboard</div>
      <div className="dashboard-desc">
        Play challenging and fun quizzes based on Kollywood cinema!
      </div>
      <div className="dashboard-grid">
        {quizModes.map(mode => (
          <div
            className="quiz-mode-card"
            key={mode.route}
            style={{ borderLeft: `8px solid ${mode.color}` }}
            tabIndex={0}
            onClick={() => navigate(mode.route)}
            onKeyPress={e => { if (e.key === "Enter") navigate(mode.route); }}
          >
            <div className="quiz-mode-emoji" style={{ background: mode.color + "22" }}>
              {mode.emoji}
            </div>
            <div>
              <div className="quiz-mode-title">{mode.name}</div>
              <div className="quiz-mode-desc">{mode.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-footer">
        <span className="footer-note">Powered by TMDb • Kollywood ❤️</span>
      </div>
    </div>
  );
}
