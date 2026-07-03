import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { studentTheme, teacherTheme, parentTheme, adminTheme } from './design-system'
import AppRoutes from './routes'
import { Snackbar, Alert } from '@mui/material'
import { hideSnackbar } from './store/slices/uiSlice'
import { restoreSession } from './store/slices/authSlice'
import useInactivityLogout from './hooks/useInactivityLogout'
import ErrorBoundary from './components/common/ErrorBoundary'

const themes = {
  student: studentTheme,
  teacher: teacherTheme,
  parent: parentTheme,
  admin: adminTheme,
}

function AppContent() {
  const dispatch = useDispatch()
  const { snackbar } = useSelector(s => s.ui)

  // Restore session on every page load/refresh
  useEffect(() => {
    dispatch(restoreSession())
  }, [dispatch])

  // Auto-logout after 10 min of inactivity
  useInactivityLogout()

  return (
    <>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => dispatch(hideSnackbar())}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => dispatch(hideSnackbar())}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default function App() {
  const { theme } = useSelector(s => s.ui)
  const { role } = useSelector(s => s.auth)

  // Use role-based theme if available, otherwise use ui theme
  const activeTheme = themes[role] || themes[theme] || studentTheme

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <AppContent />
    </ThemeProvider>
  )
}
