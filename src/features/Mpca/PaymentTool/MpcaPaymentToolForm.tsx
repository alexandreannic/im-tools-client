import {MpcaPayment, MpcaPaymentUpdate} from '../../../core/sdk/server/mpcaPaymentTool/MpcaPayment'
import {Controller, useForm} from 'react-hook-form'
import {AaSelect} from '@/shared/Select/Select'
import React, {useEffect} from 'react'
import {useI18n} from '../../../core/i18n'
import {Row} from '@/shared/Row'
import {AaInput} from '@/shared/ItInput/AaInput'
import {AAIconBtn} from '@/shared/IconBtn'

const budgetLines = [
  {value: '', children: ''},
  {value: 'UKR-000284', children: 'UKR-000284'},
]

export const MpcaPaymentToolForm = ({
  tool,
  onChange
}: {
  tool: MpcaPayment
  onChange: (_: MpcaPaymentUpdate) => void
}) => {
  const {m} = useI18n()
  const {
    register,
    getValues,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm<Pick<MpcaPayment, 'budgetLineCFR'
    | 'budgetLineStartUp'
    | 'city'
    | 'budgetLineMPCA'
    | 'headOfOperation'
    | 'cashAndVoucherAssistanceAssistant'
    | 'financeAndAdministrationOfficer'>
  >()

  useEffect(() => {
    const subscription = watch(_ => {
      console.log(_)
      onChange(_)
    })
    return () => subscription.unsubscribe()
  }, [watch])

  return (
    <>
      <Row icon="person" noBorder label={m.mpcaDb.headOfOperations}>
        <AAIconBtn sx={{ml: 1}} icon="gesture" color="primary"/>
        <AaInput defaultValue={tool.headOfOperation} {...register('headOfOperation')}/>
      </Row>
      <Row icon="" noBorder label={m.mpcaDb.financeAndAdministrationOfficer}>
        <AAIconBtn sx={{ml: 1}} icon="gesture" color="primary"/>
        <AaInput defaultValue={tool.financeAndAdministrationOfficer} {...register('financeAndAdministrationOfficer')}/>
      </Row>
      <Row icon="" label={m.mpcaDb.cashAndVoucherAssistanceAssistant}>
        <AAIconBtn sx={{ml: 1}} icon="gesture" color="primary"/>
        <AaInput defaultValue={tool.cashAndVoucherAssistanceAssistant} {...register('cashAndVoucherAssistanceAssistant')}/>
      </Row>
      <Row icon="place" label={m.city}>
        <Controller
          name="city"
          defaultValue={tool.city}
          control={control}
          render={({field}) => <AaSelect value={field.value ?? ''} onChange={_ => field.onChange({target: {value: _}} as any)} options={[
            {value: '', children: ''},
            {value: 'Kyiv', children: m.kyiv},
            {value: 'Mykolaiv', children: m.mykolaiv},
          ]}/>}
        />
      </Row>
      <Row icon="savings" noBorder label={m.mpcaDb.budgetLineCFR}>
        <Controller
          name="budgetLineCFR"
          defaultValue={tool.budgetLineCFR}
          control={control}
          render={({field}) => <AaSelect value={field.value ?? ''} onChange={_ => field.onChange({target: {value: _}} as any)} options={budgetLines}/>}
        />
      </Row>
      <Row icon={''} noBorder label={m.mpcaDb.budgetLineMPCA}>
        <Controller
          name="budgetLineMPCA"
          defaultValue={tool.budgetLineMPCA}
          control={control}
          render={({field}) => <AaSelect value={field.value ?? ''} onChange={_ => field.onChange({target: {value: _}} as any)} options={budgetLines}/>}
        />
      </Row>
      <Row icon={''} label={m.mpcaDb.budgetLineStartUp}>
        <Controller
          name="budgetLineStartUp"
          defaultValue={tool.budgetLineStartUp}
          control={control}
          render={({field}) => <AaSelect value={field.value ?? ''} onChange={_ => field.onChange({target: {value: _}} as any)} options={budgetLines}/>}
        />
      </Row>
    </>
  )

}