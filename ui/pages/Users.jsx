import ListCollection from '../components/ListCollection'
import { useApiQuery } from '../utils/api'
import { t } from '../utils/lang'
import { getRoleConfig } from '../utils/roles'

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
          secondary: [
            user.roles.map(r => r.displayName).join(', '),
            user.authType,
            user.lastAccessed && `Last active: ${new Date(user.lastAccessed).toLocaleDateString()}`
          ].filter(Boolean).join(' · ')
        }
      }}
      emptyMessage={t('app.nousers')}
      title={t('app.users')}
    />
  )
}
