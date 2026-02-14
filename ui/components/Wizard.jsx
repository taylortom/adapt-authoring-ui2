import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Step,
  StepLabel,
  Stepper
} from '@mui/material'
import Page from './Page'
import Icons from '../utils/icons'

function WizardNav ({ steps, activeStep, setActiveStep, isLast, onComplete }) {
  return (
    <>
      <Stepper activeStep={activeStep} sx={{ px: 3, py: 2 }}>
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Stack direction='row' spacing={1} sx={{ justifyContent: 'flex-end', px: 3, pb: 2 }}>
        <Button disabled={activeStep === 0} onClick={() => setActiveStep(s => s - 1)}>Back</Button>
        {isLast
          ? <Button variant='contained' onClick={onComplete}>Finish</Button>
          : <Button variant='contained' onClick={() => setActiveStep(s => s + 1)}>Next</Button>}
      </Stack>
    </>
  )
}

export default function Wizard ({ steps = [], title, open, onClose, onComplete, variant = 'dialog', crumbs }) {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (open) setActiveStep(0)
  }, [open])

  const isLast = activeStep === steps.length - 1
  const navProps = { steps, activeStep, setActiveStep, isLast, onComplete }

  if (variant === 'page') {
    return (
      <Page
        title={title}
        crumbs={crumbs}
        actions={[{
          icon: Icons.CloseSidebar,
          color: 'default',
          handleClick: onClose
        }]}
      >
        <Container maxWidth='md'>
          {steps[activeStep]?.content}
          <WizardNav {...navProps} />
        </Container>
      </Page>
    )
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <Box sx={{ border: 4, borderColor: 'secondary.main', borderRadius: 1 }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {title}
          <Button onClick={onClose} variant='outlined' size='small' startIcon={<Icons.CloseSidebar />}>
            Close
          </Button>
        </DialogTitle>
        <DialogContent>
          {steps[activeStep]?.content}
        </DialogContent>
        <WizardNav {...navProps} />
      </Box>
    </Dialog>
  )
}
