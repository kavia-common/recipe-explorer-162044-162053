//
// Centralized API client with environment-driven base URL and simple helper methods.
// If REACT_APP_API_BASE_URL is not set, we fall back to the local mock service.
//
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

/**
 * Performs a fetch request with JSON convenience.
 * @param {string} path - Endpoint path (e.g., '/auth/signin')
 * @param {object} options - Fetch options. If body is provided and not FormData, it's JSON-stringified.
 * @returns {Promise<any>} Parsed JSON or throws with message
 */
async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const headers = options.headers ? { ...options.headers } : {};
  let body = options.body;

  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const res = await fetch(url, { ...options, headers, body });
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const data = isJson ? await res.json() : await res.text();
      message = typeof data === 'string' ? data : (data.message || message);
    } catch {
      // ignore
    }
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return isJson ? res.json() : res.text();
}

// PUBLIC_INTERFACE
export async function apiSignIn({ email, password }) {
  /** Sign in via backend; expects {token, user}. With mock server, returns stubbed values. */
  return request('/auth/signin', { method: 'POST', body: { email, password } });
}

// PUBLIC_INTERFACE
export async function apiSignUp({ name, email, password }) {
  /** Sign up via backend; expects {token, user}. */
  return request('/auth/signup', { method: 'POST', body: { name, email, password } });
}

// PUBLIC_INTERFACE
export async function apiGetRecipes(query) {
  /** Fetch list of recipes; supports optional query 'q' */
  const q = query && query.trim() ? `?q=${encodeURIComponent(query.trim())}` : '';
  return request(`/recipes${q}`, { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function apiGetRecipeById(id) {
  /** Fetch one recipe by id. */
  return request(`/recipes/${encodeURIComponent(id)}`, { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function apiAddRecipe(recipe) {
  /** Add a new recipe. Returns created recipe with id. */
  return request('/recipes', { method: 'POST', body: recipe });
}
