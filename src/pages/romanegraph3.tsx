import {Box} from '@mui/material'
import React, {ReactNode, useCallback, useEffect} from 'react'
import {Txt} from 'mui-extension'
import {PanelFeatures} from '@/shared/Panel/PanelFeatures'
import {useAppSettings} from '@/core/context/ConfigContext'
import {endOfMonth, startOfMonth} from 'date-fns'
import {enrichProtHHS_2_1} from '@/features/Protection/DashboardMonito/dashboardHelper'
import {DeepPartial, Enum, seq} from '@alexandreannic/ts-utils'
import {snapshotAlternateColor} from '@/features/Snapshot/SnapshotProtMonitoEcho/SnapshotProtMonitoEcho'
import {ChartBarStacker} from '@/shared/charts/ChartBarStacked'
import {SnapshotHeader} from '@/features/Snapshot/SnapshotHeader'
import {Protection_Hhs2_1Options} from '@/core/sdk/server/kobo/generatedInterface/Protection_Hhs2_1/Protection_Hhs2_1Options'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {useI18n} from '@/core/i18n'
import {useFetcher} from '@/shared/hook/useFetcher'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'
import {ChartBarMultipleBy} from '@/shared/charts/ChartBarMultipleBy'
import {Person} from '@/core/type/person'
import {Period} from '@/core/type/period'

export const Pan = ({
  title,
  children
}: {
  title: string
  children: ReactNode
}) => {
  return (
    <Box sx={{
      maxWidth: 500,
      margin: 'auto',
      my: 1,
    }}>
      <Txt block size="big" bold sx={{textAlign: 'center', mt: 2, mb: 1}}>{title}</Txt>
      <PanelFeatures savableAsImg>
        <Box sx={{
          // p: .5
        }}>
          <Box sx={{
            // border: t => `1px solid ${t.palette.divider}`,
            p: 1,
            // borderRadius: '8px',
          }}>
            {/*<Txt block size="big" bold sx={{textAlign: 'center', mb: 1}}>{title}</Txt>*/}
            {children}
          </Box>
        </Box>
      </PanelFeatures>
    </Box>
  )
}

const period: Period = {
  start: startOfMonth(new Date(2023, 6)),
  end: endOfMonth(new Date(2023, 8)),
}

