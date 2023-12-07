import {AiSnfiInterface} from '@/features/ActivityInfo/Snfi/AiSnfiInterface'
import {DrcProject} from '@/core/drcUa'
import {Period} from '@/core/type'
import {fnSwitch, map, seq} from '@alexandreannic/ts-utils'
import {getAiLocation} from '@/features/ActivityInfo/Protection/aiProtectionGeneralMapper'
import {ShelterEntity} from '@/core/sdk/server/shelter/ShelterEntity'
import {Utils} from '@/utils/utils'
import {ShelterProgress, ShelterTaPriceLevel} from '@/core/sdk/server/kobo/custom/KoboShelterTA'
import {format} from 'date-fns'
import {ActivityInfoSdk} from '@/core/sdk/server/activity-info/ActiviftyInfoSdk'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'

export class AiShelterData {

  static readonly reqRepairs = (api: ApiSdk) => (period: Period) => api.shelter.search(period).then(_ => seq(_.data).compactBy('nta').compactBy('ta').map(x => ({
    ...x, ...getAiLocation(x.nta)
  }))).then(res => {
    const formatted: {
      all: ShelterEntity[],
      activity: AiSnfiInterface.Type,
      request: any,
    }[] = []
    let index = 0
    Utils.groupBy({
      data: res,
      groups: [
        {by: _ => _.ta?.tags?.project!},
        {by: _ => _.Oblast!},
        {by: _ => _.Raion!},
        {by: _ => _.Hromada!},
        // {by: _ => _.}
        {
          by: row => {
            if (row.ta?._priceLevel)
              return fnSwitch(row.ta?._priceLevel, {
                [ShelterTaPriceLevel.Heavy]: ShelterTaPriceLevel.Medium,
              }, _ => _)
            return map(row.nta?.total_apt_damage ?? row.nta?.total_damage, _ => {
              if (+_ < 6) return ShelterTaPriceLevel.Light
              return ShelterTaPriceLevel.Medium
            })!
          },
        },
        {
          by: row => {
            const x: AiSnfiInterface.Opt<'Implementation status'> = (row.ta?.tags?.progress! === ShelterProgress.RepairWorksCompleted)
              ? 'Complete'
              : 'Ongoing'
            return x
          }
        },
        {
          by: row => fnSwitch(row.nta?.ben_det_res_stat!, {
            idp: 'IDPs',
            ret: 'Returnees',
          }, () => 'Non-Displaced') as AiSnfiInterface.Opt<'Population Group'>
        }
      ],
      finalTransform: (grouped, [project, oblast, raion, hromada, damageLevel, complete, status]) => {
        // TODO NOT EVERYTHING IN AGE GROUP
        // const persons = grouped.flatMap(_ => _.nta?.hh_char_hh_det?.map(_ => Person.create({
        //   age: _.hh_char_hh_det_age,
        //   gender: fnSwitch(_.hh_char_hh_det_gender!, {
        //     male: Gender.Male,
        //     female: Gender.Female,
        //   }, () => Gender.Other)
        // }))).compact().compactBy('age')
        const indicator = grouped.sum(_ => _.nta?.ben_det_hh_size ?? 0)
        const planCode = AiShelterData.planCode[project]
        const validPlanCode = !!AiSnfiInterface.options['Plan Code'][planCode]
        const activity: AiSnfiInterface.Type = {
          'SNFI indictors': fnSwitch(damageLevel, {
            [ShelterTaPriceLevel.Light]: 'light_repair',
            [ShelterTaPriceLevel.Medium]: 'medium_repair',
            [ShelterTaPriceLevel.Heavy]: 'medium_repair',
          }, () => undefined),
          'Implementing Partner': 'Danish Refugee Council',
          'Report to a planned project': validPlanCode ? 'Yes' : 'No',
          ...(validPlanCode ? {'Plan Code': planCode} : {}),
          // 'Plan Code': AiShelterData.planCode[project],
          'Reporting Partner': 'Danish Refugee Council',
          'Oblast': oblast,
          'Raion': raion,
          'Hromada': hromada,
          'Implementation status': complete,
          'Reporting Date (YYYY-MM-DD)': format(period.end, 'yyyy-MM-dd'),
          // 'Population Group': status,
          'Indicator Value (HHs reached, buildings, etc.)': indicator,
          // '# Individuals Reached': persons.length,
          // 'Girls (0-17)': persons.count(_ => _.age < 18 && _.gender === Gender.Female),
          // 'Boys (0-17)': persons.count(_ => _.age < 18 && _.gender === Gender.Male),
          // 'Women (18-59)': persons.count(_ => _.age >= 18 && _.age < 60 && _.gender === Gender.Female),
          // 'Men (18-59)': persons.count(_ => _.age >= 18 && _.age < 60 && _.gender === Gender.Male),
          // 'Elderly Women (60+)': persons.count(_ => _.age >= 60 && _.gender === Gender.Female),
          // 'Elderly Men (60+)': persons.count(_ => _.age >= 60 && _.gender === Gender.Male),
          // 'People with disability': 0,
        }
        formatted.push({
          all: grouped.map(_ => _.nta),
          activity,
          request: ActivityInfoSdk.makeRecordRequest({
            activity: AiSnfiInterface.map(activity),
            formId: 'ckrgu2uldtxbgbg1h',
            activityIdPrefix: 'drcsta',
            activityIndex: index++,
          })
        })
      },
    })
    return formatted
  })
  
