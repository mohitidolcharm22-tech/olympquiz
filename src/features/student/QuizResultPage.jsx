import { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, Card, CardContent, Typography, Button, Grid, Avatar, Chip, Divider, List, ListItem, LinearProgress, CircularProgress, Alert,
} from '@mui/material'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import { clearQuizResult } from '../../store/slices/quizSlice'
import { quizzesApi } from '../../services/apiCatalog'

export default function QuizResultPage() {
  const { quizId } = useParams()
  const { quizResult } = useSelector(s => s.quiz)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [apiResult, setApiResult] = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  // If Redux has no result (e.g. direct navigation / page refresh), fetch from API
  useEffect(() => {
    if (!quizResult) {
      setLoading(true)
      quizzesApi.getResult(quizId)
        .then(data => {
          const attempt = data.data.attempt
          const quiz    = attempt.quizId   // populated full quiz
          // Normalise to the same shape the rest of the page uses
          setApiResult({
            score:           attempt.score,
            passed:          attempt.passed,
            xpEarned:        attempt.xpEarned,
            timeTaken:       attempt.timeTaken,
            correct:         attempt.answers?.filter(a => a.correct).length,
            total:           quiz?.questions?.length ?? attempt.answers?.length,
            quizTitle:       quiz?.title,
            questionResults: attempt.answers?.map(a => ({
              questionId: String(a.questionId),
              isCorrect:  a.correct,
              given:      a.selected,
              correct:    quiz?.questions?.find(q => String(q._id) === String(a.questionId))?.correctAnswer,
            })) ?? [],
            quiz: {
              title:        quiz?.title,
              passingScore: quiz?.passingScore ?? 60,
              questions:    quiz?.questions ?? [],
            },
          })
        })
        .catch(() => setError('Could not load result. Please try again.'))
        .finally(() => setLoading(false))
    }
  }, [quizId, quizResult])

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>
  )

  const result = quizResult ?? apiResult

  if (!result && error) return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      <Button onClick={() => navigate('/student/quizzes')}>Back to Quizzes</Button>
    </Box>
  )

  if (!result) return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6">No result found.</Typography>
      <Button onClick={() => navigate('/student/dashboard')} sx={{ mt: 2 }}>Go Home</Button>
    </Box>
  )

  // Support both API response shape and local fallback shape
  const score        = result.score
  const correct      = result.correct   ?? result.correctAnswers
  const total        = result.total      ?? result.quiz?.questions?.length
  const timeTaken    = result.timeTaken
  const xpEarned     = result.xpEarned
  const questionResults = result.questionResults ?? []
  const quizTitle    = result.quizTitle  ?? result.quiz?.title
  const passingScore = result.quiz?.passingScore ?? 60
  const isPassed     = result.passed     ?? (score >= passingScore)

  // Build a lookup map once — question-review row count × quiz size was O(M×N).
  const questionById = useMemo(() => {
    const map = new Map()
    for (const q of result.quiz?.questions ?? []) {
      map.set(String(q._id ?? q.id), q)
    }
    return map
  }, [result.quiz?.questions])

  const getScoreColor = (s) => s >= 90 ? '#10B981' : s >= 60 ? '#F59E0B' : '#EF4444'
  const getGrade = (s) => s >= 90 ? 'A+' : s >= 80 ? 'A' : s >= 70 ? 'B' : s >= 60 ? 'C' : 'F'

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 700, mx: 'auto' }}>
      {/* Result Hero */}
      <Card sx={{
        background: isPassed
          ? 'linear-gradient(135deg, #10B981, #34D399)'
          : 'linear-gradient(135deg, #EF4444, #F87171)',
        color: 'white', borderRadius: '20px', mb: 3, border: 'none', textAlign: 'center',
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography sx={{ fontSize: '4rem', lineHeight: 1, mb: 1 }}>
            {score >= 90 ? '🏆' : score >= 70 ? '🌟' : score >= 60 ? '😊' : '💪'}
          </Typography>
          <Typography variant="h4" fontWeight={900} sx={{ color: 'white', mb: 0.5 }}>
            {isPassed ? 'Great Job!' : 'Keep Trying!'}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
            {quizTitle}
          </Typography>

          {/* Score Circle */}
          <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 120, height: 120, borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.25)', mb: 2,
          }}>
            <Box>
              <Typography variant="h2" fontWeight={900} sx={{ color: 'white', lineHeight: 1 }}>{score}%</Typography>
              <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.9)' }}>Grade {getGrade(score)}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Chip label={`✅ ${correct}/${total} Correct`} sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: 'white', fontWeight: 700 }} />
            <Chip label={`⏱ ${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`} sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: 'white', fontWeight: 700 }} />
            <Chip label={`⚡ +${xpEarned} XP`} sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: 'white', fontWeight: 700 }} />
          </Box>
        </CardContent>
      </Card>

      {/* Question Review */}
      <Card sx={{ borderRadius: '20px', mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>📋 Question Review</Typography>
          {questionResults?.map((qr, idx) => {
            const qData = questionById.get(String(qr.questionId))
            return (
              <Box key={idx} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  {qr.isCorrect
                    ? <CheckCircleRoundedIcon sx={{ color: 'success.main', mt: 0.25, flexShrink: 0 }} />
                    : <CancelRoundedIcon sx={{ color: 'error.main', mt: 0.25, flexShrink: 0 }} />
                  }
                  <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                      Q{idx + 1}: {qData?.text}
                    </Typography>
                    {!qr.isCorrect && (
                      <>
                        <Typography variant="caption" color="error.main">
                          Your answer: {qr.given || '(not answered)'}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="success.main">
                          Correct: {qr.correct}
                        </Typography>
                        <br />
                      </>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      💡 {qData?.explanation}
                    </Typography>
                  </Box>
                </Box>
                {idx < questionResults.length - 1 && <Divider sx={{ mt: 1.5 }} />}
              </Box>
            )
          })}
        </CardContent>
      </Card>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button fullWidth variant="outlined" startIcon={<HomeRoundedIcon />}
          onClick={() => { dispatch(clearQuizResult()); navigate('/student/dashboard') }}
          sx={{ borderRadius: '12px', py: 1.5 }}>
          Home
        </Button>
        <Button fullWidth variant="contained"
          onClick={() => { dispatch(clearQuizResult()); navigate('/student/quizzes') }}
          sx={{ borderRadius: '12px', py: 1.5 }}>
          More Quizzes
        </Button>
      </Box>
    </Box>
  )
}
