import useSWR from 'swr'
import { useMemo } from 'react'
import Layout from '~/layouts/default'
import { GET_USERS_QUERY } from '~/graphql/queries'
import formatRelative from 'date-fns/formatRelative'
import { hasuraUserClient } from '~/lib/hasura-user-client'

export const getStaticProps = async () => {
  const hasura = hasuraUserClient()
  const initialData = await hasura.request(GET_USERS_QUERY)

  return {
    props: {
      initialData
    },
    revalidate: 1
  }
}

export default function MembersPage ({ initialData }) {

  const hasura = hasuraUserClient()
  const { data } = useSWR(GET_USERS_QUERY, (query) => hasura.request(query), {
    initialData,
    revalidateOnMount: true
  })

  return (
    <Layout>
      <h1 className="text-3xl pt-8 pb-3 font-semibold text-gray-700">Members</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3 py-8">
        {data.users.map(({ id, name, created_at, last_seen }) => {

          const formatedLastSeen = useMemo(() => formatRelative(Date.parse(created_at), new Date(), { weekStartsOn: 1 }), [last_seen])
          const isUserOnline = 20 > formatedLastSeen

          return (
            <div key={id}>
              <div className="flex items-center">
                <span className="relative inline-block h-10 w-10 rounded-full mr-2 md:mr-4 bg-gray-100 p-1">
                  <svg className="h-full w-full fill-current text-gray-500"  viewBox="0 0 24 24">
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M17.841 15.659l.176.177.178-.177a2.25 2.25 0 0 1 3.182 3.182l-3.36 3.359-3.358-3.359a2.25 2.25 0 0 1 3.182-3.182zM12 14v8H4a8 8 0 0 1 7.75-7.996L12 14zm0-13c3.315 0 6 2.685 6 6s-2.685 6-6 6-6-2.685-6-6 2.685-6 6-6z" />
                  </svg>
                  {isUserOnline && <div className="absolute w-3 h-3 border-2 border-white bg-green-400 rounded-full right-0 bottom-0 z-50"></div>}
                </span>
                <div>
                  <h3 className="md:text-lg font-semibold text-gray-700">{ name }</h3>
                  <div className="text-xs text-gray-600">Joined { formatedLastSeen }</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}