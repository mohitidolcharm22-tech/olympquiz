import { Box, Typography, Grid, Card, CardContent, Avatar, Chip, LinearProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, IconButton, CircularProgress, Alert, TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, Snackbar } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import StatCard from '../../components/common/StatCard'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import { progressApi } from '../../services/apiCatalog'
import { formatDate } from '../../utils/date'

export default function TeacherReportsPage() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')
  const [viewStudent, setViewStudent] = useState(null)
  const [studentDetail, setStudentDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [badgeToAward, setBadgeToAward] = useState('')
  const [awardingBadge, setAwardingBadge] = useState(false)
  const [snackbar, setSnackbar] = useState('')

  useEffect(() => {
    progressApi.getStudents()
      .then(data => setStudents(data.data.students))
      .catch(() => setError('Failed to load student data.'))
      .finally(() => setLoading(false))
  }, [])

  const openDetail = (student) => {
    setViewStudent(student)
    setStudentDetail(null)
    setBadgeToAward('')
    setDetailLoading(true)
    progressApi.getStudentProgress(student._id)
      .then(data => setStudentDetail(data.data))
      .catch(() => setStudentDetail(null))
      .finally(() => setDetailLoading(false))
  }

  const handleAwardBadge = () => {
    if (!badgeToAward || !viewStudent) return
    setAwardingBadge(true)
    progressApi.awardBadge(viewStudent._id, badgeToAward)
      .then(() => {
        setSnackbar(`🏅 Badge "${badgeToAward}" awarded to ${viewStudent.name}!`)
        setBadgeToAward('')
      })
      .catch(() => setSnackbar('Failed to award badge.'))
      .finally(() => setAwardingBadge(false))
  }

  const filtered = students.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || String(s.grade).includes(search)
  )

  // Derived stats
  const avgScore    = filtered.length ? Math.round(filtered.reduce((s, x) => s + (x.avgScore || 0), 0) / filtered.length) : 0
  const totalTaken  = filtered.reduce((s, x) => s + (x.quizzesTaken || 0), 0)
  const totalPassed = filtered.reduce((s, x) => s + (x.quizzesPassed || 0), 0)
  const passRate    = totalTaken > 0 ? Math.round((totalPassed / totalTaken) * 100) : 0

  // Score distribution from real data
  const buckets = [
    { name: 'A+ (90-100)', min: 90, max: 100, color: '#10B981' },
    { name: 'A (80-89)',   min: 80, max: 89,  color: '#3B82F6' },
    { name: 'B (70-79)',   min: 70, max: 79,  color: '#F59E0B' },
    { name: 'C (60-69)',   min: 60, max: 69,  color: '#F97316' },
    { name: 'F (<60)',     min: 0,  max: 59,  color: '#EF4444' },
  ]
  const scoreDistribution = buckets.map(b => ({
    ...b,
    value: filtered.filter(s => s.avgScore >= b.min && s.avgScore <= b.max).length,
  }))

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>📊 Reports & Analytics</Typography>
          <Typography variant="body2" color="text.secondary">Track student performance and learning progress</Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}><StatCard title="Students" value={students.length} icon="👥" color="#1E40AF" /></Grid>
        <Grid item xs={6} sm={3}><StatCard title="Avg. Score" value={`${avgScore}%`} icon="🎯" color="#10B981" /></Grid>
        <Grid item xs={6} sm={3}><StatCard title="Quizzes Taken" value={totalTaken} icon="📝" color="#F59E0B" /></Grid>
        <Grid item xs={6} sm={3}><StatCard title="Pass Rate" value={`${passRate}%`} icon="✅" color="#EC4899" /></Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Score Distribution */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: '16px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>🎯 Score Distribution</Typography>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={scoreDistribution.filter(b => b.value > 0)} cx="50%" cy="50%"
                    innerRadius={50} outerRadius={80} dataKey="value">
                    {scoreDistribution.filter(b => b.value > 0).map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTip formatter={(val) => [val, 'Students']} />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {scoreDistribution.map(s => (
                  <Chip key={s.name} label={`${s.name}: ${s.value}`} size="small"
                    sx={{ bgcolor: s.color + '20', color: s.color, fontWeight: 600, fontSize: '0.65rem' }} />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top performers bar chart */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: '16px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>🏆 Top Students by XP</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={[...students].sort((a, b) => b.xp - a.xp).slice(0, 8).map(s => ({ name: s.name.split(' ')[0], xp: s.xp }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <RechartsTip formatter={(val) => [`${val} XP`, 'XP']} />
                  <Bar dataKey="xp" fill="#1E40AF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Student Table */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: '16px' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 2 }}>
                <Typography variant="h6" fontWeight={700}>👥 Student Performance</Typography>
                <TextField size="small" placeholder="Search by name or grade…"
                  value={search} onChange={e => setSearch(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
              </Box>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {filtered.map(student => (
                    <Box key={student._id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: student.avatarColor || '#6C63FF', fontWeight: 700, width: 36, height: 36, flexShrink: 0 }}>
                        {student.name?.[0]?.toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.25 }}>
                          <Typography variant="body2" fontWeight={600}>{student.name}</Typography>
                          <Typography variant="body2" fontWeight={700}>{student.avgScore}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={student.avgScore || 0}
                          color={student.avgScore >= 80 ? 'success' : student.avgScore >= 60 ? 'warning' : 'error'}
                          sx={{ height: 6, borderRadius: '100px', '& .MuiLinearProgress-bar': { borderRadius: '100px' } }} />
                      </Box>
                      <Chip label={`Grade ${student.grade}`} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem', flexShrink: 0 }} />
                      <Chip label={`${student.quizzesTaken} quizzes`} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.7rem', flexShrink: 0 }} />
                      <Tooltip title="View detailed report">
                        <IconButton size="small" onClick={() => openDetail(student)}>
                          <VisibilityRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}
                  {filtered.length === 0 && !loading && (
                    <Typography color="text.secondary" align="center" sx={{ py: 3 }}>No students found</Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Student Detail Dialog ── */}
      <Dialog open={Boolean(viewStudent)} onClose={() => setViewStudent(null)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: viewStudent?.avatarColor || '#6C63FF', fontWeight: 700 }}>
              {viewStudent?.name?.[0]?.toUpperCase()}
            </Avatar>
            {viewStudent?.name} — Report
          </Box>
        </DialogTitle>
        <DialogContent>
          {detailLoading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress /></Box>}
          {!detailLoading && studentDetail && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {[
                  { label: 'Avg. Score',    value: `${viewStudent?.avgScore ?? 0}%`,  color: '#1E40AF' },
                  { label: 'Quizzes Taken', value: viewStudent?.quizzesTaken ?? 0,    color: '#10B981' },
                  { label: 'Passed',        value: viewStudent?.quizzesPassed ?? 0,   color: '#F59E0B' },
                  { label: 'XP Earned',     value: `⚡ ${viewStudent?.xp ?? 0}`,       color: '#8B5CF6' },
                ].map(s => (
                  <Grid item xs={6} key={s.label}>
                    <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: '12px', textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                      <Typography variant="h6" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Recent Quiz Attempts</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {(studentDetail.attempts ?? []).slice(0, 5).map((a, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    p: 1.5, bgcolor: 'action.hover', borderRadius: '10px' }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>{a.quizId?.title ?? 'Quiz'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(a.completedAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                      <Chip label={`${a.score}%`} size="small"
                        color={a.score >= 80 ? 'success' : a.score >= 60 ? 'warning' : 'error'}
                        sx={{ fontWeight: 700 }} />
                      <Chip label={a.passed ? 'Passed' : 'Failed'} size="small"
                        color={a.passed ? 'success' : 'error'} variant="outlined" />
                    </Box>
                  </Box>
                ))}
                {(studentDetail.attempts ?? []).length === 0 && (
                  <Typography variant="body2" color="text.secondary">No quiz attempts yet.</Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => viewStudent && navigate(`/teacher/students/${viewStudent._id}`)}
            startIcon={<OpenInNewRoundedIcon />} sx={{ borderRadius: '10px' }}>
            Open full report
          </Button>
          <Box flex={1} />
          <Button onClick={() => setViewStudent(null)} variant="contained" sx={{ borderRadius: '10px' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
