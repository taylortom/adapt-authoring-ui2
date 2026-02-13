import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography
} from '@mui/material'
import Collection from '../components/Collection'
import { t } from '../utils/lang'
import Icons from '../utils/icons'

function AssetCard ({ asset }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea>
        {asset.hasThumb
          ? (
            <CardMedia
              component='img'
              height='140'
              image={`/api/assets/serve/${asset._id}?thumb=true`}
              alt={asset.title}
              sx={{ bgcolor: 'grey.200', objectFit: 'contain' }}
            />
            )
          : (
            <CardMedia
              sx={{ height: 140, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icons.Page sx={{ fontSize: 48, color: 'grey.500' }} />
            </CardMedia>
            )}
        <CardContent>
          <Typography variant='subtitle1' color='secondary' align='center' noWrap>{asset.title}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default function Assets () {
  const crumbs = [
    { label: t('app.projects'), href: '/' },
    { label: t('app.assets') }
  ]
  const dial = {
    label: 'asset actions',
    actions: [
      { icon: Icons.Add, label: t('app.uploadasset') }
    ]
  }
  const sidebarItems = [
    { type: 'button', label: t('app.uploadasset'), handleClick: () => {} }
  ]

  return (
    <Collection
      apiRoot='assets'
      queryBody={{}}
      sortOptions={[
        { value: 'filename', label: t('app.filename') },
        { value: 'updatedAt', label: t('app.lastupdated') }
      ]}
      defaultSort={{ field: 'updatedAt', order: -1 }}
      defaultPageSize={24}
      pageSizeOptions={[12, 24, 48]}
      gridMinWidth={200}
      renderItem={(item) => <AssetCard asset={item} />}
      title={t('app.assets')}
      crumbs={crumbs}
      dial={dial}
      sidebarItems={sidebarItems}
      fullWidth
    />
  )
}
