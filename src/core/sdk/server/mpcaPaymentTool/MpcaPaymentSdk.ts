import {ApiClient} from '../ApiClient'
import {Id} from '@alexandreannic/react-hooks-lib/lib/useCrudList/UseCrud'
import {UUID} from '../../../type'
import {KoboId} from '../kobo/Kobo'
import {MpcaPaymentUpdate} from './MpcaPayment'

export interface MpcaPayment {
  id: Id
  createdAt: Date
  updatedAt: Date
  name: string
  index: number
  budgetLineMPCA?: string
  budgetLineCFR?: string
  budgetLineStartUp?: string
  headOfOperation?: string
  cashAndVoucherAssistanceAssistant?: string
  financeAndAdministrationOfficer?: string
  city: string
  answers: string[]
}

const mapEntity = (_: Record<keyof MpcaPayment, any>): MpcaPayment => {
  return {
    ..._,
    createdAt: new Date(_.createdAt),
    updatedAt: new Date(_.updatedAt),
  }
}

export class MpcaPaymentSdk {
  constructor(private client: ApiClient) {
  }

  readonly create = (answersIds: KoboId[]) => {
    return this.client.put<Record<keyof MpcaPayment, any>>(`/mpca-payment`, {body: {answersIds}}).then(mapEntity)
  }

  readonly update = (id: UUID, update: MpcaPaymentUpdate) => {
    return this.client.post<Record<keyof MpcaPayment, any>>(`/mpca-payment/${id}`, {body: update}).then(mapEntity)
  }

  readonly getAll = () => {
    return this.client.get<Record<keyof MpcaPayment, any>[]>(`/mpca-payment`).then(_ => _.map(mapEntity))
  }

  readonly get = (id: UUID) => {
    return this.client.get<Record<keyof MpcaPayment, any>>(`/mpca-payment/${id}`).then(mapEntity)
  }
}
