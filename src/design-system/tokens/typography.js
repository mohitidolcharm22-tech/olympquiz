// ============================================================
// OlympQuiz Design System - Typography Tokens
// ============================================================

export const typographyTokens = {
  fontFamily: {
    display: '"Poppins", "Nunito", sans-serif',
    body: '"Nunito", "Poppins", sans-serif',
    mono: '"Fira Code", "Courier New", monospace',
  },

  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    md: '1.125rem',   // 18px
    lg: '1.25rem',    // 20px
    xl: '1.5rem',     // 24px
    '2xl': '1.875rem',// 30px
    '3xl': '2.25rem', // 36px
    '4xl': '3rem',    // 48px
    '5xl': '3.75rem', // 60px
  },

  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  lineHeight: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  letterSpacing: {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // MUI-compatible variant scale
  variants: {
    h1: { fontSize: '3rem', fontWeight: 800, lineHeight: 1.2 },
    h2: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.25 },
    h3: { fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.3 },
    h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.35 },
    h5: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
    body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.5 },
    overline: { fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.5, letterSpacing: '0.1em' },
    button: { fontSize: '0.875rem', fontWeight: 700, lineHeight: 1.75, letterSpacing: '0.02em' },
  },
}

export default typographyTokens
