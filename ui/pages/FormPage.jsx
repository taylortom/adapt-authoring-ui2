import CheckIcon from '@mui/icons-material/Check'
import Page from '../components/Page'
import SchemaForm from 'adapt-authoring-ui2/ui/components/SchemaForm'
import { t } from '../utils/lang'

function FormPage () {
  const _courseId = '697cbec62b258a7de1022d65'
  const handleSubmit = () => {
    alert(t('app.submit'))
  }
  const actions = [
    { icon: CheckIcon, color: 'primary' }
  ]
  return (
    <Page title={t('app.formexample')} actions={actions}>
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
