import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Card, CardContent, Typography, Button, IconButton, Chip, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, Stack, Alert, CircularProgress,
  Autocomplete, Tooltip,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import { classesApi, progressApi } from '../../services/apiCatalog'

const GRADES = ['Nursery', 'KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
const emptyForm = { name: '', grade: '1', section: '', description: '' }

export default function ClassesPage() {
  const navigate = useNavigate()
  const [classes,    setClasses]    = useState([])
  const [allStudents, setAllStudents] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [form,       setForm]       = useState(emptyForm)
  const [saving,     setSaving]     = useState(false)

  const [rosterClass, setRosterClass] = useState(null)
  const [pickStudents, setPickStudents] = useState([])

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [cls, st] = await Promise.all([
        classesApi.getAll(),
        // `available=true` lets teachers see every student (not just ones
        // already in their classes), so they can pick new ones into a roster.
        progressApi.getStudents({ available: true }).catch(() => ({ data: { students: [] } })),
      ])
      setClasses(cls.data?.classes || [])
      setAllStudents(st.data?.students || [])
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load classes.')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  const handleCreate = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      await classesApi.create(form)
      setCreateOpen(false)
      setForm(emptyForm)
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create class.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this class? Students will be unassigned but kept.')) return
    try {
      await classesApi.remove(id)
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to delete class.')
    }
  }

  const handleAddStudents = async () => {
    if (!rosterClass || !pickStudents.length) return
    try {
      await classesApi.addStudents(rosterClass._id, pickStudents.map(s => s._id))
      const fresh = await classesApi.getOne(rosterClass._id)
      setRosterClass(fresh.data?.class || null)
      setPickStudents([])
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to add students.')
    }
  }

  const handleRemoveStudent = async (studentId) => {
    if (!rosterClass) return
    try {
      await classesApi.removeStudent(rosterClass._id, studentId)
      const fresh = await classesApi.getOne(rosterClass._id)
      setRosterClass(fresh.data?.class || null)
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to remove student.')
    }
  }

  const rosterIds = useMemo(
    () => new Set((rosterClass?.studentIds || []).map(s => String(s._id || s))),
    [rosterClass],
  )
  const availableStudents = useMemo(
    () => allStudents.filter(s => !rosterIds.has(String(s._id))),
    [allStudents, rosterIds],
  )

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} mb={3} spacing={2}>
        <Box>
          <Typography variant="h4" fontWeight={800}>Classes</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage class rosters. Quizzes can be assigned to one or more classes.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setCreateOpen(true)}>
          New Class
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      <Card sx={{ borderRadius: '20px' }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}><CircularProgress /></Box>
          ) : classes.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <Typography color="text.secondary">No classes yet. Create one to start assigning quizzes.</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Grade</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Section</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Students</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classes.map(c => (
                    <TableRow key={c._id} hover>
                      <TableCell>
                        <Typography fontWeight={700}>{c.name}</Typography>
                        {c.description && (
                          <Typography variant="caption" color="text.secondary">{c.description}</Typography>
                        )}
                      </TableCell>
                      <TableCell><Chip label={`Grade ${c.grade}`} size="small" /></TableCell>
                      <TableCell>{c.section || '—'}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${c.studentIds?.length || 0} student${(c.studentIds?.length || 0) === 1 ? '' : 's'}`}
                          size="small"
                          color={(c.studentIds?.length || 0) > 0 ? 'primary' : 'default'}
                          variant={(c.studentIds?.length || 0) > 0 ? 'filled' : 'outlined'}
                          onClick={async () => {
                            const fresh = await classesApi.getOne(c._id)
                            setRosterClass(fresh.data?.class || c)
                          }}
                          sx={{ cursor: 'pointer' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<GroupAddRoundedIcon />}
                            onClick={async () => {
                              const fresh = await classesApi.getOne(c._id)
                              setRosterClass(fresh.data?.class || c)
                            }}
                          >
                            Manage students
                          </Button>
                          <Tooltip title="Delete class">
                            <IconButton color="error" onClick={() => handleDelete(c._id)}>
                              <DeleteRoundedIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Create dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={800}>New Class</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          <TextField label="Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Grade *</InputLabel>
            <Select label="Grade *" value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}>
              {GRADES.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Section" value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))} fullWidth />
          <TextField label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} fullWidth multiline rows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={saving || !form.name.trim()}>
            {saving ? <CircularProgress size={20} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Roster dialog */}
      <Dialog open={!!rosterClass} onClose={() => setRosterClass(null)} maxWidth="md" fullWidth>
        <DialogTitle fontWeight={800}>
          {rosterClass?.name} — Roster
          <Typography variant="caption" component="div" color="text.secondary">
            Grade {rosterClass?.grade}{rosterClass?.section ? ` · ${rosterClass.section}` : ''}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'flex-end' }}>
            <Autocomplete
              multiple
              fullWidth
              options={availableStudents}
              getOptionLabel={s => `${s.name} (Grade ${s.grade}${s.username ? ' · @' + s.username : ''})`}
              value={pickStudents}
              onChange={(_, v) => setPickStudents(v)}
              renderInput={(params) => <TextField {...params} label="Add students" placeholder="Search students" />}
            />
            <Button variant="contained" onClick={handleAddStudents} disabled={!pickStudents.length}>Add</Button>
          </Stack>

          <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Enrolled ({rosterClass?.studentIds?.length || 0})
            </Typography>
            {(rosterClass?.studentIds || []).length === 0 ? (
              <Typography color="text.secondary" variant="body2">No students yet.</Typography>
            ) : (
              <Stack spacing={1}>
                {rosterClass.studentIds.map(s => (
                  <Stack key={s._id || s} direction="row" alignItems="center" spacing={1.5}
                    sx={{ p: 1, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Avatar sx={{ bgcolor: s.avatarColor || '#6C63FF', width: 32, height: 32 }}>
                      {(s.name || '?').charAt(0)}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="body2" fontWeight={600}>{s.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {s.email || s.username || ''} · Grade {s.grade}
                      </Typography>
                    </Box>
                    <Tooltip title="View progress">
                      <IconButton size="small" onClick={() => navigate(`/teacher/students/${s._id || s}`)}>
                        <VisibilityRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove from class">
                      <IconButton size="small" color="error" onClick={() => handleRemoveStudent(s._id || s)}>
                        <DeleteRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                ))}
              </Stack>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRosterClass(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
