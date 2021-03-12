import useSWR from 'swr'
import Link from 'next/link'
import { Menu } from '@headlessui/react'
import { GET_CATEGORY_QUERY } from '~/graphql/queries'
import { hasuraUserClient } from '~/lib/hasura-user-client'

export default function CategorySwitcher () {

  const hasura = hasuraUserClient()
  const { data } = useSWR(GET_CATEGORY_QUERY, (query) => hasura.request(query))

  return (
    <Menu>
      <Menu.Button>Categories</Menu.Button>
      <Menu.Items>
        {data?.categories.map(({id, name}) => (
          <Menu.Item key={id}>
            <Link href={`/category/${id}`}>
              <a>
                { name }
              </a>
            </Link>
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  )
}