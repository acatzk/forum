import useSWR from 'swr'
import Head from 'next/head'
import Layout from '~/layouts/default'
import { useRouter } from 'next/router'
import PostList from '~/components/PostList'
import PostForm from '~/components/PostForm'
import { useAuthState } from '~/context/auth'
import { GET_THREAD_BY_ID } from '~/graphql/queries'
import { useToasts } from 'react-toast-notifications'
import { gql, hasuraUserClient } from '~/lib/hasura-user-client'
import { ADD_POST_MUTATION, ADD_LIKE_MUTATION, 
         DELETE_LIKE_MUTATION, DELETE_POST_MUTATION, 
         UPDATE_POST_MUTATION, UPDATE_LOCKED_STATUS_MUTATION,
         UPDATE_ANSWERED_STATUS_MUTATION, DELETE_THREAD_BY_ID_MUTATION } from '~/graphql/mutations'

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

  const router = useRouter()
  const { addToast } = useToasts()
  const hasura = hasuraUserClient()
  const { id, isFallback } = router.query
  const { isAuthenticated, user } = useAuthState()

  const { data, mutate } = useSWR(
    [GET_THREAD_BY_ID, id], 
    (query, id) => hasura.request(query, { id }), 
    { initialData, revalidateOnMount: true }
  )

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

      addToast(`${!data.threads_by_pk.locked ? 'You locked the thread' : 'You unlocked the thread'}`, { appearance: 'success', autoDismiss: true })
    } catch (err) {
      console.log(err)
    }
  }

  const handleAnswer = async () => {
    try {
      const { update_threads_by_pk } = await hasura.request(UPDATE_ANSWERED_STATUS_MUTATION, {
        id,
        answered: !data.threads_by_pk.answered
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
    addToast('Successfully Deleted!', { appearance: 'success', autoDismiss: true })
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

  const handleDeleteThread = async () => {
    try {
      await hasura.request(DELETE_THREAD_BY_ID_MUTATION, { id })
      addToast('Successfully Deleted!', { appearance: 'success', autoDismiss: true })
      router.push('/')
    } catch (err) {
      addToast(err, { appearance: 'error', autoDismiss: true })
    }
  }

  if (isFallback) return <Layout>Loading thread...</Layout>
  if (!isFallback && !data) return <Layout>No such thread found</Layout>

  return (
    <>
      <Head>
        <title>{ data.threads_by_pk.title } | Forum</title>
      </Head>
      <Layout>
        <div className="flex flex-col">
          <div className="flex items-center">
            <h1 className="text-3xl pt-8 pb-3 font-semibold text-indigo-700">
              { data.threads_by_pk.title }
              <div className="flex items-center space-x-3 py-2">
                { data.threads_by_pk.locked 
                  && <div className="flex items-center bg-red-100 border border-red-200 text-red-500 px-2 py-0.5 rounded-full space-x-1">
                        <span>
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path
                              d="M18 8h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2V7a6 6 0 1 1 12 0v1zm-7 7.732V18h2v-2.268a2 2 0 1 0-2 0zM16 8V7a4 4 0 1 0-8 0v1h8z" />
                          </svg>
                        </span>
                        <span className="uppercase font-semibold text-xs">Locked</span>
                      </div> }
              { data.threads_by_pk.answered 
                && <div className="flex items-center bg-green-100 border border-green-200 text-green-500 px-2 py-0.5 rounded-full space-x-1">
                      <span>
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" />
                        </svg>
                      </span>
                      <span className="uppercase font-semibold text-xs">Answered</span>
                    </div> }
              </div>
            </h1>
          </div>
          {isAuthor && (
            <div className="flex items-center space-x-2">
              <button 
                onClick={ handleLock } 
                className="px-2 py-0.5 rounded text-sm bg-gray-200 border hover:bg-gray-300 border-gray-300 focus:outline-none transition ease-in-out duration-200 text-gray-600">
                { data.threads_by_pk.locked ? (
                  <div className="flex items-center space-x-2">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path
                        d="M7 10h13a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 0 1 13.262-3.131l-1.789.894A5 5 0 0 0 7 9v1zm3 5v2h4v-2h-4z" />
                    </svg>
                    <span>Unlock</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path
                          d="M18 8h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2V7a6 6 0 1 1 12 0v1zm-7 7.732V18h2v-2.268a2 2 0 1 0-2 0zM16 8V7a4 4 0 1 0-8 0v1h8z" />
                      </svg>
                    </span>
                    <span>Lock</span>
                  </div>
                ) }
              </button>
              <button 
                onClick={ handleAnswer } 
                className="px-2 py-0.5 rounded text-sm bg-gray-200 border hover:bg-gray-300 border-gray-300 transition ease-in-out duration-200 focus:outline-none text-gray-600">
                { data.threads_by_pk.answered ? (
                  <div className="flex items-center space-x-2">
                    <span>
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path
                          d="M18.803 8.493A5.023 5.023 0 0 0 22 8.9V20a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h13.1c-.066.323-.1.658-.1 1a4.98 4.98 0 0 0 1.193 3.241l-5.132 4.442-6.414-5.445-1.294 1.524 7.72 6.555 6.73-5.824zM21 7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                      </svg>
                    </span>
                    <span>Mark as unanswered</span>
                  </div>
                ) : <div className="flex items-center space-x-2">
                      <span>
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path
                            d="M22 13.341A6 6 0 0 0 14.341 21H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v9.341zm-9.94-1.658L5.648 6.238 4.353 7.762l7.72 6.555 7.581-6.56-1.308-1.513-6.285 5.439zM19 22l-3.536-3.536 1.415-1.414L19 19.172l3.536-3.536 1.414 1.414L19 22z" />
                        </svg>
                      </span>
                      <span>Mark as answered</span>
                    </div> }
              </button>
              <button 
                onClick={ handleDeleteThread } 
                className="flex items-center space-x-2 px-2 py-0.5 rounded text-sm bg-gray-200 border hover:bg-gray-300 border-gray-300 transition ease-in-out duration-200 focus:outline-none text-gray-600">
                <span>
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm-8 5v6h2v-6H9zm4 0v6h2v-6h-2zM9 4v2h6V4H9z" />
                  </svg>
                </span>
                <span>Delete thread</span>
              </button>
            </div>
          )}
        </div>
        <PostList 
          posts={data.threads_by_pk.posts} 
          actions={{ handleLike, handleUnlike, handleUpdate, handleDelete }} />
        { !data.threads_by_pk.locked && isAuthenticated &&
            (<div className="py-5 flex space-x-3">
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
              </div>) }
      </Layout>
    </>
  )
}