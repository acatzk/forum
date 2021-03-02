import '~/styles/tailwind.css'
import NProgress from '~/lib/nprogress'
import { AuthProvider } from '~/context/auth'
import 'react-mde/lib/styles/css/react-mde-all.css'

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
