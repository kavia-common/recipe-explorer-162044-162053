import React from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/common.css';

const SAMPLE_RECIPES = [
  { id: '1', title: 'Classic Margherita Pizza', description: 'Fresh tomatoes, mozzarella, basil.', time: '30 min', tags: ['Italian', 'Vegetarian'], ingredients: ['Pizza dough', 'Tomato sauce', 'Fresh mozzarella', 'Basil', 'Olive oil', 'Salt'], steps: ['Preheat oven to 500°F (260°C).', 'Spread sauce on dough.', 'Add mozzarella and basil.', 'Bake 8–10 minutes until crust browns.'] },
  { id: '2', title: 'Avocado Toast Deluxe', description: 'Sourdough, smashed avo, chili flakes.', time: '10 min', tags: ['Breakfast', 'Vegan'], ingredients: ['Sourdough bread', 'Avocado', 'Lemon', 'Salt', 'Chili flakes'], steps: ['Toast bread.', 'Mash avocado with salt and lemon.', 'Spread on toast and top with chili flakes.'] },
  { id: '3', title: 'Chicken Tikka Masala', description: 'Creamy tomato curry with spices.', time: '45 min', tags: ['Indian'], ingredients: ['Chicken', 'Yogurt', 'Masala spices', 'Tomato puree', 'Cream', 'Onion', 'Garlic', 'Ginger'], steps: ['Marinate chicken.', 'Cook onion, garlic, ginger.', 'Add spices and tomato puree.', 'Add chicken and simmer.', 'Stir in cream.'] },
  { id: '4', title: 'Berry Smoothie Bowl', description: 'Berries, banana, granola.', time: '8 min', tags: ['Healthy', 'Vegetarian'], ingredients: ['Frozen berries', 'Banana', 'Yogurt or plant milk', 'Granola'], steps: ['Blend berries and banana with yogurt.', 'Pour into bowl and top with granola.'] },
];

// PUBLIC_INTERFACE
export default function RecipeDetailPage() {
  /** Recipe details from route param id; shows ingredients and steps. */
  const { id } = useParams();
  const recipe = SAMPLE_RECIPES.find(r => r.id === id);

  if (!recipe) {
    return (
      <div style={{ padding: 16 }}>
        <p>Recipe not found. <Link to="/">Back to list</Link></p>
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
        {recipe.tags.map(t => <span key={t} style={chipStyle}>{t}</span>)}
      </div>
      <p style={{ fontSize: 14, color: '#555' }}>⏱ {recipe.time}</p>

      <section style={{ marginTop: 24 }}>
        <h3>Ingredients</h3>
        <ul>
          {recipe.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
        </ul>
      </section>

      <section style={{ marginTop: 16 }}>
        <h3>Steps</h3>
        <ol>
          {recipe.steps.map((s, idx) => <li key={idx}>{s}</li>)}
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
