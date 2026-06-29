import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Box, Grid, Typography, Chip, InputAdornment, TextField, CircularProgress, Alert } from '@mui/material'
import { useState, useEffect } from 'react'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import QuizCard from '../../components/common/QuizCard'
import { quizzesApi } from '../../services/apiCatalog'

const subjectFilters = [
  { label: 'All Quizzes',       value: '',         icon: '🎯' },
  { label: 'Mathematics',       value: 'math',     icon: '🔢' },
  { label: 'English',           value: 'english',  icon: '📚' },
  { label: 'General Knowledge', value: 'gk',       icon: '🌍' },
]

const difficultyFilters = [
  { label: 'All Levels', value: '' },
  { label: 'Easy',       value: 'easy' },
  { label: 'Medium',     value: 'medium' },
  { label: 'Hard',       value: 'hard' },
]

export default function QuizListPage() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const attemptedQuizIds = useSelector(s => s.quiz.attemptedQuizIds)

  const [allQuizzes, setAllQuizzes]       = useState([])
  const [completedIds, setCompletedIds]   = useState(new Set())
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')
  const [subjectName, setSubjectName]     = useState('')
  const [difficulty, setDifficulty]       = useState('')
  const [search, setSearch]               = useState('')

  // Load quizzes and my attempts together
  useEffect(() => {
    setLoading(true)
    Promise.all([
      quizzesApi.getAll(),
      quizzesApi.getMyAttempts(),
    ])
      .then(([quizData, attemptsData]) => {
        setAllQuizzes(quizData.data.quizzes)
        const ids = new Set((attemptsData.data.attempts ?? []).map(a => String(a.quizId?._id ?? a.quizId)))
        setCompletedIds(ids)
      })
      .catch(() => setError('Failed to load quizzes.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = allQuizzes.filter(q => {
    const subjectMatch = !subjectName ||
      q.subjectId?.name?.toLowerCase().includes(subjectName)
    const diffMatch    = !difficulty || q.difficulty === difficulty
    const searchMatch  = !search || q.title.toLowerCase().includes(search.toLowerCase())
    return subjectMatch && diffMatch && searchMatch
  })

  const handleStartQuiz = (quiz) => {
    if (completedIds.has(String(quiz._id))) {
      navigate(`/student/quiz/${quiz._id}/result`)
    } else {
      navigate(`/student/quiz/${quiz._id}`)
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>🎯 Quizzes</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>Test your knowledge and earn XP!</Typography>

      <TextField
        fullWidth size="small" placeholder="Search quizzes..."
        value={search} onChange={e => setSearch(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }}
        sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
      />

      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5, mb: 1.5, '&::-webkit-scrollbar': { display: 'none' } }}>
        {subjectFilters.map(f => (
          <Chip key={f.value} label={`${f.icon} ${f.label}`} onClick={() => setSubjectName(f.value)}
            variant={subjectName === f.value ? 'filled' : 'outlined'} color={subjectName === f.value ? 'primary' : 'default'}
            sx={{ flexShrink: 0, fontWeight: subjectName === f.value ? 700 : 500, borderRadius: '10px', cursor: 'pointer' }} />
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5, mb: 3, '&::-webkit-scrollbar': { display: 'none' } }}>
        {difficultyFilters.map(f => (
          <Chip key={f.value} label={f.label || 'All'} size="small" onClick={() => setDifficulty(f.value)}
            variant={difficulty === f.value ? 'filled' : 'outlined'}
            color={difficulty === f.value
              ? f.value === 'easy' ? 'success' : f.value === 'medium' ? 'warning' : f.value === 'hard' ? 'error' : 'primary'
              : 'default'}
            sx={{ flexShrink: 0, fontWeight: difficulty === f.value ? 700 : 500, borderRadius: '8px', cursor: 'pointer' }} />
        ))}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}><CircularProgress /></Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>🔍</Typography>
          <Typography variant="subtitle1" color="text.secondary">No quizzes match your filters</Typography>
        </Box>
      ) : (
        <>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
            {filtered.length} quiz{filtered.length !== 1 ? 'zes' : ''} found
          </Typography>
          <Grid container spacing={2}>
            {filtered.map(quiz => {
              const done = completedIds.has(String(quiz._id))
              return (
                <Grid item xs={12} sm={6} key={quiz._id}>
                  <QuizCard
                    quiz={{ ...quiz, id: quiz._id, completed: done }}
                    onClick={() => handleStartQuiz(quiz)}
                  />
                </Grid>
              )
            })}
          </Grid>
        </>
      )}
    </Box>
  )
}

