import ActiveLink from './ActiveLink'
import { useAuthState, useAuthDispatch } from '~/context/auth'

export default function Header () {
  const { isAuthenticated, user } = useAuthState()
  const { logout } = useAuthDispatch()

  return (
    <header className="bg-gray-900 text-white py-3 shadow">
      <div className="container mx-auto max-w-5xl px-3">
        {isAuthenticated ? (
            <div className="flex items-center justify-between flex-wrap">
              <div className="font-medium space-x-2">
                <ActiveLink href="/" current="text-indigo-200">
                  <a href="#" className="font-medium hover:text-indigo-200 transition ease-in-out duration-200 px-2 py-1">
                    Home
                  </a>
                </ActiveLink>
                <ActiveLink href="/today" current="text-indigo-200">
                  <a href="#" className="font-medium hover:text-indigo-200 transition ease-in-out duration-200 px-2 py-1">
                    Today's Post
                  </a>
                </ActiveLink>
                <ActiveLink href="/answered" current="text-indigo-200">
                  <a href="#" className="font-medium hover:text-indigo-200 transition ease-in-out duration-200 px-2 py-1">
                    Answered Post
                  </a>
                </ActiveLink>
                <ActiveLink href="/unanswered" current="text-indigo-200">
                  <a href="#" className="font-medium hover:text-indigo-200 transition ease-in-out duration-200 px-2 py-1">
                    Unanswered Post
                  </a>
                </ActiveLink>
              </div>
              <div className="flex items-center space-x-2">
                <ActiveLink href="/new" current="text-indigo-200">
                  <a href="#" className="font-medium hover:text-indigo-200 transition ease-in-out duration-200 px-2 py-1">
                    Post new thread
                  </a>
                </ActiveLink>
                <button onClick={logout} className="font-medium hover:text-indigo-200 transition ease-in-out duration-200 px-2 py-1">Logout</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between flex-wrap">
              <ActiveLink href="/">
                <a className="text-2xl font-semibold text-white transition ease-in-out duration-200">Forum</a>
              </ActiveLink>
              <div className="space-x-2">
                <ActiveLink href="/login" current="text-indigo-200">
                  <a className="font-medium hover:text-indigo-200 transition ease-in-out duration-200 px-2 py-1">Login</a>
                </ActiveLink>
                <ActiveLink href="/register" current="text-indigo-200">
                  <a className="font-medium hover:text-indigo-200 transition ease-in-out duration-200 px-2 py-1">Register</a>
                </ActiveLink>
              </div>
            </div>
        )}
      </div>
    </header>
  )
}