export { default as studentTheme } from './themes/studentTheme'
export { default as teacherTheme } from './themes/teacherTheme'
export { default as parentTheme } from './themes/parentTheme'
export { default as adminTheme } from './themes/adminTheme'
export { colorTokens } from './tokens/colors'
export { typographyTokens } from './tokens/typography'
export { spacingTokens } from './tokens/spacing'
export { elevationTokens } from './tokens/elevation'

export const getThemeByRole = (role) => {
  const themes = {
    student:      () => import('./themes/studentTheme').then(m => m.default),
    teacher:      () => import('./themes/teacherTheme').then(m => m.default),
    parent:       () => import('./themes/parentTheme').then(m => m.default),
    admin:        () => import('./themes/adminTheme').then(m => m.default),
    school_admin: () => import('./themes/adminTheme').then(m => m.default),
    super_admin:  () => import('./themes/adminTheme').then(m => m.default),
  }
  return themes[role] || themes.admin
}
