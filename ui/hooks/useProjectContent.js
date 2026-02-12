import { useMemo } from 'react'
import { useApiQuery, useApiMutation } from '../utils/api'

const API_ROOT = 'content'

function buildTree (data) {
  if (!data || !Array.isArray(data)) return { tree: [], flatMap: new Map() }

  const flatMap = new Map()
  data.forEach(item => flatMap.set(item._id, { ...item, children: [] }))

  const roots = []
  flatMap.forEach(item => {
    if (item._type === 'course') {
      roots.push(item)
    } else if (item._parentId && flatMap.has(item._parentId)) {
      flatMap.get(item._parentId).children.push(item)
    }
  })

  const sortChildren = (node) => {
    node.children.sort((a, b) => (a._sortOrder ?? 0) - (b._sortOrder ?? 0))
    node.children.forEach(sortChildren)
  }
  roots.forEach(sortChildren)

  return { tree: roots, flatMap }
}

export function useProjectContent (courseId) {
  const { data, isLoading, error } = useApiQuery(
    API_ROOT,
    (api) => api.query('', { body: { _courseId: courseId } }),
    { key: `project-${courseId}` }
  )

  const { data: pluginsData } = useApiQuery(
    'contentplugins',
    (api) => api.get(),
    { key: 'all' }
  )

  const pluginNames = useMemo(() => {
    const map = new Map()
    if (Array.isArray(pluginsData)) {
      pluginsData.forEach(p => map.set(p.name, p.displayName))
    }
    return map
  }, [pluginsData])

  const { tree, flatMap } = useMemo(() => buildTree(data), [data])

  const addMutation = useApiMutation(API_ROOT, (api, newItem) => api.post(newItem))
  const deleteMutation = useApiMutation(API_ROOT, (api, { _id }) => api.remove(_id))
  const updateMutation = useApiMutation(API_ROOT, (api, { _id, ...body }) => api.patch(_id, body))

  return {
    tree,
    flatMap,
    pluginNames,
    isLoading,
    error,
    addItem: addMutation.mutate,
    deleteItem: deleteMutation.mutate,
    updateItem: updateMutation.mutate,
    isAdding: addMutation.isPending,
    isDeleting: deleteMutation.isPending
  }
}
