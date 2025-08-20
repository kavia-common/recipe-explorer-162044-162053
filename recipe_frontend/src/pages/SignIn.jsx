import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/common.css';
import '../styles/sign-in.css';

// PUBLIC_INTERFACE
export default function SignIn({ onSignedIn }) {
  /**
   * SignIn screen translated from Figma-derived HTML/CSS.
   * - Preserves layout and styling using ported CSS tokens and classes
   * - Adds React state for inputs and simple validation
   * - Keeps accessible labels, aria attributes, and keyboard-friendly buttons
   */
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) {
      setErrors((er) => ({ ...er, [name]: undefined }));
    }
  };

  const validate = () => {
    const er = {};
    if (!form.email) er.email = 'Email is required';
    if (!form.password) er.password = 'Password is required';
    return er;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length > 0) return;
    if (onSignedIn) onSignedIn(form.email);
    // eslint-disable-next-line no-alert
    alert('Sign In clicked');
    navigate('/');
  };

  const clickSocial = (network) => {
    // Replace with real social auth handlers
    // eslint-disable-next-line no-alert
    alert('Sign in with ' + network);
  };

  return (
    <main className="container-375 sign-in-screen" role="main" aria-labelledby="screen-title">
      {/* Visual-only status bar placeholder */}
      <div className="status-bar" aria-hidden="true">
        <div className="status-bar-time">19:27</div>
      </div>

      {/* Title */}
      <header className="title-group">
        <h1 id="screen-title" className="hello">Hello,</h1>
        <p className="welcome">Welcome Back!</p>
      </header>

      {/* Form */}
      <form className="form-stack" onSubmit={onSubmit} noValidate>
        <div className="input-field email-field">
          <label htmlFor="email" className="input-label">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="input-control"
            placeholder="Enter Email"
            autoComplete="email"
            value={form.email}
            onChange={update}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <div id="email-error" className="visually-hidden" role="alert">
              {errors.email}
            </div>
          )}
        </div>

        <div className="input-field password-field">
          <label htmlFor="password" className="input-label">Enter Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="input-control"
            placeholder="Enter Password"
            autoComplete="current-password"
            value={form.password}
            onChange={update}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && (
            <div id="password-error" className="visually-hidden" role="alert">
              {errors.password}
            </div>
          )}
        </div>

        {/* Forgot Password */}
        <p className="forgot-wrap">
          <Link to="/forgot" className="forgot-link">Forgot Password?</Link>
        </p>

        {/* CTA */}
        <button className="btn cta" id="cta-sign-in" type="submit" aria-label="Sign In">
          <span className="cta-label">Sign In</span>
          <span className="cta-icon" aria-hidden="true">
            <span className="arrow-shaft"></span>
            <span className="arrow-head"></span>
          </span>
        </button>
      </form>

      {/* Divider */}
      <div className="divider-wrap" aria-hidden="true">
        <div className="divider">
          <span className="line"></span>
          <span className="divider-text">Or Sign in With</span>
          <span className="line"></span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="social-row" role="group" aria-label="Sign in with social accounts">
        <button
          className="social-btn google"
          type="button"
          aria-label="Sign in with Google"
          onClick={() => clickSocial('Google')}
        >
          <span className="g g1" aria-hidden="true"></span>
          <span className="g g2" aria-hidden="true"></span>
          <span className="g g3" aria-hidden="true"></span>
          <span className="g g4" aria-hidden="true"></span>
        </button>
        <button
          className="social-btn facebook"
          type="button"
          aria-label="Sign in with Facebook"
          onClick={() => clickSocial('Facebook')}
        >
          <span className="fb-mark" aria-hidden="true">f</span>
        </button>
      </div>

      {/* Sign up prompt */}
      <p className="signup-text">
        Don’t have an account?{' '}
        <Link to="/signup" className="signup-link">
          Sign up
        </Link>
      </p>

      {/* Home indicator placeholder */}
      <div className="home-indicator" aria-hidden="true">
        <div className="bar"></div>
      </div>
    </main>
  );
}
