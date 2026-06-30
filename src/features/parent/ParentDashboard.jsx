import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Box, Grid, Typography, Card, CardContent, Avatar, Chip, LinearProgress, Button, Divider, CircularProgress } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../../components/common/StatCard'
import { progressApi } from '../../services/apiCatalog'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Builds the last-7-days quiz attempt count across every child, ordered
// Mon → Sun for display.
function buildWeeklyActivity(children) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // bucket by yyyy-mm-dd for the last 7 days (today inclusive)
  const buckets = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i)
    buckets.push({
      key:    d.toISOString().slice(0, 10),
      day:    DAY_LABELS[d.getDay()],
      quizzes: 0,
    })
  }
  const idxByKey = Object.fromEntries(buckets.map((b, i) => [b.key, i]))

  for (const c of children || []) {
    for (const a of (c.recentAttempts || [])) {
      const key = new Date(a.completedAt).toISOString().slice(0, 10)
      if (key in idxByKey) buckets[idxByKey[key]].quizzes++
    }
  }
  return buckets
}

export default function ParentDashboard() {
  const { user } = useSelector(s => s.auth)
  const navigate = useNavigate()
  const [children, setChildren] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    progressApi.getMyChildren()
      .then(data => setChildren(data.data.children ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>

  const weeklyActivity = buildWeeklyActivity(children)

  const avgScore = children.length
    ? Math.round(children.reduce((sum, c) => {
        const attempts = c.recentAttempts ?? []
        return sum + (attempts.length ? attempts.reduce((s, a) => s + a.score, 0) / attempts.length : 0)
      }, 0) / children.length)
    : 0

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>Welcome, {user?.name?.split(' ').pop()}! 👋</Typography>
        <Typography variant="body2" color="text.secondary">Monitor your children's learning progress</Typography>
      </Box>

      {/* Children Cards */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="h6" fontWeight={700}>👶 My Children</Typography>
        <Button size="small" variant="outlined" onClick={() => navigate('/parent/child-progress')}
          sx={{ borderRadius: '10px' }}>+ Link Child</Button>
      </Box>

      {children.length === 0 ? (
        <Card sx={{ borderRadius: '16px', textAlign: 'center', py: 5, mb: 3 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>👨‍👩‍👧</Typography>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>No children linked yet</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Link your child's account to start monitoring their progress.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/parent/child-progress')} sx={{ borderRadius: '10px' }}>
            Link a Child
          </Button>
        </Card>
      ) : (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {children.map(child => {
            const attempts = child.recentAttempts ?? []
            const childAvg = attempts.length ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length) : null
            return (
              <Grid item xs={12} sm={6} md={4} key={child._id}>
                <Card sx={{
                  borderRadius: '16px', cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-2px)' }, transition: 'all 0.2s',
                }} onClick={() => navigate('/parent/child-progress')}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <Avatar sx={{ bgcolor: child.avatarColor || '#0F766E', fontWeight: 700, width: 48, height: 48 }}>
                        {child.name?.[0]?.toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700}>{child.name}</Typography>
                        <Typography variant="caption" color="text.secondary">Grade {child.grade} · Level {child.level}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip label={`⚡ ${child.xp} XP`} size="small"
                        sx={{ bgcolor: '#8B5CF620', color: '#8B5CF6', fontWeight: 600, fontSize: '0.7rem' }} />
                      <Chip label={`📝 ${attempts.length} quizzes`} size="small"
                        sx={{ bgcolor: '#0F766E20', color: '#0F766E', fontWeight: 600, fontSize: '0.7rem' }} />
                    </Box>

                    {childAvg !== null && (
                      <Box sx={{ mb: 0.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">Avg. Quiz Score</Typography>
                          <Typography variant="caption" fontWeight={700} color="primary.main">{childAvg}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={childAvg}
                          color={childAvg >= 80 ? 'success' : 'warning'}
                          sx={{ height: 6, borderRadius: '100px', '& .MuiLinearProgress-bar': { borderRadius: '100px' } }} />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4}>
          <StatCard title="Total Children" value={children.length} icon="👶" color="#0F766E" />
        </Grid>
        <Grid item xs={6} sm={4}>
          <StatCard title="Avg. Score" value={children.length ? `${avgScore}%` : 'N/A'} icon="🎯" color="#7C3AED" />
        </Grid>
        <Grid item xs={6} sm={4}>
          <StatCard title="Badges Earned" value={children.reduce((sum, c) => sum + (c.badges?.length || 0), 0)} icon="🏅" color="#EC4899" />
        </Grid>
      </Grid>

      {/* Weekly Activity Chart */}
      <Card sx={{ borderRadius: '16px', mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>📅 This Week's Activity</Typography>
            <Button size="small" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/parent/reports')}>Full Report</Button>
          </Box>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0FDFA" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="quizzes" fill="#7C3AED" radius={[4, 4, 0, 0]} name="Quizzes" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {children.length > 0 && (
        <Card sx={{ borderRadius: '16px' }}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>🌟 Recent Achievements</Typography>
            {children.every(c => !c.badges?.length) ? (
              <Typography variant="body2" color="text.secondary">
                No achievements yet — keep encouraging your child to complete quizzes!
              </Typography>
            ) : (
              children.flatMap(c => (c.badges ?? []).map(badge => ({ child: c.name, badge }))).slice(0, 5)
                .map((a, idx, arr) => (
                  <Box key={idx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                      <Typography sx={{ fontSize: '1.5rem' }}>🏅</Typography>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2">
                          <strong>{a.child}</strong> earned the <strong>"{a.badge}"</strong> badge!
                        </Typography>
                      </Box>
                      <Chip label="Badge" size="small" color="success" sx={{ fontWeight: 700, fontSize: '0.65rem' }} />
                    </Box>
                    {idx < arr.length - 1 && <Divider />}
                  </Box>
                ))
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
