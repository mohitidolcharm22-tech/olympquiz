import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Card, CardContent, Avatar, Chip, Stack, Grid,
  Button, IconButton, CircularProgress, Alert, Snackbar, Tooltip,
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import { progressApi, quizzesApi } from '../../services/apiCatalog'
import { formatDate } from '../../utils/date'

export default function StudentProgressPage() {
  const { studentId } = useParams()
  const navigate = useNavigate()

  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [snack, setSnack]     = useState('')

  const [confirmReissue, setConfirmReissue] = useState(null) // attempt obj
  const [reissuing, setReissuing] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await progressApi.getStudentProgress(studentId)
      setData(res.data)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load student progress.')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [studentId])

  const handleReissue = async () => {
    if (!confirmReissue) return
    setReissuing(true)
    try {
      await quizzesApi.reissue(confirmReissue.quizId?._id || confirmReissue.quizId, studentId)
      setSnack(`Reissued "${confirmReissue.quizId?.title || 'quiz'}". Student can take it again.`)
      setConfirmReissue(null)
      await load()
    } catch (e) {
      setSnack(e.response?.data?.message || 'Failed to reissue quiz.')
    } finally {
      setReissuing(false)
    }
  }

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}><CircularProgress /></Box>
  }
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate(-1)} startIcon={<ArrowBackRoundedIcon />}>Back</Button>
      </Box>
    )
  }
  if (!data?.user) return null

  const { user, attempts = [] } = data
  const passed = attempts.filter(a => a.passed).length
  const avgScore = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + (a.score || 0), 0) / attempts.length)
    : 0

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <IconButton onClick={() => navigate(-1)}><ArrowBackRoundedIcon /></IconButton>
        <Typography variant="h5" fontWeight={800}>Student Progress</Typography>
      </Stack>

      <Card sx={{ borderRadius: '20px', mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} spacing={2}>
            <Avatar sx={{ bgcolor: user.avatarColor || '#6C63FF', width: 64, height: 64, fontSize: 24, fontWeight: 800 }}>
              {(user.name || '?').charAt(0)}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h6" fontWeight={800}>{user.name}</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mt={0.5}>
                {user.grade && <Chip label={`Grade ${user.grade}`} size="small" />}
                {(user.classIds || []).map(c => (
                  <Chip key={c._id || c} label={c.name || 'Class'} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>
          </Stack>

          <Grid container spacing={2} mt={2}>
            {[
              { label: 'XP',           value: `⚡ ${user.xp ?? 0}`, color: '#8B5CF6' },
              { label: 'Level',        value: user.level ?? 1,      color: '#1E40AF' },
              { label: 'Streak',       value: `🔥 ${user.streak ?? 0}`, color: '#F59E0B' },
              { label: 'Quizzes',      value: attempts.length,      color: '#10B981' },
              { label: 'Passed',       value: passed,               color: '#10B981' },
              { label: 'Avg. Score',   value: `${avgScore}%`,       color: '#EC4899' },
            ].map(s => (
              <Grid item xs={6} sm={4} md={2} key={s.label}>
                <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: '12px', textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                  <Typography variant="h6" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: '20px' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>Quiz Attempts</Typography>
          {attempts.length === 0 ? (
            <Typography color="text.secondary" variant="body2">No quiz attempts yet.</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Quiz</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Score</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Result</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attempts.map(a => (
                    <TableRow key={a._id} hover>
                      <TableCell>{a.quizId?.title || '—'}</TableCell>
                      <TableCell>
                        <Chip label={`${a.score}%`} size="small"
                          color={a.score >= 80 ? 'success' : a.score >= 60 ? 'warning' : 'error'}
                          sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell>
                        <Chip label={a.passed ? 'Passed' : 'Failed'} size="small"
                          color={a.passed ? 'success' : 'error'} variant="outlined" />
                      </TableCell>
                      <TableCell>{formatDate(a.completedAt)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Reissue — wipes this attempt so the student can take it again">
                          <span>
                            <Button size="small" startIcon={<RestartAltRoundedIcon />} onClick={() => setConfirmReissue(a)}>
                              Reissue
                            </Button>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!confirmReissue} onClose={() => setConfirmReissue(null)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={800}>Reissue quiz?</DialogTitle>
        <DialogContent>
          <Typography>
            This will permanently delete <strong>{user.name}</strong>'s attempt for{' '}
            <strong>{confirmReissue?.quizId?.title || 'this quiz'}</strong> and the XP earned from it.
            The student will then be able to take the quiz again.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmReissue(null)}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={handleReissue} disabled={reissuing}>
            {reissuing ? <CircularProgress size={20} /> : 'Reissue'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!snack} autoHideDuration={4000} onClose={() => setSnack('')} message={snack} />
    </Box>
  )
}
