import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Box, Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material'
import { demoLogin } from '../../store/slices/authSlice'
import { setTheme } from '../../store/slices/uiSlice'

export default function OTPVerificationPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [verified, setVerified] = useState(false)
  const refs = useRef([])

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[idx] = val
    setOtp(next)
    if (val && idx < 5) refs.current[idx + 1]?.focus()
  }

  const handleVerify = () => {
    setVerified(true)
    setTimeout(() => {
      dispatch(demoLogin('student'))
      dispatch(setTheme('student'))
      navigate('/student/dashboard')
    }, 1500)
  }

  const otpCode = otp.join('')

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6C63FF15, #FF6B3515)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2,
    }}>
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Card elevation={0} sx={{ borderRadius: '20px', border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h2" sx={{ mb: 1 }}>📱</Typography>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>OTP Verification</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter the 6-digit code sent to your email
            </Typography>

            {verified && <Alert severity="success" sx={{ mb: 2, borderRadius: '10px' }}>✅ Verified! Logging you in...</Alert>}

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
              {otp.map((val, idx) => (
                <TextField key={idx}
                  inputRef={el => refs.current[idx] = el}
                  value={val} onChange={e => handleChange(idx, e.target.value)}
                  inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, padding: '12px 0' } }}
                  sx={{ width: 48, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              ))}
            </Box>

            <Button fullWidth variant="contained" disabled={otpCode.length < 6 || verified}
              onClick={handleVerify} sx={{ borderRadius: '12px', py: 1.5, mb: 2 }}>
              Verify OTP
            </Button>

            <Typography variant="body2" color="text.secondary">
              Didn't receive?{' '}
              <Button variant="text" size="small" sx={{ textTransform: 'none', fontWeight: 700, p: 0 }}>Resend OTP</Button>
            </Typography>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              (Demo: enter any 6 digits)
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
