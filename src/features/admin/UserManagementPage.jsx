import { useState, useEffect, useCallback } from 'react'
import {
  Box, Typography, Card, CardContent, Button, Avatar, Chip, Tab, Tabs,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,  CircularProgress, Alert, Tooltip, Snackbar,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded'
import api from '../../services/api'

const roleColors = { student: '#3B82F6', teacher: '#10B981', parent: '#0F766E', admin: '#1E293B' }
const roleIcons  = { student: '🎒', teacher: '📚', parent: '👨‍👩‍👧', admin: '⚙️' }
const TAB_ROLES  = [null, 'student', 'teacher', 'parent']

export default function UserManagementPage() {
  const [tab, setTab]               = useState(0)
  const [search, setSearch]         = useState('')
  const [users, setUsers]           = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [toggleDialog, setToggleDialog] = useState(null)
  const [toggling, setToggling]     = useState(false)
  const [snack, setSnack]           = useState('')
  const [resetDialog, setResetDialog]   = useState(null)   // user object
  const [newPassword, setNewPassword]   = useState('')
  const [resetting, setResetting]       = useState(false)
  const [showNewPwd, setShowNewPwd]     = useState(false)

  /* ── Fetch users ─────────────────────────────────────────────────────────── */
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (TAB_ROLES[tab]) params.role = TAB_ROLES[tab]
      if (search)         params.search = search
      const { data } = await api.get('/auth/users', { params })
      setUsers(data.data.users)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.')
    } finally {
      setLoading(false)
    }
  }, [tab, search])

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300)   // debounce search
    return () => clearTimeout(timer)
  }, [fetchUsers])

  /* ── Toggle active status ────────────────────────────────────────────────── */
  const handleToggleConfirm = async () => {
    if (!toggleDialog) return
    setToggling(true)
    try {
      await api.patch(`/auth/users/${toggleDialog._id}/toggle-status`)
      setSnack(`User "${toggleDialog.name}" has been ${toggleDialog.isActive ? 'disabled' : 'enabled'}.`)
      setToggleDialog(null)
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status.')
    } finally {
      setToggling(false)
    }
  }
  /* ── Reset password ─────────────────────────────────────────────────────────── */
  const handleResetPassword = async () => {
    if (!resetDialog) return
    setResetting(true)
    try {
      await api.patch(`/auth/users/${resetDialog._id}/reset-password`, { newPassword })
      setSnack(`Password reset for "${resetDialog.name}".`)
      setResetDialog(null)
      setNewPassword('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.')
    } finally {
      setResetting(false)
    }
  }
  /* ── Counts by role ──────────────────────────────────────────────────────── */
  const counts = {
    all:     users.length,
    student: users.filter(u => u.role === 'student').length,
    teacher: users.filter(u => u.role === 'teacher').length,
    parent:  users.filter(u => u.role === 'parent').length,
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>👥 User Management</Typography>
        <Typography variant="body2" color="text.secondary">Manage all platform users</Typography>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
        {[
          { label: 'Total Users', value: counts.all,     color: '#1E293B' },
          { label: 'Students',    value: counts.student, color: '#3B82F6' },
          { label: 'Teachers',    value: counts.teacher, color: '#10B981' },
          { label: 'Parents',     value: counts.parent,  color: '#0F766E' },
        ].map(s => (
          <Card key={s.label} sx={{ borderRadius: '8px' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              <Typography variant="h5" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
        {['All Users', 'Students', 'Teachers', 'Parents'].map((label, i) => (
          <Tab key={i} label={label} />
        ))}
      </Tabs>

      <TextField fullWidth placeholder="Search by name or email…"
        value={search} onChange={e => setSearch(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }}
        sx={{ mb: 2 }} />

      <Card sx={{ borderRadius: '8px', overflow: 'hidden' }}>
        <TableContainer>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: '#F8FAFC' } }}>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : users.map(user => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: user.avatarColor || '#1E293B', fontWeight: 700, width: 36, height: 36, fontSize: '0.85rem' }}>
                          {user.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                          {user.grade && <Typography variant="caption" color="text.secondary">Grade {user.grade}</Typography>}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={`${roleIcons[user.role]} ${user.role}`} size="small"
                        sx={{ bgcolor: `${roleColors[user.role]}15`, color: roleColors[user.role], fontWeight: 600, fontSize: '0.7rem', textTransform: 'capitalize' }} />
                    </TableCell>
                    <TableCell><Typography variant="body2">{user.email}</Typography></TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? 'Active' : 'Disabled'}
                        size="small"
                        color={user.isActive ? 'success' : 'default'}
                        sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Reset Password">
                        <IconButton size="small" color="info"
                          onClick={() => { setResetDialog(user); setNewPassword(''); setShowNewPwd(false) }}>
                          <LockResetRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={user.isActive ? 'Disable User' : 'Enable User'}>
                        <IconButton size="small"
                          color={user.isActive ? 'warning' : 'success'}
                          onClick={() => setToggleDialog(user)}>
                          {user.isActive
                            ? <BlockRoundedIcon fontSize="small" />
                            : <CheckCircleRoundedIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Card>

      {/* Reset Password Dialog */}
      <Dialog open={Boolean(resetDialog)} onClose={() => setResetDialog(null)}
        PaperProps={{ sx: { borderRadius: '16px', minWidth: 360 } }}>
        <DialogTitle fontWeight={800}>🔑 Reset Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Set a new password for <strong>{resetDialog?.name}</strong>.
          </Typography>
          <TextField fullWidth label="New Password" size="small"
            type={showNewPwd ? 'text' : 'password'}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            helperText="Min 8 characters"
            InputProps={{ endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setShowNewPwd(v => !v)} edge="end">
                  {showNewPwd
                    ? <CheckCircleRoundedIcon fontSize="small" />
                    : <BlockRoundedIcon fontSize="small" />}
                </IconButton>
              </InputAdornment>
            )}} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setResetDialog(null)} disabled={resetting} variant="outlined"
            sx={{ borderRadius: '10px' }}>Cancel</Button>
          <Button variant="contained" color="info"
            disabled={resetting || newPassword.length < 8}
            onClick={handleResetPassword}
            sx={{ borderRadius: '10px' }}>
            {resetting ? <CircularProgress size={18} color="inherit" /> : 'Reset Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toggle Status Confirmation Dialog */}
      <Dialog open={Boolean(toggleDialog)} onClose={() => setToggleDialog(null)}>
        <DialogTitle>
          {toggleDialog?.isActive ? 'Disable User?' : 'Enable User?'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {toggleDialog?.isActive
              ? `"${toggleDialog?.name}" will no longer be able to log in.`
              : `"${toggleDialog?.name}" will regain access to the platform.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToggleDialog(null)} disabled={toggling}>Cancel</Button>
          <Button
            variant="contained"
            color={toggleDialog?.isActive ? 'warning' : 'success'}
            onClick={handleToggleConfirm}
            disabled={toggling}
          >
            {toggling ? <CircularProgress size={18} color="inherit" /> : (toggleDialog?.isActive ? 'Disable' : 'Enable')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar feedback */}
      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={4000}
        onClose={() => setSnack('')}
        message={snack}
      />
    </Box>
  )
}
