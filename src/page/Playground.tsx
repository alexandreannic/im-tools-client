import {useConfig} from '../core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useEffect, useState} from 'react'
import {KoboApiClient} from '../core/sdk/server/kobo/KoboApiClient'
import {Divider} from '@mui/material'
import {format, parse} from 'date-fns'

// const survey = await form.fetch().then(_ => _.content.survey)
// const bln = survey.find(_ => _.label?.includes('BLN High Thermal Blankets: How many?'))
// console.log('bln', bln)

export const add = (...args: (string | number | undefined)[]) => {
  return args.reduce<number>((acc, curr) => acc + parseInt(curr as any ?? '0'), 0)
}

const limit: any = {
  chernihivska: new Date(2022, 11, 20),
  dnipropetrovska: new Date(2022, 11, 8),
  lvivska: new Date(2022, 9, 10),
  chernivetska: new Date(2022, 9, 27),
  kharkivska: new Date(2022, 11, 28),
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

  const [res2, setRes] = useState({})

  useEffect(() => {
    const getGenderAges = (x: any, groupName: string) => {
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
      const init = () => ({bln: {male: 0, female: 0, all: 0}, wkb: {male: 0, female: 0, all: 0}})//male: 0, female: 0, anygender: 0,})

      const push = (x: any, oblast: string, wkb: number, BLN: number) => {
        const familyCompo = getGenderComposition(x)
        const genderAge = getGenderAges(x, 'group_in3fh72')
        const babies = genderAge.filter(([gender, age]) => age <= babyMaxYo)

        if (limit[oblast] /*&& x.end.getTime() < limit[oblast].getTime()*/) {
          if (!res[oblast]) {
            res[oblast] = init()
          }
          // const babyMales = wkb
          // const babyFemales = wkb
          const babyMales = babies.filter(([gender]) => gender === 'male').length || familyCompo.childMale
          const babyFemales = babies.filter(([gender]) => gender === 'female').length || familyCompo.childFemale

          // const blnForMale = BLN
          // const blnForFemale = BLN
          const blnForMale = (BLN > 0 ? familyCompo.totalMale || genderAge.filter(([gender]) => gender === 'male').length : 0)
          const blnForFemale = (BLN > 0 ? familyCompo.totalFemale || genderAge.filter(([gender]) => gender === 'female').length : 0)

          res[oblast].wkb.male += babyMales
          res[oblast].wkb.female += babyFemales
          // if (dateExist(oblast, x.end)) {
          res[oblast].bln.male += blnForMale
          res[oblast].bln.female += blnForFemale
          // }
          res[oblast].wkb.all = res[oblast].wkb.male + res[oblast].wkb.female
          res[oblast].bln.all = res[oblast].bln.male + res[oblast].bln.female

          if (wkb > 0) {
            console.log(
              x.id,
              'babyMales', babyMales,
              'babyFemales', babyFemales,
              'wkb', wkb
            )
          }
          if (wkb > 0 && (babyMales + babyFemales) !== wkb) {
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
        push(
          x,
          x.oblast!,
          add(x.WKB1_1_, x.WKB2_2_, x.WKB3_3_, x.WKB4_4_),
          add(x.BLN_),
        )
      }))
      // await fetchMPCA_NFI_Old.fetch().then(_ => _.data.forEach(x => {
      //   if (!res.all) res.all = init()
      //   res.all.wkb += add(x.WKB1_1_, x.WKB2_2_, x.WKB3_3_, x.WKB4_4_)
      // }))
      await fetchMPCA_NFI_NAA.fetch().then(_ => _.data.forEach(x => {
        console.log((x as any).WKB1_1_, x.WKB2_How_many, x.WKB3_How_many, x.WKB4_How_many, x)
        push(
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
      res.all = init()
      Object.keys(res).forEach(oblast => {
        res.all.bln.female += res[oblast].bln.female
        res.all.bln.male += res[oblast].bln.male
        res.all.wkb.female += res[oblast].wkb.female
        res.all.wkb.male += res[oblast].wkb.male
      })
      res.all.bln.all = res.all.bln.female + res.all.bln.male
      res.all.wkb.all = res.all.wkb.female + res.all.wkb.male
      setRes(res)
    })()
  }, [])


  // console.log(form.entity?.content.survey)
  // console.log(fetchMPCA_NFI.entity?.data.map(_ => _.gender_respondent))

  return (
    <div>
      <div>{fetchMPCA_NFI.entity?.data.length}</div>
      <div>{fetchMPCA_NFI_Myko.entity?.data.length}</div>
      <div>{fetchMPCA_NFI_NAA.entity?.data.length}</div>

      <Divider/>
      <pre>
        {JSON.stringify(res2, null, 2)}
      </pre>
    </div>
  )
}