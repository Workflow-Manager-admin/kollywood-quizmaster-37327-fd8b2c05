import React, { useEffect, useState } from 'react';
import './App.css';
import { fetchPopularTamilMovies, TMDB_IMAGE_BASE_URL } from './tmdbApi';

function App() {
  const [kollywoodMovies, setKollywoodMovies] = useState([]);
  const [apiError, setApiError] = useState(null);

  // Example API call to fetch Kollywood movies on mount
  useEffect(() => {
    async function loadMovies() {
      try {
        const data = await fetchPopularTamilMovies();
        setKollywoodMovies(data.results || []);
      } catch (err) {
        setApiError(err.message);
      }
    }
    loadMovies();
  }, []);

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> KAVIA AI
            </div>
            <button className="btn">Template Button</button>
          </div>
        </div>
      </nav>

      <main>
        <div className="container">
          <div className="hero">
            <div className="subtitle">AI Workflow Manager Template</div>
            <h1 className="title">kollywood_quizmaster</h1>

            <div className="description">
              Start building your application.
            </div>
            <button className="btn btn-large">Button</button>
          </div>

          {/* Example: Show fetched Kollywood movies from TMDb */}
          <div style={{ marginTop: 40 }}>
            <h2>Popular Kollywood Movies</h2>
            {apiError && (
              <div style={{ color: 'red', margin: '12px 0' }}>
                Error: {apiError}
              </div>
            )}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: 24,
                marginTop: 16,
                marginBottom: 24
              }}
            >
              {kollywoodMovies.map((movie) => (
                <div key={movie.id} style={{
                  background: '#23232b',
                  padding: 12,
                  borderRadius: 8,
                  textAlign: 'center',
                  color: '#fff'
                }}>
                  {movie.poster_path ? (
                    <img
                      src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
                      alt={movie.title}
                      style={{ width: '100%', borderRadius: 6, marginBottom: 8 }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: 220,
                      background: '#222',
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ccc'
                    }}>No Image</div>
                  )}
                  <div style={{ fontWeight: 500, marginBottom: 4 }}>
                    {movie.title}
                  </div>
                  <div style={{ color: '#aaa', fontSize: 13 }}>
                    {movie.release_date}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, color: '#aaa' }}>
              Data from The Movie Database (TMDb)
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;