import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box, Grid, Card, CardContent, Typography, Button,
  Chip, CircularProgress, Alert,
} from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import StatCard from '../../components/common/StatCard'
import SubjectCard from '../../components/common/SubjectCard'
import QuizCard from '../../components/common/QuizCard'
import BadgeCard from '../../components/common/BadgeCard'
import { subjectsApi, quizzesApi } from '../../services/apiCatalog'
import { useState, useEffect } from 'react'

export default function StudentDashboard() {
  const { user } = useSelector(s => s.auth)
  const navigate = useNavigate()
  const [subjects, setSubjects]       = useState([])
  const [recentQuizzes, setRecentQuizzes] = useState([])
  const [subjectProgress, setSubjectProgress] = useState({})  // { [subjectId]: 0..100 }
  const [loading, setLoading]         = useState(true)
  const [attemptsFailed, setAttemptsFailed] = useState(false)

  useEffect(() => {
    let attemptsErrored = false
    Promise.all([
      subjectsApi.getAll(),
      quizzesApi.getAll(),
      quizzesApi.getMyAttempts().catch(() => { attemptsErrored = true; return { data: { attempts: [] } } }),
    ]).then(([subData, quizData, attemptsData]) => {
      setSubjects(subData.data.subjects ?? subData.data)
      setRecentQuizzes((quizData.data.quizzes ?? quizData.data).slice(0, 4))
      // Average quiz score per subject = a rough "how well I'm doing here" signal.
      const bySubject = {}
      for (const a of attemptsData.data?.attempts ?? []) {
        const sid = String(a.quizId?.subjectId?._id ?? a.quizId?.subjectId ?? '')
        if (!sid) continue
        const b = bySubject[sid] ?? { total: 0, count: 0 }
        b.total += Number(a.score ?? 0)
        b.count += 1
        bySubject[sid] = b
      }
      const progress = {}
      for (const [sid, b] of Object.entries(bySubject)) {
        progress[sid] = Math.round(b.total / b.count)
      }
      setSubjectProgress(progress)
      setAttemptsFailed(attemptsErrored)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleStartQuiz = (quiz) => {
    navigate(`/student/quiz/${quiz._id ?? quiz.id}`)
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>
  )

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      {/* Welcome Banner */}
      <Card sx={{
        background: 'linear-gradient(135deg, #6C63FF 0%, #A78BFA 50%, #FF6B35 100%)',
        color: 'white', borderRadius: '20px', mb: 3, border: 'none',
        overflow: 'visible',
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ color: 'white', mb: 0.25 }}>
                Hi, {user?.name?.split(' ')[0]}! 👋
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mb: 2 }}>
                Ready to learn something amazing today?
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip icon={<EmojiEventsRoundedIcon />} label={`Level ${user?.level}`}
                  size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700 }} />
              </Box>
            </Box>
            <Typography sx={{ fontSize: '4rem', lineHeight: 1 }}>🎯</Typography>
          </Box>
          {/* Total XP earned (no cap — students keep accumulating) */}
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>Total XP earned</Typography>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>
              ⚡ {(user?.xp || 0).toLocaleString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatCard title="Quizzes Taken" value={user?.stats?.quizzesTaken || 0} icon="📝" color="#6C63FF" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="Avg. Score" value={`${user?.stats?.avgScore || 0}%`} icon="🎯" color="#10B981" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="Lessons Done" value={user?.stats?.lessonsCompleted || 0} icon="📚" color="#F59E0B" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="Badges" value={user?.badges?.length || 0} icon="🏅" color="#EC4899" />
        </Grid>
      </Grid>

      {attemptsFailed && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: '12px' }}>
          Couldn{'"'}t load your recent quiz attempts — subject progress percentages may be out of date.
        </Alert>
      )}

      {/* Subjects */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="h6" fontWeight={700}>📖 My Subjects</Typography>
        <Button size="small" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/student/subjects')}>View All</Button>
      </Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {subjects.map(subject => (
          <Grid item xs={12} sm={4} key={subject._id}>
            <SubjectCard
              subject={subject}
              progress={subjectProgress[String(subject._id)] ?? 0}
              onClick={() => navigate(`/student/subjects/${subject._id}`)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Recent Quizzes */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="h6" fontWeight={700}>🎯 Available Quizzes</Typography>
        <Button size="small" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/student/quizzes')}>View All</Button>
      </Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {recentQuizzes.map(quiz => (
          <Grid item xs={12} sm={6} key={quiz._id}>
            <QuizCard quiz={quiz} onClick={() => handleStartQuiz(quiz)} />
          </Grid>
        ))}
      </Grid>

      {/* Badges Showcase */}
      {user?.badges?.length > 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="h6" fontWeight={700}>🏅 My Badges</Typography>
            <Button size="small" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/student/achievements')}>All Badges</Button>
          </Box>
          <Card sx={{ borderRadius: '16px' }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {user.badges.map(badge => (
                  <BadgeCard key={badge} badgeId={badge} size="lg" showLabel />
                ))}
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  )
}
