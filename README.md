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
   - Obtain a [TMDb API Key](https://www.themoviedb.org/settings/api).
   - Copy `.env.example` to `.env`:
     ```sh
     cp .env.example .env
     ```
   - Open `.env` in a text editor and set your key:

     ```
     REACT_APP_TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
     ```

     *(Do not use 'CHANGEME'. Never share your real API key in public repos!)*

   - **Important:** If you change or create a `.env` file, stop and restart your development server (`npm start`) to ensure React can load the new environment variable.

   - See `.env.example` for instructions. If no key is found, the app will log a clear error in your browser console.

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