import ListCollection from '../components/ListCollection'
import Icons from '../utils/icons'
import { useApiQuery } from '../utils/api'
import { t } from '../utils/lang'

const ROLE_CONFIG = {
  superuser: { icon: Icons.SuperAdmin, color: 'error.main' },
  admin: { icon: Icons.Admin, color: 'warning.main' },
  coursecreator: { icon: Icons.CourseCreator, color: 'primary.main' },
  default: { icon: Icons.AuthUser, color: 'secondary.main' }
}

function getRoleConfig (roles) {
  if (!Array.isArray(roles) || roles.length === 0) return ROLE_CONFIG.default
  for (const key of Object.keys(ROLE_CONFIG)) {
    if (key !== 'default' && roles.some(r => r.shortName === key)) return ROLE_CONFIG[key]
  }
  return ROLE_CONFIG.default
}

export default function Users () {
  const { data: rolesData } = useApiQuery('roles', (api) => api.get())

  const roleMap = new Map()
  const roleResults = Array.isArray(rolesData) ? rolesData : rolesData?.results ?? []
  roleResults.forEach(r => roleMap.set(r._id, r))

  return (
    <ListCollection
      apiRoot='users'
      transformData={(users) =>
        users.map(user => ({
          ...user,
          roles: (user.roles || []).map(id => roleMap.get(id)),
          disabled: user.isEnabled === false
        }))}
      mapItem={(user) => {
        const config = getRoleConfig(user.roles)
        return {
          icon: config.icon,
          iconColor: config.color,
          primary: user.email,
          secondary: user.roles.map(r => r.displayName).join(', ')
        }
      }}
      emptyMessage={t('app.nousers')}
      title={t('app.users')}
    />
  )
}
