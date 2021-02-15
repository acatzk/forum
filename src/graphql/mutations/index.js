import gql from 'graphql-tag'

export const ADD_USER_MUTATION = gql`
  mutation AddUserMutation($name: String!, $email: String!, $password: String!) {
    insert_users_one(object: {name: $name, email: $email, password: $password}) {
      id
      email
      name
    }
  }
`