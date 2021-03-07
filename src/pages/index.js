import useSWR from 'swr'
import Head from 'next/head'
import Layout from '~/layouts/default'
import ThreadList from '~/components/ThreadList'
import { GET_THREADS_QUERY } from '~/graphql/queries'
import { hasuraUserClient } from '~/lib/hasura-user-client'

export const getStaticProps = async () => {
  const hasura = hasuraUserClient()
  const initialData = await hasura.request(GET_THREADS_QUERY)

  return {
    props: {
      initialData
    },
    revalidate: 1
  }
}

export default function IndexPage({ initialData }) {  
  const hasura = hasuraUserClient()
  const { data } = useSWR(GET_THREADS_QUERY, (query) => hasura.request(query), {
    initialData,
    revalidateOnMount: true
  })

  return (
    <>
      <Head>
        <title>Forum</title>
      </Head>
      <Layout>
        <ThreadList threads={data.threads} />
      </Layout>
    </>
  )
}
