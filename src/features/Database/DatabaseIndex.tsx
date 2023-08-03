import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {KoboForm} from '@/core/sdk/server/kobo/Kobo'
import {useI18n} from '@/core/i18n'
import {useNavigate} from 'react-router'
import {databaseModule} from '@/features/Database/databaseModule'
import {Page, PageTitle} from '@/shared/Page'

export const DatabaseIndex = ({
  forms,
}: {
  forms?: KoboForm[]
}) => {
  const {formatDate, m} = useI18n()
  const navigate = useNavigate()
  return (
    <Page width="xs">
      {forms && forms.length > 0 && (
        <PageTitle>{m.selectADatabase}</PageTitle>
      )}
      <ScRadioGroup>
        {forms?.map(form =>
          <ScRadioGroupItem
            value={form.id}
            hideRadio={true}
            key={form.id}
            onClick={() => navigate(databaseModule.siteMap.database.absolute(form.serverId, form.id))}
            title={form.name}
            // description={
            //   <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            //     <Box>{form.deployment__submission_count}</Box>
          />
        )}
      </ScRadioGroup>
    </Page>
  )
}
