import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/common.css';
import '../styles/sign-in.css';

// PUBLIC_INTERFACE
export default function ForgotPassword() {
  /** Forgot password screen; alerts on request (stub). */
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErr('Email is required');
      return;
    }
    // Replace with real API call
    // eslint-disable-next-line no-alert
    alert('If this email exists, password reset instructions were sent.');
    setErr('');
  };

  return (
    <main className="container-375 sign-in-screen" role="main" aria-labelledby="forgot-title">
      <div className="status-bar" aria-hidden="true">
        <div className="status-bar-time">19:27</div>
      </div>

      <header className="title-group">
        <h1 id="forgot-title" className="hello">Forgot Password</h1>
        <p className="welcome">We’ll send reset instructions</p>
      </header>

      <form className="form-stack" onSubmit={submit} noValidate>
        <div className="input-field">
          <label htmlFor="email" className="input-label">Email</label>
          <input id="email" name="email" type="email" className="input-control" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {err && <div role="alert" className="visually-hidden">{err}</div>}
        </div>

        <button className="btn cta" type="submit" aria-label="Send reset link">
          <span className="cta-label">Send Reset Link</span>
          <span className="cta-icon" aria-hidden="true">
            <span className="arrow-shaft"></span>
            <span className="arrow-head"></span>
          </span>
        </button>
      </form>

      <p className="signup-text">
        <Link to="/signin" className="signup-link">Back to Sign In</Link>
      </p>

      <div className="home-indicator" aria-hidden="true">
        <div className="bar"></div>
      </div>
    </main>
  );
}
