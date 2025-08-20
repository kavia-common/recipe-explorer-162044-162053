import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/common.css';
import { apiAddRecipe } from '../services/apiClient';

// PUBLIC_INTERFACE
export default function AddRecipe() {
  /** Add recipe form; posts to API (mocked by default) and navigates to the created recipe. */
  const [form, setForm] = useState({
    title: '',
    description: '',
    time: '',
    tags: '',
    ingredients: '',
    steps: ''
  });
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
    if (!form.title.trim()) er.title = 'Title is required';
    if (!form.description.trim()) er.description = 'Description is required';
    if (!form.time.trim()) er.time = 'Time is required';
    return er;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        time: form.time,
        tags: form.tags,
        ingredients: form.ingredients,
        steps: form.steps,
      };
      const created = await apiAddRecipe(payload);
      navigate(`/recipes/${created.id}`);
    } catch (e2) {
      setErrors(prev => ({ ...prev, title: e2.message || 'Failed to add recipe' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2>Add New Recipe</h2>
      <form onSubmit={onSubmit} noValidate style={{ display: 'grid', gap: 16 }}>
        <div>
          <label className="input-label" htmlFor="title">Title</label>
          <input className="input-control" id="title" name="title" value={form.title} onChange={update} />
          {errors.title && <div role="alert" style={errorStyle}>{errors.title}</div>}
        </div>

        <div>
          <label className="input-label" htmlFor="description">Short Description</label>
          <input className="input-control" id="description" name="description" value={form.description} onChange={update} />
          {errors.description && <div role="alert" style={errorStyle}>{errors.description}</div>}
        </div>

        <div>
          <label className="input-label" htmlFor="time">Time (e.g., 30 min)</label>
          <input className="input-control" id="time" name="time" value={form.time} onChange={update} />
          {errors.time && <div role="alert" style={errorStyle}>{errors.time}</div>}
        </div>

        <div>
          <label className="input-label" htmlFor="tags">Tags (comma-separated)</label>
          <input className="input-control" id="tags" name="tags" value={form.tags} onChange={update} placeholder="Breakfast, Vegan" />
        </div>

        <div>
          <label className="input-label" htmlFor="ingredients">Ingredients (one per line)</label>
          <textarea className="input-control" id="ingredients" name="ingredients" value={form.ingredients} onChange={update} rows={5} />
        </div>

        <div>
          <label className="input-label" htmlFor="steps">Steps (one per line)</label>
          <textarea className="input-control" id="steps" name="steps" value={form.steps} onChange={update} rows={5} />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn" style={primaryBtn} disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
          <button type="button" className="btn" style={ghostBtn} onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </section>
  );
}

const errorStyle = { color: '#c00', fontSize: 12, marginTop: 6 };

const primaryBtn = {
  height: 44,
  padding: '0 16px',
  background: 'var(--cta-bg, #129575)',
  color: '#fff',
  borderRadius: 8
};

const ghostBtn = {
  height: 44,
  padding: '0 16px',
  background: '#fff',
  color: '#121212',
  borderRadius: 8,
  border: '1px solid var(--border-color, #e9ecef)'
};
