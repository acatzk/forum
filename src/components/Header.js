import Link from 'next/link'
import ActiveLink from './ActiveLink'
import { useRouter } from 'next/router'
import { useAuthState, useAuthDispatch } from '~/context/auth'

export default function Header () {
  const { isAuthenticated, user } = useAuthState()
  const { logout } = useAuthDispatch()
  const router = useRouter()

  return (
    <header className="bg-white py-2 shadow">
      <div className="container mx-auto max-w-5xl px-3">
        {isAuthenticated ? (
            <div className="flex items-center justify-between">
              <div className="font-medium space-x-2">
                <ActiveLink href="/" current="text-indigo-600 bg-indigo-100">
                  <a href="#" className="font-medium hover:text-indigo-600 transition ease-in-out duration-200 px-2 py-1 hover:bg-indigo-50 rounded-full focus:bg-indigo-100 focus:text-indigo-600">
                    Home
                  </a>
                </ActiveLink>
                <ActiveLink href="/today" current="text-indigo-600 bg-indigo-100">
                  <a className="font-medium hover:text-indigo-600 transition ease-in-out duration-200 px-2 py-1 hover:bg-indigo-50 rounded-full focus:bg-indigo-100 focus:text-indigo-600">
                    Today's Post
                  </a>
                </ActiveLink>
                <ActiveLink href="/answered" current="text-indigo-600 bg-indigo-100">
                  <a className="font-medium hover:text-indigo-600 transition ease-in-out duration-200 px-2 py-1 hover:bg-indigo-50 rounded-full focus:bg-indigo-100 focus:text-indigo-600">
                    Answered Post
                  </a>
                </ActiveLink>
              </div>
              <div className="flex items-center space-x-2">
                <Link href="/ask">
                  <a className="px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-500 text-white border border-indigo-600 transition ease-in-out duration-200 hover:bg-white hover:text-indigo-600">Ask A Question</a>
                </Link>
                <button onClick={logout} className="px-3 py-1.5 rounded-md text-sm font-medium text-indigo-500 bg-white border border-indigo-100 transition ease-in-out duration-200 hover:border-indigo-600">Logout</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <ActiveLink href="/">
                <a className="text-2xl font-semibold text-indigo-600 transition ease-in-out duration-200 hover:text-indigo-500">Forum</a>
              </ActiveLink>
              <div className="space-x-2">
                <ActiveLink href="/login">
                  <a className="px-3 py-1.5 rounded-md text-sm font-medium bg-indigo-500 text-white border border-indigo-600 transition ease-in-out duration-200 hover:bg-white hover:text-indigo-600">Login</a>
                </ActiveLink>
                <ActiveLink href="/register">
                  <a className="px-3 py-1.5 rounded-md text-sm font-medium text-indigo-500 bg-white border border-indigo-100 transition ease-in-out duration-200 hover:border-indigo-600">Register</a>
                </ActiveLink>
              </div>
            </div>
        )}
      </div>
    </header>
  )
}