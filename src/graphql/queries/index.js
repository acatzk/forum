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
      locked
      pinned
      answered
      created_at
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
      answered
      pinned
      author {
        id
      }
      posts {
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
  }
`

export const GET_CATEGORY_BY_ID = gql`
  fragment Thread on threads {
    id
    title
    pinned
    answered
    locked
    author {
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

  query GetCategoryById($id: uuid!) {
    categories_by_pk(id: $id) {
      id
      name
      pinned: threads(where: {pinned: {_eq: true}}, order_by: {posts_aggregate: {max: {created_at: desc}}}) {
        ...Thread
      }
      threads(where: {pinned: {_neq: true}}, order_by: {posts_aggregate: {max: {created_at: desc}}}) {
        ...Thread
      }
    }
  }
`

export const GET_TODAY_POST_QUERY = gql`
  query GetTodayPostQuery($from: timestamptz!, $to: timestamptz!) {
    threads(where: {posts: {created_at: {_gte: $from, _lte: $to}}}, order_by: {posts_aggregate: {max: {created_at: desc}}}) {
      id
      title
      pinned
      answered
      locked
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

export const GET_ANSWERED_POST_QUERY = gql`
  query GetAnsweredPostQuery {
    threads(where: {answered: {_eq: true}}, order_by: {posts_aggregate: {max: {created_at: desc}}}) {
      id
      title
      pinned
      answered
      locked
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

export const GET_UNANSWERED_POST_QUERY = gql`
  query GetUnansweredPostQuery {
    threads(where: {answered: {_neq: true}}, order_by: {posts_aggregate: {max: {created_at: desc}}}) {
      id
      title
      pinned
      answered
      locked
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