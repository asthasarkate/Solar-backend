const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // TODO: attach Supabase auth token from session
  // const session = await supabase.auth.getSession();
  // if (session.data.session?.access_token) {
  //   headers['Authorization'] = `Bearer ${session.data.session.access_token}`;
  // }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error?.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, data) => request(path, { method: 'POST', body: JSON.stringify(data) }),
  put: (path, data) => request(path, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};

export default api;
