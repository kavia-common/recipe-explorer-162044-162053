import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import '../styles/common.css';

/**
 * Header with app title, global search input, and auth/nav actions.
 * This component keeps a local input state, and syncs with URL query (?q=...).
 */
// PUBLIC_INTERFACE
export default function Header({ userEmail, onSignOut }) {
  /** Header with search and nav; userEmail string determines signed-in state. */
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') || '');
  const navigate = useNavigate();
  const loc = useLocation();

  const submitSearch = (e) => {
    e.preventDefault();
    const next = q.trim();
    if (next) {
      setSearchParams({ q: next });
      if (!loc.pathname.startsWith('/recipes') && loc.pathname !== '/') navigate('/');
    } else {
      setSearchParams({});
    }
  };

  return (
    <div
      style={{
        width: '100%',
        background: 'var(--bg-secondary, #f8f9fa)',
        borderBottom: '1px solid var(--border-color, #e9ecef)',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap'
      }}
    >
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 700 }}>
        Recipe Explorer
      </Link>

      <form onSubmit={submitSearch} style={{ flex: 1, minWidth: 220 }}>
        <input
          aria-label="Search recipes"
          placeholder="Search recipes..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="input-control"
          style={{ height: 40 }}
        />
      </form>

      <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link className="btn" to="/add" style={linkBtnStyle}>
          + Add Recipe
        </Link>
        {userEmail ? (
          <>
            <span style={{ fontSize: 12, color: '#666' }}>{userEmail}</span>
            <button className="btn" onClick={onSignOut} style={ghostBtnStyle} type="button">
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link className="btn" to="/signin" style={ghostBtnStyle}>Sign In</Link>
            <Link className="btn" to="/signup" style={primaryBtnStyle}>Sign Up</Link>
          </>
        )}
      </nav>
    </div>
  );
}

const primaryBtnStyle = {
  height: 40,
  padding: '0 14px',
  background: 'var(--cta-bg, #129575)',
  color: '#fff',
  borderRadius: 8
};

const ghostBtnStyle = {
  height: 40,
  padding: '0 14px',
  background: '#ffffff',
  color: '#121212',
  borderRadius: 8,
  border: '1px solid var(--border-color, #e9ecef)'
};

const linkBtnStyle = {
  ...ghostBtnStyle,
  textDecoration: 'none',
};
