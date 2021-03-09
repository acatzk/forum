import useSWR from 'swr'
import Head from 'next/head'
import Layout from '~/layouts/default'
import ThreadList from '~/components/ThreadList'
import { endOfToday, startOfToday } from 'date-fns'
import { GET_TODAY_POST_QUERY } from '~/graphql/queries'
import { hasuraUserClient } from '~/lib/hasura-user-client'

const from = new Date(startOfToday()).toISOString()
const to = new Date(endOfToday()).toISOString()

export const getStaticProps = async () => {
  const hasura = hasuraUserClient()
  const initialData = await hasura.request(GET_TODAY_POST_QUERY, {
    from,
    to
  })

  return {
    props: {
      initialData
    },
    revalidate: 1
  }
}

export default function TodaysPostsPage({ initialData }) {  
  const hasura = hasuraUserClient()
  const { data } = useSWR(GET_TODAY_POST_QUERY, (query) => hasura.request(query, { from, to }), {
    initialData,
    revalidateOnMount: true
  })

  return (
    <>
      <Head>
        <title>Forum</title>
      </Head>
      <Layout>
        <h1 className="text-3xl pt-8 pb-3 font-semibold text-gray-700">Today's Post</h1>
        <ThreadList threads={data.threads} />
      </Layout>
    </>
  )
}
