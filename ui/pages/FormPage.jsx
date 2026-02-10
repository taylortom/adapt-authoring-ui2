import CheckIcon from '@mui/icons-material/Check'
import Page from '../components/Page'
import SchemaForm from 'adapt-authoring-ui2/ui/components/SchemaForm'

function FormPage () {
  const _courseId = '697cbec62b258a7de1022d65'
  const handleSubmit = () => {
    alert('Submit!')
  }
  const actions = [
    { icon: CheckIcon, color: 'primary' }
  ]
  return (
    <Page title='Form example' actions={actions}>
      <SchemaForm
        apiName='content'
        dataId={_courseId}
        queryString={`_type=course&_courseId=${_courseId}`}
        handleSubmit={handleSubmit}
      />
    </Page>
  )
}

export default FormPage
