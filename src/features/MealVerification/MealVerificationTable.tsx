import {useAppSettings} from '@/core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {map, Seq, seq} from '@alexandreannic/ts-utils'
import React, {useEffect, useMemo, useState} from 'react'
import {Page, PageTitle} from '@/shared/Page'
import {Sheet} from '@/shared/Sheet/Sheet'
import {alpha, Box, Icon, Tooltip, useTheme} from '@mui/material'
import {capitalize, toPercent} from '@/utils/utils'
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
import {mealVerificationActivities, MealVerificationActivity, mealVerificationConf} from '@/features/MealVerification/mealVerificationConfig'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {ApiPaginate} from '@/core/type'
import {SheetSkeleton} from '@/shared/Sheet/SheetSkeleton'
import {useAsync} from '@/alexlib-labo/useAsync'
import {getColumnByQuestionSchema} from '@/features/Database/KoboTable/getColumnBySchema'
import {useSession} from '@/core/Session/SessionContext'
import {AaBtn} from '@/shared/Btn/AaBtn'

interface MergedData {
  dataCheck?: KoboAnswer<any>
  data: KoboAnswer<any>
  ok: number
}

const paramSchema = yup.object({id: yup.string().required()})

export const MealVerificationTable = () => {
  const {id} = paramSchema.validateSync(useParams())
  const {api} = useAppSettings()
  const ctx = useMealVerificationContext()
  const fetcherSchema = useFetcher((formId: KoboId) => api.koboApi.getForm({id: formId}))
  const fetcherVerificationAnswers = useFetcher(api.mealVerification.getAnswers)
  const {dateFromNow} = useI18n()

  useEffect(() => {
    ctx.fetcherVerifications.fetch({force: true})
  }, [])

  const {mealVerification, activity} = useMemo(() => {
    const mealVerification = ctx.fetcherVerifications.entity?.find(_ => _.id === id)
    return {
      mealVerification,
      activity: mealVerificationActivities.find(_ => _.name === mealVerification?.activity)
    }
  }, [id, ctx.fetcherVerifications.entity])

  useEffect(() => {
    if (mealVerification && activity) {
      fetcherSchema.fetch({force: false, clean: false}, activity.activity.koboFormId)
      fetcherVerificationAnswers.fetch({force: false, clean: false}, mealVerification.id)
    }
  }, [mealVerification, activity])

  return (
    <Page width="full">
      {fetcherSchema.entity && fetcherVerificationAnswers.entity && activity && mealVerification ? (
        <>
          <PageTitle subTitle={
            <Box>
              {capitalize(dateFromNow(mealVerification.createdAt))} by <b>{mealVerification.createdBy}</b>
              <Box>{mealVerification.desc}</Box>
            </Box>
          }>{mealVerification.name}</PageTitle>
          <KoboSchemaProvider schema={fetcherSchema.entity}>
            <MealVerificationEcrec
              activity={activity}
              verificationAnswers={fetcherVerificationAnswers.entity}
              verificationAnswersRefresh={() => fetcherVerificationAnswers.fetch({force: true, clean: false}, mealVerification.id)}
            />
          </KoboSchemaProvider>
        </>
      ) : (
        <SheetSkeleton/>
      )}
    </Page>
  )
}

const MealVerificationEcrec = <
  TData extends keyof ApiSdk['kobo']['typedAnswers'] = any,
  TCheck extends keyof ApiSdk['kobo']['typedAnswers'] = any,
