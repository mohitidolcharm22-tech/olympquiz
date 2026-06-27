import { useState } from 'react'
import {
  Box, Typography, Card, CardContent, Button, TextField, Avatar,
  List, ListItem, ListItemAvatar, ListItemText, Divider, Chip, Tab, Tabs, Alert,
} from '@mui/material'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'

const announcements = [
  { id: 1, title: 'Unit Test Next Week', message: 'Dear students, a unit test on Multiplication will be held next Monday. Please revise tables 1-10.', date: '2024-06-20', class: '3A', sentTo: 42 },
  { id: 2, title: 'New Video Content Added', message: 'I have added new explainer videos for Addition and Subtraction. Please watch them before the quiz!', date: '2024-06-18', class: 'All', sentTo: 120 },
  { id: 3, title: 'Holiday Homework', message: 'Please complete the practice worksheet on Shapes posted in the content section. Due by June 28.', date: '2024-06-15', class: '4B', sentTo: 35 },
]

const parentMessages = [
  { id: 1, parent: 'Mr. Rajesh Sharma', message: 'My son Arjun has been very engaged with the multiplication topic. Thank you!', date: '2024-06-21', replied: true },
  { id: 2, parent: 'Mrs. Sneha Patel', message: 'Could you please share more practice questions for Grade 4 division?', date: '2024-06-19', replied: false },
  { id: 3, parent: 'Mr. Rajesh Sharma', message: 'Arjun scored well in the last quiz. What topics should we focus on next?', date: '2024-06-17', replied: true },
]

export default function CommunicationPage() {
  const [tab, setTab] = useState(0)
  const [announcement, setAnnouncement] = useState({ title: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSend = () => { setSent(true); setTimeout(() => setSent(false), 3000) }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>📢 Communication</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Send announcements and respond to parent messages</Typography>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="📣 Announcements" />
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LockRoundedIcon sx={{ fontSize: '0.9rem' }} />
              Parent Messages
            </Box>
          }
          disabled
          sx={{ opacity: 0.45 }}
        />
      </Tabs>
      {tab === 1 && (
        <Alert severity="info" sx={{ mb: 2, borderRadius: '12px' }}>
          Parent messaging is coming soon. This feature will be available in the next release.
        </Alert>
      )}

      {tab === 0 && (
        <Box>
          {/* Create Announcement */}
          <Card sx={{ borderRadius: '16px', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>New Announcement</Typography>
              <TextField fullWidth label="Title" value={announcement.title}
                onChange={e => setAnnouncement(a => ({ ...a, title: e.target.value }))} sx={{ mb: 2 }} />
              <TextField fullWidth multiline rows={3} label="Message" value={announcement.message}
                onChange={e => setAnnouncement(a => ({ ...a, message: e.target.value }))} sx={{ mb: 2 }} />
              {sent && <Chip label="✅ Announcement sent to all students!" color="success" sx={{ mb: 2, fontWeight: 600 }} />}
              <Button variant="contained" startIcon={<SendRoundedIcon />}
                disabled={!announcement.title || !announcement.message}
                onClick={handleSend} sx={{ borderRadius: '10px' }}>
                Send to All Students
              </Button>
            </CardContent>
          </Card>

          {/* Past Announcements */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Past Announcements</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {announcements.map(ann => (
              <Card key={ann.id} sx={{ borderRadius: '12px' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                    <Typography variant="subtitle1" fontWeight={700}>{ann.title}</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip label={`Class ${ann.class}`} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                      <Chip label={`${ann.sentTo} students`} size="small" color="primary" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{ann.message}</Typography>
                  <Typography variant="caption" color="text.secondary">{ann.date}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {tab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {parentMessages.map(msg => (
              <Card key={msg.id} sx={{ borderRadius: '12px' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1 }}>
                    <Avatar sx={{ bgcolor: '#0F766E20', color: '#0F766E', fontWeight: 700, width: 40, height: 40 }}>
                      {msg.parent.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" fontWeight={700}>{msg.parent}</Typography>
                        <Chip label={msg.replied ? '✅ Replied' : '⏳ Pending'} size="small"
                          color={msg.replied ? 'success' : 'warning'}
                          sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">{msg.date}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1.5 }}>{msg.message}</Typography>
                  {!msg.replied && (
                    <Button size="small" variant="outlined" startIcon={<SendRoundedIcon />} sx={{ borderRadius: '8px' }}>
                      Reply
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}
