import axios from 'axios'

// Normalize the configured base URL so a missing protocol (a common Vercel
// env-var mistake) can't be interpreted as a relative path by the browser.
const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
const baseURL = /^https?:\/\//i.test(rawBaseUrl) ? rawBaseUrl : `https://${rawBaseUrl}`

const api = axios.create({
  baseURL,
  // withCredentials is REQUIRED for HttpOnly cookies to be sent on
  // cross-origin requests (Vercel frontend ↔ Railway backend).
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// On 401, dispatch a custom event. App.jsx listens for it and clears auth state,
// which causes ProtectedRoute to navigate to /login — no full page reload.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      if (!window.location.pathname.startsWith('/login')) {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'))
      }
    }
    return Promise.reject(error)
  },
)

export default api
