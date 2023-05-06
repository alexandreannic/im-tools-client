import {ItBtn, BtnProps} from '../Btn/ItBtn'
import {useI18n} from 'core/i18n'

interface Props extends BtnProps {
}

export const StepperActionsNext = ({children, icon, ...props}: Props) => {
  const {m} = useI18n()
  return (
    <ItBtn
      id="btn-submit"
      color="primary"
      variant="contained"
      iconAfter={icon ?? 'keyboard_arrow_right'}
      {...props}
    >
      {children ?? m.next}
    </ItBtn>
  )
}
