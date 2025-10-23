export const AUTH_KEY = 'auth';

function safeParse(json) {
  try {
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

export function setAuth({ token, user }) {
  if (!token || !user) return;
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({
      token,
      user,
      savedAt: Date.now()
    })
  );
}

export function getAuth() {
  return safeParse(localStorage.getItem(AUTH_KEY));
}

export function getToken() {
  return getAuth()?.token || null;
}

export function getUser() {
  return getAuth()?.user || null;
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}
