import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Grid, Typography, Card, CardContent, Button, Chip, CircularProgress, Alert,
} from '@mui/material'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts'
import StatCard from '../../components/common/StatCard'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { adminApi } from '../../services/apiCatalog'

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function buildGrowthSeries(rows) {
  // Aggregate monthlyActive across all roles into a single "total" series for the last 6 months.
  const now = new Date()
  const buckets = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    buckets.push({ key, month: MONTHS_SHORT[d.getMonth()], users: 0 })
  }
  const byKey = Object.fromEntries(buckets.map(b => [b.key, b]))
  rows.forEach(r => {
    const b = byKey[r._id?.month]
    if (b) b.users += r.count
  })
  return buckets
}

export default function AdminDashboard() {
  const navigate              = useNavigate()
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    let alive = true
    setLoading(true)
    adminApi.getStats()
      .then(res => { if (alive) setStats(res?.data || null) })
      .catch(e => { if (alive) setError(e?.response?.data?.message || 'Failed to load dashboard.') })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  const growth = useMemo(() => stats ? buildGrowthSeries(stats.monthlyActive || []) : [], [stats])
  const engagement = useMemo(() => {
    if (!stats) return []
    return (stats.subjectEngagement || []).slice(0, 7).map(s => ({
      day: s.subject,
      sessions: s.attempts,
    }))
  }, [stats])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !stats) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || 'No data available.'}</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>Admin Console 🛡️</Typography>
        <Typography variant="body2" color="text.secondary">Platform overview and management</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}><StatCard title="Total Users"     value={stats.users.total}    icon="👥" color="#1E293B" /></Grid>
        <Grid item xs={6} sm={3}><StatCard title="Students"        value={stats.users.student}  icon="🎒" color="#3B82F6" /></Grid>
        <Grid item xs={6} sm={3}><StatCard title="Teachers"        value={stats.users.teacher}  icon="📚" color="#10B981" /></Grid>
        <Grid item xs={6} sm={3}><StatCard title="Avg Quiz Score"  value={`${stats.attempts.avgScore}%`} icon="🎯" color="#F59E0B" /></Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: '10px' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>📈 Active Users (Last 6 Months)</Typography>
                <Button size="small" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/admin/analytics')}>Analytics</Button>
              </Box>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={growth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: '10px', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>📊 Content Stats</Typography>
                <Button size="small" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/admin/moderation')}>Moderate</Button>
              </Box>
              {[
                { label: 'Total Quizzes',        value: stats.content.quizzesTotal,    icon: '📝', color: '#3B82F6' },
                { label: 'Approved Quizzes',     value: stats.content.quizzesApproved, icon: '✅', color: '#10B981' },
                { label: 'Pending Approvals',    value: stats.content.pendingTotal,    icon: '⏳', color: '#F59E0B' },
                { label: 'Lessons Published',    value: stats.content.lessons,         icon: '📚', color: '#6C63FF' },
              ].map(s => (
                <Box key={s.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{s.icon}</Typography>
                    <Typography variant="body2">{s.label}</Typography>
                  </Box>
                  <Chip label={s.value} size="small" sx={{ bgcolor: `${s.color}15`, color: s.color, fontWeight: 700, fontSize: '0.8rem' }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '10px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>⚡ Quiz Attempts by Subject</Typography>
              {engagement.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No quiz attempts recorded yet.</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={engagement}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#1E293B" radius={[4, 4, 0, 0]} name="Attempts" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '10px', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>🎯 Quiz Performance</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Total Attempts</Typography>
                  <Typography variant="h5" fontWeight={800}>{stats.attempts.total}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Pass Rate</Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ color: '#10B981' }}>{stats.attempts.passRate}%</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Average Score</Typography>
                  <Typography variant="h5" fontWeight={800}>{stats.attempts.avgScore}%</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Active Users</Typography>
                  <Typography variant="h5" fontWeight={800}>{stats.users.active}</Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button size="small" variant="outlined" onClick={() => navigate('/admin/users')}>Manage Users</Button>
                <Button size="small" variant="outlined" onClick={() => navigate('/admin/moderation')}>Review Queue</Button>
                <Button size="small" variant="outlined" onClick={() => navigate('/admin/feedback')}>Feedback</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
