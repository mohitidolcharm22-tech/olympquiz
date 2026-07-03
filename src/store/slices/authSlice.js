import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { users } from '../../data/users'

/**
 * WHY NO TOKEN IN LOCALSTORAGE ANYMORE?
 * ─────────────────────────────────────────────────────────────────────────────
 * The access token is now stored in an HttpOnly cookie set by the server.
 * HttpOnly = JavaScript cannot read it at all, so XSS attacks can't steal it.
 * The browser sends it automatically with every request (via withCredentials).
 *
 * We store a simple "session exists" flag so we know to show a loading
 * spinner on refresh while restoreSession calls /auth/me to confirm.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const SESSION_FLAG = 'session'   // just 'true' or nothing in sessionStorage

const markSession  = ()  => sessionStorage.setItem(SESSION_FLAG, '1')
const clearSession = ()  => sessionStorage.removeItem(SESSION_FLAG)
const hasSession   = ()  => !!sessionStorage.getItem(SESSION_FLAG)

/* ─── Async Thunks ───────────────────────────────────────────────────────── */

export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', formData)
      // Server sets accessToken + refreshToken as HttpOnly cookies.
      // Response body contains user + permissions array.
      markSession()
      return data
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.message
        || err.response?.data?.message
        || 'Registration failed. Please try again.'
      return rejectWithValue(msg)
    }
  },
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      // Cookies are set by the server. We only keep a session flag.
      markSession()
      return data
    } catch (err) {
      const msg = err.response?.data?.message || 'Incorrect email or password.'
      return rejectWithValue(msg)
    }
  },
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await api.post('/auth/logout')   // server clears both cookies
    } finally {
      clearSession()
    }
  },
)

export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    // No token to read from localStorage — the HttpOnly cookie is sent
    // automatically by the browser. Just call /auth/me and see if it works.
    if (!hasSession()) return rejectWithValue('no session')
    try {
      const { data } = await api.get('/auth/me')
      // /auth/me returns { user, permissions }
      return { user: data.data.user, permissions: data.permissions ?? [] }
    } catch (err) {
      clearSession()
      return rejectWithValue(`session invalid: ${err.response?.data?.message ?? err.message}`)
    }
  },
)

/* ─── Slice ──────────────────────────────────────────────────────────────── */
const initialState = {
  user: null,
  token: null,          // no longer stored — lives in HttpOnly cookie
  role: null,
  permissions: [],
  isAuthenticated: false,
  // Show spinner on refresh only if a session flag exists (user was logged in).
  loading: hasSession(),
  error: null,
  otpSent: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
    clearError: (state) => {
      state.error = null
    },
    // Demo login — keeps existing demo flow working
    demoLogin: (state, action) => {
      const role = action.payload
      const user = users.find(u => u.role === role)
      if (user) {
        state.user = user
        state.token = `demo-token-${user.id}`
        state.role = user.role
        state.isAuthenticated = true
        state.loading = false
        state.error = null
      }
    },
  },
  extraReducers: (builder) => {
    // ── Register ──────────────────────────────────────────────────────────
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.loading = false
        state.user = payload.data.user
        state.token = null                     // token is in HttpOnly cookie
        state.role = payload.data.user.role
        state.permissions = payload.permissions ?? []
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
      })

    // ── Login ─────────────────────────────────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false
        state.user = payload.data.user
        state.token = null                     // token is in HttpOnly cookie
        state.role = payload.data.user.role
        state.permissions = payload.permissions ?? []
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
      })

    // ── Logout ────────────────────────────────────────────────────────────
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null
      state.token = null
      state.role = null
      state.permissions = []
      state.isAuthenticated = false
      state.loading = false
      state.error = null
    })

    // ── Restore session on refresh ────────────────────────────────────────
    builder
      .addCase(restoreSession.pending, (state) => {
        state.loading = true
      })
      .addCase(restoreSession.fulfilled, (state, { payload }) => {
        state.loading = false
        state.user = payload.user
        state.token = null                     // token is in HttpOnly cookie
        state.role = payload.user.role
        state.permissions = payload.permissions ?? []
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(restoreSession.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.token = null
        state.user = null
        state.role = null
        state.permissions = []
      })
  },
})

export const { updateUser, clearError, demoLogin } = authSlice.actions
export default authSlice.reducer
