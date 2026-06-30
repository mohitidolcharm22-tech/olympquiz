import { useState } from 'react'
import {
  Box, Typography, Card, CardContent, Button, Chip, Grid, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  TextField, InputAdornment, Menu, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, Select, FormControl, InputLabel, Tooltip, useMediaQuery, useTheme,
} from '@mui/material'
import AddRoundedIcon       from '@mui/icons-material/AddRounded'
import SearchRoundedIcon    from '@mui/icons-material/SearchRounded'
import EditRoundedIcon      from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon    from '@mui/icons-material/DeleteRounded'
import MoreVertRoundedIcon  from '@mui/icons-material/MoreVertRounded'

const initialItems = [
  { id: 1, title: 'Introduction to Multiplication', type: 'lesson',   subject: 'Math',    grade: '3', status: 'published', views: 234, date: '2024-06-10' },
  { id: 2, title: 'Addition Fun Video',             type: 'video',    subject: 'Math',    grade: '2', status: 'published', views: 189, date: '2024-06-08' },
  { id: 3, title: 'Shapes Around Us - PDF',         type: 'pdf',      subject: 'Math',    grade: '2', status: 'draft',     views: 0,   date: '2024-06-05' },
  { id: 4, title: 'Number Patterns Worksheet',      type: 'document', subject: 'Math',    grade: '4', status: 'published', views: 95,  date: '2024-06-01' },
  { id: 5, title: 'Multiplication Tables Chart',    type: 'image',    subject: 'Math',    grade: '3', status: 'published', views: 312, date: '2024-05-28' },
]

const typeColors = { lesson: '#6C63FF', video: '#EF4444', pdf: '#F59E0B', document: '#10B981', image: '#EC4899' }
const typeIcons  = { lesson: '📖', video: '🎥', pdf: '📑', document: '📄', image: '🖼️' }
const emptyForm  = { title: '', type: 'lesson', subject: 'Math', grade: '3', status: 'draft' }

