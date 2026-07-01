import { useSelector, useDispatch } from 'react-redux'
import {
  Box, Typography, Card, List, ListItem, Avatar,
  Button, Chip, Divider,
} from '@mui/material'
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded'
import { markAsRead, markAllAsRead } from '../../store/slices/notificationSlice'

export default function NotificationsPage() {
  const dispatch = useDispatch()
  const { notifications, unreadCount } = useSelector(s => s.notifications)
  const { user } = useSelector(s => s.auth)

  const myNotifications = notifications.filter(n => n.userId === user?.id)

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 700, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>🔔 Notifications</Typography>
          {unreadCount > 0 && (
            <Typography variant="body2" color="text.secondary">{unreadCount} unread</Typography>
          )}
        </Box>
        {unreadCount > 0 && (
          <Button startIcon={<DoneAllRoundedIcon />} size="small"
            onClick={() => dispatch(markAllAsRead())}>
            Mark all read
          </Button>
        )}
      </Box>

      <Card sx={{ borderRadius: '20px' }}>
        <List disablePadding>
          {myNotifications.length === 0 ? (
            <ListItem>
              <Box sx={{ py: 4, textAlign: 'center', width: '100%' }}>
                <Typography variant="h3" sx={{ mb: 1 }}>🔔</Typography>
                <Typography variant="body1" color="text.secondary">No notifications yet!</Typography>
              </Box>
            </ListItem>
          ) : myNotifications.map((notif, idx) => (
            <Box key={notif.id}>
              <ListItem
                onClick={() => dispatch(markAsRead(notif.id))}
                sx={{
                  py: 2, px: 2.5, cursor: 'pointer',
                  bgcolor: notif.read ? 'transparent' : 'primary.main' + '08',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Avatar sx={{
                  bgcolor: notif.read ? '#F3F4F6' : '#6C63FF20',
                  color: notif.read ? 'text.secondary' : '#6C63FF',
                  fontSize: '1.2rem', mr: 1.5, flexShrink: 0, width: 44, height: 44,
                }}>
                  {notif.icon}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                    <Typography variant="subtitle2" fontWeight={notif.read ? 500 : 700}>
                      {notif.title}
                    </Typography>
                    {!notif.read && <Chip label="New" size="small" color="primary" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700 }} />}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
                    {notif.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(notif.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </ListItem>
              {idx < myNotifications.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Card>
    </Box>
  )
}
