import { useState } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box, AppBar, Toolbar, Typography, Avatar, IconButton, Badge, Drawer,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider,
  Menu, MenuItem, Tooltip, useMediaQuery, useTheme,
} from '@mui/material'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded'
import QuizRoundedIcon from '@mui/icons-material/QuizRounded'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import { logoutUser } from '../../store/slices/authSlice'
import { toggleMobileSidebar, closeMobileSidebar } from '../../store/slices/uiSlice'

const DRAWER_WIDTH = 260

const navItems = [
  { label: 'Dashboard', icon: <DashboardRoundedIcon />, path: '/teacher/dashboard' },
  { label: 'Content', icon: <LibraryBooksRoundedIcon />, path: '/teacher/content' },
  { label: 'Quizzes', icon: <QuizRoundedIcon />, path: '/teacher/quizzes' },
  { label: 'Classes',       icon: <GroupsRoundedIcon />,       path: '/teacher/classes' },
  { label: 'Reports',       icon: <BarChartRoundedIcon />,     path: '/teacher/reports' },
  { label: 'Badges',        icon: <EmojiEventsRoundedIcon />,  path: '/teacher/badges' },
  { label: 'Communication', icon: <CampaignRoundedIcon />,     path: '/teacher/communication' },
]

export default function TeacherLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const { sidebarMobileOpen } = useSelector(s => s.ui)
  const { unreadCount } = useSelector(s => s.notifications)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  const DrawerContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography variant="h6" fontWeight={800} sx={{ color: 'white', mb: 0.25 }}>🏆 OlympQuiz</Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Teacher Portal</Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      {/* User Info */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: user?.avatarColor, fontWeight: 700 }}>{user?.avatar}</Avatar>
        <Box>
          <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>{user?.name}</Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>{user?.subject}</Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 1 }} />
      {/* Nav */}
      <List sx={{ flex: 1, px: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path)
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); if (isMobile) dispatch(closeMobileSidebar()) }}
                sx={{
                  borderRadius: '10px',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                  bgcolor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.10)', color: 'white' },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.9rem' }} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <List sx={{ px: 1, py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: '10px', color: 'rgba(255,255,255,0.6)', '&:hover': { color: 'white' } }}>
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}><LogoutRoundedIcon /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? sidebarMobileOpen : true}
        onClose={() => dispatch(closeMobileSidebar())}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', bgcolor: '#0F172A' },
        }}
      >
        <DrawerContent />
      </Drawer>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary' }}>
          <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
            {isMobile && (
              <IconButton onClick={() => dispatch(toggleMobileSidebar())} sx={{ mr: 1 }}>
                <MenuRoundedIcon />
              </IconButton>
            )}
            <Box sx={{ flex: 1 }} />
            <IconButton sx={{ mr: 1 }}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsRoundedIcon />
              </Badge>
            </IconButton>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: user?.avatarColor, fontSize: '0.8rem', fontWeight: 700 }}>
                {user?.avatar}
              </Avatar>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
          <MenuItem disabled>
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.subject} Teacher</Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon><LogoutRoundedIcon fontSize="small" /></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
