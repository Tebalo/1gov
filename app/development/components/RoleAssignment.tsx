'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check } from 'lucide-react'

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
    "CUSTOMER"
  ]
}

export default function RoleAssignment() {
  const [username, setUsername] = useState("")
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

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
        method: 'PUT',
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
    <div className="h-screen p-6">
      {/* Fixed username input at top */}
      <div className="sticky top-0 bg-white pb-4 z-10 border-b">
        <Label htmlFor="username" className="text-lg font-semibold">Username</Label>
        <Input
          id="username"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-2 max-w-md"
        />
      </div>

      <div className="mt-6 flex gap-6">
        {/* Scrollable roles section */}
        <ScrollArea className="flex-1 h-[calc(100vh-200px)]">
          <div className="space-y-6 pr-4">
            {Object.entries(ROLE_CATEGORIES).map(([category, roles]) => (
              <div key={category} className="space-y-3">
                <h3 className="font-semibold text-lg text-gray-700">{category}</h3>
                <div className="grid grid-cols-3 gap-3">
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
                        <span className="text-sm">{role.replace(/_/g, ' ')}</span>
                        {selectedRoles.includes(role) && (
                          <Check className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Fixed selected roles sidebar */}
        <div className="w-80">
          <Card className="p-4 sticky top-0">
            <h3 className="font-semibold mb-4">Selected Roles</h3>
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-2">
                {selectedRoles.map(role => (
                  <div 
                    key={role}
                    className="flex items-center justify-between p-2 bg-blue-50 rounded"
                  >
                    <span className="text-sm text-blue-700">{role.replace(/_/g, ' ')}</span>
                    <button 
                      onClick={() => toggleRole(role)}
                      className="text-blue-700 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Button 
              className="w-full mt-4"
              onClick={handleSubmit} 
              disabled={loading || !username || selectedRoles.length === 0}
            >
              {loading ? "Assigning..." : "Assign Roles"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}