import { Alert, Box, CircularProgress } from '@mui/material'
import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ContentTree from '../components/ContentTree'
import Page from '../components/Page'
import SchemaForm from '../components/SchemaForm'
import { useProjectContent } from '../hooks/useProjectContent'
import { getAllowedChildTypes } from '../utils/contentTypes'
import Icons from '../utils/icons'
import { t } from '../utils/lang'

export default function Project () {
  const { id: courseId } = useParams()
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(courseId)
  const [requiredOnly] = useState(true)

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

  const course = tree.find(t => t._type === 'course')
  const selectedItem = flatMap.get(selectedId)
  const courseTitle = course.displayTitle || course.title
  const itemTitle = selectedItem._type !== 'course' ? (selectedItem?.displayTitle || selectedItem?.title) : undefined
  const pageTitle = t('app.edittype', { type: selectedItem._type !== 'component' ? t(`app.${selectedItem._type}`) : pluginNames.get(selectedItem._component) })

  return (
    <Page 
      title={pageTitle}
      subtitle={itemTitle}
      crumbs={[
        { label: t('app.projects'), href: '/' },
        { label: courseTitle }
      ]}
      actions={[
        {
          icon: Icons.Save,
          color: 'primary',
          handleClick: () => {
            document.querySelector('.project-schema-form form')?.requestSubmit()
          }
        }
      ]}
      sidebarItems={[
        { type: 'button', label: t('app.preview'), handleClick: () => {} },
        { type: 'button', style: 'secondary', label: t('app.export'), handleClick: () => {} },
        { type: 'spacer' },
        { type: 'link', label: 'Extensions', icon: Icons.AdaptExtension, handleClick: () => navigate(`/project/${courseId}/extensions`) },
        { type: 'link', label: 'Theme', icon: Icons.AdaptTheme, handleClick: () => {} },
        { type: 'link', label: 'Menu', icon: Icons.AdaptMenu, handleClick: () => {} },
        { type: 'spacer' },
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
        }
      ]}>
      {selectedItem
        ? (
          <Box className='project-schema-form'>
            <SchemaForm
              key={selectedId}
              apiName='content'
              dataId={selectedId}
              queryString={`_type=${selectedItem._type}&_courseId=${courseId}`}
              requiredOnly={requiredOnly}
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
