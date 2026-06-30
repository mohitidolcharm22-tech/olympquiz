import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { Box, Typography, Grid, Card, CardContent, Avatar, Chip, LinearProgress, CircularProgress } from '@mui/material'
import BadgeCard from '../../components/common/BadgeCard'
import { badgeDefinitions as FALLBACK_BADGES } from '../../data/index'
import { progressApi, badgeCatalogApi } from '../../services/apiCatalog'
import { formatDate } from '../../utils/date'

export default function AchievementsPage() {
  const { user } = useSelector(s => s.auth)
  const earnedBadges = new Set(user?.badges || [])

  const [progress, setProgress]     = useState(null)
  const [badgeDefs, setBadgeDefs]   = useState(FALLBACK_BADGES)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([
      progressApi.getMyProgress(),
      badgeCatalogApi.getAll(),
    ])
      .then(([progressData, catalogData]) => {
        setProgress(progressData.data)
        if (catalogData.data.badges?.length) setBadgeDefs(catalogData.data.badges)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const teacherBadges = progress?.user?.teacherBadges ?? []

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>🏅 Achievements</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {earnedBadges.size} of {badgeDefs.length} badges earned
      </Typography>
      <LinearProgress variant="determinate"
        value={Math.round((earnedBadges.size / badgeDefs.length) * 100)}
        sx={{ mb: 3, height: 10, borderRadius: '100px', '& .MuiLinearProgress-bar': { borderRadius: '100px' } }} />

      {/* Level & XP Card */}
      <Card sx={{
        background: 'linear-gradient(135deg, #6C63FF, #A78BFA)',
        color: 'white', borderRadius: '20px', mb: 3, border: 'none',
      }}>
        <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" fontWeight={900} sx={{ color: 'white', lineHeight: 1 }}>
              {user?.level}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>LEVEL</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: 'white', mb: 0.25 }}>{user?.name}</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>⚡ {user?.xp?.toLocaleString()} XP Total</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip label={`🏆 ${earnedBadges.size} badges earned`} size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* All Badges */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>All Badges</Typography>
      <Grid container spacing={2}>
        {badgeDefs.map(badge => {
          const earned = earnedBadges.has(badge._id || badge.id)
          return (
            <Grid item xs={6} sm={4} md={3} key={badge._id || badge.id}>
              <Card sx={{
                textAlign: 'center', p: 2,
                opacity: earned ? 1 : 0.5,
                filter: earned ? 'none' : 'grayscale(100%)',
                border: earned ? `2px solid ${badge.id === 'quiz-master' ? '#FFD700' : 'divider'}` : '1px solid divider',
              }}>
                <BadgeCard badgeId={badge.id} size="xl" showLabel={false} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 1, mb: 0.25 }}>{badge.name}</Typography>
                <Typography variant="caption" color="text.secondary">{badge.description}</Typography>
                {earned && <Chip label="Earned!" size="small" color="success" sx={{ mt: 1, height: 20, fontSize: '0.65rem', fontWeight: 700 }} />}
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Teacher-awarded badges */}
      {!loading && teacherBadges.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>🎖️ Awarded by Teacher</Typography>
          <Grid container spacing={2}>
            {teacherBadges.map((tb, i) => {
              const def = badgeDefs.find(b => b._id === tb.badgeId || b.id === tb.badgeId)
              return (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Card sx={{
                    p: 2, borderRadius: '16px', display: 'flex', alignItems: 'flex-start', gap: 2,
                    border: `2px solid ${def?.color || '#6C63FF'}30`,
                    background: `linear-gradient(135deg, ${def?.color || '#6C63FF'}08, white)`,
                  }}>
                    <Typography sx={{ fontSize: '2.2rem', lineHeight: 1, flexShrink: 0 }}>{def?.icon || '🏅'}</Typography>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>{def?.name || tb.badgeId}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {def?.description}
                      </Typography>
                      {tb.note && (
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: def?.color || '#6C63FF', fontStyle: 'italic' }}>
                          "{tb.note}"
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
                        Awarded by {tb.awardedBy?.name || 'Teacher'} · {formatDate(tb.awardedAt)}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Box>
      )}
    </Box>
  )
}
