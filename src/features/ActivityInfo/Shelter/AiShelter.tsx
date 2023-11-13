import React, {useEffect, useState} from 'react'
import {Page} from '@/shared/Page'
import {Panel} from '@/shared/Panel'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {Utils} from '@/utils/utils'
import {fnSwitch, map, seq} from '@alexandreannic/ts-utils'
import {ShelterProgress, ShelterTaPriceLevel} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {AaInput} from '@/shared/ItInput/AaInput'
import {format, subMonths} from 'date-fns'
import {Period, PeriodHelper} from '@/core/type'
import {AiTypeSnfiRmm} from '@/features/ActivityInfo/Shelter/AiTypeSnfiRmm'
import {Sheet} from '@/shared/Sheet/Sheet'
import {useI18n} from '@/core/i18n'
import {getAiLocation} from '@/features/ActivityInfo/Protection/aiProtectionGeneralMapper'
import {AAIconBtn} from '@/shared/IconBtn'
import {AIPreviewActivity, AIPreviewRequest, AIViewAnswers} from '@/features/ActivityInfo/shared/ActivityInfoActions'
import {AiShelterData} from '@/features/ActivityInfo/Shelter/aiShelterData'
import {ShelterEntity} from '@/core/sdk/server/shelter/ShelterEntity'
import {ActivityInfoSdk} from '@/core/sdk/server/activity-info/ActiviftyInfoSdk'
import {AaBtn} from '@/shared/Btn/AaBtn'
import {useAaToast} from '@/core/useToast'
import {useAsync} from '@/alexlib-labo/useAsync'

