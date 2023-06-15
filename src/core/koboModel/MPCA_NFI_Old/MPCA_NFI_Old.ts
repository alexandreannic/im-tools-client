import {MPCA_NFI_OldOptions} from './MPCA_NFI_OldOptions'

type Opt<T extends keyof typeof MPCA_NFI_OldOptions> = keyof (typeof MPCA_NFI_OldOptions)[T]

export interface MPCA_NFI_Old {
  start: string,
  end: string,
  // Офіс, який відповідає за розподіл
  location_office: Opt<'location_office'>,
  // Запишіть своє поточне місцезнаходження
  location_geopoint: string,
  // Я даю згоду ДРБ використовувати свою особисту інформацію для надання допомоги та оприлюднення вищезазначеної інформації в інші сектори ДРБ. Зрозуміло, що, даючи цю згоду, інформація буде розглядатися обережно та конфіденційно та суворо в інтересах сприяння доступу для захисту чи допомоги.
  consent: string,
  // Ім'я голови домогосподарства
  name: string | undefined,
  // Телефон голови домогосподарства або довіреної особи
  contact: string | undefined,
  // Чи має бенефіціар індивідуальний податковий номер (ІПН)?
  Does_the_beneficiary_have_an_i: Opt<'Does_the_beneficiary_have_an_i'>,
  // Інше посвідчення особи
  Other_ID_identification: Opt<'Other_ID_identification'>,
  // Номер ID
  Number_of_ID: string | undefined,
  // Ідентифікаційний номер (ІПН) голови домогосподарства
  ITN: string | undefined,
  // Стать голови домогосподарства
  _gender: Opt<'_gender'>,
  // Який Ваш поточний статус?
  What_is_your_current_status: Opt<'What_is_your_current_status'>,
  // Чи маєте ви довідку ВПО?
  IDP_status: Opt<'IDP_status'>,
  // Вкажіть ЗАГАЛЬНУ кількість осіб вашого домогосподарства, ВКЛЮЧАЮЧИ голову домогосподарства
  Total_Family: number | undefined,
  // Склад сім'ї
  _Family_composition: Opt<'_Family_composition'>[],
  // 0 - 2 років чоловіки (до 24 місяців): Скільки?
  Quantity_02_Male: number | undefined,
  // 0 - 2 років Жінки (до 24 місяців): Скільки?
  Quantity_02_Female: number | undefined,
  // 2 - 4 років чоловіки: Скільки?
  Quantity_24_Male: number | undefined,
  // 2 - 4 років Жінки: Скільки?
  Quantity_24_Female: number | undefined,
  // 5 - 17 років чоловіки: Скільки?
  Quantity_517_Male: number | undefined,
  // 5 - 17 років Жінки: Скільки?
  Quantity_517_Female: number | undefined,
  // 18 - 49 років чоловіки: Скільки?
  Quantity_1849_Male: number | undefined,
  // 18 - 49 років Жінки: Скільки?
  Quantity_1849_Female: number | undefined,
  // 50 - 64 років чоловіки: Скільки?
  Quantity_5064_Male: number | undefined,
  // 50 - 64 років Жінки: Скільки?
  Quantity_5064_Female: number | undefined,
  // 65+ років чоловіки: Скільки?
  Quantity_65_Male: number | undefined,
  // 65+ років Жінки: Скільки?
  Quantity_65_Female: number | undefined,
  // Чи хтось у вашому сімействі не бажає ідентифікувати себе з певною статтю?
  Is_any_person_in_your_HH_not_w: Opt<'Is_any_person_in_your_HH_not_w'>,
  // 0-2 років
  NoIdentification_Age_0_2: number | undefined,
  // 2-4 років
  NoIdentification_Age_2_4: number | undefined,
  // 5-17 років
  NoIdentification_Age_5_17: number | undefined,
  // 18-49 років
  NoIdentification_Age_18_49: number | undefined,
  // 50-64 років
  NoIdentification_Age_50_64: number | undefined,
  // 65+ років
  NoIdentification_Age_65: number | undefined,
  // Усього вказано ${Total_Family} членів сім’ї, і розподіл включає ${Total_Family2}.
  HH_Check: string,
  // Чи є хтось у Вашій родині з інвалідністю? Виберіть все зі списку.
  Does_anyone_in_your_elect_all_that_apply: Opt<'Does_anyone_in_your_elect_all_that_apply'>[],
  // Kits to be provided
  Kits_to_be_provided: Opt<'Kits_to_be_provided'>[],
  // HKMV Сімейний гігієнічний набір для ВПО в дорозі: Скільки?
  HKMV_: number | undefined,
  // HKF Сімейний гігієнічний набір для ВПО без засобів  існування: Скільки?
  HKF_: number | undefined,
  // NFKF Сімейний непродовольчий набір NFI: Скільки?
  NFKF_NFI_: number | undefined,
  // KS Сімейний кухонний набір: Скільки?
  KS_: number | undefined,
  // BK1 Гігієнічний набір для дитини 1: Скільки?
  BK_Baby_Kit_: number | undefined,
  // BK2 Гігієнічний набір для дитини 2: Скільки?
  BK_Baby_Kit_1: number | undefined,
  // BK3 Гігієнічний набір для дитини 3: Скільки?
  BK_Baby_Kit_2: number | undefined,
  // BK4 Гігієнічний набір для дитини 4: Скільки?
  BK_Baby_Kit_3: number | undefined,
  // BK Гігієнічний набір для дитини: Розмір?
  BK_Baby_Kit: number | undefined,
  // BKA1 BK Додатковий пункт 1: Скільки?
  BKA1_BK_1_: number | undefined,
  // BKA2 BK Додатковий пункт 2: Скільки?
  BKA2_BK_2_: number | undefined,
  // BKA3 BK Додатковий пункт 3: Скільки?
  BKA3_BK_3_: number | undefined,
  // BKA4 BK Додатковий пункт 4: Скільки?
  BKA4_BK_4_: number | undefined,
  // WKB1 Дитячий набір для зимування № 1: Скільки?
  WKB1_1_: number | undefined,
  // WKB2 Дитячий набір для зимування № 2: Скільки?
  WKB2_2_: number | undefined,
  // WKB3 Дитячий набір для зимування № 3: Скільки?
  WKB3_3_: number | undefined,
  // WKB4 Дитячий набір для зимування № 4: Скільки?
  WKB4_4_: number | undefined,
  // BLN Термоковдри: Скільки?
  BLN_: number | undefined,
  // Сонячні лампи: Скільки?
  BLN: number | undefined,
  // У цьому домі є ${Total_Babies} немовлят і ${Total_BBKits} дитячих наборів, які планується роздати (${Total_BBKits_Hygiene} гігієнічних наборів і ${Total_BBKits_Winter} зимових наборів). Це правильно?
  KitsBB_Check: string,
  // Для цієї родини заплановано ${Total_Kits} комплектів.
  Kits_Check: string,
  // Фото Паспорт 1 сторінка
  Photo_Passport_1: string,
  // Фото Паспорт 2 сторінка
  Photo_Passport_2: string,
  // Фото Паспорт Прописка
  Photo_Passport_3: string,
  // Фото ІПН (ідентифікаційний код)
  Photo_ITN: string,
  // Фото довідки ВПО
  Photo_IDP: string,
  // Ваша родина може мати право на багатоцільову грошову допомогу. З цієї причини ми хотіли б зібрати додаткову інформацію про вашу родину. Якщо буде визнано відповідним, команда DRC зв’яжеться з вами. Ви готові продовжити?
  MPCA_note: string,
  // Виберіть усе, що підходить для домашнього господарства.
  MPCA_vulnerabilities: Opt<'MPCA_vulnerabilities'>[],
  // Ім'я працівника
  _name_of_employee: Opt<'_name_of_employee'>,
}