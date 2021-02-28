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

export const GET_THREADS_QUERY = gql`
  query GetThreadsQuery {
    threads(order_by: {posts_aggregate: {max: {created_at: desc}}}) {
      id
      title
      author {
        id
        name
      }
      category {
        id
        name
      }
      posts(limit: 1, order_by: {created_at: desc}) {
        id
        message
        created_at
        author {
          id
          name
        }
      }
      posts_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`

export const GET_THREAD_BY_ID = gql`
  query GetThreadById($id: uuid!) {
    threads_by_pk(id: $id) {
      id
      title
      locked
      posts {
        id
        message
        created_at
        author {
          name
        }
      }
    }
  }
`