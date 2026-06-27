import { createTheme } from '@mui/material/styles'
import { typographyTokens } from '../tokens/typography'

// ============================================================
// Admin Theme - Enterprise & Structured
// ============================================================
const adminTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E293B',
      light: '#475569',
      dark: '#0F172A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#3B82F6',
      light: '#93C5FD',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF',
    },
    success: { main: '#10B981', light: '#D1FAE5', dark: '#065F46' },
    warning: { main: '#F59E0B', light: '#FEF3C7', dark: '#92400E' },
    error: { main: '#EF4444', light: '#FEE2E2', dark: '#991B1B' },
    info: { main: '#3B82F6', light: '#DBEAFE', dark: '#1E3A8A' },
    background: {
      default: '#F1F5F9',
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
    h3: { ...typographyTokens.variants.h3 },
    h4: { ...typographyTokens.variants.h4 },
    h5: { ...typographyTokens.variants.h5 },
    h6: { ...typographyTokens.variants.h6 },
    body1: typographyTokens.variants.body1,
    body2: typographyTokens.variants.body2,
    button: { ...typographyTokens.variants.button, textTransform: 'none' },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          textTransform: 'none',
          fontWeight: 600,
          minHeight: '36px',
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0px 1px 4px rgba(0,0,0,0.08)',
          border: '1px solid #E2E8F0',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0F172A',
          color: '#CBD5E1',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          '& .MuiDataGrid-columnHeaders': { backgroundColor: '#F8FAFC' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: { '& .MuiOutlinedInput-root': { borderRadius: '6px' } },
      },
    },
  },
})

export default adminTheme
