import * as React from 'react'
import {ReactNode} from 'react'

/**
 * Modals are represented as react components
 *
 * This is what gets passed to useModal as the first argument.
 */
export type ModalType<T extends object> = (t: T) => ReactNode //React.FunctionComponent<T>;

/**
 * The shape of the modal context
 */
export interface ModalContextType<T extends object> {
  showModal(key: string, component: ModalType<T>, props: T): void;
  hideModal(key: string): void;
}

/**
 * Throw error when ModalContext is used outside of context provider
 */
const invariantViolation = () => {
  throw new Error(
    'Attempted to call useModal outside of modal context. Make sure your app is rendered inside ModalProvider.'
  )
}

/**
 * Modal Context Object
 */
export const ModalContext = React.createContext<ModalContextType<object>>({
  showModal: invariantViolation,
  hideModal: invariantViolation
})
ModalContext.displayName = 'ModalContext'
