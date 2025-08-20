import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import RecipeList from './pages/RecipeList';
import RecipeDetailPage from './pages/RecipeDetailPage';
import AddRecipe from './pages/AddRecipe';
import Header from './components/Header';

// Simple in-memory auth stub for demonstration purposes
const authStorageKey = 'demo_auth_email';

// PUBLIC_INTERFACE
function App() {
  /**
   * Root App: manages theme and a minimal auth state stub.
   * Routes:
   *  - /: recipe list with search
   *  - /recipes/:id: recipe detail page
   *  - /add: add new recipe form (protected)
   *  - /signin, /signup, /forgot
   */
  const [theme, setTheme] = useState('light');
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem(authStorageKey) || '');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleSignIn = (email) => {
    localStorage.setItem(authStorageKey, email);
    setUserEmail(email);
  };

  const handleSignOut = () => {
    localStorage.removeItem(authStorageKey);
    setUserEmail('');
  };

  const ProtectedRoute = ({ children }) => {
    if (!userEmail) return <Navigate to="/signin" replace />;
    return children;
  };

  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header" style={{ minHeight: 'auto', paddingBottom: 0 }}>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <Header
            userEmail={userEmail}
            onSignOut={handleSignOut}
          />
        </header>
        <main style={{ padding: '16px' }}>
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <AddRecipe />
                </ProtectedRoute>
              }
            />
            <Route path="/signin" element={<SignIn onSignedIn={handleSignIn} />} />
            <Route path="/signup" element={<SignUp onSignedUp={handleSignIn} />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route
              path="*"
              element={
                <div style={{ padding: 24 }}>
                  <p>Not Found. Go to <Link to="/">Home</Link></p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
