import {
  Box, Typography, Grid, Card, CardContent, CircularProgress, Alert,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts'
import StatCard from '../../components/common/StatCard'
import { adminApi } from '../../services/apiCatalog'

const ROLE_COLORS = {
  student: '#3B82F6',
  teacher: '#10B981',
  parent:  '#0F766E',
  admin:   '#6C63FF',
}

const CATEGORY_COLORS = ['#6C63FF', '#10B981', '#F59E0B', '#EC4899', '#EF4444', '#3B82F6', '#0F766E']

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function buildMonthlySeries(rows) {
  // rows: [{ _id: { month: 'YYYY-MM', role: 'student' }, count }]
  // Pivot to: [{ month: 'Jun', students, teachers, parents }] for the last 6 calendar months.
  const now = new Date()
  const buckets = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    buckets.push({
      key,
      month:    MONTHS_SHORT[d.getMonth()],
      students: 0, teachers: 0, parents: 0,
    })
  }
  const byKey = Object.fromEntries(buckets.map(b => [b.key, b]))
  rows.forEach(r => {
    const b = byKey[r._id?.month]
    if (!b) return
    const role = r._id?.role
    if (role === 'student') b.students += r.count
    else if (role === 'teacher') b.teachers += r.count
    else if (role === 'parent')  b.parents  += r.count
  })
  return buckets
}

export default function AdminAnalyticsPage() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    let alive = true
    setLoading(true)
    adminApi.getStats()
      .then(res => { if (alive) setStats(res?.data || null) })
      .catch(e => { if (alive) setError(e?.response?.data?.message || 'Failed to load analytics.') })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  const usersByRole = useMemo(() => {
    if (!stats) return []
    return [
      { role: 'Students', count: stats.users.student, color: ROLE_COLORS.student },
      { role: 'Teachers', count: stats.users.teacher, color: ROLE_COLORS.teacher },
      { role: 'Parents',  count: stats.users.parent,  color: ROLE_COLORS.parent  },
      { role: 'Admins',   count: stats.users.admin,   color: ROLE_COLORS.admin   },
    ].filter(r => r.count > 0)
  }, [stats])

  const monthly = useMemo(() => stats ? buildMonthlySeries(stats.monthlyActive || []) : [], [stats])

  const feedbackData = useMemo(() => {
    if (!stats) return []
    return (stats.feedbackByCategory || []).map((f, i) => ({
      category: f.category,
      count:    f.count,
      color:    CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    }))
  }, [stats])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  if (!stats) return null

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>📊 Platform Analytics</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Comprehensive platform usage and engagement metrics
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatCard title="Total Users"      value={stats.users.total}            icon="👥" color="#1E293B" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="Quiz Attempts"    value={stats.attempts.total}         icon="📝" color="#3B82F6" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="Avg Quiz Score"   value={`${stats.attempts.avgScore}%`} icon="🎯" color="#10B981" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="Pending Review"   value={stats.content.pendingTotal}   icon="⏳" color="#F59E0B" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: '8px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>👥 Monthly Active Users</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="students" stroke={ROLE_COLORS.student} strokeWidth={2} name="Students" />
                  <Line type="monotone" dataKey="teachers" stroke={ROLE_COLORS.teacher} strokeWidth={2} name="Teachers" />
                  <Line type="monotone" dataKey="parents"  stroke={ROLE_COLORS.parent}  strokeWidth={2} name="Parents" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '8px', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>🥧 User Distribution</Typography>
              {usersByRole.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No users yet.</Typography>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={usersByRole} cx="50%" cy="50%" outerRadius={70} dataKey="count">
                        {usersByRole.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    {usersByRole.map(u => (
                      <Box key={u.role} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: u.color }} />
                          <Typography variant="caption">{u.role}</Typography>
                        </Box>
                        <Typography variant="caption" fontWeight={700}>{u.count}</Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '8px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>📚 Subject Engagement</Typography>
              {(!stats.subjectEngagement || stats.subjectEngagement.length === 0) ? (
                <Typography variant="body2" color="text.secondary">No quiz attempts yet.</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.subjectEngagement}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attempts" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Attempts" />
                    <Bar dataKey="avgScore" fill="#10B981" radius={[4, 4, 0, 0]} name="Avg Score %" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '8px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>💬 Feedback by Category</Typography>
              {feedbackData.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No feedback yet.</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={feedbackData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis type="number" axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} width={120} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {feedbackData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: '8px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>📦 Content Library</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">Total Quizzes</Typography>
                  <Typography variant="h5" fontWeight={800}>{stats.content.quizzesTotal}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">Approved</Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ color: '#10B981' }}>{stats.content.quizzesApproved}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">Pending</Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ color: '#F59E0B' }}>{stats.content.quizzesPending}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary">Lessons</Typography>
                  <Typography variant="h5" fontWeight={800}>{stats.content.lessons}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
