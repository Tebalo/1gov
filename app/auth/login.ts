import { NextApiRequest, NextApiResponse } from 'next'
import { login, storeSession } from '@/app/auth/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)
      const authResponse = await login(formData)
      await storeSession(authResponse)
      res.status(200).json(authResponse)
    } catch (error) {
      res.status(500).json({ error: true, message: 'Login failed' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}