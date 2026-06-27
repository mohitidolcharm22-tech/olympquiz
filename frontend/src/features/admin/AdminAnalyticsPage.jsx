import {
  Box, Typography, Grid, Card, CardContent, Chip,
} from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'
import StatCard from '../../components/common/StatCard'
import { getFeedbackStats } from '../../data/feedback'

const usersByRole = [
  { role: 'Students', count: 10, color: '#3B82F6' },
  { role: 'Teachers', count: 3, color: '#10B981' },
  { role: 'Parents', count: 2, color: '#0F766E' },
]

const monthlyActive = [
  { month: 'Jan', students: 8, teachers: 3, parents: 2 },
  { month: 'Feb', students: 9, teachers: 3, parents: 2 },
  { month: 'Mar', students: 10, teachers: 3, parents: 2 },
  { month: 'Apr', students: 10, teachers: 3, parents: 2 },
  { month: 'May', students: 10, teachers: 3, parents: 2 },
  { month: 'Jun', students: 10, teachers: 3, parents: 2 },
]

const subjectEngagement = [
  { subject: 'Mathematics', lessons: 234, quizzes: 89 },
  { subject: 'English', lessons: 198, quizzes: 76 },
  { subject: 'GK', lessons: 167, quizzes: 61 },
]

const feedbackByCategory = [
  { category: 'Content Quality', count: 8, color: '#6C63FF' },
  { category: 'Quiz Quality', count: 5, color: '#10B981' },
  { category: 'App Experience', count: 6, color: '#F59E0B' },
  { category: 'Suggestions', count: 4, color: '#EC4899' },
  { category: 'Bug Reports', count: 3, color: '#EF4444' },
]

export default function AdminAnalyticsPage() {
  const fbStats = getFeedbackStats()

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>📊 Platform Analytics</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Comprehensive platform usage and engagement metrics</Typography>

      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}><StatCard title="Total Sessions" value="1,240" icon="📱" color="#1E293B" trend={15} /></Grid>
        <Grid item xs={6} sm={3}><StatCard title="Avg. Session Time" value="18 min" icon="⏱" color="#3B82F6" /></Grid>
        <Grid item xs={6} sm={3}><StatCard title="Quiz Completion Rate" value="87%" icon="✅" color="#10B981" trend={5} /></Grid>
        <Grid item xs={6} sm={3}><StatCard title="Satisfaction Score" value={`${fbStats.avgRating}/5`} icon="⭐" color="#F59E0B" /></Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Monthly Active Users */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: '8px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>👥 Monthly Active Users</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthlyActive}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={2} name="Students" />
                  <Line type="monotone" dataKey="teachers" stroke="#10B981" strokeWidth={2} name="Teachers" />
                  <Line type="monotone" dataKey="parents" stroke="#0F766E" strokeWidth={2} name="Parents" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* User Distribution */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '8px', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>🥧 User Distribution</Typography>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={usersByRole} cx="50%" cy="50%" outerRadius={70} dataKey="count">
                    {usersByRole.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(val, name) => [val, '']} />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {usersByRole.map(u => (
                  <Box key={u.role} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: u.color }} />
                      <Typography variant="caption">{u.role}</Typography>
                    </Box>
                    <Typography variant="caption" fontWeight={700}>{u.count}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Subject Engagement */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '8px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>📚 Subject Engagement</Typography>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={subjectEngagement}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="subject" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="lessons" fill="#1E293B" radius={[4, 4, 0, 0]} name="Lessons" />
                  <Bar dataKey="quizzes" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Quizzes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Feedback Categories */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '8px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>💬 Feedback by Category</Typography>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={feedbackByCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis type="number" axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="category" axisLine={false} tickLine={false} width={110} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {feedbackByCategory.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
