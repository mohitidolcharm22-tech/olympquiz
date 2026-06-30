import { memo } from 'react'
import { Box, Avatar, Typography, Tooltip } from '@mui/material'

const badgeColors = {
  'quiz-master': '#FFD700', 'fast-learner': '#F59E0B', 'curious-learner': '#10B981',
  'streak-5': '#EF4444', 'streak-7': '#F97316', 'streak-10': '#8B5CF6',
  'streak-15': '#EC4899', 'streak-21': '#FFD700', 'math-wizard': '#6C63FF',
  'english-star': '#10B981', 'top-scorer': '#FFD700', 'consistent': '#0EA5E9',
  'first-quiz': '#6C63FF',
}

const badgeIcons = {
  'quiz-master': '🏆', 'fast-learner': '⚡', 'curious-learner': '🔍',
  'streak-5': '🔥', 'streak-7': '🗓️', 'streak-10': '💪',
  'streak-15': '⭐', 'streak-21': '👑', 'math-wizard': '🧮',
  'english-star': '📖', 'top-scorer': '🥇', 'consistent': '📅',
  'first-quiz': '🎯',
}

const badgeNames = {
  'quiz-master': 'Quiz Master', 'fast-learner': 'Fast Learner', 'curious-learner': 'Curious Mind',
  'streak-5': 'On Fire!', 'streak-7': 'Week Warrior', 'streak-10': 'Persistent Pro',
  'streak-15': 'Dedication Star', 'streak-21': '3-Week Champ', 'math-wizard': 'Math Wizard',
  'english-star': 'English Star', 'top-scorer': 'Top Scorer', 'consistent': 'Consistent',
  'first-quiz': 'First Quiz!',
}

export default memo(function BadgeCard({ badgeId, size = 'md', showLabel = false }) {
  const sizes = { sm: 32, md: 44, lg: 64, xl: 80 }
  const fontSizes = { sm: '1rem', md: '1.4rem', lg: '2rem', xl: '2.5rem' }
  const s = sizes[size] || 44

  return (
    <Tooltip title={badgeNames[badgeId] || badgeId} placement="top">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
        <Avatar sx={{
          width: s, height: s,
          bgcolor: `${badgeColors[badgeId] || '#6C63FF'}20`,
          fontSize: fontSizes[size] || '1.4rem',
          border: `2px solid ${badgeColors[badgeId] || '#6C63FF'}40`,
          boxShadow: `0 2px 8px ${badgeColors[badgeId] || '#6C63FF'}30`,
        }}>
          {badgeIcons[badgeId] || '🏅'}
        </Avatar>
        {showLabel && (
          <Typography variant="caption" align="center" fontWeight={600} sx={{ fontSize: '0.65rem', maxWidth: s }}>
            {badgeNames[badgeId] || badgeId}
          </Typography>
        )}
      </Box>
    </Tooltip>
  )
})
