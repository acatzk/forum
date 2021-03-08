import Spinner from './Spinner'
import { useState } from 'react'
import ReactMde from 'react-mde'
import Markdown from 'react-markdown'
import { useForm, Controller } from 'react-hook-form'

export default function PostForm ({ onSubmit, defaultValues }) {

  const {
    errors,
    control,
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm({ defaultValues })

  const [selectedTab, setSelectedTab] = useState('write')

  return (
    <form onSubmit={ handleSubmit(onSubmit) }>
      <div className="flex flex-col">
          <Controller 
            disabled={isSubmitting}
            control={control}
            name="message"
            defaultValue=""
            rules={{ required: 'You must a message to reply.' }}
            as={<ReactMde
                  selectedTab={selectedTab}
                  onTabChange={setSelectedTab}
                  generateMarkdownPreview={markdown => Promise.resolve(<Markdown source={markdown} />) }
                />}
          />
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
  )
}