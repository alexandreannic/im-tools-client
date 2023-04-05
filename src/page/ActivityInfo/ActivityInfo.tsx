import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {_Arr, Arr, Enum, fnSwitch, map} from '@alexandreannic/ts-utils'
import {KoboFormProtHH} from '../../core/koboForm/koboFormProtHH'
import {useConfig} from '../../core/context/ConfigContext'
import {Period, UUID} from '../../core/type'
import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react'
import {AiProtectionHhs} from '../../core/activityInfo/AiProtectionHhs'
import {koboHromadaMapping} from './koboHromadaMapping'
import {chain} from '../../utils/utils'
import {Page} from '../../shared/Page'
import {Datatable} from '../../shared/Datatable/Datatable'
import {IconBtn, Txt} from 'mui-extension'
import {Panel} from '../../shared/Panel'
import {ItInput} from '../../shared/ItInput/ItInput'
import {Box, Icon, Tooltip} from '@mui/material'
import {Confirm} from 'mui-extension/lib/Confirm'
import {Btn} from '../../shared/Btn/Btn'
import {oblasts} from '../../core/uaLocation/oblasts'
import {raions} from '../../core/uaLocation/raions'
import {hromadas} from '../../core/uaLocation/hromadas'
import {ItSelect} from 'shared/Select/Select'
import {AnswerTable} from './AnswerTable'
import Answer = KoboFormProtHH.Answer

// const fillMissingSexOrGender = (data: _Arr<KoboFormProtHH.Answer>) => {
//   const persons = data.flatMap(_ => _.persons).filter(_ => !!_.age && !!_.gender) as _Arr<{age: number, gender: KoboFormProtHH.Gender}>
//
//   const avgAgeByGender = lazy((g: KoboFormProtHH.Gender) => {
//     const byGender = persons.filter(_ => _.gender === g && !!_.age)
//     return byGender.sum(_ => _.age!) / byGender.length
//   })
//
//   const ratioFemaleByAge = lazy((adult: boolean) => {
//     const byGender = persons.filter(_ => !!_.age && _.gender === 'female' && (adult ? _.age >= 18 : _.age < 18))
//     return byGender.sum(_ => _.age!) / byGender.length
//   })
//
//   const ratioFemale = persons.count(_ => _.gender === 'female') / persons.length
//
//   const avgAge = persons.sum(_ => _.age) / persons.length
//
//   const fillMissingSexOrGender = <T extends KoboFormProtHH.Person>(p: T): T => {
//     if (!p.age && !p.gender) {
//       p.gender = Math.random() < ratioFemale ? KoboFormProtHH.Gender.female : KoboFormProtHH.Gender.male
//       p.age = avgAge
//     } else if (!p.age) {
//       p.age = avgAgeByGender(p.gender!)
//     } else if (!p.gender) {
//       p.gender = Math.random() < ratioFemaleByAge(p.age >= 18) ? KoboFormProtHH.Gender.female : KoboFormProtHH.Gender.male
//     }
//     return p
//   }
//   data.forEach(d => {
//     try {
//       d.persons = d.persons.map(fillMissingSexOrGender)
//     } catch (e: unknown) {
//       console.error(d)
//       throw new Error(d._id + ' ' + (e as Error).message)
//     }
//   })
//   return data
// }

const mapPopulationGroup = (s: KoboFormProtHH.Status): any => fnSwitch(s, {
  idp: 'IDPs',
  conflict_affected_person: 'Non-Displaced',
  host_community_member: 'Non-Displaced',
  idp_returnee: 'Returnees'
}, _ => 'Non-Displaced')

export const ActivityInfo = ({
  serverId = '746f2270-d15a-11ed-afa1-0242ac120002',
  formId = 'aFU8x6tHksveU2c3hK7RUG',
}: {
  serverId?: UUID,
  formId?: string,
  period?: Period
}) => {
  const [period, setPeriod] = useState('2023-03')
  const {api} = useConfig()
  const request = (period: string) => {
    const [year, month] = period.split('-')
    return api.koboForm.getLocalFormAnswers({
      start: new Date(parseInt(year), parseInt(month) - 1),
      end: new Date(parseInt(year), parseInt(month)),
    }).then(_ => Arr(_.map(KoboFormProtHH.mapAnswers)))
  }
  // const request = (period: string) => {
  //   const [year, month] = period.split('-')
  //   return api.koboForm.getAnswers(serverId, formId, {
  //     start: new Date(parseInt(year), parseInt(month) - 1),
  //     end: new Date(parseInt(year), parseInt(month)),
  //   }).then(_ => Arr(_.data.map(KoboFormProtHH.mapAnswers)))
  // }
  const _hhCurrent = useFetcher(request)

  useEffect(() => {
    console.log('SEARCH Zaporizka', AiProtectionHhs.searchRaion('Zaporizka'))
    _hhCurrent.fetch({clean: false}, period)
  }, [period])

  return (
    <div>
      {map(_hhCurrent.entity, _ => <_ActivityInfo
        data={_}
        period={period}
        setPeriod={setPeriod}
      />)}
    </div>
  )
}

