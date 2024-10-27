'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const useAssetActions = (caseCode: string) => {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleUpdate = () => {
    router.push(`/trls/work/investigation/edit/${caseCode}`)
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      setIsDeleting(true)
      try {
        router.push('/trls/work/')
      } catch (error) {
        console.error('Failed to delete case:', error)
        alert('Failed to delete case. Please try again.')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return { handleUpdate, handleDelete, isDeleting }
}