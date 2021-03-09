import useSWR from 'swr'
import Head from 'next/head'
import Layout from '~/layouts/default'
import ThreadList from '~/components/ThreadList'
import { hasuraUserClient } from '~/lib/hasura-user-client'
import { GET_UNANSWERED_POST_QUERY } from '~/graphql/queries'

export const getStaticProps = async () => {
  const hasura = hasuraUserClient()
  const initialData = await hasura.request(GET_UNANSWERED_POST_QUERY)

  return {
    props: {
      initialData
    },
    revalidate: 1
  }
}

export default function AnsweredPostsPage({ initialData }) {  
  const hasura = hasuraUserClient()
  const { data } = useSWR(GET_UNANSWERED_POST_QUERY, (query) => hasura.request(query), {
    initialData,
    revalidateOnMount: true
  })

  return (
    <>
      <Head>
        <title>Forum</title>
      </Head>
      <Layout>
        <h1 className="text-3xl pt-8 pb-3 font-semibold text-gray-700">Unanswered Post</h1>
        <ThreadList threads={data.threads} />
      </Layout>
    </>
  )
}