  static readonly planCode: Record<DrcProject, AiSnfiInterface.PlanCode> = {
    [DrcProject['UKR-000314 UHF4']]: AiSnfiInterface.PlanCode['DRC-SN-00014'],
    [DrcProject['UKR-000322 ECHO2']]: AiSnfiInterface.PlanCode['DRC-SN-00013'],
    [DrcProject['UKR-000308 UNHCR']]: AiSnfiInterface.PlanCode['DRC-SN-00015'],
  } as any
}

//
// export const mapBnre = (api: ApiSdk) => {
//   api.kobo.typedAnswers.searchBn_Re()
//     .then(_ => _.data)
//     .then(_ => _.filter(_ =>
//       _.back_prog_type?.filter(_ => _.includes('esk'))
//     ))
//     .then(data => data.map(_ => ({..._, ...getAiLocation(_)})))
//     .then(data => {
//       Utils.groupBy({
//         data,
//         groups: [
//           {by: _ => _.back_donor!},
//           {by: _ => _.Oblast ?? ''},
//           {by: _ => _.Raion ?? ''},
//           {by: _ => _.Hromada ?? ''},
//           {
//             by: row => fnSwitch(row?.ben_det_res_stat!, {
//               idp: 'IDPs',
//               ret: 'Returnees',
//             }, () => 'Non-Displaced') as AiTypeSnfiRmm.Opt<'Population Group'>
//           }
//         ],
//         finalTransform: (grouped, [project, oblast, raion, hromada]) => grouped
//       })
//     })
// }

