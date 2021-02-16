import Head from 'next/head'
import Link from 'next/link'
import { useAuthState, useAuthDispatch } from '~/context/auth'

export default function Home() {
  const { isAuthenticated, user } = useAuthState()
  const { logout } = useAuthDispatch()
  
  return (
    <>
      {
        isAuthenticated ? (
          <>
            <p>Hello {user.name}</p>
            <button onClick={logout} className="text-xl font-semibold text-indigo-600 py-1 px-3 rounded-full bg-indigo-100">Logout</button>
          </>
        ) : (
          <div className="space-x-2 flex items-center justify-center">
            <Link href="/login">
              <a className="px-3 py-2 rounded-full text-2xl font-semibold bg-indigo-500 text-white">Login</a>
            </Link>
            <Link href="/register">
              <a className="px-3 py-2 rounded-full text-2xl font-semibold bg-indigo-500 text-white">Register</a>
            </Link>
          </div>
        )
      }
    </>
  )
}
