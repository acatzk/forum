import Head from 'next/head'
import { useAuthState, useAuthDispatch } from './../context/auth'

export default function Home() {
  const { isAuthenticated, user } = useAuthState()
  const { login, register, logout } = useAuthDispatch()
  
  return (
    <>
      {
        isAuthenticated ? (
          <>
            <p>Hello {user.name}</p>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => {
              login({
                email: 'jamesbond@gmail.com',
                password: 'abs132'
              })
            }}>
              Login
            </button>
            <button onClick={() => {
              register({
                name: 'James Bond',
                email: 'jamesbond@gmail.com',
                password: 'asdfa'
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