export default function ContentManagementPage() {
  const theme   = useTheme()
  const mobile  = useMediaQuery(theme.breakpoints.down('sm'))

  const [items,        setItems]        = useState(initialItems)
  const [search,       setSearch]       = useState('')
  const [deleteDialog, setDeleteDialog] = useState(null)
  const [editItem,     setEditItem]     = useState(null)   // existing item → edit mode
  const [showCreate,   setShowCreate]   = useState(false)
  const [form,         setForm]         = useState(emptyForm)
  const [menuAnchor,   setMenuAnchor]   = useState(null)
  const [menuItem,     setMenuItem]     = useState(null)

  const filtered = items.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))

  const openCreate = ()     => { setForm(emptyForm); setShowCreate(true) }
  const openEdit   = (item) => { setForm({ ...item }); setEditItem(item) }
  const closeForm  = ()     => { setShowCreate(false); setEditItem(null) }

  const handleSave = () => {
    if (editItem) {
      setItems(prev => prev.map(it => it.id === editItem.id ? { ...it, ...form } : it))
    } else {
      setItems(prev => [...prev, { ...form, id: Date.now(), views: 0, date: new Date().toISOString().slice(0, 10) }])
    }
    closeForm()
  }

  const handleDelete = () => {
    setItems(prev => prev.filter(it => it.id !== deleteDialog.id))
    setDeleteDialog(null)
  }

  const openMenu = (e, item) => { setMenuAnchor(e.currentTarget); setMenuItem(item) }
  const closeMenu = ()       => { setMenuAnchor(null); setMenuItem(null) }

  const formOpen  = showCreate || Boolean(editItem)
  const formTitle = editItem ? '✏️ Edit Content' : '📄 Add New Content'

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>📚 Content Management</Typography>
          <Typography variant="body2" color="text.secondary">Manage your lessons, videos, and resources</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate} sx={{ borderRadius: '10px' }}>
          Add Content
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Content', value: items.length,                                       icon: '📄', color: '#1E40AF' },
          { label: 'Published',     value: items.filter(c => c.status === 'published').length,  icon: '✅', color: '#10B981' },
          { label: 'Draft',         value: items.filter(c => c.status === 'draft').length,      icon: '📝', color: '#F59E0B' },
          { label: 'Total Views',   value: items.reduce((s, c) => s + (c.views || 0), 0),       icon: '👁',  color: '#7C3AED' },
        ].map(stat => (
          <Grid item xs={6} sm={3} key={stat.label}>
            <Card sx={{ borderRadius: '12px' }}>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>{stat.label}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                  <Typography variant="h5" fontWeight={800} sx={{ color: stat.color }}>{stat.value}</Typography>
                  <Typography>{stat.icon}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search */}
      <TextField fullWidth size="small" placeholder="Search content..." value={search}
        onChange={e => setSearch(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon /></InputAdornment> }}
        sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />

      {/* ── Desktop Table ── */}
      {!mobile ? (
        <Card sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' } }}>
                  <TableCell>Content</TableCell><TableCell>Type</TableCell><TableCell>Grade</TableCell>
                  <TableCell>Status</TableCell><TableCell>Views</TableCell><TableCell>Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map(item => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: `${typeColors[item.type]}20`, color: typeColors[item.type], width: 34, height: 34, borderRadius: '8px', fontSize: '1rem' }}>
                          {typeIcons[item.type]}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>{item.title}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={item.type} size="small"
                        sx={{ bgcolor: `${typeColors[item.type]}15`, color: typeColors[item.type], fontWeight: 600, fontSize: '0.7rem' }} />
                    </TableCell>
                    <TableCell><Typography variant="body2">Grade {item.grade}</Typography></TableCell>
                    <TableCell>
                      <Chip label={item.status} size="small"
                        color={item.status === 'published' ? 'success' : 'default'}
                        variant={item.status === 'published' ? 'filled' : 'outlined'}
                        sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                    </TableCell>
                    <TableCell>{item.views?.toLocaleString()}</TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{item.date}</Typography></TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit content" placement="top">
                        <IconButton size="small" sx={{ mr: 0.5 }} onClick={() => openEdit(item)}>
                          <EditRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete content" placement="top">
                        <IconButton size="small" color="error" onClick={() => setDeleteDialog(item)}>
                          <DeleteRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      ) : (
        /* ── Mobile Cards ── */
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {filtered.map(item => (
            <Card key={item.id} sx={{ borderRadius: '14px' }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: `${typeColors[item.type]}20`, color: typeColors[item.type], width: 42, height: 42, borderRadius: '10px', fontSize: '1.3rem', flexShrink: 0 }}>
                    {typeIcons[item.type]}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>{item.title}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      <Chip label={item.type} size="small"
                        sx={{ bgcolor: `${typeColors[item.type]}15`, color: typeColors[item.type], fontWeight: 600, fontSize: '0.65rem', height: 20 }} />
                      <Chip label={`Grade ${item.grade}`} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                      <Chip label={item.status} size="small"
                        color={item.status === 'published' ? 'success' : 'default'}
                        variant={item.status === 'published' ? 'filled' : 'outlined'}
                        sx={{ fontWeight: 600, fontSize: '0.65rem', height: 20 }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      👁 {item.views?.toLocaleString()} views · {item.date}
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={e => openMenu(e, item)}>
                    <MoreVertRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}
            PaperProps={{ sx: { borderRadius: '12px' } }}>
            <MenuItem onClick={() => { openEdit(menuItem); closeMenu() }}>
              <EditRoundedIcon fontSize="small" sx={{ mr: 1.5, color: 'primary.main' }} /> Edit
            </MenuItem>
            <MenuItem sx={{ color: 'error.main' }} onClick={() => { setDeleteDialog(menuItem); closeMenu() }}>
              <DeleteRoundedIcon fontSize="small" sx={{ mr: 1.5 }} /> Delete
            </MenuItem>
          </Menu>
        </Box>
      )}

      {/* ── Create / Edit dialog (inline so the TextField keeps focus across keystrokes) ── */}
      <Dialog open={formOpen} onClose={closeForm} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>{formTitle}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          <TextField fullWidth label="Title *" value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select value={form.type} label="Type" onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {Object.keys(typeIcons).map(t => (
                <MenuItem key={t} value={t}>{typeIcons[t]}&nbsp;{t.charAt(0).toUpperCase() + t.slice(1)}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Subject</InputLabel>
            <Select value={form.subject} label="Subject" onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
              {['Math', 'English', 'GK'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Grade</InputLabel>
            <Select value={form.grade} label="Grade" onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}>
              {['Nursery', 'KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(g => (
                <MenuItem key={g} value={g}>{isNaN(g) ? g : `Grade ${g}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={form.status} label="Status" onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={closeForm} variant="outlined" sx={{ borderRadius: '10px' }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!form.title} sx={{ borderRadius: '10px' }}>
            {editItem ? 'Save Changes' : 'Add Content'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteDialog)} onClose={() => setDeleteDialog(null)}
        PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle fontWeight={800}>Delete Content?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete <strong>"{deleteDialog?.title}"</strong>? This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDeleteDialog(null)} variant="outlined" sx={{ borderRadius: '10px' }}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete} sx={{ borderRadius: '10px' }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
