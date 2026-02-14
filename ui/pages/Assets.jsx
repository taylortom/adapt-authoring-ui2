import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Paper,
  Stack,
  Typography
} from '@mui/material'
import { useCallback, useState } from 'react'
import GridCollection from '../components/GridCollection'
import SchemaForm from '../components/SchemaForm'
import StyledDialog from '../components/StyledDialog'
import Icons from '../utils/icons'
import { t } from '../utils/lang'

const ASSET_TYPE_CONFIG = {
  image: { icon: Icons.Image, color: 'success.main' },
  video: { icon: Icons.Video, color: 'error.main' },
  audio: { icon: Icons.Audio, color: 'warning.main' },
  other: { icon: Icons.Page, color: 'info.main' }
}

function getAssetTypeConfig (type) {
  return ASSET_TYPE_CONFIG[type] ?? ASSET_TYPE_CONFIG.other
}

function AssetCard ({ asset }) {
  const { icon: Icon, color } = getAssetTypeConfig(asset.type)
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea>
        {asset.hasThumb || asset.type === 'image'
          ? (
            <CardMedia
              component='img'
              height='140'
              image={`/api/assets/serve/${asset._id}${asset.hasThumb ? '?thumb=true' : ''}`}
              alt={asset.title}
            />
            )
          : (
            <CardMedia
              sx={{ height: 140, bgcolor: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon sx={{ fontSize: 48, color: '#fff' }} />
            </CardMedia>
            )}
        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
          <Stack direction='row' spacing={0.5} sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <Icon sx={{ fontSize: 16, color }} />
            <Typography variant='subtitle2' noWrap>{asset.title}</Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

function AssetFormDialog ({ asset, open, onClose }) {
  const isEdit = Boolean(asset)
  const { icon: Icon, color } = isEdit ? getAssetTypeConfig(asset.type) : {}
  const [isDirty, setIsDirty] = useState(false)

  const handleClose = useCallback(() => {
    setIsDirty(false)
    onClose()
  }, [onClose])

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      title={asset?.title ?? t('app.uploadnewasset')}
      maxWidth='md'
      footer={isDirty
        ? (
          <Stack direction='row' sx={{ justifyContent: 'flex-end' }}>
            <Button variant='contained' startIcon={<Icons.Save />} onClick={() => {}}>
              {t('app.save')}
            </Button>
          </Stack>
          )
        : undefined}
    >
      {open && (
        <Stack direction='row' spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Stack sx={{ flex: '0 0 300px' }} spacing={2}>
            {isEdit
              ? (asset.hasThumb || asset.type === 'image'
                  ? (
                    <Paper
                      component='img'
                      src={`/api/assets/serve/${asset._id}${asset.hasThumb ? '?thumb=true' : ''}`}
                      alt={asset.title}
                      sx={{ width: '100%', objectFit: 'contain', display: 'block' }}
                    />
                    )
                  : (
                    <Box sx={{ height: 200, bgcolor: color, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1 }}>
                      <Icon sx={{ fontSize: 64, color: '#fff' }} />
                    </Box>
                    )
                )
              : (
                <Button
                  component='label'
                  variant='outlined'
                  startIcon={<Icons.Upload />}
                  sx={{ height: 200 }}
                >
                  {t('app.choosefile')}
                  <input type='file' hidden />
                </Button>
                )}
            {isEdit && (
              <Paper sx={{ p: 2 }}>
                <Stack spacing={0.5}>
                  <Typography variant='caption' color='text.secondary'>
                    {t('app.type')}: {asset.subtype.toUpperCase()} {asset.type}
                  </Typography>
                  {asset.size && (
                    <Typography variant='caption' color='text.secondary'>
                      {t('app.filesize')}: {(asset.size / 1024).toFixed(1)} KB
                    </Typography>
                  )}
                  {asset.updatedAt && (
                    <Typography variant='caption' color='text.secondary'>
                      {t('app.lastupdated')}: {new Date(asset.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </Typography>
                  )}
                </Stack>
              </Paper>
            )}
          </Stack>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <SchemaForm
              apiName='assets'
              {...(isEdit ? { dataId: asset._id } : {})}
              fields={['title', 'description', 'url', 'tags']}
              onDirtyChange={setIsDirty}
              disablePaper
            />
          </Box>
        </Stack>
      )}
    </StyledDialog>
  )
}

export default function Assets () {
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [uploadOpen, setUploadOpen] = useState(false)

  const handleClick = useCallback((item) => {
    setSelectedAsset(item)
  }, [])

  return (
    <>
      <GridCollection
        apiRoot='assets'
        queryBody={{}}
        sortOptions={[
          { value: 'title', icon: Icons.SortByAlpha },
          { value: 'updatedAt', icon: Icons.Schedule }
        ]}
        onClick={handleClick}
        defaultSort={{ field: 'updatedAt', order: -1 }}
        pageSizeOptions={[12, 24, 48]}
        gridMinWidth={200}
        renderItem={(item) => <AssetCard asset={item} />}
        title={t('app.assets')}
        sidebarItems={[{
          type: 'button',
          label: t('app.uploadnewasset'),
          handleClick: () => setUploadOpen(true)
        }]}
      />
      <AssetFormDialog asset={selectedAsset} open={Boolean(selectedAsset)} onClose={() => setSelectedAsset(null)} />
      <AssetFormDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </>
  )
}
