// lib/auth.js
// ================================================================
// Helper functions for handling admin authentication.
// These are used across all admin pages to check if Tita Mari
// is logged in, and to log her out.
// ================================================================

export const AUTH_TOKEN_KEY = 'bitsnfinds_admin_token'
export const AUTH_USER_KEY  = 'bitsnfinds_admin_user'

// Save token + username to localStorage after login
export function saveAuth(token, username) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AUTH_USER_KEY, username)
}

// Get the saved token (used when making API requests)
export function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

// Get the saved username
export function getUser() {
  return localStorage.getItem(AUTH_USER_KEY)
}

// Check if someone is logged in
export function isLoggedIn() {
  return !!localStorage.getItem(AUTH_TOKEN_KEY)
}

// Clear everything on logout
export function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}
