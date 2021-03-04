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

export default function TodayPage({ initialData }) {  
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
        <h1 className="text-2xl pt-6 font-semibold">Today's Post</h1>
        <ThreadList threads={data.threads} />
      </Layout>
    </>
  )
}
