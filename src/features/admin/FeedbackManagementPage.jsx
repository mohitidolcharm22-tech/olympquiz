import { useState, useEffect } from 'react'
import {
  Box, Typography, Card, CardContent, Grid, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Alert,
} from '@mui/material'
import { feedbackApi } from '../../services/apiCatalog'
import StatCard from '../../components/common/StatCard'

const statusColors = { open: 'warning', 'in-review': 'info', resolved: 'success', closed: 'default' }

export default function FeedbackManagementPage() {
  const [feedbackList, setFeedbackList] = useState([])
  const [stats, setStats]               = useState({ total: 0, open: 0, resolved: 0, avgRating: 0 })
  const [filter, setFilter]             = useState('all')
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')

  useEffect(() => {
    feedbackApi.getAll()
      .then(data => {
        setFeedbackList(data.data.feedback ?? [])
        setStats(data.data.stats ?? { total: 0, open: 0, resolved: 0, avgRating: 0 })
      })
      .catch(() => setError('Failed to load feedback.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>

  const filtered = feedbackList.filter(fb => {
    if (filter === 'all') return true
    if (filter === 'open') return fb.status === 'open'
    if (filter === 'resolved') return fb.status === 'resolved'
    if (filter === 'parent') return fb.role === 'parent'
    return true
  })

  // Category breakdown from real data
  const categoryMap = {}
  feedbackList.forEach(fb => {
    const cat = fb.category || 'general'
    categoryMap[cat] = (categoryMap[cat] || 0) + 1
  })
  const catColors = ['#6C63FF', '#10B981', '#F59E0B', '#EC4899', '#EF4444']
  const categoryData = Object.entries(categoryMap).map(([name, value], i) => ({
    name, value, color: catColors[i % catColors.length],
  }))

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>💬 Feedback Management</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Monitor and manage user feedback from parents and users</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}><StatCard title="Total Feedback" value={stats.total} icon="💬" color="#1E293B" /></Grid>
        <Grid item xs={6} sm={3}><StatCard title="Avg. Rating" value={stats.total ? `${Number(stats.avgRating).toFixed(1)} ⭐` : 'N/A'} icon="⭐" color="#F59E0B" /></Grid>
        <Grid item xs={6} sm={3}><StatCard title="Open" value={stats.open} icon="⏳" color="#EF4444" /></Grid>
        <Grid item xs={6} sm={3}><StatCard title="Resolved" value={stats.resolved} icon="✅" color="#10B981" /></Grid>
      </Grid>

      {/* Category breakdown */}
      {categoryData.length > 0 && (
        <Card sx={{ borderRadius: '8px', mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>📊 By Category</Typography>
            {categoryData.map(c => (
              <Box key={c.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c.color, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{c.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: `${Math.max(c.value * 10, 8)}px`, height: 6, borderRadius: '100px', bgcolor: c.color }} />
                  <Typography variant="caption" fontWeight={700}>{c.value}</Typography>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Filter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="subtitle2" fontWeight={600}>Filter:</Typography>
        {['all', 'open', 'resolved', 'parent'].map(f => (
          <Chip key={f} label={f.charAt(0).toUpperCase() + f.slice(1)} onClick={() => setFilter(f)}
            color={filter === f ? 'primary' : 'default'}
            variant={filter === f ? 'filled' : 'outlined'}
            sx={{ fontWeight: 600, cursor: 'pointer' }} />
        ))}
      </Box>

      {/* Feedback Table */}
      {filtered.length === 0 ? (
        <Card sx={{ borderRadius: '8px', textAlign: 'center', py: 5 }}>
          <Typography variant="h4" sx={{ mb: 1 }}>💬</Typography>
          <Typography fontWeight={700}>No feedback yet.</Typography>
          <Typography variant="body2" color="text.secondary">Feedback submitted by parents will appear here.</Typography>
        </Card>
      ) : (
        <Card sx={{ borderRadius: '8px', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: '#F8FAFC' } }}>
                  <TableCell>User</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Comment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map(fb => (
                  <TableRow key={fb._id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{fb.userId?.name ?? 'User'}</Typography>
                        <Chip label={fb.role ?? fb.userId?.role ?? ''} size="small" sx={{ fontSize: '0.65rem', fontWeight: 600, height: 18, mt: 0.25, textTransform: 'capitalize' }} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{fb.category}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>{'⭐'.repeat(fb.rating ?? 0)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {fb.comment || fb.description || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={fb.status} size="small" color={statusColors[fb.status] || 'default'}
                        sx={{ fontWeight: 600, fontSize: '0.7rem', textTransform: 'capitalize' }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  )
}
