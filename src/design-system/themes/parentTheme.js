import { createTheme } from '@mui/material/styles'
import { typographyTokens } from '../tokens/typography'

// ============================================================
// Parent Theme - Informative & Warm
// ============================================================
const parentTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0F766E',
      light: '#5EEAD4',
      dark: '#134E4A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#7C3AED',
      light: '#C4B5FD',
      dark: '#5B21B6',
      contrastText: '#FFFFFF',
    },
    success: { main: '#10B981', light: '#D1FAE5', dark: '#065F46' },
    warning: { main: '#F59E0B', light: '#FEF3C7', dark: '#92400E' },
    error: { main: '#EF4444', light: '#FEE2E2', dark: '#991B1B' },
    info: { main: '#3B82F6', light: '#DBEAFE', dark: '#1E3A8A' },
    background: {
      default: '#F0FDFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0C1618',
      secondary: '#4B5563',
      disabled: '#9CA3AF',
    },
  },
  typography: {
    fontFamily: typographyTokens.fontFamily.body,
    h1: { ...typographyTokens.variants.h1, fontFamily: typographyTokens.fontFamily.display },
    h2: { ...typographyTokens.variants.h2, fontFamily: typographyTokens.fontFamily.display },
    h3: { ...typographyTokens.variants.h3, fontFamily: typographyTokens.fontFamily.display },
    h4: { ...typographyTokens.variants.h4 },
    h5: { ...typographyTokens.variants.h5 },
    h6: { ...typographyTokens.variants.h6 },
    body1: typographyTokens.variants.body1,
    body2: typographyTokens.variants.body2,
    button: { ...typographyTokens.variants.button, textTransform: 'none' },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 700,
          minHeight: '44px',
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0px 4px 16px rgba(15,118,110,0.10)',
          border: '1px solid rgba(15,118,110,0.08)',
          '&:hover': { boxShadow: '0px 8px 24px rgba(15,118,110,0.18)' },
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: { '& .MuiOutlinedInput-root': { borderRadius: '10px' } },
      },
    },
  },
})

export default parentTheme
