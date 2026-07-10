import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  Box, Typography, Button, Chip, LinearProgress, Card, CardContent,
  Accordion, AccordionSummary, AccordionDetails, Avatar, CircularProgress, Alert,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { topicsApi, lessonsApi, progressApi } from '../../services/apiCatalog'
import { updateUser } from '../../store/slices/authSlice'

const getYoutubeEmbedUrl = (rawUrl = '') => {
  if (!rawUrl) return ''

  const value = rawUrl.trim()
  const videoIdPatterns = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/(?:watch\?v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/,
    /youtube\.com\/watch\?.*[?&]v=([A-Za-z0-9_-]{11})/,
  ]

  for (const pattern of videoIdPatterns) {
    const match = value.match(pattern)
    if (match?.[1]) {
      return `https://www.youtube-nocookie.com/embed/${match[1]}?controls=1&fs=1&modestbranding=1&rel=0&playsinline=1`
    }
  }

  return ''
}

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
      progressApi.getCompletedLessons().catch(() => null),
    ])
      .then(([topData, lesData, progData]) => {
        setTopic(topData?.data?.topic ?? topData?.topic ?? topData?.data ?? null)
        const lessons = lesData?.data?.lessons ?? lesData?.lessons ?? lesData?.data ?? []
        const lessonArr = Array.isArray(lessons) ? lessons : []
        setLessonList(lessonArr)
        const ids = (progData?.data?.user?.completedLessons ?? progData?.user?.completedLessons ?? []).map(id => id.toString())
        setCompletedLessons(new Set(ids))
      })
      .catch(() => setError('Failed to load lessons.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [topicId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAccordionChange = (lessonId) => (_, isExpanded) => {
    setExpanded(isExpanded ? lessonId : null)
  }

  const [saveError, setSaveError] = useState('')

  const handleComplete = (lesson, idx) => {
    setSaveError('')
    // Optimistically mark as done
    setCompletedLessons(prev => new Set([...prev, lesson._id]))
    lessonsApi.complete(lesson._id)
      .then(res => {
        const u = res?.data?.user ?? res?.data?.data?.user
        if (u) dispatch(updateUser(u))
        // Update local completedLessons from server response
        const ids = u?.completedLessons
        if (ids) setCompletedLessons(new Set(ids.map(String)))
      })
      .catch(err => {
        // Revert optimistic update
        setCompletedLessons(prev => {
          const next = new Set(prev)
          next.delete(lesson._id)
          return next
        })
        const msg = err?.response?.data?.message || 'Failed to save progress. Please try again.'
        setSaveError(msg)
      })
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
        action={<Button variant="text" color="inherit" size="small" onClick={load}>Retry</Button>}
      >
        {error}
      </Alert>
    </Box>
  )

  if (!lessonList.length) return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <Button variant="text" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate(-1)}>Back</Button>
      </Box>
      {topic && (
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
          {topic.icon} {topic.name}
        </Typography>
      )}
      <Box sx={{
        textAlign: 'center', py: 8, px: 3,
        bgcolor: 'background.paper', borderRadius: '20px',
        border: '2px dashed', borderColor: 'divider',
      }}>
        <Typography variant="h2" sx={{ mb: 2 }}>📖</Typography>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          No lessons yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Lessons for this topic haven{"'"}t been added yet.
          Check back soon or explore other topics.
        </Typography>
        <Button variant="contained" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate(-1)}
          sx={{ borderRadius: '10px' }}>
          Browse Other Topics
        </Button>
      </Box>
    </Box>
  )

  const completedCount = completedLessons.size
  const totalCount     = lessonList.length
  const progressPct    = Math.round((completedCount / totalCount) * 100)

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 800, mx: 'auto' }}>
      {/* Back button — left-aligned */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <Button variant="text" startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate(-1)}>Back</Button>
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

      {saveError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSaveError('')}>{saveError}</Alert>
      )}

      {/* Lesson Accordions */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {lessonList.map((lesson, idx) => {
          const isCompleted = completedLessons.has(lesson._id)
          const isExpanded = expanded === lesson._id
          const videoUrl = lesson.youtubeUrl ?? lesson.videoUrl ?? ''
          const embedUrl = getYoutubeEmbedUrl(videoUrl)

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
                {(lesson.type === 'video' || videoUrl) && (
                  <Card
                    variant="outlined"
                    sx={{ mb: 2.5, borderRadius: '16px', overflow: 'hidden', borderColor: 'divider' }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
                        <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 0.5 }}>
                          🎬 Video lesson
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Use the player controls to play, pause, seek, and expand to fullscreen.
                        </Typography>
                      </Box>

                      {embedUrl ? (
                        <Box sx={{ position: 'relative', width: '100%', pt: '56.25%', bgcolor: '#0F172A' }}>
                          <Box
                            component="iframe"
                            src={embedUrl}
                            title={lesson.title}
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            sx={{
                              position: 'absolute',
                              inset: 0,
                              width: '100%',
                              height: '100%',
                              border: 0,
                            }}
                          />
                        </Box>
                      ) : (
                        <Box sx={{ px: 2, pb: 2 }}>
                          <Alert severity="info">This lesson is marked as a video lesson, but no valid YouTube link was provided yet.</Alert>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                )}

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

