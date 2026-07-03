import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Box, Typography, Grid, Card, CardContent, Chip, Alert, Button, CircularProgress,
} from '@mui/material'
import ProgressBar from '../../components/common/ProgressBar'
import StatCard from '../../components/common/StatCard'
import { quizzesApi, subjectsApi } from '../../services/apiCatalog'

export default function ProgressPage() {
  const { user } = useSelector(s => s.auth)
  const [attempts, setAttempts] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true)
    setError(null)
    Promise.all([quizzesApi.getMyAttempts(), subjectsApi.getAll()])
      .then(([attemptsRes, subjectsRes]) => {
        setAttempts(attemptsRes.data?.attempts ?? [])
        setSubjects(subjectsRes.data?.subjects ?? [])
      })
      .catch(e => setError(e?.response?.data?.message || 'Failed to load progress'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  // Group attempts by subject and compute average score.
  const subjectPerformance = useMemo(() => {
    if (!attempts.length || !subjects.length) return []
    const bySubject = new Map()
    for (const a of attempts) {
      const sid = String(a.quizId?.subjectId?._id ?? a.quizId?.subjectId ?? '')
      if (!sid) continue
      const bucket = bySubject.get(sid) ?? { total: 0, count: 0 }
      bucket.total += Number(a.score ?? 0)
      bucket.count += 1
      bySubject.set(sid, bucket)
    }
    return subjects
      .map(s => {
        const bucket = bySubject.get(String(s._id))
        if (!bucket) return null
        return {
          id: String(s._id),
          name: s.name,
          icon: s.icon || '📘',
          color: s.color || '#6C63FF',
          score: Math.round(bucket.total / bucket.count),
          attempts: bucket.count,
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
  }, [attempts, subjects])

  // Best and weakest quizzes (one entry per quiz, using best attempt).
  const { strengths, weaknesses } = useMemo(() => {
    const byQuiz = new Map()
    for (const a of attempts) {
      const qid = String(a.quizId?._id ?? a.quizId ?? '')
      if (!qid) continue
      const title = a.quizId?.title || 'Quiz'
      const prev = byQuiz.get(qid)
      const score = Number(a.score ?? 0)
      if (!prev || score > prev.score) byQuiz.set(qid, { id: qid, title, score })
    }
    const all = [...byQuiz.values()]
    return {
      strengths:  [...all].sort((a, b) => b.score - a.score).slice(0, 3),
      weaknesses: [...all].sort((a, b) => a.score - b.score).slice(0, 3),
    }
  }, [attempts])

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>📈 My Progress</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Track your learning journey</Typography>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4}>
          <StatCard title="Total XP" value={user?.xp?.toLocaleString() || '0'} icon="⚡" color="#8B5CF6" />
        </Grid>
        <Grid item xs={6} sm={4}>
          <StatCard title="Current Level" value={`Lv. ${user?.level || 1}`} icon="⬆️" color="#6C63FF" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Avg. Score" value={`${user?.stats?.avgScore || 0}%`} icon="🎯" color="#10B981" />
        </Grid>
      </Grid>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={<Button variant="text" color="inherit" size="small" onClick={load}>Retry</Button>}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
      ) : (
        <>
          {/* Subject Performance */}
          <Card sx={{ borderRadius: '20px', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>📊 Subject Performance</Typography>
              {subjectPerformance.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Take a quiz to see your subject-wise performance here.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {subjectPerformance.map(s => (
                    <Box key={s.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                        <Typography variant="body1">{s.icon}</Typography>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ flex: 1 }}>{s.name}</Typography>
                        <Chip
                          label={s.score >= 80 ? 'Strong' : s.score >= 60 ? 'Average' : 'Needs Work'}
                          size="small"
                          color={s.score >= 80 ? 'success' : s.score >= 60 ? 'warning' : 'error'}
                          sx={{ fontWeight: 600, fontSize: '0.7rem', height: 22 }}
                        />
                      </Box>
                      <ProgressBar
                        value={s.score}
                        color={s.score >= 80 ? 'success' : s.score >= 60 ? 'warning' : 'error'}
                        showLabel={false}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.25 }}>
                        <Typography variant="caption" color="text.secondary">
                          {s.attempts} attempt{s.attempts === 1 ? '' : 's'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{s.score}%</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Strengths & Weaknesses */}
          {(strengths.length > 0 || weaknesses.length > 0) && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ borderRadius: '20px', height: '100%' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>💪 Strengths</Typography>
                    {strengths.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        Take some quizzes to discover your strengths.
                      </Typography>
                    ) : strengths.map(s => (
                      <Box key={s.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" fontWeight={500} noWrap sx={{ mr: 1 }}>✅ {s.title}</Typography>
                        <Chip label={`${s.score}%`} size="small" color="success"
                          sx={{ fontWeight: 700, fontSize: '0.7rem', height: 22 }} />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ borderRadius: '20px', height: '100%' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>📚 Needs Practice</Typography>
                    {weaknesses.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        Nothing here yet — keep going!
                      </Typography>
                    ) : weaknesses.map(s => (
                      <Box key={s.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" fontWeight={500} noWrap sx={{ mr: 1 }}>⚠️ {s.title}</Typography>
                        <Chip
                          label={`${s.score}%`}
                          size="small"
                          color={s.score < 60 ? 'warning' : 'default'}
                          sx={{ fontWeight: 700, fontSize: '0.7rem', height: 22 }}
                        />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Box>
  )
}
