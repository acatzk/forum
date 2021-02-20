import PerfectScroll from '~/lib/PerfectScrollbar'
import { AuthProvider } from '~/context/auth'
import NProgress from '~/lib/nprogress'
import Header from '~/components/Header'

export default function Layout ({ Component, pageProps }) {
  return (
    <AuthProvider>
      <NProgress />
      <div className="flex flex-col antialiased bg-gray-100 text-gray-900 h-screen">
        <Header />
        <main className="flex-1 overflow-y-hidden">
          <PerfectScroll chilren={ <Component { ...pageProps } /> } />
        </main>
      </div>
    </AuthProvider>
  )
}