import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import { users } from '../../data/users'

/* ─── Helper ─────────────────────────────────────────────────────────────── */
const persistToken = (token) => {
  if (token) localStorage.setItem('accessToken', token)
  else localStorage.removeItem('accessToken')
}

/* ─── Async Thunks ───────────────────────────────────────────────────────── */

export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', formData)
      persistToken(data.accessToken)
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
  async ({ email, password }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      persistToken(data.accessToken)
      return data
    } catch (err) {
      const msg = err.response?.data?.message || 'Incorrect email or password.'
      throw new Error(msg)
    }
  },
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      persistToken(null)
    }
  },
)

export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('accessToken')
    if (!token) return rejectWithValue('no token')
    try {
      const { data } = await api.get('/auth/me')
      return { user: data.data.user, token }
    } catch (err) {
      persistToken(null)
      return rejectWithValue(`invalid token${err.response?.data?.message ? `: ${err.response.data.message}` : ''}`)
    }
  },
)

/* ─── Slice ──────────────────────────────────────────────────────────────── */
const initialState = {
  user: null,
  token: localStorage.getItem('accessToken') || null,
  role: null,
  isAuthenticated: false,
  loading: false,
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
        state.token = payload.accessToken
        state.role = payload.data.user.role
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
        state.token = payload.accessToken
        state.role = payload.data.user.role
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
        state.token = payload.token
        state.role = payload.user.role
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(restoreSession.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.token = null
        state.user = null
        state.role = null
      })
  },
})

export const { updateUser, clearError, demoLogin } = authSlice.actions
export default authSlice.reducer
