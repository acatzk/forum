import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useAuthDispatch, useAuthState } from '~/context/auth'

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
      <h1>Create Account</h1>
      <form onSubmit={ handleSubmit(onSubmit) } className="space-y-2">
        <div>
          <input 
            type="text"
            id="name"
            name="name"
            placeholder="Enter name"
            ref={register({
              required: 'You must provide a name.'
            })} />
          { errors.name && <span className="text-sm text-red-400 font-semibold">{ errors.name.message }</span> }
        </div>
        <div>
          <input 
            type="email"
            id="email"
            name="email"
            placeholder="Enter email"
            ref={register({
              value: /^[A-Z0-9._%-]+@[A-Z0-9*-]+\.[A-Z]{2,}$/i,
              required: 'You must provide an email.'
            })} />
          { errors.email && <span className="text-sm text-red-400 font-semibold">{ errors.email.message }</span> }
        </div>
        <div>
          <input 
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            ref={register({
              required: 'You must provide a password.',
              minLength: {
                message: 'Your password must be atleast 6 characters',
                value: 6
              }
            })} />
          { errors.password && <span className="text-sm text-red-400 font-semibold">{ errors.password.message }</span> }
        </div>
        <div>
          <button disabled={ isSubmitting } className="focus:outline-none block py-2 px-3 bg-indigo-600 hover:bg-indigo-500 focus:bg-indigo-700 text-white font-semibold rounded-full">
            Create Account
          </button>
        </div>
      </form>
    </>
  )
}