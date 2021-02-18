import '~/styles/tailwind.css'
import { AuthProvider } from '~/context/auth'
import NProgress from '~/plugins/NProgress'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <NProgress />
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
