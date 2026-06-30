import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Box, Typography, Card, CardContent, Button, Avatar, Chip, Tab, Tabs,
  TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,  CircularProgress, Alert, Tooltip, Snackbar, IconButton,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
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
  const [rowCount, setRowCount]     = useState(0)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })
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
      const params = {
        page:  paginationModel.page + 1,   // backend is 1-based
        limit: paginationModel.pageSize,
      }
      if (TAB_ROLES[tab]) params.role = TAB_ROLES[tab]
      if (search)         params.search = search
      const { data } = await api.get('/auth/users', { params })
      setUsers(data.data.users)
      setRowCount(data.pagination?.total ?? data.data.users.length)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.')
    } finally {
      setLoading(false)
    }
  }, [tab, search, paginationModel])

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300)   // debounce search
    return () => clearTimeout(timer)
  }, [fetchUsers])

  // Reset to first page whenever the filters change.
  useEffect(() => {
    setPaginationModel(m => ({ ...m, page: 0 }))
  }, [tab, search])

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
  // With server-side pagination `users` only holds the current page; the true
  // total for the active filter set is in `rowCount`.
  const counts = {
    total: rowCount,
  }

  /* ── DataGrid columns ────────────────────────────────────────────────────── */
  const userColumns = useMemo(() => [
    {
      field: 'name',
      headerName: 'User',
      flex: 1.4,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}>
          <Avatar sx={{ bgcolor: params.row.avatarColor || '#1E293B', fontWeight: 700, width: 32, height: 32, fontSize: '0.8rem' }}>
            {params.row.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>{params.row.name}</Typography>
            {params.row.grade && (
              <Typography variant="caption" color="text.secondary">Grade {params.row.grade}</Typography>
            )}
          </Box>
        </Box>
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={`${roleIcons[params.value]} ${params.value}`}
          size="small"
          sx={{ bgcolor: `${roleColors[params.value]}15`, color: roleColors[params.value], fontWeight: 600, fontSize: '0.7rem', textTransform: 'capitalize' }}
        />
      ),
    },
    { field: 'email', headerName: 'Email', flex: 1.2, minWidth: 200 },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 110,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Disabled'}
          size="small"
          color={params.value ? 'success' : 'default'}
          sx={{ fontWeight: 600, fontSize: '0.7rem' }}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Joined',
      width: 110,
      valueFormatter: (value) => value ? new Date(value).toLocaleDateString() : '',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 110,
      sortable: false,
      filterable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Box>
          <Tooltip title="Reset Password">
            <IconButton size="small" color="info"
              onClick={() => { setResetDialog(params.row); setNewPassword(''); setShowNewPwd(false) }}>
              <LockResetRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.isActive ? 'Disable User' : 'Enable User'}>
            <IconButton size="small"
              color={params.row.isActive ? 'warning' : 'success'}
              onClick={() => setToggleDialog(params.row)}>
              {params.row.isActive
                ? <BlockRoundedIcon fontSize="small" />
                : <CheckCircleRoundedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ], [])

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>👥 User Management</Typography>
        <Typography variant="body2" color="text.secondary">Manage all platform users</Typography>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr' }, gap: 2, mb: 3 }}>
        <Card sx={{ borderRadius: '8px' }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary">
              {TAB_ROLES[tab] ? `${TAB_ROLES[tab]}s matching filter` : 'Total users matching filter'}
            </Typography>
            <Typography variant="h5" fontWeight={800} sx={{ color: '#1E293B' }}>
              {counts.total.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
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
        <Box sx={{ width: '100%', height: 600 }}>
          <DataGrid
            rows={users}
            getRowId={(row) => row._id}
            loading={loading}
            columns={userColumns}
            disableRowSelectionOnClick
            paginationMode="server"
            rowCount={rowCount}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[25, 50, 100]}
            sx={{
              border: 0,
              '& .MuiDataGrid-columnHeaders': { bgcolor: '#F8FAFC', fontWeight: 700 },
              '& .MuiDataGrid-cell:focus': { outline: 'none' },
              '& .MuiDataGrid-cell:focus-within': { outline: 'none' },
            }}
            slotProps={{
              loadingOverlay: { variant: 'circular-progress', noRowsVariant: 'circular-progress' },
            }}
          />
        </Box>
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
