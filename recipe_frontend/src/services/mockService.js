//
// Simple in-memory mock service to simulate backend APIs for auth and recipes.
// It monkey-patches window.fetch for relative URLs (no protocol/host) when REACT_APP_API_BASE_URL is unset.
// Disable by setting REACT_APP_API_BASE_URL to a real API origin.
//
const shouldMock = !process.env.REACT_APP_API_BASE_URL;

const MOCK_DB = {
  users: [{ id: 'u_1', name: 'Demo User', email: 'demo@example.com', password: 'password123' }],
  recipes: [
    { id: '1', title: 'Classic Margherita Pizza', description: 'Fresh tomatoes, mozzarella, basil.', time: '30 min', tags: ['Italian', 'Vegetarian'], ingredients: ['Pizza dough', 'Tomato sauce', 'Fresh mozzarella', 'Basil', 'Olive oil', 'Salt'], steps: ['Preheat oven to 500°F (260°C).', 'Spread sauce on dough.', 'Add mozzarella and basil.', 'Bake 8–10 minutes until crust browns.'] },
    { id: '2', title: 'Avocado Toast Deluxe', description: 'Sourdough, smashed avo, chili flakes.', time: '10 min', tags: ['Breakfast', 'Vegan'], ingredients: ['Sourdough bread', 'Avocado', 'Lemon', 'Salt', 'Chili flakes'], steps: ['Toast bread.', 'Mash avocado with salt and lemon.', 'Spread on toast and top with chili flakes.'] },
    { id: '3', title: 'Chicken Tikka Masala', description: 'Creamy tomato curry with spices.', time: '45 min', tags: ['Indian'], ingredients: ['Chicken', 'Yogurt', 'Masala spices', 'Tomato puree', 'Cream', 'Onion', 'Garlic', 'Ginger'], steps: ['Marinate chicken.', 'Cook onion, garlic, ginger.', 'Add spices and tomato puree.', 'Add chicken and simmer.', 'Stir in cream.'] },
    { id: '4', title: 'Berry Smoothie Bowl', description: 'Berries, banana, granola.', time: '8 min', tags: ['Healthy', 'Vegetarian'], ingredients: ['Frozen berries', 'Banana', 'Yogurt or plant milk', 'Granola'], steps: ['Blend berries and banana with yogurt.', 'Pour into bowl and top with granola.'] },
  ]
};

function jsonResponse(data, init = {}) {
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' }, ...init });
}
function errorResponse(message, status = 400) {
  return jsonResponse({ message }, { status });
}
function parseBodyInit(init) {
  if (!init || !init.body) return {};
  try {
    return typeof init.body === 'string' ? JSON.parse(init.body) : init.body;
  } catch {
    return {};
  }
}

function handleAuth(path, init) {
  if (path === '/auth/signin' && init.method === 'POST') {
    const { email, password } = parseBodyInit(init);
    const user = MOCK_DB.users.find(u => u.email === email && u.password === password);
    if (!user) return errorResponse('Invalid email or password', 401);
    const { password: _pw, ...safeUser } = user;
    return jsonResponse({ token: 'mock-token', user: safeUser });
  }
  if (path === '/auth/signup' && init.method === 'POST') {
    const { name, email, password } = parseBodyInit(init);
    if (!email || !password || !name) return errorResponse('Missing fields', 400);
    const exists = MOCK_DB.users.some(u => u.email === email);
    if (exists) return errorResponse('Email already registered', 409);
    const newUser = { id: `u_${Date.now()}`, name, email, password };
    MOCK_DB.users.push(newUser);
    const { password: _pw, ...safeUser } = newUser;
    return jsonResponse({ token: 'mock-token', user: safeUser });
  }
  return null;
}

function handleRecipes(path, init, url) {
  if (path === '/recipes' && (!init.method || init.method === 'GET')) {
    const q = new URLSearchParams(url.search).get('q')?.toLowerCase() || '';
    const list = MOCK_DB.recipes.filter(r => {
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.tags || []).some(t => t.toLowerCase().includes(q))
      );
    });
    return jsonResponse(list);
  }
  if (path.startsWith('/recipes/') && (!init.method || init.method === 'GET')) {
    const id = path.split('/')[2];
    const recipe = MOCK_DB.recipes.find(r => r.id === id);
    if (!recipe) return errorResponse('Not found', 404);
    return jsonResponse(recipe);
  }
  if (path === '/recipes' && init.method === 'POST') {
    const data = parseBodyInit(init);
    if (!data || !data.title || !data.description || !data.time) return errorResponse('Missing required fields', 400);
    const newRecipe = {
      id: `${Date.now()}`,
      title: data.title,
      description: data.description,
      time: data.time,
      tags: (data.tags && Array.isArray(data.tags)) ? data.tags : (typeof data.tags === 'string' ? data.tags.split(',').map(s => s.trim()).filter(Boolean) : []),
      ingredients: typeof data.ingredients === 'string' ? data.ingredients.split('\n').map(s => s.trim()).filter(Boolean) : (data.ingredients || []),
      steps: typeof data.steps === 'string' ? data.steps.split('\n').map(s => s.trim()).filter(Boolean) : (data.steps || []),
    };
    MOCK_DB.recipes.push(newRecipe);
    return jsonResponse(newRecipe, { status: 201 });
  }
  return null;
}

function installMockFetch() {
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    try {
      const reqUrl = typeof input === 'string' ? input : input.url;
      // Only handle same-origin relative API calls (starting with '/')
      if (shouldMock && typeof reqUrl === 'string' && reqUrl.startsWith('/')) {
        const url = new URL(reqUrl, window.location.origin);
        const path = url.pathname;

        let res = handleAuth(path, init);
        if (res) return res;

        res = handleRecipes(path, init, url);
        if (res) return res;
      }
    } catch (e) {
      // fall through to original fetch on any mock error
    }
    return originalFetch(input, init);
  };
}

if (typeof window !== 'undefined' && shouldMock) {
  installMockFetch();
}

export default {};
