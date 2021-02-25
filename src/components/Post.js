import Link from 'next/link'
import formatRelative from 'date-fns/formatRelative'

export default function Post ({ id, message, created_at, author }) {
  const timeago = formatRelative(Date.parse(created_at), new Date(), { weekStartsOn: 1 })
  
  return (
    <div key={id} className="flex items-start space-x-2">
      <div className="rounded-full border-2 border-gray-500 p-1">
        <svg className="w-5 h-5 fill-current text-gray-600" 
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
        </svg>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-semibold">
            <Link href={`/profile/${author.id}`}>
              <a className="hover:underline hover:text-indigo-600 transition ease-in-out duration-200">{ author.name }</a>
            </Link>
          </h3>
          <span>&middot;</span>
          <span className="text-xs text-gray-500"> { timeago }</span>
        </div>
        <div className="text-base">
          { message }
        </div>
      </div>
    </div>
  )
}