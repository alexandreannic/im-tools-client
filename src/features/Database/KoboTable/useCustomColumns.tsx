import {KoboAnswer, KoboMappedAnswer} from '@/core/sdk/server/kobo/Kobo'
import {currentProtectionProjects, ProtectionHhsTags} from '@/core/sdk/server/kobo/custom/KoboProtection'
import {useMemo} from 'react'
import {useDatabaseKoboTableContext} from '@/features/Database/KoboTable/DatabaseKoboContext'
import {Enum} from '@alexandreannic/ts-utils'
import {DrcProject, DrcDonor} from '@/core/drcUa'
import {useI18n} from '@/core/i18n'
import {AaSelectMultiple} from '@/shared/Select/AaSelectMultiple'
import {AaSelectSingle} from '@/shared/Select/AaSelectSingle'
import {kobo} from '@/koboDrcUaFormId'
import {SheetColumnProps} from '@/shared/Sheet/util/sheetType'
import {SheetUtils} from '@/shared/Sheet/util/sheetUtils'
import { ShelterTagValidation} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import { ShelterCashTags } from '@/core/sdk/server/kobo/custom/ShelterCashTags'

export const useCustomColumns = (): SheetColumnProps<KoboMappedAnswer>[] => {
  const ctx = useDatabaseKoboTableContext()
  const {m} = useI18n()
  return useMemo(() => {
    const extra: Record<string, SheetColumnProps<KoboMappedAnswer>[]> = {
      [kobo.drcUa.form.protection_communityMonitoring]: [
        {
          id: 'tags_project',
          head: m.project,
          type: 'select_multiple',
          width: 200,
          options: () => SheetUtils.buildOptions(Enum.keys(DrcProject), true),
          tooltip: (row: KoboAnswer<any, ProtectionHhsTags>) => row.tags?.project,
          renderValue: (row: KoboAnswer<any, ProtectionHhsTags>) => row.tags?.project ?? SheetUtils.blank,
          // renderValue: (row: KoboMappedAnswer & {tags: ProtHhsTags}) => row.tags?.projects,
          render: (row: KoboAnswer<any, ProtectionHhsTags>) => (
            <AaSelectSingle
              hideNullOption
              value={row.tags?.project}
              placeholder={m.project}
              onChange={_ => ctx.asyncUpdateTag.call({answerIds: [row.id], value: _, key: 'project'})}
              options={currentProtectionProjects.map(k => ({value: k, children: k}))}
            />
          )
        }
      ],
      [kobo.drcUa.form.shelter_cash_for_shelter]: [
        {
          id: 'stages_assistance',
          head: m.tagval,
          type: 'select_one',
          width: 200,
          options: () => SheetUtils.buildOptions(Enum.keys(ShelterTagValidation), true),
          tooltip: (row: KoboAnswer<any, ShelterCashTags>) => row.tags?.tagval,
          renderValue: (row: KoboAnswer<any, ShelterCashTags>) => row.tags?.tagval ?? SheetUtils.blank,
          // renderValue: (row: KoboMappedAnswer & {tags: ProtHhsTags}) => row.tags?.projects,
          render: (row: KoboAnswer<any, ShelterCashTags>) => (
            <AaSelectSingle
              hideNullOption
              value={row.tags?.stage}
              placeholder={m.tagval}
              onChange={_ => ctx.asyncUpdateTag.call({answerIds: [row.id], value: _, key: 'stage'})}
              options={Enum.entries(ShelterTagValidation).map(([k, v]) => ({value: k, children: v}))}
            />
          )
        }
      ],
      [kobo.drcUa.form.protection_hhs2_1]: [
        {
          id: 'tags_project',
          head: m.project,
          type: 'select_multiple',
          width: 200,
          options: () => SheetUtils.buildOptions(Enum.keys(DrcProject), true),
          tooltip: (row: KoboAnswer<any, ProtectionHhsTags>) => row.tags?.projects,
          renderValue: (row: KoboAnswer<any, ProtectionHhsTags>) => row.tags?.projects ?? SheetUtils.blank,
          // renderValue: (row: KoboMappedAnswer & {tags: ProtHhsTags}) => row.tags?.projects,
          render: (row: KoboAnswer<any, ProtectionHhsTags>) => (
            <AaSelectMultiple
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
