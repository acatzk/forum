import Head from 'next/head'
import ReactMde from 'react-mde'
import Markdown from 'react-markdown'
import Layout from '~/layouts/default'
import { useRouter } from 'next/router'
import Spinner from '~/components/Spinner'
import { useState, useEffect } from 'react'
import { useAuthState } from '~/context/auth'
import { useForm, Controller } from 'react-hook-form'
import { GET_CATEGORY_QUERY } from '~/graphql/queries'
import { ADD_THREAD_MUTATION } from '~/graphql/mutations'
import { hasuraUserClient } from '~/lib/hasura-user-client'
import { hasuraAdminClient } from '~/lib/hasura-admin-client'

/** 
 * Static Generation
 * Fetch data at build time.
 * P.S: Admin access
 */
export const getStaticProps = async () => {
  const { categories } = await hasuraAdminClient.request(GET_CATEGORY_QUERY)
  return {
    props: {
      categories
    }
  }
}

export default function NewThreadPage({ categories }) {  
  /**
   * Init built in 
   * functions
   */
  const router = useRouter()
  const { isAuthenticated } = useAuthState()
  const hasura = hasuraUserClient()
  const [selectedTab, setSelectedTab] = useState('write')

  /**
   * Init useForm from react-hook-form
   */
  const {
    errors,
    control,
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm()

  /**
   * Check if user is authenticated
   */
  useEffect(() => {
    if (!isAuthenticated) 
      router.push('/')
  }, [isAuthenticated])


  /**
   * Form submit
   */
  const onSubmit = async ({ categoryId, title, message }) => {
    try {

      const { insert_threads_one } = await hasura.request(ADD_THREAD_MUTATION, {
        category_id: categoryId,
        title,
        message
      })

      router.push(`/thread/${insert_threads_one.id}`)
      
    } catch (err) {
      console.log(`Error: ${err}`)
    }
  }
  
  return (
    <>
      <Head>
        <title>Ask A Question | Forum</title>
      </Head>
      <Layout>
        <h1 className="text-3xl pt-8 pb-3 font-semibold text-gray-700">Post new thread</h1>
        <form onSubmit={ handleSubmit(onSubmit) } className="space-y-5">
          <div className="flex flex-col">
            <label className="block">
              <span className="text-gray-700">Category</span>
              <select name="categoryId" 
                      className={ `mt-0 block w-full px-0.5 border-0 border-b-2 focus:ring-0 ${ errors.categoryId ? 'border-red-200 focus:border-red-500' : 'border-gray-200 focus:border-black' } ${ isSubmitting ? 'opacity-50' : 'opacity-100'}` }
                      ref={register({
                        required: 'You must select a category for your thread'
                      })}>
                  {categories.map(({ id, name }) => (
                    <option value={id} key={id}>{ name }</option>
                  ))}
              </select>
            </label>
            { errors.categoryId && <span className="text-xs text-red-500 font-medium pt-0.5">{ errors.categoryId.message }</span> }
          </div>
          <div className="flex flex-col">
            <label className="block">
              <span className="text-gray-700">Title</span>
              <input  type="text"
                      name="title"
                      disabled={ isSubmitting }
                      className={ `mt-0 block w-full px-0.5 border-0 border-b-2 focus:ring-0 ${ errors.title ? 'border-red-200 focus:border-red-500' : 'border-gray-200 focus:border-black' } ${ isSubmitting ? 'opacity-50' : 'opacity-100'}` }
                      ref={register({
                        required: 'You must provide a thread title.'
                      })} />
            </label>
            { errors.title && <span className="text-xs text-red-500 font-medium pt-0.5">{ errors.title.message }</span> }
          </div>
          <div className="flex flex-col">
            <label className="block space-y-3">
              <span className="text-gray-700">Message</span>
              <Controller 
                disabled={isSubmitting}
                control={control}
                name="message"
                defaultValue=""
                rules={{
                  required: 'You must provide a thread message.'
                }}
                as={
                  <ReactMde
                    selectedTab={selectedTab}
                    onTabChange={setSelectedTab}
                    generateMarkdownPreview={markdown =>
                      Promise.resolve(<Markdown source={markdown} />)
                    }
                  />
                }
              />
            </label>
            { errors.message && <span className="text-xs text-red-500 font-medium pt-0.5">{ errors.message.message }</span> }
          </div>
          <div className="flex items-center justify-start">
            <button disabled={ isSubmitting }
                    className={ `${ isSubmitting ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-white hover:text-indigo-500' } flex justify-center w-24 border border-indigo-600 bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ease-in-out duration-200`} 
                    type="submit"> 
              { isSubmitting ? <Spinner className='w-5 h-5 text-white' /> : 'Post' }
            </button>
          </div>
        </form>
      </Layout>
    </>
  )
}