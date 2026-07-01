import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Box, Typography, Card, CardContent, Button, Chip, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Tooltip, Divider, LinearProgress, Alert, CircularProgress,
} from '@mui/material'
import AddRoundedIcon          from '@mui/icons-material/AddRounded'
import SearchRoundedIcon       from '@mui/icons-material/SearchRounded'
import TableSortLabel          from '@mui/material/TableSortLabel'
import EditRoundedIcon         from '@mui/icons-material/EditRounded'
import VisibilityRoundedIcon   from '@mui/icons-material/VisibilityRounded'
import AssignmentRoundedIcon   from '@mui/icons-material/AssignmentRounded'
import AutoAwesomeRoundedIcon  from '@mui/icons-material/AutoAwesomeRounded'
import DeleteRoundedIcon       from '@mui/icons-material/DeleteRounded'
import LockRoundedIcon          from '@mui/icons-material/LockRounded'
import { quizzesApi, subjectsApi, classesApi } from '../../services/apiCatalog'
import QuestionEditor, { emptyQuestion, QUESTION_TYPES } from './QuestionEditor'

const difficultyColors = { easy: 'success', medium: 'warning', hard: 'error' }

/* ─── Simulated GenAI question bank ────────────────────────────────────── */
const AI_BANK = {
  Math: {
    easy: [
      { text: 'What is 6 × 7?', options: ['40', '42', '45', '48'], correctAnswer: '42', explanation: '6 × 7 = 42', points: 10 },
      { text: 'What is 15 + 28?', options: ['41', '43', '42', '40'], correctAnswer: '43', explanation: '15 + 28 = 43', points: 10 },
      { text: 'What is half of 80?', options: ['30', '40', '45', '35'], correctAnswer: '40', explanation: 'Half of 80 is 80 ÷ 2 = 40', points: 10 },
      { text: 'Which number is even?', options: ['13', '27', '34', '51'], correctAnswer: '34', explanation: '34 is divisible by 2', points: 10 },
      { text: 'What is 100 − 37?', options: ['63', '67', '73', '57'], correctAnswer: '63', explanation: '100 − 37 = 63', points: 10 },
    ],
    medium: [
      { text: 'What is 12 × 12?', options: ['124', '144', '132', '148'], correctAnswer: '144', explanation: '12 × 12 = 144', points: 15 },
      { text: 'What is 25% of 200?', options: ['40', '50', '60', '45'], correctAnswer: '50', explanation: '25% × 200 = 50', points: 15 },
      { text: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], correctAnswer: '6', explanation: 'A hexagon has 6 sides', points: 15 },
      { text: 'What is the square root of 81?', options: ['7', '8', '9', '10'], correctAnswer: '9', explanation: '9 × 9 = 81', points: 15 },
      { text: 'Solve: 3x = 24, x = ?', options: ['6', '7', '8', '9'], correctAnswer: '8', explanation: '3 × 8 = 24', points: 15 },
    ],
    hard: [
      { text: 'What is the LCM of 12 and 18?', options: ['24', '36', '48', '72'], correctAnswer: '36', explanation: 'LCM(12,18) = 36', points: 20 },
      { text: 'If 2x + 5 = 21, what is x?', options: ['7', '8', '9', '6'], correctAnswer: '8', explanation: '2x = 16, x = 8', points: 20 },
      { text: 'What fraction of 60 is 15?', options: ['1/3', '1/4', '1/5', '1/6'], correctAnswer: '1/4', explanation: '15/60 = 1/4', points: 20 },
      { text: 'Area of rectangle 8cm × 6cm?', options: ['28 cm²', '48 cm²', '42 cm²', '56 cm²'], correctAnswer: '48 cm²', explanation: '8 × 6 = 48 cm²', points: 20 },
      { text: 'What is 2³ + 3²?', options: ['15', '17', '13', '19'], correctAnswer: '17', explanation: '8 + 9 = 17', points: 20 },
    ],
  },
  English: {
    easy: [
      { text: 'Which word is a noun?', options: ['Run', 'Happy', 'Book', 'Quickly'], correctAnswer: 'Book', explanation: 'A noun is a person, place, or thing', points: 10 },
      { text: 'What is the plural of "child"?', options: ['Childs', 'Children', 'Childrens', 'Childes'], correctAnswer: 'Children', explanation: 'Irregular plural: child → children', points: 10 },
      { text: 'Which is a vowel?', options: ['B', 'C', 'E', 'T'], correctAnswer: 'E', explanation: 'Vowels: A, E, I, O, U', points: 10 },
      { text: 'Opposite of "happy" is?', options: ['Sad', 'Angry', 'Tired', 'Bored'], correctAnswer: 'Sad', explanation: 'Happy and sad are antonyms', points: 10 },
      { text: 'Which sentence is correct?', options: ['She go home', 'She goes home', 'She going home', 'She gone home'], correctAnswer: 'She goes home', explanation: 'Third person singular uses goes', points: 10 },
    ],
    medium: [
      { text: 'What is a synonym for "brave"?', options: ['Cowardly', 'Courageous', 'Cautious', 'Careless'], correctAnswer: 'Courageous', explanation: 'Brave and courageous have the same meaning', points: 15 },
      { text: 'Identify the adjective: "The tall girl ran fast."', options: ['girl', 'ran', 'tall', 'fast'], correctAnswer: 'tall', explanation: 'Tall describes the noun "girl"', points: 15 },
      { text: 'Which is correct punctuation?', options: ['Its raining.', "It's raining.", 'Its\' raining.', "Its raining!"], correctAnswer: "It's raining.", explanation: "It's = it is (contraction)", points: 15 },
      { text: 'What tense is "She was singing"?', options: ['Present', 'Future', 'Past Continuous', 'Past Simple'], correctAnswer: 'Past Continuous', explanation: 'Was + verb-ing = past continuous', points: 15 },
      { text: 'Choose the correct article: "___ honest man."', options: ['A', 'An', 'The', 'No article'], correctAnswer: 'An', explanation: '"An" before words starting with vowel sounds', points: 15 },
    ],
    hard: [
      { text: 'What figure of speech is "The thunder roared"?', options: ['Simile', 'Metaphor', 'Personification', 'Alliteration'], correctAnswer: 'Personification', explanation: 'Thunder is given a human action (roaring)', points: 20 },
      { text: 'Passive voice: "She wrote the letter" becomes?', options: ['The letter wrote she.', 'The letter was written by her.', 'She had written the letter.', 'The letter is written.'], correctAnswer: 'The letter was written by her.', explanation: 'Active to passive: object + was + past participle + by + subject', points: 20 },
      { text: 'Identify the clause: "Although it was raining, we played."', options: ['Independent', 'Dependent', 'Relative', 'Noun'], correctAnswer: 'Dependent', explanation: '"Although it was raining" cannot stand alone', points: 20 },
      { text: 'Which is a compound sentence?', options: ['She sings.', 'She sings and dances.', 'Because she sings.', 'She who sings.'], correctAnswer: 'She sings and dances.', explanation: 'Two independent clauses joined by "and"', points: 20 },
      { text: 'Correct spelling?', options: ['Accomodation', 'Accommodation', 'Accomadation', 'Acomodation'], correctAnswer: 'Accommodation', explanation: 'Double c, double m: accommodation', points: 20 },
    ],
  },
  GK: {
    easy: [
      { text: 'How many days are in a week?', options: ['5', '6', '7', '8'], correctAnswer: '7', explanation: 'A week has 7 days', points: 10 },
      { text: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], correctAnswer: 'Mercury', explanation: 'Mercury is the first planet from the Sun', points: 10 },
      { text: 'What is the national bird of India?', options: ['Sparrow', 'Eagle', 'Peacock', 'Parrot'], correctAnswer: 'Peacock', explanation: 'The peacock is India\'s national bird', points: 10 },
      { text: 'How many colours are in a rainbow?', options: ['5', '6', '7', '8'], correctAnswer: '7', explanation: 'VIBGYOR — 7 colours', points: 10 },
      { text: 'Water freezes at?', options: ['0°C', '10°C', '100°C', '50°C'], correctAnswer: '0°C', explanation: 'Water freezes at 0°C (32°F)', points: 10 },
    ],
    medium: [
      { text: 'Who wrote "Romeo and Juliet"?', options: ['Dickens', 'Shakespeare', 'Twain', 'Keats'], correctAnswer: 'Shakespeare', explanation: 'William Shakespeare wrote this tragedy', points: 15 },
      { text: 'Largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctAnswer: 'Pacific', explanation: 'Pacific Ocean covers about 46% of water surface', points: 15 },
      { text: 'Capital of France?', options: ['Rome', 'Berlin', 'Paris', 'Madrid'], correctAnswer: 'Paris', explanation: 'Paris is the capital and largest city of France', points: 15 },
      { text: 'What does CPU stand for?', options: ['Central Process Unit', 'Central Processing Unit', 'Computer Process Unit', 'Core Processing Unit'], correctAnswer: 'Central Processing Unit', explanation: 'CPU is the brain of a computer', points: 15 },
      { text: 'Mahatma Gandhi was born in?', options: ['1860', '1869', '1875', '1880'], correctAnswer: '1869', explanation: 'Mahatma Gandhi was born on 2 Oct 1869', points: 15 },
    ],
    hard: [
      { text: 'Largest planet in our solar system?', options: ['Saturn', 'Uranus', 'Jupiter', 'Neptune'], correctAnswer: 'Jupiter', explanation: 'Jupiter is 11× larger than Earth', points: 20 },
      { text: 'Who invented the telephone?', options: ['Edison', 'Bell', 'Tesla', 'Marconi'], correctAnswer: 'Bell', explanation: 'Alexander Graham Bell patented the telephone in 1876', points: 20 },
      { text: 'Chemical symbol for Gold?', options: ['Go', 'Gd', 'Au', 'Ag'], correctAnswer: 'Au', explanation: 'Au from Latin "aurum"', points: 20 },
      { text: 'How many bones are in the human body?', options: ['196', '206', '216', '226'], correctAnswer: '206', explanation: 'An adult human body has 206 bones', points: 20 },
      { text: 'First country to reach Mars?', options: ['USA', 'Russia', 'China', 'India'], correctAnswer: 'USA', explanation: 'Mariner 4 (NASA) flew past Mars in 1964', points: 20 },
    ],
  },
}

