import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { hasuraAdminClient } from '~/lib/hasura-admin-client'
import { ADD_USER_MUTATION } from '~/graphql/mutations'
import { GET_USER_BY_EMAIL_QUERY } from '~/graphql/queries'

export default async (req, res) => {
  const { name, email, password: rawPassword } = req.body
  
  /**
   * 1. Look up user from Hasura by email
   * 2. If user found, return error
   * 3. Hash the password
   * 4. Create user on hasura
   * 5. Create a JWT
   * 6. Return the JWT as token + user 
   */

  // 1. Look up user from Hasura by email
   const { users: [foundUser] } = await hasuraAdminClient.request(GET_USER_BY_EMAIL_QUERY, {
     email
   })

  // 2. If user found, return error
   if (foundUser)
    return res
      .status(400)
      .json({
        message: `Unable to create account with the email provided. Try another.`
      })

  // 3. Hash the password
  const salt = await bcrypt.genSalt()
  const password = await bcrypt.hash(rawPassword, salt)

  // 4. Create user on hasura
  const { insert_users_one } = await hasuraAdminClient.request(ADD_USER_MUTATION, {
    name,
    email,
    password
  })

  // 5. Create a JWT
  const token = jwt.sign({
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["guest","user"],
      "x-hasura-default-role": "user",
      "x-hasura-user-id": insert_users_one.id
    }
  }, process.env.HASURA_JWT_SECRET, {
    subject: insert_users_one.id
  })

  // 6. Return the JWT as token + user 
  res.status(201).json({
    token,
    ...insert_users_one
  })
}