'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// import { getCaseById, updateCaseById } from '@/lib/api'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from '@/components/ui/date-picker'
import { getInvRecordById, updateCaseById } from '@/app/lib/actions'
import InfoCard from '@/app/components/InfoCard'
import { FileCheck, FileText, Info, SaveIcon } from 'lucide-react'
import { Investigation } from '@/app/lib/types'
import InfoItem from '@/app/components/InfoItem'


export default function EditCasePage({ params }: { params: { slug: string } }) {

  const router = useRouter()
  const [caseDetails, setCaseDetails] = useState<Investigation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function fetchCaseDetails() {
      try {
        const inv = await getInvRecordById(params.slug)
 
        setCaseDetails(inv)
      } catch (error) {
        console.error('Failed to fetch case details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCaseDetails()
  }, [params.slug])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const [topLevelProperty, nestedProperty] = name.split('.');
  
    setCaseDetails((prev) => {
      if (!prev) return prev;
  
      return {
        ...prev,
        [topLevelProperty]: {
          ...prev[topLevelProperty as keyof Investigation],
          [nestedProperty]: value,
        },
      };
    });
  };

  const handleDateChange = (name: string) => (date: Date | undefined) => {
    const [topLevelProperty, nestedProperty] = name.split('.');
  
    setCaseDetails((prev) => {
      if (!prev) return prev;
  
      return {
        ...prev,
        [topLevelProperty]: {
          ...prev[topLevelProperty as keyof Investigation],
          [nestedProperty]: date ? date.toISOString().split('T')[0] : null,
        },
      };
    });
  };

  const handleSelectChange = (name: string) => (value: string) => {
    const [topLevelProperty, nestedProperty] = name.split('.');
  
    setCaseDetails((prev) => {
      if (!prev) return prev;
  
      return {
        ...prev,
        [topLevelProperty]: {
          ...prev[topLevelProperty as keyof Investigation],
          [nestedProperty]: value,
        },
      };
    });
  };
  
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await updateCaseById(params.slug, caseDetails)
      if(res.code === 200 || res.code === 201){
        router.push(`/trls/work/investigation/${params.slug}`)
      }
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
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <div className="mb-4 flex-shrink-0 shadow-md">
        <div className='flex justify-between'>
          <h1 className="text-3xl font-bold text-gray-800">
            Complaint Information
          </h1>
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} onClick={handleSubmit}>
              <SaveIcon className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
        <div className="mt-2 h-1 w-full bg-blue-400 rounded-full"></div>
      </div>
        <div className='flex-grow overflow-y-auto'>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* <InfoCard title='Reporter Information' icon={<Info className="w-6 h-6 text-blue-500"/>}>
              <div>
                <label htmlFor="reporter.name" className="block text-sm font-medium text-gray-700">Name</label>
                <Input
                  type="text"
                  id="reporter.name"
                  name="reporter.name"
                  value={caseDetails?.reporter.name ?? ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="reporter.Omang_id" className="block text-sm font-medium text-gray-700">Omang</label>
                <Input
                  type="text"
                  id="reporter.Omang_id"
                  name="reporter.Omang_id"
                  value={caseDetails?.reporter.Omang_id ?? ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="passport_no" className="block text-sm font-medium text-gray-700">Passport number</label>
                <Input
                  type="text"
                  id="reporter.passport_no"
                  name="reporter.passport_no"
                  value={caseDetails?.reporter.passport_no ?? ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">Occupation</label>
                <Input
                  type="text"
                  id="reporter.occupation"
                  name="reporter.occupation"
                  value={caseDetails?.reporter.occupation ?? ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="sex" className="block text-sm font-medium text-gray-700">Sex</label>
                <Input
                  type="text"
                  id="reporter.sex"
                  name="reporter.sex"
                  value={caseDetails?.reporter.sex ?? ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">Nationality</label>
                <Input
                  type="text"
                  id="reporter.nationality"
                  name="reporter.nationality"
                  value={caseDetails?.reporter.nationality ?? ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="reporter.address" className="block text-sm font-medium text-gray-700">Address</label>
                <Input
                  type="text"
                  id="reporter.address"
                  name="reporter.address"
                  value={caseDetails?.reporter.address ?? ''}
                  onChange={handleInputChange}
                />
              </div>
            </InfoCard> */}
            <InfoCard title='Reporter Information' icon={<Info className="w-6 h-6 text-blue-500"/>}>
              <InfoItem label="Name" value={caseDetails?.reporter.name}/>
              <InfoItem label="Contact number" value={caseDetails?.reporter.contact_number}/>
              <InfoItem label="Omang" value={caseDetails?.reporter.Omang_id}/>
              <InfoItem label="Occupation" value={caseDetails?.reporter.occupation}/>
              <InfoItem label="Sex" value={caseDetails?.reporter.sex}/>
              <InfoItem label="Nationality" value={caseDetails?.reporter.nationality}/>
              <InfoItem label="Address" value={caseDetails?.reporter.address}/>
              {/* <InfoItem label="Anonymous" value={caseDetails?.reporter.anonymous}/> */}
              <InfoItem label="Status" value={caseDetails?.reporter.reg_status}/>
              <div>
                <label htmlFor="reporter.reg_status" className="block text-sm font-medium text-gray-700">Set New Status</label>
                <Select
                  name="reporter.reg_status"
                  value={caseDetails.reporter.reg_status ?? ''}
                  onValueChange={(value) => handleInputChange({ target: { name: 'reporter.reg_status', value } } as any)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Incoming">Incoming</SelectItem>
                    <SelectItem value="Registered">Registered</SelectItem>
                    <SelectItem value="Under-Review">Under-Review</SelectItem>
                    <SelectItem value="Assessment">Assessment</SelectItem>
                    <SelectItem value="Ongoing-investigation">Ongoing-investigation</SelectItem>
                    <SelectItem value="Complete-investigations">Complete-investigations</SelectItem>
                    <SelectItem value="Recommend for closure">Recommend for closure</SelectItem>
                    <SelectItem value="Recommend for re-investigation">Recommend for re-investigation</SelectItem>
                    <SelectItem value="Recommend for Disciplinary">Recommend for Disciplinary</SelectItem>
                    <SelectItem value="Approve endorsement">Approve endorsement</SelectItem>
                    <SelectItem value="Reject endorsement">Approve endorsement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* <InfoItem label="Inquiry number" value={data.reporter.inquiry_number}/> */}
              {/* <InfoItem label="Case number" value={data.reporter.case_number}/> */}
              <InfoItem label="Submission type" value={caseDetails?.reporter.submission_type}/>
              <InfoItem label="Created At" value={caseDetails?.reporter.created_at}/>
              <InfoItem label="Updated At" value={caseDetails?.reporter.updated_at}/>
            </InfoCard>
            <InfoCard title='Complaint Details' icon={<FileCheck className="w-6 h-6 text-blue-500"/>}>
                <div>
                  <label htmlFor="complaint.nature_of_crime" className="block text-sm font-medium text-gray-700">Nature of crime</label>
                  <Select
                    name="complaint.nature_of_crime"
                    value={caseDetails?.complaint?.nature_of_crime ?? ''}
                    onValueChange={handleSelectChange('complaint.nature_of_crime')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select crime" />
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
                  <label htmlFor="complaint.fir_number" className="block text-sm font-medium text-gray-700">FIR number</label>
                  <Input
                    type="text"
                    id="complaint.fir_number"
                    name="complaint.fir_number"
                    value={caseDetails?.complaint.fir_number ?? ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="complaint.crime_location" className="block text-sm font-medium text-gray-700">Crime location</label>
                  <Input
                    type="text"
                    id="complaint.crime_location"
                    name="complaint.crime_location"
                    value={caseDetails?.complaint.crime_location ?? ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                    <label htmlFor="complaint.date" className="block text-sm font-medium text-gray-700">Date</label>
                    <DatePicker
                      date={caseDetails?.complaint.date ? new Date(caseDetails.complaint.date) : undefined}
                      setDate={handleDateChange('complaint.date')}
                    />
                </div>
                <div>
                  <label htmlFor="complaint.case_number" className="block text-sm font-medium text-gray-700">Case number</label>
                  <Input
                    type="text"
                    id="complaint.case_number"
                    name="complaint.case_number"
                    value={caseDetails?.complaint.case_number ?? ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="complaint.outcome" className="block text-sm font-medium text-gray-700">Outcome</label>
                  <Select
                    name="complaint.outcome"
                    value={caseDetails?.complaint.outcome ?? ''}
                    onValueChange={(value) => handleInputChange({ target: { name: 'complaint.outcome', value } } as any)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select outcome" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
            </InfoCard>

            <InfoCard title='Offender Information' icon={<Info className="w-6 h-6 text-blue-500"/>}>
                <div>
                  <label htmlFor="offender.name" className="block text-sm font-medium text-gray-700">Name</label>
                  <Input
                    type="text"
                    id="offender.name"
                    name="offender.name"
                    value={caseDetails.offender.name ?? ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="id_passport_number" className="block text-sm font-medium text-gray-700">Omang/Passport</label>
                  <Input
                    type="text"
                    id="offender.id_passport_number"
                    name="offender.id_passport_number"
                    value={caseDetails?.offender.id_passport_number ?? ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="offender.age" className="block text-sm font-medium text-gray-700">Age</label>
                  <Input
                    type="text"
                    id="offender.age"
                    name="offender.age"
                    value={caseDetails?.offender.age ?? ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="offender.contact_number" className="block text-sm font-medium text-gray-700">Contact number</label>
                  <Input
                    type="text"
                    id="offender.contact_number"
                    name="offender.contact_number"
                    value={caseDetails?.offender.contact_number ?? ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="offender.sex" className="block text-sm font-medium text-gray-700">Sex</label>
                  <Input
                    type="text"
                    id="offender.sex"
                    name="offender.sex"
                    value={caseDetails?.offender.sex ?? ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">Occupation</label>
                  <Input
                    type="offender.occupation"
                    id="offender.occupation"
                    name="offender.occupation"
                    value={caseDetails?.offender.occupation ?? ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="offender.nationality" className="block text-sm font-medium text-gray-700">Nationality</label>
                  <Input
                    type="text"
                    id="offender.nationality"
                    name="offender.nationality"
                    value={caseDetails?.reporter.nationality ?? ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <Input
                    type="text"
                    id="offender.address"
                    name="offender.address"
                    value={caseDetails?.offender.address ?? ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="ward" className="block text-sm font-medium text-gray-700">Ward</label>
                  <Input
                    type="text"
                    id="offender.ward"
                    name="offender.ward"
                    value={caseDetails?.offender.ward ?? ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="place_of_work" className="block text-sm font-medium text-gray-700">Place of work</label>
                  <Input
                    type="text"
                    id="offender.place_of_work"
                    name="offender.place_of_work"
                    value={caseDetails.offender.place_of_work ?? ''}
                    onChange={handleInputChange}
                  />
                </div>
            </InfoCard>

            <InfoCard title='Investigation Information' icon={<FileText className="w-6 h-6 text-blue-500"/>}>
                <div>
                  <label htmlFor="investigation.investigating_officer" className="block text-sm font-medium text-gray-700">Investigation officer</label>
                  <Input
                    type="text"
                    id="investigation.investigating_officer"
                    name="investigation.investigating_officer"
                    value={caseDetails?.investigation.investigating_officer ?? ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="investigation.police_station" className="block text-sm font-medium text-gray-700">Police station</label>
                  <Input
                    type="text"
                    id="investigation.police_station"
                    name="investigation.police_station"
                    value={caseDetails.investigation.police_station ?? ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="cr_number" className="block text-sm font-medium text-gray-700">CR number</label>
                  <Input
                    type="text"
                    id="investigation.cr_number"
                    name="investigation.cr_number"
                    value={caseDetails?.investigation.cr_number ?? ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="investigation.offence" className="block text-sm font-medium text-gray-700">Offence</label>
                  <Input
                    type="text"
                    id="investigation.offence"
                    name="investigation.offence"
                    value={caseDetails?.investigation.offence ?? ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="investigation.outcome" className="block text-sm font-medium text-gray-700">Outcome</label>
                  <Select
                    name="investigation.outcome"
                    value={caseDetails.investigation.outcome ?? ''}
                    onValueChange={(value) => handleInputChange({ target: { name: 'investigation.outcome', value } } as any)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select outcome" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Incoming">Incoming</SelectItem>
                      <SelectItem value="Registered">Registered</SelectItem>
                      <SelectItem value="Under-Review">Under-Review</SelectItem>
                      <SelectItem value="Assessment">Assessment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
            </InfoCard>
          </form>
        </div>
    </div>
  )
}