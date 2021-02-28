import '~/styles/tailwind.css'
import { AuthProvider } from '~/context/auth'
import NProgress from '~/lib/nprogress'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NProgress />
      <AuthProvider>
        <Component { ...pageProps } />
      </AuthProvider>
    </>
  )
}

export default MyApp
