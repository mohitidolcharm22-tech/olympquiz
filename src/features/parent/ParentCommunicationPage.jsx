import { useState } from 'react'
import {
  Box, Typography, Card, CardContent, Button, TextField, Chip, Alert,
} from '@mui/material'
import { feedbackApi } from '../../services/apiCatalog'

const CATEGORIES = ['Content Quality', 'Quiz Quality', 'App Experience', 'Suggestions', 'Bug Reports']

export default function ParentCommunicationPage() {
  const [feedback, setFeedback] = useState({ category: 'Content Quality', message: '', rating: 5 })
  const [status, setStatus]     = useState('')   // '' | 'sending' | 'success' | 'error'
  const [errMsg, setErrMsg]     = useState('')

  const handleSubmit = async () => {
    setStatus('sending')
    setErrMsg('')
    try {
      await feedbackApi.create({
        category: feedback.category,
        comment:  feedback.message,
        rating:   feedback.rating,
      })
      setStatus('success')
      setFeedback(f => ({ ...f, message: '' }))
    } catch (err) {
      setErrMsg(err?.response?.data?.message ?? 'Failed to submit feedback. Please try again.')
      setStatus('error')
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>💡 Send Feedback</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Share your thoughts with our team to help improve the platform for your children.
      </Typography>

      <Card sx={{ borderRadius: '16px' }}>
        <CardContent sx={{ p: 3 }}>
          {/* Rating */}
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Your Rating</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
            {[1, 2, 3, 4, 5].map(star => (
              <Typography key={star} sx={{ fontSize: '2rem', cursor: 'pointer', opacity: star <= feedback.rating ? 1 : 0.3 }}
                onClick={() => setFeedback(f => ({ ...f, rating: star }))}>
                ⭐
              </Typography>
            ))}
          </Box>

          {/* Category */}
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>Category</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
            {CATEGORIES.map(cat => (
              <Chip key={cat} label={cat} onClick={() => setFeedback(f => ({ ...f, category: cat }))}
                color={feedback.category === cat ? 'primary' : 'default'}
                variant={feedback.category === cat ? 'filled' : 'outlined'}
                sx={{ fontWeight: 600, cursor: 'pointer' }} />
            ))}
          </Box>

          {/* Message */}
          <TextField fullWidth multiline rows={4} label="Your Message"
            value={feedback.message}
            onChange={e => setFeedback(f => ({ ...f, message: e.target.value }))}
            sx={{ mb: 2 }} />

          {/* Status messages */}
          {status === 'success' && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: '10px' }}>
              ✅ Thank you! Your feedback has been sent to our team.
            </Alert>
          )}
          {status === 'error' && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>{errMsg}</Alert>
          )}

          <Button fullWidth variant="contained"
            disabled={!feedback.message || status === 'sending'}
            onClick={handleSubmit}
            sx={{ borderRadius: '10px', py: 1.25 }}>
            {status === 'sending' ? 'Sending…' : 'Submit Feedback'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}
