'use client'

import React from 'react'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useAssetActions } from '@/lib/hooks/useAssetAction';

interface ActionButtonsProps {
  caseCode: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ caseCode }) => {
  const { handleUpdate, handleDelete, isDeleting } = useAssetActions(caseCode)

  return (
    <div className="flex justify-end space-x-4 mb-6">
      <Button onClick={handleUpdate} className="bg-blue-500 hover:bg-blue-600 text-white">
        <Edit className="w-4 h-4 mr-2" /> Update
      </Button>
      <Button onClick={handleDelete} variant="destructive" disabled={isDeleting}>
        <Trash2 className="w-4 h-4 mr-2" /> {isDeleting ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  )
}

export default ActionButtons