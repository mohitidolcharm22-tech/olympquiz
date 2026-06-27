import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Box, Typography, Grid, Card, CardContent, Avatar, Chip, CircularProgress, Alert } from '@mui/material'
import { quizzesApi } from '../../services/apiCatalog'

export default function LeaderboardPage() {
  const { user } = useSelector(s => s.auth)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')

  useEffect(() => {
    quizzesApi.getLeaderboard()
      .then(data => setLeaderboard(data.data.leaderboard))
      .catch(() => setError('Failed to load leaderboard.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
      <CircularProgress />
    </Box>
  )

  if (error) return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error">{error}</Alert>
    </Box>
  )

  const topThree = leaderboard.slice(0, 3)
  const rest     = leaderboard.slice(3)

  const medals       = ['🥇', '🥈', '🥉']
  const podiumColors = ['#FFD700', '#C0C0C0', '#CD7F32']
  const podiumBg     = [
    'linear-gradient(135deg, #FFD70020, #FFD70010)',
    'linear-gradient(135deg, #C0C0C020, #C0C0C010)',
    'linear-gradient(135deg, #CD7F3220, #CD7F3210)',
  ]

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>🏆 Leaderboard</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Top learners this month</Typography>

      {/* Podium – Top 3 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[1, 0, 2].map(rankIdx => {
          const entry = topThree[rankIdx]
          if (!entry) return null
          return (
            <Grid item xs={4} key={entry._id}>
              <Card sx={{
                background: podiumBg[rankIdx],
                border: `2px solid ${podiumColors[rankIdx]}40`,
                textAlign: 'center',
                py: rankIdx === 0 ? 3 : 2,
              }}>
                <CardContent sx={{ p: 1.5 }}>
                  <Typography sx={{ fontSize: rankIdx === 0 ? '2rem' : '1.5rem' }}>
                    {medals[rankIdx]}
                  </Typography>
                  <Avatar sx={{
                    mx: 'auto', mb: 1,
                    bgcolor: entry.avatarColor || 'primary.main',
                    fontWeight: 700,
                    width: rankIdx === 0 ? 52 : 40,
                    height: rankIdx === 0 ? 52 : 40,
                    border: `3px solid ${podiumColors[rankIdx]}`,
                  }}>
                    {entry.name?.[0]?.toUpperCase()}
                  </Avatar>
                  <Typography variant="caption" fontWeight={700} sx={{ display: 'block' }} noWrap>
                    {entry.name?.split(' ')[0]}
                  </Typography>
                  <Typography variant="caption" sx={{ color: podiumColors[rankIdx], fontWeight: 800 }}>
                    {entry.xp?.toLocaleString()} XP
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Remaining Rankings */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {rest.map(entry => {
          const isMe = entry._id === user?._id
          return (
            <Card key={entry._id} sx={{
              border: isMe ? '2px solid' : '1px solid',
              borderColor: isMe ? 'primary.main' : 'divider',
              bgcolor: isMe ? 'primary.50' : 'background.paper',
            }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="h6" fontWeight={800} sx={{ width: 28, flexShrink: 0, color: 'text.secondary' }}>
                    {entry.rank}
                  </Typography>
                  <Avatar sx={{ bgcolor: entry.avatarColor || 'primary.main', fontWeight: 700, width: 38, height: 38, flexShrink: 0 }}>
                    {entry.name?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Typography variant="subtitle2" fontWeight={700} noWrap>{entry.name}</Typography>
                      {isMe && (
                        <Chip label="You" size="small" color="primary" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }} />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Level {entry.level}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                    <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                      {entry.xp?.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">XP</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )
        })}
      </Box>
    </Box>
  )
}
