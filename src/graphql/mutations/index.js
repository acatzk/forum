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
        id
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

export const ADD_POST_MUTATION = gql`
  mutation AddPostMutation($message: String, $thread_id: uuid) {
    insert_posts_one(object: {message: $message, thread_id: $thread_id}) {
      id
      message
      created_at
      updated_at
      author {
        id
        name
      }
      likes {
        id
        user_id
      }
      likes_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`

export const ADD_LIKE_MUTATION = gql`
  mutation AddLikeMutation($post_id: uuid!) {
    insert_likes_one(object: {post_id: $post_id}) {
      id
    }
  }
`

export const DELETE_LIKE_MUTATION = gql`
  mutation DeleteLikeMutation($id: uuid!) {
    delete_likes_by_pk(id: $id) {
      id
    }
  }
`

export const DELETE_POST_MUTATION = gql`
  mutation DeletePostMutation($id: uuid!) {
    delete_posts_by_pk(id: $id) {
      id
    }
  }
`

export const UPDATE_POST_MUTATION = gql`
  mutation updatePostMutation($id: uuid!, $message: String!) {
    update_posts_by_pk(pk_columns: {id: $id}, _set: {message: $message}) {
      id
      message
      updated_at
    }
  }
`

export const UPDATE_LOCKED_STATUS_MUTATION = gql`
  mutation updateLockedStatus($id: uuid!, $locked: Boolean) {
    update_threads_by_pk(pk_columns: {id: $id}, _set: {locked: $locked}) {
      id
      locked
    }
  }
`

export const UPDATE_ANSWERED_STATUS_MUTATION = gql`
  mutation updateAnsweredStatus($id: uuid!, $answered: Boolean) {
    update_threads_by_pk(pk_columns: {id: $id}, _set: {answered: $answered}) {
      id
      answered
    }
  }
`

export const DELETE_THREAD_BY_ID_MUTATION = gql`
  mutation deleteThreadById($id: uuid!) {
    delete_posts(where: {thread_id: {_eq: $id}}) {
      affected_rows
      returning {
        id
      }
    }
    delete_threads_by_pk(id: $id) {
      id
    }
  }
`