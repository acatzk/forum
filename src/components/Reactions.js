import { useAuthState } from '~/context/auth'
 
export default function Reactions ({ post_id, likes, likes_aggregate, handleLike, handleUnlike }) {
  const { isAuthenticated, user } = useAuthState()
  const { aggregate: { count } } = likes_aggregate
  const like = () => handleLike({ post_id })
  const unlike = (id) => handleUnlike({ id })
  const liked = isAuthenticated ? likes.find((l) => l.user_id === user.id) : false

  return (
    <div className="inline-flex items-center py-2">
      <button 
        onClick={liked ? () => unlike(liked.id) : like} 
        className={ `${liked ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 bg-gray-100'} flex items-center space-x-2 appearance-none p-2  rounded-full px-3 py-1.5 focus:outline-none` }>
        {liked ? (
          <svg className="fill-current w-4 h-4" viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M2 9h3v12H2a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1zm5.293-1.293l6.4-6.4a.5.5 0 0 1 .654-.047l.853.64a1.5 1.5 0 0 1 .553 1.57L14.6 8H21a2 2 0 0 1 2 2v2.104a2 2 0 0 1-.15.762l-3.095 7.515a1 1 0 0 1-.925.619H8a1 1 0 0 1-1-1V8.414a1 1 0 0 1 .293-.707z"/>
          </svg>
        ) : (
          <svg className="fill-current w-4 h-4" viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M14.6 8H21a2 2 0 0 1 2 2v2.104a2 2 0 0 1-.15.762l-3.095 7.515a1 1 0 0 1-.925.619H2a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h3.482a1 1 0 0 0 .817-.423L11.752.85a.5.5 0 0 1 .632-.159l1.814.907a2.5 2.5 0 0 1 1.305 2.853L14.6 8zM7 10.588V19h11.16L21 12.104V10h-6.4a2 2 0 0 1-1.938-2.493l.903-3.548a.5.5 0 0 0-.261-.571l-.661-.33-4.71 6.672c-.25.354-.57.644-.933.858zM5 11H3v8h2v-8z"/>
          </svg>
        )}
        <span className={ `ml-1 text-xs text-semibold ${liked ? 'text-indigo-600' : 'text-gray-600'}`  }>
          { count } { liked && 'You like this' }
        </span>
      </button>
    </div>
  )
}