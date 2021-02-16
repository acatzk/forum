import Head from 'next/head'
import Layout from '~/components/Layout'

export default function IndexPage() {  
  return (
    <>
      <Head>
        <title>Forum</title>
      </Head>
      <Layout>
        <p className="text-2xl text-indigo-600">Welcome to the Forum</p>
      </Layout>
    </>
  )
}
