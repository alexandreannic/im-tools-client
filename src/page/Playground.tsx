import {useConfig} from '../core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import React, {useEffect, useState} from 'react'
import {KoboApiClient} from '../core/sdk/server/kobo/KoboApiClient'
import {Box, Divider} from '@mui/material'
import {format} from 'date-fns'
import {Layout} from '../shared/Layout'
import {Txt} from 'mui-extension'
import {MPCA_NFIOptions} from '../core/koboModel/MPCA_NFI/MPCA_NFIOptions'

// const survey = await form.fetch().then(_ => _.content.survey)
// const bln = survey.find(_ => _.label?.includes('BLN High Thermal Blankets: How many?'))
// console.log('bln', bln)

export const add = (...args: (string | number | undefined)[]) => {
  return args.reduce<number>((acc, curr) => acc + parseInt(curr as any ?? '0'), 0)
}

const aiPeriod = {start: new Date(2023, 3, 1), end: new Date(2023, 4, 1)}

const limit: any = {
  chernihivska: new Date(2022, 11, 20),
  dnipropetrovska: new Date(2022, 11, 8),
  lvivska: new Date(2022, 9, 10),
  chernivetska: new Date(2022, 9, 27),
  kharkivska: new Date(2022, 11, 28),
  zaporizka: new Date(2022, 11, 8),
}

const extractRelevantProperty = (x: any) => {
  return {
    oblast: x.__oblast,
    id: x.id,
    BLN_: x.BLN_,
    group_in3fh72: x.group_in3fh72,
    Quantity_6064_Female: x.Quantity_6064_Female,
    Quantity_65_Male: x.Quantity_65_Male,
    Quantity_517_Male: x.Quantity_517_Male,
    Quantity_5059_Male: x.Quantity_5059_Male,
    Quantity_5059_Female: x.Quantity_5059_Female,
    Quantity_65_Female: x.Quantity_65_Female,
    Quantity_1849_Male: x.Quantity_1849_Male,
    Quantity_1849_Female: x.Quantity_1849_Female,
    Quantity_24_Male: x.Quantity_24_Male,
    Quantity_24_Female: x.Quantity_24_Female,
    Quantity_6064_Male: x.Quantity_6064_Male,
    Quantity_517_Female: x.Quantity_517_Female,
    Quantity_02_Male: x.Quantity_02_Male,
    Quantity_02_Female: x.Quantity_02_Female,
  }
}


const periods: Record<any, string[]> = {
  chernihivska: [
    '2022-11-02',
    '2022-11-03',
    '2022-11-04',
    '2022-11-07',
    '2022-11-08',
    '2022-11-11',
    '2022-11-15',
    '2022-11-15',
    '2022-11-16',
    '2022-11-17',
    '2022-11-18',
    '2022-11-19',
    '2022-11-21',
    '2022-11-22',
    '2022-11-23',
    '2022-11-29',
    '2022-12-20',
    '2023-02-15',
  ],
  dnipropetrovska: [
    '2022-11-01',
    '2022-11-02',
    '2022-11-03',
    '2022-11-07',
    '2022-11-08',
    '2022-11-09',
    '2022-11-10',
    '2022-11-15',
    '2022-11-17',
    '2022-11-18',
    '2022-11-21',
    '2022-11-22',
    '2022-11-29',
    '2022-11-30',
    '2022-12-01',
    '2022-12-02',
    '2022-12-05',
    '2022-12-06',
    '2022-12-07',
  ],
  lvivska: [
    '2022-09-22',
    '2022-09-26',
    '2022-10-04',
    '2022-10-07',
    '2022-11-21',
    '2022-12-16',
    '2022-12-20',
    '2023-01-27',
    '2023-02-02',
    '2023-02-08',
    '2023-03-13',
    '2023-03-14',
    '2023-03-22',
    '2023-04-04',
    '2023-04-13',
  ],
  chernivetska: [
    '2022-09-23',
    '2022-10-03',
    '2022-10-04',
    '2022-10-05',
    '2022-10-06',
    '2022-10-18',
    '2022-10-17',
    '2022-10-18',
    '2022-10-19',
    '2022-10-20',
    '2022-10-21',
    '2022-10-22',
    '2022-10-23',
    '2022-10-24',
    '2022-10-25',
    '2022-10-26',
    '2022-10-27',
  ],
  kharkivska: [
    '2022-12-08',
    '2022-12-09',
    '2022-12-13',
    '2022-12-28',
  ],
  zaporizka: [
    '2023-02-14',
    '2023-02-13',
    '2023-01-27',
    '2023-01-24',
    '2023-0- 5',
    '2023-0- 3',
    '2023-02-17',
    '2023-02-14',
    '2023-02-13',
    '2023-01-27',
    '2023-01-24',
    '2023-01-19',
    '2023-0- 5',
    '2023-0- 3',
    '2023-01-24',
    '2023-01-27',
    '2023-02-13',
    '2023-02-14',
    '2023-02-17',
    '2023-01-24',
    '2023-0- 5',
    '2023-02-13',
    '2023-02-14',
    '2023-02-15',
    '2023-02-17',
  ]
}