export const AiShelter = () => {
  const {api} = useAppSettings()
  const {toastHttpError} = useAaToast()
  const req = (period: Period) => api.shelter.search(period).then(_ => seq(_.data).compactBy('nta').compactBy('ta').map(x => ({...x, ...getAiLocation(x.nta)}))).then(res => {
    const formatted: {
      all: ShelterEntity[],
      activity: AiTypeSnfiRmm.Type,
      request: any,
    }[] = []
    let index = 0
    Utils.groupBy({
      data: res,
      groups: [
        {by: _ => _.ta?.tags?.project!},
        {by: _ => _.Oblast!},
        {by: _ => _.Raion!},
        {by: _ => _.Hromada!},
        // {by: _ => _.}
        {
          by: row => {
            if (row.ta?._priceLevel)
              return fnSwitch(row.ta?._priceLevel, {
                [ShelterTaPriceLevel.Heavy]: ShelterTaPriceLevel.Medium,
              }, _ => _)
            return map(row.nta?.total_apt_damage ?? row.nta?.total_damage, _ => {
              if (+_ < 6) return ShelterTaPriceLevel.Light
              return ShelterTaPriceLevel.Medium
            })!
          },
        },
        {
          by: row => {
            const x: AiTypeSnfiRmm.Opt<'Implementation status'> = (row.ta?.tags?.progress! === ShelterProgress.RepairWorksCompleted)
              ? 'Complete'
              : 'Ongoing'
            return x
          }
        },
        {
          by: row => fnSwitch(row.nta?.ben_det_res_stat!, {
            idp: 'IDPs',
            ret: 'Returnees',
          }, () => 'Non-Displaced') as AiTypeSnfiRmm.Opt<'Population Group'>
        }
      ],
      finalTransform: (grouped, [project, oblast, raion, hromada, damageLevel, complete, status]) => {
        // TODO NOT EVERYTHING IN AGE GROUP
        // const persons = grouped.flatMap(_ => _.nta?.hh_char_hh_det?.map(_ => Person.create({
        //   age: _.hh_char_hh_det_age,
        //   gender: fnSwitch(_.hh_char_hh_det_gender!, {
        //     male: Gender.Male,
        //     female: Gender.Female,
        //   }, () => Gender.Other)
        // }))).compact().compactBy('age')
        const indicator = grouped.sum(_ => _.nta?.ben_det_hh_size ?? 0)
        const planCode = AiShelterData.planCode[project]
        const validPlanCode = !!AiTypeSnfiRmm.options['Plan Code'][planCode]
        const activity: AiTypeSnfiRmm.Type = {
          'SNFI indictors': fnSwitch(damageLevel, {
            [ShelterTaPriceLevel.Light]: 'light_repair',
            [ShelterTaPriceLevel.Medium]: 'medium_repair',
            [ShelterTaPriceLevel.Heavy]: 'medium_repair',
          }, () => undefined),
          'Implementing Partner': 'Danish Refugee Council',
          'Report to a planned project': validPlanCode ? 'Yes' : 'No',
          ...(validPlanCode ? {'Plan Code': planCode} : {}),
          // 'Plan Code': AiShelterData.planCode[project],
          'Reporting Partner': 'Danish Refugee Council',
          'Oblast': oblast,
          'Raion': raion,
          'Hromada': hromada,
          'Implementation status': complete,
          'Reporting Date (YYYY-MM-DD)': format(period.end, 'yyyy-MM-dd'),
          // 'Population Group': status,
          'Indicator Value (HHs reached, buildings, etc.)': indicator,
          // '# Individuals Reached': persons.length,
          // 'Girls (0-17)': persons.count(_ => _.age < 18 && _.gender === Gender.Female),
          // 'Boys (0-17)': persons.count(_ => _.age < 18 && _.gender === Gender.Male),
          // 'Women (18-59)': persons.count(_ => _.age >= 18 && _.age < 60 && _.gender === Gender.Female),
          // 'Men (18-59)': persons.count(_ => _.age >= 18 && _.age < 60 && _.gender === Gender.Male),
          // 'Elderly Women (60+)': persons.count(_ => _.age >= 60 && _.gender === Gender.Female),
          // 'Elderly Men (60+)': persons.count(_ => _.age >= 60 && _.gender === Gender.Male),
          // 'People with disability': 0,
        }
        formatted.push({
          all: grouped.map(_ => _.nta),
          activity,
          request: ActivityInfoSdk.makeRecordRequest({
            activity: AiTypeSnfiRmm.map(activity),
            formId: 'ckrgu2uldtxbgbg1h',
            activityIdPrefix: 'drcsta',
            activityIndex: index++,
          })
        })
      },
    })
    return formatted
  })
  const fetcher = useFetcher(req)
  const [period, setPeriod] = useState(format(subMonths(new Date(), 1), 'yyyy-MM'))
  const {m} = useI18n()

  useEffect(() => {
    fetcher.fetch({}, PeriodHelper.fromyyyMM(period))
  }, [period])

  const _submit = useAsync((id: string, p: any) => api.activityInfo.submitActivity(p), {
    requestKey: ([i]) => i
  })

  // console.log(fetcher.entity?.map(_ => _.nta).compact().map(_ => {
  //   const a = Utils.add(
  //     _.total_apt_damage_light,
  //     _.total_apt_damage_medium,
  //     _.total_damage_heavy,
  //     _.total_damage_light,
  //     _.total_damage_medium
  //   )
  //   if (a === 0) return _.id
  // }))

  return (
    <Page width="full">
      <Panel>
        <Sheet
          header={
            <>
              <AaInput type="month" sx={{width: 200, mr: 1}} helperText={null} value={period} onChange={_ => setPeriod(_.target.value)}/>
              <AaBtn
                loading={_submit.isLoading}
                icon="send"
                variant="contained"
                sx={{ml: 'auto'}}
                onClick={() => {
                  if (!fetcher.entity) return
                  _submit.call('all', fetcher.entity.map(_ => _.request)).catch(toastHttpError)
                }}
              >
                {m.submitAll}
              </AaBtn>
            </>
          }
          defaultLimit={100} id="ai-shelter" data={fetcher.entity} loading={fetcher.loading} columns={[
          {
            id: 'actions', width: 160, head: '', render: _ => (
              <>
                <AAIconBtn
                  disabled={!_.activity.Hromada} color="primary"
                  onClick={() => {
                    // _submit.call(_.id, [indexActivity[_.id]!.request]).catch(toastHttpError)
                  }}
                >send</AAIconBtn>
                <AIViewAnswers answers={_.all}/>
                <AIPreviewActivity activity={_.activity}/>
                <AIPreviewRequest request={_.request}/>
              </>
            )
          },
          {type: 'select_one', id: 'Report to a planned project', head: 'Report to a planned project', render: row => row.activity['Report to a planned project']},
          {type: 'select_one', id: 'Plan Code', head: 'Plan Code', render: row => row.activity['Plan Code']},
          {type: 'select_one', id: 'SNFI indictors', head: 'SNFI indictors', render: row => row.activity['SNFI indictors']},
          {type: 'select_one', id: 'Oblast', head: 'Oblast', render: row => row.activity['Oblast']},
          {type: 'select_one', id: 'Raion', head: 'Raion', render: row => row.activity['Raion']},
          {type: 'select_one', id: 'Hromada', head: 'Hromada', render: row => row.activity['Hromada']},
          {type: 'select_one', id: 'Implementation status', head: 'Implementation status', render: row => row.activity['Implementation status']},
          {type: 'select_one', id: 'Population Group', head: 'Population Group', render: row => row.activity['Population Group']},
          {type: 'number', id: 'Indicator Value (HHs reached, buildings, etc.)', head: 'Indicator Value (HHs reached, buildings, etc.)', render: row => row.activity['Indicator Value (HHs reached, buildings, etc.)']},
          {type: 'number', id: '# Individuals Reached', head: '# Individuals Reached', render: row => row.activity['# Individuals Reached']},
          {type: 'number', id: 'Girls (0-17)', head: 'Girls (0-17)', render: row => row.activity['Girls (0-17)']},
          {type: 'number', id: 'Boys (0-17)', head: 'Boys (0-17)', render: row => row.activity['Boys (0-17)']},
          {type: 'number', id: 'Women (18-59)', head: 'Women (18-59)', render: row => row.activity['Women (18-59)']},
          {type: 'number', id: 'Men (18-59)', head: 'Men (18-59)', render: row => row.activity['Men (18-59)']},
          {type: 'number', id: 'Elderly Women (60+)', head: 'Elderly Women (60+)', render: row => row.activity['Elderly Women (60+)']},
          {type: 'number', id: 'Elderly Men (60+)', head: 'Elderly Men (60+)', render: row => row.activity['Elderly Men (60+)']},
          {type: 'number', id: 'People with disability', head: 'People with disability', render: row => row.activity['People with disability']},
        ]}/>
      </Panel>
    </Page>
  )
}