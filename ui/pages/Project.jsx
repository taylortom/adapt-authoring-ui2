import { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Alert, Box, CircularProgress } from '@mui/material'
import Page from '../components/Page'
import SchemaForm from '../components/SchemaForm'
import ContentTree from '../components/ContentTree'
import Icons from '../utils/icons'
import { useProjectContent } from '../hooks/useProjectContent'
import { getAllowedChildTypes } from '../utils/contentTypes'
import { t } from '../utils/lang'

export default function Project () {
  const { id: courseId } = useParams()
  const [selectedId, setSelectedId] = useState(courseId)

  const {
    tree,
    flatMap,
    pluginNames,
    isLoading,
    error,
    addItem,
    deleteItem,
    updateItem
  } = useProjectContent(courseId)

  const handleSelect = useCallback((itemId) => {
    setSelectedId(itemId)
  }, [])

  const handleAddChild = useCallback((parentItem) => {
    const allowedTypes = getAllowedChildTypes(parentItem._type)
    if (allowedTypes.length === 0) return
    const childType = allowedTypes[0]
    const siblingCount = parentItem.children?.length ?? 0
    addItem({
      _type: childType,
      _parentId: parentItem._id,
      _courseId: courseId,
      _sortOrder: siblingCount + 1,
      title: `New ${childType}`
    })
  }, [courseId, addItem])

  const handleDelete = useCallback((item) => {
    if (!window.confirm(`Delete "${item.title || item._type}"?`)) return
    deleteItem({ _id: item._id })
    if (selectedId === item._id) setSelectedId(courseId)
  }, [courseId, selectedId, deleteItem])

  const handleReorder = useCallback((reorderedItems) => {
    reorderedItems.forEach(({ _id, _sortOrder }) => {
      updateItem({ _id, _sortOrder })
    })
  }, [updateItem])

  const handleSubmit = useCallback(({ formData }) => {
    if (!selectedId) return
    updateItem({ _id: selectedId, ...formData })
  }, [selectedId, updateItem])

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='50vh'>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert severity='error'>{error.message}</Alert>
  }

  const selectedItem = flatMap.get(selectedId)
  const courseTitle = tree[0]?.displayTitle || tree[0]?.title || t('app.project')
  const pageTitle = t(`app.${selectedItem._type}`) + ': ' + (selectedItem?.displayTitle || selectedItem?.title || courseTitle)

  const crumbs = [
    { label: t('app.dashboard'), href: '/' },
    { label: t('app.projects'), href: '/projects' },
    { label: courseTitle }
  ]

  const actions = [
    {
      icon: Icons.Save,
      color: 'primary',
      handleClick: () => {
        document.querySelector('.project-schema-form form')?.requestSubmit()
      }
    }
  ]

  const sidebarItems = [
    { type: 'heading', label: t('app.coursestructure') },
    {
      type: 'custom',
      content: (
        <ContentTree
          tree={tree}
          flatMap={flatMap}
          pluginNames={pluginNames}
          selectedId={selectedId}
          onSelect={handleSelect}
          onAddChild={handleAddChild}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      )
    },
    { type: 'divider' },
    { type: 'link', label: 'Theme', icon: Icons.AdaptTheme, handleClick: () => {} },
    { type: 'link', label: 'Menu', icon: Icons.AdaptMenu, handleClick: () => {} },
  ]

  return (
    <Page title={pageTitle} crumbs={crumbs} actions={actions} sidebarItems={sidebarItems}>
      {selectedItem
        ? (
          <Box className='project-schema-form'>
            <SchemaForm
              key={selectedId}
              apiName='content'
              dataId={selectedId}
              queryString={`_type=${selectedItem._type}&_courseId=${courseId}`}
              onSubmit={handleSubmit}
            />
          </Box>
          )
        : (
          <Alert severity='info'>{t('app.selectitem')}</Alert>
          )}
    </Page>
  )
}
