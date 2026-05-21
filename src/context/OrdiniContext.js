import { createContext, useContext } from 'react'

const OrdiniContext = createContext()

export function useOrdini() {
  return useContext(OrdiniContext)
}

export default OrdiniContext