const translationsUa: DeepPartial<typeof Protection_Hhs2_1Options> = {
  'do_you_identify_as_any_of_the_following': {
    idp: 'Внутрішньо переміщена особа',
    non_displaced: 'Не переміщена особа',
    returnee: 'Особа, котра повернулася',
    refugee: 'Біженець'
  },
  'what_are_your_households_intentions_in_terms_of_place_of_residence': {
    return_to_the_area_of_origin: 'Повернутися до місця постійного проживання',
    integrate_into_the_local_community_of_current_place_of_residence: 'Інтегруватися місцеву громаду',
    relocate_to_another_area_in_ukraine: 'Переїхати до іншої області України',
    relocate_to_a_country_outside_of_ukraine: 'Переїхати до іншої країни',
    stay_in_place_of_habitual_residence: 'Залишатися в місці постійного проживання',
    // relocate_to_another_area_in_ukraine: 'Переїхати до іншої області України',
    // relocate_to_a_country_outside_of_ukraine: 'Переїхати до іншої країни'
  },
  // 'what_are_your_households_intentions_in_terms_of_place_of_residence': {
  // },
  // 'what_are_your_households_intentions_in_terms_of_place_of_residence': {
  //   stay_in_place_of_habitual_residence: 'Залишатися в місці постійного проживання',
  // },
  'what_are_the_main_factors_that_make_this_location_feel_unsafe': {
    bombardment_shelling_or_threat_of_shelling: 'Бомбардування/обстріли або загроза обстрілів',
    presence_of_armed_or_security_actors: 'Присутність збройних сил або силових структур',
    landmines_or_uxos_contamination: 'Міни або забруднення боєприпасами які не вибухнули',
    criminality: 'Кримінал',
    fighting_between_armed_or_security_actors: 'Битви між збройними силами або силовими структурами',
    risks_of_eviction: 'Ризики примусового виселення',
    intercommunity_tensions: 'Напруга всередині громади',
    other_specify: 'Інше'
  },
  'what_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members': {
    worries_about_the_future: 'Переживання за майбутнє',
    worries_about_the_children: 'Переживання за дітей',
    displacement_related_stress: 'Стрес повязаний за переміщенням',
    fear_of_being_killed_or_injured_by_armed_violence: 'Страх бути вбитим або пораненим через збройне насилля',
    fear_of_property_being_damaged_or_destroyedby_armed_violence: 'Страх за можливість пошкодження або руйнування майна через збройний конфлікт',
    lack_of_access_to_employment_opportunities: 'Недостатній доступ до можливостей працевлаштування',
    lack_of_access_to_specialized_medical_services: 'Недостатній доступ до спеціалізованих медичних послуг',
    other_specify: 'Інше',
    lack_of_access_to_basic_services: 'Недостатній доступ до базових послуг',
    missing_family_members: 'Сум за членами сім\'ї',
    stigmatization_discrimination: 'Стигматизація/Дискримінація',
    fear_of_conscription: 'Страх призову до армії'
  },
  'what_are_your_main_concerns_regarding_your_accommodation': {
    accommodations_condition: 'Умови проживання',
    risk_of_eviction: 'Ризик примусового виселення',
    lack_of_functioning_utilities: 'Відсутність функціонуючих комунальних послуг',
    lack_of_financial_compensation_or_rehabilitation_for_damage_or_destruction_of_housing: 'Відсутність пітримки відновлення житла',
    overcrowded_lack_of_privacy: 'Забагато людей/Відсутність приватності',
    security_and_safety_risks: 'Ризики захисту та безпеки',
    lack_of_connectivity: 'Відсутність зєднання',
    lack_or_loss_of_ownership_documentation: 'Відсутність чи втрата документів про право власності',
    not_disability_inclusive: 'Не інклюзивне для людей з особливими потребами'
  },
  'what_are_the_barriers_to_accessing_health_services': {
    lack_of_specialized_health_care_services: 'Відсутність спеціалізованих медичних послуг',
    cost_of_the_services_provided_medication: 'Вартість наданих послуг/ліків',
    distance_lack_of_transportation_means_to_access_facilities: 'Відстань - нестача засобів пересування, щоб дістатися до медичних закладів',
    lack_of_available_health_facility: 'Відсутність доступного медичного закладу',
    cost_associated_with_transportation_to_facilities: 'Вартість поїздки до медичних закладів',
    lack_shortage_of_medication: 'Відсутність/дефіцит ліків',
    long_waiting_time: 'Тривалий час очікування',
    not_accessible_for_persons_with_disabilities: 'Не доступність для людей з особливими потребами',
    other_specify: 'Інше',
    safety_risks_associated_with_access_to_presence_at_health_facility: 'Ризики безпеки повязані з доступом/перебуванням в медичному закладі',
    language_barriers: 'Мовний бар\'єр',
    requirement_for_civil_documentation: 'Вимоги цивільної документації',
    discrimination_restriction_of_access: 'Дискримінація/заборона доступу'
  },
  'what_are_the_main_sources_of_income_of_your_household': {
    social_protection_payments: 'Виплати соціального захисту (пенсії, виплати тощо)',
    humanitarian_assistance: 'Гуманітарна допомога(грошова або не грошова)',
    salary_formal_employment: 'Заробітня плата - офіційне працевлаштування',
    casual_labour: 'Непостійна(Тимчасова) робота',
    savings: 'Власні накопичення',
    no_resources_coming_into_the_household: 'Відсутність джерел, які надходять в сім\'ю',
    assistance_from_family_friends: 'Допомога від сім\'ї/друзів',
    other_specify: 'Інше',
    business_self_employment: 'Підприємництво/Самозайнятість'
  },
}

