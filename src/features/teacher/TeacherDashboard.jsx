import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Box, Grid, Typography, Card, CardContent, Button, Avatar, Chip, LinearProgress, List, ListItem, ListItemAvatar, ListItemText, Divider } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../../components/common/StatCard'
import { students, getUserById } from '../../data/users'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'

const classPerformance = [
  { class: '3A', avg: 78 }, { class: '4A', avg: 84 }, { class: '4B', avg: 71 },
]

const recentActivity = [
  { student: 'Arjun Sharma', action: 'Completed Quiz', score: 80, time: '2 hours ago' },
  { student: 'Diya Joshi', action: 'Finished Lesson', score: null, time: '3 hours ago' },
  { student: 'Priya Patel', action: 'Completed Quiz', score: 95, time: '5 hours ago' },
  { student: 'Vihaan Kumar', action: 'Completed Quiz', score: 88, time: 'Yesterday' },
]

export default function TeacherDashboard() {
  const { user } = useSelector(s => s.auth)
  const navigate = useNavigate()
  const myStudents = students.filter(s => s.teacherId === user?.id)

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      {/* Welcome */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>
          Good morning, {user?.name?.split(' ').pop()}! 👋
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Here's your teaching summary for today
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatCard title="Total Students" value={user?.stats?.studentsCount || 42} icon="👥" color="#1E40AF" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="Content Created" value={user?.stats?.contentCreated || 87} icon="📄" color="#059669" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="Quizzes Created" value={user?.stats?.quizzesCreated || 24} icon="📝" color="#7C3AED" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard title="Avg. Class Score" value={`${user?.stats?.avgClassScore || 81}%`} icon="📊" color="#F59E0B" trend={3} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Class Performance Chart */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: '16px' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>📊 Class Performance</Typography>
                <Button size="small" endIcon={<ArrowForwardRoundedIcon />} onClick={() => navigate('/teacher/reports')}>Details</Button>
              </Box>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={classPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="class" axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(val) => [`${val}%`, 'Avg. Score']} />
                  <Bar dataKey="avg" fill="#1E40AF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: '16px', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>⚡ Recent Activity</Typography>
              <List disablePadding>
                {recentActivity.map((activity, idx) => (
                  <Box key={idx}>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#1E40AF20', color: '#1E40AF', fontWeight: 700, width: 36, height: 36 }}>
                          {activity.student.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography variant="body2" fontWeight={600}>{activity.student}</Typography>}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">{activity.action}</Typography>
                            {activity.score && (
                              <Chip label={`${activity.score}%`} size="small"
                                color={activity.score >= 80 ? 'success' : 'warning'}
                                sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700 }} />
                            )}
                          </Box>
                        }
                      />
                      <Typography variant="caption" color="text.secondary">{activity.time}</Typography>
                    </ListItem>
                    {idx < recentActivity.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: '16px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>⚡ Quick Actions</Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {[
                  { label: 'Create Quiz', icon: '📝', path: '/teacher/quizzes/create', color: '#6C63FF' },
                  { label: 'Upload Content', icon: '📤', path: '/teacher/content/create', color: '#10B981' },
                  { label: 'View Reports', icon: '📊', path: '/teacher/reports', color: '#F59E0B' },
                  { label: 'Send Announcement', icon: '📢', path: '/teacher/communication', color: '#EC4899' },
                ].map(action => (
                  <Button key={action.label} variant="outlined"
                    startIcon={<Typography>{action.icon}</Typography>}
                    onClick={() => navigate(action.path)}
                    sx={{ borderRadius: '10px', borderColor: `${action.color}40`, color: action.color,
                      '&:hover': { bgcolor: `${action.color}10`, borderColor: action.color } }}>
                    {action.label}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
