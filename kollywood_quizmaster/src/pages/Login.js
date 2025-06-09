import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

// PUBLIC_INTERFACE
export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username to login.");
      return;
    }
    login(username.trim());
    navigate("/");
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>🎬 Kollywood QuizMaster</h1>
        <p className="login-desc">Sign in to play Kollywood quizzes</p>
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            placeholder="Enter your name..."
            value={username}
            onChange={e => { setUsername(e.target.value); setError(""); }}
            autoFocus
          />
          {error && <div className="form-error">{error}</div>}
          <button className="btn btn-large" type="submit">Login</button>
        </form>
        <div className="login-footer">
          <span>Hint: Auth is mocked, just enter any name!</span>
        </div>
      </div>
    </div>
  );
}
