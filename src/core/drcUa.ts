export enum DrcOffice {
  Kyiv = 'Kyiv',
  Sumy = 'Sumy',
  Mykolaiv = 'Mykolaiv',
  Lviv = 'Lviv',
  Chernihiv = 'Chernihiv',
  Kharkiv = 'Kharkiv',
  Dnipro = 'Dnipro',
  Poltava = 'Poltava',
  Chernivtsi = 'Chernivtsi',
}

export enum DrcDonor {
  BHA = 'BHA',
  ECHO = 'ECHO',
  SDC = 'SDC',
  FCDO = 'FCDO',
  OKF = 'OKF',
  PSPU = 'PSPU',
  POFU = 'POFU',
  FINM = 'FINM',
  FREM = 'FREM',
  EUIC = 'EUIC',
  PMRA = 'PMRA',
  PMKA = 'PMKA',
  SIDA = 'SIDA',
  UHF = 'UHF',
  UNHC = 'UNHC',
  DANI = 'DANI',
  DUT = 'DUT',
  NONO = 'NONO',
  SDCS = 'SDCS',
  MOFA = 'MOFA',
  // 'BHA' = 'BHA',
  // 'OKF' = 'OKF',
  // 'ECHO' = 'ECHO',
  // 'UHF_IV' = 'UHF IV',
  // 'NN2' = 'NN2',
}

export enum DrcProject {
  'BHA (UKR-000284)' = 'BHA (UKR-000284)',
  'ECHO1 (UKR-000269)' = 'ECHO1 (UKR-000269)',
  'ECHO2 (UKR-000322)' = 'ECHO2 (UKR-000322)',
  'SDC (UKR-000226)' = 'SDC (UKR-000226)',
  'FCDO (UKR-000247)' = 'FCDO (UKR-000247)',
  'OKF (UKR-000309)' = 'OKF (UKR-000309)',
  'PSPU (UKR- 000304)' = 'PSPU (UKR- 000304)',
  'Pooled Funds (UKR-000270)' = 'Pooled Funds (UKR-000270)',
  'Finnish MFA (UKR-000249)' = 'Finnish MFA (UKR-000249)',
  'French MFA (UKR-000293)' = 'French MFA (UKR-000293)',
  'EU IcSP (UKR-000255)' = 'EU IcSP (UKR-000255)',
  'PM WRA (UKR-000230)' = 'PM WRA (UKR-000230)',
  'PM WKA (UKR-000231)' = 'PM WKA (UKR-000231)',
  'SIDA 518-570A' = 'SIDA 518-570A',
  'UHF3 (UKR-000276)' = 'UHF3 (UKR-000276)',
  'UHF4 (UKR-000314)' = 'UHF4 (UKR-000314)',
  'UNHCR (UKR-000308)' = 'UNHCR (UKR-000308)',
  'DANIDA (UKR-000267)' = 'DANIDA (UKR-000267)',
  'Dutch I (UKR-000294)' = 'Dutch I (UKR-000294)',
  'Dutch II (UKR-000306)' = 'Dutch II (UKR-000306)',
  'Novo-Nordisk (UKR-000274)' = 'Novo-Nordisk (UKR-000274)',
  'SDC Shelter (UKR-000290)' = 'SDC Shelter (UKR-000290)',
  'DANISH MoFA (UKR-000301)' = 'DANISH MoFA (UKR-000301)',
}

export const drcDonorProjectCode = {
  'BHA': [DrcProject['BHA (UKR-000284)'],],
  'ECHO': [DrcProject['ECHO1 (UKR-000269)'], DrcProject['ECHO2 (UKR-000322)']],
  'SDC': [DrcProject['SDC (UKR-000226)'],],
  'FCDO': [DrcProject['FCDO (UKR-000247)'],],
  'OKF': [DrcProject['OKF (UKR-000309)'],],
  'PSPU': [DrcProject['PSPU (UKR- 000304)'],],
  'POFU': [DrcProject['Pooled Funds (UKR-000270)'],],
  'FINM': [DrcProject['Finnish MFA (UKR-000249)'],],
  'FREM': [DrcProject['French MFA (UKR-000293)'],],
  'EUIC': [DrcProject['EU IcSP (UKR-000255)'],],
  'PMRA': [DrcProject['PM WRA (UKR-000230)'],],
  'PMKA': [DrcProject['PM WKA (UKR-000231)'],],
  'SIDA': [DrcProject['SIDA 518-570A'],],
  'UHF': [DrcProject['UHF3 (UKR-000276)'], DrcProject['UHF4 (UKR-000314)']],
  'UNHC': [DrcProject['UNHCR (UKR-000308)'],],
  'DANI': [DrcProject['DANIDA (UKR-000267)'],],
  'DUT': [DrcProject['Dutch I (UKR-000294)'], DrcProject['Dutch II (UKR-000306)']],
  'NONO': [DrcProject['Novo-Nordisk (UKR-000274)'],],
  'SDCS': [DrcProject['SDC Shelter (UKR-000290)'],],
  'MOFA': [DrcProject['DANISH MoFA (UKR-000301)']],
}

