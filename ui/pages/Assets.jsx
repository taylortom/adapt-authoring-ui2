import {
  Box,
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

function AssetDetailDialog ({ asset, onClose }) {
  const { icon: Icon, color } = asset ? getAssetTypeConfig(asset.type) : {}

  const footer = asset && (
    <Stack spacing={0.5}>
      {asset.description && (
        <Typography variant='body2' color='text.secondary'>{asset.description}</Typography>
      )}
      <Typography variant='caption' color='text.secondary'>
        {t('app.type')}: {asset.type}
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
  )

  return (
    <StyledDialog open={Boolean(asset)} onClose={onClose} title={asset?.title} footer={footer}>
      {asset && (asset.hasThumb || asset.type === 'image'
        ? (
          <Paper
            component='img'
            src={`/api/assets/serve/${asset._id}${asset.hasThumb ? '?thumb=true' : ''}`}
            alt={asset.title}
            sx={{ height: 300, objectFit: 'contain', display: 'block', mx: 'auto' }}
          />
          )
        : (
          <Box sx={{ height: 200, bgcolor: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon sx={{ fontSize: 64, color: '#fff' }} />
          </Box>
          )
      )}
    </StyledDialog>
  )
}

export default function Assets () {
  const [selectedAsset, setSelectedAsset] = useState(null)

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
          handleClick: () => {}
        }]}
      />
      <AssetDetailDialog asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
    </>
  )
}
