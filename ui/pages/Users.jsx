import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper
} from '@mui/material'
import ListCollection from '../components/ListCollection'
import Icons from '../utils/icons'
import { t } from '../utils/lang'

function UserListItem ({ user, divider }) {
  const roles = Array.isArray(user.roles) ? user.roles.join(', ') : ''
  return (
    <ListItem divider={divider}>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'secondary.main' }}>
          <Icons.Account />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={user.email} secondary={roles} />
    </ListItem>
  )
}

export default function Users () {
  return (
    <ListCollection
      apiRoot='users'
      renderGroup={(_, group, index) => (
        <Paper key={index} sx={{ mb: 3 }}>
          <List disablePadding>
            {group.map((user, i) => (
              <UserListItem key={user._id} user={user} divider={i < group.length - 1} />
            ))}
          </List>
        </Paper>
      )}
      emptyMessage={t('app.nousers')}
      title={t('app.users')}
    />
  )
}
