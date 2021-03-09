import Link from 'next/link'
import PostForm from './PostForm'
import Reactions from './Reactions'
import Markdown from 'react-markdown'
import { useAuthState } from '~/context/auth'
import { useState, useCallback } from 'react'
import formatRelative from 'date-fns/formatRelative'

export default function Post ({ id, message, created_at, updated_at, author, likes, likes_aggregate, actions }) {

  const [editing, setEditing] = useState(false)
  const { isAuthenticated, user } = useAuthState()
  const isAuthor = isAuthenticated && author.id === user.id
  const updated = created_at !== updated_at
  const formattedCreatedAt = formatRelative(Date.parse(created_at), new Date(), { weekStartsOn: 1 })
  const formattedUpdatedAt = formatRelative(Date.parse(updated_at), new Date(), { weekStartsOn: 1 })
  const { handleLike, handleUnlike, handleUpdate, handleDelete } = actions

  const toggleEditing = useCallback(() => {
    setEditing(v => !v)
  }, [])

  const saveAndUpdate = async({ message }, ...args) => {
    await handleUpdate({ id, message }, ...args)
    setEditing(false)
  } 

  const deletePost = () => handleDelete({ id })

  return (
    <div className="flex items-start space-x-2 py-3">
      <div className="rounded-full border-2 border-gray-500 p-1">
        <svg className="w-5 h-5 fill-current text-gray-600" 
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
        </svg>
      </div>
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold">
              <Link href={`/profile/${author.id}`}>
                <a className="hover:underline hover:text-indigo-600 transition ease-in-out duration-200">{ author.name }</a>
              </Link>
            </h3>
          </div>
          {isAuthor && 
            <div className="flex items-center space-x-2">
              <button onClick={ toggleEditing } className="appearance-none p-1 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z"/>
                </svg>
              </button>
              <button onClick={ deletePost } className="appearance-none p-1 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zM9 4v2h6V4H9z"/>
                </svg>
              </button>
            </div>}
        </div>
        <div className="text-base py-2">
          { editing ?
           (<PostForm 
              defaultValues={{ message }} 
              onSubmit={saveAndUpdate}
              />) : 
           (<Markdown source={ message }/>) }
           <div className="space-x-1">
            <span className="text-xs text-gray-500">Posted { formattedCreatedAt }</span>
            <span>&middot;</span>
            { updated && (<span className="text-xs text-gray-500">Updated { formattedUpdatedAt }</span>) }
           </div>
        </div>
        <Reactions 
          post_id={id} 
          likes={likes}
          likes_aggregate={likes_aggregate} 
          handleLike={handleLike}
          handleUnlike={handleUnlike}
          handleDelete={handleDelete} />
      </div>
    </div>
  )
}