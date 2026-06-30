import { useEffect, useState } from 'react'
import {
  Box, Typography, Card, CardContent, Button, TextField, Alert, Chip,
  Tab, Tabs, FormControl, InputLabel, Select, MenuItem, CircularProgress,
} from '@mui/material'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import { classesApi, notificationsApi } from '../../services/apiCatalog'

const GRADES = ['Nursery', 'KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

export default function CommunicationPage() {
  const [tab, setTab] = useState(0)
  const [classes, setClasses] = useState([])
  const [classesLoading, setClassesLoading] = useState(true)
  const [form, setForm] = useState({ title: '', message: '', classId: '', grade: '' })
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)   // { ok: bool, message: string }

  useEffect(() => {
    classesApi.getAll()
      .then(d => setClasses(d.data?.classes ?? []))
      .catch(() => setClasses([]))
      .finally(() => setClassesLoading(false))
  }, [])

  const handleSend = async () => {
    setSending(true)
    setResult(null)
    try {
      const payload = {
        title:   form.title.trim(),
        message: form.message.trim(),
      }
      if (form.classId) payload.classId = form.classId
      if (form.grade)   payload.grade   = form.grade
      const res = await notificationsApi.broadcast(payload)
      const count = res.sentTo ?? 0
      setResult({ ok: true, message: count > 0 ? `Sent to ${count} student${count === 1 ? '' : 's'}.` : 'No students matched your filters.' })
      setForm({ title: '', message: '', classId: '', grade: '' })
    } catch (err) {
      const apiMsg = err?.response?.data?.message
      setResult({ ok: false, message: apiMsg || 'Failed to send announcement. Please try again.' })
    } finally {
      setSending(false)
    }
  }

  const canSend = form.title.trim() && form.message.trim() && !sending

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>📢 Communication</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Send announcements to students in your classes</Typography>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="📣 Announcements" />
        <Tab
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LockRoundedIcon sx={{ fontSize: '0.9rem' }} />
              Parent Messages
            </Box>
          }
          disabled
          sx={{ opacity: 0.45 }}
        />
      </Tabs>

      {tab === 1 && (
        <Alert severity="info" sx={{ mb: 2, borderRadius: '12px' }}>
          Parent messaging is coming soon. This feature will be available in the next release.
        </Alert>
      )}

      {tab === 0 && (
        <Card sx={{ borderRadius: '16px' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>New Announcement</Typography>

            <TextField
              fullWidth
              label="Title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              inputProps={{ maxLength: 100 }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Message"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              inputProps={{ maxLength: 500 }}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <FormControl sx={{ minWidth: 200, flex: 1 }} disabled={classesLoading}>
                <InputLabel>Target class (optional)</InputLabel>
                <Select
                  value={form.classId}
                  label="Target class (optional)"
                  onChange={e => setForm(f => ({ ...f, classId: e.target.value }))}
                >
                  <MenuItem value=""><em>All my classes</em></MenuItem>
                  {classes.map(c => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.name} — Grade {c.grade}{c.section ? ` · ${c.section}` : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>Grade filter (optional)</InputLabel>
                <Select
                  value={form.grade}
                  label="Grade filter (optional)"
                  onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}
                >
                  <MenuItem value=""><em>Any grade</em></MenuItem>
                  {GRADES.map(g => (
                    <MenuItem key={g} value={g}>{g === 'Nursery' || g === 'KG' ? g : `Grade ${g}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {classesLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">Loading your classes…</Typography>
              </Box>
            )}

            {result && (
              <Alert severity={result.ok ? 'success' : 'error'} sx={{ mb: 2, borderRadius: '10px' }} onClose={() => setResult(null)}>
                {result.message}
              </Alert>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={sending ? <CircularProgress size={16} color="inherit" /> : <SendRoundedIcon />}
                disabled={!canSend}
                onClick={handleSend}
                sx={{ borderRadius: '10px' }}
              >
                {sending ? 'Sending…' : 'Send Announcement'}
              </Button>
              {!form.classId && !form.grade && (
                <Chip label="Will send to all your students" size="small" variant="outlined" />
              )}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
