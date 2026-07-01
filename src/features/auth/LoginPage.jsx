import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Card, CardContent, Typography, TextField, Button, IconButton,
  InputAdornment, Alert, Divider, Grid, CircularProgress,
} from '@mui/material'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import { loginUser, demoLogin, clearError } from '../../store/slices/authSlice'
import { setTheme } from '../../store/slices/uiSlice'

const demoRoles = [
  { role: 'student', label: 'Student', icon: '🎒', color: '#6C63FF', desc: 'Grade 3 · Level 8' },
  { role: 'teacher', label: 'Teacher', icon: '📚', color: '#1E40AF', desc: 'Mathematics Teacher' },
  { role: 'parent', label: 'Parent', icon: '👨‍👩‍👧', color: '#0F766E', desc: 'Parent Account' },
  { role: 'admin', label: 'Admin', icon: '⚙️', color: '#1E293B', desc: 'Platform Admin' },
]

const roleRoutes = {
  student:     '/student/dashboard',
  teacher:     '/teacher/dashboard',
  parent:      '/parent/dashboard',
  admin:       '/admin/dashboard',
  school_admin:'/admin/dashboard',
  super_admin: '/admin/dashboard',
}

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error } = useSelector(s => s.auth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    dispatch(clearError())
    const result = await dispatch(loginUser({ email: form.email, password: form.password }))
    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.data.user.role
      dispatch(setTheme(role))
      navigate(roleRoutes[role] || '/admin/dashboard')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && form.email && form.password) handleLogin()
  }

  const handleDemoLogin = (role) => {
    dispatch(demoLogin(role))
    dispatch(setTheme(role))
    navigate(roleRoutes[role])
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6C63FF15 0%, #FF6B3515 50%, #10B98115 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      p: 2,
    }}>
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h2" fontWeight={900} sx={{
            background: 'linear-gradient(135deg, #6C63FF, #FF6B35)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            mb: 0.5,
          }}>
            🏆 OlympQuiz
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            Learn. Play. Grow.
          </Typography>
        </Box>

        <Card elevation={0} sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>Welcome back! 👋</Typography>

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>{error}</Alert>}

            <TextField fullWidth label="Email or Username" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              onKeyDown={handleKeyDown}
              helperText="Parents & teachers use email · Students use @username"
              sx={{ mb: 2 }} autoComplete="username" />

            <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              onKeyDown={handleKeyDown}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(s => !s)} edge="end">
                      {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1 }}
            />

            <Box sx={{ textAlign: 'right', mb: 2.5 }}>
              <RouterLink to="/forgot-password" style={{ color: '#6C63FF', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                Forgot password?
              </RouterLink>
            </Box>

            <Button fullWidth variant="contained" size="large"
              disabled={loading || !form.email || !form.password}
              sx={{ mb: 2, borderRadius: '12px', py: 1.5, fontSize: '1rem' }}
              onClick={handleLogin}>
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
            </Button>

            <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 2 }}>
              Don{'"'}t have an account?{' '}
              <RouterLink to="/register" style={{ color: '#6C63FF', fontWeight: 700, textDecoration: 'none' }}>
                Register here
              </RouterLink>
            </Typography>

            {import.meta.env.DEV && (<>
            <Divider sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>QUICK DEMO ACCESS</Typography>
            </Divider>

            <Grid container spacing={1}>
              {demoRoles.map(({ role, label, icon, color, desc }) => (
                <Grid item xs={6} key={role}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleDemoLogin(role)}
                    sx={{
                      borderRadius: '12px', py: 1.25,
                      borderColor: `${color}40`,
                      '&:hover': { bgcolor: `${color}10`, borderColor: color },
                      flexDirection: 'column', gap: 0.25,
                      textTransform: 'none',
                    }}
                  >
                    <Typography variant="body1">{icon}</Typography>
                    <Typography variant="caption" fontWeight={700} sx={{ color }}>{label}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>{desc}</Typography>
                  </Button>
                </Grid>
              ))}
            </Grid>
            </>)}
          </CardContent>
        </Card>

        <Typography variant="caption" align="center" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          🔒 Secure · WCAG 2.2 AA Compliant · Mobile-First
        </Typography>
      </Box>
    </Box>
  )
}

