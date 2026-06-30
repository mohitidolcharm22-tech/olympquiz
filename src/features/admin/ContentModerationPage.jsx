import {
  Box, Typography, Card, CardContent, Grid, Avatar, Chip, Tab, Tabs,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Tooltip, Stack, Divider,
} from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import { adminApi } from '../../services/apiCatalog'
import { formatDate } from '../../utils/date'

const typeColors = {
  lesson:   '#6C63FF',
  video:    '#EF4444',
  activity: '#10B981',
  quiz:     '#EC4899',
}

const statusColor = (s) =>
  s === 'approved' ? 'success' : s === 'rejected' ? 'error' : 'warning'

export default function ContentModerationPage() {
  const [tab, setTab]         = useState(0) // 0 = pending, 1 = all
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  const [viewItem, setViewItem]       = useState(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [actionItem, setActionItem]   = useState(null)
  const [actionMode, setActionMode]   = useState('')
  const [note, setNote]               = useState('')
  const [saving, setSaving]           = useState(false)

  const loadList = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const status = tab === 0 ? 'pending' : 'all'
      const { data } = await adminApi.listModeration({ status })
      setItems(data?.items || [])
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load moderation queue.')
    } finally {
      setLoading(false)
    }
  }, [tab])

  useEffect(() => { loadList() }, [loadList])

  const counts = useMemo(() => {
    return items.reduce((acc, it) => {
      acc.total += 1
      acc[it.moderationStatus] = (acc[it.moderationStatus] || 0) + 1
      return acc
    }, { total: 0, pending: 0, approved: 0, rejected: 0 })
  }, [items])

  const openView = async (item) => {
    setViewItem({ kind: item.kind, _id: item._id, _loading: true })
    setViewLoading(true)
    try {
      const { data } = await adminApi.getModerationItem(item.kind, item._id)
      setViewItem(data?.item || null)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load item.')
      setViewItem(null)
    } finally {
      setViewLoading(false)
    }
  }

  const openAction = (item, mode) => {
    setActionItem(item)
    setActionMode(mode)
    setNote('')
  }

  const submitAction = async () => {
    if (!actionItem) return
    setSaving(true)
    try {
      await adminApi.moderate(actionItem.kind, actionItem._id, {
        status: actionMode === 'approve' ? 'approved' : 'rejected',
        note: note.trim() || undefined,
      })
      setActionItem(null)
      setNote('')
      await loadList()
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to save decision.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Typography variant="h5" fontWeight={800}>📋 Content Moderation</Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={loadList} disabled={loading}>
            <RefreshRoundedIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review and approve content submitted by teachers
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Pending Review', value: counts.pending,  color: '#F59E0B' },
          { label: 'Approved',       value: counts.approved, color: '#10B981' },
          { label: 'Rejected',       value: counts.rejected, color: '#EF4444' },
          { label: 'Total Shown',    value: counts.total,    color: '#1E293B' },
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
                <TableCell>Subject / Topic</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={28} />
                </TableCell></TableRow>
              )}
              {!loading && items.length === 0 && (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  {tab === 0 ? 'No items waiting for review. 🎉' : 'No content yet.'}
                </TableCell></TableRow>
              )}
              {!loading && items.map((item) => {
                const kindType = item.kind === 'quiz' ? 'quiz' : (item.type || 'lesson')
                return (
                  <TableRow key={`${item.kind}-${item._id}`} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{item.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.kind === 'quiz'
                          ? `${item.totalQuestions || 0} questions${item.difficulty ? ` · ${item.difficulty}` : ''}`
                          : `${item.duration || 0} min · ${item.xp || 0} XP`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={kindType}
                        size="small"
                        sx={{
                          bgcolor: `${typeColors[kindType] || '#6C63FF'}15`,
                          color:   typeColors[kindType] || '#6C63FF',
                          fontWeight: 600, fontSize: '0.7rem', textTransform: 'capitalize',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: '#6C63FF' }}>
                          {(item.createdBy?.name || '?').charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">{item.createdBy?.name || 'Unknown'}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                            {item.createdBy?.role || ''}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{item.subjectId?.name || '—'}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.topicId?.name || ''}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.moderationStatus}
                        size="small"
                        color={statusColor(item.moderationStatus)}
                        sx={{ fontWeight: 600, fontSize: '0.7rem', textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{formatDate(item.createdAt)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View">
                        <IconButton size="small" onClick={() => openView(item)}>
                          <VisibilityRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {item.moderationStatus !== 'approved' && (
                        <Tooltip title="Approve">
                          <IconButton size="small" color="success" onClick={() => openAction(item, 'approve')}>
                            <CheckCircleRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {item.moderationStatus !== 'rejected' && (
                        <Tooltip title="Reject">
                          <IconButton size="small" color="error" onClick={() => openAction(item, 'reject')}>
                            <CancelRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={!!viewItem} onClose={() => setViewItem(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {viewItem?.title || 'Loading…'}
          {viewItem?.kind && (
            <Chip
              size="small"
              label={viewItem.kind}
              sx={{ ml: 1, textTransform: 'capitalize',
                    bgcolor: `${typeColors[viewItem.kind === 'quiz' ? 'quiz' : (viewItem.type || 'lesson')] || '#6C63FF'}15`,
                    color:   typeColors[viewItem.kind === 'quiz' ? 'quiz' : (viewItem.type || 'lesson')] || '#6C63FF',
                    fontWeight: 600 }}
            />
          )}
        </DialogTitle>
        <DialogContent dividers>
          {viewLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
          ) : viewItem ? (
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip size="small" label={`Status: ${viewItem.moderationStatus}`} color={statusColor(viewItem.moderationStatus)} />
                <Chip size="small" label={`By: ${viewItem.createdBy?.name || 'Unknown'}`} />
                <Chip size="small" label={`Subject: ${viewItem.subjectId?.name || '—'}`} />
                {viewItem.topicId?.name && <Chip size="small" label={`Topic: ${viewItem.topicId.name}`} />}
                {viewItem.grade && <Chip size="small" label={`Grade: ${viewItem.grade}`} />}
                {viewItem.difficulty && <Chip size="small" label={`Difficulty: ${viewItem.difficulty}`} sx={{ textTransform: 'capitalize' }} />}
              </Box>
              <Divider />
              {viewItem.kind === 'quiz' ? (
                <>
                  <Typography variant="body2" color="text.secondary">
                    {(viewItem.questions || []).length} questions · {viewItem.timeLimit || '∞'} min · Pass {viewItem.passingScore || '—'}%
                  </Typography>
                  {(viewItem.questions || []).slice(0, 5).map((q, i) => (
                    <Box key={i} sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1 }}>
                      <Typography variant="body2" fontWeight={600}>Q{i + 1}. {q.question}</Typography>
                      {Array.isArray(q.options) && (
                        <Typography variant="caption" color="text.secondary">
                          Options: {q.options.join(' · ')}
                        </Typography>
                      )}
                    </Box>
                  ))}
                  {(viewItem.questions || []).length > 5 && (
                    <Typography variant="caption" color="text.secondary">
                      …and {viewItem.questions.length - 5} more
                    </Typography>
                  )}
                </>
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary">
                    {viewItem.type} · {viewItem.duration || 0} min · {viewItem.xp || 0} XP
                  </Typography>
                  <Box sx={{ whiteSpace: 'pre-wrap', p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1, maxHeight: 320, overflow: 'auto' }}>
                    <Typography variant="body2">{viewItem.content || '(no content)'}</Typography>
                  </Box>
                  {Array.isArray(viewItem.keyPoints) && viewItem.keyPoints.length > 0 && (
                    <Box>
                      <Typography variant="caption" fontWeight={700}>Key points</Typography>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {viewItem.keyPoints.map((kp, i) => (
                          <li key={i}><Typography variant="body2">{kp}</Typography></li>
                        ))}
                      </ul>
                    </Box>
                  )}
                </>
              )}
              {viewItem.moderationNote && (
                <Alert severity="info">Note: {viewItem.moderationNote}</Alert>
              )}
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewItem(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!actionItem} onClose={() => !saving && setActionItem(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {actionMode === 'approve' ? 'Approve content' : 'Reject content'}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>{actionItem?.title}</strong> by {actionItem?.createdBy?.name || 'Unknown'}
          </Typography>
          <TextField
            label={actionMode === 'approve' ? 'Note (optional)' : 'Reason for rejection'}
            multiline
            minRows={3}
            fullWidth
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={actionMode === 'reject' ? 'Let the author know what to fix…' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionItem(null)} disabled={saving}>Cancel</Button>
          <Button
            variant="contained"
            color={actionMode === 'approve' ? 'success' : 'error'}
            onClick={submitAction}
            disabled={saving || (actionMode === 'reject' && !note.trim())}
          >
            {saving ? 'Saving…' : actionMode === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
