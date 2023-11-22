import {useAppSettings} from '@/core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {map, Seq, seq} from '@alexandreannic/ts-utils'
import React, {useEffect, useMemo, useState} from 'react'
import {Page} from '@/shared/Page'
import {Sheet} from '@/shared/Sheet/Sheet'
import {Ecrec_CashRegistration} from '@/core/koboModel/Ecrec_CashRegistration/Ecrec_CashRegistration'
import {Meal_EcrecVerification} from '@/core/koboModel/Meal_EcrecVerification/Meal_EcrecVerification'
import {alpha, Icon, useTheme} from '@mui/material'
import {toPercent} from '@/utils/utils'
import {useI18n} from '@/core/i18n'
import {Layout} from '@/shared/Layout'
import {Panel} from '@/shared/Panel'
import {PieChartIndicator} from '@/shared/PieChartIndicator'
import {Div, SlidePanel, SlideWidget} from '@/shared/PdfLayout/PdfSlide'
import {kobo} from '@/koboDrcUaFormId'
import {KoboSchemaProvider, useKoboSchemaContext} from '@/features/Kobo/KoboSchemaContext'
import {DatabaseKoboAnswerView} from '@/features/Database/KoboEntry/DatabaseKoboAnswerView'
import {TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {AaSelect} from '@/shared/Select/Select'
import {AaSelectSingle} from '@/shared/Select/AaSelectSingle'

const columns: Seq<keyof Ecrec_CashRegistration & keyof Meal_EcrecVerification> = seq([
  'ben_det_surname',
  'back_donor',
  'back_consent',
  'pay_det_tax_id_num',
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
  dataCheck: KoboAnswer<Meal_EcrecVerification>
  data: KoboAnswer<Ecrec_CashRegistration>
  ok: number
}

export const MealVerification = () => {
  const {api} = useAppSettings()
  const fetcherSchema = useFetcher(() => api.koboApi.getForm(kobo.drcUa.server.prod, kobo.drcUa.form.meal_ecrecVerification))
  useEffect(() => {
    fetcherSchema.fetch()
  }, [])

  return (
    <Layout>
      {fetcherSchema.entity && (
        <KoboSchemaProvider schema={fetcherSchema.entity}>
          <_MealVerification/>
        </KoboSchemaProvider>
      )}
    </Layout>
  )
}

export const _MealVerification = () => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const t = useTheme()

  const fetcherVerif = useFetcher(api.kobo.answer.searchMeal_ecrecVerification)
  const fetcherData = useFetcher(api.kobo.answer.searchEcrec_cashRegistration)
  const fetcherSchema = useFetcher(() => api.koboApi.getForm(kobo.drcUa.server.prod, kobo.drcUa.form.meal_ecrecVerification))

  const [openModalAnswer, setOpenModalAnswer] = useState<KoboAnswer<any> | undefined>()
  const [display, setDisplay] = useState<'data' | 'dataCheck' | 'all'>('all')

  const ctx = useKoboSchemaContext()

  useEffect(() => {
    fetcherSchema.fetch()
    fetcherVerif.fetch()
    fetcherData.fetch()
  }, [])

  const mergedData: Seq<MergedData> | undefined = useMemo(() => {
    return map(fetcherVerif.entity?.data, fetcherData.entity?.data, (verif, data) => {
      const indexedData = seq(data).groupBy(_ => _.pay_det_tax_id_num ?? '')
      return seq(verif).map(_ => {
        const refArr = indexedData[_.pay_det_tax_id_num!]
        if (!refArr || refArr.length > 1) throw new Error('')
        const ref = refArr[0]
        return {
          dataCheck: _,
          data: ref,
          ok: columns.sum(c => _[c] === ref?.[c] ? 1 : 0),
        }
      })
    })
  }, [
    fetcherVerif.entity,
    fetcherData.entity,
  ])

  const errors = useMemo(() => {
    if (!mergedData) return
    return {
      allOk: mergedData.sum(_ => _.ok ?? 0),
      all: mergedData.length * columns.length,
    }
  }, [mergedData])

  return (
    <Page width="full">
      {errors && (
        <Div sx={{mb: 1, alignItems: 'stretch'}}>
          <SlidePanel sx={{flex: 1}}>
            <PieChartIndicator value={errors?.allOk} base={errors?.all} title={m._mealVerif.valid}/>
          </SlidePanel>
          <SlideWidget title={m._mealVerif.allIndicators} sx={{flex: 1}}>
            {errors.all}
          </SlideWidget>
          <SlideWidget title={m._mealVerif.allValidIndicators} sx={{flex: 1}} icon="check_circle">
            {errors.allOk}
          </SlideWidget>
          <SlideWidget title={m._mealVerif.allErrorIndicators} sx={{flex: 1}} icon="error">
            {errors.all - errors.allOk}
          </SlideWidget>
        </Div>
      )}
      <Panel>
        <Sheet
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
                <ScRadioGroupItem hideRadio value="all" title={<Icon sx={{verticalAlign: 'middle', transform: 'rotate(90deg)'}}>hourglass_full</Icon>}/>
                <ScRadioGroupItem hideRadio value="data" title={<Icon sx={{verticalAlign: 'middle', transform: 'rotate(90deg)'}}>hourglass_bottom</Icon>}/>
                <ScRadioGroupItem hideRadio value="dataCheck" title={<Icon sx={{verticalAlign: 'middle', transform: 'rotate(90deg)'}}>hourglass_top</Icon>}/>
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
                  <TableIconBtn tooltip={m._mealVerif.viewDataCheck} children="fact_check" onClick={() => setOpenModalAnswer(_.dataCheck)}/>
                </>
              )
            },
            ...columns.map(c => {
              return {
                id: c,
                type: 'select_one',
                head: ctx.translate.question(c),
                style: (_: MergedData) => {
                  if (_.dataCheck?.[c] === _.data?.[c]) {
                    return {}
                  } else
                    return {
                      color: t.palette.error.dark,
                      background: alpha(t.palette.error.main, .2)
                    }
                },
                renderOption: (_: MergedData) => _.dataCheck?.[c] === _.data?.[c] ? <Icon color="success">check</Icon> : <Icon color="error">close</Icon>,
                renderValue: (_: MergedData) => _.dataCheck?.[c] === _.data?.[c] ? '1' : '0',
                render: (_: MergedData) => {
                  const isOption = ctx.schemaHelper.questionIndex[c].type === 'select_one' || ctx.schemaHelper.questionIndex[c].type === 'select_multiple'
                  const dataCheck = isOption ? ctx.translate.choice(c, _.dataCheck?.[c] as string) : _.dataCheck?.[c]
                  const data = isOption ? ctx.translate.choice(c, _.data?.[c] as string) : _.data?.[c]
                  switch (display) {
                    case 'data':
                      return data
                    case 'dataCheck':
                      return dataCheck
                    case 'all':
                      return (data ?? '""') + ' = ' + (dataCheck ?? '""')
                  }
                }
              } as const
            }),
            {
              id: 'fin_det_oth_doc_im',
              head: ctx.translate.question('fin_det_oth_doc_im'),
              render: _ => _.dataCheck.fin_det_oth_doc_im,
            },
            {
              id: 'total',
              head: m.total,
              stickyEnd: true,
              align: 'right',
              style: _ => ({fontWeight: t.typography.fontWeightBold}),
              render: _ => (
                toPercent(_.ok / columns.length)
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