import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../styles/common.css';

const SAMPLE_RECIPES = [
  { id: '1', title: 'Classic Margherita Pizza', description: 'Fresh tomatoes, mozzarella, basil.', time: '30 min', tags: ['Italian', 'Vegetarian'] },
  { id: '2', title: 'Avocado Toast Deluxe', description: 'Sourdough, smashed avo, chili flakes.', time: '10 min', tags: ['Breakfast', 'Vegan'] },
  { id: '3', title: 'Chicken Tikka Masala', description: 'Creamy tomato curry with spices.', time: '45 min', tags: ['Indian'] },
  { id: '4', title: 'Berry Smoothie Bowl', description: 'Berries, banana, granola.', time: '8 min', tags: ['Healthy', 'Vegetarian'] },
];

// PUBLIC_INTERFACE
export default function RecipeList() {
  /** Recipe list grid with search from ?q= query param. */
  const [params] = useSearchParams();
  const q = (params.get('q') || '').toLowerCase();

  const list = SAMPLE_RECIPES.filter(r => {
    if (!q) return true;
    return r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.tags.some(t => t.toLowerCase().includes(q));
  });

  return (
    <section>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {list.map(r => (
          <article key={r.id} style={cardStyle}>
            <h3 style={{ margin: '0 0 8px' }}>{r.title}</h3>
            <p style={{ margin: '0 0 8px', color: '#666', fontSize: 14 }}>{r.description}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {r.tags.map(tag => (
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
      {list.length === 0 && (
        <p style={{ marginTop: 24, color: '#777' }}>No recipes found.</p>
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
