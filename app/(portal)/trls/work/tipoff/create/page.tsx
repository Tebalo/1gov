'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import InfoCard from '@/app/components/InfoCard'
import { FileCheck, Info, SaveIcon } from 'lucide-react'
import { createTipOff } from '@/app/lib/actions'

interface TipOffData {
  full_name: string;
  phone: string;
  identity_No: string;
  email: string;
  nature_of_crime: string;
  description: string;
  crime_location: string;
}

const initialState: TipOffData = {
  full_name: '',
  phone: '',
  identity_No: '',
  email: '',
  nature_of_crime: '',
  description: '',
  crime_location: ''
}

export default function CreateTipOffPage() {
  const router = useRouter()
  const [tipOffDetails, setTipOffDetails] = useState<TipOffData>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTipOffDetails(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (value: string) => {
    setTipOffDetails(prev => ({
      ...prev,
      nature_of_crime: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const res = await createTipOff(tipOffDetails)

      if (res.code === 200 || res.code === 201) {
        router.push('/trls/work')
      } else {
        setError(res.message || 'Failed to submit tip-off')
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred while submitting the tip-off'
      console.error('Failed to submit tip-off:', error)
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <div className="mb-4 flex-shrink-0 shadow-md">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Submit Tip-off
          </h1>
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
              <SaveIcon className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
        <div className="mt-2 h-1 w-full bg-blue-400 rounded-full"></div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-500 mb-4">
              {error}
            </div>
          )}

          {/* Personal Information */}
          <InfoCard title="Personal Information" icon={<Info className="w-6 h-6 text-blue-500"/>}>
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <Input
                type="text"
                id="full_name"
                name="full_name"
                value={tipOffDetails.full_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={tipOffDetails.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="identity_No" className="block text-sm font-medium text-gray-700">Identity Number</label>
              <Input
                type="text"
                id="identity_No"
                name="identity_No"
                value={tipOffDetails.identity_No}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                id="email"
                name="email"
                value={tipOffDetails.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </InfoCard>

          {/* Crime Information */}
          <InfoCard title="Crime Information" icon={<FileCheck className="w-6 h-6 text-blue-500"/>}>
            <div>
              <label htmlFor="nature_of_crime" className="block text-sm font-medium text-gray-700">Nature of Crime</label>
              <Select
                value={tipOffDetails.nature_of_crime}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select crime type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Theft">Theft</SelectItem>
                  <SelectItem value="Assault">Assault</SelectItem>
                  <SelectItem value="Rape">Rape</SelectItem>
                  <SelectItem value="Grand theft">Grand theft</SelectItem>
                  <SelectItem value="Drug use">Drug use</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="crime_location" className="block text-sm font-medium text-gray-700">Crime Location</label>
              <Input
                type="text"
                id="crime_location"
                name="crime_location"
                value={tipOffDetails.crime_location}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <Textarea
                id="description"
                name="description"
                value={tipOffDetails.description}
                onChange={handleInputChange}
                rows={4}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </InfoCard>
        </form>
      </div>
    </div>
  )
}