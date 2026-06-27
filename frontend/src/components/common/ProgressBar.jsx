import { Box, Typography, LinearProgress, Chip } from '@mui/material'

export default function ProgressBar({ value, label, color = 'primary', showLabel = true, height = 8, suffix = '%' }) {
  return (
    <Box>
      {showLabel && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
          <Typography variant="body2" fontWeight={700} color={`${color}.main`}>{value}{suffix}</Typography>
        </Box>
      )}
      <LinearProgress
        variant="determinate"
        value={Math.min(value, 100)}
        color={color}
        sx={{
          height,
          borderRadius: '100px',
          backgroundColor: 'action.hover',
          '& .MuiLinearProgress-bar': { borderRadius: '100px' },
        }}
      />
    </Box>
  )
}
