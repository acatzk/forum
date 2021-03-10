import useSWR from 'swr'
import Head from 'next/head'
import Layout from '~/layouts/default'
import { useRouter } from 'next/router'
import ThreadList from '~/components/ThreadList'
import { GET_CATEGORY_BY_ID } from '~/graphql/queries'
import { gql, hasuraUserClient } from '~/lib/hasura-user-client'
 
const GET_CATEGORY_IDs = gql`
  query {
    categories {
      id
    }
  }
`

export const getStaticPaths = async () => {
  const hasura = hasuraUserClient()
  const { categories } = await hasura.request(GET_CATEGORY_IDs)

  return {
    paths: categories.map(({ id }) => ({
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
  const initialData = await hasura.request(GET_CATEGORY_BY_ID, { id })

  return {
    props: {
      initialData
    },
    revalidate: 1
  }
}

export default function CategoryPage ({ initialData }) {
  const hasura = hasuraUserClient()
  const router = useRouter()
  const { id } = router.query

  const { data } = useSWR(
    [GET_CATEGORY_BY_ID, id], 
    (query, id) => hasura.request(query, { id }), 
    { initialData, revalidateOnMount: true }
  )
  
  return (
    <>
      <Head>
        <title>{ data.categories_by_pk.name } | Forum</title>
      </Head>
      <Layout>
        <h1 className="text-2xl font-semibold py-6">{ data.categories_by_pk.name }</h1>
        <ThreadList threads={data.categories_by_pk.pinned} />
        <ThreadList threads={data.categories_by_pk.threads} />
      </Layout>
    </>
  )
}
