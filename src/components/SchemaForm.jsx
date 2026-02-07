import React from 'react'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'

const SchemaForm = ({ schema, uiSchema, formData, onSubmit }) => {
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      formData={formData}
      validator={validator}
      onSubmit={onSubmit}
    />
  )
}

export default SchemaForm
