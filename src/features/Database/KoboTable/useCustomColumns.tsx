import {KoboAnswer, KoboMappedAnswer} from '@/core/sdk/server/kobo/Kobo'
import {currentProtectionProjects, ProtectionHhsTags} from '@/core/sdk/server/kobo/custom/KoboProtection'
import {useMemo} from 'react'
import {useDatabaseKoboTableContext} from '@/features/Database/KoboTable/DatabaseKoboContext'
import {Enum, map} from '@alexandreannic/ts-utils'
import {DrcProject} from '@/core/drcUa'
import {useI18n} from '@/core/i18n'
import {AaSelectMultiple} from '@/shared/Select/AaSelectMultiple'
import {AaSelectSingle} from '@/shared/Select/AaSelectSingle'
import {kobo, KoboIndex} from '@/KoboIndex'
import {SheetColumnProps} from '@/shared/Sheet/util/sheetType'
import {SheetUtils} from '@/shared/Sheet/util/sheetUtils'

export const useCustomColumns = (): SheetColumnProps<KoboMappedAnswer>[] => {
  const ctx = useDatabaseKoboTableContext()
  const {m} = useI18n()
  return useMemo(() => {
    const extra: Record<string, SheetColumnProps<KoboMappedAnswer>[]> = {
      [KoboIndex.byName('protection_communityMonitoring').id]: [
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
          options: () => SheetUtils.buildOptions(Enum.keys(DrcProject), true),
          tooltip: (row: KoboAnswer<any, ProtectionHhsTags>) => row.tags?.project,
          renderValue: (row: KoboAnswer<any, ProtectionHhsTags>) => row.tags?.project ?? SheetUtils.blank,
          // renderValue: (row: KoboMappedAnswer & {tags: ProtHhsTags}) => row.tags?.projects,
          render: (row: KoboAnswer<any, ProtectionHhsTags>) => (
            <AaSelectSingle
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
          options: () => SheetUtils.buildOptions(Enum.keys(DrcProject), true),
          tooltip: (row: KoboAnswer<any, ProtectionHhsTags>) => row.tags?.projects,
          renderValue: (row: KoboAnswer<any, ProtectionHhsTags>) => map(row.tags?.projects, p => p.length === 0 ? undefined : p) ?? [SheetUtils.blank],
          // renderValue: (row: KoboMappedAnswer & {tags: ProtHhsTags}) => row.tags?.projects,
          render: (row: KoboAnswer<any, ProtectionHhsTags>) => (
            <AaSelectMultiple
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