import Link from 'next/link'
import formatRelative from 'date-fns/formatRelative'

export default function Thread ({ id, title, category, posts, posts_aggregate }) {
  const { count } = posts_aggregate.aggregate
  const hasReplies = count > 1
  const [lastPost] = posts
  const timeago = formatRelative(Date.parse(lastPost.created_at), new Date(), { weekStartsOn: 1 })

  return (
    <div key={id} className="py-6">
      <div className="flex items-center space-x-2">
        <div className="rounded-full border-2 border-gray-500 p-1">
          <svg className="w-8 h-8" 
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
        <div className="flex flex-col space-y-1">
          <h3 className="text-xl font-semibold">
            <Link href={`/thread/${id}`}>
              <a className="hover:underline hover:text-indigo-600 transition ease-in-out duration-200">{ title }</a>
            </Link>
          </h3>
          <div className="flex items-center space-x-1.5">
            <svg className="w-5 h-5 fill-current text-gray-600" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
            </svg>
            <div className="text-sm text-gray-600 pt-1 transition ease-in-out duration-200">
              <Link href={ `/profile/${lastPost.author.id}`}>
                <a className="font-medium hover:text-indigo-600 hover:underline">
                  { `${lastPost.author.name}` }
                </a>
              </Link>
              { `${hasReplies ? ' replied ' : ' posted '} in ` } 
              <span className="font-medium">
                <Link href={ `/category/${category.id}` }>
                  <a className="hover:text-indigo-600 hover:underline">{`${category.name}`}</a>
                </Link>
              </span>
              <span className="font-medium">{ ` ${timeago}` }</span>
            </div> 
          </div>
        </div>
      </div>
    </div>
  )
}