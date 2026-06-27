import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: true,
  sidebarMobileOpen: false,
  theme: 'student',
  snackbar: { open: false, message: '', severity: 'info' },
  globalLoading: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    toggleMobileSidebar: (state) => {
      state.sidebarMobileOpen = !state.sidebarMobileOpen
    },
    closeMobileSidebar: (state) => {
      state.sidebarMobileOpen = false
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    showSnackbar: (state, action) => {
      state.snackbar = { open: true, ...action.payload }
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload
    },
  },
})

export const { toggleSidebar, toggleMobileSidebar, closeMobileSidebar, setTheme, showSnackbar, hideSnackbar, setGlobalLoading } = uiSlice.actions
export default uiSlice.reducer
