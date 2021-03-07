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

export const ADD_POST_MUTATION = gql`
  mutation AddPostMutation($message: String, $thread_id: uuid) {
    insert_posts_one(object: {message: $message, thread_id: $thread_id}) {
      id
      message
      created_at
      author {
        name
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