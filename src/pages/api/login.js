import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { hasuraAdminClient } from '~/lib/hasura-admin-client'
import gql from 'graphql-tag'

const GET_USER_BY_EMAIL_QUERY = gql`
  query GetUserByEmail($email: String) {
    users(where: {email: {_eq: $email}}) {
      id
      name
      email
      password
    }
  }
`

export default async (req, res) => {
  const { email, password: rawPassword } = req.body

  /**
   * 1. Lookup user from Hasura
   * 2. If no user found, return error
   * 3. Do the passwords match?
   * 4. Create a JWT
   */

  // 1. Look up user from Hasura by email
  const { users: [foundUser] } = await hasuraAdminClient.request(GET_USER_BY_EMAIL_QUERY, {
    email
  })
    
  // 2. If user found, return error
  if (!foundUser) {
    return res
      .status(401)
      .json({
        message: `Invalid email/password.`
      })
  }

  // 3. Do the passwords match?
  const { password, ...user } = foundUser
  const passwordsMatch = await bcrypt.compare(rawPassword, password)

  if (!passwordsMatch) {
    return res
      .status(401)
      .json({
        message: `Invalid email/password.`
      })
  }

  // Create a JWT
  const token = jwt.sign({
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["guest","user"],
      "x-hasura-default-role": "user",
      "x-hasura-user-id": user.id
    }
  }, process.env.HASURA_JWT_SECRET, {
    subject: user.id
  })

  
  res.status(200).json({
    token,
    ...user
  })
}