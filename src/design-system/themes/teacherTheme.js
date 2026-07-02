import { createTheme } from '@mui/material/styles'
import { typographyTokens } from '../tokens/typography'

// ============================================================
// Teacher Theme - Professional & Clean
// ============================================================
const teacherTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E40AF',
      light: '#93C5FD',
      dark: '#1E3A8A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#059669',
      light: '#6EE7B7',
      dark: '#065F46',
      contrastText: '#FFFFFF',
    },
    success: { main: '#10B981', light: '#D1FAE5', dark: '#065F46' },
    warning: { main: '#F59E0B', light: '#FEF3C7', dark: '#92400E' },
    error: { main: '#EF4444', light: '#FEE2E2', dark: '#991B1B' },
    info: { main: '#3B82F6', light: '#DBEAFE', dark: '#1E3A8A' },
    background: {
      default: '#EFF6FF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      disabled: '#94A3B8',
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
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          minHeight: '40px',
          boxShadow: 'none',
          '&:hover': { boxShadow: '0px 4px 12px rgba(30,64,175,0.25)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #E2E8F0',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0F172A',
          color: '#F1F5F9',
          borderRight: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: { '& .MuiOutlinedInput-root': { borderRadius: '8px' } },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          border: '1px solid',
          fontWeight: 500,
        },
        standardSuccess: {
          backgroundColor: '#D1FAE5',
          borderColor: '#6EE7B7',
          color: '#065F46',
          '& .MuiAlert-icon': { color: '#10B981' },
        },
        standardError: {
          backgroundColor: '#FEE2E2',
          borderColor: '#FCA5A5',
          color: '#991B1B',
          '& .MuiAlert-icon': { color: '#EF4444' },
        },
        standardWarning: {
          backgroundColor: '#FEF3C7',
          borderColor: '#FCD34D',
          color: '#92400E',
          '& .MuiAlert-icon': { color: '#F59E0B' },
        },
        standardInfo: {
          backgroundColor: '#DBEAFE',
          borderColor: '#93C5FD',
          color: '#1E3A8A',
          '& .MuiAlert-icon': { color: '#3B82F6' },
        },
      },
    },
  },
})

export default teacherTheme
