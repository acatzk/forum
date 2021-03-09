import useSWR from 'swr'
import Head from 'next/head'
import Layout from '~/layouts/default'
import { useRouter } from 'next/router'
import PostList from '~/components/PostList'
import PostForm from '~/components/PostForm'
import { useAuthState } from '~/context/auth'
import { GET_THREAD_BY_ID } from '~/graphql/queries'
import { gql, hasuraUserClient } from '~/lib/hasura-user-client'
import { ADD_POST_MUTATION, ADD_LIKE_MUTATION, 
         DELETE_LIKE_MUTATION, DELETE_POST_MUTATION, 
         UPDATE_POST_MUTATION, UPDATE_LOCKED_STATUS_MUTATION } from '~/graphql/mutations'

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
  const { isAuthenticated, user } = useAuthState()

  const { data, mutate } = useSWR(
    [GET_THREAD_BY_ID, id], 
    (query, id) => hasura.request(query, { id }), 
    { initialData, revalidateOnMount: true }
  )
  if (!isFallback && !data) return <p>No such thread found</p>
  const isAuthor = isAuthenticated && data.threads_by_pk.author.id === user.id

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

  const handleLock = async () => {
    try {
      const { update_threads_by_pk } = await hasura.request(UPDATE_LOCKED_STATUS_MUTATION, {
        id,
        locked: !data.threads_by_pk.locked
      })
      mutate({
        ...data,
        ...update_threads_by_pk,
      })
    } catch (err) {
      console.log(err)
    }
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

  const handleUpdate = async ({ id, message }, { target }) => {
    try {
      const hasura = hasuraUserClient()
      const { update_posts_by_pk } = await hasura.request(UPDATE_POST_MUTATION, {
        id,
        message
      })

      mutate({
        ...data,
        threads_by_pk: {
          ...data.threads_by_pk,
          posts: [
            ...data.threads_by_pk.posts.reduce((posts, post) => {
              if (post.id === id) return [...posts, {
                ...post,
                ...update_posts_by_pk
              }]

              return [...posts, post]
            }, [])
          ]
        }
      })

      target.reset()

    } catch (err) {
      console.log(err)
    }
  }

  if (isFallback) return <Layout>Loading thread...</Layout>

  return (
    <>
      <Head>
        <title>{ data.threads_by_pk.title } | Forum</title>
      </Head>
      <Layout>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-semibold py-6">{ data.threads_by_pk.title }</h1>
            { data.threads_by_pk.locked && <span className="bg-red-100 border border-red-200 text-red-500 px-3 py-0.5 rounded-full uppercase font-bold">Locked</span> }
          </div>
          {isAuthor && (
            <button onClick={ handleLock } className="px-2 py-0.5 rounded text-sm bg-gray-200 border hover:bg-gray-300 border-gray-300 transition ease-in-out duration-200">
              { data.threads_by_pk.locked ? 'Unlock' : 'Lock' }
            </button>
          )}
        </div>
        <PostList 
          posts={data.threads_by_pk.posts} 
          actions={{ handleLike, handleUnlike, handleUpdate, handleDelete }} />
        { !data.threads_by_pk.locked && isAuthenticated &&
        ( 
          <div className="py-5 flex space-x-3">
            <div className="py-2">
              <svg className="w-6 h-6 fill-current text-gray-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                </path>
              </svg>
            </div>
            <div className="flex-1">
              <PostForm onSubmit={ handlePost }/> 
            </div>
          </div>
        ) }
      </Layout>
    </>
  )
}