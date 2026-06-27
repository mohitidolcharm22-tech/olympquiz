import { useSelector } from 'react-redux'
import { Box, Typography, Grid, Card, CardContent, LinearProgress, Chip } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'
import ProgressBar from '../../components/common/ProgressBar'
import StatCard from '../../components/common/StatCard'

const weeklyData = [
  { day: 'Mon', xp: 120 }, { day: 'Tue', xp: 200 }, { day: 'Wed', xp: 80 },
  { day: 'Thu', xp: 250 }, { day: 'Fri', xp: 180 }, { day: 'Sat', xp: 300 }, { day: 'Sun', xp: 150 },
]

const subjectData = [
  { subject: 'Math', score: 82 }, { subject: 'English', score: 75 }, { subject: 'GK', score: 88 },
]

const skillData = [
  { skill: 'Numbers', value: 85 }, { skill: 'Addition', value: 90 },
  { skill: 'Shapes', value: 72 }, { skill: 'Grammar', value: 68 },
  { skill: 'Vocabulary', value: 80 }, { skill: 'GK Facts', value: 92 },
]

export default function ProgressPage() {
  const { user } = useSelector(s => s.auth)

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>📈 My Progress</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Track your learning journey</Typography>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatCard title="Total XP" value={user?.xp?.toLocaleString() || '0'} icon="⚡" color="#8B5CF6" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="Current Level" value={`Lv. ${user?.level || 1}`} icon="⬆️" color="#6C63FF" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="Day Streak" value={`${user?.streak || 0} 🔥`} icon="🔥" color="#F97316" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="Avg. Score" value={`${user?.stats?.avgScore || 0}%`} icon="🎯" color="#10B981" />
        </Grid>
      </Grid>

      {/* Weekly Activity Chart */}
      <Card sx={{ borderRadius: '20px', mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>📅 Weekly XP Activity</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip formatter={(val) => [`${val} XP`, 'Earned']} />
              <Bar dataKey="xp" fill="#6C63FF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card sx={{ borderRadius: '20px', mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>📊 Subject Performance</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { name: 'Mathematics', icon: '🔢', score: 82, color: '#6C63FF' },
              { name: 'English', icon: '📚', score: 75, color: '#10B981' },
              { name: 'General Knowledge', icon: '🌍', score: 88, color: '#F59E0B' },
            ].map(s => (
              <Box key={s.name}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                  <Typography variant="body1">{s.icon}</Typography>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ flex: 1 }}>{s.name}</Typography>
                  <Chip label={s.score >= 80 ? 'Strong' : s.score >= 60 ? 'Average' : 'Needs Work'}
                    size="small" color={s.score >= 80 ? 'success' : s.score >= 60 ? 'warning' : 'error'}
                    sx={{ fontWeight: 600, fontSize: '0.7rem', height: 22 }} />
                </Box>
                <ProgressBar value={s.score} color={s.score >= 80 ? 'success' : s.score >= 60 ? 'warning' : 'error'} showLabel={false} />
                <Typography variant="caption" color="text.secondary" sx={{ float: 'right' }}>{s.score}%</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Strengths & Weaknesses */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ borderRadius: '20px', height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>💪 Strengths</Typography>
              {[
                { topic: 'GK Facts', score: 92 },
                { topic: 'Addition', score: 90 },
                { topic: 'Number Counting', score: 85 },
              ].map(s => (
                <Box key={s.topic} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" fontWeight={500}>✅ {s.topic}</Typography>
                  <Chip label={`${s.score}%`} size="small" color="success"
                    sx={{ fontWeight: 700, fontSize: '0.7rem', height: 22 }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ borderRadius: '20px', height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>📚 Needs Practice</Typography>
              {[
                { topic: 'Grammar Rules', score: 58 },
                { topic: 'Fractions', score: 62 },
                { topic: 'Comprehension', score: 65 },
              ].map(s => (
                <Box key={s.topic} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" fontWeight={500}>⚠️ {s.topic}</Typography>
                  <Chip label={`${s.score}%`} size="small" color="warning"
                    sx={{ fontWeight: 700, fontSize: '0.7rem', height: 22 }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