export default () => {
  const {api} = useAppSettings()
  const {m, currentLang: lang, setLang} = useI18n()
  // const [lang, setLang] = usePersistentState('en', {storageKey: 'romanegraph3'})
  const req = () => api.kobo.typedAnswers.searchProtection_Hhs2({
    filters: period
  }).then(_ => seq(_.data).map(enrichProtHHS_2_1))

  const fetcher = useFetcher(req)

  useEffect(() => {
    fetcher.fetch()
  }, [])

  const data = fetcher.get

  const ageGroup = useCallback((ageGroup: Person.AgeGroup, hideOther?: boolean) => {
    const gb = Person.groupByGenderAndGroup(ageGroup)(data?.flatMap(_ => _.persons)!)
    return new Enum(gb).entries().map(([k, v]) => ({key: k, ...v}))
  }, [data])

  if (!data) return

  let index = 0
  const title = (title: string) => `Graph ${++index}. ${title}`

  return (
    <>
      <SnapshotHeader period={period}/>
      <ScRadioGroup inline dense sx={{display: 'inline-flex'}} value={lang} onChange={setLang}>
        <ScRadioGroupItem value="en">EN</ScRadioGroupItem>
        <ScRadioGroupItem value="ua">UA</ScRadioGroupItem>
      </ScRadioGroup>
      <Pan title={title('Household respondents per displacement group')}>
        {/*<Pan title={title('Сімї за статусом переміщеної особи')}>*/}
        <ChartBarSingleBy
          data={data}
          by={_ => _.do_you_identify_as_any_of_the_following}
          label={{
            ...lang === 'en' ? {} : translationsUa.do_you_identify_as_any_of_the_following,
            ...Protection_Hhs2_1Options.do_you_identify_as_any_of_the_following,
          }}
        />
      </Pan>
      <Pan title={title('Surveyed households per age and gender groups')}>
        {/*<Pan title={title('Опитанні сім\'ї за віком і статтю Female - Жінка; Male - Чоловік; Other - Інше')}>*/}
        <ChartBarStacker data={lang === 'en'
          ? ageGroup(Person.ageGroup['DRC'], true)
          : ageGroup(Person.ageGroup['DRC'], true).map(_ => ({
            key: _.key,
            Жінка: _.Female,
            Чоловік: _.Male,
            Інше: _.Other,
          }))
        } height={250} colors={t => [
          t.palette.primary.main,
          snapshotAlternateColor(t),
        ]}/>
      </Pan>
      {/*<Pan title={title('Наміри щодо статусу переміщенної особи')}>*/}
      <Pan title={title('Intentions per displacement status')}>
        <Txt bold block color="hint" size="small">{m.idps}</Txt>
        <ChartBarSingleBy
          data={data.filter(_ => _.do_you_identify_as_any_of_the_following === 'idp')}
          filter={_ => _.what_are_your_households_intentions_in_terms_of_place_of_residence !== 'unable_unwilling_to_answer'}
          by={_ => _.what_are_your_households_intentions_in_terms_of_place_of_residence}
          label={{
            ...lang === 'en' ? {} : translationsUa.what_are_your_households_intentions_in_terms_of_place_of_residence,
            ...Protection_Hhs2_1Options.what_are_your_households_intentions_in_terms_of_place_of_residence,
          }}
        />
        <Txt bold block color="hint" size="small" sx={{mt: 3}}>{m.nonDisplaced}</Txt>
        <ChartBarSingleBy
          data={data.filter(_ => _.do_you_identify_as_any_of_the_following === 'non_displaced')}
          filter={_ => _.what_are_your_households_intentions_in_terms_of_place_of_residence !== 'unable_unwilling_to_answer'}
          by={_ => _.what_are_your_households_intentions_in_terms_of_place_of_residence}
          label={{
            ...lang === 'en' ? {} : translationsUa.what_are_your_households_intentions_in_terms_of_place_of_residence,
            ...Protection_Hhs2_1Options.what_are_your_households_intentions_in_terms_of_place_of_residence,
          }}
        />
        <Txt bold block color="hint" size="small" sx={{mt: 3}}>{m.refugeesAndReturnees}</Txt>
        <ChartBarSingleBy
          data={data.filter(_ => _.do_you_identify_as_any_of_the_following === 'refugee' || _.do_you_identify_as_any_of_the_following === 'returnee')}
          filter={_ => _.what_are_your_households_intentions_in_terms_of_place_of_residence !== 'unable_unwilling_to_answer'}
          by={_ => _.what_are_your_households_intentions_in_terms_of_place_of_residence}
          label={{
            ...lang === 'en' ? {} : translationsUa.what_are_your_households_intentions_in_terms_of_place_of_residence,
            ...Protection_Hhs2_1Options.what_are_your_households_intentions_in_terms_of_place_of_residence,
          }}
        />
      </Pan>
      <Pan title={title('Відчуття безпеки: Фактори, які впливають на це')}>
        <ChartBarMultipleBy
          data={data}
          filterValue={['unable_unwilling_to_answer']}
          by={_ => _.what_are_the_main_factors_that_make_this_location_feel_unsafe}
          label={{
            ...lang === 'en' ? {} : translationsUa.what_are_the_main_factors_that_make_this_location_feel_unsafe,
            ...Protection_Hhs2_1Options.what_are_the_main_factors_that_make_this_location_feel_unsafe,
          }}
        />
      </Pan>
      <Pan title={title('Найбільші фактори стресу')}>
        <ChartBarMultipleBy
          data={data}
          filterValue={['unable_unwilling_to_answer']}
          by={_ => _.what_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members}
          label={{
            ...lang === 'en' ? {} : translationsUa.what_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members,
            ...Protection_Hhs2_1Options.what_do_you_think_feel_are_the_major_stress_factors_for_you_and_your_household_members,
          }}
        />
      </Pan>
      <Pan title={title('Переживання щодо поточного місця проживання')}>
        <ChartBarMultipleBy
          data={data.filter(_ => !_.what_are_your_main_concerns_regarding_your_accommodation?.includes('none'))}
          filterValue={['unable_unwilling_to_answer']}
          by={_ => _.what_are_your_main_concerns_regarding_your_accommodation}
          label={{
            ...lang === 'en' ? {} : translationsUa.what_are_your_main_concerns_regarding_your_accommodation,
            ...Protection_Hhs2_1Options.what_are_your_main_concerns_regarding_your_accommodation,
          }}
        />
      </Pan>
      <Pan title={title('Перешкоди доступу до медичних послуг')}>
        <ChartBarMultipleBy
          data={data}
          filterValue={['unable_unwilling_to_answer']}
          by={_ => _.what_are_the_barriers_to_accessing_health_services}
          label={{
            ...lang === 'en' ? {} : translationsUa.what_are_the_barriers_to_accessing_health_services,
            ...Protection_Hhs2_1Options.what_are_the_barriers_to_accessing_health_services,
          }}
        />
      </Pan>
      <Pan title={title('Головні джерела доходу переміщених осіб')}>
        <ChartBarMultipleBy
          data={data}
          mergeOptions={{
            remittances: 'other_specify',
          } as any}
          filterValue={['unable_unwilling_to_answer']}
          by={_ => _.what_are_the_main_sources_of_income_of_your_household}
          label={{
            ...lang === 'en' ? {} : translationsUa.what_are_the_main_sources_of_income_of_your_household,
            ...Protection_Hhs2_1Options.what_are_the_main_sources_of_income_of_your_household,
          }}
        />
      </Pan>
    </>
  )
}