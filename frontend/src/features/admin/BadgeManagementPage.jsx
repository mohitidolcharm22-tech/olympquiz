import { useState, useEffect } from 'react'
import {
  Box, Typography, Card, Grid, Chip, TextField, InputAdornment,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
  CircularProgress, Alert, IconButton, Snackbar, Tooltip, Switch,
  FormControlLabel,
} from '@mui/material'
import AddRoundedIcon       from '@mui/icons-material/AddRounded'
import EditRoundedIcon      from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon    from '@mui/icons-material/DeleteRounded'
import SearchRoundedIcon    from '@mui/icons-material/SearchRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import { badgeCatalogApi }  from '../../services/apiCatalog'

const EMOJI_PRESETS = ['🏅','🏆','⭐','🌟','🔥','⚡','🎯','🎖️','🥇','🥈','🥉','💎','👑','🦁','🚀','💡','📚','🧠','🎓','🌈','💪','🏋️','🔬','🎨','🎵']
const COLOR_PRESETS = ['#6C63FF','#10B981','#F59E0B','#EF4444','#8B5CF6','#0EA5E9','#EC4899','#F97316','#FFD700','#14B8A6']

const emptyForm = { name: '', icon: '🏅', description: '', color: '#6C63FF', category: 'general', isActive: true }

export default function BadgeManagementPage() {
  const [badges,  setBadges]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [search,  setSearch]  = useState('')
  const [open,    setOpen]    = useState(false)
  const [editing, setEditing] = useState(null)
  const [form,    setForm]    = useState(emptyForm)
  const [saving,  setSaving]  = useState(false)
  const [snack,   setSnack]   = useState({ open: false, msg: '', severity: 'success' })
  const [confirmDelete, setConfirmDelete] = useState(null)  // badge to delete

  const load = () => {
    setLoading(true)
    badgeCatalogApi.getAllAdmin()
      .then(d => setBadges(d.data.badges ?? []))
      .catch(() => setError('Failed to load badges.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = badges.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.category?.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (b) => {
    setEditing(b)
    setForm({ name: b.name, icon: b.icon, description: b.description, color: b.color, category: b.category, isActive: b.isActive })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await badgeCatalogApi.update(editing._id, form)
        setSnack({ open: true, msg: 'Badge updated!', severity: 'success' })
      } else {
        await badgeCatalogApi.create(form)
        setSnack({ open: true, msg: 'Badge created!', severity: 'success' })
      }
      setOpen(false)
      load()
    } catch (err) {
      setSnack({ open: true, msg: err?.response?.data?.message || 'Save failed.', severity: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (b) => {
    setConfirmDelete(b)
  }

  const doDelete = async () => {
    const b = confirmDelete
    setConfirmDelete(null)
    try {
      await badgeCatalogApi.remove(b._id)
      setSnack({ open: true, msg: 'Badge deleted.', severity: 'info' })
      load()
    } catch {
      setSnack({ open: true, msg: 'Delete failed.', severity: 'error' })
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1000, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>🎖️ Badge Management</Typography>
          <Typography variant="body2" color="text.secondary">Create and manage badge definitions available to teachers</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate}
          sx={{ borderRadius: '12px', fontWeight: 700 }}>
          New Badge
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField fullWidth size="small" placeholder="Search by name or category…"
        value={search} onChange={e => setSearch(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }}
        sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>
      ) : (
        <Card sx={{ borderRadius: '16px', overflow: 'hidden' }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' } }}>
                  <TableCell>Badge</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created by</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      No badges yet. Click "New Badge" to create one.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map(b => (
                  <TableRow key={b._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                          width: 42, height: 42, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          bgcolor: b.color + '20', fontSize: '1.5rem',
                        }}>{b.icon}</Box>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{b.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{b.description}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={b.category || 'general'} size="small"
                        sx={{ bgcolor: b.color + '20', color: b.color, fontWeight: 600, textTransform: 'capitalize' }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={b.isActive ? 'Active' : 'Inactive'} size="small"
                        color={b.isActive ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {b.createdBy?.name || 'System'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEdit(b)}>
                            <EditRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDelete(b)}>
                            <DeleteRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editing ? '✏️ Edit Badge' : '➕ New Badge'}
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {/* Icon picker */}
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>ICON</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
            {EMOJI_PRESETS.map(e => (
              <Box key={e} onClick={() => setForm(f => ({ ...f, icon: e }))}
                sx={{
                  width: 36, height: 36, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem', cursor: 'pointer', border: '2px solid',
                  borderColor: form.icon === e ? form.color : 'transparent',
                  bgcolor: form.icon === e ? form.color + '15' : '#F8FAFC',
                  '&:hover': { bgcolor: '#F1F5F9' },
                }}>{e}</Box>
            ))}
          </Box>

          <TextField fullWidth size="small" label="Badge Name *" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />

          <TextField fullWidth size="small" label="Description" value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />

          <TextField fullWidth size="small" label="Category" placeholder="e.g. streak, quiz, subject" value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />

          {/* Color picker */}
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>COLOR</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {COLOR_PRESETS.map(c => (
              <Box key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                sx={{
                  width: 28, height: 28, borderRadius: '50%', bgcolor: c, cursor: 'pointer',
                  border: form.color === c ? '3px solid #1E293B' : '3px solid transparent',
                  outline: form.color === c ? `2px solid ${c}` : 'none',
                  outlineOffset: '2px',
                }} />
            ))}
            <TextField size="small" value={form.color}
              onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
              sx={{ width: 110, '& .MuiOutlinedInput-root': { borderRadius: '8px', height: 28 }, '& input': { p: '4px 8px', fontSize: '0.8rem' } }} />
          </Box>

          {/* Preview */}
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: '12px',
            border: `2px solid ${form.color}30`, bgcolor: form.color + '08', mb: 2,
          }}>
            <Typography sx={{ fontSize: '2rem', lineHeight: 1 }}>{form.icon}</Typography>
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>{form.name || 'Badge Name'}</Typography>
              <Typography variant="caption" color="text.secondary">{form.description || 'Description'}</Typography>
            </Box>
          </Box>

          {editing && (
            <FormControlLabel
              control={<Switch checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />}
              label="Active (visible to teachers)" />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setOpen(false)} variant="outlined" sx={{ borderRadius: '10px' }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!form.name.trim() || saving}
            startIcon={<EmojiEventsRoundedIcon />} sx={{ borderRadius: '10px', px: 3 }}>
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Badge'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}
        PaperProps={{ sx: { borderRadius: '16px', maxWidth: 380 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>🗑️ Delete Badge?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete <strong>"{confirmDelete?.name}"</strong>?
            This cannot be undone. Students who have already earned it will keep their record,
            but teachers will no longer see it as an option.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setConfirmDelete(null)} variant="outlined" sx={{ borderRadius: '10px' }}>Cancel</Button>
          <Button onClick={doDelete} variant="contained" color="error" sx={{ borderRadius: '10px' }}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} onClose={() => setSnack(s => ({ ...s, open: false }))} sx={{ borderRadius: '12px' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}
