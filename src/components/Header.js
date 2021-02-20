import Link from 'next/link'
import { useAuthState, useAuthDispatch } from '~/context/auth'

export default function Header () {
  const { isAuthenticated, user } = useAuthState()
  const { logout } = useAuthDispatch()

  return (
    <header className="bg-white py-2 shadow-sm">
      <div className="container mx-auto max-w-5xl px-3">
        {
          isAuthenticated ? (
            <div className="flex items-center justify-between">
              <p className="font-medium">
                <Link href="/">
                  <a>Welcome</a>
                </Link> 
                <Link href="/">
                  <a className="text-indigo-600 pl-2 hover:underline">{ user.name }</a>
                </Link>
              </p>
              <div className="flex items-center space-x-2">
                <Link href="/ask">
                  <a className="px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-500 text-white border border-indigo-600 transition ease-in-out duration-200 hover:bg-white hover:text-indigo-600">Ask A Question</a>
                </Link>
                <button onClick={logout} className="px-3 py-1.5 rounded-md text-sm font-medium text-indigo-500 bg-white border border-indigo-100 transition ease-in-out duration-200 hover:border-indigo-600">Logout</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <Link href="/">
                <a className="text-2xl font-semibold text-indigo-600 transition ease-in-out duration-200 hover:text-indigo-500">Forum</a>
              </Link>
              <div className="space-x-2">
                <Link href="/login">
                  <a className="px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-500 text-white border border-indigo-600 transition ease-in-out duration-200 hover:bg-white hover:text-indigo-600">Login</a>
                </Link>
                <Link href="/register">
                  <a className="px-3 py-1.5 rounded-md text-sm font-medium text-indigo-500 bg-white border border-indigo-100 transition ease-in-out duration-200 hover:border-indigo-600">Register</a>
                </Link>
              </div>
            </div>
          )
        }
      </div>
    </header>
  )
}