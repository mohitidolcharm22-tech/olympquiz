import { createTheme } from '@mui/material/styles'
import { colorTokens } from '../tokens/colors'
import { typographyTokens } from '../tokens/typography'

// ============================================================
// Student Theme - Fun & Playful
// ============================================================
const studentTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6C63FF',
      light: '#A5B4FC',
      dark: '#4F46E5',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6B35',
      light: '#FEB797',
      dark: '#C2410C',
      contrastText: '#FFFFFF',
    },
    success: { main: '#10B981', light: '#D1FAE5', dark: '#065F46' },
    warning: { main: '#F59E0B', light: '#FEF3C7', dark: '#92400E' },
    error: { main: '#EF4444', light: '#FEE2E2', dark: '#991B1B' },
    info: { main: '#3B82F6', light: '#DBEAFE', dark: '#1E3A8A' },
    background: {
      default: '#F5F3FF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F1B4E',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },
  },
  typography: {
    fontFamily: typographyTokens.fontFamily.body,
    h1: { ...typographyTokens.variants.h1, fontFamily: typographyTokens.fontFamily.display },
    h2: { ...typographyTokens.variants.h2, fontFamily: typographyTokens.fontFamily.display },
    h3: { ...typographyTokens.variants.h3, fontFamily: typographyTokens.fontFamily.display },
    h4: { ...typographyTokens.variants.h4, fontFamily: typographyTokens.fontFamily.display },
    h5: { ...typographyTokens.variants.h5 },
    h6: { ...typographyTokens.variants.h6 },
    body1: typographyTokens.variants.body1,
    body2: typographyTokens.variants.body2,
    button: { ...typographyTokens.variants.button, textTransform: 'none' },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 700,
          minHeight: '44px',
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': { boxShadow: '0px 4px 12px rgba(108,99,255,0.3)' },
        },
        contained: { '&:hover': { transform: 'translateY(-1px)' }, transition: 'all 0.2s ease' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0px 4px 16px rgba(108,99,255,0.10)',
          border: '1px solid rgba(108,99,255,0.08)',
          transition: 'all 0.2s ease',
          '&:hover': { boxShadow: '0px 8px 32px rgba(108,99,255,0.18)', transform: 'translateY(-2px)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: '100px', fontWeight: 600 },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: { '& .MuiOutlinedInput-root': { borderRadius: '12px' } },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: '64px',
          borderTop: '1px solid rgba(108,99,255,0.15)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.95)',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          '&.Mui-selected': { color: '#6C63FF' },
          minWidth: '60px',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: '100px', height: '8px' },
        bar: { borderRadius: '100px' },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: { fontWeight: 700 },
      },
    },
  },
})

export default studentTheme
