import { memo } from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'

function StatCard({ title, value, icon, color = '#6C63FF', bgGradient }) {
  return (
    <Card sx={{
      background: bgGradient || `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
      border: `1px solid ${color}25`,
      borderRadius: '16px',
      height: '100%',
    }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} noWrap sx={{ lineHeight: 1.2 }}>
            {title}
          </Typography>
          <Box sx={{
            fontSize: '1.25rem', lineHeight: 1,
            bgcolor: `${color}20`, borderRadius: '8px',
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, ml: 0.5,
          }}>
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" fontWeight={800} sx={{ color, lineHeight: 1 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default memo(StatCard)
