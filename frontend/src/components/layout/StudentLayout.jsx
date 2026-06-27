import { useState } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box, AppBar, Toolbar, Typography, Avatar, IconButton, Badge,
  BottomNavigation, BottomNavigationAction, Drawer, List, ListItem,
  ListItemIcon, ListItemText, useMediaQuery, useTheme, Divider, Menu, MenuItem,
} from '@mui/material'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import LeaderboardRoundedIcon from '@mui/icons-material/LeaderboardRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { logoutUser } from '../../store/slices/authSlice'

const navItems = [
  { label: 'Home', icon: <HomeRoundedIcon />, path: '/student/dashboard' },
  { label: 'Learn', icon: <MenuBookRoundedIcon />, path: '/student/subjects' },
  { label: 'Quiz', icon: <QuizRoundedIcon />, path: '/student/quizzes' },
  { label: 'Progress', icon: <TrendingUpRoundedIcon />, path: '/student/progress' },
  { label: 'Rewards', icon: <EmojiEventsRoundedIcon />, path: '/student/achievements' },
]

export default function StudentLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const { unreadCount } = useSelector(s => s.notifications)
  const [anchorEl, setAnchorEl] = useState(null)

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
          <IconButton onClick={() => navigate('/student/notifications')} sx={{ mr: 0.5 }}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsRoundedIcon />
            </Badge>
          </IconButton>
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
        <MenuItem onClick={() => { navigate('/student/progress'); setAnchorEl(null) }}>
          <ListItemIcon><TrendingUpRoundedIcon fontSize="small" /></ListItemIcon>
          My Progress
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><LogoutRoundedIcon fontSize="small" /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Main Content */}
      <Box sx={{ flex: 1, pb: isMobile ? 8 : 0, overflow: 'auto' }}>
        <Outlet />
      </Box>

      {/* Bottom Navigation (Mobile) */}
      {isMobile && (
        <BottomNavigation
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
