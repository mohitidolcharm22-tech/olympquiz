import { useState } from 'react'
import { Box, Typography, Card, CardContent, Button, Avatar } from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import FlipRoundedIcon from '@mui/icons-material/FlipRounded'
import { useNavigate } from 'react-router-dom'

const flashcards = [
  { id: 1, front: 'What is 7 × 8?', back: '56', subject: 'Math', color: '#6C63FF' },
  { id: 2, front: 'What is a Noun?', back: 'A naming word — person, place, animal, or thing', subject: 'English', color: '#10B981' },
  { id: 3, front: 'National Bird of India?', back: 'Peacock 🦚', subject: 'GK', color: '#F59E0B' },
  { id: 4, front: 'What is 12 + 25?', back: '37', subject: 'Math', color: '#6C63FF' },
  { id: 5, front: 'What is the plural of "child"?', back: 'Children', subject: 'English', color: '#10B981' },
  { id: 6, front: 'Largest planet in solar system?', back: 'Jupiter 🪐', subject: 'GK', color: '#F59E0B' },
  { id: 7, front: '9 × 9 = ?', back: '81', subject: 'Math', color: '#6C63FF' },
  { id: 8, front: 'Capital of India?', back: 'New Delhi 🇮🇳', subject: 'GK', color: '#F59E0B' },
]

export default function FlashcardsPage() {
  const navigate = useNavigate()
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const card = flashcards[idx]

  const next = () => { setIdx(i => (i + 1) % flashcards.length); setFlipped(false) }
  const prev = () => { setIdx(i => (i - 1 + flashcards.length) % flashcards.length); setFlipped(false) }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 600, mx: 'auto' }}>
      <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>Back</Button>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>🃏 Flashcards</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Card {idx + 1} of {flashcards.length} · Click card to flip!
      </Typography>

      {/* Flashcard */}
      <Box
        onClick={() => setFlipped(f => !f)}
        sx={{
          cursor: 'pointer', mb: 3, perspective: '1000px',
          '& .card-inner': {
            position: 'relative', height: 220,
            transition: 'transform 0.5s',
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'none',
          },
          '& .card-front, & .card-back': {
            position: 'absolute', width: '100%', height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '20px', p: 3, textAlign: 'center',
          },
        }}
      >
        <Box className="card-inner">
          <Box className="card-front" sx={{ bgcolor: card.color, background: `linear-gradient(135deg, ${card.color}, ${card.color}CC)` }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, mb: 1, display: 'block' }}>
                {card.subject} · QUESTION
              </Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: 'white' }}>{card.front}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mt: 2, display: 'block' }}>
                Tap to reveal answer →
              </Typography>
            </Box>
          </Box>
          <Box className="card-back" sx={{
            bgcolor: 'white', transform: 'rotateY(180deg)',
            boxShadow: `0 8px 32px ${card.color}30`,
            border: `2px solid ${card.color}40`,
          }}>
            <Box>
              <Typography variant="caption" sx={{ color: card.color, fontWeight: 700, mb: 1, display: 'block' }}>
                ANSWER ✅
              </Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: 'text.primary' }}>{card.back}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Controls */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button variant="outlined" startIcon={<ArrowBackRoundedIcon />} onClick={prev} sx={{ borderRadius: '12px' }}>Prev</Button>
        <Button variant="outlined" startIcon={<FlipRoundedIcon />} onClick={() => setFlipped(f => !f)} sx={{ borderRadius: '12px' }}>Flip</Button>
        <Button variant="contained" endIcon={<ArrowForwardRoundedIcon />} onClick={next} sx={{ borderRadius: '12px' }}>Next</Button>
      </Box>

      {/* Progress dots */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.75, mt: 3 }}>
        {flashcards.map((_, i) => (
          <Box key={i} onClick={() => { setIdx(i); setFlipped(false) }}
            sx={{
              width: i === idx ? 24 : 8, height: 8, borderRadius: '100px',
              bgcolor: i === idx ? 'primary.main' : '#E5E7EB',
              cursor: 'pointer', transition: 'all 0.2s ease',
            }} />
        ))}
      </Box>
    </Box>
  )
}
