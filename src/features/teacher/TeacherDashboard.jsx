import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Box, Grid, Typography, Card, CardContent, Button, Avatar, Chip, List, ListItem, ListItemAvatar, ListItemText, Divider, CircularProgress, Alert } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../../components/common/StatCard'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { progressApi, classesApi, quizzesApi } from '../../services/apiCatalog'

export default function TeacherDashboard() {
  const { user } = useSelector(s => s.auth)
  const navigate = useNavigate()

  const [students, setStudents] = useState([])
  const [classes,  setClasses]  = useState([])
  const [quizzes,  setQuizzes]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    Promise.all([
      progressApi.getStudents(),
      classesApi.getAll(),
      quizzesApi.getAll(),
    ])
      .then(([sData, cData, qData]) => {
        setStudents(sData.data?.students ?? [])
        setClasses(cData.data?.classes ?? [])
        setQuizzes(qData.data?.quizzes ?? [])
      })
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  // Average score across all my students (only ones who actually took a quiz).
  const avgClassScore = useMemo(() => {
    const scored = students.filter(s => s.quizzesTaken > 0)
    if (!scored.length) return 0
    return Math.round(scored.reduce((sum, s) => sum + (s.avgScore || 0), 0) / scored.length)
  }, [students])

  // Per-class bar chart: avg of student avgScore grouped by their first class.
  const classPerformance = useMemo(() => {
    const byClass = {}
    for (const c of classes) byClass[String(c._id)] = { name: c.name, total: 0, count: 0 }
    for (const s of students) {
      if (!s.quizzesTaken) continue
      const cls = Array.isArray(s.classIds) ? s.classIds[0] : null
      const cid = String(cls?._id ?? cls ?? '')
      const slot = byClass[cid]
      if (!slot) continue
      slot.total += s.avgScore || 0
      slot.count += 1
    }
    return Object.values(byClass)
      .filter(c => c.count > 0)
      .map(c => ({ class: c.name, avg: Math.round(c.total / c.count) }))
  }, [students, classes])

  // Top 5 students by XP — quick "stars" panel in place of fake activity feed.
  const topStudents = useMemo(
    () => [...students].sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 5),
    [students],
  )

  // Quizzes the logged-in teacher actually created.
  const myQuizCount = useMemo(
    () => quizzes.filter(q => String(q.createdBy?._id ?? q.createdBy) === String(user?._id)).length,
    [quizzes, user?._id],
  )

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>
  )
  if (error) return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error" action={<Button color="inherit" size="small" onClick={load}>Retry</Button>}>{error}</Alert>
    </Box>
  )

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      {/* Welcome */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>
          Good morning, {user?.name?.split(' ').pop()}! 👋
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Here's your teaching summary for today
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatCard title="Total Students" value={students.length} icon="👥" color="#1E40AF" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="Classes" value={classes.length} icon="🏫" color="#059669" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="Quizzes Created" value={myQuizCount} icon="📝" color="#7C3AED" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="Avg. Class Score" value={`${avgClassScore}%`} icon="📊" color="#F59E0B" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Class Performance Chart */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: '16px' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>📊 Class Performance</Typography>
                <Button size="small" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/teacher/reports')}>Details</Button>
              </Box>
              <ResponsiveContainer width="100%" height={200}>
                {classPerformance.length === 0 ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography variant="body2" color="text.secondary">No class attempts yet.</Typography>
                  </Box>
                ) : (
                  <BarChart data={classPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="class" axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(val) => [`${val}%`, 'Avg. Score']} />
                    <Bar dataKey="avg" fill="#1E40AF" radius={[6, 6, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: '16px', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>⭐ Top Students</Typography>
              {topStudents.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No student data yet.</Typography>
              ) : (
                <List disablePadding>
                  {topStudents.map((s, idx) => (
                    <Box key={s._id}>
                      <ListItem
                        disablePadding
                        onClick={() => navigate(`/teacher/students/${s._id}`)}
                        sx={{ py: 1, cursor: 'pointer', borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: `${s.avatarColor || '#1E40AF'}20`, color: s.avatarColor || '#1E40AF', fontWeight: 700, width: 36, height: 36 }}>
                            {(s.name || '?').charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography variant="body2" fontWeight={600}>{s.name}</Typography>}
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">Grade {s.grade} · {s.quizzesTaken || 0} quiz{s.quizzesTaken === 1 ? '' : 'zes'}</Typography>
                              {s.avgScore > 0 && (
                                <Chip label={`${s.avgScore}%`} size="small"
                                  color={s.avgScore >= 80 ? 'success' : 'warning'}
                                  sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700 }} />
                              )}
                            </Box>
                          }
                        />
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>⚡ {s.xp || 0}</Typography>
                      </ListItem>
                      {idx < topStudents.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: '16px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>⚡ Quick Actions</Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {[
                  { label: 'Create Quiz', icon: '📝', path: '/teacher/quizzes', color: '#6C63FF' },
                  { label: 'Manage Content', icon: '📚', path: '/teacher/content', color: '#10B981' },
                  { label: 'View Reports', icon: '📊', path: '/teacher/reports', color: '#F59E0B' },
                  { label: 'Send Announcement', icon: '📢', path: '/teacher/communication', color: '#EC4899' },
                ].map(action => (
                  <Button key={action.label} variant="outlined"
                    startIcon={<Typography>{action.icon}</Typography>}
                    onClick={() => navigate(action.path)}
                    sx={{ borderRadius: '10px', borderColor: `${action.color}40`, color: action.color,
                      '&:hover': { bgcolor: `${action.color}10`, borderColor: action.color } }}>
                    {action.label}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
