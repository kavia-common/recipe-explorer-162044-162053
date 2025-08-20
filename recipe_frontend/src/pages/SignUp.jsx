import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/common.css';
import '../styles/sign-in.css';
import { apiSignUp } from '../services/apiClient';

// PUBLIC_INTERFACE
export default function SignUp({ onSignedUp }) {
  /** SignUp screen styled similar to SignIn; calls API for account creation. */
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const update = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = 'Name is required';
    if (!form.email.trim()) er.email = 'Email is required';
    if (!form.password) er.password = 'Password is required';
    return er;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;

    setSubmitting(true);
    try {
      const res = await apiSignUp({ name: form.name, email: form.email, password: form.password });
      if (onSignedUp) onSignedUp(res?.user?.email || form.email);
      navigate('/');
    } catch (err) {
      setErrors(prev => ({ ...prev, email: err.message || 'Sign up failed' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container-375 sign-in-screen" role="main" aria-labelledby="signup-title">
      <div className="status-bar" aria-hidden="true">
        <div className="status-bar-time">19:27</div>
      </div>

      <header className="title-group">
        <h1 id="signup-title" className="hello">Create Account</h1>
        <p className="welcome">Join Recipe Explorer</p>
      </header>

      <form className="form-stack" onSubmit={onSubmit} noValidate>
        <div className="input-field">
          <label htmlFor="name" className="input-label">Name</label>
          <input id="name" name="name" className="input-control" placeholder="Enter Name" value={form.name} onChange={update} />
          {errors.name && <div role="alert" className="visually-hidden">{errors.name}</div>}
        </div>
        <div className="input-field">
          <label htmlFor="email" className="input-label">Email</label>
          <input id="email" name="email" type="email" className="input-control" placeholder="Enter Email" value={form.email} onChange={update} />
          {errors.email && <div role="alert" className="visually-hidden">{errors.email}</div>}
        </div>
        <div className="input-field">
          <label htmlFor="password" className="input-label">Password</label>
          <input id="password" name="password" type="password" className="input-control" placeholder="Create Password" value={form.password} onChange={update} />
          {errors.password && <div role="alert" className="visually-hidden">{errors.password}</div>}
        </div>

        <button className="btn cta" type="submit" aria-label="Sign Up" disabled={submitting}>
          <span className="cta-label">{submitting ? 'Creating...' : 'Sign Up'}</span>
          <span className="cta-icon" aria-hidden="true">
            <span className="arrow-shaft"></span>
            <span className="arrow-head"></span>
          </span>
        </button>
      </form>

      <div className="divider-wrap" aria-hidden="true">
        <div className="divider">
          <span className="line"></span>
          <span className="divider-text">Already have an account?</span>
          <span className="line"></span>
        </div>
      </div>

      <p className="signup-text">
        <Link to="/signin" className="signup-link">Sign In</Link>
      </p>

      <div className="home-indicator" aria-hidden="true">
        <div className="bar"></div>
      </div>
    </main>
  );
}
