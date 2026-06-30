import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Box, Typography, Card, CardContent, Avatar, Chip, LinearProgress,
  Grid, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert,
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment,
  Divider, Stack,
} from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CancelRoundedIcon      from '@mui/icons-material/CancelRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import VisibilityRoundedIcon  from '@mui/icons-material/VisibilityRounded'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { progressApi, badgeCatalogApi, quizzesApi } from '../../services/apiCatalog'
import { badgeDefinitions as FALLBACK_BADGES } from '../../data/index'
import { formatDate, formatDateTime } from '../../utils/date'

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

  // Quiz review dialog state
  const [reviewOpen, setReviewOpen]     = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewError, setReviewError]   = useState('')
  const [reviewAttempt, setReviewAttempt] = useState(null)

  const openReview = (attemptId) => {
    setReviewOpen(true)
    setReviewLoading(true)
    setReviewError('')
    setReviewAttempt(null)
    quizzesApi.getAttempt(attemptId)
      .then(d => setReviewAttempt(d.data?.attempt))
      .catch(err => setReviewError(err?.response?.data?.message || 'Failed to load attempt.'))
      .finally(() => setReviewLoading(false))
  }
  const closeReview = () => { setReviewOpen(false); setReviewAttempt(null); setReviewError('') }

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
                        <Box
                          key={a._id ?? idx}
                          onClick={() => a._id && openReview(a._id)}
                          sx={{
                            display: 'flex', flexDirection: 'column', gap: 1,
                            p: 1.5, borderRadius: '12px',
                            bgcolor: 'background.paper',
                            border: '1px solid', borderColor: 'divider',
                            cursor: a._id ? 'pointer' : 'default',
                            transition: 'all 0.15s ease',
                            '&:hover': a._id ? {
                              borderColor: 'primary.main',
                              bgcolor: 'action.hover',
                              boxShadow: 1,
                            } : undefined,
                          }}
                        >
                          {/* Top: title + score/pass chips */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Typography variant="body2" fontWeight={600} noWrap>{a.quizId?.title ?? 'Quiz'}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(a.completedAt)} · ⚡ +{a.xpEarned} XP
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                              <Chip label={`${a.score}%`} size="small"
                                color={a.score >= 80 ? 'success' : a.score >= 60 ? 'warning' : 'error'}
                                sx={{ fontWeight: 700 }} />
                              <Chip label={a.passed ? 'Passed' : 'Failed'} size="small"
                                color={a.passed ? 'success' : 'error'} variant="outlined" />
                            </Box>
                          </Box>

                          {/* Bottom: Review button */}
                          {a._id && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <Button
                                size="small" variant="outlined"
                                startIcon={<VisibilityRoundedIcon />}
                                endIcon={<ChevronRightRoundedIcon />}
                                onClick={(e) => { e.stopPropagation(); openReview(a._id) }}
                                sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                              >
                                Review
                              </Button>
                            </Box>
                          )}
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
                                By {tb.awardedBy?.name || 'Teacher'} · {formatDate(tb.awardedAt)}
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

      {/* Quiz Review Dialog */}
      <QuizReviewDialog
        open={reviewOpen}
        loading={reviewLoading}
        error={reviewError}
        attempt={reviewAttempt}
        onClose={closeReview}
      />
    </Box>
  )
}

/* ════════════════════════════════════════════════════════════════════════
   Quiz Review Dialog — shows every question, what the child selected,
   what was correct, and a summary (correct / incorrect / score / time).
   ════════════════════════════════════════════════════════════════════════ */
