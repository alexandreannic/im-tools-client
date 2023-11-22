export const kobo = {
  drcUa: {
    server: {
      prod: '4820279f-6c3d-47ba-8afe-47f86b16ab5d' as const,
    },
    form: {
      safety_incident: 'aAJNkn7v9fRL2XqQCgEkXf',
      ecrec_cashRegistration: 'aE5md7RfHiy4LJmddoFAQH',
      bn_rapidResponse: 'aMJL9DG8qEcULqTZTKQbrq',
      bn_cashForRentApplication: 'aBupWbhtUmA7so3532tYLa',
      bn_cashForRentRegistration: 'ajNzDaUuLkcEvjQhVsAmao',
      shelter_cashForRepair: 'a9CjhyhTKVojCdArKmw9yM',
      bn_1_mpcaNfi: 'a4Sx3PrFMDAMZEGsyzgJJg',
      bn_1_mpcaNfiMyko: 'a8WAWB9Yxu2jkgk4Ei8GTk',
      bn_1_mpcaNfiNaa: 'aBGVXW2N26DaLehmKneuyB',
      bn_0_mpcaRegNewShort: 'a5kgQdqZLLNTLSmC8DK7Eq',
      bn_0_mpcaReg: 'aEwY33SAtdayNTeHoiJfdg',
      bn_0_mpcaRegNoSig: 'aHuWQPkrC43qBfTmJvoLqg',
      bn_0_mpcaRegESign: 'a8JXohrBDqTdCc86Ysz26r',
      bn_re: 'aKgX4MNs6gCemDQKPeXxY8',
      meal_ecrecVerification: 'aEN2tkQhpsfX4G3i6Re7bi',
      meal_visitMonitoring: 'a8GkjWBQDfxVADGHWJDrUw',
      meal_cfmInternal: 'aN3Y8JeH2fU3GthrWAs9FG',
      meal_cfmExternal: 'aJaGLvGEdpYWk5ift8k87y',
      shelter_nta: 'aL8oHMzJJ9soPepvK6YU9E',
      shelter_ta: 'aTP5nwZjpyR7oy7bdMZktC',
      protection_hhs2_1: 'aQDZ2xhPUnNd43XzuQucVR',
      protection_communityMonitoring: 'aQHBhYgevdzw8TR2Vq2ZdR',
      protection_groupSession: 'a8Tn94arrSaH2FQBhUa9Zo',
      protection_pss: 'a52hN5iiCW73mxqqfmEAfp',
      protection_hhs1: 'aFU8x6tHksveU2c3hK7RUG',
      //
      // mealCfmInternal: 'aN3Y8JeH2fU3GthrWAs9FG',
      // mealCfmExternal: 'aJaGLvGEdpYWk5ift8k87y',
      // shelter_cashForRepair: 'a9CjhyhTKVojCdArKmw9yM',
      // shelter_NTA: 'aL8oHMzJJ9soPepvK6YU9E',
      // shelter_TA: 'aTP5nwZjpyR7oy7bdMZktC',
      // bn_Re: 'aKgX4MNs6gCemDQKPeXxY8',
      // bn_RapidResponse: 'aMJL9DG8qEcULqTZTKQbrq',
      // bn_OldMpcaNfi: 'a4Sx3PrFMDAMZEGsyzgJJg',
      // bn_OldMpcaNfiNaa: 'aBGVXW2N26DaLehmKneuyB',
      // bn_OldMpcaNfiMyko: 'a8WAWB9Yxu2jkgk4Ei8GTk',
      // meal_VisitMonitoring: 'a8GkjWBQDfxVADGHWJDrUw',
      // protection_Hhs2_1: 'aQDZ2xhPUnNd43XzuQucVR',
      // protection_Hhs2: 'aRHsewShwZhXiy8jrBj9zf',
      // protection_Hhs1: 'aFU8x6tHksveU2c3hK7RUG',
      // protection_communityMonitoring: 'aQHBhYgevdzw8TR2Vq2ZdR',
      // protection_groupSession: 'a8Tn94arrSaH2FQBhUa9Zo',
      // protection_pss: 'a52hN5iiCW73mxqqfmEAfp',
    }
  }
}

export const koboFormName: Record<keyof typeof kobo.drcUa.form, string> = {
  safety_incident: 'safety_incident',
  ecrec_cashRegistration: '[Ecrec] Sectoral Cash Registration',
  bn_rapidResponse: '[Basic Needs] Rapid Response Mechanism',
  bn_cashForRentApplication: 'bn_cashForRentApplication',
  bn_cashForRentRegistration: 'bn_cashForRentRegistration',
  bn_1_mpcaNfi: '[Basic Needs] v1 Joint MPCA-NFI Registration',
  bn_1_mpcaNfiMyko: '[Basic Needs] v1 Joint MPCA-NFI Registration (Mykolaiv Short Form)',
  bn_1_mpcaNfiNaa: '[Basic Needs] v1 Joint MPCA-NFI Registration Form (NAA Trial)',
  bn_0_mpcaRegNewShort: '[Basic Needs] v0 MPCA Registration (NEW-SHORT 01102022)',
  bn_0_mpcaReg: '[Basic Needs] v0 MPCA Registration',
  bn_0_mpcaRegNoSig: '[Basic Needs] v0 MPCA Registration (GREENLIGHT WITH CONSENT - NO SIGNATURE)',
  bn_0_mpcaRegESign: '[Basic Needs] v0 MPCA Registration (GREENLIGHT WITH ESIGNATURE)',
  bn_re: '[Basic Needs] Registration and Evaluation Form',
  meal_visitMonitoring: 'meal_visitMonitoring',
  meal_cfmInternal: 'meal_cfmInternal',
  meal_cfmExternal: 'meal_cfmExternal',
  meal_ecrecVerification: '[MEAL] Verification EcRec',
  shelter_cashForRepair: '[Shelter] CASH for Repairs Registration Form',
  shelter_nta: 'shelter_nta',
  shelter_ta: 'shelter_ta',
  protection_hhs2_1: 'protection_hhs2_1',
  protection_communityMonitoring: 'protection_communityMonitoring',
  protection_groupSession: 'protection_groupSession',
  protection_pss: 'protection_pss',
  protection_hhs1: 'protection_hhs1',
//
}
