import './../styles/tailwind.css'
import { AuthProvider } from './../context/auth'

function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default App