function QuizReviewDialog({ open, loading, error, attempt, onClose }) {
  const quiz = attempt?.quizId
  const questions = quiz?.questions ?? []
  const answers   = attempt?.answers ?? []

  // Index answers by questionId for O(1) lookup
  const answerMap = {}
  for (const a of answers) answerMap[String(a.questionId)] = a

  const correctCount   = answers.filter(a => a.correct).length
  const incorrectCount = answers.length - correctCount
  const unanswered     = Math.max(questions.length - answers.length, 0)

  const fmtTime = (sec) => {
    if (!sec && sec !== 0) return '—'
    const m = Math.floor(sec / 60), s = sec % 60
    return m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md"
      PaperProps={{ sx: { borderRadius: '16px' } }}>
      <DialogTitle fontWeight={800}>
        📝 Quiz Review {quiz?.title ? `— ${quiz.title}` : ''}
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : !attempt ? (
          <Alert severity="info">No attempt data available.</Alert>
        ) : (
          <>
            {/* Summary */}
            <Card variant="outlined" sx={{ borderRadius: '12px', mb: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">Score</Typography>
                    <Typography variant="h5" fontWeight={800}
                      color={attempt.score >= 80 ? 'success.main' : attempt.score >= 60 ? 'warning.main' : 'error.main'}>
                      {attempt.score}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">Result</Typography>
                    <Box><Chip label={attempt.passed ? 'Passed' : 'Failed'} size="small"
                      color={attempt.passed ? 'success' : 'error'} sx={{ mt: 0.5, fontWeight: 700 }} /></Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">Correct / Total</Typography>
                    <Typography variant="h6" fontWeight={700}>{correctCount} / {questions.length}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary">Time taken</Typography>
                    <Typography variant="h6" fontWeight={700}>{fmtTime(attempt.timeTaken)}</Typography>
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  <Chip size="small" icon={<CheckCircleRoundedIcon />} color="success" variant="outlined"
                    label={`${correctCount} correct`} />
                  <Chip size="small" icon={<CancelRoundedIcon />} color="error" variant="outlined"
                    label={`${incorrectCount} incorrect`} />
                  {unanswered > 0 && <Chip size="small" variant="outlined" label={`${unanswered} unanswered`} />}
                  <Chip size="small" variant="outlined"
                    label={`⚡ +${attempt.xpEarned || 0} XP`} />
                  {quiz?.subjectId?.name && (
                    <Chip size="small" variant="outlined" label={quiz.subjectId.name} />
                  )}
                  <Chip size="small" variant="outlined"
                    label={formatDateTime(attempt.completedAt)} />
                </Box>
              </CardContent>
            </Card>

            {/* Per-question breakdown */}
            {questions.length === 0 ? (
              <Alert severity="info">Question details are no longer available for this quiz.</Alert>
            ) : (
              <Stack spacing={1.5}>
                {questions.map((q, i) => {
                  const ans = answerMap[String(q._id)]
                  const isCorrect   = !!ans?.correct
                  const isAnswered  = !!ans
                  const borderColor = !isAnswered ? 'divider' : isCorrect ? 'success.light' : 'error.light'
                  const bgTint      = !isAnswered ? 'transparent' : isCorrect ? 'success.50' : 'error.50'

                  return (
                    <Card key={q._id || i} variant="outlined"
                      sx={{ borderRadius: '12px', borderColor, bgcolor: bgTint }}>
                      <CardContent sx={{ py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                          {isAnswered && (isCorrect
                            ? <CheckCircleRoundedIcon fontSize="small" color="success" sx={{ mt: 0.2 }} />
                            : <CancelRoundedIcon fontSize="small" color="error" sx={{ mt: 0.2 }} />
                          )}
                          <Typography variant="subtitle2" fontWeight={700} sx={{ flex: 1 }}>
                            Q{i + 1}. {q.text}
                          </Typography>
                          <Chip size="small" variant="outlined" label={q.type} />
                        </Box>

                        {q.imageUrl && (
                          <Box sx={{ mb: 1 }}>
                            <img src={q.imageUrl} alt="" style={{ maxWidth: '100%', borderRadius: 8 }} />
                          </Box>
                        )}

                        {/* MCQ-style options */}
                        {(q.options?.length > 0) && (
                          <Stack spacing={0.5} sx={{ mb: 1 }}>
                            {q.options.map((opt, oi) => {
                              const isUserPick   = ans?.selected === opt
                              const isCorrectOpt = q.correctAnswer === opt
                              const color = isCorrectOpt ? 'success.main'
                                          : isUserPick && !isCorrectOpt ? 'error.main'
                                          : 'text.primary'
                              return (
                                <Box key={oi} sx={{
                                  display: 'flex', alignItems: 'center', gap: 1,
                                  p: 0.75, borderRadius: '8px',
                                  bgcolor: isCorrectOpt ? 'success.50' : isUserPick ? 'error.50' : 'transparent',
                                  border: isUserPick || isCorrectOpt ? '1px solid' : '1px solid transparent',
                                  borderColor: isCorrectOpt ? 'success.light' : isUserPick ? 'error.light' : 'transparent',
                                }}>
                                  <Typography variant="body2" sx={{ flex: 1, color }}>{opt}</Typography>
                                  {isUserPick && <Chip size="small" label="Child's pick" />}
                                  {isCorrectOpt && <Chip size="small" color="success" label="Correct" />}
                                </Box>
                              )
                            })}
                          </Stack>
                        )}

                        {/* Non-option questions (fillinblank / truefalse / oddoneout) — show side-by-side */}
                        {!q.options?.length && (
                          <Grid container spacing={1} sx={{ mb: 1 }}>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Child's answer</Typography>
                              <Typography variant="body2" fontWeight={600}
                                color={isAnswered ? (isCorrect ? 'success.main' : 'error.main') : 'text.disabled'}>
                                {ans?.selected || '— Not answered —'}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Correct answer</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">
                                {q.correctAnswer || (q.correctOrder?.join(' → ')) || '—'}
                              </Typography>
                            </Grid>
                          </Grid>
                        )}

                        {q.explanation && (
                          <>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="caption" color="text.secondary">
                              💡 <strong>Explanation:</strong> {q.explanation}
                            </Typography>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </Stack>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" sx={{ borderRadius: '10px' }}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}