import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box, Grid, Card, CardContent, Typography, Button, Avatar, LinearProgress,
  Chip, List, ListItem, ListItemAvatar, ListItemText, IconButton, Divider, CircularProgress,
} from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import StatCard from '../../components/common/StatCard'
import SubjectCard from '../../components/common/SubjectCard'
import QuizCard from '../../components/common/QuizCard'
import BadgeCard from '../../components/common/BadgeCard'
import { startQuiz } from '../../store/slices/quizSlice'
import { subjectsApi, quizzesApi } from '../../services/apiCatalog'
import { useState, useEffect } from 'react'

export default function StudentDashboard() {
  const { user } = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [subjects, setSubjects]       = useState([])
  const [recentQuizzes, setRecentQuizzes] = useState([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    Promise.all([
      subjectsApi.getAll(),
      quizzesApi.getAll(),
    ]).then(([subData, quizData]) => {
      setSubjects(subData.data.subjects ?? subData.data)
      setRecentQuizzes((quizData.data.quizzes ?? quizData.data).slice(0, 4))
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const nextLevelXP    = (user?.level || 1) * 500
  const currentLevelXP = ((user?.level || 1) - 1) * 500
  const xpInLevel      = (user?.xp || 0) - currentLevelXP
  const xpNeeded       = nextLevelXP - currentLevelXP
  const xpProgress     = Math.min(100, Math.max(0, xpNeeded > 0 ? (xpInLevel / xpNeeded) * 100 : 0))

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
          {/* XP Progress */}
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Level {user?.level} Progress
              </Typography>
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>
                {Math.max(0, xpInLevel)} / {xpNeeded} XP
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={xpProgress}
              sx={{
                height: 8, borderRadius: '100px',
                bgcolor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': { bgcolor: '#FFD700', borderRadius: '100px' },
              }} />
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
              progress={0}
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
