import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useAuthDispatch, useAuthState } from '~/context/auth'
import Spinner from '~/components/Spinner'
import Layout from '~/layouts/default'

/**
* 1. Login form for name, email, password
* 2. Send a POST request to /api/register
* 3. If there is error, return the error
* 4. If successful, redirect to the root
*/
export default function RegisterPage() {

  const router = useRouter()
  const { isAuthenticated } = useAuthState()
  const { register: createUser } = useAuthDispatch()

  const {
    handleSubmit,
    register,
    setError,
    errors,
    formState: { isSubmitting }
  } = useForm()

  useEffect(() => {
    if (isAuthenticated) router.push('/')
  }, [isAuthenticated])

  const onSubmit = async ({ name, email, password }) => {
    try {

      await createUser({ name, email, password })
      router.push('/')

    } catch ({ message }) {
      setError('email', {
        type: "manual",
        message
      })
    }
  }

  return (
    <>
      <Head>
        <title>Registration | Forum</title>
      </Head>
      <Layout>
        <div className="flex h-screen">
          <div className="w-full bg-white m-auto max-w-full sm:max-w-md px-9 py-14 rounded-none sm:rounded-lg shadow">
            <h1 className="text-3xl text-center font-medium mb-4 text-gray-800">Create Account</h1>
            <form onSubmit={ handleSubmit(onSubmit) } className="space-y-3">
              <div className="flex flex-col">
                <label className="block">
                  <span className="text-gray-700">Fullname</span>
                  <input 
                    type="text"
                    name="name"
                    disabled={ isSubmitting }
                    className={ `mt-0 block w-full px-0.5 border-0 border-b-2 focus:ring-0 ${ errors.name ? 'border-red-200 focus:border-red-500' : 'border-gray-200 focus:border-black' } ${ isSubmitting ? 'opacity-50' : 'opacity-100'}` }
                    ref={register({
                      required: 'You must provide a name.'
                    })} />
                </label>
                { errors.name && <span className="text-xs text-red-500 font-medium">{ errors.name.message }</span> }
              </div>
              <div className="flex flex-col">
                <label className="block">
                  <span className="text-gray-700">Email</span>
                  <input 
                    type="text"
                    name="email"
                    disabled={ isSubmitting }
                    className={ `mt-0 block w-full px-0.5 border-0 border-b-2 focus:ring-0 ${ errors.email ? 'border-red-200 focus:border-red-500' : 'border-gray-200 focus:border-black' } ${ isSubmitting ? 'opacity-50' : 'opacity-100'}` }
                    ref={register({
                      required: 'You must provide an email.',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "E-mail must be valid"
                      }
                    })} />
                </label>
                { errors.email && <span className="text-xs text-red-500 font-medium">{ errors.email.message }</span> }
              </div>
              <div className="flex flex-col">
                <label className="block">
                <span className="text-gray-700">Password</span>
                  <input 
                    type="password"
                    name="password"
                    disabled={ isSubmitting }
                    className={ `mt-0 block w-full px-0.5 border-0 border-b-2 focus:ring-0 ${ errors.password ? 'border-red-200 focus:border-red-500' : 'border-gray-200 focus:border-black' } ${ isSubmitting ? 'opacity-50' : 'opacity-100'}` }
                    ref={register({
                      required: 'You must provide a password.',
                      minLength: {
                        message: 'Your password must be atleast 6 characters',
                        value: 6
                      }
                    })} />
                </label>
                { errors.password && <span className="text-xs text-red-500 font-medium">{ errors.password.message }</span> }
              </div>
              <div className="flex items-center justify-start">
                <button disabled={ isSubmitting }
                        className={ `${ isSubmitting ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-white hover:text-indigo-500' } flex justify-center w-24 border border-indigo-600 bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ease-in-out duration-200`} 
                      type="submit"> 
                  { isSubmitting ? <Spinner className='w-5 h-5 text-white' /> : 'Sign Up' }
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  )
}