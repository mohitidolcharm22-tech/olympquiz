import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Card, CardContent, Chip, CircularProgress, Alert, Button,
  Table, TableHead, TableBody, TableRow, TableCell, IconButton,
} from '@mui/material'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import { quizzesApi } from '../../services/apiCatalog'

const fmt = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) +
         ' · ' +
         d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export default function AttemptsHistoryPage() {
  const navigate = useNavigate()
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    quizzesApi.getMyAttempts()
      .then(d => {
        const list = (d.data?.attempts ?? []).slice().sort(
          (a, b) => new Date(b.completedAt || b.createdAt || 0) - new Date(a.completedAt || a.createdAt || 0)
        )
        setAttempts(list)
      })
      .catch(e => setError(e?.response?.data?.message || 'Failed to load attempt history'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>📜 Quiz Attempts</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Every quiz you've taken, with your score and date.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}
          action={<Button color="inherit" size="small" onClick={load}>Retry</Button>}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
      ) : attempts.length === 0 ? (
        <Card sx={{ borderRadius: '20px', textAlign: 'center', py: 6 }}>
          <CardContent>
            <Typography variant="h4" sx={{ mb: 1 }}>🎯</Typography>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>No attempts yet</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Take your first quiz to see it here.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/student/quizzes')}>Browse Quizzes</Button>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ borderRadius: '20px', overflow: 'hidden' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Quiz</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Score</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Result</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {attempts.map(a => {
                const quizId = a.quizId?._id ?? a.quizId
                const title  = a.quizId?.title || 'Quiz'
                const passed = !!a.passed
                return (
                  <TableRow key={a._id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{title}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={700}>{a.score ?? 0}%</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={passed ? 'Passed' : 'Failed'}
                        size="small"
                        color={passed ? 'success' : 'error'}
                        sx={{ fontWeight: 700, fontSize: '0.7rem', height: 22 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {fmt(a.completedAt || a.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => navigate(`/student/quiz/${quizId}/result`)}>
                        <ChevronRightRoundedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </Box>
  )
}