// const _15_light_HRK_Repaired = {
//   'changes': [
//     {
//       'formId': 'ckrgu2uldtxbgbg1h',
//       'recordId': 'c4p9vpllosow9tg2',
//       'parentRecordId': null,
//       'fields': {
//         'cq6zwqjlf82vdwm3': 'cr4xx3dlbs86w9y2:cv9umq8lehiq43f103',//Reporting Partner
//         'csmijzwldtzh3bl38': 'cvlcuxtldtzh3bl37',//Report to a planned project
//         'c75dtq4les7cpc82d': 'cdesthtldec3hei2:cp9vejmlosqpryz4', // Plan Code
//         'cn10ozsldtxbraj1l': 'cr4xx3dlbs86w9y2:cv9umq8lehiq43f103', // Implementing Partner
//         'cv9pg04ldu2u9h93j': 'cyi4zqdldu27njw36:cthbls4leso4fy310', // SNFI indictors
//         'camsdoble7prey5o': 'cg7v61llbunvy9t9:c4s5fm0lebrkckc9', // Oblast
//         'c74nt9ale7prs2hp': 'cjy8nbnlbunzcnh1h:ctt3w5elecp1fu23a', // RAION
//         'cs63bxkle7ps0xuq': 'c700rjplbuo1fjq5m:cy6dtp0lebsucno14y', // Hromada
//         'cobl961lfk2oa3g3': 'cqvi6fqlbuo3hyc63:c21rblslfk31pl57', // Settlement
//         'cvq23zolfk3jvle9': 'cl69o0lldbf4rtk2:csomp5ilfqiu8ty2', // Collective Site
//         'c8fnjxzles7i9yi2k': 'c9kxwthles7i9yi2j', // Implementation status
//         'csfoqprleh6qg1k3': '2023-10-01', // Reporting Date (YYYY-MM-DD)
//         'cqi4oh3ldx7oxbk2b': 1 //Indicator Value (HHs reached, buildings, etc.)
//       }
//     }
//   ]
// }
//
// const _14_medium_NLV_complete = [
//   {
//     'formId': 'ckrgu2uldtxbgbg1h',
//     'recordId': 'c4ysj2klosr4t603',
//     'parentRecordId': null,
//     'fields': {
//       'cq6zwqjlf82vdwm3': 'cr4xx3dlbs86w9y2:cv9umq8lehiq43f103', // Reporting Partner
//       'csmijzwldtzh3bl38': 'cvlcuxtldtzh3bl37', // Report to a planned project
//       'c75dtq4les7cpc82d': 'cdesthtldec3hei2:cvwwdp5losjpowe2', // Plan Code
//       'cn10ozsldtxbraj1l': 'cr4xx3dlbs86w9y2:cv9umq8lehiq43f103', // Implementing Partner
//       'cv9pg04ldu2u9h93j': 'cyi4zqdldu27njw36:csek3cileso4fy312', // SNFI indictors
//       'camsdoble7prey5o': 'cg7v61llbunvy9t9:ctv8cw5lebrkckdh', // Oblast
//       'c74nt9ale7prs2hp': 'cjy8nbnlbunzcnh1h:cyb678glecp1fu22g', // RAION
//       'cs63bxkle7ps0xuq': 'c700rjplbuo1fjq5m:cyl7d80lebsu8lcu8', // Hromada
//       'cobl961lfk2oa3g3': 'cqvi6fqlbuo3hyc63:c21rblslfk31pl57', // Settlement
//       'cvq23zolfk3jvle9': 'cl69o0lldbf4rtk2:csomp5ilfqiu8ty2', // Collective Site
//       'c8fnjxzles7i9yi2k': 'c7x3nhyles7iq962l', // Implementation status
//       'csfoqprleh6qg1k3': '2023-10-01', // Reporting Date (YYYY-MM-DD)
//       'cqi4oh3ldx7oxbk2b': 0 //Indicator Value (HHs reached, buildings, etc.)
//     }
//   }
// ]
//
// const _15_medium_SUMY_complete = [
//   {
//     'formId': 'ckrgu2uldtxbgbg1h',
//     'recordId': 'c92d1ailosrtddonc',
//     'parentRecordId': null,
//     'fields': {
//       'cq6zwqjlf82vdwm3': 'cr4xx3dlbs86w9y2:cv9umq8lehiq43f103',
//       'csmijzwldtzh3bl38': 'cvlcuxtldtzh3bl37',
//       'c75dtq4les7cpc82d': 'cdesthtldec3hei2:cp9vejmlosqpryz4',
//       'cn10ozsldtxbraj1l': 'cr4xx3dlbs86w9y2:cv9umq8lehiq43f103',
//       'cv9pg04ldu2u9h93j': 'cyi4zqdldu27njw36:csek3cileso4fy312',
//       'camsdoble7prey5o': 'cg7v61llbunvy9t9:c4s5fm0lebrkckc9',
//       'c74nt9ale7prs2hp': 'cjy8nbnlbunzcnh1h:ctt3w5elecp1fu23a',
//       'cs63bxkle7ps0xuq': 'c700rjplbuo1fjq5m:cy6dtp0lebsucno14y',
//       'cobl961lfk2oa3g3': 'cqvi6fqlbuo3hyc63:c21rblslfk31pl57',
//       'cvq23zolfk3jvle9': 'cl69o0lldbf4rtk2:csomp5ilfqiu8ty2',
//       'c8fnjxzles7i9yi2k': 'c7x3nhyles7iq962l',
//       'csfoqprleh6qg1k3': '2023-10-01',
//       'cqi4oh3ldx7oxbk2b': 0
//     }
//   }
// ]
//
// const _15_light_SUMY_ongoing = [
//   {
//     'formId': 'ckrgu2uldtxbgbg1h',
//     'recordId': 'cv7nsfulosr7yqx4',
//     'parentRecordId': null,
//     'fields': {
//       'cq6zwqjlf82vdwm3': 'cr4xx3dlbs86w9y2:cv9umq8lehiq43f103', // Reporting Partner
//       'csmijzwldtzh3bl38': 'cvlcuxtldtzh3bl37', // Report to a planned project
//       'c75dtq4les7cpc82d': 'cdesthtldec3hei2:cp9vejmlosqpryz4', // Plan Code
//       'cn10ozsldtxbraj1l': 'cr4xx3dlbs86w9y2:cv9umq8lehiq43f103', // Implementing Partner
//       'cv9pg04ldu2u9h93j': 'cyi4zqdldu27njw36:cthbls4leso4fy310', // SNFI indictors
//       'camsdoble7prey5o': 'cg7v61llbunvy9t9:cj530slebrkckdm', // Oblast
//       'c74nt9ale7prs2hp': 'cjy8nbnlbunzcnh1h:cu5a8p5lecp1fu230', // RAION
//       'cs63bxkle7ps0xuq': 'c700rjplbuo1fjq5m:cxqoijslebsuaph11t', // Hromada
//       'cobl961lfk2oa3g3': 'cqvi6fqlbuo3hyc63:c21rblslfk31pl57', // Settlement
//       'cvq23zolfk3jvle9': 'cl69o0lldbf4rtk2:csomp5ilfqiu8ty2', // Collective Site
//       'c8fnjxzles7i9yi2k': 'c7x3nhyles7iq962l', // Implementation status
//       'csfoqprleh6qg1k3': '2023-10-01', // Reporting Date (YYYY-MM-DD)
//       'cqi4oh3ldx7oxbk2b': 0 //Indicator Value (HHs reached, buildings, etc.)
//     }
//   }
// ]
//
// const _13_light_newlyRetaken_complete = [
//   {
//     'formId': 'ckrgu2uldtxbgbg1h',
//     'recordId': 'cyjboqqlosrvu44nd',
//     'parentRecordId': null,
//     'fields': {
//       'cq6zwqjlf82vdwm3': 'cr4xx3dlbs86w9y2:cv9umq8lehiq43f103', // Reporting Partner
//       'csmijzwldtzh3bl38': 'cvlcuxtldtzh3bl37', // Report to a planned project
//       'c75dtq4les7cpc82d': 'cdesthtldec3hei2:cvwwdp5losjpowe2', // Plan Code
//       'cn10ozsldtxbraj1l': 'cr4xx3dlbs86w9y2:cv9umq8lehiq43f103', // Implementing Partner
//       'cv9pg04ldu2u9h93j': 'cyi4zqdldu27njw36:cmd35wfleso4fy54a', // SNFI indictors
//       'camsdoble7prey5o': 'cg7v61llbunvy9t9:c4s5fm0lebrkckc9', // Oblast
//       'c74nt9ale7prs2hp': 'cjy8nbnlbunzcnh1h:ctt3w5elecp1fu23a', // RAION
//       'cs63bxkle7ps0xuq': 'c700rjplbuo1fjq5m:cy6dtp0lebsucno14y', // Hromada
//       'cobl961lfk2oa3g3': 'cqvi6fqlbuo3hyc63:c21rblslfk31pl57', // Settlement
//       'cvq23zolfk3jvle9': 'cl69o0lldbf4rtk2:csomp5ilfqiu8ty2', // Collective Site
//       'c8fnjxzles7i9yi2k': 'c7x3nhyles7iq962l', // Implementation status
//       'csfoqprleh6qg1k3': '2023-10-01', // Reporting Date (YYYY-MM-DD)
//       'cqi4oh3ldx7oxbk2b': 0 //Indicator Value (HHs reached, buildings, etc.)
//     }
//   }
// ]
//
// const _14_emergency_ongoing_idps_ = [
//   {
//     'formId': 'ckrgu2uldtxbgbg1h',
//     'recordId': 'ctlbe2closrz8a7ne',
//     'parentRecordId': null,
//     'fields': {
//       'cq6zwqjlf82vdwm3': 'cr4xx3dlbs86w9y2:cv9umq8lehiq43f103', // Reporting Partner
//       'csmijzwldtzh3bl38': 'cvlcuxtldtzh3bl37', // Report to a planned project
//       'c75dtq4les7cpc82d': 'cdesthtldec3hei2:cs1j3twlosqnuj33', // Plan Code
//       'cn10ozsldtxbraj1l': 'cr4xx3dlbs86w9y2:cv9umq8lehiq43f103', // Implementing Partner
//       'cv9pg04ldu2u9h93j': 'cyi4zqdldu27njw36:cfki5tlleso4fy3c', // SNFI indictors
//       'camsdoble7prey5o': 'cg7v61llbunvy9t9:c4s5fm0lebrkckc9', // Oblast
//       'c74nt9ale7prs2hp': 'cjy8nbnlbunzcnh1h:ctt3w5elecp1fu23a', // RAION
//       'cs63bxkle7ps0xuq': 'c700rjplbuo1fjq5m:cy6dtp0lebsucno14y', // Hromada
//       'cobl961lfk2oa3g3': 'cqvi6fqlbuo3hyc63:c21rblslfk31pl57', // Settlement
//       'cvq23zolfk3jvle9': 'cl69o0lldbf4rtk2:csomp5ilfqiu8ty2', // Collective Site
//       'c8fnjxzles7i9yi2k': 'c9kxwthles7i9yi2j', // Implementation status
//       'csfoqprleh6qg1k3': '2023-10-01', // Reporting Date (YYYY-MM-DD)
//       'c16s0poldtxdh4i2k': 'cqjd0o4ld4hbyo12:co8y3rvld4hchx14', //Indicator Value (HHs reached, buildings, etc.)
//       'cqi4oh3ldx7oxbk2b': 0,
//       'cizsb4rldtxdh4i2r': 1,
//       'cfoottlldtxdh4i2s': 1,
//       'cxxg0f1ldtxdh4i2t': 0,
//       'c7s25dpldtxdh4i2u': 0,
//       'cszje7jldtxdh4i2v': 0,
//       'c75mnm0ldtxdh4i2w': 0,
//       'cpwm9hildtxdh4i2x': 0,
//       'cy9uo60ldtxdh4i2y': 0
//     }
//   }
// ]
//
// /// =====
// const _13_light_newlyRetaken = [
//   {
//     'formId': 'ckrgu2uldtxbgbg1h',
//     'recordId': 'cjolv2slossexp9nf',
//     'parentRecordId': null,
//     'fields': {
//       'cq6zwqjlf82vdwm3': 'cr4xx3dlbs86w9y2:cv9umq8lehiq43f103',
//       'csmijzwldtzh3bl38': 'cvlcuxtldtzh3bl37',
//       'c75dtq4les7cpc82d': 'cdesthtldec3hei2:cvwwdp5losjpowe2',
//       'cn10ozsldtxbraj1l': 'cr4xx3dlbs86w9y2:cv9umq8lehiq43f103',
//       'cv9pg04ldu2u9h93j': 'cyi4zqdldu27njw36:cmd35wfleso4fy54a',
//       'camsdoble7prey5o': 'cg7v61llbunvy9t9:cj530slebrkckdm',
//       'c74nt9ale7prs2hp': 'cjy8nbnlbunzcnh1h:cu5a8p5lecp1fu230',
//       'cs63bxkle7ps0xuq': 'c700rjplbuo1fjq5m:cxqoijslebsuaph11t',
//       'cobl961lfk2oa3g3': 'cqvi6fqlbuo3hyc63:c21rblslfk31pl57',
//       'cvq23zolfk3jvle9': 'cl69o0lldbf4rtk2:csomp5ilfqiu8ty2',
//       'c8fnjxzles7i9yi2k': 'c9kxwthles7i9yi2j',
//       'csfoqprleh6qg1k3': '2023-10-01',
//       'cqi4oh3ldx7oxbk2b': 0
//     }
//   }
// ]
//
// const light = [
//   {
//     'formId': 'ckrgu2uldtxbgbg1h',
//     'recordId': 'ckuz2yilossl4t5ng',
//     'parentRecordId': null,
//     'fields': {
//       'cq6zwqjlf82vdwm3': 'cr4xx3dlbs86w9y2:cv9umq8lehiq43f103',
//       'csmijzwldtzh3bl38': 'cvlcuxtldtzh3bl37',
//       'c75dtq4les7cpc82d': 'cdesthtldec3hei2:cs1j3twlosqnuj33',
//       'cn10ozsldtxbraj1l': 'cr4xx3dlbs86w9y2:cv9umq8lehiq43f103',
//       'cv9pg04ldu2u9h93j': 'cyi4zqdldu27njw36:cthbls4leso4fy310',
//       'camsdoble7prey5o': 'cg7v61llbunvy9t9:c4s5fm0lebrkckc9',
//       'c74nt9ale7prs2hp': 'cjy8nbnlbunzcnh1h:ctt3w5elecp1fu23a',
//       'cs63bxkle7ps0xuq': 'c700rjplbuo1fjq5m:cpxd5lllebsucnn14q',
//       'cobl961lfk2oa3g3': 'cqvi6fqlbuo3hyc63:c21rblslfk31pl57',
//       'cvq23zolfk3jvle9': 'cl69o0lldbf4rtk2:csomp5ilfqiu8ty2',
//       'c8fnjxzles7i9yi2k': 'c7x3nhyles7iq962l',
//       'csfoqprleh6qg1k3': '2023-10-01',
//       'cqi4oh3ldx7oxbk2b': 0
//     }
//   }
// ]
//
// const light15_ongoing_kh = [
//   {
//     'formId': 'ckrgu2uldtxbgbg1h',
//     'recordId': 'cr16jsjlossnd4gnh',
//     'parentRecordId': null,
//     'fields': {
//       'cq6zwqjlf82vdwm3': 'cr4xx3dlbs86w9y2:cv9umq8lehiq43f103',
//       'csmijzwldtzh3bl38': 'cvlcuxtldtzh3bl37',
//       'c75dtq4les7cpc82d': 'cdesthtldec3hei2:cp9vejmlosqpryz4',
//       'cn10ozsldtxbraj1l': 'cr4xx3dlbs86w9y2:cv9umq8lehiq43f103',
//       'cv9pg04ldu2u9h93j': 'cyi4zqdldu27njw36:cthbls4leso4fy310',
//       'camsdoble7prey5o': 'cg7v61llbunvy9t9:c4s5fm0lebrkckc9',
//       'c74nt9ale7prs2hp': 'cjy8nbnlbunzcnh1h:ctt3w5elecp1fu23a',
//       'cs63bxkle7ps0xuq': 'c700rjplbuo1fjq5m:cv9eeiclebsucnn14o',
//       'cobl961lfk2oa3g3': 'cqvi6fqlbuo3hyc63:c21rblslfk31pl57',
//       'cvq23zolfk3jvle9': 'cl69o0lldbf4rtk2:csomp5ilfqiu8ty2',
//       'c8fnjxzles7i9yi2k': 'c9kxwthles7i9yi2j',
//       'csfoqprleh6qg1k3': '2023-10-01',
//       'cqi4oh3ldx7oxbk2b': 0
//     }
//   }
// ]