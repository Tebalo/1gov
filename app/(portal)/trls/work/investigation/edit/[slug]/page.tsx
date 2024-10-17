'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// import { getCaseById, updateCaseById } from '@/lib/api'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { getSession } from '@/app/auth/auth'
import { DatePicker } from '@/components/ui/date-picker'
import { getInvById } from '@/app/lib/actions'

interface reporter {
    name: string | null;
    contact_number: string | null;
    Omang_id: string;
    passport_no: string | null;
    occupation: string | null;
    sex: string | null;
    nationality: string | null;
    address: string | null;
  }
  
  interface complaint {
    crime_location: string | null;
    nature_of_crime: string | null;
    date: string | null;
    time: string | null;
    bif_number: string | null;
    case_number: string;
    fir_number: string | null;
    outcome: string | null;
  }
  
  interface offender {
    name: string | null;
    sex: string | null;
    nationality: string | null;
    dob: string | null;
    age: number | null;
    contact_number: string | null;
    id_passport_number: string | null;
    address: string | null;
    ward: string | null;
    occupation: string | null;
    place_of_work: string | null;
  }
  
  interface investigation {
    investigating_officer: string | null;
    police_station: string | null;
    cr_number: string | null;
    offence: string | null;
    outcome: string | null;
  }
  
  export interface Investigation {
    reporter: reporter;
    complaint: complaint;
    offender: offender;
    investigation: investigation;
  }

