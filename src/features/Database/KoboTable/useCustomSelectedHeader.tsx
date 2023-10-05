import {ReactNode, useMemo} from 'react'
import {useDatabaseKoboTableContext} from '@/features/Database/KoboTable/DatabaseKoboContext'
import {useI18n} from '@/core/i18n'
import {Enum} from '@alexandreannic/ts-utils'
import {DrcProject} from '@/core/drcUa'
import {AaSelectMultiple} from '@/shared/Select/AaSelectMultiple'
import {KoboAnswerId} from '@/core/sdk/server/kobo/Kobo'
import {AaSelectSingle} from '@/shared/Select/AaSelectSingle'
import {KoboApiSdk} from '@/core/sdk/server/kobo/KoboApiSdk'

export const useCustomSelectedHeader = (selectedIds: KoboAnswerId[]): ReactNode => {
  const ctx = useDatabaseKoboTableContext()
  const {m} = useI18n()
  return useMemo(() => {
    const extra: Record<string, ReactNode> = {
      [KoboApiSdk.koboFormRefs.Prot_CommunityLevelMonito]: (
        <AaSelectSingle
          hideNullOption
          sx={{maxWidth: 200}}
          label={m.project}
          onChange={_ => ctx.asyncUpdateTag.call({answerIds: selectedIds, value: _, key: 'project'})}
          options={Enum.entries(DrcProject).map(([k, v]) => ({value: k, children: v}))}
        />
      ),
      [KoboApiSdk.koboFormRefs.Prot_HHS2]: (
        <AaSelectMultiple
          sx={{maxWidth: 200}}
          defaultValue={[]}
          label={m.project}
          onChange={_ => ctx.asyncUpdateTag.call({answerIds: selectedIds, value: _, key: 'project'})}
          options={Enum.entries(DrcProject).map(([k, v]) => ({value: k, children: v}))}
        />
      )
    }
    return extra[ctx.form.id] ?? []
  }, [selectedIds, ctx.form.id])
}