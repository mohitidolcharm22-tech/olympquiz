import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  Box, Typography, Button, Chip, LinearProgress,
  Accordion, AccordionSummary, AccordionDetails, Avatar, CircularProgress, Alert,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { topicsApi, lessonsApi, progressApi } from '../../services/apiCatalog'
import { updateUser } from '../../store/slices/authSlice'

export default function LessonsPage() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [expanded, setExpanded]                 = useState(null)
  const [completedLessons, setCompletedLessons] = useState(new Set())
  const [topic, setTopic]                       = useState(null)
  const [lessonList, setLessonList]             = useState([])
  const [loading, setLoading]                   = useState(true)
  const [error, setError]                       = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    Promise.all([
      topicsApi.getOne(topicId),
      topicsApi.getLessons(topicId),
      progressApi.getCompletedLessons(),
    ])
      .then(([topData, lesData, progData]) => {
        setTopic(topData.data.topic)
        setLessonList(lesData.data.lessons)
        const ids = (progData.data?.user?.completedLessons || []).map(id => id.toString())
        setCompletedLessons(new Set(ids))
      })
      .catch(() => setError('Failed to load lessons.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [topicId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAccordionChange = (lessonId) => (_, isExpanded) => {
    setExpanded(isExpanded ? lessonId : null)
  }

  const handleComplete = (lesson, idx) => {
    setCompletedLessons(prev => new Set([...prev, lesson._id]))
    // Persist to backend and sync Redux user with the server's new stats / xp / level.
    lessonsApi.complete(lesson._id)
      .then(res => {
        const u = res?.data?.user
        if (u) dispatch(updateUser(u))
      })
      .catch(() => {})
    if (idx < lessonList.length - 1) {
      setExpanded(lessonList[idx + 1]._id)
    } else {
      navigate(-1)
    }
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>
  )
  if (error) return (
    <Box sx={{ p: 3 }}>
      <Alert
        severity="error"
        action={<Button color="inherit" size="small" onClick={load}>Retry</Button>}
      >
        {error}
      </Alert>
    </Box>
  )

  if (!lessonList.length) return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate(-1)}>Back</Button>
      </Box>
      <Typography>No lessons found for this topic yet.</Typography>
    </Box>
  )

  const completedCount = completedLessons.size
  const totalCount     = lessonList.length
  const progressPct    = Math.round((completedCount / totalCount) * 100)

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 800, mx: 'auto' }}>
      {/* Back button — left-aligned */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate(-1)}>Back</Button>
      </Box>

      {/* Topic Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
          {topic?.icon} {topic?.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
          <LinearProgress variant="determinate" value={progressPct}
            sx={{ flex: 1, height: 10, borderRadius: '100px',
              '& .MuiLinearProgress-bar': { borderRadius: '100px' } }} />
          <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ whiteSpace: 'nowrap' }}>
            {completedCount} / {totalCount} lessons
          </Typography>
        </Box>
        {completedCount === totalCount && totalCount > 0 && (
          <Chip label="🎉 All Lessons Complete!" color="success" size="small" sx={{ mt: 1, fontWeight: 700 }} />
        )}
      </Box>

      {/* Lesson Accordions */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {lessonList.map((lesson, idx) => {
          const isCompleted = completedLessons.has(lesson._id)
          const isExpanded = expanded === lesson._id

          return (
            <Accordion
              key={lesson._id}
              expanded={isExpanded}
              onChange={handleAccordionChange(lesson._id)}
              disableGutters
              elevation={0}
              sx={{
                borderRadius: '16px !important',
                border: '2px solid',
                borderColor: isCompleted ? 'success.main' : isExpanded ? 'primary.main' : 'divider',
                '&:before': { display: 'none' },
                overflow: 'hidden',
                transition: 'border-color 0.2s ease',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreRoundedIcon />}
                sx={{
                  px: 2, py: 1,
                  bgcolor: isCompleted ? '#F0FDF4' : isExpanded ? 'primary.main' + '08' : 'background.paper',
                  '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1.5, my: 0.5 },
                }}
              >
                {/* Status icon */}
                {isCompleted
                  ? <CheckCircleRoundedIcon sx={{ color: 'success.main', flexShrink: 0 }} />
                  : <RadioButtonUncheckedRoundedIcon sx={{ color: isExpanded ? 'primary.main' : 'text.disabled', flexShrink: 0 }} />
                }

                {/* Lesson number badge */}
                <Avatar sx={{
                  width: 28, height: 28, fontSize: '0.75rem', fontWeight: 800, flexShrink: 0,
                  bgcolor: isCompleted ? 'success.main' : isExpanded ? 'primary.main' : '#E5E7EB',
                  color: isCompleted || isExpanded ? 'white' : 'text.secondary',
                }}>
                  {idx + 1}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" fontWeight={700} noWrap>{lesson.title}</Typography>
                  <Box sx={{ display: 'flex', gap: 0.75, mt: 0.25, flexWrap: 'wrap' }}>
                    <Chip label={`📖 ${lesson.duration} min`} size="small"
                      sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }} />
                    <Chip label={`⚡ +${lesson.xp} XP`} size="small"
                      sx={{ height: 20, fontSize: '0.72rem', fontWeight: 800,
                        bgcolor: '#8B5CF6', color: 'white' }} />
                    {lesson.type && (
                      <Chip label={lesson.type} size="small" variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem', textTransform: 'capitalize' }} />
                    )}
                  </Box>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ px: 3, pb: 3, pt: 1 }}>
                {/* Lesson content */}
                <Typography variant="body1" sx={{ lineHeight: 1.85, fontSize: '1.02rem', mb: 2.5 }}>
                  {lesson.content}
                </Typography>

                {/* Key Points */}
                {lesson.keyPoints && lesson.keyPoints.length > 0 && (
                  <Box sx={{
                    borderRadius: '14px', p: 2.5, mb: 2.5,
                    background: 'linear-gradient(135deg, #6C63FF10, #6C63FF20)',
                    border: '1px solid #6C63FF25',
                  }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>🔑 Key Points</Typography>
                    {lesson.keyPoints.map((point, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.75 }}>
                        <Typography variant="body2" sx={{ color: '#6C63FF', fontWeight: 700, mt: '2px' }}>✓</Typography>
                        <Typography variant="body2">{point}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                <Button
                  fullWidth
                  variant={isCompleted ? 'outlined' : 'contained'}
                  color={isCompleted ? 'success' : 'primary'}
                  size="large"
                  endIcon={isCompleted ? <CheckCircleRoundedIcon /> : <ArrowForwardRoundedIcon />}
                  onClick={() => handleComplete(lesson, idx)}
                  disabled={isCompleted && idx === totalCount - 1}
                  sx={{ borderRadius: '14px', py: 1.5 }}
                >
                  {isCompleted
                    ? idx < totalCount - 1 ? 'Continue to Next Lesson →' : 'Topic Completed! 🎉'
                    : idx < totalCount - 1 ? 'Mark Complete & Next Lesson' : 'Complete Topic! 🎉'}
                </Button>
              </AccordionDetails>
            </Accordion>
          )
        })}
      </Box>
    </Box>
  )
}

