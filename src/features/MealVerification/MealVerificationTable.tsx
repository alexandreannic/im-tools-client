import {useAppSettings} from '@/core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {map, Seq, seq} from '@alexandreannic/ts-utils'
import React, {useEffect, useMemo, useState} from 'react'
import {Page} from '@/shared/Page'
import {Sheet} from '@/shared/Sheet/Sheet'
import {Ecrec_CashRegistration} from '@/core/koboModel/Ecrec_CashRegistration/Ecrec_CashRegistration'
import {Meal_EcrecVerification} from '@/core/koboModel/Meal_EcrecVerification/Meal_EcrecVerification'
import {alpha, Icon, Tooltip, useTheme} from '@mui/material'
import {toPercent} from '@/utils/utils'
import {useI18n} from '@/core/i18n'
import {Panel} from '@/shared/Panel'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {Div, SlidePanel, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {KoboSchemaProvider, useKoboSchemaContext} from '@/features/Kobo/KoboSchemaContext'
import {DatabaseKoboAnswerView} from '@/features/Database/KoboEntry/DatabaseKoboAnswerView'
import {TableIcon, TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import {KoboAnswer, KoboId} from '@/core/sdk/server/kobo/Kobo'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {AaSelectSingle} from '@/shared/Select/AaSelectSingle'
import {useParams} from 'react-router'
import * as yup from 'yup'
import {useMealVerificationContext} from '@/features/MealVerification/MealVerificationContext'
import {MealVerificationAnsers, MealVerificationAnswersStatus} from '@/core/sdk/server/mealVerification/MealVerification'

const columnsToCompare: Seq<keyof Ecrec_CashRegistration & keyof Meal_EcrecVerification> = seq([
  // 'pay_det_tax_id_num',
  'back_donor',
  'back_consent',
  'back_consent_no_note',
  'ben_det_surname',
  'ben_det_first_name',
  'ben_det_pat_name',
  'ben_det_ph_number',
  'ben_det_oblast',
  'ben_det_raion',
  'ben_det_hromada',
  'ben_det_settlement',
  'ben_det_res_stat',
  'ben_det_income',
  'ben_det_hh_size',
  'land_own',
  'land_cultivate',
  'not_many_livestock',
  'many_sheep_goat',
  'many_milking',
  'many_cow',
  'many_pig',
  'many_poultry',
  // 'fin_det_res',
  // 'fin_det_enum',
])

interface MergedData {
  dataCheck?: KoboAnswer<Meal_EcrecVerification>
  data: KoboAnswer<Ecrec_CashRegistration>
  ok: number
}

const paramSchema = yup.object({id: yup.string().required()})

export const MealVerificationTable = () => {
  const {id} = paramSchema.validateSync(useParams())
  const {api} = useAppSettings()
  const ctx = useMealVerificationContext()
  const entity = useMemo(() => ctx.fetcherVerifications.entity?.find(_ => _.id === id), [id])
  const fetcherSchema = useFetcher((formId: KoboId) => api.koboApi.getForm({id: formId}))
  const fetcherToVerifyAnswers = useFetcher(api.mealVerification.getAnswers)

  useEffect(() => {
    ctx.fetcherVerifications.fetch({force: true})
    if (entity) {
      fetcherSchema.fetch({}, entity.formId)
      fetcherToVerifyAnswers.fetch({}, entity.id)
    }
  }, [])

  return (
    <>
      {fetcherSchema.entity && fetcherToVerifyAnswers.entity && (
        <KoboSchemaProvider schema={fetcherSchema.entity}>
          <MealVerificationEcrec toVerifyAnswers={fetcherToVerifyAnswers.entity}/>
        </KoboSchemaProvider>
      )}
    </>
  )
}

const MealVerificationEcrec = ({
  toVerifyAnswers
}: {
  toVerifyAnswers: MealVerificationAnsers[]
}) => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const t = useTheme()
  const ctx = useKoboSchemaContext()

  const fetcherVerif = useFetcher(api.kobo.answer.searchMeal_ecrecVerification)
  const req = () => api.kobo.answer.searchEcrec_cashRegistration().then(_ => {
    const idsToVerify = new Set(toVerifyAnswers.filter(_ => _.status === MealVerificationAnswersStatus.Selected).map(_ => _.koboAnswerId))
    return _.data.filter(_ => idsToVerify.has(_.id))
  })
  const fetcherData = useFetcher(req)

  const [openModalAnswer, setOpenModalAnswer] = useState<KoboAnswer<any> | undefined>()
  const [display, setDisplay] = useState<'data' | 'dataCheck' | 'all'>('all')

  useEffect(() => {
    fetcherVerif.fetch()
    fetcherData.fetch()
  }, [])

  const mergedData: Seq<MergedData> | undefined = useMemo(() => {
    return map(fetcherVerif.entity?.data, fetcherData.entity, (verif, data) => {
      const indexedVerif = seq(verif).groupBy(_ => _.pay_det_tax_id_num ?? '')
      return seq(data).map(_ => {
        const refArr = indexedVerif[_.pay_det_tax_id_num!]
        if (!refArr) return {
          data: _,
          ok: 0,
        }
        if (refArr.length > 1) throw new Error(_.pay_det_tax_id_num + ' exist ' + refArr?.length)
        const ref = refArr[0]
        return {
          dataCheck: ref,
          data: _,
          ok: columnsToCompare.sum(c => _[c] === ref?.[c] ? 1 : 0),
        }
      }).compact().sortByNumber(_ => _.dataCheck ? 1 : 0)
    })
  }, [
    fetcherVerif.entity,
    fetcherData.entity,
  ])

  const stats = useMemo(() => {
    if (!mergedData) return
    const verified = mergedData.filter(_ => _.dataCheck)
    return {
      indicatorsOk: mergedData.sum(_ => _.ok ?? 0),
      indicatorsVerified: verified.length * columnsToCompare.length,
      verifiedRows: verified.length,
    }
  }, [mergedData])

  return (
    <Page width="full">
      {stats && (
        <Div sx={{mb: 1, alignItems: 'stretch'}}>
          <SlidePanel sx={{flex: 1}}>
            <PieChartIndicator dense value={stats?.verifiedRows ?? 0} base={mergedData?.length ?? 1} title={m._mealVerif.verified}/>
          </SlidePanel>
          <SlidePanel sx={{flex: 1}}>
            <PieChartIndicator dense value={stats?.indicatorsOk ?? 0} base={stats?.indicatorsVerified ?? 1} title={m._mealVerif.valid}/>
          </SlidePanel>
          <SlideWidget title={m._mealVerif.allIndicators} sx={{flex: 1}}>
            {stats.indicatorsVerified}
          </SlideWidget>
          <SlideWidget title={m._mealVerif.allValidIndicators} sx={{flex: 1}} icon="check_circle">
            {stats.indicatorsOk}
          </SlideWidget>
          <SlideWidget title={m._mealVerif.allErrorIndicators} sx={{flex: 1}} icon="error">
            {stats.indicatorsVerified - stats.indicatorsOk}
          </SlideWidget>
        </Div>
      )}
      <Panel>
        <Sheet
          showExportBtn
          id="meal-verif-ecrec"
          loading={fetcherVerif.loading || fetcherData.loading}
          data={mergedData}
          header={
            <>
              <AaSelectSingle<number>
                hideNullOption
                sx={{maxWidth: 128, mr: 1}}
                value={ctx.langIndex}
                onChange={ctx.setLangIndex}
                options={[
                  {children: 'XML', value: -1},
                  ...ctx.schemaHelper.sanitizedSchema.content.translations.map((_, i) => ({children: _, value: i}))
                ]}
              />
              <ScRadioGroup inline dense value={display} onChange={setDisplay}>
                <ScRadioGroupItem hideRadio value="all" title={
                  <Tooltip title={m._mealVerif.showBoth}>
                    <Icon sx={{verticalAlign: 'middle', transform: 'rotate(90deg)'}}>hourglass_full</Icon>
                  </Tooltip>
                }/>
                <ScRadioGroupItem hideRadio value="data" title={
                  <Tooltip title={m._mealVerif.showData}>
                    <Icon sx={{verticalAlign: 'middle', transform: 'rotate(90deg)'}}>hourglass_bottom</Icon>
                  </Tooltip>
                }/>
                <ScRadioGroupItem hideRadio value="dataCheck" title={
                  <Tooltip title={m._mealVerif.showVerif}>
                    <Icon sx={{verticalAlign: 'middle', transform: 'rotate(90deg)'}}>hourglass_top</Icon>
                  </Tooltip>
                }/>
              </ScRadioGroup>
            </>
          }
          columns={[
            {
              id: 'actions',
              head: '',
              style: _ => ({fontWeight: t.typography.fontWeightBold}),
              render: _ => (
                <>
                  <TableIconBtn tooltip={m._mealVerif.viewData} children="text_snippet" onClick={() => setOpenModalAnswer(_.data)}/>
                  <TableIconBtn tooltip={m._mealVerif.viewDataCheck} disabled={!_.dataCheck} children="fact_check" onClick={() => setOpenModalAnswer(_.dataCheck)}/>
                </>
              )
            },
            {
              id: 'taxid',
              head: m.taxID,
              type: 'string',
              render: _ => _.data.pay_det_tax_id_num
            },
            {
              id: 'status',
              width: 0,
              align: 'center',
              head: m.status,
              type: 'select_one',
              renderValue: _ => '' + !!_.dataCheck,
              renderOption: _ => _.dataCheck
                ? <><TableIcon color="success">check_circle</TableIcon> {m._mealVerif.verified}</>
                : <><TableIcon color="warning">schedule</TableIcon> {m._mealVerif.notVerified}</>,
              render: _ => _.dataCheck ? <TableIcon color="success">check_circle</TableIcon> : <TableIcon color="warning">schedule</TableIcon>,
            },
            ...columnsToCompare.map(c => {
              return {
                id: c,
                type: 'select_one',
                head: ctx.translate.question(c),
                style: (_: MergedData) => {
                  if (!_.dataCheck || _.dataCheck?.[c] === _.data?.[c]) {
                    return {}
                  } else
                    return {
                      color: t.palette.error.dark,
                      background: alpha(t.palette.error.main, .2)
                    }
                },
                renderOption: (_: MergedData) => _.dataCheck
                  ? _.dataCheck?.[c] === _.data?.[c] ? <Icon color="success">check</Icon> : <Icon color="error">close</Icon>
                  : '',
                renderValue: (_: MergedData) => _.dataCheck
                  ? _.dataCheck?.[c] === _.data?.[c] ? '1' : '0'
                  : '',
                render: (_: MergedData) => {
                  const isOption = ctx.schemaHelper.questionIndex[c].type === 'select_one' || ctx.schemaHelper.questionIndex[c].type === 'select_multiple'
                  const dataCheck = _.dataCheck && isOption ? ctx.translate.choice(c, _.dataCheck?.[c] as string) : _.dataCheck?.[c]
                  const data = isOption ? ctx.translate.choice(c, _.data?.[c] as string) : _.data?.[c]
                  switch (display) {
                    case 'data':
                      return data
                    case 'dataCheck':
                      return dataCheck ?? <TableIcon color="disabled">schedule</TableIcon>
                    case 'all':
                      return <>{data ?? '""'} = {dataCheck ?? <TableIcon color="disabled">schedule</TableIcon>}</>
                  }
                }
              } as const
            }),
            // {
            //   id: 'fin_det_oth_doc_im',
            //   head: ctx.translate.question('fin_det_oth_doc_im'),
            //   render: _ => _.dataCheck?.fin_det_oth_doc_im,
            // },
            {
              id: 'total',
              head: m.total,
              stickyEnd: true,
              align: 'right',
              style: _ => ({fontWeight: t.typography.fontWeightBold}),
              render: _ => (
                _.dataCheck ? toPercent(_.ok / columnsToCompare.length) : ''
              )
            }
          ]}/>
      </Panel>
      {openModalAnswer && (
        <DatabaseKoboAnswerView
          open={!!openModalAnswer}
          onClose={() => setOpenModalAnswer(undefined)}
          answer={openModalAnswer}
        />
      )}
    </Page>
  )
}