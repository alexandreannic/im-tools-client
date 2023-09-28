import {ApiPaginate} from '@/core/type'

export class ApiSdkUtils {

  static readonly mapPaginate = <T, R>(fn: (_: T) => R) => (paginated: ApiPaginate<T>): ApiPaginate<T> => {
    paginated.data = paginated.data.map(fn) as any
    return paginated
  }
}