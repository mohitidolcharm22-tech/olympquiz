import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,   // send HttpOnly refresh-token cookie
  headers: { 'Content-Type': 'application/json' },
})

// Attach access token from Redux store on every request
api.interceptors.request.use((config) => {
  // Token is read directly from localStorage so the interceptor stays
  // framework-agnostic (no circular dependency with the Redux store).
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// If the server returns 401, clear local auth state
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      // Redirect to login only when not already there
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
