import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Stack,
  Typography
} from '@mui/material'
import GridCollection from '../components/GridCollection'
import { t } from '../utils/lang'
import Icons from '../utils/icons'

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

export default function Assets () {
  return (
    <GridCollection
      apiRoot='assets'
      queryBody={{}}
      sortOptions={[
        { value: 'title', icon: Icons.SortByAlpha },
        { value: 'updatedAt', icon: Icons.Schedule }
      ]}
      selectable={true}
      defaultSort={{ field: 'updatedAt', order: -1 }}
      pageSizeOptions={[12, 24, 48]}
      gridMinWidth={200}
      renderItem={(item) => <AssetCard asset={item} />}
      title={t('app.assets')}
      dial={{
        label: 'asset actions',
        actions: [{ icon: Icons.Add, label: t('app.uploadasset') }]
      }}
      sidebarItems={[{
        type: 'button',
        label: t('app.uploadasset'),
        handleClick: () => {} 
      }]}
    />
  )
}
