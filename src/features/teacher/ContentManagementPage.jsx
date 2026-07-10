import { useEffect, useMemo, useState } from 'react'
import {
  Box, Typography, Card, CardContent, Button, IconButton, Chip,
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, Tooltip, Alert,
  CircularProgress, Stack, Divider,
} from '@mui/material'
import AddRoundedIcon       from '@mui/icons-material/AddRounded'
import EditRoundedIcon      from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon    from '@mui/icons-material/DeleteRounded'
import { subjectsApi, topicsApi, lessonsApi } from '../../services/apiCatalog'
import { validateYoutubeUrl } from '../../utils/youtubeValidation'

const LESSON_TYPES = ['lesson', 'video', 'activity']

const emptySubjectForm = { name: '', icon: '📖', color: '#6C63FF', bgGradient: 'linear-gradient(135deg, #6C63FF 0%, #A78BFA 100%)', description: '' }
const emptyTopicForm  = { name: '', icon: '📖', difficulty: 'easy', order: 0, grade: [] }
const emptyLessonForm = { title: '', type: 'lesson', duration: 10, xp: 50, content: '', youtubeUrl: '', keyPoints: [], order: 1 }

export default function ContentManagementPage() {
  // ── Source data ─────────────────────────────────────────────────────────
  const [subjects, setSubjects]   = useState([])
  const [topics,   setTopics]     = useState([])
  const [lessons,  setLessons]    = useState([])

  // ── Selection ───────────────────────────────────────────────────────────
  const [subjectId, setSubjectId] = useState('')
  const [topicId,   setTopicId]   = useState('')

  // ── Status ──────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [busy, setBusy]       = useState(false)

  // ── Dialogs ─────────────────────────────────────────────────────────────
  const [topicDialog,  setTopicDialog]  = useState(null)   // { mode, form }
  const [lessonDialog, setLessonDialog] = useState(null)
  const [subjectDialog, setSubjectDialog] = useState(null) // { form }
  const [confirmDel,   setConfirmDel]   = useState(null)   // { kind, item }
  const [lessonError, setLessonError]   = useState('')     // validation errors for lesson dialog
  const [youtubeValidation, setYoutubeValidation] = useState(null) // { valid, message, title } | null
  const [validatingYoutube, setValidatingYoutube] = useState(false)

  // ── Initial load: subjects ──────────────────────────────────────────────
  useEffect(() => {
    setLoading(true)
    subjectsApi.getAll()
      .then(d => {
        const list = d.data?.subjects ?? d.data ?? []
        setSubjects(list)
        if (list.length) setSubjectId(list[0]._id)
      })
      .catch(() => setError('Failed to load subjects.'))
      .finally(() => setLoading(false))
  }, [])

  // ── Topics for selected subject ─────────────────────────────────────────
  useEffect(() => {
    if (!subjectId) return
    subjectsApi.getTopics(subjectId)
      .then(d => {
        const list = d.data?.topics ?? []
        setTopics(list)
        setTopicId(list[0]?._id ?? '')
      })
      .catch(() => setTopics([]))
  }, [subjectId])

  // ── Lessons for selected topic ──────────────────────────────────────────
  useEffect(() => {
    if (!topicId) { setLessons([]); return }
    topicsApi.getLessons(topicId)
      .then(d => setLessons(d.data?.lessons ?? []))
      .catch(() => setLessons([]))
  }, [topicId])

  const selectedSubject = useMemo(() => subjects.find(s => s._id === subjectId), [subjects, subjectId])
  const selectedTopic   = useMemo(() => topics.find(t => t._id === topicId), [topics, topicId])

  /* ───────── Subject handlers ───────── */
  const saveSubject = async () => {
    if (!subjectDialog) return
    setBusy(true)
    try {
      const res = await subjectsApi.create(subjectDialog.form)
      const created = res.data?.subject ?? res.subject
      if (created) {
        setSubjects(prev => [...prev, created])
        setSubjectId(created._id)
      }
      setSubjectDialog(null)
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to save subject.')
    } finally {
      setBusy(false)
    }
  }

  /* ───────── Topic handlers ───────── */
  const openCreateTopic = () => setTopicDialog({ mode: 'create', form: { ...emptyTopicForm } })
  const openEditTopic   = (t) => setTopicDialog({ mode: 'edit', topic: t, form: {
    name: t.name, icon: t.icon, difficulty: t.difficulty, order: t.order ?? 0, grade: t.grade ?? [],
  }})

  const saveTopic = async () => {
    if (!topicDialog || !subjectId) return
    setBusy(true)
    try {
      if (topicDialog.mode === 'create') {
        const res = await topicsApi.create({ ...topicDialog.form, subjectId })
        const created = res.data?.topic
        if (created) {
          setTopics(prev => [...prev, created])
          setTopicId(created._id)
        }
      } else {
        const res = await topicsApi.update(topicDialog.topic._id, topicDialog.form)
        const updated = res.data?.topic
        setTopics(prev => prev.map(t => t._id === updated?._id ? { ...t, ...updated } : t))
      }
      setTopicDialog(null)
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to save topic.')
    } finally {
      setBusy(false)
    }
  }

  /* ───────── Lesson handlers ───────── */
  const openCreateLesson = () => {
    setYoutubeValidation(null)
    setLessonError('')
    setLessonDialog({ mode: 'create', form: {
      ...emptyLessonForm, order: (lessons[lessons.length - 1]?.order ?? 0) + 1,
    }})
  }
  const openEditLesson   = (l) => {
    console.log('📖 Loading lesson to edit:', l)
    setYoutubeValidation(null)
    setLessonError('')
    setLessonDialog({ mode: 'edit', lesson: l, form: {
      title: l.title, type: l.type, duration: l.duration, xp: l.xp,
      content: l.content, youtubeUrl: l.youtubeUrl ?? l.videoUrl ?? '', keyPoints: l.keyPoints ?? [], order: l.order ?? 1,
    }})
  }

  const handleYoutubeUrlBlur = async (url) => {
    if (!url) { setYoutubeValidation(null); return }
    setValidatingYoutube(true)
    setYoutubeValidation(null)
    const result = await validateYoutubeUrl(url)
    setYoutubeValidation(result)
    setValidatingYoutube(false)
    if (!result.valid) {
      setLessonError(result.message)
    } else {
      // Clear any previous YouTube URL error if now valid
      if (lessonError && lessonError === (youtubeValidation?.message)) setLessonError('')
    }
  }

  const saveLesson = async () => {
    if (!lessonDialog || !topicId || !subjectId) return
    // Block save if YouTube URL failed validation
    if (lessonDialog.form.type === 'video' && lessonDialog.form.youtubeUrl && youtubeValidation?.valid === false) {
      setLessonError(youtubeValidation.message)
      return
    }
    setLessonError('')
    setBusy(true)
    try {
      const payload = { ...lessonDialog.form, topicId, subjectId }
      console.log('📤 Sending lesson payload:', payload)
      if (lessonDialog.mode === 'create') {
        const res = await lessonsApi.create(payload)
        const created = res.data?.lesson
        if (created) setLessons(prev => [...prev, created])
      } else {
        console.log('📝 Updating lesson', lessonDialog.lesson._id, 'with payload:', payload)
        const res = await lessonsApi.update(lessonDialog.lesson._id, payload)
        const updated = res.data?.lesson
        console.log('✅ Update response:', updated)
        setLessons(prev => prev.map(l => l._id === updated?._id ? { ...l, ...updated } : l))
      }
      setLessonDialog(null)
    } catch (e) {
      const errorMsg = e?.response?.data?.message || 'Failed to save lesson.'
      console.error('❌ Error saving lesson:', errorMsg, e)
      setLessonError(errorMsg)
    } finally {
      setBusy(false)
    }
  }

  const deleteLesson = async () => {
    if (!confirmDel) return
    setBusy(true)
    try {
      await lessonsApi.delete(confirmDel.item._id)
      setLessons(prev => prev.filter(l => l._id !== confirmDel.item._id))
      setConfirmDel(null)
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to delete lesson.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress /></Box>
  )
  if (error) return (
    <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>
  )

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>📚 Content Management</Typography>
        <Typography variant="body2" color="text.secondary">Manage topics and lessons for each subject</Typography>
      </Box>

      {/* Subject + Topic picker */}
      <Card sx={{ borderRadius: '16px', mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel>Subject</InputLabel>
              <Select value={subjectId} label="Subject" onChange={e => setSubjectId(e.target.value)}>
                {subjects.map(s => (
                  <MenuItem key={s._id} value={s._id}>{s.icon} {s.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 240, flex: 1 }} disabled={!topics.length}>
              <InputLabel>Topic</InputLabel>
              <Select value={topicId} label="Topic" onChange={e => setTopicId(e.target.value)}>
                {topics.length === 0
                  ? <MenuItem value="" disabled>No topics yet</MenuItem>
                  : topics.map(t => (
                      <MenuItem key={t._id} value={t._id}>{t.icon} {t.name}</MenuItem>
                    ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button variant="outlined" startIcon={<AddRoundedIcon />} onClick={() => setSubjectDialog({ form: { ...emptySubjectForm } })}>
                Add Subject
              </Button>
              <Button variant="outlined" startIcon={<AddRoundedIcon />} disabled={!subjectId} onClick={openCreateTopic}>
                Add Topic
              </Button>
              {selectedTopic && (
                <Button variant="outlined" startIcon={<EditRoundedIcon />} onClick={() => openEditTopic(selectedTopic)}>
                  Edit Topic
                </Button>
              )}
            </Box>
          </Stack>
          {selectedSubject && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              <Chip label={`${topics.length} topics`} size="small" />
              <Chip label={`${lessons.length} lessons in selected topic`} size="small" color="primary" />
              {selectedTopic?.difficulty && <Chip label={selectedTopic.difficulty} size="small" variant="outlined" />}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Lessons table */}
      <Card sx={{ borderRadius: '16px' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>📖 Lessons</Typography>
            <Button variant="contained" startIcon={<AddRoundedIcon />} disabled={!topicId} onClick={openCreateLesson}>
              Add Lesson
            </Button>
          </Box>
          <Divider sx={{ mb: 1 }} />

          {!topicId ? (
            <Alert severity="info" sx={{ borderRadius: '10px' }}>Select a subject and topic to manage lessons.</Alert>
          ) : lessons.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: '10px' }}>No lessons yet — click <strong>Add Lesson</strong> to create one.</Alert>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Duration</TableCell>
                    <TableCell align="right">XP</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lessons.map(l => (
                    <TableRow key={l._id} hover>
                      <TableCell>{l.order}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{l.title}</TableCell>
                      <TableCell>
                        <Chip label={l.type} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="right">{l.duration} min</TableCell>
                      <TableCell align="right">⚡ {l.xp}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEditLesson(l)}><EditRoundedIcon fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => setConfirmDel({ kind: 'lesson', item: l })}>
                            <DeleteRoundedIcon fontSize="small" />
                          </IconButton>
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

      {/* Subject dialog */}
      <Dialog open={Boolean(subjectDialog)} onClose={() => !busy && setSubjectDialog(null)} fullWidth maxWidth="sm">
        <DialogTitle>New Subject</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" autoFocus fullWidth
              value={subjectDialog?.form?.name ?? ''}
              onChange={e => setSubjectDialog(d => ({ ...d, form: { ...d.form, name: e.target.value } }))} />
            <TextField label="Icon (emoji)" fullWidth
              value={subjectDialog?.form?.icon ?? ''}
              onChange={e => setSubjectDialog(d => ({ ...d, form: { ...d.form, icon: e.target.value } }))} />
            <TextField label="Description" fullWidth multiline rows={2}
              value={subjectDialog?.form?.description ?? ''}
              onChange={e => setSubjectDialog(d => ({ ...d, form: { ...d.form, description: e.target.value } }))} />
            <TextField label="Color (hex)" fullWidth
              value={subjectDialog?.form?.color ?? ''}
              onChange={e => setSubjectDialog(d => ({ ...d, form: { ...d.form, color: e.target.value } }))} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubjectDialog(null)} disabled={busy}>Cancel</Button>
          <Button onClick={saveSubject} variant="contained" disabled={busy || !subjectDialog?.form?.name}>
            {busy ? 'Saving…' : 'Create Subject'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Topic dialog */}
      <Dialog open={Boolean(topicDialog)} onClose={() => !busy && setTopicDialog(null)} fullWidth maxWidth="sm">
        <DialogTitle>{topicDialog?.mode === 'create' ? 'New Topic' : 'Edit Topic'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name" autoFocus fullWidth
              value={topicDialog?.form?.name ?? ''}
              onChange={e => setTopicDialog(d => ({ ...d, form: { ...d.form, name: e.target.value } }))}
            />
            <TextField
              label="Icon (emoji)" fullWidth
              value={topicDialog?.form?.icon ?? ''}
              onChange={e => setTopicDialog(d => ({ ...d, form: { ...d.form, icon: e.target.value } }))}
            />
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                label="Difficulty"
                value={topicDialog?.form?.difficulty ?? 'easy'}
                onChange={e => setTopicDialog(d => ({ ...d, form: { ...d.form, difficulty: e.target.value } }))}
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Order" type="number" fullWidth
              value={topicDialog?.form?.order ?? 0}
              onChange={e => setTopicDialog(d => ({ ...d, form: { ...d.form, order: Number(e.target.value) } }))}
            />
            <TextField
              label="Grades (comma-separated)" fullWidth
              value={(topicDialog?.form?.grade ?? []).join(', ')}
              onChange={e => setTopicDialog(d => ({ ...d, form: { ...d.form, grade: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } }))}
              helperText="e.g. 3, 4, 5"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTopicDialog(null)} disabled={busy}>Cancel</Button>
          <Button onClick={saveTopic} variant="contained" disabled={busy || !topicDialog?.form?.name}>
            {busy ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lesson dialog */}
      <Dialog open={Boolean(lessonDialog)} onClose={() => !busy && (setLessonDialog(null), setLessonError(''), setYoutubeValidation(null))} fullWidth maxWidth="md">
        <DialogTitle>{lessonDialog?.mode === 'create' ? 'New Lesson' : 'Edit Lesson'}</DialogTitle>
        <DialogContent>
          {lessonError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setLessonError('')}>
              {lessonError}
            </Alert>
          )}
          <Stack spacing={2} sx={{ mt: lessonError ? 0 : 1 }}>
            <TextField
              label="Title" autoFocus fullWidth
              value={lessonDialog?.form?.title ?? ''}
              onChange={e => setLessonDialog(d => ({ ...d, form: { ...d.form, title: e.target.value } }))}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  label="Type"
                  value={lessonDialog?.form?.type ?? 'lesson'}
                  onChange={e => setLessonDialog(d => ({ ...d, form: { ...d.form, type: e.target.value } }))}
                >
                  {LESSON_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField
                label="Duration (min)" type="number" sx={{ flex: 1 }}
                value={lessonDialog?.form?.duration ?? 10}
                onChange={e => setLessonDialog(d => ({ ...d, form: { ...d.form, duration: Number(e.target.value) } }))}
              />
              <TextField
                label="XP" type="number" sx={{ flex: 1 }}
                value={lessonDialog?.form?.xp ?? 50}
                onChange={e => setLessonDialog(d => ({ ...d, form: { ...d.form, xp: Number(e.target.value) } }))}
              />
              <TextField
                label="Order" type="number" sx={{ flex: 1 }}
                value={lessonDialog?.form?.order ?? 1}
                onChange={e => setLessonDialog(d => ({ ...d, form: { ...d.form, order: Number(e.target.value) } }))}
              />
            </Stack>
            {lessonDialog?.form?.type === 'video' && (
              <Stack spacing={1.5}>
                <TextField
                  label="YouTube URL"
                  fullWidth
                  value={lessonDialog?.form?.youtubeUrl ?? ''}
                  onChange={e => {
                    setLessonDialog(d => ({ ...d, form: { ...d.form, youtubeUrl: e.target.value } }))
                    // Clear stale validation when URL is edited
                    setYoutubeValidation(null)
                  }}
                  onBlur={e => handleYoutubeUrlBlur(e.target.value)}
                  error={youtubeValidation?.valid === false}
                  color={youtubeValidation?.valid === true ? 'success' : undefined}
                  focused={youtubeValidation?.valid === true ? true : undefined}
                  InputProps={{
                    endAdornment: validatingYoutube
                      ? <CircularProgress size={18} sx={{ mr: 1 }} />
                      : youtubeValidation?.valid === true
                        ? <Typography variant="caption" color="success.main" sx={{ whiteSpace: 'nowrap', mr: 1 }}>✓ Educational</Typography>
                        : null,
                  }}
                  helperText={
                    youtubeValidation?.valid === true
                      ? `✓ "${youtubeValidation.title}" — ${youtubeValidation.categoryName}`
                      : youtubeValidation?.valid === false
                        ? youtubeValidation.message
                        : 'Paste a YouTube watch, shorts, or youtu.be link. Students will watch it in the app. Tab out to validate.'
                  }
                />
                <Box sx={{ p: 2, borderRadius: 2, border: '1px dashed', borderColor: 'divider', bgcolor: 'background.default' }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
                    Video upload
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Uploading video files is currently disabled. Keep the logic here for later, but use YouTube links for now.
                  </Typography>
                  <Button variant="outlined" disabled>
                    Upload Video (disabled)
                  </Button>
                </Box>
              </Stack>
            )}
            <TextField
              label="Content (Markdown / HTML)" multiline rows={6} fullWidth
              value={lessonDialog?.form?.content ?? ''}
              onChange={e => setLessonDialog(d => ({ ...d, form: { ...d.form, content: e.target.value } }))}
              helperText={lessonDialog?.form?.type === 'video'
                ? 'Optional for video lessons. Use this for lesson notes, instructions, or a short summary.'
                : undefined}
            />
            <TextField
              label="Key points (one per line)" multiline rows={3} fullWidth
              value={(lessonDialog?.form?.keyPoints ?? []).join('\n')}
              onChange={e => setLessonDialog(d => ({ ...d, form: { ...d.form, keyPoints: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) } }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setLessonDialog(null); setLessonError(''); setYoutubeValidation(null) }} disabled={busy}>Cancel</Button>
          <Button
            onClick={saveLesson} variant="contained"
            disabled={
              busy ||
              validatingYoutube ||
              !lessonDialog?.form?.title ||
              (lessonDialog?.form?.type === 'video'
                ? !lessonDialog?.form?.youtubeUrl || youtubeValidation?.valid === false
                : !lessonDialog?.form?.content)
            }
          >
            {busy ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={Boolean(confirmDel)} onClose={() => !busy && setConfirmDel(null)}>
        <DialogTitle>Delete lesson?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {'"'}<strong>{confirmDel?.item?.title}</strong>{'"'} will be hidden from students. This is a soft delete and can be restored from the database.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDel(null)} disabled={busy}>Cancel</Button>
          <Button onClick={deleteLesson} color="error" variant="contained" disabled={busy}>
            {busy ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
