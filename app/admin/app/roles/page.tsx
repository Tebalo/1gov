'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, X } from 'lucide-react'

const ROLE_CATEGORIES = {
  Registration: [
    "REGISTRATION_OFFICER",
    "SNR_REGISTRATION_OFFICER",
    "MANAGER",
    "DIRECTOR",
    'REGISTRAR'
  ],
  License: [
    'LICENSE_OFFICER',
    'SNR_LICENSE_OFFICER',
    'LICENSE_MANAGER',
    'DIRECTOR',
    'REGISTRAR'
  ],
  Investigations: [
    "INVESTIGATIONS_OFFICER",
    "SENIOR_INVESTIGATIONS_OFFICER",
    "INVESTIGATIONS_MANAGER",
    "INVESTIGATIONS_DIRECTOR",
    "DISCIPLINARY_COMMITTEE",
  ],
  Appeals: [
    "APPEALS_OFFICER",
    "SENIOR_APPEALS_OFFICER",
    "APPEALS_MANAGER",
    "APPEALS_DIRECTOR"
  ],
  CPD: [
    "TEACHER_DEVELOPMENT_OFFICER",
    "SENIOR_DEVELOPMENT_OFFICER",
    "TEACHER_DEVELOPMENT_MANAGER",
  ],
  Other: [
    "CUSTOMER",
    "SYSTEM_USER"
  ]
}

export default function RoleAssignment() {
  const [username, setUsername] = useState("")
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingRoles, setRolesLoading] = useState(false)
  const [deletingRoles, setRolesDeleting] = useState(false)

  const getUserRoles = async () => {
    if (!username) {
        toast({
          title: "Error",
          description: "Please enter username",
          variant: "destructive"
        })
        return
    }

    setLoading(true)
    try {
      const response = await fetch(`https://gateway-cus-acc.gov.bw/roles/users?username=${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error('Failed to assign roles')
      const roles = await response.json()
      // Filter out SYSTEM_USER from the roles
      // const filteredRoles = roles.filter((role: string) => role !== 'SYSTEM_USER')
      setSelectedRoles(roles)
      toast({
        title: "Success",
        description: "User roles pulled successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get roles. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteSubmit = async () => {
    if (!username || selectedRoles.length === 0) {
        toast({
          title: "Error",
          description: "Please enter username and select at least one role",
          variant: "destructive"
        })
        return
      }
  
    setRolesDeleting(true)
    try {
    const response = await fetch(`https://gateway-cus-acc.gov.bw/roles/users?username=${username}`, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedRoles)
    })

    if (!response.ok) throw new Error('Failed to assign roles')

    toast({
        title: "Success",
        description: "Roles deleted successfully",
    })
    setSelectedRoles([])
    } catch (error) {
    toast({
        title: "Error",
        description: "Failed to delete roles. Please try again.",
        variant: "destructive"
    })
    } finally {
    setRolesDeleting(false)
    }
  }

  const handleSubmit = async () => {
    if (!username || selectedRoles.length === 0) {
      toast({
        title: "Error",
        description: "Please enter username and select at least one role",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`https://gateway-cus-acc.gov.bw/roles/users?username=${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedRoles)
      })

      if (!response.ok) throw new Error('Failed to assign roles')

      toast({
        title: "Success",
        description: "Roles assigned successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign roles. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    )
  }

  return (
    <div className="h-full p-0 md:p-6">
      {/* Username input - Full width on mobile */}
        <div className="sticky top-0 bg-white dark:bg-black pb-4 z-10 border-b p-2 rounded-md">
            <Label htmlFor="username" className="text-base md:text-lg font-semibold">Username</Label>
            <div className='flex flex-col sm:flex-row gap-3 w-full'>
                <Input
                id="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full md:max-w-md"
                />
                <Button
                className="mt-2 whitespace-nowrap bg-green-500 hover:bg-green-400"
                onClick={getUserRoles} 
                disabled={loadingRoles || !username}
                >
                    {loadingRoles ? "Processing..." : "Get User Roles"}
                </Button>
                <Button
                className="mt-2 whitespace-nowrap bg-secondary text-gray-700 outline"
                // onClick={getUserRoles} 
                // disabled={loadingRoles || !username}
                disabled
                >
                    {loadingRoles ? "Processing..." : "Get User Profile"}
                </Button>
                <Button
                className="mt-2 whitespace-nowrap bg-secondary text-gray-700 outline"
                // onClick={getUserRoles} 
                // disabled={loadingRoles || !username}
                disabled
                >
                    {loadingRoles ? "Processing..." : "Create User"}
                </Button>
            </div>
        </div>
      {/* Flex container - Stack on mobile, side by side on desktop */}
      <div className="mt-4 md:mt-6 flex flex-col lg:flex-row gap-4 md:gap-6 e">
        {/* Scrollable roles section */}
        <ScrollArea className="flex-1 h-[calc(100vh-280px)] md:h-[calc(100vh-200px)] bg-white p-2 rounded-md">
          <div className="space-y-4 md:space-y-6 pr-2 md:pr-4">
            {Object.entries(ROLE_CATEGORIES).map(([category, roles]) => (
              <div key={category} className="space-y-2 md:space-y-3">
                <h3 className="font-semibold text-base md:text-lg text-gray-700">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                  {roles.map(role => (
                    <button
                      key={role}
                      onClick={() => toggleRole(role)}
                      className={`p-2 rounded-lg border text-left transition-colors
                        ${selectedRoles.includes(role) 
                          ? 'bg-blue-50 border-blue-200 text-blue-700' 
                          : 'bg-white hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-xs">{role.replace(/_/g, ' ')}</span>
                        {selectedRoles.includes(role) && (
                          <Check className="h-4 w-4 text-blue-500 flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Selected roles sidebar - Full width on mobile */}
        <div className="w-full lg:w-80">
          <Card className="p-4 sticky top-0">
            <h3 className="font-semibold mb-4">Selected Roles</h3>
            <ScrollArea className="h-48 md:h-[calc(100vh-300px)]">
              <div className="space-y-2">
                {selectedRoles.map(role => (
                  <div 
                    key={role}
                    className="flex items-center justify-between p-2 bg-blue-50 rounded"
                  >
                    <span className="text-xs md:text-sm text-blue-700">{role.replace(/_/g, ' ')}</span>
                    <button 
                      onClick={() => toggleRole(role)}
                      className="text-blue-700 hover:text-blue-900 p-1"
                      aria-label="Remove role"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {selectedRoles.length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-4">
                    No roles selected
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className='flex flex-col sm:flex-row gap-3 w-full'>
                <Button 
                className="w-full mt-4 bg-red-500 hover:bg-red-400"
                onClick={deleteSubmit} 
                disabled={loading || deletingRoles || !username || selectedRoles.length === 0}
                >
                {deletingRoles ? "Deleting..." : "Delete Roles"}
                </Button>
                <Button 
                className="w-full mt-4"
                onClick={handleSubmit} 
                disabled={loading || !username || selectedRoles.length === 0}
                >
                {loading ? "Assigning..." : "Assign Roles"}
                </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}