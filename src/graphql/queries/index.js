import { gql } from 'graphql-request'

export const GET_USER_BY_EMAIL_QUERY = gql`
  query GetUserByEmail($email: String) {
    users(where: {email: {_eq: $email}}) {
      id
      name
      email
    }
  }
`

export const GET_CATEGORY_QUERY = gql`
  query GetCategory {
    categories {
      id
      name
    }
  }
`