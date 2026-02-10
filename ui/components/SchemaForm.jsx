import { useApi } from '../utils/api'
import { useQuery } from '@tanstack/react-query'
import Form from '@rjsf/mui'
import validator from '@rjsf/validator-ajv8'

const ATTRIBUTE_BLACKLIST = [
  '_colorLabel',
  '_component',
  '_componentType',
  '_courseId',
  '_enabledPlugins',
  '_hasPreview',
  '_id',
  '_isSelected',
  '_latestTrackingId',
  '_layout',
  '_menu',
  '_parentId',
  '_sortOrder',
  '_supportedLayout',
  '_theme',
  '_themePreset',
  '_trackingId',
  '_type',
  'createdAt',
  'createdBy',
  'layoutOptions',
  'menuSettings',
  'themeSettings',
  'themeVariables',
  'updatedAt',
  'userGroups'
]

const SchemaForm = ({ apiName, uiSchema, dataId, queryString, disableCache = false, onSubmit }) => {
  const api = useApi(apiName)
  const cacheOpts = disableCache ? { gcTime: 0, staleTime: 0 } : {}

  const { data: schema, error: schemaError } = useQuery({
    queryKey: [apiName, 'schema'],
    queryFn: () => api.getSchema(queryString),
    ...cacheOpts
  })
  const { data, error: dataError } = useQuery({
    queryKey: [apiName, 'schema'],
    queryFn: () => api.get(dataId),
    ...cacheOpts
  })
  if (dataError ?? schemaError) {
    alert(dataError ?? schemaError)
  }
  if (!schema || !data) {
    return ''
  }
  ATTRIBUTE_BLACKLIST.forEach(a => delete schema.properties[a])

  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      formData={data}
      validator={validator}
      onSubmit={onSubmit}
    />
  )
}

export default SchemaForm
