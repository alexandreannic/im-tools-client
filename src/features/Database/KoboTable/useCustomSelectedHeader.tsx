import {ReactNode, useMemo} from 'react'
import {useDatabaseKoboTableContext} from '@/features/Database/KoboTable/DatabaseKoboContext'
import {useI18n} from '@/core/i18n'
import {AaSelectMultiple} from '@/shared/Select/AaSelectMultiple'
import {KoboAnswerId} from '@/core/sdk/server/kobo/Kobo'
import {AaSelectSingle} from '@/shared/Select/AaSelectSingle'
import {projects} from '@/core/sdk/server/kobo/custom/KoboProtHhs'
import {kobo} from '@/koboDrcUaFormId'

export const useCustomSelectedHeader = (selectedIds: KoboAnswerId[]): ReactNode => {
  const ctx = useDatabaseKoboTableContext()
  const {m} = useI18n()
  return useMemo(() => {
    const extra: Record<string, ReactNode> = {
      [kobo.drcUa.form.protection_communityMonitoring]: (
        <AaSelectSingle
          hideNullOption
          sx={{maxWidth: 200}}
          label={m.project}
          onChange={_ => ctx.asyncUpdateTag.call({answerIds: selectedIds, value: _, key: 'project'})}
          options={projects.map(k => ({value: k, children: k}))}
        />
      ),
      [kobo.drcUa.form.protection_hhs2_1]: (
        <AaSelectMultiple
          sx={{maxWidth: 200}}
          defaultValue={[]}
          label={m.project}
          onChange={_ => ctx.asyncUpdateTag.call({answerIds: selectedIds, value: _, key: 'projects'})}
          options={projects.map(k => ({value: k, children: k}))}
        />
      )
    }
    return extra[ctx.form.id] ?? []
  }, [selectedIds, ctx.form.id])
}