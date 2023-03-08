import {Box} from '@mui/material'
import {useI18n} from 'core/i18n'
import {Btn} from '../Btn/Btn'
import {useStepperContext} from './Stepper'
import {StepperActionsNext} from './StepperActionsNext'

interface Props {
  hideNext?: boolean
  hidePrev?: boolean
  loadingNext?: boolean
  disableNext?: boolean
  loadingPrev?: boolean
  nextButtonLabel?: string
  nextIcon?: string,
  next?: (next: () => void) => void
  prev?: (prev: () => void) => void
}

export const StepperActions = ({
  disableNext,
  nextButtonLabel,
  nextIcon,
  hidePrev,
  hideNext,
  loadingNext,
  loadingPrev,
  next,
  prev
}: Props) => {
  const {m} = useI18n()
  const _stepper = useStepperContext()
  return (
    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3}}>
      {_stepper.currentStep > 0 && !hidePrev && (
        <Btn loading={loadingPrev} sx={{marginRight: 'auto'}} onClick={prev ? () => prev(_stepper.prev) : _stepper.prev} color="primary" icon="keyboard_arrow_left">
          {m.previous}
        </Btn>
      )}
      {!hideNext && (
        <StepperActionsNext
          disabled={disableNext}
          icon={nextIcon}
          loading={loadingNext}
          sx={{marginLeft: 'auto'}}
          onClick={next ? () => next(_stepper.next) : _stepper.next}
          children={nextButtonLabel}
        />
      )}
    </Box>
  )
}
