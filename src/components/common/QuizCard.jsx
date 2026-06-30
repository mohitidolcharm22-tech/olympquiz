import { memo } from 'react'
import { Card, CardContent, CardActionArea, Typography, Box, Chip, Avatar } from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'

function QuizCard({ quiz, onClick, compact = false }) {
  const difficultyColors = { easy: 'success', medium: 'warning', hard: 'error' }
  const completed = !!quiz.completed
  const assigned  = Array.isArray(quiz.assignedClassIds) && quiz.assignedClassIds.length > 0

  return (
    <Card sx={{ height: '100%', cursor: 'pointer', opacity: completed ? 0.85 : 1, position: 'relative',
      outline: completed ? '2px solid #10B981' : 'none' }}>
      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, display: 'flex', gap: 0.5 }}>
        {assigned && !completed && (
          <Chip icon={<AssignmentRoundedIcon sx={{ fontSize: '0.9rem !important' }} />}
            label="Assigned" size="small" color="primary"
            sx={{ fontWeight: 700, fontSize: '0.65rem', height: 22 }} />
        )}
        {completed && (
          <Chip icon={<CheckCircleRoundedIcon sx={{ fontSize: '0.9rem !important' }} />}
            label="Completed" size="small" color="success"
            sx={{ fontWeight: 700, fontSize: '0.65rem', height: 22 }} />
        )}
      </Box>
      <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
            <Avatar sx={{
              width: 44, height: 44, fontSize: '1.4rem', borderRadius: '12px',
              bgcolor: typeof quiz.subjectId === 'object'
              ? (quiz.subjectId?.name?.toLowerCase().includes('math') ? '#6C63FF20'
                : quiz.subjectId?.name?.toLowerCase().includes('english') ? '#10B98120' : '#F59E0B20')
              : (quiz.subjectId === 'sub-math' ? '#6C63FF20' : quiz.subjectId === 'sub-eng' ? '#10B98120' : '#F59E0B20'),
            }}>
              {quiz.icon || quiz.subjectId?.icon || '📝'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0, pr: (completed || assigned) ? 9 : 0 }}>
              <Typography variant="subtitle2" fontWeight={700} noWrap>{quiz.title}</Typography>
              {!compact && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                  {quiz.totalQuestions ?? 0} questions · {quiz.durationMinutes} min
                </Typography>
              )}
            </Box>
          </Box>
          {!compact && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.8rem' }} noWrap>
              {quiz.description}
            </Typography>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Chip label={quiz.difficulty} size="small" color={difficultyColors[quiz.difficulty]}
              variant="outlined" sx={{ fontWeight: 600, fontSize: '0.7rem', height: 22 }} />
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {completed ? '✅ Done' : `🏆 ${quiz.xpReward} XP`}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default memo(QuizCard)
