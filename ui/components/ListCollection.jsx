import { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography
} from '@mui/material'
import Collection from './Collection'
import SortControls from './SortControls'
import { useApiQuery } from '../utils/api'

const disabledSx = { opacity: 0.5 }

function sortItems (items, field, order) {
  if (!field) return items
  return [...items].sort((a, b) => {
    const aVal = a[field] ?? ''
    const bVal = b[field] ?? ''
    const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal
    return cmp * order
  })
}

function DefaultListItem ({ item, mapItem }) {
  const { icon: Icon, iconColor, primary, secondary, secondaryAction, actions } = mapItem(item)
  const [open, setOpen] = useState(false)
  const hasActions = actions?.length > 0

  const content = (
    <>
      {Icon && (
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: iconColor }}>
            <Icon />
          </Avatar>
        </ListItemAvatar>
      )}
      <ListItemText primary={primary} secondary={secondary} />
    </>
  )

  return (
    <Box sx={item.disabled ? disabledSx : undefined}>
      <ListItem secondaryAction={secondaryAction} disablePadding={hasActions}>
        {hasActions
          ? <ListItemButton onClick={() => setOpen(!open)}>{content}</ListItemButton>
          : content}
      </ListItem>
      {hasActions && (
        <Collapse in={open} timeout='auto' unmountOnExit>
          <Stack direction='row' spacing='1px'>
            {actions.map((action, i) => {
              const ActionIcon = action.icon
              return (
                <Button
                  key={i}
                  variant='contained'
                  endIcon={ActionIcon && <ActionIcon />}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  color={action.color ?? 'primary'}
                  sx={{ borderRadius: 0, flex: 1 }}
                >
                  {action.label}
                </Button>
              )
            })}
          </Stack>
        </Collapse>
      )}
    </Box>
  )
}

export default function ListCollection ({
  apiRoot,
  queryFn,
  queryKey,
  sortOptions = [],
  defaultSort,
  groupBy,
  groupOrder = [],
  groupLabel,
  renderGroup,
  mapItem,
  transformData,
  emptyMessage,
  title,
  crumbs,
  dial,
  sidebarItems,
  fullWidth,
  links,
  actions,
  subtitle
}) {
  const [sortField, setSortField] = useState(defaultSort?.field ?? '')
  const [sortOrder, setSortOrder] = useState(defaultSort?.order ?? -1)

  const { data, isLoading, error } = useApiQuery(
    apiRoot,
    queryFn ?? ((api) => api.get()),
    queryKey ? { key: queryKey } : {}
  )

  const rawItems = Array.isArray(data) ? data : []
  const transformed = transformData ? transformData(rawItems) : rawItems
  const items = sortField ? sortItems(transformed, sortField, sortOrder) : transformed

  const grouped = groupBy ? Object.groupBy(items, groupBy) : null

  const handleSortFieldChange = (_, value) => {
    if (value === null) return
    setSortField(value)
  }

  const handleToggleSortOrder = () => {
    setSortOrder(prev => prev === 1 ? -1 : 1)
  }

  const sortControls = sortOptions.length > 0
    ? <SortControls sortField={sortField} sortOrder={sortOrder} sortOptions={sortOptions} onSortFieldChange={handleSortFieldChange} onToggleSortOrder={handleToggleSortOrder} />
    : null

  return (
    <Collection
      items={items}
      isLoading={isLoading}
      error={error}
      emptyMessage={emptyMessage}
      title={title}
      subtitle={subtitle}
      crumbs={crumbs}
      dial={dial}
      sidebarItems={sidebarItems}
      fullWidth={fullWidth}
      links={links}
      actions={actions}
      headerControls={sortControls}
    >
      {grouped && renderGroup
        ? groupOrder.map(key => {
          const group = grouped[key]
          if (!group?.length) return null
          return renderGroup(key, group)
        })
        : grouped && mapItem
          ? groupOrder.map(key => {
            const group = grouped[key]
            if (!group?.length) return null
            return (
              <Paper key={key} id={key} sx={{ mb: 3 }}>
                {groupLabel && (
                  <Typography variant='subtitle1' sx={{ px: 2, pt: 2, pb: 1 }}>
                    {groupLabel(key)}
                  </Typography>
                )}
                <List disablePadding>
                  {group.map(item => (
                    <DefaultListItem key={item._id} item={item} mapItem={mapItem} />
                  ))}
                </List>
              </Paper>
            )
          })
          : mapItem
            ? (
              <Paper>
                <List disablePadding>
                  {items.map(item => (
                    <DefaultListItem key={item._id} item={item} mapItem={mapItem} />
                  ))}
                </List>
              </Paper>
              )
            : renderGroup?.(null, items)}
    </Collection>
  )
}
