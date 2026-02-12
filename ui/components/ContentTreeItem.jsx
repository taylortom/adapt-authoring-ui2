import { useState } from 'react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Icons from '../utils/icons'
import { getContentTypeIcon, getAllowedChildTypes } from '../utils/contentTypes'
import { t } from '../utils/lang'

export default function ContentTreeItem ({ item, onAddChild, onDelete, children }) {
  const [hovered, setHovered] = useState(false)
  const TypeIcon = getContentTypeIcon(item._type)
  const canAddChildren = getAllowedChildTypes(item._type).length > 0
  const isCourse = item._type === 'course'

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item._id, disabled: isCourse })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div ref={setNodeRef} style={style}>
      <TreeItem
        itemId={item._id}
        label={
          <Box
            sx={{ display: 'flex', alignItems: 'center', py: 0.5, gap: 1 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {!isCourse && (
              <Icons.DragHandle
                sx={{ fontSize: 16, cursor: 'grab', color: 'text.disabled' }}
                {...listeners}
                {...attributes}
              />
            )}
            <TypeIcon sx={{ fontSize: 18, color: 'primary.main' }} />
            <Typography variant='body2' noWrap sx={{ flex: 1 }}>
              {item.title || item.displayTitle || t(`app.${item._type}`)}
            </Typography>
            {hovered && (
              <Box sx={{ display: 'flex', gap: 0.25, ml: 'auto' }}>
                {canAddChildren && (
                  <Tooltip title={t('app.add')}>
                    <IconButton
                      size='small'
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
    </div>
  )
}