export enum DrcJob {
  // 'Protection Coordinator' = 'Protection Coordinator',
  // 'Protection Manager' = 'Protection Manager',
  // 'Protection Team Leader' = 'Protection Team Leader',
  // 'Protection TL' = 'Protection TL',
  // 'Protection Officer' = 'Protection Officer',
  // 'Protection Assistant' = 'Protection Assistant',
  // 'PSS Coordinator' = 'PSS Coordinator',
  // 'PSS Manager' = 'PSS Manager',
  // 'PSS Team Leader' = 'PSS Team Leader',
  // 'PSS Officer' = 'PSS Officer',
  // 'PSS Assistant' = 'PSS Assistant',
  // 'MEAL Coordinator' = 'MEAL Coordinator',
  // 'MEAL Manager' = 'MEAL Manager',
  // 'MEAL Team Leader' = 'MEAL Team Leader',
  // 'MEAL Officer' = 'MEAL Officer',
  // 'MEAL Assistant' = 'MEAL Assistant',
  // 'Monitoring, Evaluation, Accountability and Learning Officer' = 'Monitoring, Evaluation, Accountability and Learning Officer',
  // 'Monitoring, Evaluation, Accountability and Learning Specialist' = 'Monitoring, Evaluation, Accountability and Learning Specialist',
  // 'MPCA/NFI Coordinator' = 'MPCA/NFI Coordinator',
  // 'MPCA/NFI Manager' = 'MPCA/NFI Manager',
  // 'MPCA/NFI Team Leader' = 'MPCA/NFI Team Leader',
  // 'MPCA/NFI Officer' = 'MPCA/NFI Officer',
  // 'MPCA/NFI Assistant' = 'MPCA/NFI Assistant',
  // 'MPCA / NFI Assistant' = 'MPCA / NFI Assistant',
  // 'MPCA Assistant' = 'MPCA Assistant',
  // 'Cash And Voucher Assistance Officer' = 'Cash And Voucher Assistance Officer',
  // 'Distribution TL' = 'Distribution TL',
  // 'NFI Assistant' = 'NFI Assistant',
  // 'GBV Coordinator' = 'GBV Coordinator',
  // 'GBV Manager' = 'GBV Manager',
  // 'GBV Team Leader' = 'GBV Team Leader',
  // 'GBV Officer' = 'GBV Officer',
  // 'GBV Assistant' = 'GBV Assistant',
  // 'Shelter and Settlement Manager' = 'Shelter and Settlement Manager',
  // 'Shelter Assistant' = 'Shelter Assistant',
  // 'Shelter and Settlement specialist' = 'Shelter and Settlement specialist',
  // 'Area Manager' = 'Area Manager',
  // 'Base Manager' = 'Base Manager',
  // 'Partnership Manager' = 'Partnership Manager',
  // 'Capacity Building Programme Manager' = 'Capacity Building Programme Manager',
  // 'Global Roving Advisor' = 'Global Roving Advisor',
  // 'Gender Based Violence Specialist' = 'Gender Based Violence Specialist',
  // 'Shelter Officer' = 'Shelter Officer',
  // 'Shelter and Settlement Team Leader' = 'Shelter and Settlement Team Leader',
  // 'Shelter and Settlement Coordinator' = 'Shelter and Settlement Coordinator',
  // 'Cash and Voucher Assistance Manager' = 'Cash and Voucher Assistance Manager',
  // 'Economic Recovery Officer' = 'Economic Recovery Officer',
  // 'Accountant' = 'Accountant',
  // 'Programme Officer' = 'Programme Officer',
  // 'Head of Humanitarian Disarmament and Peacebuilding' = 'Head of Humanitarian Disarmament and Peacebuilding',
  // 'Cash and Voucher Assistance Assistant' = 'Cash and Voucher Assistance Assistant',
  // 'Protection Specialist' = 'Protection Specialist',
  // 'Shelter and Settlement Assistant' = 'Shelter and Settlement Assistant',

