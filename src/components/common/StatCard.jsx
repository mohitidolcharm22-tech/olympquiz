import { Card, CardContent, Typography, Box, Avatar } from '@mui/material'

export default function StatCard({ title, value, subtitle, icon, color = '#6C63FF', trend, bgGradient }) {
  return (
    <Card sx={{
      background: bgGradient || `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
      border: `1px solid ${color}25`,
      borderRadius: '16px',
      height: '100%',
    }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ color, lineHeight: 1.1, mb: 0.25 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
            )}
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 0.5 }}>
                <Typography variant="caption" sx={{ color: trend > 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>
                  {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">vs last week</Typography>
              </Box>
            )}
          </Box>
          {icon && (
            <Avatar sx={{ bgcolor: `${color}20`, color, width: 48, height: 48, fontSize: '1.5rem', borderRadius: '12px' }}>
              {icon}
            </Avatar>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
