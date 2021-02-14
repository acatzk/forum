import { createContext, useReducer, useContext } from 'react'

const initialState = {
  isAuthenticated: false
}

const AuthDispatchContext = createContext()
const AuthStateContext = createContext()

function reducer (state, { payload, type }) {
  switch(type) {
    default:
      throw new Error(`Unhandled action type ${type}`)
  }
}

function AuthProvider ({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AuthDispatchContext.Provider value={undefined}>
      <AuthStateContext.Provider value={state}>
        { children }
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  ) 
}

function useAuthState () {
  const context = useContext(AuthStateContext)
  
  if (context === undefined) throw new Error("useAuthState must be used within an AuthProvider")
  return context
}

function useAuthDispatch () {
  const context = useContext(AuthDispatchContext)
  
  if (context === undefined) 
    throw new Error("useAuthDispatch must be used within an AuthProvider")
  return context
}

export { AuthProvider, useAuthState, useAuthDispatch }