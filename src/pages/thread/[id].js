import useSWR from 'swr'
import Head from 'next/head'
import Layout from '~/layouts/default'
import { useRouter } from 'next/router'
import PostList from '~/components/PostList'
import PostForm from '~/components/PostForm'
import { useAuthState } from '~/context/auth'
import { GET_THREAD_BY_ID } from '~/graphql/queries'
import { gql, hasuraUserClient } from '~/lib/hasura-user-client'
import { ADD_POST_MUTATION, ADD_LIKE_MUTATION, DELETE_LIKE_MUTATION, DELETE_POST_MUTATION } from '~/graphql/mutations'

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
    fallback: true
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
  const { id, isFallback } = router.query
  const { isAuthenticated } = useAuthState()

  const { data, mutate } = useSWR(
    [GET_THREAD_BY_ID, id], 
    (query, id) => hasura.request(query, { id }), 
    { initialData, revalidateOnMount: true }
  )
  if (!isFallback && !data) return <p>No such thread found</p>

  const handlePost = async ({ message }, { target }) => {
    try {
      const hasura = hasuraUserClient()
      const { insert_posts_one } = await hasura.request(ADD_POST_MUTATION, {
        thread_id: id,
        message
      })

      mutate({
        ...data,
        threads_by_pk: {
          ...data.threads_by_pk,
          posts: [
            ...data.threads_by_pk.posts,
            insert_posts_one
          ]
        }
      })

      target.reset()

    } catch (err) {
      console.log(err)
    }
  }

  const handleLike = async ({ post_id }) => {
    await hasura.request(ADD_LIKE_MUTATION, { post_id })
    mutate()
  }

  const handleUnlike = async ({ id }) => {
    await hasura.request(DELETE_LIKE_MUTATION, { id })
    mutate()
  }

  const handleDelete = async ({ id }) => {
    await hasura.request(DELETE_POST_MUTATION, { id })
    mutate({
      ...data,
      threads_by_pk: {
        ...data.threads_by_pk,
        posts: data.threads_by_pk.posts.filter(p => p.id !== id)
      }
    })
  }

  if (isFallback) return <Layout>Loading thread...</Layout>

  return (
    <>
      <Head>
        <title>{ data.threads_by_pk.title } | Forum</title>
      </Head>
      <Layout>
        <h1 className="text-2xl font-semibold py-6">{ data.threads_by_pk.title }</h1>
        <PostList 
          posts={data.threads_by_pk.posts} 
          actions={{ handleLike, handleUnlike, handleDelete }} />
        { !data.threads_by_pk.locked && isAuthenticated && <PostForm onSubmit={ handlePost }/> }
      </Layout>
    </>
  )
}