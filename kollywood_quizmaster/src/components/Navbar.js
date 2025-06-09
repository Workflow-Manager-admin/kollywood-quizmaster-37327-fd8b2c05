import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

/**
 * Kollywood QuizMaster Navbar - responsive, shows user, logout, and main nav links.
 */
// PUBLIC_INTERFACE
export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // Hide navbar on login page
  if (location.pathname === "/login") return null;

  return (
    <nav className="navbar-quiz">
      <div className="navbar-container">
        <Link to="/" className="logo-kollywood">
          <span className="logo-kollywood-icon">🎬</span>
          Kollywood QuizMaster
        </Link>
        <div className="navbar-right">
          {user && (
            <span className="navbar-user">Hi, {user.name}</span>
          )}
          <Link to="/" className="nav-link" tabIndex={0}>Dashboard</Link>
          <button className="btn-navbar" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
