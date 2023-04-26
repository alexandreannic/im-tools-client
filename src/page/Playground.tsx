import {useConfig} from '../core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useEffect} from 'react'
import {KoboApiClient} from '../core/sdk/server/kobo/KoboApiClient'
import {Divider} from '@mui/material'

// const survey = await form.fetch().then(_ => _.content.survey)
// const bln = survey.find(_ => _.label?.includes('BLN High Thermal Blankets: How many?'))
// console.log('bln', bln)

export const Playground = () => {
  const {api} = useConfig()

  const form = useFetcher(() => api.koboApi.getForm(KoboApiClient.serverRefs.prod, KoboApiClient.koboFormRefs.MPCA_NFI))
  const fetchMPCA_NFI = useFetcher(() => api.koboApi.getAnswersMPCA_NFI())
  const fetchMPCA_NFI_Myko = useFetcher(() => api.koboApi.getAnswersMPCA_NFI_Myko())
  const fetchMPCA_NFI_NAA = useFetcher(() => api.koboApi.getAnswersMPCA_NFI_NAA())

  const res = {
    dnipro: {bln: 0, bk: 0},
    zapo: {bln: 0, bk: 0},
    chernihiv: {bln: 0, bk: 0},
    lviv: {bln: 0, bk: 0},
    chernivtsi: {bln: 0, bk: 0},
    kharkiv: {bln: 0, bk: 0},
  }

  useEffect(() => {
    ;(async () => {
      const MPCA_NFI = await fetchMPCA_NFI.fetch().then(_ => _.data.forEach(x => {
        if (x.oblast === 'dnipropetrovska') {
          if (x.end.getTime() < new Date(2022, 11, 8).getTime()) res.dnipro.bln += x.BLN_ ?? 0
          if (x.end.getTime() < new Date(2023, 1, 17).getTime()) res.dnipro.bk += (x.WKB1_1_ ?? 0) + (x.WKB2_2_ ?? 0) + (x.WKB3_3_ ?? 0) + (x.WKB4_4_ ?? 0)
        } else if (x.oblast === 'chernihivska') {
          if (x.end.getTime() < new Date(2022, 11, 20).getTime()) res.chernihiv.bln += x.BLN_ ?? 0
          if (x.end.getTime() < new Date(2023, 1, 23).getTime()) res.chernihiv.bk += (x.WKB1_1_ ?? 0) + (x.WKB2_2_ ?? 0) + (x.WKB3_3_ ?? 0) + (x.WKB4_4_ ?? 0)
        } else if (x.oblast === 'lvivska') {
          if (x.end.getTime() < new Date(2022, 9, 10).getTime()) res.lviv.bln += x.BLN_ ?? 0
          if (x.end.getTime() < new Date(2023, 1, 23).getTime()) reslvivdnipro.bk += (x.WKB1_1_ ?? 0) + (x.WKB2_2_ ?? 0) + (x.WKB3_3_ ?? 0) + (x.WKB4_4_ ?? 0)
        } else if (x.oblast === 'chernivetska') {
          if (x.end.getTime() < new Date(2022, 9, 27).getTime()) res.chernivtsi.bln += x.BLN_ ?? 0
          if (x.end.getTime() < new Date(2023, 1, 23).getTime()) res.chernivtsi.bk += (x.WKB1_1_ ?? 0) + (x.WKB2_2_ ?? 0) + (x.WKB3_3_ ?? 0) + (x.WKB4_4_ ?? 0)
        } else if (x.oblast === 'kharkivska') {
          if (x.end.getTime() < new Date(2022, 11, 28).getTime()) res.kharkiv.bln += x.BLN_ ?? 0
          if (x.end.getTime() < new Date(2023, 1, 23).getTime()) res.kharkivro.bk += (x.WKB1_1_ ?? 0) + (x.WKB2_2_ ?? 0) + (x.WKB3_3_ ?? 0) + (x.WKB4_4_ ?? 0)
        }
      }))
      const MPCA_NFI_NAA = await fetchMPCA_NFI_NAA.fetch().then(_ => _.data.forEach(x => {
        if (x.end.getTime() < new Date(2022, 11, 28).getTime()) {
          res.kharkiv.bln += x.BLN_ ?? 0
        }
      }))
    })()
  }, [])


  // console.log(form.entity?.content.survey)
  console.log(fetchMPCA_NFI.entity?.data.map(_ => _.BLN))

  return (
    <div>
      <div>{fetchMPCA_NFI.entity?.data.length}</div>
      <div>{fetchMPCA_NFI_Myko.entity?.data.length}</div>
      <div>{fetchMPCA_NFI_NAA.entity?.data.length}</div>

      <Divider/>
      {JSON.stringify(res)}
    </div>
  )
}