# Kollywood QuizMaster 🎬

A web-based Kollywood Movie Quiz App with multiple challenging and fun quiz modes. Built with React.  
**Mobile friendly, vibrant, Kollywood-themed UI.**

## Features

- **Mocked User Login**
- All-in-one dashboard with 6 game modes:
  - Blurred Poster Guess
  - Character-Movie Match (Drag & Drop)
  - Movie Bingo
  - Movie Timeline Challenge (Reordering)
  - Spin the Wheel (Actor/Year)
  - Cast Combo (guess by cast/bonus mode)
- Clues, hints, results view
- TMDb API integration for fresh Kollywood movie data
- Responsive and modern design

## Setup

1. **Clone this repo, then:**

2. **Install dependencies:**
   ```sh
   cd kollywood_quizmaster
   npm install
   ```

3. **Set up your TMDb API Key:**
   - Copy `.env.example` to `.env`
   - Add your [TMDb API key](https://www.themoviedb.org/settings/api)  
   Example:
   ```
   REACT_APP_TMDB_API_KEY=your_tmdb_key
   ```

4. **Run Locally:**
   ```sh
   npm start
   ```
   App will be at [http://localhost:3000](http://localhost:3000)

## Folder Structure

- `src/components` — shared React components (Navbar, etc.)
- `src/pages` — main app pages / quiz game screens
- `src/context` — React contexts for Auth and Quiz state
- `src/styles` — CSS modules/theme styles
- `src/tmdbApi.js` — TMDb API utilities

## Notes

- No backend is required—user login is mocked, and progress is kept locally.
- API errors/slow network are handled with feedback.
- TMDb attribution: This product uses the TMDb API but is not endorsed or certified by TMDb.
- For bug reports & improvements, [open an issue](#).

Enjoy, and test your Kollywood knowledge!