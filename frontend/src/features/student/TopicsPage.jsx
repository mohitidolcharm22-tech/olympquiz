import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Card, CardActionArea, CardContent, Chip, Avatar, Button,
  LinearProgress, CircularProgress, Alert, Grid,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import { subjectsApi, quizzesApi, progressApi } from '../../services/apiCatalog'

const difficultyColor = { easy: 'success', medium: 'warning', hard: 'error' }

export default function TopicsPage() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const [subject, setSubject]           = useState(null)
  const [topics, setTopics]             = useState([])
  const [completedTopicIds, setCompletedTopicIds] = useState(new Set())
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set())
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')

  useEffect(() => {
    Promise.all([
      subjectsApi.getOne(subjectId),
      subjectsApi.getTopics(subjectId),
      quizzesApi.getMyAttempts().catch(() => ({ data: { attempts: [] } })),
      progressApi.getCompletedLessons().catch(() => ({ data: { user: { completedLessons: [] } } })),
    ])
      .then(([subData, topData, attData, progData]) => {
        setSubject(subData.data.subject)
        setTopics(topData.data.topics)

        // Build set of topicIds that have a completed quiz
        const attempts = attData.data?.attempts || []
        const doneTopics = new Set(
          attempts.map(a => a.quizId?.topicId?._id || a.quizId?.topicId).filter(Boolean).map(String)
        )
        setCompletedTopicIds(doneTopics)

        // Build set of completed lesson IDs
        const doneLessons = progData.data?.user?.completedLessons || []
        setCompletedLessonIds(new Set(doneLessons.map(String)))
      })
      .catch(() => setError('Failed to load subject data.'))
      .finally(() => setLoading(false))
  }, [subjectId])

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>
  )
  if (error) return (
    <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>
  )
  if (!subject) return (
    <Box sx={{ p: 3 }}><Typography>Subject not found</Typography></Box>
  )

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/student/subjects')}>
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
          const doneLessons = totalLessons > 0
            ? [...completedLessonIds].filter(id => false).length  // placeholder; topics don't know lesson IDs here
            : 0
          return (
            <Grid item xs={12} sm={6} key={topic._id}>
              <Card sx={{ border: '1px solid transparent', height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                          {totalLessons > 0 ? `${totalLessons} lessons` : 'No lessons yet'} · Grades: {topic.grade?.join(', ')}
                        </Typography>
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
                  {!quizDone && (
                    <Button variant="contained" size="small" color="success"
                      startIcon={<QuizRoundedIcon />}
                      onClick={() => navigate('/student/quizzes', { state: { subjectId } })}
                      sx={{ borderRadius: '10px', fontSize: '0.75rem' }}>
                      Appear for Quizzes
                    </Button>
                  )}
                  {quizDone && (
                    <Chip label="✅ Quiz Done" color="success" size="small" sx={{ fontWeight: 700 }} />
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