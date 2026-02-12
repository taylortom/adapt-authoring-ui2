import { useState } from 'react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Icons from '../utils/icons'
import { getContentTypeIcon, getContentTypeIconColour, getAllowedChildTypes } from '../utils/contentTypes'
import { t } from '../utils/lang'

export default function ContentTreeItem ({ item, pluginNames, onAddChild, onDelete, children }) {
  const [hovered, setHovered] = useState(false)
  const TypeIcon = getContentTypeIcon(item._type)
  const iconColour = getContentTypeIconColour(item._type)
  const canAddChildren = getAllowedChildTypes(item._type).length > 0
  const isCourse = item._type === 'course'
  const title = item._type === 'component' && item._component
    ? pluginNames?.get(item._component) ?? item._component
    : t(`app.${item._type}`)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item._id, disabled: isCourse })

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <TreeItem
      itemId={item._id}
      label={
        <Box
          ref={setNodeRef}
          style={dragStyle}
          sx={{ display: 'flex', alignItems: 'center', py: 0.5, gap: 1 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {!isCourse && (
            <Box
              component='span'
              sx={{ display: 'inline-flex', cursor: 'grab' }}
              {...listeners}
              {...attributes}
            >
              <Icons.DragHandle sx={{ fontSize: 16, color: 'primary.main' }} />
            </Box>
          )}
          <TypeIcon sx={{ fontSize: 18, color: iconColour }} />
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography variant='body2' noWrap sx={{ color: 'secondary.main' }}>
              {title}
            </Typography>
            {(item.displayTitle || item.title) && (
              <Typography variant='caption' noWrap sx={{ color: 'secondary.main', display: 'block' }}>
                {item.displayTitle || item.title}
              </Typography>
            )}
          </Box>
          {hovered && (
            <Box sx={{ display: 'flex', gap: 0.25, ml: 'auto' }}>
              {canAddChildren && (
                <Tooltip title={t('app.add')}>
                  <IconButton
                    size='small'
                    color='primary'
                    onClick={(e) => { e.stopPropagation(); onAddChild(item) }}
                    sx={{ p: 0.25 }}
                  >
                    <Icons.Add sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
              {!isCourse && (
                <Tooltip title={t('app.delete')}>
                  <IconButton
                    size='small'
                    color='primary'
                    onClick={(e) => { e.stopPropagation(); onDelete(item) }}
                    sx={{ p: 0.25 }}
                  >
                    <Icons.Delete sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
        </Box>
      }
    >
      {children}
    </TreeItem>
  )
}
