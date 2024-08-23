import { NextApiRequest, NextApiResponse } from 'next'
import { validateOTP, storeSession } from '@/app/auth/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { username, otp } = req.body
      const authResponse = await validateOTP(username, otp)
      if (authResponse.access_token) {
        await storeSession(authResponse)
        res.status(200).json({ success: true })
      } else {
        res.status(400).json({ error: true, message: 'OTP validation failed' })
      }
    } catch (error) {
      res.status(500).json({ error: true, message: 'OTP validation failed' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}