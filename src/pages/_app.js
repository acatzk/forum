import '~/styles/tailwind.css'
import NProgress from '~/lib/nprogress'
import { AuthProvider } from '~/context/auth'
import 'react-mde/lib/styles/css/react-mde-all.css'
import { ToastProvider } from 'react-toast-notifications'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NProgress />
      <AuthProvider>
        <ToastProvider>
          <Component { ...pageProps } />
        </ToastProvider>
      </AuthProvider>
    </>
  )
}

export default MyApp
