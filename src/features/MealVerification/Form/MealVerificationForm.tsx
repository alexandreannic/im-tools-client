import {useAppSettings} from '@/core/context/ConfigContext'
import React, {ReactNode} from 'react'
import {Page} from '@/shared/Page'
import {Box, Icon, Step, StepContent, StepLabel, Stepper, useTheme} from '@mui/material'
import {useI18n} from '@/core/i18n'
import {kobo, koboFormById, koboFormName} from '@/koboDrcUaFormId'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {Controller, useForm} from 'react-hook-form'
import {MealVerificationFormData} from '@/features/MealVerification/Form/MealVerificationFormData'
import {AaBtn, AaBtnProps} from '@/shared/Btn/AaBtn'
import {AaInput} from '@/shared/ItInput/AaInput'
import {Panel, PanelBody} from '@/shared/Panel'
import {KoboAnswerId} from '@/core/sdk/server/kobo/Kobo'
import {SheetFilterValue} from '@/shared/Sheet/util/sheetType'
import {Txt} from 'mui-extension'
import {useAsync} from '@/alexlib-labo/useAsync'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'
import {useAaToast} from '@/core/useToast'
import {MealVerificationAnsers, MealVerificationAnswersStatus} from '@/core/sdk/server/mealVerification/MealVerification'

const verifiableForms: (keyof typeof kobo.drcUa.form)[] = [
  'ecrec_cashRegistration',
]

const sampleSizeRatio = .2

export interface MealVerificationForm {
  formId: string
  name: string
  desc?: string
  filters: Record<KoboAnswerId, SheetFilterValue>
  answerIds: KoboAnswerId[]
}

const RenderRow = ({icon, label, children}: {
  icon?: string
  label: ReactNode
  children: ReactNode
}) => {
  return (
    <Box sx={{display: 'flex'}}>
      <Box sx={{width: 30, textAlign: 'center', mr: 1}}>
        {icon && <Icon color="disabled">{icon}</Icon>}
      </Box>
      <Box sx={{mb: 2}}>
        <Txt bold block sx={{mr: 2, mb: .5}}>{label}</Txt>
        <Txt block color="hint">{children}</Txt>
      </Box>
    </Box>
  )
}

const getRandomElements = <T, >(array: T[], coefficient: number): T[] => {
  if (coefficient < 0 || coefficient > 1) {
    throw new Error('Percentage must be between 0 and 100')
  }
  const numElementsToSelect = Math.floor((coefficient) * array.length)
  const shuffledArray = array.slice().sort(() => Math.random() - 0.5)
  return shuffledArray.slice(0, numElementsToSelect)
}


