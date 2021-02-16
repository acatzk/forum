import Link from 'next/link'
import { useAuthState, useAuthDispatch } from '~/context/auth'

export default function Layout ({ children }) {

  const { isAuthenticated, user } = useAuthState()
  const { logout } = useAuthDispatch()
  
  return (
    <>
      <header className="bg-white py-6 shadow-sm">
        <div className="container mx-auto max-w-4xl w-full px-6">
          {
            isAuthenticated ? (
              <div className="flex items-center justify-between">
                <p>Hello { user.name }</p>
                <button onClick={logout} className="text-sm font-semibold text-indigo-600 py-1 px-3 rounded-full bg-indigo-100">Logout</button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link href="/login">
                  <a className="px-2 py-0.5 rounded-full text-sm font-semibold bg-indigo-500 text-white">Login</a>
                </Link>
                <Link href="/register">
                  <a className="px-2 py-0.5 rounded-full text-sm font-semibold bg-indigo-500 text-white">Register</a>
                </Link>
              </div>
            )
          }
        </div>
      </header>
      <main className="container mx-auto max-w-4xl w-full px-6">
        { children }
      </main>
    </>
  )
}