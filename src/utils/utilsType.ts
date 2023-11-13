export type NullableKey<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: T[P] | undefined
}
export type NonNullableKey<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
}

export  type NonNullableKeys<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
}

export type ReverseMap<T extends Record<keyof T, keyof any>> = {
  [P in T[keyof T]]: {
    [K in keyof T]: T[K] extends P ? K : never
  }[keyof T]
}