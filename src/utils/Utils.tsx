export const generateId = () => ('' + Math.random()).split('.')[1]

export type ValueOf<T> = T[keyof T];

export const capitalize = (_: string) => {
  return _.charAt(0).toUpperCase() + _.slice(1);
}

export const objectToQueryString = (obj: {[key: string]: any} = {}): string => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        for (const item of value) {
          params.append(key, item.toString())
        }
      } else {
        params.set(key, value.toString())
      }
    }
  }
  return params.toString()
}

