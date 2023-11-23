import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {kobo} from '@/koboDrcUaFormId'
import {KoboTypedAnswerSdk} from '@/core/sdk/server/kobo/KoboTypedAnswerSdk'
import {KeyOf} from '@/utils/utils'
import {KoboId} from '@/core/sdk/server/kobo/Kobo'
import {seq} from '@alexandreannic/ts-utils'

export type MealVerificationActivity<
  TData extends keyof ApiSdk['kobo']['typedAnswers'] = any,
  TCheck extends keyof ApiSdk['kobo']['typedAnswers'] = any,
> = {
  name: string
  activity: {
    koboFormId: KoboId,
    fetch: TData
    filters: (_: Awaited<ReturnType<KoboTypedAnswerSdk[TData]>>['data'][0]) => boolean
  }
  verification: {
    fetch: TCheck
    koboFormId: KoboId,
  },
  columns: (KeyOf<Awaited<ReturnType<KoboTypedAnswerSdk[TCheck]>>['data'][0]> & KeyOf<Awaited<ReturnType<KoboTypedAnswerSdk[TData]>>['data'][0]>)[]
  joinColumn: (KeyOf<Awaited<ReturnType<KoboTypedAnswerSdk[TCheck]>>['data'][0]> & KeyOf<Awaited<ReturnType<KoboTypedAnswerSdk[TData]>>['data'][0]>)
}

const registerActivity = <
  TData extends keyof ApiSdk['kobo']['typedAnswers'],
  TCheck extends keyof ApiSdk['kobo']['typedAnswers'],
>(_: MealVerificationActivity<TData, TCheck>) => {
  return _
}

export const mealVerificationActivities = seq([
  registerActivity({
    name: 'ECREC Cash Registration',
    activity: {
      koboFormId: kobo.drcUa.form.ecrec_cashRegistration,
      fetch: 'searchEcrec_cashRegistration',
      filters: _ => true,
    },
    verification: {
      koboFormId: kobo.drcUa.form.meal_verificationEcrec,
      fetch: 'searchMeal_verificationEcrec',
    },
    joinColumn: 'pay_det_tax_id_num',
    columns: [
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
    ]
  }),
  registerActivity({
    name: 'Cash for Fuel & Cash for Utilities',
    activity: {
      koboFormId: kobo.drcUa.form.bn_re,
      fetch: 'searchBn_Re',
      filters: _ => !!(_.back_prog_type && [_.back_prog_type].flat().find(_ => /^c(sf|fu)/.test(_))),
    },
    verification: {
      koboFormId: kobo.drcUa.form.meal_verificationWinterization,
      fetch: 'searchMeal_verificationWinterization',
    },
    joinColumn: 'pay_det_tax_id_num',
    columns: [
      'back_enum',
      'back_donor',
      'back_prog_type',
      'back_consent',
      'back_consen_no_reas',
      'pay_det_tax_id_num',
      'ben_det_surname',
      'ben_det_first_name',
      'ben_det_pat_name',
      'ben_det_ph_number',
      'ben_det_oblast',
      'ben_det_raion',
      'ben_det_hromada',
      'ben_det_settlement',
      'ben_det_res_stat',
      'ben_det_prev_oblast',
      'ben_det_income',
      'ben_det_hh_size',
      'current_gov_assist_cff',
      'utilities_fuel',
      'mains_utilities',
      'mains_utilities_other',
      'mains_fuel',
      'mains_fuel_other',
      'functioning_fuel_delivery',
    ]
  })
])

export const mealVerificationActivitiesIndex = mealVerificationActivities.groupByFirst(_ => _.name)
