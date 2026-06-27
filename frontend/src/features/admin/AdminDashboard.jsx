import { useNavigate } from 'react-router-dom'
import { Box, Grid, Typography, Card, CardContent, Button, Avatar, Chip, Divider, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import StatCard from '../../components/common/StatCard'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { users, students, teachers, parents, getFeedbackStats } from '../../data/index'

const platformGrowth = [
  { month: 'Jan', users: 45 }, { month: 'Feb', users: 78 }, { month: 'Mar', users: 92 },
  { month: 'Apr', users: 120 }, { month: 'May', users: 145 }, { month: 'Jun', users: 170 },
]

const engagementData = [
  { day: 'Mon', sessions: 120 }, { day: 'Tue', sessions: 145 }, { day: 'Wed', sessions: 98 },
  { day: 'Thu', sessions: 162 }, { day: 'Fri', sessions: 137 }, { day: 'Sat', sessions: 189 }, { day: 'Sun', sessions: 78 },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const fbStats = getFeedbackStats()

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>Admin Console 🛡️</Typography>
        <Typography variant="body2" color="text.secondary">Platform overview and management</Typography>
      </Box>

      {/* Platform Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}><StatCard title="Total Users" value={users.length} icon="👥" color="#1E293B" trend={12} /></Grid>
        <Grid item xs={6} sm={3}><StatCard title="Students" value={students.length} icon="🎒" color="#3B82F6" /></Grid>
        <Grid item xs={6} sm={3}><StatCard title="Teachers" value={teachers.length} icon="📚" color="#10B981" /></Grid>
        <Grid item xs={6} sm={3}><StatCard title="Avg. Satisfaction" value={`${fbStats.avgRating}/5`} icon="⭐" color="#F59E0B" /></Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Platform Growth */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: '10px' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>📈 Platform Growth</Typography>
                <Button size="small" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/admin/analytics')}>Analytics</Button>
              </Box>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={platformGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: '10px', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>📊 Content Stats</Typography>
              {[
                { label: 'Total Content Items', value: 87, icon: '📄', color: '#3B82F6' },
                { label: 'Published Quizzes', value: 10, icon: '📝', color: '#10B981' },
                { label: 'Pending Approvals', value: 3, icon: '⏳', color: '#F59E0B' },
                { label: 'Feedback Pending', value: fbStats.pending, icon: '💬', color: '#EF4444' },
              ].map(s => (
                <Box key={s.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{s.icon}</Typography>
                    <Typography variant="body2">{s.label}</Typography>
                  </Box>
                  <Chip label={s.value} size="small" sx={{ bgcolor: `${s.color}15`, color: s.color, fontWeight: 700, fontSize: '0.8rem' }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Sessions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '10px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>⚡ Daily Sessions This Week</Typography>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="#1E293B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Actions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '10px', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>🔔 Recent Activity</Typography>
              {[
                { action: 'New teacher registration request', time: '1 hour ago', type: 'user' },
                { action: 'Bug report submitted by student', time: '3 hours ago', type: 'alert' },
                { action: 'Quiz content approved', time: '5 hours ago', type: 'success' },
                { action: 'New parent account created', time: 'Yesterday', type: 'user' },
              ].map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75 }}>
                  <Typography variant="body2">{item.action}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, ml: 1 }}>{item.time}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
