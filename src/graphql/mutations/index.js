import { gql } from 'graphql-request'

export const ADD_USER_MUTATION = gql`
  mutation AddUserMutation($name: String!, $email: String!, $password: String!) {
    insert_users_one(object: {name: $name, email: $email, password: $password}) {
      id
      email
      name
    }
  }
`

export const ADD_THREAD_MUTATION = gql`
  mutation InsertThread($category_id: uuid, $title: String, $message: String) {
    insert_threads_one(object: {category_id: $category_id, title: $title, posts: {data: {message: $message}}}) {
      id
      title
      author {
        name
      }
      category {
        name
      }
      posts {
        message
      }
      created_at
    }
  }
`