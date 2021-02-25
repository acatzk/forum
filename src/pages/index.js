import useSWR from 'swr'
import Head from 'next/head'
import { hasuraUserClient } from '~/lib/hasura-user-client'
import { GET_THREADS_QUERY } from '~/graphql/queries'
import ThreadList from '~/components/ThreadList'
import Layout from '~/layouts/default'

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
  const { data, error } = useSWR(GET_THREADS_QUERY, (query) => hasura.request(query), {
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
