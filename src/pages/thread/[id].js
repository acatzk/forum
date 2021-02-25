import Head from 'next/head'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { gql, hasuraUserClient } from '~/lib/hasura-user-client'
import PostList from '~/components/PostList'
import PostForm from '~/components/PostForm'
import Layout from '~/layouts/default'
import { GET_THREAD_BY_ID } from '~/graphql/queries'

const GET_THREAD_IDs = gql`
  query {
    threads {
      id
    }
  }
`

export const getStaticPaths = async () => {
  const hasura = hasuraUserClient()
  const { threads } = await hasura.request(GET_THREAD_IDs)

  return {
    paths: threads.map(({ id }) => ({
      params: {
        id
      }
    })),
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  const hasura = hasuraUserClient()
  const { id } = params
  const initialData = await hasura.request(GET_THREAD_BY_ID, { id })

  return {
    props: {
      initialData
    },
    revalidate: 1
  }
}

export default function ThreadPage ({ initialData }) {
  const hasura = hasuraUserClient()
  const router = useRouter()
  const { id } = router.query

  const { data, error } = useSWR(
    [GET_THREAD_BY_ID, id], 
    (query, id) => hasura.request(query, { id }), 
    { initialData, revalidateOnMount: true }
  )

  const handlePost = ({ message }) => {
    try {

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <Head>
        <title>{ data.threads_by_pk.title } | Forum</title>
      </Head>
      <Layout>
        <h1 className="text-2xl font-semibold py-6">{ data.threads_by_pk.title }</h1>
        <PostList posts={data.threads_by_pk.posts} />
        <PostForm onSubmit={ handlePost }/>
      </Layout>
    </>
  )
}