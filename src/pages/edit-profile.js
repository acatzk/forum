import Head from 'next/head'
import { useEffect } from 'react'
import Layout from '~/layouts/default'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import Spinner from '~/components/Spinner'
import { useToasts } from 'react-toast-notifications'
import { UPDATE_USER_MUTATION } from '~/graphql/mutations'
import { hasuraUserClient } from '~/lib/hasura-user-client'
import { useAuthState, useAuthDispatch } from '~/context/auth'

export default function EditProfilePage() {  

  const router = useRouter()
  const { addToast } = useToasts()
  const hasura = hasuraUserClient()
  const { updateUser } = useAuthDispatch()
  const { isAuthenticated, user } = useAuthState()

  const {
    errors,
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm({ defaultValues: user })

  useEffect(() => {
    if (!isAuthenticated) return router.push('/')
  }, [])

  const onSubmit = async ({ name }) => {
    try {

      const { update_users_by_pk } = await hasura.request(UPDATE_USER_MUTATION, {
        id: user.id,
        name
      })

      updateUser(update_users_by_pk)
      addToast('Saved Successfully', { appearance: 'success', autoDismiss: true })

    } catch (err) {
      addToast(err, { appearance: 'error', autoDismiss: true })
    }
  }
  
  return (
    <>
      <Head>
        <title>Profile | Forum</title>
      </Head>
      <Layout>
        <h1 className="text-3xl pt-8 pb-3 font-semibold text-gray-700">Edit Profile</h1>
        <form onSubmit={ handleSubmit(onSubmit) } className="space-y-5">
          <div className="flex flex-col">
            <label className="block">
              <span className="text-gray-700">Name</span>
              <input  type="text"
                      name="name"
                      disabled={ isSubmitting }
                      className={ `mt-0 block w-full px-0.5 border-0 border-b-2 focus:ring-0 ${ errors.title ? 'border-red-200 focus:border-red-500' : 'border-gray-200 focus:border-black' } ${ isSubmitting ? 'opacity-50' : 'opacity-100'}` }
                      ref={register({
                        required: 'You must provide a name.'
                      })} />
            </label>
            { errors.name && <span className="text-xs text-red-500 font-medium pt-0.5">{ errors.title.name }</span> }
          </div>
          <div className="flex items-center justify-start">
            <button disabled={ isSubmitting }
                    className={ `${ isSubmitting ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-white hover:text-indigo-500' } flex justify-center w-24 border border-indigo-600 bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ease-in-out duration-200`} 
                    type="submit"> 
              { isSubmitting ? <Spinner className='w-5 h-5 text-white' /> : 'Save' }
            </button>
          </div>
        </form>
      </Layout>
    </>
  )
}