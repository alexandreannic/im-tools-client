import {Meal_CfmExternalOptions} from './Meal_CfmExternalOptions'

type Opt<T extends keyof typeof Meal_CfmExternalOptions> = keyof (typeof Meal_CfmExternalOptions)[T]

export interface Meal_CfmExternal {
  start: string,
  end: string,
  // [note] Будь ласка, зверніть увагу, що Ви збираєтеся поділитись своїми особистими даними з Данською радою у справах біженців (DRC), щоб команда могла відповісти на ваш відгук. Будь ласка, не продовжуйте наше опитування, якщо Ви не бажаєте ділитися своїми контактними даними. Натомість Ви можете зв’язатися з нами за допомогою гарячої лінії.
  consent: string,
  // [select_one] Ви вже є бенефіціаром DRC?
  existing_beneficiary: undefined | Opt<'prot_support'>,
  // [text] Якщо так, опишіть Вашу взаємодію за підтримки DRC
  explain_beneficiary: string | undefined,
  // [text] Ім'я
  name: string | undefined,
  // [select_one] Стать
  gender: undefined | Opt<'gender'>,
  // [date] Дата
  date: Date | undefined,
  // [text] Контактний номер
  phone: string | undefined,
  // [text] Електронна адреса
  email: string | undefined,
  // [select_one] Виберіть область в якій проживаєте
  ben_det_oblast: undefined | Opt<'ben_det_oblast'>,
  // [select_one] Виберіть район в якому проживаєте
  ben_det_raion: undefined | string,
  // [select_one] Виберіть громаду в якій проживаєте
  ben_det_hromada: undefined | string,
  // [select_one] Як ми можемо Вам допомогти?
  feedback_type: undefined | Opt<'feedback_type'>,
  // [text] У разі подяки або відгуку надайте додаткову інформацію
  thanks_feedback: string | undefined,
  // [text] Будь ласка, надайте інформацію щодо вашої скарги
  complaint: string | undefined,
  // [select_one] Ви готові обговорити це з нашою командою DRC, чи Ви хотіли поговорити зі спеціалістом з чутливих випадків?
  prot_support: undefined | Opt<'prot_support'>,
  // [text] Коментар
  comments: string | undefined,
  // [note] Дякуємо, що пройшли це опитування. Ви можете будь-коли скористатися цим інструментом зворотного зв’язку або зателефонувати на нашу гарячу лінію CFM.
  thanks: string,
}