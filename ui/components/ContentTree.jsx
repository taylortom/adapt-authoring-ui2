import { useState, useCallback, useMemo } from 'react'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { Box, Typography } from '@mui/material'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable'
import ContentTreeItem from './ContentTreeItem'
import { t } from '../utils/lang'

export default function ContentTree ({
  tree,
  flatMap,
  pluginNames,
  selectedId,
  onSelect,
  onAddChild,
  onDelete,
  onReorder
}) {
  const allItemIds = useMemo(() => {
    const ids = []
    const collect = (nodes) => {
      nodes.forEach(n => {
        ids.push(n._id)
        if (n.children?.length) collect(n.children)
      })
    }
    collect(tree)
    return ids
  }, [tree])

  const [expandedItems, setExpandedItems] = useState(allItemIds)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const handleSelectedItemsChange = useCallback((event, itemId) => {
    if (itemId) onSelect(itemId)
  }, [onSelect])

  const handleExpandedItemsChange = useCallback((event, itemIds) => {
    setExpandedItems(itemIds)
  }, [])

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeItem = flatMap.get(active.id)
    const overItem = flatMap.get(over.id)
    if (!activeItem || !overItem) return
    if (activeItem._parentId !== overItem._parentId) return

    const parent = flatMap.get(activeItem._parentId)
    if (!parent) return

    const siblings = parent.children
    const oldIndex = siblings.findIndex(c => c._id === active.id)
    const newIndex = siblings.findIndex(c => c._id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(siblings, oldIndex, newIndex)
    onReorder(reordered.map((item, index) => ({ _id: item._id, _sortOrder: index + 1 })))
  }, [flatMap, onReorder])

  const renderTree = (nodes) => {
    return nodes.map(node => (
      <ContentTreeItem
        key={node._id}
        item={node}
        pluginNames={pluginNames}
        onAddChild={onAddChild}
        onDelete={onDelete}
      >
        {node.children?.length > 0 ? renderTree(node.children) : null}
      </ContentTreeItem>
    ))
  }

  if (tree.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant='body2' color='text.secondary'>
          {t('app.nocontentitems')}
        </Typography>
      </Box>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={allItemIds} strategy={verticalListSortingStrategy}>
        <Box sx={{ p: 1, overflow: 'auto', maxHeight: 'calc(100vh - 140px)' }}>
          <SimpleTreeView
            selectedItems={selectedId}
            onSelectedItemsChange={handleSelectedItemsChange}
            expandedItems={expandedItems}
            onExpandedItemsChange={handleExpandedItemsChange}
            sx={{
              '& .MuiTreeItem-content': {
                borderRadius: 1
              },
              '& .MuiTreeItem-iconContainer': {
                color: 'secondary.main'
              }
            }}
          >
            {renderTree(tree)}
          </SimpleTreeView>
        </Box>
      </SortableContext>
    </DndContext>
  )
}
