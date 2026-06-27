import {
  Box, Typography, Card, CardContent, Grid, Button, Avatar, Chip, Tab, Tabs,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
} from '@mui/material'
import { useState } from 'react'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'

const pendingContent = [
  { id: 1, title: 'Division Basics - Video', type: 'video', submittedBy: 'Mrs. Priya Krishnan', subject: 'Math', grade: '4', submittedOn: '2024-06-22', status: 'pending' },
  { id: 2, title: 'English Grammar - Worksheet', type: 'pdf', submittedBy: 'Mr. Suresh Pillai', subject: 'English', grade: '3', submittedOn: '2024-06-21', status: 'pending' },
  { id: 3, title: 'World Geography Quiz', type: 'quiz', submittedBy: 'Ms. Kavitha Menon', subject: 'GK', grade: '5', submittedOn: '2024-06-20', status: 'pending' },
]

const allContent = [
  ...pendingContent,
  { id: 4, title: 'Counting Numbers Lesson', type: 'lesson', submittedBy: 'Mrs. Priya Krishnan', subject: 'Math', grade: '1', submittedOn: '2024-06-10', status: 'approved' },
  { id: 5, title: 'Animal Kingdom Quiz', type: 'quiz', submittedBy: 'Ms. Kavitha Menon', subject: 'GK', grade: '2', submittedOn: '2024-06-08', status: 'approved' },
]

const typeColors = { lesson: '#6C63FF', video: '#EF4444', pdf: '#F59E0B', document: '#10B981', quiz: '#EC4899' }

export default function ContentModerationPage() {
  const [tab, setTab] = useState(0)
  const [statuses, setStatuses] = useState({})

  const getStatus = (item) => statuses[item.id] || item.status

  const approve = (id) => setStatuses(s => ({ ...s, [id]: 'approved' }))
  const reject = (id) => setStatuses(s => ({ ...s, [id]: 'rejected' }))

  const displayContent = tab === 0
    ? allContent.filter(c => (statuses[c.id] || c.status) === 'pending')
    : allContent

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>📋 Content Moderation</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Review and approve content submitted by teachers</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Pending Review', value: allContent.filter(c => (statuses[c.id] || c.status) === 'pending').length, color: '#F59E0B' },
          { label: 'Approved', value: allContent.filter(c => (statuses[c.id] || c.status) === 'approved').length, color: '#10B981' },
          { label: 'Rejected', value: allContent.filter(c => (statuses[c.id] || c.status) === 'rejected').length, color: '#EF4444' },
          { label: 'Total Content', value: allContent.length, color: '#1E293B' },
        ].map(s => (
          <Grid item xs={6} sm={3} key={s.label}>
            <Card sx={{ borderRadius: '8px' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                <Typography variant="h5" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="⏳ Pending Review" />
        <Tab label="📄 All Content" />
      </Tabs>

      <Card sx={{ borderRadius: '8px', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: '#F8FAFC' } }}>
                <TableCell>Content</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Submitted By</TableCell>
                <TableCell>Subject / Grade</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayContent.map(item => {
                const status = getStatus(item)
                return (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{item.title}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={item.type} size="small"
                        sx={{ bgcolor: `${typeColors[item.type] || '#6C63FF'}15`, color: typeColors[item.type] || '#6C63FF', fontWeight: 600, fontSize: '0.7rem' }} />
                    </TableCell>
                    <TableCell><Typography variant="body2">{item.submittedBy}</Typography></TableCell>
                    <TableCell>
                      <Typography variant="body2">{item.subject} · Grade {item.grade}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={status} size="small"
                        color={status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning'}
                        sx={{ fontWeight: 600, fontSize: '0.7rem', textTransform: 'capitalize' }} />
                    </TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{item.submittedOn}</Typography></TableCell>
                    <TableCell align="right">
                      <IconButton size="small"><VisibilityRoundedIcon fontSize="small" /></IconButton>
                      {status === 'pending' && (
                        <>
                          <IconButton size="small" color="success" onClick={() => approve(item.id)}>
                            <CheckCircleRoundedIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => reject(item.id)}>
                            <CancelRoundedIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}
