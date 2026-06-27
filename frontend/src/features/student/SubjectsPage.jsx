import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Grid, Typography, CircularProgress, Alert } from '@mui/material'
import SubjectCard from '../../components/common/SubjectCard'
import { subjectsApi } from '../../services/apiCatalog'

export default function SubjectsPage() {
  const navigate = useNavigate()
  const [subjects, setSubjects]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  useEffect(() => {
    subjectsApi.getAll()
      .then(data => setSubjects(data.data.subjects))
      .catch(() => setError('Failed to load subjects. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
      <CircularProgress />
    </Box>
  )

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>📖 My Subjects</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Choose a subject to start learning!</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
