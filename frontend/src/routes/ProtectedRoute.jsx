import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CircularProgress, Box } from '@mui/material'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useSelector(s => s.auth)

  // While restoreSession is in-flight, show a spinner instead of redirecting
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const redirects = {
      student: '/student/dashboard',
      teacher: '/teacher/dashboard',
      parent: '/parent/dashboard',
      admin: '/admin/dashboard',
    }
    return <Navigate to={redirects[role] || '/login'} replace />
  }

  return children
}
