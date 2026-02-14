import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  Grid,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import Icons from '../utils/icons'
import Page from './Page'
import SchemaForm from './SchemaForm'
import StyledDialog from './StyledDialog'

function PathSelection ({ paths, onSelect }) {
  return (
    <Stack direction='row' spacing={3} sx={{ justifyContent: 'center', alignItems: 'stretch', p: 4 }}>
      {paths.map((path) => {
        const Icon = path.icon
        return (
          <Card key={path.key} sx={{ flex: 1, maxWidth: 280 }}>
            <CardActionArea onClick={() => onSelect(path.key)} sx={{ height: '100%', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                {Icon && <Icon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />}
                <Typography variant='h6' gutterBottom>{path.label}</Typography>
                <Typography variant='body2' color='text.secondary'>{path.description}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        )
      })}
    </Stack>
  )
}

function WizardNav ({ steps, activeStep, setActiveStep, isLast, onComplete }) {
  return (
    <Stack direction='row' spacing={5} sx={{ alignItems: 'center' }}>
      <Button disabled={activeStep === 0} onClick={() => setActiveStep(s => s - 1)}>Back</Button>
      <Stepper
        activeStep={activeStep}
        sx={{
           flex: 1,
          '& .MuiStepLabel-label': { '&.Mui-active': { color: 'primary.main' }, '&.Mui-completed': { color: 'primary.main' } },
          '& .MuiStepIcon-root': { '&.Mui-active': { color: 'primary.main' }, '&.Mui-completed': { color: 'primary.main' } },
        }}
      >
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Button
        variant='contained'
        onClick={isLast ? onComplete : () => setActiveStep(s => s + 1)}>
      {isLast ? 'Finish' : 'Next'}
      </Button>
    </Stack>
  )
}

function WizardSelect ({ items, value, onChange, multiple }) {
  const selected = multiple ? (value ?? []) : value
  const handleClick = (key) => {
    if (multiple) {
      onChange(selected.includes(key) ? selected.filter(k => k !== key) : [...selected, key])
    } else {
      onChange(key)
    }
  }
  return (
    <Grid container spacing={2}>
      {items.map(item => {
        const isSelected = multiple ? selected.includes(item.key) : selected === item.key
        const Icon = item.icon
        return (
          <Grid key={item.key} size={{ xs: 6, sm: 4 }}>
            <Card sx={{ border: 2, borderColor: isSelected ? 'primary.main' : 'transparent', bgcolor: isSelected ? 'primary.main' : undefined, color: isSelected ? 'primary.contrastText' : undefined, height: '100%' }}>
              <CardActionArea onClick={() => handleClick(item.key)} sx={{ p: 2, height: '100%' }}>
                <CardContent>
                  {Icon && <Icon sx={{ fontSize: 36, color: isSelected ? 'inherit' : 'primary.main', mb: 1 }} />}
                  <Typography variant='subtitle1'>{item.label}</Typography>
                  {item.description && <Typography variant='body2' sx={{ color: isSelected ? 'inherit' : 'text.secondary', textAlign: 'left', opacity: isSelected ? 0.85 : 1 }}>{item.description}</Typography>}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}

function WizardLoading ({ message }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 3 }}>
      <CircularProgress />
      {message && <Typography color='text.secondary'>{message}</Typography>}
    </Box>
  )
}

function StepContent ({ step, stepState, onStepStateChange }) {
  switch (step.type) {
    case 'form':
      return (
        <SchemaForm
          apiName={step.apiName}
          queryString={step.queryString}
          formData={stepState ?? {}}
          onChange={({ formData }) => onStepStateChange(formData)}
          fields={step.fields}
          disablePaper
        />
      )
    case 'select':
      return (
        <WizardSelect
          items={step.items}
          value={stepState}
          onChange={onStepStateChange}
          multiple={step.multiple}
        />
      )
    case 'loading':
      return <WizardLoading message={step.message} />
    case 'custom':
      return step.content
    default:
      return step.content ?? null
  }
}

function IntroDialog ({ open, onClose, content }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { bgcolor: 'transparent', boxShadow: 'none' } } }}
    >
      {content}
    </Dialog>
  )
}

export default function Wizard ({ steps = [], paths, open, onClose, onComplete, onPathChange, variant = 'dialog', crumbs }) {
  const [activeStep, setActiveStep] = useState(0)
  const [selectedPath, setSelectedPath] = useState(null)
  const [stepData, setStepData] = useState({})

  useEffect(() => {
    if (open) {
      setActiveStep(0)
      setSelectedPath(null)
      setStepData({})
    }
  }, [open])

  const handleSelectPath = (key) => {
    setSelectedPath(key)
    setActiveStep(0)
    onPathChange?.(key)
  }

  const showPathSelection = paths && selectedPath === null
  const activeSteps = paths ? (paths.find(p => p.key === selectedPath)?.steps ?? []) : steps
  const isLast = activeStep === activeSteps.length - 1

  const showWizard = !showPathSelection && activeSteps.length > 0

  const handleComplete = () => onComplete?.(stepData)

  const navProps = { steps: activeSteps, activeStep, setActiveStep, isLast, onComplete: handleComplete }

  const currentStep = activeSteps[activeStep]
  const stepContent = currentStep
    ? <StepContent step={currentStep} stepState={stepData[currentStep.key ?? activeStep]} onStepStateChange={(val) => setStepData(prev => ({ ...prev, [currentStep.key ?? activeStep]: val }))} />
    : null

  if (variant === 'page') {
    return (
      <Page
        title={currentStep?.title}
        crumbs={crumbs}
        actions={[{
          icon: Icons.Close,
          color: 'error',
          handleClick: onClose
        }]}
      >
        <Container maxWidth='md'>
          {stepContent}
          {showWizard && <WizardNav {...navProps} />}
        </Container>
      </Page>
    )
  }

  return (
    <>
      {showPathSelection && (
        <IntroDialog
          open={open}
          onClose={onClose}
          content={<PathSelection paths={paths} onSelect={handleSelectPath} />}
        />
      )}
      {showWizard && (
        <StyledDialog
          open={open}
          onClose={onClose}
          title={currentStep?.title ?? currentStep?.label}
          paperSx={{ width: 900, height: 700, maxWidth: 900, maxHeight: 700 }}
          footer={
            <Box sx={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
              <WizardNav {...navProps} />
            </Box>
          }
        >
          {stepContent}
        </StyledDialog>
      )}
    </>
  )
}
