import { useApi } from '../utils/api'
import { useQuery } from '@tanstack/react-query'
import Form from '@rjsf/mui'
import validator from '@rjsf/validator-ajv8'

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
