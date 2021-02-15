import Head from 'next/head'
import { useAuthState, useAuthDispatch } from '~/context/auth'

export default function Home() {
  const { isAuthenticated, user } = useAuthState()
  const { login, register, logout } = useAuthDispatch()
  
  return (
    <>
      {
        isAuthenticated ? (
          <>
            <p>Hello {user.name}</p>
            <button onClick={logout} className="text-xl font-semibold text-indigo-600 py-1 px-3 rounded-full bg-indigo-100">Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => {
              login({
                email: 'celdamae@gmail.com',
                password: 'asdfasdfasfdfa'
              })
            }}>
              Login
            </button>
            <button onClick={() => {
              register({
                name: 'Celda mae Dagohoy',
                email: 'celdamae@gmail.com',
                password: 'asdfasdfasfdfa'
              })
            }}>
              Register
            </button>
          </>
        )
      }
    </>
  )
}
