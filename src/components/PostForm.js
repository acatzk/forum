import { useForm } from 'react-hook-form'
import Spinner from './Spinner'

export default function PostForm ({ onSubmit }) {

  const {
    handleSubmit,
    register,
    errors,
    formState: { isSubmitting }
  } = useForm()

  return (
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
        <form onSubmit={ handleSubmit(onSubmit) }>
          <div className="flex flex-col">
            <textarea name="message"
                      disabled={ isSubmitting }
                      className={ `mt-0 block w-full px-0.5 border-0 border-b-2 focus:ring-0 ${ errors.message ? 'border-red-200 focus:border-red-500' : 'border-gray-200 focus:border-black' } ${ isSubmitting ? 'opacity-50' : 'opacity-100'}` }
                      ref={register({
                        required: 'You must provide a message to reply.'
                      })}
                      placeholder="Reply to thread">
            </textarea>
            { errors.message && <span className="text-xs text-red-500 font-medium pt-0.5">{ errors.message.message }</span> }
          </div>
          <div className="flex items-center justify-end py-2">
              <button disabled={ isSubmitting }
                      className={ `${ isSubmitting ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-white hover:text-indigo-500' } flex justify-center w-24 border border-indigo-600 bg-indigo-500 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline transition ease-in-out duration-200`} 
                      type="submit"> 
                { isSubmitting ? <Spinner className='w-5 h-5 text-white' /> : 'Reply' }
              </button>
            </div>
        </form>
      </div>
    </div>
  )
}