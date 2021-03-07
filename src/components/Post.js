import Link from 'next/link'
import Reactions from './Reactions'
import Markdown from 'react-markdown'
import { useAuthState } from '~/context/auth'
import formatRelative from 'date-fns/formatRelative'

export default function Post ({ id, message, created_at, author, likes, likes_aggregate, actions }) {

  const timeago = formatRelative(Date.parse(created_at), new Date(), { weekStartsOn: 1 })
  const { handleLike, handleUnlike, handleDelete } = actions
  const { isAuthenticated, user } = useAuthState()
  const isAuthor = isAuthenticated && author.id === user.id
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
            <span>&middot;</span>
            <span className="text-xs text-gray-500"> { timeago }</span>
          </div>
          {isAuthor && 
            <button onClick={ deletePost } className="appearance-none p-1 text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zM9 4v2h6V4H9z"/>
              </svg>
            </button>}
        </div>
        <div className="text-base">
          <Markdown source={ message }/>
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