export const MealVerificationForm = () => {
  const {api} = useAppSettings()
  const {toastHttpError} = useAaToast()
  const [activeStep, setActiveStep] = React.useState(0)
  const t = useTheme()

  const asyncCreate = useAsync(api.mealVerification.create)

  useEffectFn(asyncCreate.lastError, toastHttpError)

  const nextStep = () => {
    setActiveStep(_ => _ + 1)
  }
  const prevStep = () => {
    setActiveStep(_ => Math.max(0, _ - 1))
  }

  const form = useForm<MealVerificationForm>()

  const BackBtn = ({}: {}) => (
    <AaBtn
      onClick={prevStep}
      sx={{mt: 1, mr: 1}}
    >
      Back
    </AaBtn>
  )

  const NextBtn = ({
    disabled,
    label,
    ...props
  }: {
    label?: string
  } & AaBtnProps) => (
    <AaBtn
      disabled={disabled}
      variant="contained"
      onClick={nextStep}
      {...props}
      sx={{mt: 1, mr: 1}}
    >
      {label ?? m.continue}
    </AaBtn>
  )

  const submit = (form: MealVerificationForm) => {
    const numElementsToSelect = Math.floor((sampleSizeRatio) * form.answerIds.length)
    const answers: MealVerificationAnsers[] = form.answerIds
      .sort(() => Math.random() - 0.5)
      .map((a, i) => ({
        koboAnswerId: a,
        status: i <= numElementsToSelect ? MealVerificationAnswersStatus.Selected : undefined
      }))
    asyncCreate.call({...form, answers})
  }

  const {m} = useI18n()
  return (
    <Page>
      <Panel title={m._mealVerif.requestTitle}>
        <PanelBody>
          <Stepper nonLinear activeStep={activeStep} orientation="vertical">
            <Step completed={!!form.watch('formId')}>
              <StepLabel>{m.selectForm}</StepLabel>
              <StepContent>
                <Controller
                  name="formId"
                  rules={{required: {value: true, message: m.required}}}
                  control={form.control}
                  render={({field}) => (
                    <ScRadioGroup {...field} onChange={id => {
                      if (id) nextStep()
                      field.onChange(id)
                    }}>
                      {verifiableForms.map(id =>
                        <ScRadioGroupItem key={id} value={kobo.drcUa.form[id]} title={koboFormName[id]}/>
                      )}
                    </ScRadioGroup>
                  )}
                />
                <Box sx={{my: 2}}>
                  <NextBtn disabled={!form.watch('formId')}/>
                </Box>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>{m.selectData}</StepLabel>
              <StepContent>
                <Txt color="hint" sx={{mb: 1}}>{m._mealVerif.applyFilters}</Txt>
                <MealVerificationFormData
                  formId={form.watch('formId')}
                  onDataChange={_ => form.setValue('answerIds', _)}
                  onFiltersChange={_ => form.setValue('filters', _)}
                />
                <Box sx={{mb: 2}}>
                  <NextBtn label={m._mealVerif.selectedNRows(form.watch('answerIds')?.length)}/>
                  <BackBtn/>
                </Box>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>{m.details}</StepLabel>
              <StepContent>
                <Controller
                  name="name"
                  rules={{required: {value: true, message: m.required}}}
                  control={form.control}
                  render={({field}) => (
                    <AaInput {...field} label={m._mealVerif.giveANameToId}/>
                  )}
                />
                <Controller
                  name="desc"
                  control={form.control}
                  render={({field}) => (
                    <AaInput multiline maxRows={8} minRows={3} {...field} label={m._mealVerif.giveDetails}/>
                  )}
                />
                <Box sx={{mb: 2}}>
                  <NextBtn disabled={!form.watch('name')}/>
                  <BackBtn/>
                </Box>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>{m.recap}</StepLabel>
              <StepContent>
                <RenderRow icon="info" label={form.watch('name')}>
                  {form.watch('desc')}
                </RenderRow>
                <RenderRow label={m._mealVerif.selectedKoboForm} icon="fact_check">
                  <Txt bold block size="big">{koboFormName[koboFormById[form.watch('formId')]]}</Txt>
                </RenderRow>
                <RenderRow label={m.filters} icon="filter_alt">
                  <Txt bold block size="big">{JSON.stringify(form.watch('filters'))}</Txt>
                </RenderRow>
                <RenderRow label={m.data} icon="table_view">
                  <Box dangerouslySetInnerHTML={{__html: m._mealVerif.selectedData(form.watch().answerIds?.length)}}/>
                  <Box sx={{mt: .5}}>
                    <Icon color="disabled" sx={{verticalAlign: 'top', mr: 1}}>subdirectory_arrow_right</Icon>
                    {m._mealVerif.sampleSize(sampleSizeRatio * 100)}
                    <Icon color="disabled" sx={{verticalAlign: 'top', mx: 1}}>east</Icon>
                    <Txt sx={{borderRadius: 1000, border: '1px solid ' + t.palette.success.light, py: .5, px: 1, color: t.palette.success.main}}
                         dangerouslySetInnerHTML={{
                           __html: m._mealVerif.dataToBeVerified(
                             Math.floor(sampleSizeRatio * form.watch().answerIds?.length)
                           )
                         }}/>
                  </Box>
                </RenderRow>

                <Box sx={{mb: 2}}>
                  <NextBtn label={m.submit} disabled={!form.formState.isValid} onClick={form.handleSubmit(submit)}/>
                  <BackBtn/>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </PanelBody>
      </Panel>
    </Page>
  )
}