  'Deminer' = 'Deminer',
  'Livelihoods Assistant' = 'Livelihoods Assistant',
  'Livelihoods Officer' = 'Livelihoods Officer',
  'Accountant' = 'Accountant',
  'Accountant Officer' = 'Accountant Officer',
  'Admin Assistant' = 'Admin Assistant',
  'Admin Officer' = 'Admin Officer',
  'Administration Assistant' = 'Administration Assistant',
  'Administration Officer' = 'Administration Officer',
  'Advocacy Coordinator' = 'Advocacy Coordinator',
  'Ambulance Driver' = 'Ambulance Driver',
  'Area Manager' = 'Area Manager',
  'Area Support Service Manager' = 'Area Support Service Manager',
  'Base Manager' = 'Base Manager',
  'Capacity Building Programme Manager' = 'Capacity Building Programme Manager',
  'Capacity Building Project Assistant' = 'Capacity Building Project Assistant',
  'Capacity Building Project Officer' = 'Capacity Building Project Officer',
  'Capacity Development Team Leader' = 'Capacity Development Team Leader',
  'Cash and Voucher Assistance Assistant' = 'Cash and Voucher Assistance Assistant',
  'Cash and Voucher Assistance Manager' = 'Cash and Voucher Assistance Manager',
  'Cash and Voucher Assistance Officer' = 'Cash and Voucher Assistance Officer',
  'Cash and Voucher Assistance Team Leader' = 'Cash and Voucher Assistance Team Leader',
  'Cleaner' = 'Cleaner',
  'Comms Assistant' = 'Comms Assistant',
  'Communications Manager' = 'Communications Manager',
  'Communications Specialist' = 'Communications Specialist',
  'Country Director' = 'Country Director',
  'Country Programme Manager' = 'Country Programme Manager',
  'CSO Partnership Officer' = 'CSO Partnership Officer',
  'CVA Assistant' = 'CVA Assistant',
  'Demining Deputy Team Lead' = 'Demining Deputy Team Lead',
  'Demining Deputy Team Leader' = 'Demining Deputy Team Leader',
  'Demining Supervisor' = 'Demining Supervisor',
  'Demining Team Lead' = 'Demining Team Lead',
  'Deputy TL' = 'Deputy TL',
  'Distribution TL' = 'Distribution TL',
  'Driver' = 'Driver',
  'Driver (DRC HDP - Demining)' = 'Driver (DRC HDP – Demining)',
  'Driver Demining' = 'Driver Demining',
  'Driver Demining (Ambulance)' = 'Driver Demining (Ambulance)',
  'Driver with own vechicle' = 'Driver with own vechicle',
  'Driver with own vehicle' = 'Driver with own vehicle',
  'Economic Recovery Assistant' = 'Economic Recovery Assistant',
  'Economic Recovery Coordinator' = 'Economic Recovery Coordinator',
  'Economic Recovery Officer' = 'Economic Recovery Officer',
  'Economic Recovery Team Leader' = 'Economic Recovery Team Leader',
  'EconomicRecovery Assistant' = 'EconomicRecovery Assistant',
  'Emergency Distribution officer' = 'Emergency Distribution officer',
  'Emergency Team Officer' = 'Emergency Team Officer',
  'EORE Assistant' = 'EORE Assistant',
  'EORE Facilitator' = 'EORE Facilitator',
  'EORE Officer' = 'EORE Officer',
  'EORE Specialist' = 'EORE Specialist',
  'EORE Team Leader' = 'EORE Team Leader',
  'Fin Adm Assist' = 'Fin Adm Assist',
  'Finance and Administration Assistant' = 'Finance and Administration Assistant',
  'Finance and Administration Manager' = 'Finance and Administration Manager',
  'Finance and Administration Officer' = 'Finance and Administration Officer',
  'Finance Assistant' = 'Finance Assistant',
  'Finance Officer' = 'Finance Officer',
  'Finance officer' = 'Finance officer',
  'Finance Specialist' = 'Finance Specialist',
  'Finance Team Leader' = 'Finance Team Leader',
  'GBV Assistant' = 'GBV Assistant',
  'GBV Team Leader' = 'GBV Team Leader',
  'Gender Based Violence Specialist' = 'Gender Based Violence Specialist',
  'General Support' = 'General Support',
  'Government Liason Officer' = 'Government Liason Officer',
  'Grants Coordinator' = 'Grants Coordinator',
  'Grants Management Assistant' = 'Grants Management Assistant',
  'Grants Management Officer' = 'Grants Management Officer',
  'Grants Management Specialist' = 'Grants Management Specialist',
  'HDP Interpretor' = 'HDP Interpretor',
  'Head of Humanitarian Disarmament and Peacebuilding' = 'Head of Humanitarian Disarmament and Peacebuilding',
  'Head of Operations' = 'Head of Operations',
  'Head of Programme' = 'Head of Programme',
  'Head of Safety' = 'Head of Safety',
  'MPCA Officer' = 'MPCA Officer',
  'Head of Support Services' = 'Head of Support Services',
  'HMA Deminer' = 'HMA Deminer',
  'HMA Demining Supervisor' = 'HMA Demining Supervisor',
  'HMA Deputy Team Lead' = 'HMA Deputy Team Lead',
  'HMA NTS Officer/ Team Lead' = 'HMA NTS Officer/ Team Lead',
  'HMA NTS Operator' = 'HMA NTS Operator',
  'HMA NTS Operator/Surveyor' = 'HMA NTS Operator/Surveyor',
  'HMA Officer' = 'HMA Officer',
  'HMA Programme Manager (Capacity Building)' = 'HMA Programme Manager (Capacity Building)',
  'HR and Administration Assistant' = 'HR and Administration Assistant',
  'HR and Administration Officer' = 'HR and Administration Officer',
  'HR Assistant' = 'HR Assistant',
  'HR Officer' = 'HR Officer',
  'HR Specialist' = 'HR Specialist',
  'Humanitarian Disarmament and Peacebuilding Programme Manager' = 'Humanitarian Disarmament and Peacebuilding Programme Manager',
  'Humanitarian Mine Action Officer' = 'Humanitarian Mine Action Officer',
  'Humanitarian Mine Action Operations Manager' = 'Humanitarian Mine Action Operations Manager',
  'Humanitarian Mine Action Specialist' = 'Humanitarian Mine Action Specialist',
  'Humanitarian Mine Action Supervisor' = 'Humanitarian Mine Action Supervisor',
  'Humanitarian Mine Action Team Member' = 'Humanitarian Mine Action Team Member',
  'Humanitarian Mine Action Technical Field Manager' = 'Humanitarian Mine Action Technical Field Manager',
  'IM and Database Assistant' = 'IM and Database Assistant',
  'IM GIS Officer' = 'IM GIS Officer',
  'IM Officer' = 'IM Officer',
  'Information Management Assistant' = 'Information Management Assistant',
  'Information Management Coordinator' = 'Information Management Coordinator',
  'Information Management Officer' = 'Information Management Officer',
  'Information Management Specialist' = 'Information Management Specialist',
  'IT Support' = 'IT Support',
  'LAU Suport' = 'LAU Suport',
  'Lawyer' = 'Lawyer',
  'Legal Aid Manager' = 'Legal Aid Manager',
  'Legal Aid Officer' = 'Legal Aid Officer',
  'Legal Aid Team Leader' = 'Legal Aid Team Leader',
  'Legal Analyst' = 'Legal Analyst',
  'Legal Digital Platfoem Coordinator' = 'Legal Digital Platfoem Coordinator',
  'Legal Manager' = 'Legal Manager',
  'Legal CB Officer' = 'Legal СВ Officer',
  'Livelihoods Program Manager' = 'Livelihoods Program Manager',
  'MEAL Assistant' = 'MEAL Assistant',
  'MEAL Officer' = 'MEAL Officer',
  'MEAL Specialist' = 'MEAL Specialist',
  'Medical Coordinator' = 'Medical Coordinator',
  'Monitoring, Evaluation, Accountability and Learning Manager' = 'Monitoring, Evaluation, Accountability and Learning Manager',
  'Monitoring, Evaluation, Accountability and Learning Specialist' = 'Monitoring, Evaluation, Accountability and Learning Specialist',
  'MPCA / NFI Assistant' = 'MPCA / NFI Assistant',
  'MPCA Assistant' = 'MPCA Assistant',
  'MPCA/NFI Assistant' = 'MPCA/NFI Assistant',
  'MPCA/NFI Officer' = 'MPCA/NFI Officer',
  'MPCA/NFI Team Leader' = 'MPCA/NFI Team Leader',
  'NFI - Assistant' = 'NFI - Assistant',
  'NFI Assistant' = 'NFI Assistant',
  'NFI Officer' = 'NFI Officer',
  'NTS Driver' = 'NTS Driver',
  'NTS Officer' = 'NTS Officer',
  'NTS Officer / Team Lead' = 'NTS Officer / Team Lead',
  'NTS Officer/Team Lead' = 'NTS Officer/Team Lead',
  'NTS Operator / Surveyor' = 'NTS Operator / Surveyor',
  'NTS Operator/Surveyor' = 'NTS Operator/Surveyor',
  'NTS Team Lead' = 'NTS Team Lead',
  'Paramedic' = 'Paramedic',
  'Parking' = 'Parking',
  'Partnership Manager' = 'Partnership Manager',
  'Peace and Stabilisation Programme' = 'Peace and Stabilisation Programme',
  'Programme Officer' = 'Programme Officer',
  'Programme Specialist - HMA' = 'Programme Specialist - HMA',
  'Programme Team Leader' = 'Programme Team Leader',
  'Project Officer' = 'Project Officer',
  'Project Officer - HMA' = 'Project Officer - HMA',
  'Protection Assistant' = 'Protection Assistant',
  'Protection Assistant (GBV)' = 'Protection Assistant (GBV)',
  'Protection Coordinator' = 'Protection Coordinator',
  'Protection Manager' = 'Protection Manager',
  'Protection Officer' = 'Protection Officer',
  'Protection Officer - Psychosocial Support' = 'Protection Officer - Psychosocial Support',
  'Protection Officer (GBV)' = 'Protection Officer (GBV)',
  'Protection Officer (Legal Analyst)' = 'Protection Officer (Legal Analyst)',
  'Protection Officer (Legal Partnership)' = 'Protection Officer (Legal Partnership)',
  'Protection Officer Lawyer' = 'Protection Officer Lawyer',
  'Protection Project Manager (IDP Legal Aid)' = 'Protection Project Manager (IDP Legal Aid)',
  'Protection Team Leader' = 'Protection Team Leader',
  'Protection TL' = 'Protection TL',
  'General Protection' = 'General Protection',
  'PSS Assistant' = 'PSS Assistant',
  'PSS Officer' = 'PSS Officer',
  'Quality Management Officer' = 'Quality Management Officer',
  'Quality Officer' = 'Quality Officer',
  'Radio operator' = 'Radio operator',
  'Radio Operator & Supply Chain Officer' = 'Radio Operator & Supply Chain Officer',
  'SAF Officer' = 'SAF Officer',
  'Safety Assistant' = 'Safety Assistant',
  'Safety Manager' = 'Safety Manager',
  'Safety Officer' = 'Safety Officer',
  'Safety Specialist' = 'Safety Specialist',
  'Senior Driver' = 'Senior Driver',
  'Shelter and Settelment Officer' = 'Shelter and Settelment Officer',
  'Shelter and Settlement Assistant' = 'Shelter and Settlement Assistant',
  // "Shelter and Settlement Assistant" = "Shelter and Settlement Assistant",
  'Shelter and Settlement Cluster Co-Coordinator' = 'Shelter and Settlement Cluster Co-Coordinator',
  'Shelter and Settlement Coordinator' = 'Shelter and Settlement Coordinator',
  'Shelter and Settlement Manager' = 'Shelter and Settlement Manager',
  'Shelter and Settlement Officer' = 'Shelter and Settlement Officer',
  'Shelter and Settlement specialist' = 'Shelter and Settlement specialist',
  'Shelter and Settlement Team Leader' = 'Shelter and Settlement Team Leader',
  'Shelter Assistant' = 'Shelter Assistant',
  'Shelter Officer' = 'Shelter Officer',
  'Shelter Team Leader' = 'Shelter Team Leader',
  'SMM Officer' = 'SMM Officer',
  'Supply Chain - Procurement Assistant' = 'Supply Chain - Procurement Assistant',
  'Supply Chain Assistant' = 'Supply Chain Assistant',
  'Supply Chain Manager' = 'Supply Chain Manager',
  'Supply Chain Officer' = 'Supply Chain Officer',
  'Supply Chain Team Leader' = 'Supply Chain Team Leader',
  'Support Services Manager' = 'Support Services Manager',
  'Support Services Officer' = 'Support Services Officer',
  'Translator' = 'Translator',
  'VA Specialist' = 'VA Specialist',
  'Victim Assistance Facilitator' = 'Victim Assistance Facilitator',
  'Victim Assistance Specialist' = 'Victim Assistance Specialist',
  'Warehouse Assistant' = 'Warehouse Assistant'
}
