import Icons from './icons'

const ROLE_CONFIG = {
  superuser: { icon: Icons.SuperAdmin, color: 'error.main' },
  admin: { icon: Icons.Admin, color: 'warning.main' },
  coursecreator: { icon: Icons.CourseCreator, color: 'primary.main' },
  default: { icon: Icons.AuthUser, color: 'secondary.main' }
}

export function getRoleConfig (roles) {
  if (!Array.isArray(roles) || roles.length === 0) return ROLE_CONFIG.default
  for (const key of Object.keys(ROLE_CONFIG)) {
    if (key !== 'default' && roles.some(r => r.shortName === key)) return ROLE_CONFIG[key]
  }
  return ROLE_CONFIG.default
}
