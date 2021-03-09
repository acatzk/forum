import Link from 'next/link'
import formatRelative from 'date-fns/formatRelative'

export default function Thread ({ id, title, category, posts, posts_aggregate, pinned, locked }) {
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
          <div className="flex items-center space-x-3">
            {pinned && (
              <div>
                <svg className="fill-current w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M22.314 10.172l-1.415 1.414-.707-.707-4.242 4.242-.707 3.536-1.415 1.414-4.242-4.243-4.95 4.95-1.414-1.414 4.95-4.95-4.243-4.242 1.414-1.415L8.88 8.05l4.242-4.242-.707-.707 1.414-1.415z"/>
                </svg>
              </div>
            )}
            {locked && (
              <div>
                <svg className="fill-current w-4 h-4 text-indigo-500" viewBox="0 0 24 24">
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M19 10h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 1 1 14 0v1zm-2 0V9A5 5 0 0 0 7 9v1h10zm-6 4v4h2v-4h-2z" />
                </svg>
              </div>
            )}
            <h3 className="text-xl font-semibold">
              <Link href={`/thread/${id}`}>
                <a className="hover:underline hover:text-indigo-600 transition ease-in-out duration-200">{ title }</a>
              </Link>
            </h3>
          </div>
          <div className="flex items-center space-x-1.5">
            <svg className="w-5 h-5 fill-current text-gray-600" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
            </svg>
            <div className="flex items-center text-sm text-gray-600 pt-1 transition ease-in-out duration-200">
              <Link href={ `/profile/${lastPost.author.id}`}>
                <a className="font-medium hover:text-indigo-600 hover:underline">
                  { `${lastPost.author.name}` }
                </a>
              </Link>
              <span className="ml-1">{ `${hasReplies ? 'replied ' : 'posted '} ` }</span> 
              {category && (
                <div className="ml-1 flex items-center">
                  <p>in</p>
                  <span className="font-medium">
                    <Link href={ `/category/${category.id}` }>
                      <a className="hover:text-indigo-600 hover:underline ml-1">{`${category.name}`}</a>
                    </Link>
                  </span>
                </div>
              )
              }
              <span className="ml-1 font-medium">{ ` ${timeago}` }</span>
            </div> 
          </div>
        </div>
      </div>
    </div>
  )
}