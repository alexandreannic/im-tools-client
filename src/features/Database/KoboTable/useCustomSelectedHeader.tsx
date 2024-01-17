import {ReactNode, useMemo} from 'react'
import {useDatabaseKoboTableContext} from '@/features/Database/KoboTable/DatabaseKoboContext'
import {useI18n} from '@/core/i18n'
import {IpSelectMultiple} from '@/shared/Select/IpSelectMultiple'
import {KoboAnswerId} from '@/core/sdk/server/kobo/Kobo'
import {IpSelectSingle} from '@/shared/Select/IpSelectSingle'
import {currentProtectionProjects} from '@/core/sdk/server/kobo/custom/KoboProtection'
import {kobo, KoboIndex} from '@/KoboIndex'

export const useCustomSelectedHeader = (selectedIds: KoboAnswerId[]): ReactNode => {
  const ctx = useDatabaseKoboTableContext()
  const {m} = useI18n()
  return useMemo(() => {
    const extra: Record<string, ReactNode> = {
      // [KoboIndex.byName('ecrec_cashRegistration').id]: {
      //   return (
      //
      //   )
      // },
      [KoboIndex.byName('protection_communityMonitoring').id]: (
        <IpSelectSingle
          hideNullOption
          sx={{maxWidth: 200}}
          label={m.project}
          onChange={_ => ctx.asyncUpdateTag.call({answerIds: selectedIds, value: _, key: 'project'})}
          options={currentProtectionProjects.map(k => ({value: k, children: k}))}
        />
      ),
      [KoboIndex.byName('protection_hhs2_1').id]: (
        <IpSelectMultiple
          sx={{maxWidth: 200}}
          defaultValue={[]}
          label={m.project}
          onChange={_ => ctx.asyncUpdateTag.call({answerIds: selectedIds, value: _, key: 'projects'})}
          options={currentProtectionProjects.map(k => ({value: k, children: k}))}
        />
      )
    }
    return extra[ctx.form.id] ?? []
  }, [selectedIds, ctx.form.id])
}