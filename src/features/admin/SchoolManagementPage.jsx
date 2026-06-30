import {
  Box, Typography, Card, CardContent, Button, Grid, Chip, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, CircularProgress, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Stack, Tooltip, Switch,
  List, ListItem, ListItemAvatar, ListItemText, Divider,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import { schoolsApi } from '../../services/apiCatalog'
import { formatDate } from '../../utils/date'

const emptyForm = {
  name: '', code: '', address: '', city: '', state: '',
  country: 'India', phone: '', email: '', timezone: 'Asia/Kolkata',
}

export default function SchoolManagementPage() {
  const [schools, setSchools]     = useState([])
  const [total, setTotal]         = useState(0)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [search, setSearch]       = useState('')
  const [form, setForm]           = useState(emptyForm)
  const [editId, setEditId]       = useState(null)   // null = create mode
  const [dialogOpen, setDialog]   = useState(false)
  const [saving, setSaving]       = useState(false)
  const [formError, setFormError] = useState('')

  // Admins dialog state
  const [adminsSchool, setAdminsSchool]     = useState(null)
  const [admins, setAdmins]                 = useState([])
  const [adminsLoading, setAdminsLoading]   = useState(false)
  const [adminsDialog, setAdminsDialog]     = useState(false)
  const [newAdminForm, setNewAdminForm]     = useState({ name: '', email: '', password: '', phone: '' })
  const [newAdminError, setNewAdminError]   = useState('')
  const [newAdminSaving, setNewAdminSaving] = useState(false)
  const [showAdminForm, setShowAdminForm]   = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data, pagination } = await schoolsApi.getAll({ search: search || undefined })
      setSchools(data?.schools || [])
      setTotal(pagination?.total || 0)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load schools.')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setForm(emptyForm)
    setEditId(null)
    setFormError('')
    setDialog(true)
  }

  const openEdit = (school) => {
    setForm({
      name:     school.name     || '',
      code:     school.code     || '',
      address:  school.address  || '',
      city:     school.city     || '',
      state:    school.state    || '',
      country:  school.country  || 'India',
      phone:    school.phone    || '',
      email:    school.email    || '',
      timezone: school.timezone || 'Asia/Kolkata',
    })
    setEditId(school._id)
    setFormError('')
    setDialog(true)
  }

  const submit = async () => {
    if (!form.name.trim() || !form.code.trim()) {
      setFormError('Name and Code are required.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      if (editId) {
        await schoolsApi.update(editId, form)
      } else {
        await schoolsApi.create(form)
      }
      setDialog(false)
      await load()
    } catch (e) {
      setFormError(e?.response?.data?.message || 'Failed to save school.')
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (school) => {
    try {
      await schoolsApi.toggleStatus(school._id)
      setSchools(s => s.map(sc =>
        sc._id === school._id ? { ...sc, isActive: !sc.isActive } : sc,
      ))
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to update status.')
    }
  }

  const handleField = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const openAdmins = async (school) => {
    setAdminsSchool(school)
    setAdmins([])
    setNewAdminForm({ name: '', email: '', password: '', phone: '' })
    setNewAdminError('')
    setShowAdminForm(false)
    setAdminsDialog(true)
    setAdminsLoading(true)
    try {
      const { data } = await schoolsApi.listAdmins(school._id)
      setAdmins(data?.admins || [])
    } catch (e) {
      setNewAdminError(e?.response?.data?.message || 'Failed to load admins.')
    } finally {
      setAdminsLoading(false)
    }
  }

  const submitNewAdmin = async () => {
    const { name, email, password } = newAdminForm
    if (!name.trim() || !email.trim() || !password) {
      setNewAdminError('Name, email and password are required.')
      return
    }
    if (password.length < 8) {
      setNewAdminError('Password must be at least 8 characters.')
      return
    }
    setNewAdminSaving(true)
    setNewAdminError('')
    try {
      const { data } = await schoolsApi.createAdmin(adminsSchool._id, newAdminForm)
      setAdmins(prev => [...prev, data.user])
      setNewAdminForm({ name: '', email: '', password: '', phone: '' })
      setShowAdminForm(false)
      // Refresh school list so admin count updates
      await load()
    } catch (e) {
      setNewAdminError(e?.response?.data?.message || 'Failed to create admin.')
    } finally {
      setNewAdminSaving(false)
    }
  }

  const totalStudents = schools.reduce((s, sc) => s + (sc.userCounts?.student || 0), 0)
  const totalTeachers = schools.reduce((s, sc) => s + (sc.userCounts?.teacher || 0), 0)

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1300, mx: 'auto' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>🏫 School Management</Typography>
          <Typography variant="body2" color="text.secondary">Manage all tenant schools on the platform</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh"><IconButton onClick={load} disabled={loading}><RefreshRoundedIcon /></IconButton></Tooltip>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate}>Add School</Button>
        </Stack>
      </Stack>

      {error && <Alert severity="error" sx={{ mt: 2, mb: 1 }} onClose={() => setError('')}>{error}</Alert>}

      <Grid container spacing={2} sx={{ my: 2 }}>
        {[
          { label: 'Total Schools',   value: total,         color: '#1E293B' },
          { label: 'Total Students',  value: totalStudents, color: '#3B82F6' },
          { label: 'Total Teachers',  value: totalTeachers, color: '#10B981' },
          { label: 'Active Schools',  value: schools.filter(s => s.isActive).length, color: '#6C63FF' },
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

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search schools…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 280 }}
        />
      </Stack>

      <Card sx={{ borderRadius: '8px', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: '#F8FAFC' } }}>
                <TableCell>School</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Users</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={28} />
                </TableCell></TableRow>
              )}
              {!loading && schools.length === 0 && (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No schools yet. Click "Add School" to get started.
                </TableCell></TableRow>
              )}
              {!loading && schools.map((sc) => (
                <TableRow key={sc._id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ bgcolor: '#6C63FF', width: 36, height: 36, fontSize: '1rem' }}>
                        {sc.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={700}>{sc.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{sc.email || '—'}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip label={sc.code} size="small" sx={{ fontFamily: 'monospace', fontWeight: 700 }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{[sc.city, sc.state, sc.country].filter(Boolean).join(', ') || '—'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      👩‍🎓 {sc.userCounts?.student || 0} &nbsp; 👩‍🏫 {sc.userCounts?.teacher || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{formatDate(sc.createdAt)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Switch
                      size="small"
                      checked={!!sc.isActive}
                      onChange={() => toggleStatus(sc)}
                      color="success"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Manage Admins">
                      <IconButton size="small" color="primary" onClick={() => openAdmins(sc)}>
                        <ManageAccountsRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => openEdit(sc)}>
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* ── Create / Edit dialog ─────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onClose={() => !saving && setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editId ? 'Edit School' : 'Add New School'}
        </DialogTitle>
        <DialogContent dividers>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField label="School Name *" fullWidth value={form.name} onChange={handleField('name')} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Code *"
                fullWidth
                value={form.code}
                onChange={handleField('code')}
                disabled={!!editId}
                helperText={editId ? 'Cannot change code' : 'e.g. DPS-ROHINI'}
                inputProps={{ style: { textTransform: 'uppercase' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Address" fullWidth value={form.address} onChange={handleField('address')} />
            </Grid>
            <Grid item xs={6}><TextField label="City"    fullWidth value={form.city}    onChange={handleField('city')} /></Grid>
            <Grid item xs={6}><TextField label="State"   fullWidth value={form.state}   onChange={handleField('state')} /></Grid>
            <Grid item xs={6}><TextField label="Country" fullWidth value={form.country} onChange={handleField('country')} /></Grid>
            <Grid item xs={6}><TextField label="Phone"   fullWidth value={form.phone}   onChange={handleField('phone')} /></Grid>
            <Grid item xs={12}><TextField label="Email"  fullWidth value={form.email}   onChange={handleField('email')} type="email" /></Grid>
            <Grid item xs={12}><TextField label="Timezone" fullWidth value={form.timezone} onChange={handleField('timezone')} helperText="e.g. Asia/Kolkata, Asia/Dubai" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(false)} disabled={saving}>Cancel</Button>
          <Button variant="contained" onClick={submit} disabled={saving}>
            {saving ? 'Saving…' : editId ? 'Save Changes' : 'Create School'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={adminsDialog} onClose={() => setAdminsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          🛡️ Admins — {adminsSchool?.name}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {newAdminError && <Alert severity="error" sx={{ m: 2 }}>{newAdminError}</Alert>}

          {/* Existing admins list */}
          {adminsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={24} /></Box>
          ) : admins.length === 0 && !showAdminForm ? (
            <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
              <Typography variant="body2">No admins yet for this school.</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {admins.map((admin, i) => (
                <Box key={admin._id}>
                  {i > 0 && <Divider />}
                  <ListItem sx={{ px: 3, py: 1.5 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#6C63FF', width: 36, height: 36, fontSize: '0.9rem' }}>
                        {admin.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" fontWeight={700}>{admin.name}</Typography>
                          <Chip
                            label={admin.role}
                            size="small"
                            sx={{ fontSize: '0.65rem', textTransform: 'capitalize',
                                  bgcolor: '#6C63FF15', color: '#6C63FF', fontWeight: 700 }}
                          />
                          {!admin.isActive && <Chip label="Inactive" size="small" color="error" />}
                        </Stack>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {admin.email} · Added {formatDate(admin.createdAt)}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          )}

          {/* New admin form */}
          {showAdminForm && (
            <Box sx={{ px: 3, pb: 3, pt: admins.length > 0 ? 0 : 2 }}>
              {admins.length > 0 && <Divider sx={{ mb: 2 }} />}
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                Create New Admin Account
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name *" size="small" fullWidth
                    value={newAdminForm.name}
                    onChange={(e) => setNewAdminForm(f => ({ ...f, name: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone" size="small" fullWidth
                    value={newAdminForm.phone}
                    onChange={(e) => setNewAdminForm(f => ({ ...f, phone: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email *" size="small" fullWidth type="email"
                    value={newAdminForm.email}
                    onChange={(e) => setNewAdminForm(f => ({ ...f, email: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Password *" size="small" fullWidth type="password"
                    value={newAdminForm.password}
                    onChange={(e) => setNewAdminForm(f => ({ ...f, password: e.target.value }))}
                    helperText="Minimum 8 characters. Share with the admin securely."
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
          <Button
            startIcon={<PersonAddRoundedIcon />}
            onClick={() => { setShowAdminForm(v => !v); setNewAdminError('') }}
            disabled={newAdminSaving}
          >
            {showAdminForm ? 'Cancel' : 'Add Admin'}
          </Button>
          <Stack direction="row" spacing={1}>
            <Button onClick={() => setAdminsDialog(false)}>Close</Button>
            {showAdminForm && (
              <Button variant="contained" onClick={submitNewAdmin} disabled={newAdminSaving}>
                {newAdminSaving ? 'Creating…' : 'Create Admin'}
              </Button>
            )}
          </Stack>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
