import {formatDistance, formatDuration as formatDurationFns} from 'date-fns'
import {externalLinks} from '../../externalLinks'

const invalidDate = '-'

export const isDateValid = (d?: Date): boolean => {
  return !!d && d instanceof Date && !isNaN(d.getTime())
}

export const formatDate = (d?: Date): string => {
  if (!isDateValid(d)) return invalidDate
  return d!.toLocaleDateString()
}

export const formatTime = (d?: Date): string => {
  if (!isDateValid(d)) return invalidDate
  return d!.toLocaleTimeString()
}

export const formatDateTime = (d?: Date): string => {
  if (!isDateValid(d)) return invalidDate
  return formatDate(d) + ' ' + formatTime(d)
}

export const dateFromNow = (d?: Date): string | undefined => {
  return d ? formatDistance(d, new Date(), {addSuffix: true}) : undefined
}

export const formatLargeNumber = (n?: number): string => {
  return n !== undefined && n !== null ? n.toLocaleString('en-EN') : '-'
}

export const formatDuration = formatDurationFns

export type Messages = typeof en['messages']

export const en = Object.freeze({
  formatDate,
  formatTime,
  formatDateTime,
  dateFromNow,
  formatDuration,
  formatLargeNumber,
  messages: {
    area: 'Area',
    answers: 'Answers',
    noDataAtm: 'No data at the moment',
    seeResults: `See results`,
    select3Outcomes: `Please, select 3 outcomes`,
    somethingWentWrong: 'Something went wrong',
    yes: 'Yes',
    no: 'No',
    previous: 'Previous',
    next: 'Next',
    nLines: (n: number) => `<b>${n}</b> lignes`,
    confirm: 'Confirm',
    toggleDatatableColumns: 'Toggle',
    areas: {
      north: 'North',
      east: 'East',
      south: 'South',
      west: 'West'
    },
    hhs: 'Households',
    individuals: 'Individuals',
    hhSize: 'Household size',
    decidingFactorsToReturn: 'Deciding factors to return',
    displacement: 'Displacement',
    origin: 'Origin',
    current: 'Current',
    age: 'Age',
    ageGroup: 'Age group',
    sex: 'Sex',
    status: 'Current status',
    male: 'Male',
    female: 'Female',
    undefined: 'Unknown',
    sample: 'Sample',
    propertyDamaged: 'Property damaged due to the conflict',
    intentionToReturn: 'Intention to return',
    protectionHHSnapshot: {
      propertyDamaged: {
        fully_damaged_needs_full_reconstruction: {
          title: '⚫ Fully damaged',
          desc: 'Full rebuild needed',
        },
        partially_damaged__considerable_repair_i: {
          title: '🔴 Heavily damaged',
          desc: 'Structural repair needed',
        },
        partially_damage: {
          title: '🟠 Medium damaged',
          desc: 'No structural repairs needed',
        },
        light_damage: {
          title: '🟢 Light damaged',
          desc: 'No structural repair needed',
        },
      },
      title: 'Protection Monitoring',
      subTitle: 'Ukraine',
      disclaimer: `
        This SNAPSHOT summarizes the findings of Protection Monitoring conducted in the regions/oblasts of 
        Chernihiv, Dnipro, Lviv, Chernivtsi, and Kharkiv, Ukraine. Protection monitoring has been mainly implemented 
        through household interviews, complemented by focus group discussions, observation checklists, 
        and Rapid Protection Assessments. DRC protection monitoring targeted Internally Displaced Persons (IDPs)
         and people directly exposed to and affected by the current armed conflict. 
      `,
      sample: {
        desc: `The conflict in Ukraine has generated various protection risks for IDPs and conflict-affected populations.
          While all areas where PM took place were directly or indirectly affected by the conflict,
          needs and protection risks vary in each monitored region and are different according to the
          monitored population group: internally displaced persons, communities directly exposed and 
          affected by the current armed conflict (from now on referred to as conflict-affected), and host communities.`
      },
      displacement: {
        desc: `Significant population movements were observed at the beginning of the crisis. 
          In May 2022, 8 million IDPs were reported by 
          <a href="${externalLinks.iomDtm}" class="link">IOM's Displacement Tracking Matrix</a>.
          Displacement is widely associated with conflict and direct threats to life, 
          security, and safety.`,
      }
    },
    factorsToReturn: {
      shelter_is_repaired: 'Shelter is repaired',
      improvement_in_security_situat: 'Improvement in security situation',
      increased_service_availability: 'Increased service availability',
      infrastructure__including_heat: 'Infrastructure is repaired',
      cessation_of_hostilities: 'Cessation of hostilities',
      health_facilties_are_accessibl: 'Health facilities accessible',
      government_regains_territory_f: 'Government regains territory from NGCA',
      other219: 'Other',
      education_facilities__schools_: 'Education facilities accessible',
    },
    departureFromAreaOfOrigin: `Departure from area of origin`,
    dateOfDeparture: `Date of departure`,
  },
})