function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n).map((q, i) => ({ ...q, id: `gen-q-${Date.now()}-${i}` }))
}

/* ─── Assign-to-classes dialog ─────────────────────────────────────────── */
function AssignDialog({ quiz, classes, onClose, onSaved }) {
  const initial = (quiz.assignedClassIds || []).map(c => c?._id || c)
  const [selected, setSelected] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const id = quiz._id ?? quiz.id
      const res = await quizzesApi.update(id, { assignedClassIds: selected })
      onSaved(res.data?.quiz || { ...quiz, assignedClassIds: selected })
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update assignment.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
      <DialogTitle fontWeight={800}>Assign Quiz</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Assign <strong>{'"'}{quiz.title}{'"'}</strong> to one or more classes. Leave empty to keep it open to all students at the matching grade.
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <FormControl fullWidth>
          <InputLabel>Classes</InputLabel>
          <Select
            multiple
            label="Classes"
            value={selected}
            onChange={e => setSelected(e.target.value)}
            renderValue={(s) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {s.length === 0 ? <em>Open to all</em> : s.map(id => {
                  const c = classes.find(c => c._id === id)
                  return <Chip key={id} label={c ? `${c.name} (G${c.grade})` : id} size="small" />
                })}
              </Box>
            )}
          >
            {classes.length === 0 ? (
              <MenuItem disabled>No classes yet — create one under Classes</MenuItem>
            ) : classes.map(c => (
              <MenuItem key={c._id} value={c._id}>
                {c.name} — Grade {c.grade}{c.section ? ` · ${c.section}` : ''}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '10px' }}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={saving} sx={{ borderRadius: '10px' }}>
          {saving ? <CircularProgress size={20} /> : 'Save Assignment'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const emptyQuizForm = { title: '', subjectId: '', grade: '3', difficulty: 'easy', durationMinutes: 10, xpReward: 50, quizType: 'test', questionsToServe: '', assignedClassIds: [] }

export default function QuizManagementPage() {

  // Quizzes that any student has already started — these are locked from editing
  const attemptedQuizIds = useSelector(s => s.quiz.attemptedQuizIds)

  const [quizList,     setQuizList]     = useState([])
  const [loadingList,  setLoadingList]  = useState(true)
  const [listError,    setListError]    = useState('')
  const [subjects,     setSubjects]     = useState([])
  const [classes,      setClasses]      = useState([])
  const [saveError,    setSaveError]    = useState('')

  useEffect(() => {
    Promise.all([quizzesApi.getAll(), subjectsApi.getAll(), classesApi.getAll().catch(() => ({ data: { classes: [] } }))])
      .then(([qData, sData, cData]) => {
        setQuizList(qData.data.quizzes ?? qData.data)
        const subs = sData.data.subjects ?? sData.data
        setSubjects(subs)
        setClasses(cData.data?.classes ?? [])
        // set default subjectId once subjects are loaded
        if (subs.length) setQuizForm(f => ({ ...f, subjectId: f.subjectId || subs[0]._id }))
      })
      .catch(() => setListError('Failed to load data. Is the backend running?'))
      .finally(() => setLoadingList(false))
  }, [])
  const [search,       setSearch]       = useState('')
  const [filter,       setFilter]       = useState('all')
  const [sortCol,      setSortCol]      = useState('title')
  const [sortDir,      setSortDir]      = useState('asc')

  const handleSort = (col) => {
    setSortDir(prev => (sortCol === col && prev === 'asc') ? 'desc' : 'asc')
    setSortCol(col)
  }
  const [showCreate,   setShowCreate]   = useState(false)
  const [editQuiz,     setEditQuiz]     = useState(null)
  const [viewQuiz,     setViewQuiz]     = useState(null)
  const [deleteQuiz,   setDeleteQuiz]   = useState(null)
  const [assignQuiz,   setAssignQuiz]   = useState(null)

  /* GenAI state */
  const [aiPrompt,     setAiPrompt]     = useState('')
  const [aiLoading,    setAiLoading]    = useState(false)
  const [aiQuestions,  setAiQuestions]  = useState([])
  const [aiGenerated,  setAiGenerated]  = useState(false)
  const [quizForm,     setQuizForm]     = useState(emptyQuizForm)

  const filtered = quizList
    .filter(q => {
      const matchSearch = q.title.toLowerCase().includes(search.toLowerCase())
      const matchFilter = filter === 'all' || q.difficulty === filter
      return matchSearch && matchFilter
    })
    .sort((a, b) => {
      let aVal, bVal
      if (sortCol === 'title')       { aVal = a.title || ''; bVal = b.title || '' }
      else if (sortCol === 'subject'){ aVal = subjectLabel(a.subjectId); bVal = subjectLabel(b.subjectId) }
      else if (sortCol === 'grade')  { aVal = String(a.grade || ''); bVal = String(b.grade || '') }
      else if (sortCol === 'questions') { aVal = a.totalQuestions ?? a.questions?.length ?? 0; bVal = b.totalQuestions ?? b.questions?.length ?? 0 }
      else if (sortCol === 'difficulty') { const order = { easy: 0, medium: 1, hard: 2 }; aVal = order[a.difficulty] ?? 0; bVal = order[b.difficulty] ?? 0 }
      else if (sortCol === 'xp')     { aVal = a.xpReward ?? 0; bVal = b.xpReward ?? 0 }
      else                           { aVal = ''; bVal = '' }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const openCreate = () => {
    setQuizForm({ ...emptyQuizForm, subjectId: subjects[0]?._id || '' })
    setAiPrompt('')
    setAiQuestions([])
    setAiGenerated(false)
    setSaveError('')
    setShowCreate(true)
  }

  /* ─── Simulated AI generation ─── */
  const selectedSubjectName = subjects.find(s => s._id === quizForm.subjectId)?.name || 'GK'
  const aiSubjectKey = selectedSubjectName.toLowerCase().includes('math') ? 'Math'
    : selectedSubjectName.toLowerCase().includes('english') ? 'English' : 'GK'
  const handleGenerate = async () => {
    setAiLoading(true)
    setAiGenerated(false)
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1800))
    const bank = AI_BANK[aiSubjectKey]?.[quizForm.difficulty] || AI_BANK.GK.easy
    const generated = pickRandom(bank, 5)
    setAiQuestions(generated)
    setAiLoading(false)
    setAiGenerated(true)
    if (!quizForm.title) {
      setQuizForm(f => ({ ...f, title: `${selectedSubjectName} Quiz — ${quizForm.difficulty} (Grade ${quizForm.grade})` }))
    }
  }

  const handleSaveQuiz = async () => {
    setSaveError('')
    const questions = aiQuestions.length > 0 ? aiQuestions : []
    const payload = {
      title:           quizForm.title,
      subjectId:       quizForm.subjectId,
      grade:           quizForm.grade,
      difficulty:      quizForm.difficulty,
      durationMinutes: quizForm.durationMinutes,
      xpReward:        quizForm.xpReward,
      quizType:        quizForm.quizType,
      questionsToServe: quizForm.questionsToServe ? Number(quizForm.questionsToServe) : null,
      assignedClassIds: quizForm.assignedClassIds || [],
      questions,
    }
    try {
      if (editQuiz) {
        const data = await quizzesApi.update(editQuiz._id ?? editQuiz.id, payload)
        const updated = data.data.quiz
        setQuizList(prev => prev.map(q => (q._id ?? q.id) === (editQuiz._id ?? editQuiz.id) ? updated : q))
        setEditQuiz(null)
        setShowCreate(false)
      } else {
        const data = await quizzesApi.create(payload)
        const created = data.data.quiz
        setQuizList(prev => [...prev, created])
        setShowCreate(false)
      }
    } catch (err) {
      setSaveError(err.response?.data?.message || err.message || 'Failed to save quiz.')
      return
    }
    setAiQuestions([])
    setAiGenerated(false)
  }

  const openEdit = (quiz) => {
    if (attemptedQuizIds.includes(quiz._id ?? quiz.id)) return
    setQuizForm({
      title:           quiz.title,
      subjectId:       quiz.subjectId?._id ?? quiz.subjectId ?? '',
      grade:           String(quiz.grade || '3'),
      difficulty:      quiz.difficulty,
      durationMinutes: quiz.durationMinutes,
      xpReward:        quiz.xpReward,
      quizType:        quiz.quizType || 'test',
      questionsToServe: quiz.questionsToServe ?? '',
      assignedClassIds: (quiz.assignedClassIds || []).map(c => c?._id || c),
    })
    setAiQuestions(quiz.questions || [])
    setAiGenerated(false)
    setEditQuiz(quiz)
    setShowCreate(true)
  }

  // subjectId may be a populated object { _id, name } or a raw ObjectId string
  const subjectLabel = (subjectId) => {
    if (!subjectId) return '—'
    // If already populated with a name
    if (typeof subjectId === 'object' && subjectId.name) return subjectId.name
    // Look up by _id in subjects list
    const id = typeof subjectId === 'object' ? subjectId._id : subjectId
    const found = subjects.find(s => s._id === id)
    return found ? found.name : '—'
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>📝 Quiz Management</Typography>
          <Typography variant="body2" color="text.secondary">Create and manage quizzes for your students</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate} sx={{ borderRadius: '10px' }}>
          Create Quiz
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Quizzes', value: quizList.length,                               color: '#1E40AF' },
          { label: 'Easy',          value: quizList.filter(q => q.difficulty === 'easy').length,   color: '#10B981' },
          { label: 'Medium',        value: quizList.filter(q => q.difficulty === 'medium').length, color: '#F59E0B' },
          { label: 'Hard',          value: quizList.filter(q => q.difficulty === 'hard').length,   color: '#EF4444' },
        ].map(s => (
          <Grid item xs={6} sm={3} key={s.label}>
            <Card sx={{ borderRadius: '12px' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>{s.label}</Typography>
                <Typography variant="h5" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField size="small" placeholder="Search quizzes…" value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }}
          sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
        <FormControl sx={{ minWidth: 130 }} size="small">
          <InputLabel>Difficulty</InputLabel>
          <Select value={filter} label="Difficulty" onChange={e => setFilter(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Quiz Table */}
      <Card sx={{ borderRadius: '12px', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' } }}>
                {[['title','Quiz'],['subject','Subject'],['grade','Grade'],['questions','Questions'],['difficulty','Difficulty'],['xp','XP']].map(([col, label]) => (
                  <TableCell key={col} sortDirection={sortCol === col ? sortDir : false}>
                    <TableSortLabel
                      active={sortCol === col}
                      direction={sortCol === col ? sortDir : 'asc'}
                      onClick={() => handleSort(col)}
                    >
                      {label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingList && (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}>Loading quizzes…</TableCell></TableRow>
              )}
              {!loadingList && listError && (
                <TableRow><TableCell colSpan={7}><Alert severity="error">{listError}</Alert></TableCell></TableRow>
              )}
              {!loadingList && !listError && filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No quizzes found</TableCell></TableRow>
              )}
              {filtered.map(quiz => (
                  <TableRow key={quiz._id ?? quiz.id} hover sx={attemptedQuizIds.includes(quiz._id ?? quiz.id) ? { bgcolor: '#FAFAFA' } : {}}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography sx={{ fontSize: '1.4rem' }}>{quiz.subjectId?.icon || '📝'}</Typography>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <Typography variant="body2" fontWeight={600}>{quiz.title}</Typography>
                            {attemptedQuizIds.includes(quiz._id ?? quiz.id) && (
                              <Chip
                                icon={<LockRoundedIcon sx={{ fontSize: '0.7rem !important' }} />}
                                label="Attempted"
                                size="small"
                                color="warning"
                                variant="outlined"
                                sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700 }}
                              />
                            )}
                          </Box>
                        <Typography variant="caption" color="text.secondary">
                          {quiz.durationMinutes} min
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={subjectLabel(quiz.subjectId)} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                  </TableCell>
                  <TableCell>Grade {quiz.grade}</TableCell>
                  <TableCell>{quiz.totalQuestions || quiz.questions?.length || 0}</TableCell>
                  <TableCell>
                    <Chip label={quiz.difficulty} size="small" color={difficultyColors[quiz.difficulty]}
                      sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                  </TableCell>
                  <TableCell>⚡ {quiz.xpReward}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title="Preview quiz" placement="top">
                      <IconButton size="small" onClick={() => setViewQuiz(quiz)}>
                        <VisibilityRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={attemptedQuizIds.includes(quiz._id ?? quiz.id)
                        ? '🔒 Quiz is locked — a student has already attempted it'
                        : 'Edit quiz'}
                      placement="top"
                    >
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => openEdit(quiz)}
                          disabled={attemptedQuizIds.includes(quiz._id ?? quiz.id)}
                          sx={attemptedQuizIds.includes(quiz._id ?? quiz.id) ? { color: 'text.disabled' } : {}}
                        >
                          {attemptedQuizIds.includes(quiz._id ?? quiz.id)
                            ? <LockRoundedIcon fontSize="small" />
                            : <EditRoundedIcon fontSize="small" />}
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Assign to class" placement="top">
                      <IconButton size="small" color="primary" onClick={() => setAssignQuiz(quiz)}>
                        <AssignmentRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete quiz" placement="top">
                      <IconButton size="small" color="error" onClick={() => setDeleteQuiz(quiz)}>
                        <DeleteRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Dialogs */}

      {/* ── Create / Edit Quiz Dialog ── */}
      <Dialog open={showCreate || Boolean(editQuiz)} onClose={() => { setShowCreate(false); setEditQuiz(null) }}
        maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          {editQuiz ? '✏️ Edit Quiz' : '📝 Create New Quiz'}
        </DialogTitle>
        <DialogContent dividers>
          {saveError && <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>{saveError}</Alert>}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Quiz Title *" value={quizForm.title}
                onChange={e => setQuizForm(f => ({ ...f, title: e.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Quiz Type</InputLabel>
                <Select value={quizForm.quizType || 'test'} label="Quiz Type"
                  onChange={e => setQuizForm(f => ({ ...f, quizType: e.target.value }))}>
                  <MenuItem value="test">📝 Test</MenuItem>
                  <MenuItem value="practice">🎯 Practice</MenuItem>
                  <MenuItem value="flashcard">💡 Flashcard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select value={quizForm.subjectId} label="Subject"
                  onChange={e => setQuizForm(f => ({ ...f, subjectId: e.target.value }))}>
                  {subjects.map(s => <MenuItem key={s._id} value={s._id}>{s.icon} {s.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Grade</InputLabel>
                <Select value={quizForm.grade} label="Grade"
                  onChange={e => setQuizForm(f => ({ ...f, grade: e.target.value }))}>
                  {['Nursery', 'KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(g => (
                    <MenuItem key={g} value={g}>{isNaN(g) ? g : `Grade ${g}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select value={quizForm.difficulty} label="Difficulty"
                  onChange={e => setQuizForm(f => ({ ...f, difficulty: e.target.value }))}>
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="number" label="Duration (min)" value={quizForm.durationMinutes}
                onChange={e => setQuizForm(f => ({ ...f, durationMinutes: Number(e.target.value) }))} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth type="number" label="XP Reward" value={quizForm.xpReward}
                onChange={e => setQuizForm(f => ({ ...f, xpReward: Number(e.target.value) }))} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="number" label="Questions per attempt (random pick)"
                helperText={`Leave blank to serve all ${aiQuestions.length || 'configured'} questions`}
                value={quizForm.questionsToServe}
                inputProps={{ min: 1, max: aiQuestions.length || undefined }}
                onChange={e => setQuizForm(f => ({ ...f, questionsToServe: e.target.value }))} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Assign to classes</InputLabel>
                <Select
                  multiple
                  label="Assign to classes"
                  value={quizForm.assignedClassIds || []}
                  onChange={e => setQuizForm(f => ({ ...f, assignedClassIds: e.target.value }))}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.length === 0 ? <em>Open to all</em> : selected.map(id => {
                        const c = classes.find(c => c._id === id)
                        return <Chip key={id} label={c ? `${c.name} (G${c.grade})` : id} size="small" />
                      })}
                    </Box>
                  )}
                >
                  {classes.length === 0 ? (
                    <MenuItem disabled>No classes yet — create one under Classes</MenuItem>
                  ) : classes.map(c => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.name} — Grade {c.grade}{c.section ? ` · ${c.section}` : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* GenAI Section */}
          <Box sx={{
            p: 2.5, borderRadius: '16px', mb: 2,
            background: 'linear-gradient(135deg, #6C63FF10 0%, #A78BFA20 100%)',
            border: '1.5px solid #6C63FF30',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <AutoAwesomeRoundedIcon sx={{ color: '#6C63FF' }} />
              <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#6C63FF' }}>AI Quiz Generator</Typography>
              <Chip label="MCQ questions" size="small"
                sx={{ bgcolor: '#10B98120', color: '#065F46', fontWeight: 700, fontSize: '0.65rem' }} />
            </Box>
            <TextField fullWidth multiline rows={2}
              placeholder={`e.g. "Generate 5 questions on multiplication for Grade ${quizForm.grade} students"`}
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              sx={{ mb: 1.5, bgcolor: 'background.paper', borderRadius: '10px',
                '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
            <Button variant="contained" startIcon={aiLoading ? null : <AutoAwesomeRoundedIcon />}
              onClick={handleGenerate} disabled={aiLoading}
              sx={{ background: 'linear-gradient(135deg, #6C63FF, #A78BFA)', borderRadius: '10px',
                '&:hover': { background: 'linear-gradient(135deg, #5B52EE, #9670F9)' } }}>
              {aiLoading ? 'Generating...' : aiGenerated ? '✨ Regenerate' : '✨ Generate with AI'}
            </Button>
            {aiLoading && <LinearProgress sx={{ mt: 1.5, borderRadius: '100px' }} />}
            {aiGenerated && (
              <Alert severity="success" sx={{ mt: 1.5, borderRadius: '10px' }}>
                ✅ {aiQuestions.length} questions generated! Edit or add more below.
              </Alert>
            )}
          </Box>

          {/* Questions editor */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={700}>
                📋 Questions ({aiQuestions.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select
                    value=""
                    displayEmpty
                    onChange={e => {
                      if (!e.target.value) return
                      setAiQuestions(prev => [...prev, emptyQuestion(e.target.value)])
                    }}
                    renderValue={() => '+ Add Question'}
                    sx={{ borderRadius: '8px', fontSize: '0.8rem' }}>
                    {QUESTION_TYPES.map(t => (
                      <MenuItem key={t.value} value={t.value}>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{t.label}</Typography>
                          <Typography variant="caption" color="text.secondary">{t.desc}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            {aiQuestions.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary', bgcolor: 'action.hover', borderRadius: '12px' }}>
                <Typography variant="body2">No questions yet. Use AI or add manually above.</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {aiQuestions.map((q, qi) => (
                <QuestionEditor
                  key={qi}
                  index={qi}
                  question={q}
                  onChange={updated => setAiQuestions(prev => prev.map((item, i) => i === qi ? updated : item))}
                  onDelete={() => setAiQuestions(prev => prev.filter((_, i) => i !== qi))}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => { setShowCreate(false); setEditQuiz(null) }} variant="outlined" sx={{ borderRadius: '10px' }}>
            Cancel
          </Button>
          <Button onClick={handleSaveQuiz} variant="contained"
            disabled={!quizForm.title || !quizForm.subjectId}
            sx={{ borderRadius: '10px', px: 3 }}>
            {editQuiz ? 'Save Changes' : 'Save Quiz'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── View Quiz Dialog ── */}
      {viewQuiz && (
        <Dialog open onClose={() => setViewQuiz(null)} maxWidth="sm" fullWidth
          PaperProps={{ sx: { borderRadius: '20px' } }}>
          <DialogTitle fontWeight={800}>{viewQuiz.icon} {viewQuiz.title}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip label={subjectLabel(viewQuiz.subjectId)} size="small" />
              <Chip label={`Grade ${viewQuiz.grade}`} size="small" />
              <Chip label={viewQuiz.difficulty} size="small" color={difficultyColors[viewQuiz.difficulty]} />
              <Chip label={`⏱ ${viewQuiz.durationMinutes} min`} size="small" />
              <Chip label={`⚡ ${viewQuiz.xpReward} XP`} size="small" sx={{ bgcolor: '#8B5CF620', color: '#8B5CF6', fontWeight: 700 }} />
            </Box>
            {(viewQuiz.questions || []).map((q, i) => (
              <Box key={i} sx={{ mb: 1.5, p: 1.5, bgcolor: 'action.hover', borderRadius: '10px' }}>
                <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>Q{i + 1}. {q.text}</Typography>
                {(q.options || []).map((opt, j) => (
                  <Typography key={j} variant="caption" sx={{
                    display: 'block',
                    color: opt === q.correctAnswer ? 'success.main' : 'text.secondary',
                    fontWeight: opt === q.correctAnswer ? 700 : 400,
                  }}>
                    {opt === q.correctAnswer ? '✓' : '○'} {opt}
                  </Typography>
                ))}
              </Box>
            ))}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setViewQuiz(null)} variant="contained" sx={{ borderRadius: '10px' }}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* ── Assign Dialog ── */}
      {assignQuiz && (
        <AssignDialog
          quiz={assignQuiz}
          classes={classes}
          onClose={() => setAssignQuiz(null)}
          onSaved={(updated) => {
            setQuizList(prev => prev.map(q => (q._id ?? q.id) === (updated._id ?? updated.id) ? { ...q, ...updated } : q))
            setAssignQuiz(null)
          }}
        />
      )}

      <Dialog open={Boolean(deleteQuiz)} onClose={() => setDeleteQuiz(null)}
        PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle fontWeight={800}>Delete Quiz?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete <strong>{'"'}{deleteQuiz?.title}{'"'}</strong>? This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDeleteQuiz(null)} variant="outlined" sx={{ borderRadius: '10px' }}>Cancel</Button>
          <Button color="error" variant="contained" sx={{ borderRadius: '10px' }}
            onClick={async () => {
              const id = deleteQuiz._id ?? deleteQuiz.id
              try {
                await quizzesApi.delete(id)
                setQuizList(prev => prev.filter(q => (q._id ?? q.id) !== id))
              } catch (err) { console.error('Delete failed', err) }
              setDeleteQuiz(null)
            }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
