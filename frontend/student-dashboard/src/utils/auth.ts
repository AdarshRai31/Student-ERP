export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3000/api/v1';

export function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function setAuth(token: string, username: string) {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_username', username);
}

export function clearAuth() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_username');
}

export async function signin(username: string, password: string): Promise<{ token: string }> {
  const res = await fetch(`${API_BASE}/user/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to sign in');
  }
  return res.json();
}

export async function signup(username: string, password: string, firstName: string, lastName: string): Promise<{ token: string }> {
  const res = await fetch(`${API_BASE}/user/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, firstName, lastName })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to sign up');
  }
  return res.json();
}
