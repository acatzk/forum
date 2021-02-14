export default async (req, res) => {
  const { name, email, password } = req.body

  const user = { name: 'James bond' }

  const token = '123'

  res.status(200).json({
    token,
    ...user
  })
}