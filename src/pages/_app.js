import '~/styles/tailwind.css'
import Layout from '~/layouts/default'

function MyApp({ Component, pageProps, children }) {
  return (
    <Layout Component={ Component } pageProps={ pageProps }>
      { children }
    </Layout>
  )
}

export default MyApp
