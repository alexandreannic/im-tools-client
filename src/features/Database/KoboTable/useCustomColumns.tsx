import {KoboAnswer, KoboMappedAnswer} from '@/core/sdk/server/kobo/Kobo'
import {currentProtectionProjects, ProtectionHhsTags} from '@/core/sdk/server/kobo/custom/KoboProtection'
import {useMemo} from 'react'
import {useDatabaseKoboTableContext} from '@/features/Database/KoboTable/DatabaseKoboContext'
import {map, Obj} from '@alexandreannic/ts-utils'
import {DrcProject} from '@/core/type/drc'
import {useI18n} from '@/core/i18n'
import {IpSelectMultiple} from '@/shared/Select/SelectMultiple'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {KoboIndex} from '@/core/KoboIndex'
import {SheetColumnProps} from '@/shared/Sheet/util/sheetType'
import {SheetUtils} from '@/shared/Sheet/util/sheetUtils'
import {EcrecCashRegistrationTags} from '@/core/sdk/server/kobo/custom/KoboEcrecCashRegistration'
import {Ecrec_sectoralCashRegistration} from '@/core/sdk/server/kobo/generatedInterface/Ecrec_sectoralCashRegistration'
import {CashStatus, SelectCashStatus} from '@/shared/customInput/SelectCashStatus'

export const useCustomColumns = (): SheetColumnProps<KoboMappedAnswer>[] => {
  const ctx = useDatabaseKoboTableContext()
  const {m} = useI18n()
  return useMemo(() => {
    const extra: Record<string, SheetColumnProps<any>[]> = {
      [KoboIndex.byName('ecrec_cashRegistration').id]: [
        {
          id: 'status',
          head: m.status,
          type: 'select_one',
          width: 120,
          options: () => SheetUtils.buildOptions(Obj.keys(CashStatus), true),
          renderValue: (row: KoboAnswer<Ecrec_sectoralCashRegistration.T, EcrecCashRegistrationTags>) => row.tags?.status!,
          render: (row: KoboAnswer<Ecrec_sectoralCashRegistration.T, EcrecCashRegistrationTags>) => (
            <SelectCashStatus
              disabled={!ctx.canEdit}
              value={row.tags?.status}
              placeholder={m.project}
              onChange={_ => ctx.asyncUpdateTag.call({answerIds: [row.id], value: _, key: 'status'})}
            />
          )
        }
      ],
      [KoboIndex.byName('protection_communityMonitoring').id]: [
        {
          id: 'tags_project',
          head: m.project,
          type: 'select_multiple',
          width: 200,
          options: () => SheetUtils.buildOptions(Obj.keys(DrcProject), true),
          tooltip: (row: KoboAnswer<any, ProtectionHhsTags>) => row.tags?.project,
          renderValue: (row: KoboAnswer<any, ProtectionHhsTags>) => row.tags?.project ?? SheetUtils.blank,
          // renderValue: (row: KoboMappedAnswer & {tags: ProtHhsTags}) => row.tags?.projects,
          render: (row: KoboAnswer<any, ProtectionHhsTags>) => (
            <IpSelectSingle
              disabled={!ctx.canEdit}
              hideNullOption
              value={row.tags?.project}
              placeholder={m.project}
              onChange={_ => ctx.asyncUpdateTag.call({answerIds: [row.id], value: _, key: 'project'})}
              options={currentProtectionProjects.map(k => ({value: k, children: k}))}
            />
          )
        }
      ],
      [KoboIndex.byName('shelter_north').id]: [
        {
          id: 'tags_project',
          head: m.project,
          type: 'select_multiple',
          width: 200,
          options: () => SheetUtils.buildOptions(Obj.keys(DrcProject), true),
          tooltip: (row: KoboAnswer<any, ProtectionHhsTags>) => row.tags?.project,
          renderValue: (row: KoboAnswer<any, ProtectionHhsTags>) => row.tags?.project ?? SheetUtils.blank,
          // renderValue: (row: KoboMappedAnswer & {tags: ProtHhsTags}) => row.tags?.projects,
          render: (row: KoboAnswer<any, ProtectionHhsTags>) => (
            <IpSelectSingle
              hideNullOption
              disabled={!ctx.canEdit}
              value={row.tags?.project}
              placeholder={m.project}
              onChange={_ => ctx.asyncUpdateTag.call({answerIds: [row.id], value: _, key: 'project'})}
              options={currentProtectionProjects.map(k => ({value: k, children: k}))}
            />
          )
        }
      ],
      [KoboIndex.byName('protection_hhs2_1').id]: [
        {
          id: 'tags_project',
          head: m.project,
          type: 'select_multiple',
          width: 200,
          options: () => SheetUtils.buildOptions(Obj.keys(DrcProject), true),
          tooltip: (row: KoboAnswer<any, ProtectionHhsTags>) => row.tags?.projects,
          renderValue: (row: KoboAnswer<any, ProtectionHhsTags>) => map(row.tags?.projects, p => p.length === 0 ? undefined : p) ?? [SheetUtils.blank],
          // renderValue: (row: KoboMappedAnswer & {tags: ProtHhsTags}) => row.tags?.projects,
          render: (row: KoboAnswer<any, ProtectionHhsTags>) => (
            <IpSelectMultiple
              disabled={!ctx.canEdit}
              value={row.tags?.projects ?? []}
              onChange={_ => ctx.asyncUpdateTag.call({answerIds: [row.id], value: _, key: 'projects'})}
              options={currentProtectionProjects.map(k => ({value: k, children: k}))}
            />
          )
        }
      ]
    }
    return extra[ctx.form.id] ?? []
  }, [ctx.form.id])
}