/**
 * Main App for Kollywood QuizMaster.
 * Handles routing, theming, and providers for auth/user and quiz state.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/Theme.css';
import Navbar from './components/Navbar';
import './styles/BackButton.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PosterGuess from './pages/PosterGuess';
import CharacterMovieMatch from './pages/CharacterMovieMatch';
import MovieBingo from './pages/MovieBingo';
import MovieTimeline from './pages/MovieTimeline';
import SpinTheWheel from './pages/SpinTheWheel';
import CastCombo from './pages/CastCombo';
import ResultDisplay from './pages/ResultDisplay';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QuizProvider } from './context/QuizContext';

// PUBLIC_INTERFACE
function PrivateRoute({ children }) {
  /**
   * Route guard: Only show children if user is logged in, else redirect to login.
   */
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <QuizProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main>
              <Routes>
                <Route path='/login' element={<Login />} />
                <Route
                  path='/'
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path='/poster-guess'
                  element={
                    <PrivateRoute>
                      <PosterGuess />
                    </PrivateRoute>
                  }
                />
                <Route
                  path='/character-match'
                  element={
                    <PrivateRoute>
                      <CharacterMovieMatch />
                    </PrivateRoute>
                  }
                />
                <Route
                  path='/movie-bingo'
                  element={
                    <PrivateRoute>
                      <MovieBingo />
                    </PrivateRoute>
                  }
                />
                <Route
                  path='/timeline'
                  element={
                    <PrivateRoute>
                      <MovieTimeline />
                    </PrivateRoute>
                  }
                />
                <Route
                  path='/spin-wheel'
                  element={
                    <PrivateRoute>
                      <SpinTheWheel />
                    </PrivateRoute>
                  }
                />
                <Route
                  path='/cast-combo'
                  element={
                    <PrivateRoute>
                      <CastCombo />
                    </PrivateRoute>
                  }
                />
                <Route
                  path='/result'
                  element={
                    <PrivateRoute>
                      <ResultDisplay />
                    </PrivateRoute>
                  }
                />
                <Route path='*' element={<Navigate to='/' />} />
              </Routes>
            </main>
          </div>
        </Router>
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;