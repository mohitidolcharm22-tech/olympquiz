import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { Box, Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = () => { setSent(true); setTimeout(() => navigate('/otp-verification'), 2000) }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6C63FF15, #FF6B3515)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2,
    }}>
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={900} sx={{ background: 'linear-gradient(135deg, #6C63FF, #FF6B35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🏆 OlympQuiz
          </Typography>
        </Box>
        <Card elevation={0} sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 0.5 }}>🔐 Forgot Password?</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              Enter your email and we'll send you a reset OTP.
            </Typography>
            {sent && <Alert severity="success" sx={{ mb: 2, borderRadius: '10px' }}>OTP sent to your email! Redirecting...</Alert>}
            <TextField fullWidth label="Email Address" type="email" value={email}
              onChange={e => setEmail(e.target.value)} sx={{ mb: 2 }} />
            <Button fullWidth variant="contained" disabled={!email || sent}
              onClick={handleSubmit} sx={{ mb: 2, borderRadius: '12px', py: 1.5 }}>
              Send OTP
            </Button>
            <Typography variant="body2" align="center">
              <RouterLink to="/login" style={{ color: '#6C63FF', fontWeight: 700, textDecoration: 'none' }}>← Back to Login</RouterLink>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
