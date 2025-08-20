import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/common.css';
import { apiGetRecipeById } from '../services/apiClient';

// PUBLIC_INTERFACE
export default function RecipeDetailPage() {
  /** Recipe details from route param id; shows ingredients and steps, backed by API. */
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr('');
    apiGetRecipeById(id)
      .then((data) => {
        if (!mounted) return;
        setRecipe(data);
      })
      .catch((e) => {
        if (!mounted) return;
        setErr(e.status === 404 ? 'Recipe not found' : (e.message || 'Failed to load recipe'));
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return <div style={{ padding: 16 }}><p>Loading recipe...</p></div>;
  }

  if (err || !recipe) {
    return (
      <div style={{ padding: 16 }}>
        <p>{err || 'Recipe not found.'} <Link to="/">Back to list</Link></p>
      </div>
    );
  }

  return (
    <article style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h2 style={{ margin: '8px 0' }}>{recipe.title}</h2>
        <Link to="/" className="btn" style={backBtnStyle}>← Back</Link>
      </div>
      <p style={{ color: '#666' }}>{recipe.description}</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '8px 0 16px' }}>
        {(recipe.tags || []).map(t => <span key={t} style={chipStyle}>{t}</span>)}
      </div>
      <p style={{ fontSize: 14, color: '#555' }}>⏱ {recipe.time}</p>

      <section style={{ marginTop: 24 }}>
        <h3>Ingredients</h3>
        <ul>
          {(recipe.ingredients || []).map((ing, idx) => <li key={idx}>{ing}</li>)}
        </ul>
      </section>

      <section style={{ marginTop: 16 }}>
        <h3>Steps</h3>
        <ol>
          {(recipe.steps || []).map((s, idx) => <li key={idx}>{s}</li>)}
        </ol>
      </section>
    </article>
  );
}

const chipStyle = {
  border: '1px solid #eee',
  borderRadius: 999,
  padding: '2px 8px',
  fontSize: 12,
  color: '#333',
  background: '#fafafa'
};

const backBtnStyle = {
  height: 36,
  padding: '0 12px',
  background: '#ffffff',
  color: '#121212',
  borderRadius: 8,
  border: '1px solid var(--border-color, #e9ecef)',
  textDecoration: 'none'
};
