import axios from 'axios'

// Normalize the configured base URL so a missing protocol (a common Vercel
// env-var mistake) can't be interpreted as a relative path by the browser.
const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
const baseURL = /^https?:\/\//i.test(rawBaseUrl) ? rawBaseUrl : `https://${rawBaseUrl}`

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Attach Bearer token from localStorage on every request.
// This works cross-origin without any SameSite/cookie restrictions.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
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
