import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  Box, Typography, Card, CardContent, Chip, Avatar, Button,
  LinearProgress, CircularProgress, Alert, Grid,
} from '@mui/material'
import ArrowBackRoundedIcon   from '@mui/icons-material/ArrowBackRounded'
import QuizRoundedIcon        from '@mui/icons-material/QuizRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import LockRoundedIcon        from '@mui/icons-material/LockRounded'
import MenuBookRoundedIcon    from '@mui/icons-material/MenuBookRounded'
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
          const quizDone       = completedTopicIds.has(topic._id?.toString())
          const totalLessons   = topic.lessonCount || 0
          const lessonIds      = topic.lessonIds || []
          const doneLessons    = lessonIds.filter(id => completedLessonIds.has(String(id))).length
          const allLessonsDone = totalLessons > 0 && doneLessons === totalLessons
          const topicComplete  = allLessonsDone && quizDone
          const progress       = totalLessons > 0 ? (doneLessons / totalLessons) * 100 : 0

          return (
            <Grid item xs={12} sm={6} key={topic._id}>
              <Card
                onClick={() => navigate(`/student/topics/${topic._id}/lessons`)}
                sx={{
                  height: '100%', display: 'flex', flexDirection: 'column',
                  border: '2px solid',
                  borderColor: topicComplete ? 'success.main' : 'divider',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s, transform 0.15s',
                  '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                }}
              >
                <CardContent sx={{ p: 2.5, pb: 1.5, flex: 1 }}>
                  {/* Header: icon + name + difficulty */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                    <Avatar sx={{
                      width: 44, height: 44, fontSize: '1.4rem',
                      bgcolor: `${subject.color}18`, borderRadius: '12px', flexShrink: 0,
                    }}>
                      {topic.icon}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle1" fontWeight={700} noWrap>{topic.name}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                        <Chip
                          label={topic.difficulty}
                          size="small"
                          color={difficultyColor[topic.difficulty]}
                          variant="outlined"
                          sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700 }}
                        />
                        <Typography variant="caption" color="text.disabled">
                          Grades: {topic.grade?.join(', ')}
                        </Typography>
                      </Box>
                    </Box>
                    {topicComplete && (
                      <CheckCircleRoundedIcon color="success" sx={{ flexShrink: 0, mt: 0.25 }} />
                    )}
                  </Box>

                  {/* Progress bar + lesson count */}
                  {totalLessons > 0 ? (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          Lessons
                        </Typography>
                        <Typography variant="caption" fontWeight={700}
                          color={allLessonsDone ? 'success.main' : 'text.primary'}>
                          {doneLessons} / {totalLessons}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        color={allLessonsDone ? 'success' : 'primary'}
                        sx={{ height: 7, borderRadius: '100px' }}
                      />
                    </Box>
                  ) : (
                    <Typography variant="caption" color="text.disabled">No lessons yet</Typography>
                  )}
                </CardContent>

                {/* Footer: status badges + primary action */}
                <Box
                  sx={{
                    px: 2.5, pb: 2, pt: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderTop: '1px solid', borderColor: 'divider',
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Status badges (left) */}
                  <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center', flexWrap: 'wrap' }}>
                    {allLessonsDone && (
                      <Chip
                        icon={<MenuBookRoundedIcon sx={{ fontSize: '0.85rem !important' }} />}
                        label="Lessons Done"
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 700, height: 24, fontSize: '0.7rem' }}
                      />
                    )}
                    {quizDone && (
                      <Chip
                        icon={<CheckCircleRoundedIcon sx={{ fontSize: '0.85rem !important' }} />}
                        label="Quiz Done"
                        size="small"
                        color="success"
                        sx={{ fontWeight: 700, height: 24, fontSize: '0.7rem' }}
                      />
                    )}
                    {!allLessonsDone && totalLessons > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LockRoundedIcon sx={{ fontSize: '0.85rem', color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.disabled">Quiz locked</Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Primary action (right) */}
                  {!quizDone && allLessonsDone ? (
                    <Button
                      variant="contained"
                      size="small"
                      color="success"
                      startIcon={<QuizRoundedIcon />}
                      onClick={() => navigate(`/student/quizzes?topicId=${topic._id}&topicName=${encodeURIComponent(topic.name)}`)}
                      sx={{ borderRadius: '10px', fontSize: '0.72rem', whiteSpace: 'nowrap', ml: 1 }}
                    >
                      Take Quiz
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/student/topics/${topic._id}/lessons`)}
                      sx={{ borderRadius: '10px', fontSize: '0.72rem', whiteSpace: 'nowrap', ml: 1 }}
                    >
                      View Lessons
                    </Button>
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