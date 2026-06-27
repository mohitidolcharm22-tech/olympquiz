// ============================================================
// OlympQuiz Design System - Elevation Tokens
// ============================================================

export const elevationTokens = {
  shadows: {
    none: 'none',
    xs: '0px 1px 2px rgba(0,0,0,0.08)',
    sm: '0px 2px 4px rgba(0,0,0,0.08)',
    md: '0px 4px 12px rgba(0,0,0,0.10)',
    lg: '0px 8px 24px rgba(0,0,0,0.12)',
    xl: '0px 16px 40px rgba(0,0,0,0.14)',
    '2xl': '0px 24px 64px rgba(0,0,0,0.16)',
    card: '0px 4px 16px rgba(108,99,255,0.12)',
    cardHover: '0px 8px 32px rgba(108,99,255,0.20)',
    colored: (color) => `0px 8px 24px ${color}40`,
  },

  borderRadius: {
    none: '0px',
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    full: '9999px',
    // Component-specific
    card: '16px',
    button: '12px',
    chip: '100px',
    avatar: '50%',
    input: '12px',
    modal: '20px',
  },

  borders: {
    none: 'none',
    xs: '1px solid',
    sm: '1.5px solid',
    md: '2px solid',
    lg: '3px solid',
    xl: '4px solid',
  },

  zIndex: {
    hide: -1,
    base: 0,
    raised: 1,
    dropdown: 10,
    sticky: 20,
    overlay: 30,
    modal: 40,
    toast: 50,
    tooltip: 60,
  },
}

export default elevationTokens
