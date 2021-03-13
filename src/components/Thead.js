import Link from 'next/link'
import ActiveLink from '~/components/ActiveLink'
import formatRelative from 'date-fns/formatRelative'

export default function Thread ({ id, title, category, posts, posts_aggregate, pinned, locked }) {
  const { count } = posts_aggregate.aggregate
  const hasReplies = count > 1
  const [lastPost] = posts
  const timeago = formatRelative(Date.parse(lastPost.created_at), new Date(), { weekStartsOn: 1 })

  return (
    <div key={id} className="group hover:bg-white hover:shadow-lg transition ease-in-out duration-150 rounded-full px-2">
      <Link href={ `/thread/${id}` }>
        <a className="py-6 px-4 w-full transition ease-in-out duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 w-full">
              <div className="p-1">
                <svg className="fill-current w-8 h-8 text-gray-400"  viewBox="0 0 24 24">
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M17.841 15.659l.176.177.178-.177a2.25 2.25 0 0 1 3.182 3.182l-3.36 3.359-3.358-3.359a2.25 2.25 0 0 1 3.182-3.182zM12 14v8H4a8 8 0 0 1 7.75-7.996L12 14zm0-13c3.315 0 6 2.685 6 6s-2.685 6-6 6-6-2.685-6-6 2.685-6 6-6z" />
                </svg>
              </div>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-semibold hover:underline group-hover:text-indigo-500 transition ease-in-out duration-200 text-gray-700 clamp-1">
                    { title }
                  </h3>
                </div>
                <div className="flex items-center space-x-1.5">
                  <svg className="fill-current w-5 h-5 text-gray-400"  viewBox="0 0 24 24">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M17.841 15.659l.176.177.178-.177a2.25 2.25 0 0 1 3.182 3.182l-3.36 3.359-3.358-3.359a2.25 2.25 0 0 1 3.182-3.182zM12 14v8H4a8 8 0 0 1 7.75-7.996L12 14zm0-13c3.315 0 6 2.685 6 6s-2.685 6-6 6-6-2.685-6-6 2.685-6 6-6z" />
                  </svg>
                  <div className="flex items-center text-sm text-gray-400 pt-1 transition ease-in-out duration-200">
                    <span className="font-medium hover:text-indigo-600 hover:underline">
                      { `${lastPost.author.name}` }
                    </span>
                    <span className="ml-1">{ `${hasReplies ? 'replied ' : 'posted '} ` }</span> 
                      {category && (
                          <div className="ml-1 flex items-center">
                            <p>in</p>
                            <span className="font-medium">
                              <ActiveLink href={ `/category/${category.id}` }>
                                <span className="hover:text-indigo-600 hover:underline ml-1">
                                  { category.name }
                                </span>
                              </ActiveLink>
                            </span>
                          </div>
                        )
                      }
                    <span className="ml-1">{ timeago }</span>
                  </div> 
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                {pinned && (
                  <div className="flex items-center space-x-1 px-2 py-1.5 rounded-full text-yellow-600 group-hover:bg-yellow-100">
                    <svg className="fill-current w-3 h-3" viewBox="0 0 24 24">
                      <path fill="none" d="M0 0h24v24H0z"/>
                      <path d="M22.314 10.172l-1.415 1.414-.707-.707-4.242 4.242-.707 3.536-1.415 1.414-4.242-4.243-4.95 4.95-1.414-1.414 4.95-4.95-4.243-4.242 1.414-1.415L8.88 8.05l4.242-4.242-.707-.707 1.414-1.415z"/>
                    </svg>
                    <span className="text-xs font-semibold">Pinned</span>
                  </div>
                )}
                {locked && (
                  <div className="flex items-center space-x-1 px-2 py-1.5 rounded-full text-red-600 group-hover:bg-red-100">
                    <svg className="fill-current w-3 h-3" viewBox="0 0 24 24">
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path
                        d="M19 10h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 1 1 14 0v1zm-2 0V9A5 5 0 0 0 7 9v1h10zm-6 4v4h2v-4h-2z" />
                    </svg>
                    <span className="text-xs font-semibold">Locked</span>
                  </div>
                )}
              </div>
              {count !== 1 && (
                <div className="flex items-center space-x-1 rounded-full py-1.5 px-2 group-hover:bg-indigo-500">
                  <svg className="w-3 h-3 fill-current text-indigo-500 group-hover:text-white" viewBox="0 0 24 24">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M7.291 20.824L2 22l1.176-5.291A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.956 9.956 0 0 1-4.709-1.176zm.29-2.113l.653.35A7.955 7.955 0 0 0 12 20a8 8 0 1 0-8-8c0 1.334.325 2.618.94 3.766l.349.653-.655 2.947 2.947-.655z" />
                  </svg>
                  <span className="text-xs group-hover:text-white text-indigo-500 font-semibold">{ count - 1 }</span>
                </div>
              )}
              <div>
                <svg className="w-8 h-8 fill-current group-hover:text-indigo-500 text-gray-400" viewBox="0 0 24 24">
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}