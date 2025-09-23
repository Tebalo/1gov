import { getAccessGroups } from "@/app/auth/auth"
import { AccessGroup } from "@/app/lib/types"
import { useEffect, useState } from "react"

interface UserData {
  id: string
  email: string
  name: string
  role: string
  roles: string[]
  profile: {
    personal_info: {
      first_name: string
      last_name: string
      national_id: string
      passport_id: string
    }
    contact_info: {
      phone: string
      email_verified: string
    }
  }

}

export const useUserData = () => {
  const [userData, setUserData] = useState<AccessGroup | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUserData = async () => {
      try {
        // Try sessionStorage first (faster)
        // const sessionData = sessionStorage.getItem('user_data')
        const sessionData = await getAccessGroups()
        if (sessionData) {
          setUserData(sessionData)
          console.log(userData)
          setLoading(false)
          return
        }

        // Fallback to cookie if sessionStorage is empty
        // const cookieData = getCookieValue('user_data')
        // if (cookieData) {
        //   const decoded = decodeURIComponent(cookieData)
        //   const parsed = JSON.parse(decoded)
        //   setUserData(parsed)
        //   // Sync back to sessionStorage
        //   sessionStorage.setItem('user_data', JSON.stringify(parsed))
        // }
      } catch (error) {
        console.error('Error parsing user data:', error)
      } finally {
        setLoading(false)
      }
    }

    getUserData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const updateUserData = (newData: Partial<UserData>) => {
    if (userData) {
      const updated = { ...userData, ...newData }
      setUserData(updated)
      sessionStorage.setItem('user_data', JSON.stringify(updated))
      
      // Update cookie as well
      const cookieOptions = {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const
      }
      document.cookie = `user_data=${encodeURIComponent(JSON.stringify(updated))}; path=/; max-age=${cookieOptions.maxAge}; ${cookieOptions.secure ? 'secure;' : ''} samesite=${cookieOptions.sameSite}`
    }
  }

  return {
    userData,
    loading,
    updateUserData,
    nationalId: userData?.nationalId,
    passportId: userData?.passportId,
    userId: userData?.systemId,
  }
}

// Helper function to get cookie value
function getCookieValue(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}