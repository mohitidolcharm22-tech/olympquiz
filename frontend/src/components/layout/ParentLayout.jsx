import { useState } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box, AppBar, Toolbar, Typography, Avatar, IconButton, Badge, Drawer,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider,
  Menu, MenuItem, useMediaQuery, useTheme,
} from '@mui/material'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import ChildCareRoundedIcon from '@mui/icons-material/ChildCareRounded'
import MessageRoundedIcon from '@mui/icons-material/MessageRounded'
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { logoutUser } from '../../store/slices/authSlice'
import { toggleMobileSidebar, closeMobileSidebar } from '../../store/slices/uiSlice'

const DRAWER_WIDTH = 260

const navItems = [
  { label: 'Dashboard', icon: <DashboardRoundedIcon />, path: '/parent/dashboard' },
  { label: "Child's Progress", icon: <ChildCareRoundedIcon />, path: '/parent/child-progress' },
  { label: 'Reports', icon: <AssessmentRoundedIcon />, path: '/parent/reports' },
  { label: 'Messages', icon: <MessageRoundedIcon />, path: '/parent/communication' },
]

export default function ParentLayout() {
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
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography variant="h6" fontWeight={800} sx={{ color: 'white' }}>🏆 OlympQuiz</Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Parent Portal</Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: '#0F766E', fontWeight: 700 }}>{user?.avatar}</Avatar>
        <Box>
          <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700 }}>{user?.name}</Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Parent</Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 1 }} />
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
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: '10px', color: 'rgba(255,255,255,0.6)' }}>
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}><LogoutRoundedIcon /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.9rem' }} />
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
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, bgcolor: '#134E4A' },
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
              <Avatar sx={{ width: 34, height: 34, bgcolor: '#0F766E', fontSize: '0.8rem', fontWeight: 700 }}>
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
              <Typography variant="caption" color="text.secondary">Parent Account</Typography>
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
