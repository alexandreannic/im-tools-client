import {useAppSettings} from '@/core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {fnSwitch, map, Seq, seq} from '@alexandreannic/ts-utils'
import React, {ReactNode, useEffect, useMemo, useState} from 'react'
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
import {MealVerificationAnsers, MealVerificationAnswersStatus, MealVerificationStatus} from '@/core/sdk/server/mealVerification/MealVerification'
import {mealVerificationActivities, MealVerificationActivity, mealVerificationConf} from '@/features/MealVerification/mealVerificationConfig'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {SheetSkeleton} from '@/shared/Sheet/SheetSkeleton'
import {useAsync} from '@/alexlib-labo/useAsync'
import {getColumnByQuestionSchema} from '@/features/Database/KoboTable/getColumnBySchema'
import {MealVerificationLinkToForm} from '@/features/MealVerification/MealVerificationList'

export enum MergedDataStatus {
  Selected = 'Selected',
  Completed = 'Completed',
  NotSelected = 'NotSelected'
}

interface MergedData {
  status: MergedDataStatus
  dataCheck?: KoboAnswer<any>
  data: KoboAnswer<any>
  score: number
}

const paramSchema = yup.object({id: yup.string().required()})

function Link(props: {href: string, target: string, children: ReactNode}) {
  return null
}

