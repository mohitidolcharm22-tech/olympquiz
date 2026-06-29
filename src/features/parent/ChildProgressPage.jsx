import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Box, Typography, Card, CardContent, Avatar, Chip, LinearProgress,
  Grid, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert,
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment,
} from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { progressApi, badgeCatalogApi } from '../../services/apiCatalog'
import { badgeDefinitions as FALLBACK_BADGES } from '../../data/index'

export default function ChildProgressPage() {
  const { user } = useSelector(s => s.auth)
  const [children, setChildren]     = useState([])
  const [badgeDefs, setBadgeDefs]   = useState(FALLBACK_BADGES)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [linkUsername, setLinkUsername] = useState('')
  const [linkMsg, setLinkMsg]       = useState('')
  const [showLink, setShowLink]     = useState(false)

  const loadChildren = () => {
    setLoading(true)
    Promise.all([
      progressApi.getMyChildren(),
      badgeCatalogApi.getAll(),
    ])
      .then(([childData, catalogData]) => {
        setChildren(childData.data.children ?? [])
        if (catalogData.data.badges?.length) setBadgeDefs(catalogData.data.badges)
      })
      .catch(() => setError('Failed to load children data.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadChildren() }, [])

  const handleLinkChild = () => {
    progressApi.linkChild(linkUsername)
      .then(data => {
        setLinkMsg(data.message)
        setLinkUsername('')
        loadChildren()
        setTimeout(() => { setShowLink(false); setLinkMsg('') }, 1500)
      })
      .catch(err => setLinkMsg(err?.response?.data?.message ?? 'Failed to link child.'))
  }

  const child    = children[selectedIdx]
  const attempts = child?.recentAttempts ?? []

  // Build subject scores from recent attempts
  const subjectMap = {}
  attempts.forEach(a => {
    const name = a.quizId?.subjectId?.name ?? 'Other'
    if (!subjectMap[name]) subjectMap[name] = { total: 0, count: 0 }
    subjectMap[name].total += a.score
    subjectMap[name].count++
  })
  const subjectScores = Object.entries(subjectMap).map(([subject, v]) => ({
    subject, score: Math.round(v.total / v.count),
  }))

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>📊 Child's Progress</Typography>
          <Typography variant="body2" color="text.secondary">Detailed learning analytics for your child</Typography>
        </Box>
        <Button variant="outlined" size="small" onClick={() => setShowLink(true)} sx={{ borderRadius: '10px' }}>
          + Link Child
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {children.length === 0 ? (
        <Card sx={{ borderRadius: '16px', textAlign: 'center', py: 6 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>👨‍👩‍👧</Typography>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>No children linked yet</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Link your child's account using their registered email address.
          </Typography>
          <Button variant="contained" onClick={() => setShowLink(true)} sx={{ borderRadius: '10px' }}>
            Link a Child
          </Button>
        </Card>
      ) : (
        <>
          {children.length > 1 && (
            <FormControl sx={{ minWidth: 220, mb: 3 }}>
              <InputLabel>Select Child</InputLabel>
              <Select value={selectedIdx} label="Select Child" onChange={e => setSelectedIdx(e.target.value)}>
                {children.map((c, i) => (
                  <MenuItem key={c._id} value={i}>{c.name} (Grade {c.grade})</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {child && (
            <>
              {/* Profile Card */}
              <Card sx={{ borderRadius: '16px', mb: 3, background: 'linear-gradient(135deg, #0F766E15, #7C3AED10)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Avatar sx={{ bgcolor: child.avatarColor || '#0F766E', fontWeight: 700, width: 64, height: 64, fontSize: '1.5rem' }}>
                      {child.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={700}>{child.name}</Typography>
                      <Typography variant="body2" color="text.secondary">Grade {child.grade}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                        <Chip label={`Level ${child.level}`} size="small" color="primary" sx={{ fontWeight: 700 }} />
                        <Chip label={`⚡ ${child.xp} XP`} size="small" sx={{ bgcolor: '#8B5CF620', color: '#8B5CF6', fontWeight: 700 }} />
                      </Box>
                    </Box>
                    <Grid container spacing={1} sx={{ width: 160 }}>
                      {[
                        { label: 'Quizzes', value: child.stats?.quizzesTaken ?? attempts.length },
                        { label: 'Avg Score', value: attempts.length ? `${Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length)}%` : 'N/A' },
                      ].map(s => (
                        <Grid item xs={6} key={s.label}>
                          <Box sx={{ textAlign: 'center', bgcolor: 'white', borderRadius: '10px', p: 1 }}>
                            <Typography variant="h6" fontWeight={800} color="primary.main">{s.value}</Typography>
                            <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </CardContent>
              </Card>

              {/* Subject Scores */}
              {subjectScores.length > 0 && (
                <Card sx={{ borderRadius: '16px', mb: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>📊 Subject-wise Performance</Typography>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={subjectScores}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                        <XAxis dataKey="subject" axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                        <Tooltip formatter={(val) => [`${val}%`, 'Avg Score']} />
                        <Bar dataKey="score" fill="#0F766E" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Recent Quiz Attempts */}
              <Card sx={{ borderRadius: '16px' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>📝 Recent Quiz Attempts</Typography>
                  {attempts.length === 0 ? (
                    <Typography color="text.secondary">No quiz attempts yet.</Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {attempts.map((a, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          p: 1.5, bgcolor: 'action.hover', borderRadius: '10px' }}>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>{a.quizId?.title ?? 'Quiz'}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(a.completedAt).toLocaleDateString()} · ⚡ +{a.xpEarned} XP
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

              {/* Teacher-awarded badges */}
              {child?.teacherBadges?.length > 0 && (
                <Card sx={{ borderRadius: '16px', mt: 2 }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>🎖️ Badges Awarded by Teacher</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                      {child.teacherBadges.map((tb, i) => {
                        const def = badgeDefs.find(b => b._id === tb.badgeId || b.id === tb.badgeId)
                        return (
                          <Box key={i} sx={{
                            display: 'flex', alignItems: 'center', gap: 1.5,
                            p: 1.5, borderRadius: '12px', border: '1.5px solid #E2E8F0',
                            background: `linear-gradient(135deg, ${def?.color || '#6C63FF'}08, white)`,
                            minWidth: 200, flex: '1 1 auto',
                          }}>
                            <Typography sx={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0 }}>{def?.icon || '🏅'}</Typography>
                            <Box>
                              <Typography variant="subtitle2" fontWeight={700}>{def?.name || tb.badgeId}</Typography>
                              {tb.note && (
                                <Typography variant="caption" sx={{ display: 'block', fontStyle: 'italic', color: def?.color || '#6C63FF' }}>
                                  "{tb.note}"
                                </Typography>
                              )}
                              <Typography variant="caption" color="text.disabled">
                                By {tb.awardedBy?.name || 'Teacher'} · {tb.awardedAt ? new Date(tb.awardedAt).toLocaleDateString() : ''}
                              </Typography>
                            </Box>
                          </Box>
                        )
                      })}
                    </Box>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </>
      )}

      {/* Link Child Dialog */}
      <Dialog open={showLink} onClose={() => { setShowLink(false); setLinkMsg('') }}
        PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle fontWeight={800}>🔗 Link a Child</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your child's username to link their account.
          </Typography>
          {linkMsg && <Alert severity={linkMsg.includes('successfully') ? 'success' : 'error'} sx={{ mb: 2 }}>{linkMsg}</Alert>}
          <TextField fullWidth label="Child's Username" value={linkUsername}
            onChange={e => setLinkUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            size="small" placeholder="e.g. arjun123"
            InputProps={{ startAdornment: <InputAdornment position="start">@</InputAdornment> }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => { setShowLink(false); setLinkMsg('') }} variant="outlined" sx={{ borderRadius: '10px' }}>Cancel</Button>
          <Button onClick={handleLinkChild} variant="contained" disabled={!linkUsername} sx={{ borderRadius: '10px' }}>Link</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}