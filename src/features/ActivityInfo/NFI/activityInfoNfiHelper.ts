import {KoboAnswer} from '../../../core/sdk/server/kobo/Kobo'
import {MPCA_NFI} from '../../../core/koboModel/MPCA_NFI/MPCA_NFI'
import {format, subDays} from 'date-fns'
import {MPCA_NFIOptions} from '../../../core/koboModel/MPCA_NFI/MPCA_NFIOptions'

const fixWrongLocationById: Record<string, Pick<MPCA_NFI, 'hromada' | 'raion'> & {settlement: string}> = {
  412897224: {raion: 'chervonohradskyi', hromada: 'chervonohradska', settlement: 'Sosnivka'},
  413039158: {raion: 'chervonohradskyi', hromada: 'chervonohradska', settlement: 'Sosnivka'},
  413319620: {raion: 'drohobytskyi', hromada: 'truskavetska', settlement: 'Truskavets'},
  413698282: {raion: 'drohobytskyi', hromada: 'drohobytska', settlement: 'Drohobych'},
  415147663: {raion: 'lvivskyi', hromada: 'lvivska_2', settlement: 'Lviv'},
  416361434: {raion: 'lvivskyi', hromada: 'lvivska_2', settlement: 'Lviv'},
}
// 23-04-07ChernihivskaChernihivskyiNovobilouska
const fixWrongLocationByDate = [
  {date: '2023-04-02', oblast: 'Lvivska', raion: 'Lvivskyi', hromada: 'Lvivska', settlement: 'Lviv',},
  {date: '2023-04-03', oblast: 'Lvivska', raion: 'Lvivskyi', hromada: 'Lvivska', settlement: 'Lviv',},
  {date: '2023-04-03', oblast: 'Khmelnytska', raion: 'Kamianets-Podilskyi', hromada: 'Kamianets-Podilska', settlement: 'Kamianets-Podilsk',},
  {date: '2023-04-04', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Novobilouska', settlement: 'Tabaivka',},
  {date: '2023-04-04', oblast: 'Lvivska', raion: 'Lvivskyi', hromada: 'Lvivska', settlement: 'Lviv',},
  {date: '2023-04-04', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Novobilouska', settlement: 'Tabaivka',},
  {date: '2023-04-04', oblast: 'Kharkivska', raion: 'Chuhuevskyi', hromada: 'Pechenizhska', settlement: 'Prymorske',},
  {date: '2023-04-05', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Ivanivska', settlement: 'Sloboda',},
  {date: '2023-04-05', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Ivanivska', settlement: 'Sloboda',},
  {date: '2023-04-05', oblast: 'Lvivska', raion: 'Chervonohradskyi', hromada: 'Chervonohradska', settlement: 'Sosnivka',},
  {date: '2023-04-05', oblast: 'Lvivska', raion: 'Chervonohradskyi', hromada: 'Chervonohradska', settlement: 'Sosnivka',},
  {date: '2023-04-05', oblast: 'Dnipropetrovska', raion: 'Dniprovskyi', hromada: 'Dniprovska', settlement: 'Dnipro',},
  {date: '2023-04-05', oblast: 'Chernivetska', raion: 'Cnernivetskyi', hromada: 'Chernivetska', settlement: 'Chernivtsi',},
  {date: '2023-04-05', oblast: 'Lvivska', raion: 'Lvivskyi', hromada: 'Lvivska', settlement: 'Lviv',},
  {date: '2023-04-06', oblast: 'Lvivska', raion: 'Lvivskyi', hromada: 'Lvivska', settlement: 'Lviv',},
  {date: '2023-04-06', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Ivanivska', settlement: 'Selianska Sloboda',},
  {date: '2023-04-06', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Novobilouska', settlement: 'Selianska Sloboda',},
  {date: '2023-04-06', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Novobilouska', settlement: 'Selianska Sloboda',},
  {date: '2023-04-06', oblast: 'Dnipropetrovska', raion: 'Pavlohradskyi', hromada: 'Pavlohradska', settlement: 'Pavlohrad',},
  {date: '2023-04-06', oblast: 'Dnipropetrovska', raion: 'Dniprovskyi', hromada: 'Dniprovska', settlement: 'Dnipro',},
  {date: '2023-04-07', oblast: 'Lvivska', raion: 'Lvivskyi', hromada: 'Lvivska', settlement: 'Lviv',},
  {date: '2023-04-07', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Novobilouska', settlement: 'Tabaivka',},
  {date: '2023-04-07', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Chernihivska', settlement: 'Chernihiv',},
  {date: '2023-04-07', oblast: 'Dnipropetrovska', raion: 'Dniprovskyi', hromada: 'Dniprovska', settlement: 'Dnipro',},
  {date: '2023-04-10', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Chernihivska', settlement: 'Chernihiv',},
  {date: '2023-04-10', oblast: 'Lvivska', raion: 'Lvivskyi', hromada: 'Lvivska', settlement: 'Lviv',},
  {date: '2023-04-10', oblast: 'Dnipropetrovska', raion: 'Kamianskyi', hromada: 'Zhovtovodska', settlement: 'Zhovti vody',},
  {date: '2023-04-10', oblast: 'Dnipropetrovska', raion: 'Dniprovskyi', hromada: 'Dniprovska', settlement: 'Dnipro',},
  {date: '2023-04-10', oblast: 'Dnipropetrovska', raion: 'Dniprovskyi', hromada: 'Sviatovasylivska', settlement: 'Sviatovasylivka',},
  {date: '2023-04-11', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Ivanivska', settlement: 'Budy village',},
  {date: '2023-04-11', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Ivanivska', settlement: 'Budy village',},
  {date: '2023-04-11', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Ivanivska', settlement: 'Budy village',},
  {date: '2023-04-11', oblast: 'Lvivska', raion: 'Stryiskyi', hromada: 'Novorozdilska', settlement: 'Novyi Rozdil',},
  {date: '2023-04-11', oblast: 'Kharkivska', raion: 'Kharkivskyi', hromada: 'Kharkivska', settlement: 'Kharkiv',},
  {date: '2023-04-12', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Novobilouska', settlement: 'Rudka',},
  {date: '2023-04-12', oblast: 'Dnipropetrovska', raion: 'Synelnykivskyi', hromada: 'Synelnykivska', settlement: 'Synelnykovo',},
  {date: '2023-04-13', oblast: 'Lvivska', raion: 'Lvivskyi', hromada: 'Lvivska', settlement: 'Lviv',},
  {date: '2023-04-13', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Chernihivska', settlement: 'Chernihiv',},
  {date: '2023-04-13', oblast: 'Dnipropetrovska', raion: 'Dniprovskyi', hromada: 'Dniprovska', settlement: 'Dnipro',},
  {date: '2023-04-13', oblast: 'Dnipropetrovska', raion: 'Dniprovskyi', hromada: 'Sviatovasylivska', settlement: 'Sviatovasylivka',},
  {date: '2023-04-14', oblast: 'Chernihivska', raion: 'Koriukivskyi', hromada: 'Snovska', settlement: 'Snovsk',},
  {date: '2023-04-18', oblast: 'Dnipropetrovska', raion: 'Synelnykivskyi', hromada: 'Vasylkivska', settlement: 'Vasylkivka',},
  {date: '2023-04-19', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Kyselivska', settlement: 'Voznesenske',},
  {date: '2023-04-19', oblast: 'Dnipropetrovska', raion: 'Dniprovskyi', hromada: 'Novooleksandrivska', settlement: 'Novooleksandrivka',},
  {date: '2023-04-19', oblast: 'Dnipropetrovska', raion: 'Dniprovskyi', hromada: 'Dniprovska', settlement: 'Dnipro',},
  {date: '2023-04-19', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Kyselivska', settlement: 'Voznesenske',},
  {date: '2023-04-19', oblast: 'Lvivska', raion: 'Lvivskyi', hromada: 'Lvivska', settlement: 'Lviv',},
  {date: '2023-04-20', oblast: 'Dnipropetrovska', raion: 'Kamianskyi', hromada: 'Lykhivska', settlement: 'Lykhivka',},
  {date: '2023-04-20', oblast: 'Lvivska', raion: 'Lvivskyi', hromada: 'Lvivska', settlement: 'Lviv',},
  {date: '2023-04-21', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Chernihivska', settlement: 'Chernihiv',},
  {date: '2023-04-21', oblast: 'Chernihivska', raion: 'Koriukivskyi', hromada: 'Menska', settlement: 'Liski',},
  {date: '2023-04-24', oblast: 'Dnipropetrovska', raion: 'Pavlohradskyi', hromada: 'Pavlohradska', settlement: 'Pavlohrad',},
  {date: '2023-04-25', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Novobilouska', settlement: 'Rudka',},
  {date: '2023-04-25', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Novobilouska', settlement: 'Rudka',},
  {date: '2023-04-26', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Kyinska', settlement: 'Trysviatska Sloboda',},
  {date: '2023-04-26', oblast: 'Dnipropetrovska', raion: 'Dniprovskyi', hromada: 'Dniprovska', settlement: 'Dnipro',},
  {date: '2023-04-27', oblast: 'Dnipropetrovska', raion: 'Dniprovskyi', hromada: 'Dniprovska', settlement: 'Dnipro',},
  {date: '2023-04-27', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Kyselivska', settlement: 'Voznesenske',},
  {date: '2023-04-27', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Kyselivska', settlement: 'Voznesenske',},
  {date: '2023-04-27', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Kyselivska', settlement: 'Voznesenske',},
  {date: '2023-04-27', oblast: 'Chernihivska', raion: 'Chernihivskyi', hromada: 'Kyselivska', settlement: 'Voznesenske',},
  {date: '2023-04-28', oblast: 'Kharkivska', raion: 'Kharkivskyi', hromada: 'Kharkivska', settlement: 'Kharkiv',},
]
// 23-04-28ChernihivskaChernihivskyiKyselivska
export const fixLocations = (answers: KoboAnswer<MPCA_NFI>[]): KoboAnswer<MPCA_NFI & {settlement?: string}>[] => {
  return answers.map(a => {
    const fixById: (typeof fixWrongLocationById)[keyof typeof fixWrongLocationById] = (fixWrongLocationById as any)[a.id]
    if (fixById) {
      return {
        ...a,
        ...fixById as any,
        // raion: fixById.raion as any,
        // hromada: fixById.hromada as any,
        // settlement: fixById.settlement,
      }
    }
    let fixByDate = fixWrongLocationByDate.find(_ => _.date === format(a.start, 'yyyy-MM-dd')
      && _.oblast === MPCA_NFIOptions.oblast[a.oblast]
      && _.raion === MPCA_NFIOptions.raion[a.raion]
      && _.hromada === MPCA_NFIOptions.hromada[a.hromada]
    )
    if (!fixByDate) {
      fixByDate = fixWrongLocationByDate.find(_ => _.date === format(subDays(a.start, 1), 'yyyy-MM-dd')
        && _.oblast === MPCA_NFIOptions.oblast[a.oblast]
        && _.raion === MPCA_NFIOptions.raion[a.raion]
        && _.hromada === MPCA_NFIOptions.hromada[a.hromada]
      )
    }
    if (fixByDate) {
      return {
        ...a,
        settlement: fixByDate.settlement,
      }
      // if (a.hromada !== fixByDate.hromada) {
      // console.error(`Not found`, a.id)
      // }
      // (a as any).settlement = fixByDate.settlement
    }
    return a
  })
}