export default function EditCasePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [caseDetails, setCaseDetails] = useState<Investigation>()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [userRole, setUserRole] = useState<any>(null)

  useEffect(() => {
    async function fetchCaseDetails() {
      try {
        const inv = await getInvById(params.id)
        // const details = await getCaseById(params.id)
        // const session = await getSession();
        setCaseDetails(inv);
        // console.log(session?.auth?.roles[0])
        // setUserRole(session?.auth?.roles[0]);
      } catch (error) {
        console.error('Failed to fetch case details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCaseDetails()
  }, [params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target
    setCaseDetails((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name: string) => (date: Date | undefined) => {
    setCaseDetails((prev: any) => ({ 
      ...prev, 
      [name]: date ? date.toISOString().split('T')[0] : null 
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
    //   await updateCaseById(params.id, caseDetails)
      router.push(`/trls/work/investigation/${params.id}`)
    } catch (error) {
      console.error('Failed to update case:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!caseDetails) {
    return <div className="flex justify-center items-center h-screen">Case not found</div>
  }

  

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <h1 className="text-3xl font-bold mb-6">Edit Case: {caseDetails.name}</h1> */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Reporter Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <Input
                type="text"
                id="name"
                name="name"
                value={caseDetails.reporter.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">Code</label>
              <Input
                type="text"
                id="code"
                name="code"
                value={caseDetails.code}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="owner" className="block text-sm font-medium text-gray-700">Owner</label>
              <Input
                type="text"
                id="owner"
                name="owner"
                value={caseDetails.owner}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <Input
                type="text"
                id="location"
                name="location"
                value={caseDetails.location}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
  <CardHeader>
    <CardTitle>Asset Details</CardTitle>
  </CardHeader>
  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
      <Select
        name="type"
        value={caseDetails.type}
        onValueChange={(value) => handleInputChange({ target: { name: 'type', value } } as any)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select asset type" />
        </SelectTrigger>
        <SelectContent>
              <SelectItem value="Real Estate">Real Estate</SelectItem>
              <SelectItem value="Vehicle, Plant and Equipment">Vehicle, Plant and Equipment</SelectItem>
              <SelectItem value="Personal Effects">Personal Effects</SelectItem>
              <SelectItem value="Biological Assets">Biological Assets</SelectItem>
              <SelectItem value="Office equipment and furniture">Office equipment and furniture</SelectItem>
              <SelectItem value="Artefacts">Artefacts</SelectItem>
              <SelectItem value="Money">Money</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <label htmlFor="value" className="block text-sm font-medium text-gray-700">Value</label>
      <Input
        type="text"
        id="value"
        name="value"
        value={caseDetails.value}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
      <Select
        name="condition"
        value={caseDetails.condition}
        onValueChange={(value) => handleInputChange({ target: { name: 'condition', value } } as any)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Excellent">Excellent</SelectItem>
          <SelectItem value="Good">Good</SelectItem>
          <SelectItem value="Fair">Fair</SelectItem>
          <SelectItem value="Poor">Poor</SelectItem>
          <SelectItem value="Damaged">Damaged</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div>
      <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
      <Select
        name="status"
        value={caseDetails.status}
        onValueChange={(value) => handleInputChange({ target: { name: 'status', value } } as any)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Pre-Confiscated">Pre-Confiscated</SelectItem>
          <SelectItem value="Confiscated">Confiscated</SelectItem>
          <SelectItem value="Valuation">Valuation</SelectItem>
          <SelectItem value="Disposed">Disposed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </CardContent>
</Card>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="description"
              name="description"
              value={caseDetails.description}
              onChange={handleInputChange}
              rows={3}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Confiscation Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="confiscation_date" className="block text-sm font-medium text-gray-700">Confiscation Date</label>
              <DatePicker
                date={caseDetails.confiscation_date ? new Date(caseDetails.confiscation_date) : undefined}
                setDate={handleDateChange('confiscation_date')}
              />
            </div>

            <div>
              <label htmlFor="case_number" className="block text-sm font-medium text-gray-700">Case Number</label>
              <Input
                type="text"
                id="case_number"
                name="case_number"
                value={caseDetails.case_number}
                onChange={handleInputChange}
              />
            </div>

              <div>
                <label htmlFor="planned_confiscation_date" className="block text-sm font-medium text-gray-700">Planned Confiscation Date</label>
                <DatePicker
                  date={caseDetails.planned_confiscation_date ? new Date(caseDetails.planned_confiscation_date) : undefined}
                  setDate={handleDateChange('planned_confiscation_date')}
                />
              </div>

              <div>
                <label htmlFor="decision" className="block text-sm font-medium text-gray-700">Decision</label>
                <Select
                  name="decision"
                  value={caseDetails.decision}
                  onValueChange={(value) => handleInputChange({ target: { name: 'decision', value } } as any)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Abort-Confiscation">Abort-Confiscation</SelectItem>
                    <SelectItem value="Confiscate">Confiscate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="confiscation_reason" className="block text-sm font-medium text-gray-700">Confiscation Reason</label>
                <Textarea
                  id="confiscation_reason"
                  name="confiscation_reason"
                  value={caseDetails.confiscation_reason}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>

              <div>
                <label htmlFor="decision_reason" className="block text-sm font-medium text-gray-700">Decision Reason</label>
                <Textarea
                  id="decision_reason"
                  name="decision_reason"
                  value={caseDetails.decision_reason}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>

          </CardContent>
        </Card>

        {userRole !== 'record_officer' && <Card>
          <CardHeader>
            <CardTitle>Disposal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="disposal_date" className="block text-sm font-medium text-gray-700">Disposal Date</label>
              <DatePicker
                date={caseDetails.disposal_date ? new Date(caseDetails.disposal_date) : undefined}
                setDate={handleDateChange('disposal_date')}
              />
            </div>
            <div>
              <label htmlFor="disposal_amount" className="block text-sm font-medium text-gray-700">Disposal Amount</label>
              <Input
                type="text"
                id="disposal_amount"
                name="disposal_amount"
                value={caseDetails.disposal_amount}
                onChange={handleInputChange}
              />
            </div>

            <div>
                <label htmlFor="disposal_method" className="block text-sm font-medium text-gray-700">Disposal Method</label>
                <Select
                  name="decision"
                  value={caseDetails.disposal_method}
                  onValueChange={(value) => handleInputChange({ target: { name: 'disposal_method', value } } as any)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Public Auction">Public Auction</SelectItem>
                    <SelectItem value="Trust Fund">Trust Fund</SelectItem>
                    <SelectItem value="Sealed Bid Sale">Sealed Bid Sale</SelectItem>
                    <SelectItem value="Direct Sale">Direct Sale</SelectItem>
                    <SelectItem value="Online Sales">Online Sales</SelectItem>
                    <SelectItem value="Destruction">Destruction</SelectItem>
                    <SelectItem value="Donation">Donation</SelectItem>
                    <SelectItem value="Government Use">Government Use</SelectItem>
                    <SelectItem value="Return to Victim">Return to Victim</SelectItem>
                    <SelectItem value="Lease or Rent">Lease or Rent</SelectItem>
                    <SelectItem value="Share Sale">Share Sale</SelectItem>
                    <SelectItem value="Recycling">Recycling</SelectItem>
                    <SelectItem value="Interagency Transfer">Interagency Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="disposal_reason" className="block text-sm font-medium text-gray-700">Disposal Reason</label>
                <Textarea
                  id="disposal_reason"
                  name="disposal_reason"
                  value={caseDetails.disposal_reason}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>

              <div>
                <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">Recipient</label>
                <Input
                  type="text"
                  id="recipient"
                  name="recipient"
                  value={caseDetails.recipient}
                  onChange={handleInputChange}
                />
            </div>
          </CardContent>
        </Card>}

        {userRole !== 'record_officer' && <Card>
          <CardHeader>
            <CardTitle>Valuation</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="valuation_date" className="block text-sm font-medium text-gray-700">Valuation Date</label>
              <DatePicker
                date={caseDetails.valuation_date ? new Date(caseDetails.valuation_date) : undefined}
                setDate={handleDateChange('valuation_date')}
              />
            </div>
            <div>
              <label htmlFor="valuation_amount" className="block text-sm font-medium text-gray-700">Valuation Amount</label>
              <Input
                type="text"
                id="valuation_amount"
                name="valuation_amount"
                value={caseDetails.valuation_amount}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="initial_assets_costs" className="block text-sm font-medium text-gray-700">Initial Assets Costs</label>
              <Input
                type="text"
                id="initial_assets_costs"
                name="initial_assets_costs"
                value={caseDetails.initial_assets_costs}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="operations_costs" className="block text-sm font-medium text-gray-700">Operations Costs</label>
              <Input
                type="text"
                id="operations_costs"
                name="operations_costs"
                value={caseDetails.operations_costs}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="maintenance_repair_costs" className="block text-sm font-medium text-gray-700">Maintenance Repair Costs</label>
              <Input
                type="text"
                id="maintenance_repair_costs"
                name="maintenance_repair_costs"
                value={caseDetails.maintenance_repair_costs}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="replacement_renewal_costs" className="block text-sm font-medium text-gray-700">Replacement/Renewal Costs</label>
              <Input
                type="text"
                id="replacement_renewal_costs"
                name="replacement_renewal_costs"
                value={caseDetails.replacement_renewal_costs}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="disposal_costs" className="block text-sm font-medium text-gray-700">Disposal Costs</label>
              <Input
                type="text"
                id="disposal_costs"
                name="disposal_costs"
                value={caseDetails.disposal_costs}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="threshhold_amount" className="block text-sm font-medium text-gray-700">Threshold Amount</label>
              <Input
                type="text"
                id="threshhold_amount"
                name="threshhold_amount"
                value={caseDetails.threshhold_amount}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}