const _ActivityInfo = ({
  data,
  period,
  setPeriod,
}: {
  data: KoboFormProtHH.Answer[]
  period: string
  setPeriod: Dispatch<SetStateAction<string>>
}) => {

  const enrichedData = useMemo(() => {
    return chain(Arr(data))
      // .map(fillMissingSexOrGender)
      .map(x => x?.map(_ => ({..._})))
      .map(data => data.map(_ => ({..._, ...koboHromadaMapping[_._id]})))
      .get
  }, [data])

  const formParams = useMemo(() => {
    const activities: {rows: Answer[], activity: AiProtectionHhs.FormParams}[] = []
    Enum.entries(enrichedData.groupBy(_ => _._4_What_oblast_are_you_from)).forEach(([oblast, byOblast]) => {
      const middle = Math.ceil(byOblast.length / 2)
      Enum.entries({
        'GP-DRC-00001': Arr([...byOblast].splice(0, Math.ceil(middle))),
        'GP-DRC-00002': Arr([...byOblast].splice(Math.ceil(middle), Math.ceil(byOblast.length))),
      }).forEach(([planCode, byPlanCode]) => {
        Enum.entries(byPlanCode.groupBy(_ => _._4_1_What_raion_currently_living_in)).forEach(([raion, byRaion]) => {
          Enum.entries(byRaion.groupBy(_ => _.hromada)).forEach(([hromada, byHromada]) => {
            activities.push({
              rows: byHromada,
              activity: {
                'Plan Code': planCode,
                Oblast: AiProtectionHhs.findLocation(oblasts, oblast) ?? (('⚠️' + oblast) as any),
                Raion: AiProtectionHhs.findLocation(raions, raion) ?? AiProtectionHhs.searchRaion(hromada) ?? (('⚠️' + raion) as any),
                // Raion: raion as any,
                // Hromada: hromada as any,
                Hromada: AiProtectionHhs.findLocation(hromadas, hromada) ?? (('⚠️' + hromada) as any),
                subActivities: Enum.entries(byHromada.groupBy(_ => _._12_Do_you_identify_as_any_of)).map(([populationGroup, byPopulationGroup]) => {
                  try {
                    const persons = byPopulationGroup.flatMap(_ => _.persons) as _Arr<{age: number, gender: KoboFormProtHH.Gender}>
                    const childs = persons.filter(_ => _.age < 18)
                    const adults = persons.filter(_ => _.age >= 18 && !KoboFormProtHH.isElderly(_.age))
                    const elderly = persons.filter(_ => KoboFormProtHH.isElderly(_.age))
                    return {
                      'Reporting Month': period,
                      'Total Individuals Reached': persons.length,
                      'Population Group': mapPopulationGroup(populationGroup),
                      'Adult Men': adults.count(_ => _.gender === 'male'),
                      'Adult Women': adults.count(_ => _.gender === 'female'),
                      'Boys': childs.count(_ => _.gender === 'male'),
                      'Girls': childs.count(_ => _.gender === 'female'),
                      'Elderly Women': elderly.count(_ => _.gender === 'female'),
                      'Elderly Men': elderly.count(_ => _.gender === 'male'),
                    }
                  } catch (e: unknown) {
                    console.error(byPopulationGroup)
                    throw new Error(byPopulationGroup.map(_ => _._id).join(',') + ' ' + (e as Error).message)
                  }
                })
              }
            })
          })
        })
      })
    })
    return activities
  }, [data])

  const tableData: _Arr<{rows: Answer[], activity: Omit<AiProtectionHhs.FormParams, 'subActivities'> & AiProtectionHhs.FormParams['subActivities'][0]}> = useMemo(() => {
    return Arr(formParams.flatMap(({activity: {subActivities, ...rest}, rows}) => subActivities.map(a => ({
      rows,
      activity: {
        ...rest,
        ...a
      }
    }))))
  }, [formParams])

  const [selectedOblast, setSelectedOblast] = useState<string | undefined>()
  // console.log(groupedByLocation)
  // const xx = useMemo(() => {
  //   return Enum.entries(groupedByLocation).map(([k, v]) => {
  //     v.map(_ => _)
  //   })
  // }, [groupedByLocation])

  return (
    <Page width={1200}>
      <Box sx={{mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Box>
          <ItInput type="month" value={period} onChange={_ => setPeriod(_.target.value)}/>
          <ItSelect
            label="Oblast"
            value={selectedOblast?.split('_')[0] ?? ''}
            onChange={_ => setSelectedOblast(_)}
            options={Object.keys(oblasts).map(_ => ({value: _, children: _.split('_')[0]}))}
          />
        </Box>
        <Confirm title="Sent" content={
          <>
            
          </>
        }>
          <IconBtn sx={{marginLeft: 'auto', mr: 1}}>
            <Icon>settings</Icon>
          </IconBtn>
        </Confirm>
        <Btn icon="send" color="primary" variant="contained">Send all</Btn>
      </Box>
      <Panel>
        <Datatable
          columns={[
            {id: 'Oblast', head: 'Oblast', render: _ => _.activity.Oblast.split('_')[0] ?? _.activity.Oblast},
            {id: 'Raion', head: 'Raion', render: _ => _.activity.Raion.split('_')[0] ?? _.activity.Raion},
            {id: 'Hromada', head: 'Hromada', render: _ => _.activity.Hromada.split('_')[0] ?? _.activity.Hromada},
            {id: 'Plan Code', head: 'Plan Code', render: _ => _.activity['Plan Code']},
            {id: 'Population Group', head: 'Population Group', render: _ => _.activity['Population Group']},
            {id: 'Boys', number: true, head: 'Boys', render: _ => _.activity.Boys},
            {id: 'Girls', number: true, head: 'Girls', render: _ => _.activity.Girls},
            {id: 'Adult Women', number: true, head: 'Adult Women', render: _ => _.activity['Adult Women']},
            {id: 'Adult Men', number: true, head: 'Adult Men', render: _ => _.activity['Adult Men']},
            {id: 'Elderly Women', number: true, head: 'Elderly Women', render: _ => _.activity['Elderly Women']},
            {id: 'Elderly Men', number: true, head: 'Elderly Men', render: _ => _.activity['Elderly Men']},
            {
              id: 'Total Individuals Reached', number: true, head: 'Total Individuals Reached', render: _ => (
                <Txt bold>{_.activity['Total Individuals Reached']}</Txt>
              )
            },
            {
              id: 'actions', head: '', render: row => {
                const request = formParams.find(f =>
                  f.activity['Plan Code'] === row.activity['Plan Code'] &&
                  f.activity['Oblast'] === row.activity['Oblast'] &&
                  f.activity['Raion'] === row.activity['Raion'] &&
                  f.activity['Hromada'] === row.activity['Hromada']
                )!
                return (
                  <>
                    <Confirm title="Preview activity" content={
                      <pre>{JSON.stringify(request.activity, null, 2)}</pre>
                    }>
                      <Tooltip title="Preview parsed data">
                        <IconBtn color="primary">
                          <Icon>preview</Icon>
                        </IconBtn>
                      </Tooltip>
                    </Confirm>
                    <Confirm title="Preview request body code" content={
                      <pre>{JSON.stringify(AiProtectionHhs.makeForm(request.activity), null, 2)}</pre>
                    }>
                      <Tooltip title="Preview request body code">
                        <IconBtn color="primary">
                          <Icon>data_object</Icon>
                        </IconBtn>
                      </Tooltip>
                    </Confirm>
                    <Confirm
                      maxWidth={'lg'}
                      title="Kobo data"
                      PaperProps={{}}
                      content={
                        <AnswerTable answers={request.rows.filter(_ =>
                          _._12_Do_you_identify_as_any_of && mapPopulationGroup(_._12_Do_you_identify_as_any_of) === row.activity['Population Group']
                        )}
                        />
                      }>
                      <Tooltip title="Kobo data">
                        <Btn icon="table_view" variant="outlined" size="small">View data</Btn>
                      </Tooltip>
                    </Confirm>
                  </>
                )
              }
            }
          ]} data={tableData.filter(_ => !selectedOblast || _.activity.Oblast === selectedOblast)}/>
        {/*<Table>*/}
        {/*  <TableBody>*/}
        {/*    {formParams.map(form => form.subActivities.map(activity => (*/}
        {/*      <TableRow>*/}
        {/*        <TableCell>{form.Oblast}</TableCell>*/}
        {/*        <TableCell>{form.Raion}</TableCell>*/}
        {/*        <TableCell>{form.Hromada}</TableCell>*/}
        {/*        <TableCell>{form['Plan Code']}</TableCell>*/}
        {/*        <TableCell>{activity['Total Individuals Reached']}</TableCell>*/}
        {/*        <TableCell>{activity.Boys}</TableCell>*/}
        {/*        <TableCell>{activity.Girls}</TableCell>*/}
        {/*      </TableRow>*/}
        {/*    )))}*/}
        {/*  </TableBody>*/}
        {/*</Table>*/}
        {/*<table>*/}
        {/*  <thead>*/}
        {/*  <tr>*/}
        {/*    <td>Oblast</td>*/}
        {/*    <td>Raion</td>*/}
        {/*    <td>Hromada</td>*/}
        {/*    <td>Settlement</td>*/}
        {/*    <td>Collective Centre</td>*/}
        {/*  </tr>*/}
        {/*  </thead>*/}
        {/*  <tbody>*/}
        {/*  {Enum.entries(groupedByLocation).map(([path, value]) => {*/}
        {/*    const groups = parsePath(path)*/}

        {/*    return (*/}
        {/*      <tr>*/}
        {/*        <td>{groups.oblast}</td>*/}
        {/*        <td>{groups.raion}</td>*/}
        {/*        <td>{groups.population_group}</td>*/}
        {/*      </tr>*/}
        {/*    )*/}
        {/*  })}*/}
        {/*  </tbody>*/}
        {/*</table>*/}
      </Panel>
    </Page>
  )
}
