import {useAppSettings} from '@/core/context/ConfigContext'
import {useMemo} from 'react'
import {PartnershipData} from '@/features/Partnership/PartnershipType'
import {fnSwitch, seq, Seq} from '@alexandreannic/ts-utils'
import {OblastIndex, OblastName} from '@/shared/UkraineMap/oblastIndex'
import {DrcSector} from '@/core/drcUa'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {useFetcher} from '@/shared/hook/useFetcher'

export type UsePartnershipData = ReturnType<typeof usePartnershipData>

const mapYN = (_?: 'yes' | 'no') => fnSwitch(_!, {
  yes: true,
  no: false,
}, () => undefined)

export const usePartnershipData = () => {
  const {api} = useAppSettings()
  const fetcherPartnersDb = useFetcher(api.kobo.typedAnswers.searchPartnersDatabase)

  const mappedData = useMemo(() => {
    if (!fetcherPartnersDb.get) return
    const res: Seq<KoboAnswer<PartnershipData>> = seq([])
    fetcherPartnersDb.get.data.forEach(d => {
      const oblast: OblastName[] | undefined = d.Which_oblasts_does_t_t_and_has_experience?.map(_ => fnSwitch(_, {
        cherkasy_oblast: 'Cherkaska',
        chernihiv_oblast: 'Chernihivska',
        chernivtsi_oblast: 'Chernivetska',
        dnipropetrovsk_oblast: 'Dnipropetrovska',
        donetsk_oblast: 'Donetska',
        ivano_frankivsk_oblast: 'Ivano-Frankivska',
        kharkiv_oblast: 'Kharkivska',
        kherson_oblast: 'Khersonska',
        khmelnytskyi_oblast: 'Khmelnytska',
        kirovohrad_oblast: 'Kirovohradska',
        kyiv_oblast: 'Kyivska',
        luhansk_oblast: 'Luhanska',
        lviv_oblast: 'Lvivska',
        mykolaiv_oblast: 'Mykolaivska',
        odesa_oblast: 'Odeska',
        poltava_oblast: 'Poltavska',
        rivne_oblast: 'Rivnenska',
        sumy_oblast: 'Sumska',
        ternopil_oblast: 'Ternopilska',
        vinnytsia_oblast: 'Vinnytska',
        volyn_oblast: 'Volynska',
        zakarpattia_oblast: 'Zakarpatska',
        zaporizhzhia_oblast: 'Zaporizka',
        zhytomyr_oblast: 'Zhytomyrska',
      }))
      res.push({
        ...d,
        oblast,
        computed: {
          name: d.Partner_name_English?.replace(/^(NGO|CSO)/, '').replace(/^\s*['“”"](.*)['“”"]\s*$/, '$1'),
        },
        oblastIso: oblast?.map(_ => OblastIndex.byName(_).iso),
        sectors: d.Which_sectors_does_the_organiz?.map(_ => fnSwitch(_, {
          nfi: DrcSector.NFI,
          wash: DrcSector.WaSH,
          protection: DrcSector.Protection,
          pss: DrcSector.PSS,
          education: DrcSector.Education,
          livelihoods: DrcSector.Livelihoods,
          food_security: DrcSector.FoodSecurity,
          mpca: DrcSector.MPCA,
          health: DrcSector.Health,
          nutrition: DrcSector.Nutrition,
          shelter: DrcSector.Shelter,
          evacuations: DrcSector.Evacuations,
          gbv: DrcSector.GBV,
          eore: DrcSector.EORE,
        })),
        relationWithDrc: d.Is_there_an_ongoing_relationsh,
        ownWarehouse: mapYN(d.Own_warehouse_belonging_to_th as any),
        ownVehicle: d.Own_vehicles,
        recommendationActivities: d.The_organization_is_g_type_of_activities,
        rapidMobilization: mapYN(d.Is_rapid_volunteer_mobilization_possible),
        hardToReachAccess: mapYN(d.Is_access_possible_by_the_orga),
        targetedMinorities: d.Select_if_the_organi_inorities_in_Ukraine,
        assistanceRequested: d.Which_assistance_would_the_CSO,
        dueDiligenceThreshold: d.Sub_Grant_Funding_Threshold,
        dueDiligenceFinalized: d.Has_due_diligence_been_finaliz,
        dueRisk: d.Overall_Residual_Risk,
      })
    })
    return res
  }, [fetcherPartnersDb.get])

  return {
    fetcherPartnersDb,
    mappedData,
  }
}