import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Reusable BackButton for quiz and result pages.
 * Navigates to previous page or fallback (default "/") when clicked.
 *
 * @param {Object} props
 * @param {string} [props.fallback="/"] - Optional fallback path when no history.
 * @param {string} [props.className] - Optional CSS class name(s) for styling.
 * @param {React.ReactNode} [props.children] - Optional children to override default label.
 * @param {Object} [props.style] - Optional style object.
 */
// PUBLIC_INTERFACE
export default function BackButton({ fallback = "/", className = "", children, style }) {
  const navigate = useNavigate();

  function handleBack() {
    // Try to go back if possible, otherwise push fallback
    if (window.history && window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  }

  return (
    <button
      className={`btn btn-skip back-btn ${className}`}
      style={{ marginBottom: 10, ...style }}
      type="button"
      aria-label="Back"
      onClick={handleBack}
    >
      {children || "← Back"}
    </button>
  );
}
