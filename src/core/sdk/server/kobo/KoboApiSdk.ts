import {ApiClient} from '../ApiClient'
import {ApiPaginate, ApiPagination, UUID} from '../../../type'
import {IKoboForm, Kobo, KoboAnswer2, KoboId} from './Kobo'
import {mapMPCA_NFI} from '../../../koboModel/MPCA_NFI/MPCA_NFIMapping'
import {mapMPCA_NFI_Myko} from '../../../koboModel/MPCA_NFI_Myko/MPCA_NFI_MykoMapping'
import {mapMPCA_NFI_NAA} from '../../../koboModel/MPCA_NFI_NAA/MPCA_NFI_NAAMapping'
import {KoboApiForm} from './KoboApi'
import {mapMPCA_NFI_Old} from '../../../koboModel/MPCA_NFI_Old/MPCA_NFI_OldMapping'
import {mapProtHHS_2_1} from '../../../koboModel/ProtHHS_2_1/ProtHHS_2_1Mapping'

export interface AnswersFilters {
  start?: Date
  end?: Date
}

export interface FiltersProps {
  paginate?: ApiPagination;
  filters?: AnswersFilters
}

export interface FnMap<T> {
  fnMap?: (_: Record<string, string | undefined>) => T
}


export class KoboApiSdk {

  constructor(private client: ApiClient) {
  }

  static readonly serverRefs = {
    prod: '4820279f-6c3d-47ba-8afe-47f86b16ab5d'
  }

  static readonly koboFormRefs = {
    'ProtHHS_2_1': 'aQDZ2xhPUnNd43XzuQucVR',
    'MPCA_NFI': 'a4Sx3PrFMDAMZEGsyzgJJg',
    'MPCA_NFI_NAA': 'aBGVXW2N26DaLehmKneuyB',
    'MPCA_NFI_Myko': 'a8WAWB9Yxu2jkgk4Ei8GTk',
    'MPCA_NFI_Old': 'a3h8Ykmp2C8NFiw5DDGBLz',
  }

  /** @deprecated */
  readonly getAnswersFromLocalForm = <T extends Record<string, any> = Record<string, string | undefined>>({
    formId,
    filters = {},
    paginate = {offset: 0, limit: 100000},
    fnMap = (_: any) => _,
  }: {
    formId: UUID,
  } & FiltersProps & FnMap<T>): Promise<ApiPaginate<KoboAnswer2<T>>> => {
    return this.client.get<ApiPaginate<Record<string, any>>>(`/kobo-api/local-form`, {qs: {...filters, ...paginate}})
      .then(_ => {
          return ({
            ..._,
            data: _.data.map(_ => ({
              ..._,
              ...Kobo.mapAnswerMetaData(_),
              ...fnMap(_.answers) as any
            }))
          })
        }
      )
  }

  readonly synchronizeAnswers = (serverId: KoboId, formId: KoboId) => {
    return this.client.post(`/kobo-api/${serverId}/${formId}/sync`)
  }

  readonly getAnswersFromKoboApi = <T extends Record<string, any> = Record<string, string | undefined>>({
    serverId,
    formId,
    filters = {},
    paginate = {offset: 0, limit: 100000},
    fnMap = (_: any) => _,
  }: {
    serverId: UUID,
    formId: UUID,
  } & FiltersProps & FnMap<T>): Promise<ApiPaginate<KoboAnswer2<T>>> => {
    return this.client.get<ApiPaginate<KoboAnswer2<T>>>(`/kobo-api/${serverId}/${formId}/answers`, {qs: filters})
      .then(_ => {
          return ({
            ..._,
            data: _.data.map(_ => ({
              ..._,
              ...Kobo.mapAnswerMetaData(_),
              ...fnMap(_.answers) as any
            }))
          })
        }
      )
  }

  readonly getAnswersHH2 = (filters: FiltersProps = {}) => {
    return this.getAnswersFromKoboApi({
      serverId: KoboApiSdk.serverRefs.prod,
      formId: KoboApiSdk.koboFormRefs.ProtHHS_2_1,
      fnMap: mapProtHHS_2_1,
      ...filters,
    })
  }

  readonly getAnswersMPCA_NFI_Old = (filters: FiltersProps = {}) => {
    return this.getAnswersFromKoboApi({
      serverId: KoboApiSdk.serverRefs.prod,
      formId: KoboApiSdk.koboFormRefs.MPCA_NFI_Old,
      fnMap: mapMPCA_NFI_Old,
      ...filters,
    })
  }

  readonly getAnswersMPCA_NFI = (filters: FiltersProps = {}) => {
    return this.getAnswersFromKoboApi({
      serverId: KoboApiSdk.serverRefs.prod,
      formId: KoboApiSdk.koboFormRefs.MPCA_NFI,
      fnMap: mapMPCA_NFI,
      ...filters,
    })
  }

  readonly getAnswersMPCA_NFI_Myko = (filters: FiltersProps = {}) => {
    return this.getAnswersFromKoboApi({
      serverId: KoboApiSdk.serverRefs.prod,
      formId: KoboApiSdk.koboFormRefs.MPCA_NFI_Myko,
      fnMap: mapMPCA_NFI_Myko,
      ...filters,
    })
  }

  readonly getAnswersMPCA_NFI_NAA = (filters: FiltersProps = {}) => {
    return this.getAnswersFromKoboApi({
      serverId: KoboApiSdk.serverRefs.prod,
      formId: KoboApiSdk.koboFormRefs.MPCA_NFI_NAA,
      fnMap: mapMPCA_NFI_NAA,
      ...filters,
    })
  }

  readonly getForm = (serverId: UUID, formId: UUID): Promise<KoboApiForm> => {
    return this.client.get(`/kobo-api/${serverId}/${formId}`)
  }

  readonly getForms = (serverId: UUID): Promise<IKoboForm[]> => {
    return this.client.get(`/kobo-api/${serverId}`).then(_ => _.results.map((_: Record<keyof IKoboForm, any>): IKoboForm => {
      return {
        ..._,
        date_created: new Date(_.date_created),
        date_modified: new Date(_.date_modified),
      }
    }))
  }

  readonly getAttachement = (serverId: UUID, filepath: string) => {
    return this.client.get<IKoboForm[]>(`/kobo-api/${serverId}/attachment/${filepath}`)
  }

}