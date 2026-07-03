import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Box, Grid, Typography, CircularProgress, Alert, Button } from '@mui/material'
import SubjectCard from '../../components/common/SubjectCard'
import { subjectsApi } from '../../services/apiCatalog'

export default function SubjectsPage() {
  const navigate = useNavigate()
  const studentGrade = useSelector(s => s.auth.user?.grade) || ''
  const [subjects, setSubjects]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    subjectsApi.getAll(studentGrade ? { grade: studentGrade } : {})
      .then(data => {
        const list = data?.data?.subjects ?? data?.subjects ?? data?.data ?? []
        setSubjects(Array.isArray(list) ? list : [])
      })
      .catch(() => setError('Failed to load subjects. Please try again.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [studentGrade]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
      <CircularProgress />
    </Box>
  )

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>📖 My Subjects</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Choose a subject to start learning!</Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}
          action={<Button variant="text" color="inherit" size="small" onClick={load}>Retry</Button>}>
          {error}
        </Alert>
      )}

      {!error && !loading && subjects.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'background.paper', borderRadius: '20px', border: '2px dashed', borderColor: 'divider' }}>
          <Typography variant="h2" sx={{ mb: 2 }}>📚</Typography>
          <Typography variant="h6" fontWeight={700} gutterBottom>No subjects available yet</Typography>
          <Typography variant="body2" color="text.secondary">An admin needs to add subjects first.</Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {subjects.map(subject => (
          <Grid item xs={12} sm={6} md={4} key={subject._id}>
            <SubjectCard
              subject={{ ...subject, id: subject._id }}
              progress={0}
              onClick={() => navigate(`/student/subjects/${subject._id}`)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
