import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { hasuraAdminClient } from './../../lib/hasura-admin-client'

export default async (req, res) => {
  const { email, password } = req.body

  const user = { name: 'James bond' }

  const token = '123'

  res.status(200).json({
    token,
    ...user
  })
}