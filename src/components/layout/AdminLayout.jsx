import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box, AppBar, Toolbar, Typography, Avatar, IconButton, Badge, Drawer,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider,
  Menu, MenuItem, useMediaQuery, useTheme, Chip,
} from '@mui/material'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded'
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded'
import FeedbackRoundedIcon from '@mui/icons-material/FeedbackRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import CorporateFareRoundedIcon from '@mui/icons-material/CorporateFareRounded'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { logoutUser } from '../../store/slices/authSlice'
import { toggleMobileSidebar, closeMobileSidebar } from '../../store/slices/uiSlice'
import { schoolsApi } from '../../services/apiCatalog'

const DRAWER_WIDTH = 260

const navItems = [
  { label: 'Dashboard', icon: <DashboardRoundedIcon />, path: '/admin/dashboard' },
  { label: 'User Management', icon: <PeopleRoundedIcon />, path: '/admin/users' },
  { label: 'Content', icon: <LibraryBooksRoundedIcon />, path: '/admin/content' },
  { label: 'Analytics', icon: <AnalyticsRoundedIcon />, path: '/admin/analytics' },
  { label: 'Feedback',   icon: <FeedbackRoundedIcon />, path: '/admin/feedback', badge: 5 },
  { label: 'Badges',     icon: <EmojiEventsRoundedIcon />, path: '/admin/badges' },
  { label: 'Schools',    icon: <CorporateFareRoundedIcon />, path: '/admin/schools' },
]

export default function AdminLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const { sidebarMobileOpen } = useSelector(s => s.ui)
  const { unreadCount } = useSelector(s => s.notifications)
  const [anchorEl, setAnchorEl] = useState(null)
  const [school, setSchool] = useState(null)

  useEffect(() => {
    if (user?.schoolId) {
      schoolsApi.getOne(user.schoolId)
        .then(res => setSchool(res?.data?.school || null))
        .catch(() => {}) // non-critical — sidebar still works without it
    }
  }, [user?.schoolId])

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  const DrawerContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography variant="h6" fontWeight={800} sx={{ color: 'white' }}>🏆 OlympQuiz</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
            {user?.role === 'super_admin' ? 'Super Admin Console' : 'Admin Console'}
          </Typography>
          {school && (
            <>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)' }}>·</Typography>
              {school.logoUrl ? (
                <Box
                  component="img"
                  src={school.logoUrl}
                  alt={school.name}
                  sx={{ width: 14, height: 14, borderRadius: '2px', objectFit: 'contain', flexShrink: 0 }}
                />
              ) : (
                <Box sx={{ width: 14, height: 14, borderRadius: '2px', bgcolor: '#3B82F6',
                           display: 'flex', alignItems: 'center', justifyContent: 'center',
                           fontSize: '0.55rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>
                  {school.name.charAt(0)}
                </Box>
              )}
              <Typography
                variant="caption"
                fontWeight={600}
                sx={{ color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap',
                      overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 110 }}
              >
                {school.name}
              </Typography>
            </>
          )}
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: '#3B82F6', fontWeight: 700 }}>{user?.avatar}</Avatar>
        <Box>
          <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700 }}>{user?.name}</Typography>
          <Chip
            label={user?.role === 'super_admin' ? 'SUPER ADMIN' : user?.role === 'school_admin' ? 'SCHOOL ADMIN' : 'ADMIN'}
            size="small"
            sx={{ bgcolor: '#3B82F620', color: '#93C5FD', height: 18, fontSize: '0.6rem', fontWeight: 700 }}
          />
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 1 }} />
      <List sx={{ flex: 1, px: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path)
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); if (isMobile) dispatch(closeMobileSidebar()) }}
                sx={{
                  borderRadius: '8px',
                  color: isActive ? 'white' : 'rgba(203,213,225,0.7)',
                  bgcolor: isActive ? '#3B82F620' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: 'white' },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: isActive ? 600 : 400, fontSize: '0.875rem' }} />
                {item.badge && (
                  <Chip label={item.badge} size="small" sx={{ bgcolor: '#EF4444', color: 'white', height: 18, fontSize: '0.65rem', fontWeight: 700 }} />
                )}
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <List sx={{ px: 1, py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: '8px', color: 'rgba(203,213,225,0.7)' }}>
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}><LogoutRoundedIcon /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.875rem' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? sidebarMobileOpen : true}
        onClose={() => dispatch(closeMobileSidebar())}
        sx={{
          width: DRAWER_WIDTH, flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, bgcolor: '#0F172A', borderRight: 'none' },
        }}
      >
        <DrawerContent />
      </Drawer>

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
              <Avatar sx={{ width: 34, height: 34, bgcolor: '#1E293B', fontSize: '0.8rem', fontWeight: 700 }}>
                {user?.avatar}
              </Avatar>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
          <MenuItem disabled>
            <Typography variant="subtitle2" fontWeight={700}>{user?.name}</Typography>
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
