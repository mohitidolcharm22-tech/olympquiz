import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Card, CardContent, Typography, TextField, Button,
  MenuItem, Select, FormControl, InputLabel, Alert, Stepper, Step, StepLabel,
  CircularProgress, IconButton, InputAdornment,
} from '@mui/material'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import { registerUser, clearError } from '../../store/slices/authSlice'
import { setTheme } from '../../store/slices/uiSlice'

const steps = ['Account Type', 'Personal Info', 'Credentials']

const GRADES = ['Nursery', 'KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

const roleRoutes = {
  student: '/student/dashboard',
  teacher: '/teacher/dashboard',
  parent: '/parent/dashboard',
  admin: '/admin/dashboard',
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error } = useSelector(s => s.auth)

  const [activeStep, setActiveStep] = useState(0)
  const [showPassword, setShowPassword]        = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [form, setForm] = useState({
    role: '', firstName: '', lastName: '', grade: '',
    email: '', username: '', password: '', confirmPassword: '',
  })

  const handleNext = () => {
    dispatch(clearError())
    setActiveStep(s => s + 1)
  }
  const handleBack = () => setActiveStep(s => s - 1)

  const handleRegister = async () => {
    const isStudent = form.role === 'student'
    const payload = {
      name:     `${form.firstName.trim()} ${form.lastName.trim()}`,
      password: form.password,
      role:     form.role,
    }
    if (isStudent) {
      payload.username = form.username.trim().toLowerCase()
      if (form.grade) payload.grade = form.grade
    } else {
      payload.email = form.email.trim()
    }

    const result = await dispatch(registerUser(payload))
    if (registerUser.fulfilled.match(result)) {
      dispatch(setTheme(result.payload.data.user.role))
      navigate(roleRoutes[result.payload.data.user.role])
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6C63FF15 0%, #FF6B3515 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2,
    }}>
      <Box sx={{ width: '100%', maxWidth: 460 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={900} sx={{
            background: 'linear-gradient(135deg, #6C63FF, #FF6B35)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            🏆 OlympQuiz
          </Typography>
          <Typography variant="body2" color="text.secondary">Create your account</Typography>
        </Box>

        <Card elevation={0} sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel><Typography variant="caption">{label}</Typography></StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Step 0 — Account Type */}
            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>I am a...</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                  {[
                    { role: 'student', icon: '🎒', label: 'Student' },
                    { role: 'teacher', icon: '📚', label: 'Teacher' },
                    { role: 'parent', icon: '👨‍👩‍👧', label: 'Parent' },
                  ].map(({ role, icon, label }) => (
                    <Button key={role} variant={form.role === role ? 'contained' : 'outlined'}
                      onClick={() => setForm(f => ({ ...f, role }))}
                      sx={{ py: 2, borderRadius: '12px', flexDirection: 'column', gap: 0.5, textTransform: 'none' }}>
                      <Typography variant="h5">{icon}</Typography>
                      <Typography variant="subtitle2" fontWeight={700}>{label}</Typography>
                    </Button>
                  ))}
                </Box>
                <Button fullWidth variant="contained" sx={{ mt: 2.5, borderRadius: '12px' }}
                  disabled={!form.role} onClick={handleNext}>Continue →</Button>
              </Box>
            )}

            {/* Step 1 — Personal Info */}
            {activeStep === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" fontWeight={700}>Personal Information</Typography>
                <TextField fullWidth label="First Name" value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
                <TextField fullWidth label="Last Name" value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
                {form.role === 'student' && (
                  <FormControl fullWidth>
                    <InputLabel>Grade</InputLabel>
                    <Select value={form.grade} label="Grade"
                      onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}>
                      {GRADES.map(g => (
                        <MenuItem key={g} value={g}>Grade {g}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5 }}>
                  <Button variant="outlined" onClick={handleBack}
                    sx={{ flex: 1, borderRadius: '12px', fontWeight: 700, py: 1.5 }}>← Back</Button>
                  <Button variant="contained" onClick={handleNext}
                    disabled={!form.firstName || !form.lastName || (form.role === 'student' && !form.grade)}
                    sx={{ flex: 1, borderRadius: '12px', fontWeight: 700, py: 1.5 }}>Continue →</Button>
                </Box>
              </Box>
            )}

            {/* Step 2 — Credentials */}
            {activeStep === 2 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" fontWeight={700}>Set Credentials</Typography>

                {error && (
                  <Alert severity="error" sx={{ borderRadius: '10px' }}>{error}</Alert>
                )}

                {form.role === 'student' ? (
                  <TextField fullWidth label="Username" value={form.username}
                    helperText="e.g. arjun123 — letters, numbers and underscore only"
                    onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                    InputProps={{ startAdornment: <InputAdornment position="start">@</InputAdornment> }} />
                ) : (
                  <TextField fullWidth label="Email Address" type="email" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                )}
                <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'} value={form.password}
                  helperText="Min 8 chars, one uppercase letter and one number"
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  InputProps={{ endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(v => !v)} edge="end" size="small">
                        {showPassword ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )}} />
                <TextField fullWidth label="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  InputProps={{ endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(v => !v)} edge="end" size="small">
                        {showConfirmPassword ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )}} />

                {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
                  <Alert severity="error" sx={{ borderRadius: '10px' }}>Passwords do not match</Alert>
                )}

                <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5 }}>
                  <Button variant="outlined" onClick={handleBack}
                    disabled={loading}
                    sx={{ flex: 1, borderRadius: '12px', fontWeight: 700, py: 1.5 }}>← Back</Button>
                  <Button variant="contained"
                    onClick={handleRegister}
                    disabled={
                      loading ||
                      (form.role === 'student' ? !form.username : !form.email) ||
                      !form.password ||
                      form.password !== form.confirmPassword
                    }
                    sx={{ flex: 1, borderRadius: '12px', fontWeight: 700, py: 1.5 }}>
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Create Account →'}
                  </Button>
                </Box>
              </Box>
            )}

            <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 2 }}>
              Already have an account?{' '}
              <RouterLink to="/login" style={{ color: '#6C63FF', fontWeight: 700, textDecoration: 'none' }}>Sign in</RouterLink>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

