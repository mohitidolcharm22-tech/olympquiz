import { memo } from 'react'
import { Card, CardActionArea, CardContent, Typography, Box, LinearProgress, Chip } from '@mui/material'

function SubjectCard({ subject, progress = 0, topicsCount, onClick }) {
  return (
    <Card sx={{
      background: subject.bgGradient,
      color: 'white',
      height: '100%',
      cursor: 'pointer',
      border: 'none',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 32px ${subject.color}40` },
      transition: 'all 0.25s ease',
    }}>
      <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography sx={{ fontSize: '2.5rem', mb: 1, lineHeight: 1 }}>{subject.icon}</Typography>
          <Typography variant="h6" fontWeight={800} sx={{ color: 'white', mb: 0.25 }}>{subject.name}</Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', display: 'block', mb: 2 }}>
            {subject.description}
          </Typography>
          <Box sx={{ mb: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Progress</Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: 'white' }}>{progress}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6, borderRadius: '100px',
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': { backgroundColor: 'white', borderRadius: '100px' },
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip size="small" label={`${topicsCount ?? subject.totalTopics ?? 0} topics`}
              sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: 'white', fontSize: '0.7rem', fontWeight: 600, height: 22 }} />
            <Chip size="small" label={`${subject.totalQuizzes ?? 0} quizzes`}
              sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: 'white', fontSize: '0.7rem', fontWeight: 600, height: 22 }} />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default memo(SubjectCard)
