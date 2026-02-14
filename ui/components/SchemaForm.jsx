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

const SchemaForm = ({ apiName, uiSchema, dataId, queryString, formData: externalFormData, onChange, fields, requiredOnly = false, disableCache = false, onSubmit, disablePaper = false }) => {
  const cacheOpts = disableCache ? { gcTime: 0, staleTime: 0 } : {}

  const { data: schema, error: schemaError } = useApiQuery(
    apiName,
    (api) => api.getSchema(queryString),
    { key: `schema-${queryString}`, ...cacheOpts }
  )
  const { data: fetchedData, error: dataError } = useApiQuery(
    apiName,
    (api) => api.get(dataId),
    { key: dataId, enabled: !!dataId, ...cacheOpts }
  )
  const formData = dataId ? fetchedData : (externalFormData ?? {})

  const processedSchema = useMemo(() => {
    if (!schema) return null
    const s = { ...schema, properties: { ...schema.properties } }
    ATTRIBUTE_BLACKLIST.forEach(a => delete s.properties[a])
    if (fields) {
      const allowed = new Set(fields)
      Object.keys(s.properties).forEach(k => { if (!allowed.has(k)) delete s.properties[k] })
    }
    if (!requiredOnly) return s
    const filtered = filterRequiredOnly(s)
    return Object.keys(filtered.properties).length > 0 ? filtered : s
  }, [schema, requiredOnly, fields])

  if (dataError ?? schemaError) {
    alert(dataError ?? schemaError)
  }
  if (!processedSchema || (dataId && !fetchedData)) {
    return ''
  }

  const form = (
    <Form
      schema={processedSchema}
      uiSchema={{ "ui:submitButtonOptions": { norender: true }, ...uiSchema }}
      formData={formData}
      onChange={onChange}
      validator={validator}
    />
  )

  if (disablePaper) return form

  return <Paper sx={{ p: 4 }}>{form}</Paper>
}

export default SchemaForm
