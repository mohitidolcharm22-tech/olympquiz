import axios from 'axios'

// Normalize the configured base URL so a missing protocol (a common Vercel
// env-var mistake) can't be interpreted as a relative path by the browser.
const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
const baseURL = /^https?:\/\//i.test(rawBaseUrl) ? rawBaseUrl : `https://${rawBaseUrl}`

const api = axios.create({
  baseURL,
  // withCredentials: true is REQUIRED for HttpOnly cookies to be sent on
  // cross-origin requests (frontend on :3000, backend on :5000).
  // The browser automatically attaches both the accessToken and refreshToken
  // cookies — no JS code needs to read or attach them manually.
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// No Authorization header needed — the HttpOnly cookie is sent automatically.
// If the server returns 401, redirect to login.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
