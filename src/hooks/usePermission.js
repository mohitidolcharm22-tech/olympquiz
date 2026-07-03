import { useSelector } from 'react-redux'

/**
 * usePermission — check what the current user is allowed to do.
 *
 * HOW IT WORKS ON THE FRONTEND
 * ─────────────────────────────────────────────────────────────────────────────
 * When the user logs in, the server sends back an access token whose payload
 * contains:  { sub, type, role, permissions: ['quiz:read', 'quiz:create', ...] }
 *
 * The frontend decodes the token (see authSlice — the API returns the user
 * object which includes role). However, since tokens expire in 15 min we store
 * the permissions alongside the user in Redux so they're always accessible
 * without re-decoding the token.
 *
 * USAGE
 * ─────
 *   const { can, role, isStudent } = usePermission()
 *
 *   // Hide a button the user can't use
 *   {can('quiz:create') && <Button>Create Quiz</Button>}
 *
 *   // Role shorthand
 *   {isTeacher && <TeacherPanel />}
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function usePermission() {
  const user = useSelector(s => s.auth.user)
  const role = useSelector(s => s.auth.role)

  /**
   * Check if the current user has a specific permission.
   * Falls back gracefully if permissions aren't loaded yet.
   */
  const can = (permission) => {
    if (!user) return false
    // super_admin always has every permission
    if (role === 'super_admin') return true
    return (user.permissions ?? []).includes(permission)
  }

  /**
   * Check if the user has ALL of the given permissions.
   */
  const canAll = (...permissions) => permissions.every(can)

  /**
   * Check if the user has ANY of the given permissions.
   */
  const canAny = (...permissions) => permissions.some(can)

  return {
    can,
    canAll,
    canAny,
    role,
    // Role shorthands — use these in JSX for readability
    isStudent:    role === 'student',
    isTeacher:    role === 'teacher',
    isParent:     role === 'parent',
    isAdmin:      role === 'admin' || role === 'school_admin' || role === 'super_admin',
    isSuperAdmin: role === 'super_admin',
  }
}
