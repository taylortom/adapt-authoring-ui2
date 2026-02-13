import Collection from './Collection'
import { useApiQuery } from '../utils/api'

export default function ListCollection ({
  apiRoot,
  queryFn,
  queryKey,
  groupBy,
  groupOrder = [],
  renderGroup,
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
  const { data, isLoading, error } = useApiQuery(
    apiRoot,
    queryFn ?? ((api) => api.get()),
    queryKey ? { key: queryKey } : {}
  )

  const rawItems = Array.isArray(data) ? data : []
  const items = transformData ? transformData(rawItems) : rawItems

  const grouped = groupBy ? Object.groupBy(items, groupBy) : null

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
    >
      {grouped && renderGroup
        ? groupOrder.map(key => {
          const group = grouped[key]
          if (!group?.length) return null
          return renderGroup(key, group)
        })
        : items.map((item, index) => renderGroup(null, [item], index))}
    </Collection>
  )
}
