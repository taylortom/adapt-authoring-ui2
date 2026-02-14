import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Stack
} from '@mui/material'
import Assets from '../utils/assets'
import Icons from '../utils/icons'

export default function StyledDialog ({ open, onClose, title, children, footer, loading, maxWidth = 'sm', paperSx }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      slotProps={{
        paper: {
          sx: {
            display: 'flex',
            flexDirection: 'column',
            ...paperSx
          }
        }
      }}
    >
      <DialogTitle color='secondary.contrastText' sx={{ flexShrink: 0, p: 2, background: `url(${Assets.Bg})`, backgroundSize: 'cover', boxShadow: '0 4px 8px rgba(0,0,0,0.15)', zIndex: 1, position: 'relative' }}>
        <Stack direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          {title}
          <IconButton onClick={onClose} sx={{ color: 'inherit' }}>
            <Icons.Close />
          </IconButton>
        </Stack>
        {loading && <LinearProgress sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />}
      </DialogTitle>
      <DialogContent sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default', '&.MuiDialogContent-root': { pt: 3 }, '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}>
        {children}
      </DialogContent>
      {footer && (
        <Box sx={{ p: 4, boxShadow: '0 -2px 8px rgba(0,0,0,0.15)' }}>
          {footer}
        </Box>
      )}
    </Dialog>
  )
}
