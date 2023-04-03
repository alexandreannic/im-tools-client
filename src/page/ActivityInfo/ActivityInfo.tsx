import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {_Arr, Arr, Enum, fnSwitch, lazy, map} from '@alexandreannic/ts-utils'
import {KoboFormProtHH} from '../../core/koboForm/koboFormProtHH'
import {useConfig} from '../../core/context/ConfigContext'
import {Period, UUID} from '../../core/type'
import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react'
import {AiProtectionHhs} from '../../core/activityInfo/AiProtectionHhs'
import {koboHromadaMapping} from './koboHromadaMapping'
import {chain} from '../../utils/utils'
import Input from '@mui/material/Input'
import {Table, TableBody, TableCell, TableRow} from '@mui/material'
import {Page} from '../../shared/Page'
import {Datatable} from '../../shared/Datatable/Datatable'
import {Txt} from 'mui-extension'

const fillMissingSexOrGender = (data: _Arr<KoboFormProtHH.Answer>) => {
  const persons = data.flatMap(_ => _.persons).filter(_ => !!_.age && !!_.gender) as _Arr<{age: number, gender: KoboFormProtHH.Gender}>

  const avgAgeByGender = lazy((g: KoboFormProtHH.Gender) => {
    const byGender = persons.filter(_ => _.gender === g && !!_.age)
    return byGender.sum(_ => _.age!) / byGender.length
  })

  const ratioFemaleByAge = lazy((adult: boolean) => {
    const byGender = persons.filter(_ => !!_.age && _.gender === 'female' && (adult ? _.age >= 18 : _.age < 18))
    return byGender.sum(_ => _.age!) / byGender.length
  })

  const ratioFemale = persons.count(_ => _.gender === 'female') / persons.length

  const avgAge = persons.sum(_ => _.age) / persons.length

  const fillMissingSexOrGender = <T extends KoboFormProtHH.Person>(p: T): T => {
    if (!p.age && !p.gender) {
      p.gender = Math.random() < ratioFemale ? KoboFormProtHH.Gender.female : KoboFormProtHH.Gender.male
      p.age = avgAge
    } else if (!p.age) {
      p.age = avgAgeByGender(p.gender!)
    } else if (!p.gender) {
      p.gender = Math.random() < ratioFemaleByAge(p.age >= 18) ? KoboFormProtHH.Gender.female : KoboFormProtHH.Gender.male
    }
    return p
  }
  data.forEach(d => {
    try {
      d.persons = d.persons.map(fillMissingSexOrGender)
    } catch (e: unknown) {
      console.error(d)
      throw new Error(d._id + ' ' + (e as Error).message)
    }
  })
  return data
}

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
    return api.koboForm.getAnswers(serverId, formId, {
      start: new Date(parseInt(year), parseInt(month) - 1),
      end: new Date(parseInt(year), parseInt(month)),
    }).then(_ => Arr(_.data.map(KoboFormProtHH.mapAnswers)))
  }
  const _hhCurrent = useFetcher(request)

  useEffect(() => {
    _hhCurrent.fetch({}, period)
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
      .map(fillMissingSexOrGender)
      .map(data => data.map(_ => ({..._, ...koboHromadaMapping[_._id]})))
      .get
  }, [data])

  const formParams = useMemo(() => {
    const activities: AiProtectionHhs.FormParams[] = []
    Enum.entries(enrichedData.groupBy(_ => _._4_What_oblast_are_you_from)).forEach(([oblast, byOblast]) => {
      Enum.entries(byOblast.groupBy(_ => _._4_1_What_raion_currently_living_in)).forEach(([raion, byRaion]) => {
        Enum.entries(byRaion.groupBy(_ => _.hromada)).forEach(([hromada, byHromada]) => {
          activities.push({
            'Plan Code': 'GP-DRC-00001',
            Oblast: oblast as any,
            Raion: raion as any,
            Hromada: hromada as any,
            subActivities: Enum.entries(byHromada.groupBy(_ => _._12_Do_you_identify_as_any_of)).map(([populationGroup, byPopulationGroup]) => {
              try {

                const persons = byPopulationGroup.flatMap(_ => _.persons) as _Arr<{age: number, gender: KoboFormProtHH.Gender}>
                const childs = persons.filter(_ => _.age < 18)
                const adults = persons.filter(_ => _.age >= 18 && _.age < 60)
                const elderly = persons.filter(_ => _.age >= 60)
                return {
                  'Reporting Month': period,
                  'Total Individuals Reached': persons.length,
                  'Population Group': fnSwitch(populationGroup, {
                    idp: 'IDPs',
                    conflict_affected_person: 'Non-Displaced',
                    host_community_member: 'Non-Displaced',
                    idp_returnee: 'Returnees'
                  }, _ => 'Non-Displaced'),
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
          })
        })
      })
    })
    return activities
  }, [data])

  const tableData: _Arr<Omit<AiProtectionHhs.FormParams, 'subActivities'> & AiProtectionHhs.FormParams['subActivities'][0]> = useMemo(() => {
    return Arr(formParams.flatMap(({subActivities, ...rest}) => subActivities.map(a => ({...rest, ...a}))))
  }, [formParams])

  // console.log(groupedByLocation)
  // const xx = useMemo(() => {
  //   return Enum.entries(groupedByLocation).map(([k, v]) => {
  //     v.map(_ => _)
  //   })
  // }, [groupedByLocation])

  return (
    <Page>
      <Input type="month" value={period} onChange={_ => setPeriod(_.target.value)}/>
      <Datatable columns={[
        {id: 'Oblast', head: 'Oblast', render: _ => _.Oblast},
        {id: 'Oblast', head: 'Oblast', render: _ => _.Oblast},
        {id: 'Raion', head: 'Raion', render: _ => _.Raion},
        {id: 'Hromada', head: 'Hromada', render: _ => _.Hromada},
        {id: 'Plan Code', head: 'Plan Code', render: _ => _['Plan Code']},
        {id: 'Boys', number: true, head: 'Boys', render: _ => _.Boys},
        {id: 'Girls', number: true, head: 'Girls', render: _ => _.Girls},
        {id: 'Adult Women', number: true, head: 'Adult Women', render: _ => _['Adult Women']},
        {id: 'Adult Men', number: true, head: 'Adult Men', render: _ => _['Adult Men']},
        {id: 'Elderly Women', number: true, head: 'Elderly Women', render: _ => _['Elderly Women']},
        {id: 'Elderly Men', number: true, head: 'Elderly Men', render: _ => _['Elderly Men']},
        {
          id: 'Total Individuals Reached', number: true, head: 'Total Individuals Reached', render: _ => (
            <Txt bold>{_['Total Individuals Reached']}</Txt>
          )
        },
      ]} data={tableData}/>
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
    </Page>
  )
}
