import {Panel, PanelProps} from '../../shared/Panel/Panel'
import {PanelBody} from '../../shared/Panel'

export const DashboardPanel = ({savableAsImg = true, expendable = true, children, ...props}: PanelProps) => {
  return (
    <Panel {...props} savableAsImg={savableAsImg} expendable={expendable}>
      <PanelBody>{children}</PanelBody>
    </Panel>
  )
}