const dateExist = (oblast: keyof typeof periods, date: Date) => {
  const str = format(date, 'yyyy-MM-dd')
  return periods[oblast] ? periods[oblast].includes(str) : false
}

const familyCompositionProperties = [
  'Quantity_6064_Female',
  'Quantity_65_Male',
  'Quantity_517_Male',
  'Quantity_5059_Male',
  'Quantity_5059_Female',
  'Quantity_65_Female',
  'Quantity_1849_Male',
  'Quantity_1849_Female',
  'Quantity_24_Male',
  'Quantity_24_Female',
  'Quantity_6064_Male',
  'Quantity_517_Female',
  'Quantity_02_Male',
  'Quantity_02_Female',
]

const babyMaxYo = 1

export const Playground = () => {
  const {api} = useConfig()

  const form = useFetcher(() => api.koboApi.getForm(KoboApiClient.serverRefs.prod, KoboApiClient.koboFormRefs.MPCA_NFI_NAA))
  const fetchMPCA_NFI = useFetcher(() => api.koboApi.getAnswersMPCA_NFI())
  const fetchMPCA_NFI_Myko = useFetcher(() => api.koboApi.getAnswersMPCA_NFI_Myko())
  const fetchMPCA_NFI_NAA = useFetcher(() => api.koboApi.getAnswersMPCA_NFI_NAA())
  const fetchMPCA_NFI_Old = useFetcher(() => api.koboApi.getAnswersMPCA_NFI_Old())

  const [res2, setRes] = useState<any>({})
  const [blanketsByAgeGroup2, setBlanketsByAgeGroup] = useState<any>({})

  useEffect(() => {
    const getGenderAges = (x: any, groupName: string): [string, number][] => {
      if (!x[groupName]) return []
      return (x[groupName] as Record<string, string>[]).map(x => {
        const [gender, age] = Object.entries(x).sort(([ka], [kb]) => ka.endsWith('GenderHH') ? -1 : 1).map(([k, v]) => v)
        return [gender, add(age)]
      })
    }

    const getGenderComposition = (x: any) => {
      return {
        childFemale: add(x['Quantity_02_Female']),
        childMale: add(x['Quantity_02_Male']),
        totalMale: add(
          x['Quantity_65_Male'],
          x['Quantity_517_Male'],
          x['Quantity_5059_Male'],
          x['Quantity_1849_Male'],
          x['Quantity_24_Male'],
          x['Quantity_6064_Male'],
          x['Quantity_02_Male'],
        ),
        totalFemale: add(
          x['Quantity_6064_Female'],
          x['Quantity_5059_Female'],
          x['Quantity_65_Female'],
          x['Quantity_1849_Female'],
          x['Quantity_24_Female'],
          x['Quantity_517_Female'],
          x['Quantity_02_Female'],
        )
      }
    }

    const moreBLN: any[] = []
    const lessBLN: any[] = []
    const missingWK: any[] = []
    const oblasts = new Set<string>()
    const blanketsByAgeGroup: any = {}
    let maxDate = 0
    let minDate = Number.MAX_VALUE

    ;(async () => {
      const res: any = {
        // dnipro: {bln: 0, wkb: 0},
        // zapo: {bln: 0, wkb: 0},
        // chernihivska: {bln: 0, wkb: 0},
        // lviv: {bln: 0, wkb: 0},
        // chernivtsi: {bln: 0, wkb: 0},
        // kharkiv: {bln: 0, wkb: 0},
        // all: {bln: 0, wkb: 0},
      }
      const init = () => ({
        rows: 0,
        bln: {bln: 0, male: 0, female: 0, all: 0},
        wkb: {wkb: 0, male: 0, female: 0, all: 0}
      })//male: 0, female: 0, anygender: 0,})

      const record = (x: any, oblast: string, WKB: number, BLN: number) => {
        maxDate = Math.max(maxDate, x.start.getTime())
        minDate = Math.min(minDate, x.start.getTime())
        const familyCompo = getGenderComposition(x)
        const genderAge = getGenderAges(x, 'group_in3fh72')
        const babies = genderAge.filter(([gender, age]) => age <= babyMaxYo)

        if (limit[oblast] /*&& x.end.getTime() < limit[oblast].getTime()*/) {
          if (!res[oblast]) {
            res[oblast] = init()
          }
          const babyMales = babies.filter(([gender]) => gender === 'male').length || familyCompo.childMale
          const babyFemales = babies.filter(([gender]) => gender === 'female').length || familyCompo.childFemale

          // const blnForMale = (BLN > 0 ? genderAge.filter(([gender]) => gender === 'male').length : 0)
          // const blnForFemale = (BLN > 0 ? genderAge.filter(([gender]) => gender === 'female').length : 0)
          if(familyCompo.totalMale > 0 && genderAge.filter(([gender]) => gender === 'male').length > 0 && familyCompo.totalMale !== genderAge.filter(([gender]) => gender === 'male').length) {
            console.error(x)
          }
          const blnForMale = (BLN > 0 ?  genderAge.filter(([gender]) => gender === 'male').length || familyCompo.totalMale  : 0)
          const blnForFemale = (BLN > 0 ? genderAge.filter(([gender]) => gender === 'female').length || familyCompo.totalFemale : 0)

          // if (BLN > 0) {
          //   const femaleGroupAge = Arr(genderAge.filter(([gender]) => gender === 'female').map(([gender, age]) => ({age: age as number}))).groupBy(KoboFormProtHH.groupByAgeGroup)
          //   const maleGroupAge = Arr(genderAge.filter(([gender]) => gender === 'male').map(([gender, age]) => ({age: age as number}))).groupBy(KoboFormProtHH.groupByAgeGroup)
          //   if (!blanketsByAgeGroup[oblast]) {
          //     blanketsByAgeGroup[oblast] = {
          //       'total': 0,
          //       'all': {male: 0, female: 0},
          //       '0 - 4': {male: 0, female: 0},
          //       '5 - 9': {male: 0, female: 0},
          //       '10 - 14': {male: 0, female: 0},
          //       '15 - 18': {male: 0, female: 0},
          //       '19 - 29': {male: 0, female: 0},
          //       '30 - 59': {male: 0, female: 0},
          //       '60+': {male: 0, female: 0},
          //     }
          //   }
          //   console.log(
          //     genderAge.filter(([gender]) => gender === 'male').length, '-',
          //     femaleGroupAge['0 - 4']?.length ?? 0,
          //     femaleGroupAge['5 - 9']?.length ?? 0,
          //     femaleGroupAge['10 - 14']?.length ?? 0,
          //     femaleGroupAge['15 - 18']?.length ?? 0,
          //     femaleGroupAge['19 - 29']?.length ?? 0,
          //     femaleGroupAge['30 - 59']?.length ?? 0,
          //     femaleGroupAge['60+']?.length ?? 0,
          //     maleGroupAge['0 - 4']?.length ?? 0,
          //     maleGroupAge['5 - 9']?.length ?? 0,
          //     maleGroupAge['10 - 14']?.length ?? 0,
          //     maleGroupAge['15 - 18']?.length ?? 0,
          //     maleGroupAge['19 - 29']?.length ?? 0,
          //     maleGroupAge['30 - 59']?.length ?? 0,
          //     maleGroupAge['60+']?.length ?? 0,
          //     x
          //   )
          //   blanketsByAgeGroup[oblast]['0 - 4'].female += femaleGroupAge['0 - 4']?.length ?? 0
          //   blanketsByAgeGroup[oblast]['5 - 9'].female += femaleGroupAge['5 - 9']?.length ?? 0
          //   blanketsByAgeGroup[oblast]['10 - 14'].female += femaleGroupAge['10 - 14']?.length ?? 0
          //   blanketsByAgeGroup[oblast]['15 - 18'].female += femaleGroupAge['15 - 18']?.length ?? 0
          //   blanketsByAgeGroup[oblast]['19 - 29'].female += femaleGroupAge['19 - 29']?.length ?? 0
          //   blanketsByAgeGroup[oblast]['30 - 59'].female += femaleGroupAge['30 - 59']?.length ?? 0
          //   blanketsByAgeGroup[oblast]['60+'].female += femaleGroupAge['60+']?.length ?? 0
          //   blanketsByAgeGroup[oblast]['0 - 4'].male += maleGroupAge['0 - 4']?.length ?? 0
          //   blanketsByAgeGroup[oblast]['5 - 9'].male += maleGroupAge['5 - 9']?.length ?? 0
          //   blanketsByAgeGroup[oblast]['10 - 14'].male += maleGroupAge['10 - 14']?.length ?? 0
          //   blanketsByAgeGroup[oblast]['15 - 18'].male += maleGroupAge['15 - 18']?.length ?? 0
          //   blanketsByAgeGroup[oblast]['19 - 29'].male += maleGroupAge['19 - 29']?.length ?? 0
          //   blanketsByAgeGroup[oblast]['30 - 59'].male += maleGroupAge['30 - 59']?.length ?? 0
          //   blanketsByAgeGroup[oblast]['60+'].male += maleGroupAge['60+']?.length ?? 0
          //
          //   blanketsByAgeGroup[oblast]['all'].male += Object.values(maleGroupAge).reduce<number>((acc, x) => acc + x.length, 0)
          //   blanketsByAgeGroup[oblast]['all'].female += Object.values(femaleGroupAge).reduce<number>((acc, x) => acc + x.length, 0)
          //   blanketsByAgeGroup[oblast]['total'] = blanketsByAgeGroup[oblast]['all'].female + blanketsByAgeGroup[oblast]['all'].male
          // }

          res[oblast].rows += 1
          res[oblast].wkb.wkb += WKB
          res[oblast].wkb.male += babyMales
          res[oblast].wkb.female += babyFemales
          if (dateExist(oblast, x.start)) {
            res[oblast].bln.bln += BLN
            res[oblast].bln.male += blnForMale
            res[oblast].bln.female += blnForFemale
          }
          res[oblast].wkb.all = res[oblast].wkb.male + res[oblast].wkb.female
          res[oblast].bln.all = res[oblast].bln.male + res[oblast].bln.female

          // if (WKB > 0) {
          //   console.log(
          //     x.id,
          //     'babyMales', babyMales,
          //     'babyFemales', babyFemales,
          //     'wkb', WKB
          //   )
          // }
          if (WKB > 0 && (babyMales + babyFemales) !== WKB) {
            // console.log(
            //   'genderAge', babies.filter(([gender]) => gender === 'male').length, babies.filter(([gender]) => gender === 'female').length,
            //   'family compo', familyCompo.childMale, familyCompo.childFemale,
            //   'TOTAL', babyMales, babyFemales,
            //   'KIT', add(x.WKB1_1_, x.WKB2_2_, x.WKB3_3_, x.WKB4_4_),
            //   x.id,
            // )
            missingWK.push({__oblast: oblast, ...x})
          }
          if (BLN > 0 && (blnForMale + blnForFemale) !== BLN) {
            // console.log(
            //   'familyCompo', familyCompo.totalMale, familyCompo.totalFemale,
            //   'genderAge', genderAge.filter(([gender]) => gender === 'male').length, genderAge.filter(([gender]) => gender === 'female').length,
            //   'BLN', BLN,
            //   'TOTAL', blnForMale, blnForFemale,
            //   x
            // )
            if ((blnForMale + blnForFemale) > BLN)
              lessBLN.push({__oblast: oblast, ...x})
            else
              moreBLN.push({__oblast: oblast, ...x})
          }
        }
      }

      await fetchMPCA_NFI.fetch().then(_ => _.data.forEach(x => {
        oblasts.add(x.oblast!)
        record(
          x,
          x.oblast!,
          add(x.WKB1_1_, x.WKB2_2_, x.WKB3_3_, x.WKB4_4_),
          add(x.BLN_),
        )
      }))
      await fetchMPCA_NFI_Myko.fetch().then(_ => _.data.forEach(x => {
        const oblast= 'mykolaivska'
        oblasts.add(oblast)
        record(
          x,
          oblast,
          add(x.WKB1_How_many, x.WKB2_How_many, x.WKB3_How_many, x.WKB4_How_many),
          add(x.BLN_),
        )
      }))
      await fetchMPCA_NFI_Old.fetch().then(_ => _.data.forEach(x => {
        const oblasts = {
          _Lviv: 'lvivska',
          _Chernivtsi: 'chernivetska',
          _Dnipro_1: 'dnipropetrovska',
          _kyiv: undefined,
          cej__chernihiv: 'chernihivska',
          plv__poltava: 'kharkivska',
        }
        const oblast = (oblasts as any)[x.location_office!]
        if (!oblast) return
        // console.log(x)
        record(
          x,
          oblast,
          add(x.WKB1_1_, x.WKB2_2_, x.WKB3_3_, x.WKB4_4_),
          add(x.BLN_),
        )
      }))
      await fetchMPCA_NFI_NAA.fetch().then(_ => _.data.forEach(x => {
        record(
          x,
          'kharkivska',
          add(x.WKB1_How_many, x.WKB2_How_many, x.WKB3_How_many, x.WKB4_How_many),
          add(x.BLN_)
        )
      }))
      console.warn('More BLN', moreBLN.map(extractRelevantProperty))
      console.warn('Less BLN', lessBLN.map(extractRelevantProperty))
      console.warn('Missing WK', missingWK.map(extractRelevantProperty))
      console.log(res)
      console.log(format(new Date(minDate), 'yyyy-MM-dd'), '-', format(new Date(maxDate), 'yyyy-MM-dd'))
      // console.log('oblasts', oblasts)
      console.log(blanketsByAgeGroup)
      const all = init()
      Object.keys(res).forEach(oblast => {
        all.rows += res[oblast].rows
        all.bln.bln += res[oblast].bln.bln
        all.bln.female += res[oblast].bln.female
        all.bln.male += res[oblast].bln.male
        all.wkb.wkb += res[oblast].wkb.wkb
        all.wkb.female += res[oblast].wkb.female
        all.wkb.male += res[oblast].wkb.male
      })
      res.all = all
      res.all.bln.all = res.all.bln.female + res.all.bln.male
      res.all.wkb.all = res.all.wkb.female + res.all.wkb.male
      setRes(res)
      setBlanketsByAgeGroup(blanketsByAgeGroup)
    })()
  }, [])


  // console.log(form.entity?.content.survey)
  console.log(fetchMPCA_NFI.entity?.data)

  return (
    <Layout>
      <div>{fetchMPCA_NFI.entity?.data.length}</div>
      <div>{fetchMPCA_NFI_Myko.entity?.data.length}</div>
      <div>{fetchMPCA_NFI_NAA.entity?.data.length}</div>
      <div>fetchMPCA_NFI</div>
      <div>{fetchMPCA_NFI.entity ? (fetchMPCA_NFI.entity.data.find(_ => _.ITN === '1952810617')?.id ?? 'None') : 'Loading...'}</div>
      {/*<div>{fetchMPCA_NFI_Myko.entity?.data.find(_ => _.id === '1952810617')?.id ?? 'None'}</div>*/}
      {/*<div>{fetchMPCA_NFI_NAA.entity?.data.find(_ => _.id === '1952810617')?.id ?? 'None'}</div>*/}

      {/*{fetchMPCA_NFI.entity?.data.map(x =>*/}
      {/*  <div key={x.id}>Main form,{x.id},{format(x.start, 'yyyy-MM-dd')},{MPCA_NFIOptions.oblast[x.oblast!]},{MPCA_NFIOptions.raion[x.raion!]},{MPCA_NFIOptions.hromada[x.hromada!]},{x.staff_names}</div>*/}
      {/*)}*/}
      {/*{fetchMPCA_NFI_Myko.entity?.data.map(x =>*/}
      {/*  <div key={x.id}>Myko,{x.id},{format(x.start, 'yyyy-MM-dd')},,</div>*/}
      {/*)}*/}
      {/*{fetchMPCA_NFI_NAA.entity?.data.map(x =>*/}
      {/*  <div key={x.id}>NAA,{x.id},{format(x.start, 'yyyy-MM-dd')},,</div>*/}
      {/*)}*/}

      <Divider/>
      {Object.keys(res2).map(k =>
        <Box key={k}>
          <Txt bold block>{k}</Txt>
          <Box sx={{display: 'flex'}}>
            <Box sx={{mr: 4}}>
              <pre>{JSON.stringify(blanketsByAgeGroup2[k], null, 2)}</pre>
            </Box>
            <pre>{JSON.stringify(res2[k], null, 2)}</pre>
          </Box>
          <Divider/>
        </Box>
      )}
    </Layout>
  )
}