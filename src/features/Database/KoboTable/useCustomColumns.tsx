import {KoboAnswer, KoboMappedAnswer} from '@/core/sdk/server/kobo/Kobo'
import {currentProtectionProjects, ProtectionHhsTags} from '@/core/sdk/server/kobo/custom/KoboProtection'
import {useMemo} from 'react'
import {useDatabaseKoboTableContext} from '@/features/Database/KoboTable/DatabaseKoboContext'
import {SheetColumnProps, SheetUtils} from '@/shared/Sheet/Sheet'
import {Enum} from '@alexandreannic/ts-utils'
import {DrcProject} from '@/core/drcUa'
import {useI18n} from '@/core/i18n'
import {AaSelectMultiple} from '@/shared/Select/AaSelectMultiple'
import {AaSelectSingle} from '@/shared/Select/AaSelectSingle'
import {kobo} from '@/koboDrcUaFormId'

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
          renderValue: (row: KoboAnswer<any, ProtectionHhsTags>) => row.tags?.project ?? SheetUtils.blankValue,
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
      [kobo.drcUa.form.protection_hhs2_1]: [
        {
          id: 'tags_project',
          head: m.project,
          type: 'select_multiple',
          width: 200,
          options: () => SheetUtils.buildOptions(Enum.keys(DrcProject), true),
          tooltip: (row: KoboAnswer<any, ProtectionHhsTags>) => row.tags?.projects,
          renderValue: (row: KoboAnswer<any, ProtectionHhsTags>) => row.tags?.projects ?? SheetUtils.blankValue,
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