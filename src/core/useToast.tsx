import {useToast} from 'mui-extension'
import {appConfig} from '../conf/AppConfig'

export const useItToast = () => {
  const {toastError, ...toasts} = useToast()
  return {
    ...toasts,
    toastError: (e: unknown) => {
      console.error(e)
      toastError(`Something went wrong. Contact ${appConfig.contact}`)
    }
  }
}
