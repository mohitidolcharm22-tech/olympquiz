import { Component } from 'react'
import { Box, Typography, Button, Alert } from '@mui/material'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'

/**
 * ErrorBoundary — catches render/lifecycle errors in its subtree.
 *
 * Props:
 *   fallback  — optional custom fallback ReactNode
 *   inline    — if true, renders a compact inline error instead of full-page
 *   onReset   — optional callback when the user clicks Retry
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
    this.handleReset = this.handleReset.bind(this)
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Log to console in dev; swap for an error-reporting service (Sentry etc.) in prod.
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleReset() {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  render() {
    const { hasError, error } = this.state
    const { children, fallback, inline } = this.props

    if (!hasError) return children

    // Custom fallback provided by caller
    if (fallback) return fallback

    // ── Inline compact variant (use inside cards / sections)
    if (inline) {
      return (
        <Alert
          severity="error"
          action={
            <Button variant="text" color="inherit" size="small"
              startIcon={<RefreshRoundedIcon />} onClick={this.handleReset}>
              Retry
            </Button>
          }
          sx={{ borderRadius: '12px', my: 1 }}
        >
          {error?.message || 'Something went wrong in this section.'}
        </Alert>
      )
    }

    // ── Full-page fallback (default)
    return (
      <Box sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '60vh', p: 4, textAlign: 'center',
      }}>
        <Typography sx={{ fontSize: '4rem', mb: 2 }}>💥</Typography>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          Something went wrong
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
          An unexpected error occurred. You can try refreshing this section or
          go back to the home page.
        </Typography>

        {import.meta.env.DEV && error?.message && (
          <Box sx={{
            mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: '10px',
            maxWidth: 560, width: '100%', textAlign: 'left', overflow: 'auto',
          }}>
            <Typography variant="caption" fontFamily="monospace" color="error.main">
              {error.message}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="contained" startIcon={<RefreshRoundedIcon />}
            onClick={this.handleReset} sx={{ borderRadius: '10px' }}>
            Try Again
          </Button>
          <Button variant="outlined" startIcon={<HomeRoundedIcon />}
            onClick={() => { this.handleReset(); window.location.href = '/' }}
            sx={{ borderRadius: '10px' }}>
            Go Home
          </Button>
        </Box>
      </Box>
    )
  }
}