export const MealVerificationTable = () => {
  const {m} = useI18n()
  const t = useTheme()
  const {id} = paramSchema.validateSync(useParams())
  const {api, conf} = useAppSettings()
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
      fetcherSchema.fetch({force: false, clean: false}, activity.registration.koboFormId)
      fetcherVerificationAnswers.fetch({force: false, clean: false}, mealVerification.id)
    }
  }, [mealVerification, activity])

  return (
    <Page width="full">
      {fetcherSchema.entity && fetcherVerificationAnswers.entity && activity && mealVerification ? (
        <>
          <PageTitle
            action={
              <>
                <AaSelectSingle
                  label={m.status}
                  sx={{minWidth: 140}}
                  disabled={!ctx.access.admin}
                  value={mealVerification.status}
                  options={[
                    {
                      children: <>
                        <Icon sx={{verticalAlign: 'middle', mr: .5, color: t.palette.success.main}} title={m.Approved}>check_circle</Icon>
                        {m.Approved}
                      </>, value: MealVerificationStatus.Approved
                    },
                    {
                      children: <>
                        <Icon sx={{verticalAlign: 'middle', mr: .5, color: t.palette.error.main}} title={m.Rejected}>error</Icon>
                        {m.Rejected}
                      </>, value: MealVerificationStatus.Rejected
                    },
                    {
                      children: <>
                        <Icon sx={{verticalAlign: 'middle', mr: .5, color: t.palette.warning.main}} title={m.Pending}>schedule</Icon>
                        {m.Pending}
                      </>, value: MealVerificationStatus.Pending
                    },
                  ]}
                  onChange={(e) => {
                    ctx.asyncUpdate.call(mealVerification.id, e ?? undefined)
                  }}
                />
              </>
            }
            subTitle={
              <Box>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  <MealVerificationLinkToForm koboFormId={activity.registration.koboFormId} sx={{mr: 2}}/>
                  <MealVerificationLinkToForm koboFormId={activity.verification.koboFormId}/>
                </Box>

                {capitalize(dateFromNow(mealVerification.createdAt))} by <b>{mealVerification.createdBy}</b>
                <Box>{mealVerification.desc}</Box>
              </Box>
            }>{mealVerification.name}</PageTitle>
          <KoboSchemaProvider schema={fetcherSchema.entity}>
            <MealVerificationTableContent
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

const MealVerificationTableContent = <
  TData extends keyof ApiSdk['kobo']['typedAnswers'] = any,
  TCheck extends keyof ApiSdk['kobo']['typedAnswers'] = any,
>({
  activity,
  verificationAnswers,
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

  const indexVerification = useMemo(() => seq(verificationAnswers).groupByFirst(_ => _.koboAnswerId), [verificationAnswers])

  const fetcherDataOrigin = useFetcher(() => api.kobo.typedAnswers[activity.registration.fetch]().then(_ => _.data) as Promise<KoboAnswer<any, any>[]>)
  const fetcherDataVerified = useFetcher(() => api.kobo.typedAnswers[activity.verification.fetch]().then(_ => _.data) as Promise<KoboAnswer<any, any>[]>)
  const asyncUpdateAnswer = useAsync(api.mealVerification.updateAnswers, {requestKey: _ => _[0]})

  const [openModalAnswer, setOpenModalAnswer] = useState<KoboAnswer<any> | undefined>()
  const [display, setDisplay] = useState<'data' | 'dataCheck' | 'all'>('all')

  useEffect(() => {
    fetcherDataVerified.fetch()
    fetcherDataOrigin.fetch()
  }, [])

  const areEquals = (c: string, _: Pick<MergedData, 'data' | 'dataCheck'>) => {
    if (!_.dataCheck) return true
    if (_.dataCheck[c] === undefined && _.data?.[c] === undefined) return true
    switch (ctxSchema.schemaHelper.questionIndex[c].type) {
      case 'select_multiple':
        const checkArr = [_.dataCheck[c]].flat() as string[]
        const dataArr = [_.data?.[c]].flat() as string[]
        if (_.dataCheck[c] === undefined || _.data?.[c] === undefined) return _.dataCheck[c] === _.data?.[c]
        return checkArr.every(c => (dataArr.find(d => c === d)))
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
    return map(fetcherDataOrigin.entity, fetcherDataVerified.entity, (origin, verified) => {
      const indexDataVerified = seq(verified).groupBy(_ => _[activity.joinColumn] ?? '')
      return seq(origin).filter(_ => indexVerification[_.id]).map(_ => {
        const dataVerified = indexDataVerified[_[activity.joinColumn]]
        if (dataVerified && dataVerified.length > 1) throw new Error(_[activity.joinColumn] + ' exist ' + dataVerified?.length)
        const mergedData: Omit<MergedData, 'score'> = {
          data: _,
          dataCheck: dataVerified?.[0],
          status: (() => {
            if (!!dataVerified) return MergedDataStatus.Completed
            if (indexVerification[_.id]?.status === MealVerificationAnswersStatus.Selected) return MergedDataStatus.Selected
            return MergedDataStatus.NotSelected
          })(),
        }
        const res: MergedData = {
          ...mergedData,
          score: seq(activity.verifiedColumns).sum(c => areEquals(c, mergedData) ? 1 : 0),
        }
        return res
      }).sortByNumber(_ => fnSwitch(_.status, {
        [MergedDataStatus.Completed]: 1,
        [MergedDataStatus.NotSelected]: 2,
        [MergedDataStatus.Selected]: 0,
      }))
    })
  }, [
    fetcherDataVerified.entity,
    fetcherDataOrigin.entity,
    indexVerification,
  ])

  const stats = useMemo(() => {
    if (!mergedData) return
    const verifiedRows = mergedData.filter(_ => _.status === MergedDataStatus.Completed)
    const selectedRows = mergedData?.filter(_ => _.status !== MergedDataStatus.NotSelected)
    return {
      selectedRows,
      verifiedRows,
      globalScore: verifiedRows.sum(_ => _.score ?? 0),
      indicatorsCount: selectedRows.length * activity.verifiedColumns.length,
    }
  }, [mergedData])

  const unselectedAnswers = useMemo(
    () => verificationAnswers.filter(_ => _.status !== MealVerificationAnswersStatus.Selected).sort(() => Math.random() - .5),
    [verificationAnswers]
  )

  return (
    <>
      {stats && (
        <Div sx={{mb: 2, alignItems: 'stretch'}}>
          <SlidePanel sx={{flex: 1}}>
            <PieChartIndicator
              value={stats.selectedRows.length ?? 0}
              base={verificationAnswers.length}
              title={m._mealVerif.sampleSize}
              dense showBase showValue
            />
          </SlidePanel>
          <SlidePanel sx={{flex: 1}}>
            <PieChartIndicator dense showValue value={stats?.verifiedRows.length ?? 0} base={stats.selectedRows?.length ?? 1} title={m._mealVerif.verified}/>
          </SlidePanel>
          <SlidePanel sx={{flex: 1}}>
            <PieChartIndicator dense showValue showBase value={stats?.globalScore ?? 0} base={stats?.indicatorsCount ?? 1} title={m._mealVerif.valid}/>
          </SlidePanel>
          <SlideWidget title={m._mealVerif.numericToleranceMargin} sx={{flex: 1}} icon="expand">
            {toPercent(mealVerificationConf.numericToleranceMargin)}
          </SlideWidget>
        </Div>
      )}
      <Panel>
        <Sheet
          showExportBtn
          id="meal-verif-ecrec"
          loading={fetcherDataVerified.loading || fetcherDataOrigin.loading}
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
            </>
          }
          columns={[
            {
              id: 'actions',
              width: 124,
              renderExport: false,
              head: '',
              style: _ => ({fontWeight: t.typography.fontWeightBold}),
              render: _ => {
                const verif = indexVerification[_.data.id]
                return (
                  <>
                    <TableIconBtn tooltip={m._mealVerif.viewRegistrationData} children="text_snippet" onClick={() => setOpenModalAnswer(_.data)}/>
                    <TableIconBtn tooltip={m._mealVerif.viewDataCheck} disabled={!_.dataCheck} children="fact_check" onClick={() => setOpenModalAnswer(_.dataCheck)}/>
                    {ctx.access.write && fnSwitch(_.status, {
                      NotSelected: (
                        <>
                          <TableIconBtn
                            color="primary"
                            loading={asyncUpdateAnswer.loading.get(verif.id)}
                            children="add"
                            onClick={() => asyncUpdateAnswer.call(verif.id, MealVerificationAnswersStatus.Selected).then(verificationAnswersRefresh)}
                          />
                        </>
                      ),
                      Selected: (
                        <>
                          <TableIconBtn
                            children="delete"
                            loading={asyncUpdateAnswer.loading.get(verif.id)}
                            onClick={() => asyncUpdateAnswer.call(verif.id,).then(verificationAnswersRefresh)}
                          />
                          <TableIconBtn
                            children="casino"
                            loading={asyncUpdateAnswer.loading.get(verif.id)}
                            disabled={unselectedAnswers.length === 0 || asyncUpdateAnswer.isLoading}
                            onClick={() => {
                              Promise.all([
                                asyncUpdateAnswer.call(verif.id,),
                                asyncUpdateAnswer.call(unselectedAnswers.pop()?.id!, MealVerificationAnswersStatus.Selected,)
                              ]).then(verificationAnswersRefresh)
                            }}
                          />
                        </>
                      )
                    }, () => undefined)}
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
              renderValue: _ => _.status,
              renderOption: _ => fnSwitch(_.status, {
                NotSelected: <TableIcon color="disabled">do_disturb_on</TableIcon>,
                Completed: <TableIcon color="success">check_circle</TableIcon>,
                Selected: <TableIcon color="warning">schedule</TableIcon>,
              }),
              render: _ => fnSwitch(_.status, {
                NotSelected: <TableIcon color="disabled">do_disturb_on</TableIcon>,
                Completed: <TableIcon color="success">check_circle</TableIcon>,
                Selected: <TableIcon color="warning">schedule</TableIcon>,
              })
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
                      background: alpha(t.palette.error.main, .08)
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
                _.dataCheck ? toPercent(_.score / activity.verifiedColumns.length) : ''
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