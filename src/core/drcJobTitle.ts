// export const drcDepartements = [
//   'PSS',
//   'Protection',
//   'GBV',
//   'MEAL',
//   'MPCA/NFI'
// ]
//
// const jobTitles = [
//   'Coordinator',
//   'Manager',
//   'Team Leader',
//   'Officer',
//   'Assistant',
// ]

export enum DrcJob {
  'Protection Coordinator' = 'Protection Coordinator',
  'Protection Manager' = 'Protection Manager',
  'Protection Team Leader' = 'Protection Team Leader',
  'Protection Officer' = 'Protection Officer',
  'Protection Assistant' = 'Protection Assistant',
  'PSS Coordinator' = 'PSS Coordinator',
  'PSS Manager' = 'PSS Manager',
  'PSS Team Leader' = 'PSS Team Leader',
  'PSS Officer' = 'PSS Officer',
  'PSS Assistant' = 'PSS Assistant',
  'MEAL Coordinator' = 'MEAL Coordinator',
  'MEAL Manager' = 'MEAL Manager',
  'MEAL Team Leader' = 'MEAL Team Leader',
  'MEAL Officer' = 'MEAL Officer',
  'MEAL Assistant' = 'MEAL Assistant',
  'MPCA/NFI Coordinator' = 'MPCA/NFI Coordinator',
  'MPCA/NFI Manager' = 'MPCA/NFI Manager',
  'MPCA/NFI Team Leader' = 'MPCA/NFI Team Leader',
  'MPCA/NFI Officer' = 'MPCA/NFI Officer',
  'MPCA/NFI Assistant' = 'MPCA/NFI Assistant',
  'GBV Coordinator' = 'GBV Coordinator',
  'GBV Manager' = 'GBV Manager',
  'GBV Team Leader' = 'GBV Team Leader',
  'GBV Officer' = 'GBV Officer',
  'GBV Assistant' = 'GBV Assistant',
}

export enum DrcOffice {
  Kyiv = 'Kyiv',
  Sumy = 'Sumy',
  Mykolaiv = 'Mykolaiv',
  Lviv = 'Lviv',
  Chernihiv = 'Chernihiv',
  Kharkiv = 'Kharkiv',
  Dnipro = 'Dnipro',
}