import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  Box, Typography, Card, CardActionArea, CardContent, Chip, Avatar, Button,
  LinearProgress, CircularProgress, Alert, Grid,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import { subjectsApi, quizzesApi } from '../../services/apiCatalog'

const difficultyColor = { easy: 'success', medium: 'warning', hard: 'error' }

export default function TopicsPage() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const authUser = useSelector(s => s.auth.user)
  const studentGrade = authUser?.grade || ''
  const [subject, setSubject]           = useState(null)
  const [topics, setTopics]             = useState([])
  const [completedTopicIds, setCompletedTopicIds] = useState(new Set())
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')

  // Derive completedLessonIds live from Redux so it updates instantly after
  // a student completes a lesson (LessonsPage dispatches updateUser)
  const completedLessonIds = new Set(
    (authUser?.completedLessons || []).map(String)
  )

  const load = () => {
    setLoading(true)
    setError('')
    Promise.all([
      subjectsApi.getOne(subjectId),
      subjectsApi.getTopics(subjectId, studentGrade ? { grade: studentGrade } : {}),
      quizzesApi.getMyAttempts().catch(() => ({ data: { attempts: [] } })),
    ])
      .then(([subData, topData, attData]) => {
        const sub = subData?.data?.subject ?? subData?.subject ?? subData?.data ?? null
        const topList = topData?.data?.topics ?? topData?.topics ?? topData?.data ?? []
        setSubject(sub)
        setTopics(Array.isArray(topList) ? topList : [])

        // Build set of topicIds that have a completed quiz
        const attempts = attData?.data?.attempts ?? attData?.attempts ?? []
        const doneTopics = new Set(
          attempts.map(a => a.quizId?.topicId?._id || a.quizId?.topicId).filter(Boolean).map(String)
        )
        setCompletedTopicIds(doneTopics)
      })
      .catch(() => setError('Failed to load subject data.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [subjectId, studentGrade]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>
  )
  if (error) return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <Button variant="text" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/student/subjects')}>Back to Subjects</Button>
      </Box>
      <Alert
        severity="error"
        action={<Button variant="text" color="inherit" size="small" onClick={load}>Retry</Button>}
      >
        {error}
      </Alert>
    </Box>
  )
  if (!subject) return (
    <Box sx={{ p: 3 }}><Typography>Subject not found</Typography></Box>
  )

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <Button variant="text" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/student/subjects')}>
          Back to Subjects
        </Button>
      </Box>

      {/* Subject Header */}
      <Card sx={{ background: subject.bgGradient, color: 'white', borderRadius: '20px', mb: 3, border: 'none' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontSize: '3rem', lineHeight: 1, mb: 1 }}>{subject.icon}</Typography>
          <Typography variant="h5" fontWeight={800} sx={{ color: 'white' }}>{subject.name}</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mb: 2 }}>{subject.description}</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label={`${topics.length} Topics`} size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: 'white', fontWeight: 700 }} />
          </Box>
        </CardContent>
      </Card>

      {/* Topics Grid — 2 columns on desktop, 1 on mobile */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Topics</Typography>
      <Grid container spacing={2}>
        {topics.map((topic) => {
          const quizDone = completedTopicIds.has(topic._id?.toString())
          const totalLessons = topic.lessonCount || 0
          const lessonIds    = topic.lessonIds || []
          const doneLessons  = lessonIds.filter(id => completedLessonIds.has(String(id))).length
          const allLessonsDone = totalLessons > 0 && doneLessons === totalLessons
          const topicComplete  = allLessonsDone && quizDone
          return (
            <Grid item xs={12} sm={6} key={topic._id}>
              <Card sx={{
                border: '2px solid',
                borderColor: topicComplete ? 'success.main' : 'transparent',
                height: '100%', display: 'flex', flexDirection: 'column',
              }}>
                <CardActionArea onClick={() => navigate(`/student/topics/${topic._id}/lessons`)}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{
                        width: 48, height: 48, fontSize: '1.5rem',
                        bgcolor: `${subject.color}20`, borderRadius: '12px',
                      }}>
                        {topic.icon}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                          <Typography variant="subtitle1" fontWeight={700} noWrap>{topic.name}</Typography>
                          <Chip label={topic.difficulty} size="small" color={difficultyColor[topic.difficulty]}
                            variant="outlined" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }} />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {totalLessons > 0
                            ? `${doneLessons} / ${totalLessons} lessons`
                            : 'No lessons yet'} · Grades: {topic.grade?.join(', ')}
                        </Typography>
                        {totalLessons > 0 && (
                          <LinearProgress
                            variant="determinate"
                            value={(doneLessons / totalLessons) * 100}
                            sx={{ mt: 0.75, height: 6, borderRadius: '100px' }}
                          />
                        )}
                        {!quizDone && !allLessonsDone && totalLessons > 0 && (
                          <Typography variant="caption" sx={{ mt: 0.75, display: 'block', color: '#B45309', fontWeight: 600 }}>
                            🔒 Complete all lessons to unlock quiz
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
                <Box sx={{ px: 2, pb: 2, pt: 0.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button variant="outlined" size="small"
                    onClick={() => navigate(`/student/topics/${topic._id}/lessons`)}
                    sx={{ borderRadius: '10px', fontSize: '0.75rem' }}>
                    View Lessons
                  </Button>
                  {!quizDone && allLessonsDone && (
                    <Button variant="contained" size="small" color="success"
                      startIcon={<QuizRoundedIcon />}
                      onClick={() => navigate(`/student/quizzes?topicId=${topic._id}&topicName=${encodeURIComponent(topic.name)}`)}
                      sx={{ borderRadius: '10px', fontSize: '0.75rem' }}>
                      Appear for Quizzes
                    </Button>
                  )}
                  {allLessonsDone && (
                    <Chip label="📚 Lessons Done" color="success" size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                  )}
                  {quizDone && (
                    <Chip label="✅ Quiz Done" color="success" size="small" sx={{ fontWeight: 700 }} />
                  )}
                  {topicComplete && (
                    <Chip label="🎉 Topic Complete" color="success" size="small" sx={{ fontWeight: 800 }} />
                  )}
                </Box>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}