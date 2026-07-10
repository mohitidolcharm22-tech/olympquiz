import { useState } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box, AppBar, Toolbar, Typography, Avatar, IconButton,
  BottomNavigation, BottomNavigationAction,
  ListItemIcon, useMediaQuery, useTheme, Divider, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
  FormControl, InputLabel, Select, Alert, Snackbar,
} from '@mui/material'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import LeaderboardRoundedIcon from '@mui/icons-material/LeaderboardRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import FeedbackRoundedIcon from '@mui/icons-material/FeedbackRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { logoutUser } from '../../store/slices/authSlice'
import { feedbackApi } from '../../services/apiCatalog'

const navItems = [
  { label: 'Home',     icon: <HomeRoundedIcon />,        path: '/student/dashboard' },
  { label: 'Subjects', icon: <MenuBookRoundedIcon />,     path: '/student/subjects' },
  { label: 'Quizzes',  icon: <QuizRoundedIcon />,         path: '/student/quizzes' },
  { label: 'Progress', icon: <TrendingUpRoundedIcon />,   path: '/student/progress' },
  { label: 'Rewards',  icon: <EmojiEventsRoundedIcon />,  path: '/student/achievements' },
]

export default function StudentLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const [anchorEl, setAnchorEl] = useState(null)

  // Feedback dialog state
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackTitle, setFeedbackTitle] = useState('')
  const [feedbackCategory, setFeedbackCategory] = useState('general')
  const [feedbackDescription, setFeedbackDescription] = useState('')
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)
  const [feedbackError, setFeedbackError] = useState('')
  const [feedbackSuccess, setFeedbackSuccess] = useState(false)

  const openFeedback = () => {
    setFeedbackTitle('')
    setFeedbackCategory('general')
    setFeedbackDescription('')
    setFeedbackError('')
    setFeedbackOpen(true)
    setAnchorEl(null)
  }

  const submitFeedback = async () => {
    if (!feedbackTitle.trim()) {
      setFeedbackError('Please enter a short title')
      return
    }
    setFeedbackSubmitting(true)
    setFeedbackError('')
    try {
      await feedbackApi.create({
        title: feedbackTitle.trim(),
        description: feedbackDescription.trim() || undefined,
        category: feedbackCategory,
      })
      setFeedbackOpen(false)
      setFeedbackSuccess(true)
    } catch (e) {
      setFeedbackError(e?.response?.data?.message || 'Failed to send feedback')
    } finally {
      setFeedbackSubmitting(false)
    }
  }

  const currentTab = navItems.findIndex(item => location.pathname.startsWith(item.path))

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top AppBar */}
      <AppBar position="sticky" elevation={0} sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}>
        <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
          <Typography variant="h6" fontWeight={800} sx={{
            background: 'linear-gradient(135deg, #6C63FF, #FF6B35)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mr: 1,
          }}>
            🏆 OlympQuiz
          </Typography>
          <Box sx={{ flex: 1 }} />
          {/* XP Display */}
          {user && (
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 0.5, mr: 1,
              bgcolor: '#6C63FF15', px: 1.5, py: 0.5, borderRadius: '100px',
            }}>
              <Typography variant="caption" sx={{ color: '#6C63FF', fontWeight: 700 }}>
                ⚡ {user.xp?.toLocaleString()} XP
              </Typography>
            </Box>
          )}
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: user?.avatarColor || '#6C63FF', fontSize: '0.8rem', fontWeight: 700 }}>
              {user?.avatar}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <MenuItem disabled>
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>{user?.name}</Typography>
            <Typography variant="caption" color="text.secondary">Grade {user?.grade} · Level {user?.level}</Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { navigate('/student/lessons'); setAnchorEl(null) }}>
          <ListItemIcon><AutoStoriesRoundedIcon fontSize="small" /></ListItemIcon>
          All Lessons
        </MenuItem>
        <MenuItem onClick={() => { navigate('/student/leaderboard'); setAnchorEl(null) }}>
          <ListItemIcon><LeaderboardRoundedIcon fontSize="small" /></ListItemIcon>
          Leaderboard
        </MenuItem>
        <MenuItem onClick={() => { navigate('/student/progress'); setAnchorEl(null) }}>
          <ListItemIcon><TrendingUpRoundedIcon fontSize="small" /></ListItemIcon>
          My Progress
        </MenuItem>
        <MenuItem onClick={() => { navigate('/student/attempts'); setAnchorEl(null) }}>
          <ListItemIcon><HistoryRoundedIcon fontSize="small" /></ListItemIcon>
          Attempt History
        </MenuItem>
        <MenuItem onClick={openFeedback}>
          <ListItemIcon><FeedbackRoundedIcon fontSize="small" /></ListItemIcon>
          Send Feedback
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><LogoutRoundedIcon fontSize="small" /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Feedback Dialog */}
      <Dialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Send Feedback</DialogTitle>
        <DialogContent>
          {feedbackError && <Alert severity="error" sx={{ mb: 2 }}>{feedbackError}</Alert>}
          <FormControl fullWidth size="small" sx={{ mb: 2, mt: 1 }}>
            <InputLabel id="feedback-category-label">Category</InputLabel>
            <Select
              labelId="feedback-category-label"
              label="Category"
              value={feedbackCategory}
              onChange={(e) => setFeedbackCategory(e.target.value)}
            >
              <MenuItem value="bug">🐛 Bug</MenuItem>
              <MenuItem value="suggestion">💡 Suggestion</MenuItem>
              <MenuItem value="content">📚 Content</MenuItem>
              <MenuItem value="praise">🎉 Praise</MenuItem>
              <MenuItem value="general">📝 General</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth size="small" label="Title" required
            value={feedbackTitle}
            onChange={(e) => setFeedbackTitle(e.target.value)}
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 120 }}
          />
          <TextField
            fullWidth size="small" label="Details (optional)" multiline minRows={3}
            value={feedbackDescription}
            onChange={(e) => setFeedbackDescription(e.target.value)}
            inputProps={{ maxLength: 1000 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackOpen(false)} disabled={feedbackSubmitting}>Cancel</Button>
          <Button variant="contained" onClick={submitFeedback} disabled={feedbackSubmitting}>
            {feedbackSubmitting ? 'Sending…' : 'Send'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={feedbackSuccess}
        autoHideDuration={3500}
        onClose={() => setFeedbackSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setFeedbackSuccess(false)}>
          Thanks! Your feedback has been sent.
        </Alert>
      </Snackbar>

      {/* Main Content */}
      <Box sx={{ flex: 1, pb: isMobile ? 8 : 0, overflow: 'auto' }}>
        <Outlet />
      </Box>

      {/* Bottom Navigation (Mobile) */}
      {isMobile && (
        <BottomNavigation
          showLabels
          value={currentTab >= 0 ? currentTab : 0}
          onChange={(e, newValue) => navigate(navItems[newValue].path)}
          sx={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
            borderTop: '1px solid', borderColor: 'divider',
          }}
        >
          {navItems.map((item) => (
            <BottomNavigationAction key={item.label} label={item.label} icon={item.icon} />
          ))}
        </BottomNavigation>
      )}

      {/* Side Navigation (Desktop) */}
      {!isMobile && (
        <Box sx={{
          position: 'fixed', left: 0, top: 64, bottom: 0,
          width: 80, bgcolor: 'background.paper',
          borderRight: '1px solid', borderColor: 'divider',
          display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2, gap: 1,
        }}>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <IconButton
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  flexDirection: 'column', gap: 0.25, p: 1.5,
                  borderRadius: '12px', width: 60,
                  bgcolor: isActive ? '#6C63FF15' : 'transparent',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  '&:hover': { bgcolor: '#6C63FF10' },
                }}
              >
                {item.icon}
                <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 600 }}>{item.label}</Typography>
              </IconButton>
            )
          })}
        </Box>
      )}
    </Box>
  )
}
