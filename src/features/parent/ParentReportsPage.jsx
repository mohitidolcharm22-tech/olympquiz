import { useState, useEffect } from 'react'
import { Box, Typography, Card, CardContent, Grid, Chip, Tab, Tabs, CircularProgress, Alert } from '@mui/material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { progressApi } from '../../services/apiCatalog'

export default function ParentReportsPage() {
  const [tab, setTab]         = useState(0)
  const [children, setChildren] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)

  useEffect(() => {
    progressApi.getMyChildren()
      .then(data => setChildren(data.data.children ?? []))
      .catch(() => setError('Failed to load children data.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>

  const child    = children[selectedIdx]
  const attempts = child?.recentAttempts ?? []

  // Build a monthly trend from attempts (last 6 months)
  const monthlyMap = {}
  attempts.forEach(a => {
    const d = new Date(a.completedAt)
    const key = d.toLocaleString('default', { month: 'short' })
    const subjectName = a.quizId?.subjectId?.name ?? 'Other'
    if (!monthlyMap[key]) monthlyMap[key] = { month: key }
    if (!monthlyMap[key][subjectName]) monthlyMap[key][subjectName] = { total: 0, count: 0 }
    monthlyMap[key][subjectName].total += a.score
    monthlyMap[key][subjectName].count++
  })
  const monthlyData = Object.values(monthlyMap).map(entry => {
    const row = { month: entry.month }
    Object.entries(entry).forEach(([k, v]) => {
      if (k !== 'month') row[k] = Math.round(v.total / v.count)
    })
    return row
  })

  const subjectColors = ['#6C63FF', '#10B981', '#F59E0B', '#EC4899']
  const subjectKeys   = [...new Set(attempts.map(a => a.quizId?.subjectId?.name ?? 'Other'))].filter(Boolean)

  const avgScore = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length) : 0
  const totalXp  = attempts.reduce((s, a) => s + (a.xpEarned || 0), 0)

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>📋 Progress Reports</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Detailed performance reports for your children</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {children.length === 0 ? (
        <Card sx={{ borderRadius: '16px', textAlign: 'center', py: 6 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>📋</Typography>
          <Typography fontWeight={700}>No children linked yet.</Typography>
          <Typography variant="body2" color="text.secondary">Go to Child Progress to link your child's account.</Typography>
        </Card>
      ) : (
        <>
          {children.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {children.map((c, i) => (
                <Chip key={c._id} label={c.name} onClick={() => setSelectedIdx(i)}
                  color={selectedIdx === i ? 'primary' : 'default'}
                  variant={selectedIdx === i ? 'filled' : 'outlined'} sx={{ fontWeight: 700, cursor: 'pointer' }} />
              ))}
            </Box>
          )}

          <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
            <Tab label="📈 Score Trend" />
            <Tab label="📝 All Attempts" />
          </Tabs>

          {tab === 0 && (
            <Box>
              <Card sx={{ borderRadius: '16px', mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    📈 {child?.name}'s Score Trend
                  </Typography>
                  {monthlyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F0FDFA" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                        <Tooltip formatter={(val) => [`${val}%`, '']} />
                        <Legend />
                        {subjectKeys.map((k, i) => (
                          <Line key={k} type="monotone" dataKey={k} stroke={subjectColors[i % subjectColors.length]}
                            strokeWidth={2} name={k} dot />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>No data yet — quiz attempts will appear here.</Typography>
                  )}
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: '16px' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>📅 Summary</Typography>
                  <Grid container spacing={2}>
                    {[
                      { label: 'Quizzes Taken', value: attempts.length,                icon: '📝', color: '#7C3AED' },
                      { label: 'Quizzes Passed', value: attempts.filter(a => a.passed).length, icon: '✅', color: '#0F766E' },
                      { label: 'Average Score',  value: `${avgScore}%`,               icon: '🎯', color: '#F59E0B' },
                      { label: 'XP Earned',      value: totalXp,                      icon: '⚡', color: '#EC4899' },
                    ].map(s => (
                      <Grid item xs={6} sm={3} key={s.label}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: `${s.color}10`, borderRadius: '12px' }}>
                          <Typography sx={{ fontSize: '1.8rem' }}>{s.icon}</Typography>
                          <Typography variant="h6" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
                          <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}

          {tab === 1 && (
            <Card sx={{ borderRadius: '16px' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>📝 Quiz Attempt History</Typography>
                {attempts.length === 0 ? (
                  <Typography color="text.secondary" align="center" sx={{ py: 3 }}>No quiz attempts yet.</Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {attempts.map((a, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        p: 1.5, bgcolor: 'action.hover', borderRadius: '10px' }}>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={600} noWrap>{a.quizId?.title ?? 'Quiz'}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {a.quizId?.subjectId?.name ?? ''} · {new Date(a.completedAt).toLocaleDateString()} · ⚡ +{a.xpEarned} XP
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
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  )
}
