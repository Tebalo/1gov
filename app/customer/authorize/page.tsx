'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthResponse, DecodedToken } from '@/app/lib/types'
import { jwtDecode } from 'jwt-decode'
import { storeAccessGroups, storeSession } from '@/app/auth/auth'
import { storeAuthData } from '../components/1gov-login'

type AuthState = {
  isStoringSession: boolean
  isDecryptingSession: boolean
  isRedirecting: boolean
}

function AuthorizeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [authState, setAuthState] = useState<AuthState>({
    isStoringSession: false,
    isDecryptingSession: false,
    isRedirecting: false
  })

  useEffect(() => {
    const processToken = async () => {
      const tokenFromUrl = searchParams.get('access_token')
      
      if (!tokenFromUrl) {
        setError('No access token found in URL')
        return
      }

      setToken(tokenFromUrl)
      setAuthState({ isStoringSession: true, isDecryptingSession: false, isRedirecting: false })

      try {
        // Create auth response object
        const authResponse: AuthResponse = {
            access_token: tokenFromUrl,
            refresh_token: "",
            token_type: "Bearer",
            expires_in: '18000',
            message: "Logged in successfully",
            refresh_expires_in: "3600",
            'not-before-policy': "0",
            scope: "openid email profile",
            id_token: "",
            session_state: "55696c7e-d581-483e-8669-5a9db5339e00",
            code: null
        }

        // Store session and auth data
        await storeSession(authResponse)
        await storeAuthData(authResponse)

        setAuthState({ isStoringSession: false, isDecryptingSession: true, isRedirecting: false })

        // Decode and validate token
        const attemptDeTokenize = (): DecodedToken => {
          try {
            const decodedToken: DecodedToken = jwtDecode(authResponse.access_token)
            
            if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
              throw new Error('Token has expired')
            }
            
            return decodedToken
          } catch (error) {
            throw new Error('Failed to decode authentication token')
          }
        }

        const profile = await attemptDeTokenize()
        await storeAccessGroups(profile)

        setAuthState({ isStoringSession: false, isDecryptingSession: false, isRedirecting: true })

        // Redirect after a short delay to show success state
        setTimeout(() => {
          router.push('/customer/dashboard')
        }, 500)

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed')
        setAuthState({ isStoringSession: false, isDecryptingSession: false, isRedirecting: false })
      }
    }

    processToken()
  }, [searchParams, router])

  const isLoading = authState.isStoringSession || authState.isDecryptingSession || authState.isRedirecting

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Authorization
        </h1>
        
        {error ? (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm font-medium text-red-800">
                {error}
              </p>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition-colors"
            >
              Return to Login
            </button>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            
            <div className="space-y-2 text-center">
              {authState.isStoringSession && (
                <p className="text-sm text-gray-600">Storing session...</p>
              )}
              {authState.isDecryptingSession && (
                <p className="text-sm text-gray-600">Validating credentials...</p>
              )}
              {authState.isRedirecting && (
                <p className="text-sm text-gray-600">Redirecting to dashboard...</p>
              )}
            </div>
          </div>
        ) : token ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-sm font-medium text-green-800">
                ✓ Authentication successful!
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm text-yellow-800">
              Processing authentication...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AuthorizePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-sm text-gray-600 text-center mt-4">Loading...</p>
        </div>
      </div>
    }>
      <AuthorizeContent />
    </Suspense>
  )
}