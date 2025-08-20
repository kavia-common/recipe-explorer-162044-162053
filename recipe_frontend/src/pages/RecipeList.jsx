import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/common.css';
import { apiGetRecipes } from '../services/apiClient';

// PUBLIC_INTERFACE
export default function RecipeList() {
  /** Recipe list grid with search from ?q= query param, backed by API. */
  const [params] = useSearchParams();
  const q = (params.get('q') || '').trim();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr('');
    apiGetRecipes(q)
      .then((data) => {
        if (!mounted) return;
        setRecipes(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (!mounted) return;
        setErr(e.message || 'Failed to load recipes');
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [q]);

  return (
    <section>
      {loading && <p>Loading recipes...</p>}
      {err && <p role="alert" style={{ color: '#c00' }}>{err}</p>}
      {!loading && !err && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {recipes.map(r => (
              <article key={r.id} style={cardStyle}>
                <h3 style={{ margin: '0 0 8px' }}>{r.title}</h3>
                <p style={{ margin: '0 0 8px', color: '#666', fontSize: 14 }}>{r.description}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  {(r.tags || []).map(tag => (
                    <span key={tag} style={chipStyle}>{tag}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#555' }}>⏱ {r.time}</span>
                  <Link to={`/recipes/${r.id}`} className="btn" style={viewBtnStyle}>View</Link>
                </div>
              </article>
            ))}
          </div>
          {recipes.length === 0 && (
            <p style={{ marginTop: 24, color: '#777' }}>No recipes found.</p>
          )}
        </>
      )}
    </section>
  );
}

const cardStyle = {
  background: '#fff',
  border: '1px solid var(--border-color, #e9ecef)',
  borderRadius: 12,
  padding: 16,
  boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
};

const chipStyle = {
  border: '1px solid #eee',
  borderRadius: 999,
  padding: '2px 8px',
  fontSize: 12,
  color: '#333',
  background: '#fafafa'
};

const viewBtnStyle = {
  height: 36,
  padding: '0 12px',
  background: 'var(--cta-bg, #129575)',
  color: '#fff',
  borderRadius: 8,
  textDecoration: 'none'
};
