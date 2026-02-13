import { useMemo } from 'react'
import { Paper } from '@mui/material'
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

function hasRequiredFields (prop) {
  if (prop.required?.length) return true
  if (prop.properties) {
    return Object.values(prop.properties).some(hasRequiredFields)
  }
  return false
}

function filterRequiredOnly (schema) {
  if (!schema?.properties) return schema
  const requiredKeys = new Set(schema.required ?? [])
  const filtered = { ...schema, properties: {} }
  Object.entries(schema.properties).forEach(([key, prop]) => {
    if (requiredKeys.has(key) || hasRequiredFields(prop)) {
      filtered.properties[key] = prop
    }
  })
  return filtered
}

const SchemaForm = ({ apiName, uiSchema, dataId, queryString, requiredOnly = false, disableCache = false, onSubmit }) => {
  const cacheOpts = disableCache ? { gcTime: 0, staleTime: 0 } : {}

  const { data: schema, error: schemaError } = useApiQuery(
    apiName,
    (api) => api.getSchema(queryString),
    { key: `schema-${queryString}`, ...cacheOpts }
  )
  const { data, error: dataError } = useApiQuery(
    apiName,
    (api) => api.get(dataId),
    { key: dataId, ...cacheOpts }
  )
  const processedSchema = useMemo(() => {
    if (!schema) return null
    const s = { ...schema, properties: { ...schema.properties } }
    ATTRIBUTE_BLACKLIST.forEach(a => delete s.properties[a])
    if (!requiredOnly) return s
    const filtered = filterRequiredOnly(s)
    return Object.keys(filtered.properties).length > 0 ? filtered : s
  }, [schema, requiredOnly])

  if (dataError ?? schemaError) {
    alert(dataError ?? schemaError)
  }
  if (!processedSchema || !data) {
    return ''
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Form
        schema={processedSchema}
        uiSchema={uiSchema}
        formData={data}
        validator={validator}
        onSubmit={onSubmit}
      />
    </Paper>
  )
}

export default SchemaForm
