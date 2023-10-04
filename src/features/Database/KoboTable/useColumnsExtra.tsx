import {KoboAnswer, KoboMappedAnswer} from '@/core/sdk/server/kobo/Kobo'
import {ProtHhsTags} from '@/core/sdk/server/kobo/custom/KoboProtHhs'
import {useMemo} from 'react'
import {useDatabaseKoboTableContext} from '@/features/Database/KoboTable/DatabaseKoboContext'
import {SheetColumnProps, SheetUtils} from '@/shared/Sheet/Sheet'
import {Enum} from '@alexandreannic/ts-utils'
import {DrcProject} from '@/core/drcUa'
import {useI18n} from '@/core/i18n'
import {AaSelectMultiple} from '@/shared/Select/AaSelectMultiple'

export const useExtraColumns = (): SheetColumnProps<KoboMappedAnswer>[] => {
  const ctx = useDatabaseKoboTableContext()
  const {m} = useI18n()
  return useMemo(() => {
    const extra: Record<string, SheetColumnProps<KoboMappedAnswer>[]> = {
      'aQDZ2xhPUnNd43XzuQucVR': [
        {
          id: 'project',
          head: m.project,
          type: 'select_multiple',
          width: 200,
          options: () => SheetUtils.buildOptions(Enum.keys(DrcProject), true),
          renderValue: (row: KoboAnswer<any, ProtHhsTags>) => row.tags?.projects,
          // renderValue: (row: KoboMappedAnswer & {tags: ProtHhsTags}) => row.tags?.projects,
          render: (row: KoboAnswer<any, ProtHhsTags>) => (
            <>
              {/*{JSON.stringify(row.tags.projects)}*/}
              <AaSelectMultiple
                defaultValue={row.tags.projects ?? []}
                onChange={_ => ctx.asyncUpdateTag.call({answerId: row.id, value: _, key: 'projects'})}
                options={Enum.entries(DrcProject).map(([k, v]) => ({value: k, children: v}))}
              />
            </>
          )
        }
      ]
    }
    return extra[ctx.form.id] ?? []
  }, [ctx.form.id])
}