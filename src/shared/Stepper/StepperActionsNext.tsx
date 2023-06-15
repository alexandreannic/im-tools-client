import {AaBtn, AaBtnProps} from '../Btn/AaBtn'
import {useI18n} from '@/core/i18n'

interface Props extends AaBtnProps {
}

export const StepperActionsNext = ({children, icon, ...props}: Props) => {
  const {m} = useI18n()
  return (
    <AaBtn
      id="btn-submit"
      color="primary"
      variant="contained"
      iconAfter={icon ?? 'keyboard_arrow_right'}
      {...props}
    >
      {children ?? m.next}
    </AaBtn>
  )
}
