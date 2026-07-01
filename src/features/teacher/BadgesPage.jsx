import { useState, useEffect } from 'react'
import {
  Box, Typography, Card, Grid, Avatar, Chip, TextField,
  InputAdornment, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
  CircularProgress, Alert, Snackbar,
} from '@mui/material'
import SearchRoundedIcon        from '@mui/icons-material/SearchRounded'
import EmojiEventsRoundedIcon   from '@mui/icons-material/EmojiEventsRounded'
import DeleteRoundedIcon        from '@mui/icons-material/DeleteRounded'
import { progressApi, badgeCatalogApi } from '../../services/apiCatalog'

export default function BadgesPage() {
  const [students,   setStudents]   = useState([])
  const [badges,     setBadges]     = useState([])   // badge catalog from API
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [search,     setSearch]     = useState('')
  const [selected,   setSelected]   = useState(null)   // student being awarded
  const [awardOpen,  setAwardOpen]  = useState(false)
  const [chosenBadge, setChosenBadge] = useState(null)
  const [note,        setNote]       = useState('')
  const [saving,      setSaving]     = useState(false)
  const [snack,       setSnack]      = useState({ open: false, msg: '', severity: 'success' })

  const load = () => {
    setLoading(true)
    Promise.all([
      progressApi.getStudents(),
      badgeCatalogApi.getAll(),
    ])
      .then(([studentsData, badgesData]) => {
        setStudents(studentsData.data.students ?? [])
        setBadges(badgesData.data.badges ?? [])
      })
      .catch(() => setError('Failed to load data.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.username?.toLowerCase().includes(search.toLowerCase()) ||
    s.grade?.toLowerCase().includes(search.toLowerCase())
  )

  const openAward = (student) => {
    setSelected(student)
    setChosenBadge(null)
    setNote('')
    setAwardOpen(true)
  }

  const handleAward = async () => {
    if (!chosenBadge || !selected) return
    setSaving(true)
    try {
      await progressApi.awardBadge(selected._id, chosenBadge._id || chosenBadge.id, note)
      setSnack({ open: true, msg: `🏅 "${chosenBadge.name}" awarded to ${selected.name}!`, severity: 'success' })
      setAwardOpen(false)
      load()
    } catch (err) {
      setSnack({ open: true, msg: err?.response?.data?.message || 'Failed to award badge.', severity: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleRevoke = async (studentId, studentName, badgeId) => {
    try {
      await progressApi.revokeBadge(studentId, badgeId)
      setSnack({ open: true, msg: `Badge revoked from ${studentName}.`, severity: 'info' })
      load()
    } catch {
      setSnack({ open: true, msg: 'Failed to revoke badge.', severity: 'error' })
    }
  }

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1000, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>🏅 Award Badges</Typography>
          <Typography variant="body2" color="text.secondary">Recognise and reward your students{'"'} achievements</Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Search */}
      <TextField fullWidth size="small" placeholder="Search students by name, username or grade…"
        value={search} onChange={e => setSearch(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }}
        sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />

      {/* Student table */}
      <Card sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' } }}>
                <TableCell>Student</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>XP / Level</TableCell>
                <TableCell>Badges Awarded</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No students found</TableCell>
                </TableRow>
              )}
              {filtered.map(s => {
                const teacherBadges = s.teacherBadges || []
                return (
                  <TableRow key={s._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: s.avatarColor || '#6C63FF', width: 34, height: 34, fontSize: '0.8rem', fontWeight: 700 }}>
                          {s.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{s.name}</Typography>
                          {s.username && <Typography variant="caption" color="text.secondary">@{s.username}</Typography>}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>Grade {s.grade}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>⚡ {s.xp} XP</Typography>
                      <Typography variant="caption" color="text.secondary">Level {s.level}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 260 }}>
                        {teacherBadges.length === 0 && (
                          <Typography variant="caption" color="text.disabled">None yet</Typography>
                        )}
                        {teacherBadges.map((tb, i) => {
                          const def = badges.find(b => b._id === tb.badgeId || b.id === tb.badgeId)
                          return (
                            <Chip key={i} label={`${def?.icon || '🏅'} ${def?.name || tb.badgeId}`}
                              size="small"
                              onDelete={() => handleRevoke(s._id, s.name, tb.badgeId)}
                              deleteIcon={<DeleteRoundedIcon />}
                              sx={{ fontSize: '0.65rem', height: 22, fontWeight: 600 }} />
                          )
                        })}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="contained" startIcon={<EmojiEventsRoundedIcon />}
                        onClick={() => openAward(s)}
                        sx={{ borderRadius: '8px', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                        Award Badge
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Award Badge Dialog */}
      <Dialog open={awardOpen} onClose={() => setAwardOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>
          🏅 Award Badge to {selected?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select a badge to award. It will appear on the student{'\"'}s dashboard and be visible to parents.
          </Typography>
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            {badges.map(badge => {
              const alreadyHas = (selected?.teacherBadges || []).some(tb => tb.badgeId === badge._id || tb.badgeId === badge.id)
              const isChosen   = chosenBadge?.id === badge.id
              return (
                <Grid item xs={6} sm={4} key={badge._id || badge.id}>
                  <Card
                    onClick={() => !alreadyHas && setChosenBadge(badge)}
                    sx={{
                      p: 1.5, textAlign: 'center', cursor: alreadyHas ? 'not-allowed' : 'pointer',
                      border: '2px solid',
                      borderColor: isChosen ? badge.color : alreadyHas ? '#E2E8F0' : '#E2E8F0',
                      bgcolor: isChosen ? badge.color + '15' : alreadyHas ? '#F8FAFC' : 'background.paper',
                      opacity: alreadyHas ? 0.5 : 1,
                      transition: 'all 0.15s ease',
                      '&:hover': alreadyHas ? {} : { borderColor: badge.color, transform: 'translateY(-2px)' },
                    }}>
                    <Typography sx={{ fontSize: '1.8rem', lineHeight: 1, mb: 0.5 }}>{badge.icon}</Typography>
                    <Typography variant="caption" fontWeight={700} sx={{ display: 'block' }}>{badge.name}</Typography>
                    {alreadyHas && (
                      <Chip label="Awarded" size="small" color="success"
                        sx={{ mt: 0.5, fontSize: '0.55rem', height: 16 }} />
                    )}
                  </Card>
                </Grid>
              )
            })}
          </Grid>
          {chosenBadge && (
            <TextField fullWidth size="small" label="Personal note (optional)"
              placeholder={`e.g. "Excellent performance in ${chosenBadge.name}!"`}
              value={note} onChange={e => setNote(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setAwardOpen(false)} variant="outlined" sx={{ borderRadius: '10px' }}>Cancel</Button>
          <Button onClick={handleAward} variant="contained" disabled={!chosenBadge || saving}
            startIcon={<EmojiEventsRoundedIcon />}
            sx={{ borderRadius: '10px', px: 3 }}>
            {saving ? 'Awarding…' : 'Award Badge'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}
