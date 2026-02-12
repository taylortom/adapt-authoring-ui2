import { useMemo } from 'react'
import { useApiQuery } from '../utils/api'
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

function filterRequiredOnly (schema) {
  if (!schema?.properties || !schema?.required?.length) return schema
  const filtered = { ...schema, properties: {} }
  schema.required.forEach(key => {
    if (schema.properties[key]) {
      filtered.properties[key] = schema.properties[key]
    }
  })
  return filtered
}

const SchemaForm = ({ apiName, uiSchema, dataId, queryString, requiredOnly = false, disableCache = false, onSubmit }) => {
  const cacheOpts = disableCache ? { gcTime: 0, staleTime: 0 } : {}

  const { data: schema, error: schemaError } = useApiQuery(
    apiName,
    (api) => api.getSchema(queryString),
    { key: 'schema', ...cacheOpts }
  )
  const { data, error: dataError } = useApiQuery(
    apiName,
    (api) => api.get(dataId),
    { key: dataId, ...cacheOpts }
  )
  if (dataError ?? schemaError) {
    alert(dataError ?? schemaError)
  }
  if (!schema || !data) {
    return ''
  }

  const processedSchema = useMemo(() => {
    const s = { ...schema, properties: { ...schema.properties } }
    ATTRIBUTE_BLACKLIST.forEach(a => delete s.properties[a])
    return requiredOnly ? filterRequiredOnly(s) : s
  }, [schema, requiredOnly])

  return (
    <Form
      schema={processedSchema}
      uiSchema={uiSchema}
      formData={data}
      validator={validator}
      onSubmit={onSubmit}
    />
  )
}

export default SchemaForm
