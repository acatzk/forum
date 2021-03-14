import ActiveLink from './ActiveLink'
import { useAuthState, useAuthDispatch } from '~/context/auth'

export default function Header () {
  const { isAuthenticated, user } = useAuthState()
  const { logout } = useAuthDispatch()

  const links = [
    {
      text: 'Home',
      href: '/',
      isCurrent: true
    },
    {
      text: 'Today\'s Post',
      href: '/today',
      isCurrent: true
    },
    {
      text: 'Answered Post',
      href: '/answered',
      isCurrent: true
    },
    {
      text: 'Unanswered Post',
      href: '/unanswered',
      isCurrent: true
    }
  ]

  return (
    <header className="bg-indigo-700 text-white py-3 shadow">
      <div className="container mx-auto max-w-5xl px-3">
        {isAuthenticated ? (
            <div className="flex items-center justify-between flex-wrap">
              <div className="font-medium space-x-2">
                {links.map((link, i) => (
                  <Link key={i} href={ link.href } text={ link.text } isCurrent={ link.isCurrent }/>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <Link text="Members" href="/members" />
                <Link text={user.name} href="/edit-profile" />
                <Link text="Post new thread" href="/new" />
                <div>
                  <button onClick={logout} className="font-medium hover:text-indigo-200 transition ease-in-out duration-200 px-2 py-1">Logout</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between flex-wrap">
              <span className="text-2xl font-semibold text-white transition ease-in-out duration-200">
                <Link text="Forum" href="/" />
              </span>
              <div className="space-x-2">
                <Link text="Login" href="/login" isCurrent />
                <Link text="Register" href="/register" isCurrent />
              </div>
            </div>
        )}
      </div>
    </header>
  )
}

function Link ({ text, href, isCurrent }) {
  return (
    <ActiveLink href={ href } current={ isCurrent ? 'border-0 text-indigo-200 md:text-white md:border-b-2 border-white pb-4' : '' }>
      <a href="#" className="font-medium hover:text-indigo-200 transition ease-in-out duration-200 px-2 py-1">
        { text }
      </a>
    </ActiveLink>
  )
}