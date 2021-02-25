import { GraphQLClient } from 'graphql-request'

export const hasuraUserClient = () => {
  let token

  if (typeof window !== 'undefined') {
    const user = JSON.parse(localStorage.getItem('forum-auth'))
    token = user?.token
  }

  return new GraphQLClient(
    process.env.NEXT_PUBLIC_API_ENDPOINT, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    }
  )
}

export { gql } from 'graphql-request'