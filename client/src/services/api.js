const API_BASE = '/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register') && window.location.pathname !== '/') {
          window.location.href = '/login';
        }
      }
      const errorMessage = data.errors && data.errors.length > 0
        ? data.errors.map(e => `${e.field ? `${e.field}: ` : ''}${e.message}`).join(', ')
        : data.message || 'An error occurred during request';
      throw new Error(errorMessage);
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export default { request };
