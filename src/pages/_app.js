import '~/styles/tailwind.css'
import NProgress from '~/lib/nprogress'
import LastSeen from '~/components/LastSeen'
import { AuthProvider } from '~/context/auth'
import 'react-mde/lib/styles/css/react-mde-all.css'
import 'react-perfect-scrollbar/dist/css/styles.css'
import { ToastProvider } from 'react-toast-notifications'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NProgress />
      <AuthProvider>
        <ToastProvider>
          <LastSeen>
            <Component { ...pageProps } />
          </LastSeen>
        </ToastProvider>
      </AuthProvider>
    </>
  )
}

export default MyApp
