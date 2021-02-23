import { GraphQLClient } from 'graphql-request'

let token

if (typeof window !== 'undefined') {
  const user = JSON.parse(
    JSON.parse(localStorage.getItem('forum-auth'))
  )
  token = user?.token
}

export const hasuraUserClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_API_ENDPOINT,
  {
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }
)