>({
  verificationAnswers,
  activity,
  verificationAnswersRefresh,
}: {
  activity: MealVerificationActivity<TData, TCheck>
  verificationAnswers: MealVerificationAnsers[]
  verificationAnswersRefresh: () => Promise<any>
}) => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const t = useTheme()
  const ctxSchema = useKoboSchemaContext()
  const ctx = useMealVerificationContext()

  const idToVerifyIndex = useMemo(() => seq(verificationAnswers).groupByFirst(_ => _.koboAnswerId), [verificationAnswers])

  const fetcherData = useFetcher(() => api.kobo.typedAnswers[activity.activity.fetch]().then(_ => _.data) as Promise<KoboAnswer<any, any>[]>)
  const fetcherVerif = useFetcher(() => api.kobo.typedAnswers[activity.verification.fetch]() as Promise<ApiPaginate<any>>)
  const asyncUpdateAnswer = useAsync(api.mealVerification.updateAnswers, {requestKey: _ => _[0]})

  const [openModalAnswer, setOpenModalAnswer] = useState<KoboAnswer<any> | undefined>()
  const [display, setDisplay] = useState<'data' | 'dataCheck' | 'all'>('all')

  useEffect(() => {
    fetcherVerif.fetch()
    fetcherData.fetch()
  }, [])

  const areEquals = (c: string, _: Pick<MergedData, 'data' | 'dataCheck'>) => {
    if (!_.dataCheck) return true
    if (_.dataCheck[c] === undefined && _.data?.[c] === undefined) return true
    switch (ctxSchema.schemaHelper.questionIndex[c].type) {
      case 'select_multiple':
        const checkArr = [_.dataCheck[c]].flat() as string[]
        const dataArr = [_.data?.[c]].flat() as string[]
        if (_.dataCheck[c] === undefined || _.data?.[c] === undefined) return _.dataCheck[c] === _.data?.[c]
        return checkArr.every(c => (dataArr.find(d => c === d))), checkArr, dataArr
      case 'decimal':
      case 'integer':
        return Math.abs(_.dataCheck[c] - _.data?.[c]) <= _.data?.[c] * mealVerificationConf.numericToleranceMargin
      case 'text':
        return _.dataCheck[c]?.trim() === _.data?.[c]?.trim()
      default:
        return _.dataCheck[c] === _.data?.[c]
    }
  }

  const mergedData: Seq<MergedData> | undefined = useMemo(() => {
    return map(fetcherVerif.entity?.data, fetcherData.entity, (verif, data) => {
      const indexedVerif = seq(verif).groupBy(_ => _[activity.joinColumn] ?? '')
      return seq(data.filter(_ => idToVerifyIndex[_.id]?.status === MealVerificationAnswersStatus.Selected)).map(_ => {
        const refArr = indexedVerif[_[activity.joinColumn]!]
        if (!refArr) return {
          data: _,
          ok: 0,
        }
        if (refArr.length > 1) throw new Error(_[activity.joinColumn] + ' exist ' + refArr?.length)
        const ref = refArr[0]
        const dataMerge = {
          dataCheck: ref,
          data: _,
        }
        return {
          ...dataMerge,
          ok: seq(activity.verifiedColumns).sum(c => areEquals(c, dataMerge) ? 1 : 0),
        } as MergedData
      }).compact().sortByNumber(_ => _.dataCheck ? 1 : 0)
    })
  }, [
    fetcherVerif.entity,
    fetcherData.entity,
    idToVerifyIndex,
  ])

  const stats = useMemo(() => {
    if (!mergedData) return
    const verified = mergedData.filter(_ => _.dataCheck)
    return {
      indicatorsOk: mergedData.sum(_ => _.ok ?? 0),
      indicatorsVerified: verified.length * activity.verifiedColumns.length,
      verifiedRows: verified.length,
    }
  }, [mergedData])

  const unselectedAnswers = useMemo(() => verificationAnswers.filter(_ => _.status !== MealVerificationAnswersStatus.Selected).sort(() => Math.random() - .5),
    [verificationAnswers])

  return (
    <>
      {stats && (
        <Div sx={{mb: 2, alignItems: 'stretch'}}>
          <SlidePanel sx={{flex: 1}}>
            <PieChartIndicator
              dense value={mergedData?.length ?? 0} base={verificationAnswers.length}
              title={m._mealVerif.sampleSize}
              showBase showValue
            />
          </SlidePanel>
          <SlidePanel sx={{flex: 1}}>
            <PieChartIndicator dense value={stats?.verifiedRows ?? 0} base={mergedData?.length ?? 1} title={m._mealVerif.verified}/>
          </SlidePanel>
          <SlidePanel sx={{flex: 1}}>
            <PieChartIndicator dense value={stats?.indicatorsOk ?? 0} base={stats?.indicatorsVerified ?? 1} title={m._mealVerif.valid}/>
          </SlidePanel>
          <SlideWidget title={m._mealVerif.allIndicators} sx={{flex: 1}} icon="view_module">
            {stats.indicatorsVerified}
          </SlideWidget>
          <SlideWidget title={m._mealVerif.allValidIndicators} sx={{flex: 1}} icon="check_circle">
            {stats.indicatorsOk}
          </SlideWidget>
          <SlideWidget title={m._mealVerif.allErrorIndicators} sx={{flex: 1}} icon="error">
            {stats.indicatorsVerified - stats.indicatorsOk}
          </SlideWidget>
          <SlideWidget title={m._mealVerif.numericToleranceMargin} sx={{flex: 1}} icon="expand">
            {toPercent(mealVerificationConf.numericToleranceMargin)}
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
                value={ctxSchema.langIndex}
                onChange={ctxSchema.setLangIndex}
                options={[
                  {children: 'XML', value: -1},
                  ...ctxSchema.schemaHelper.sanitizedSchema.content.translations.map((_, i) => ({children: _, value: i}))
                ]}
              />
              <ScRadioGroup inline dense value={display} onChange={setDisplay} sx={{mr: 1}}>
                <ScRadioGroupItem hideRadio value="all" title={
                  <Tooltip title={m._mealVerif.showBoth}>
                    <Icon sx={{verticalAlign: 'middle', transform: 'rotate(90deg)'}}>hourglass_full</Icon>
                  </Tooltip>
                }/>
                <ScRadioGroupItem hideRadio value="data" title={
                  <Tooltip title={m._mealVerif.activityForm}>
                    <Icon sx={{verticalAlign: 'middle', transform: 'rotate(90deg)'}}>hourglass_bottom</Icon>
                  </Tooltip>
                }/>
                <ScRadioGroupItem hideRadio value="dataCheck" title={
                  <Tooltip title={m._mealVerif.verificationForm}>
                    <Icon sx={{verticalAlign: 'middle', transform: 'rotate(90deg)'}}>hourglass_top</Icon>
                  </Tooltip>
                }/>
              </ScRadioGroup>
              {ctx.access.write && (
                <AaBtn icon="add" variant="contained" color="primary" sx={{marginLeft: 'auto', mr: 1}} onClick={() => {
                  asyncUpdateAnswer.call(unselectedAnswers.pop()?.id!, MealVerificationAnswersStatus.Selected,).then(verificationAnswersRefresh)
                }}>
                  {m.add}
                </AaBtn>
              )}
            </>
          }
          columns={[
            {
              id: 'actions',
              width: 140,
              renderExport: false,
              head: '',
              style: _ => ({fontWeight: t.typography.fontWeightBold}),
              render: _ => {
                const status = idToVerifyIndex[_.data.id]
                return (
                  <>
                    <TableIconBtn tooltip={m._mealVerif.viewData} children="text_snippet" onClick={() => setOpenModalAnswer(_.data)}/>
                    <TableIconBtn tooltip={m._mealVerif.viewDataCheck} disabled={!_.dataCheck} children="fact_check" onClick={() => setOpenModalAnswer(_.dataCheck)}/>
                    {ctx.access.write && (
                      <>
                        <TableIconBtn
                          children="delete"
                          loading={asyncUpdateAnswer.loading.get(status.id)}
                          disabled={status.status !== MealVerificationAnswersStatus.Selected}
                          onClick={() => asyncUpdateAnswer.call(status.id,).then(verificationAnswersRefresh)}
                        />
                        <TableIconBtn
                          children="casino"
                          loading={asyncUpdateAnswer.loading.get(status.id)}
                          disabled={unselectedAnswers.length === 0 || asyncUpdateAnswer.isLoading || status.status !== MealVerificationAnswersStatus.Selected || _.ok === 1}
                          onClick={() => {
                            Promise.all([
                              asyncUpdateAnswer.call(status.id,),
                              asyncUpdateAnswer.call(unselectedAnswers.pop()?.id!, MealVerificationAnswersStatus.Selected,)
                            ]).then(verificationAnswersRefresh)
                          }}
                        />
                      </>
                    )}
                  </>
                )
              },
            },
            {
              id: 'taxid',
              head: m.taxID,
              type: 'string',
              render: _ => _.data[activity.joinColumn]
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
            ...activity.dataColumns?.flatMap(c => {
              const q = ctxSchema.schemaHelper.questionIndex[c]
              const w = getColumnByQuestionSchema({
                data: mergedData,
                q,
                groupSchemas: ctxSchema.schemaHelper.groupSchemas,
                translateChoice: ctxSchema.translate.choice,
                translateQuestion: ctxSchema.translate.question,
                m,
                getRow: _ => _.data,
                choicesIndex: ctxSchema.schemaHelper.choicesIndex,
              })
              return w as any
            }) ?? [],
            ...activity.verifiedColumns.map(c => {
              return {
                id: c,
                type: 'select_one',
                head: ctxSchema.translate.question(c),
                style: (_: MergedData) => {
                  if (areEquals(c, _)) {
                    return {}
                  } else
                    return {
                      color: t.palette.error.dark,
                      background: alpha(t.palette.error.main, .2)
                    }
                },
                renderExport: (_: MergedData) => {
                  const isOption = ctxSchema.schemaHelper.questionIndex[c].type === 'select_one' || ctxSchema.schemaHelper.questionIndex[c].type === 'select_multiple'
                  const dataCheck = _.dataCheck && isOption ? ctxSchema.translate.choice(c, _.dataCheck?.[c] as string) : _.dataCheck?.[c]
                  const data = isOption ? ctxSchema.translate.choice(c, _.data?.[c] as string) : _.data?.[c]
                  switch (display) {
                    case 'data':
                      return data
                    case 'dataCheck':
                      return dataCheck ?? '???'
                    case 'all':
                      return (data ?? '""') + ' = ' + (dataCheck ?? '???')
                  }
                },
                renderOption: (_: MergedData) => _.dataCheck
                  ? areEquals(c, _) ? <Icon color="success">check</Icon> : <Icon color="error">close</Icon>
                  : '',
                renderValue: (_: MergedData) => _.dataCheck
                  ? areEquals(c, _) ? '1' : '0'
                  : '',
                render: (_: MergedData) => {
                  const isOption = ctxSchema.schemaHelper.questionIndex[c].type === 'select_one' || ctxSchema.schemaHelper.questionIndex[c].type === 'select_multiple'
                  const dataCheck = _.dataCheck && isOption ? ctxSchema.translate.choice(c, _.dataCheck?.[c] as string) : _.dataCheck?.[c]
                  const data = isOption ? ctxSchema.translate.choice(c, _.data?.[c] as string) : _.data?.[c]
                  switch (display) {
                    case 'data':
                      return data
                    case 'dataCheck':
                      return dataCheck ?? <TableIcon color="disabled">schedule</TableIcon>
                    case 'all':
                      return <>{data ?? '""'} = {_.dataCheck ? dataCheck ?? '""' : <TableIcon color="disabled">schedule</TableIcon>}</>
                  }
                }
              } as const
            }),
            {
              id: 'total',
              head: m.total,
              stickyEnd: true,
              align: 'right',
              style: _ => ({fontWeight: t.typography.fontWeightBold}),
              render: _ => (
                _.dataCheck ? toPercent(_.ok / activity.verifiedColumns.length) : ''
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
    </>
  )
}