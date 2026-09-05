export const AUTH_TOKEN_KEY = 'bitsnfinds_admin_token'
export const AUTH_USER_KEY = 'bitsnfinds_admin_user'

export function saveAuth(token, username) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AUTH_USER_KEY, username)
}

export function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function getUser() {
  return localStorage.getItem(AUTH_USER_KEY)
}

export function isLoggedIn() {
  return !!localStorage.getItem(AUTH_TOKEN_KEY)
}

export function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}
