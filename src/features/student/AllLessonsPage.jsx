import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  Box, Typography, CircularProgress, Alert, Button,
  Accordion, AccordionSummary, AccordionDetails,
  Chip, LinearProgress, TextField, InputAdornment,
} from '@mui/material'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import { subjectsApi } from '../../services/apiCatalog'

export default function AllLessonsPage() {
  const navigate = useNavigate()
  const authUser  = useSelector(s => s.auth.user)
  const studentGrade = authUser?.grade || ''
  const completedLessonIds = new Set((authUser?.completedLessons || []).map(String))

  const [groups, setGroups]     = useState([])   // [{ subject, topics: [{ topic, lessons }] }]
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError('')
    const topicParams = studentGrade ? { grade: studentGrade } : {}

    subjectsApi.getAll()
      .then(async sData => {
        const subjects = sData?.data?.subjects ?? sData?.subjects ?? []
        if (!Array.isArray(subjects) || subjects.length === 0) { setGroups([]); return }

        const subjectGroups = await Promise.all(
          subjects.map(async subject => {
            const tData = await subjectsApi.getTopics(subject._id, topicParams).catch(e => {
              console.error('getTopics failed for', subject.name, e?.response?.data || e.message)
              return null
            })
            // getTopicsBySubject already returns lessonCount + lessonIds per topic —
            // no need to call getLessons separately (which filters by moderationStatus).
            const topicList = tData?.data?.topics ?? tData?.topics ?? []
            if (!Array.isArray(topicList) || topicList.length === 0) return null
            return { subject, topics: topicList }
          })
        )
        const validGroups = subjectGroups.filter(Boolean)
        setGroups(validGroups)
        if (validGroups[0]) setExpanded(validGroups[0].subject._id)
      })
      .catch(e => {
        console.error('Failed to load subjects:', e?.response?.data || e.message)
        setError('Failed to load lessons. Please try again.')
      })
      .finally(() => setLoading(false))
  }, [studentGrade]) // eslint-disable-line react-hooks/exhaustive-deps

  // Filter topics by search term
  const searchLc = search.toLowerCase()
  const filteredGroups = groups.map(g => ({
    ...g,
    topics: g.topics.filter(t =>
      !searchLc ||
      t.name?.toLowerCase().includes(searchLc) ||
      g.subject.name?.toLowerCase().includes(searchLc)
    ),
  })).filter(g => g.topics.length > 0)

  const totalLessons    = groups.reduce((s, g) => s + g.topics.reduce((ss, t) => ss + (t.lessonCount ?? 0), 0), 0)
  const completedInPage = groups.reduce((s, g) =>
    s + g.topics.reduce((ss, t) =>
      ss + (t.lessonIds ?? []).filter(id => completedLessonIds.has(String(id))).length, 0), 0)

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>
  )

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 860, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>📖 All Lessons</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {completedInPage} / {totalLessons} lessons completed
      </Typography>

      {totalLessons > 0 && (
        <LinearProgress
          variant="determinate"
          value={Math.round((completedInPage / totalLessons) * 100)}
          sx={{ mb: 3, height: 8, borderRadius: '100px' }}
        />
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}
          action={<Button variant="text" color="inherit" size="small" onClick={() => window.location.reload()}>Retry</Button>}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth size="small" placeholder="Search topics or subjects…"
        value={search} onChange={e => setSearch(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }}
        sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
      />

      {filteredGroups.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'background.paper', borderRadius: '20px', border: '2px dashed', borderColor: 'divider' }}>
          <Typography variant="h2" sx={{ mb: 2 }}>📖</Typography>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {search ? 'No topics match your search' : 'No lessons available yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {search ? 'Try a different search term.' : 'Check back once your teacher adds lessons.'}
          </Typography>
        </Box>
      )}

      {/* Subject accordions */}
      {filteredGroups.map(({ subject, topics }) => (
        <Accordion
          key={subject._id}
          expanded={expanded === subject._id}
          onChange={(_, open) => setExpanded(open ? subject._id : null)}
          disableGutters elevation={0}
          sx={{ mb: 1.5, borderRadius: '16px !important', border: '2px solid', borderColor: 'divider', '&:before': { display: 'none' }, overflow: 'hidden' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />} sx={{ px: 2, py: 1, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
              <Typography sx={{ fontSize: '1.6rem', lineHeight: 1 }}>{subject.icon}</Typography>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={800}>{subject.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {topics.reduce((s, t) => s + (t.lessonCount ?? 0), 0)} lessons across {topics.length} topic{topics.length !== 1 ? 's' : ''}
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {topics.map(topic => {
              const total     = topic.lessonCount ?? 0
              const completed = (topic.lessonIds ?? []).filter(id => completedLessonIds.has(String(id))).length
              const pct       = total > 0 ? Math.round((completed / total) * 100) : 0
              return (
                <Box
                  key={topic._id}
                  onClick={() => navigate(`/student/topics/${topic._id}/lessons`)}
                  sx={{
                    p: 1.5, borderRadius: '12px', border: '1.5px solid', borderColor: 'divider',
                    bgcolor: 'background.paper', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' },
                    transition: 'all 0.15s',
                  }}
                >
                  <Typography sx={{ fontSize: '1.4rem', lineHeight: 1, flexShrink: 0 }}>{topic.icon}</Typography>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={700} noWrap>{topic.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <LinearProgress
                        variant="determinate" value={pct}
                        sx={{ flex: 1, height: 5, borderRadius: '100px' }}
                        color={pct === 100 ? 'success' : 'primary'}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                        {completed}/{total}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5, flexShrink: 0 }}>
                    <Chip label={topic.difficulty} size="small"
                      color={topic.difficulty === 'easy' ? 'success' : topic.difficulty === 'medium' ? 'warning' : 'error'}
                      variant="outlined" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700 }} />
                    <Button size="small" variant={pct === 100 ? 'outlined' : 'contained'}
                      color={pct === 100 ? 'success' : 'primary'}
                      startIcon={pct === 100 ? <CheckCircleRoundedIcon /> : <PlayArrowRoundedIcon />}
                      onClick={e => { e.stopPropagation(); navigate(`/student/topics/${topic._id}/lessons`) }}
                      sx={{ borderRadius: '8px', fontSize: '0.68rem', py: 0.3 }}>
                      {pct === 100 ? 'Review' : pct > 0 ? 'Continue' : 'Start'}
                    </Button>
                  </Box>
                </Box>
              )
            })}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}
