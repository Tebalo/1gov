'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from '@/components/ui/date-picker'
import InfoCard from '@/app/components/InfoCard'
import { ClipboardCheck, FileCheck, FileText, Info, SaveIcon } from 'lucide-react'
import { createComplaint } from '@/app/lib/actions'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import InfoCardTwo from '@/app/components/InfoCardTwoColumn'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Reporter {
  name: string;
  contact_number: string;
  Omang_id: string;
  passport_no: string;
  occupation: string;
  sex: string;
  anonymous: boolean;
  submission_type: string;
  nationality: string;
  address: string;
}

interface Complaint {
  crime_location: string;
  nature_of_crime: string;
  date: string;
  time: string;
  bif_number: string;
  case_number: string;
  fir_number: string;
  outcome: string;
}

interface Offender {
  name: string;
  sex: string;
  nationality: string;
  dob: string;
  age: number;
  contact_number: string;
  id_passport_number: string;
  address: string;
  ward: string;
  occupation: string;
  place_of_work: string;
}

interface Investigation {
  investigating_officer: string;
  police_station: string;
  cr_number: string;
  offence: string;
  outcome: string;
}

interface InvestigationRecord {
  reporter: Reporter;
  complaint: Complaint;
  offender: Offender;
  investigation: Investigation;
}

const initialState: InvestigationRecord = {
  reporter: {
    name: 'Bopaki Tebalo',
    contact_number: '123456789',
    Omang_id: '440418213',
    passport_no: 'P123456',
    occupation: 'Engineer',
    sex: 'Male',
    submission_type: '',
    anonymous: false,
    nationality: 'Botswana',
    address: '123 Main Street'
  },
  complaint: {
    crime_location: 'Gaborone',
    nature_of_crime: 'Theft',
    date: '2024-10-01',
    time: '14:00',
    bif_number: 'BIF123456',
    case_number: 'CASE789',
    fir_number: 'FIR456',
    outcome: 'Pending'
  },
  offender: {
    name: 'Jane Smith',
    sex: 'Female',
    nationality: 'Botswana',
    dob: '1990-01-01',
    age: 34,
    contact_number: '987654321',
    id_passport_number: 'ID987654',
    address: '456 Side Street',
    ward: 'Ward 1',
    occupation: 'Teacher',
    place_of_work: 'XYZ School'
  },
  investigation: {
    investigating_officer: 'Officer Brown',
    police_station: 'Gaborone Police Station',
    cr_number: 'CR123456',
    offence: 'Theft',
    outcome: 'Under investigation'
  }
}

interface Case {
  message: string;
  success: boolean;
  inquiry_number: string;
  case_number: string | null;
}

export default function CreateCasePage() {
  const router = useRouter()
  const [caseDetails, setCaseDetails] = useState<InvestigationRecord>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('');
  const [showErrorDialog, setShowErrorDialog] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const [topLevelProperty, nestedProperty] = name.split('.');
  
    setCaseDetails((prev) => ({
      ...prev,
      [topLevelProperty]: {
        ...prev[topLevelProperty as keyof InvestigationRecord],
        [nestedProperty]: value,
      },
    }));
  };

  const handleDateChange = (name: string) => (date: Date | undefined) => {
    const [topLevelProperty, nestedProperty] = name.split('.');
  
    setCaseDetails((prev) => ({
      ...prev,
      [topLevelProperty]: {
        ...prev[topLevelProperty as keyof InvestigationRecord],
        [nestedProperty]: date ? date.toISOString().split('T')[0] : '',
      },
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    const [topLevelProperty, nestedProperty] = name.split('.');
  
    setCaseDetails((prev) => ({
      ...prev,
      [topLevelProperty]: {
        ...prev[topLevelProperty as keyof InvestigationRecord],
        [nestedProperty]: value,
      },
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(''); // Assuming you have an error state

    try {
        console.log('Submitting case details:', caseDetails);
        
        const res = await createComplaint(caseDetails);

        if (res.success && (res.code === 200 || res.code === 201)) {
            if (res.data) {
                const result = res.data as Case;

                if (result.inquiry_number) {

                    router.push(`/trls/work/investigation/${result.inquiry_number}`);
                } else {
                    setError('No inquiry number received from server, but the record was created successfully!');
                    setShowErrorDialog(true);
                    // router.push(`/trls/work`);
                }
            } else {
                setError('No data received from server, but the record was created successfully!');
                setShowErrorDialog(true);
                //router.push(`/trls/work`);
            }
        } else {
            setError(res.message || 'Failed to create case');
            setShowErrorDialog(true);
        }
    } catch (error) {
        const errorMessage = error instanceof Error 
            ? error.message 
            : 'An unexpected error occurred while creating the case';
        console.error('Failed to create case:', error);
        setError(errorMessage);
        setShowErrorDialog(true);
    } finally {
        setIsSubmitting(false);
    }
  };

  const clearReporterDetails = (): Reporter => {
    return {
      name: '',
      contact_number: '',
      Omang_id: '',      // This was missing
      passport_no: '',
      occupation: '',
      sex: '',
      submission_type: caseDetails.reporter.submission_type,
      anonymous: true,
      nationality: '',
      address: ''
    }
  }


  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
        <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Error</AlertDialogTitle>
              <AlertDialogDescription>
                {error}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
                Close
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      <div className="mb-4 flex-shrink-0 shadow-md">
        <div className='flex justify-between'>
          <h1 className="text-3xl font-bold text-gray-800">
            Create New Investigation
          </h1>
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
              <SaveIcon className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </div>
        <div className="mt-2 h-1 w-full bg-blue-400 rounded-full"></div>
      </div>
      <div className='flex-grow overflow-y-auto'>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* {error && (
              <div className="text-red-500 mb-4">
                  {error}
              </div>
          )} */}
          {/* Preliminary Details */}
          <InfoCardTwo title='Preliminary Details' icon={<ClipboardCheck className="w-6 h-6 text-blue-500"/>}>
          <div className="space-y-6">
            <div className="items-top flex space-x-3 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
              <Checkbox 
                id="anonymous"
                checked={caseDetails.reporter.anonymous === true}
                onCheckedChange={(checked) => {
                  setCaseDetails(prev => ({
                    ...prev,
                    reporter: checked ? clearReporterDetails() : initialState.reporter
                  }))
                }}
                className='mt-1'
              />
              <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="reporter.anonymous"
                    className="tblock text-sm font-medium text-gray-700"
                  >
                    Anonymous Submission
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Choose this if you wish to submit anonymously
                  </p>
                </div>
              </div>
            </div>

            <div className=''>
                <label 
                  htmlFor="reporter.submission_type" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                  >
                  Submission Type
                </label>
                  <RadioGroup 
                    defaultValue={caseDetails.reporter.submission_type}
                    onValueChange={(value) => {
                      handleInputChange({
                        target: {
                          name: 'reporter.submission_type',
                          value: value
                        }
                      } as any)
                    }}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Walk-In" id="walk-in" />
                      <Label htmlFor="walk-in">Walk-In</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Online" id="online" />
                      <Label htmlFor="online">Online</Label>
                    </div>
                  </RadioGroup>
            </div>
          </InfoCardTwo>
          {/* Reporter Information */}
          {caseDetails.reporter.anonymous === false  && 
          <InfoCard title='Reporter Information' icon={<Info className="w-6 h-6 text-blue-500"/>}>
            <div>
              <label htmlFor="reporter.name" className="block text-sm font-medium text-gray-700">Name</label>
              <Input
                type="text"
                id="reporter.name"
                name="reporter.name"
                value={caseDetails.reporter.name}
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
                  value={caseDetails?.reporter.Omang_id}
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
                value={caseDetails?.reporter.passport_no}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">Occupation</label>
              <Input
                type="text"
                id="reporter.occupation"
                name="reporter.occupation"
                value={caseDetails?.reporter.occupation}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="sex" className="block text-sm font-medium text-gray-700">Sex</label>
              <Input
                type="text"
                id="reporter.sex"
                name="reporter.sex"
                value={caseDetails?.reporter.sex}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">Nationality</label>
              <Input
                type="text"
                id="reporter.nationality"
                name="reporter.nationality"
                value={caseDetails?.reporter.nationality}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="reporter.address" className="block text-sm font-medium text-gray-700">Address</label>
              <Input
                type="text"
                id="reporter.address"
                name="reporter.address"
                value={caseDetails?.reporter.address}
                onChange={handleInputChange}
              />
            </div>
          </InfoCard>}

          {/* Complaint Details */}
          
          <InfoCard title='Complaint Details' icon={<FileCheck className="w-6 h-6 text-blue-500"/>}>
            <div>
              <label htmlFor="complaint.nature_of_crime" className="block text-sm font-medium text-gray-700">Nature of crime</label>
              <Select
                name="complaint.nature_of_crime"
                value={caseDetails.complaint.nature_of_crime}
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
                    value={caseDetails?.complaint.fir_number}
                    onChange={handleInputChange}
                  />
            </div>
            <div>
              <label htmlFor="complaint.crime_location" className="block text-sm font-medium text-gray-700">Crime location</label>
              <Input
                type="text"
                id="complaint.crime_location"
                name="complaint.crime_location"
                value={caseDetails?.complaint.crime_location}
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
                value={caseDetails?.complaint.case_number}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="complaint.outcome" className="block text-sm font-medium text-gray-700">Outcome</label>
              <Select
                name="complaint.outcome"
                value={caseDetails?.complaint.outcome}
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

          {/* Offender Information */}
          <InfoCard title='Offender Information' icon={<Info className="w-6 h-6 text-blue-500"/>}>
            <div>
              <label htmlFor="offender.name" className="block text-sm font-medium text-gray-700">Name</label>
              <Input
                type="text"
                id="offender.name"
                name="offender.name"
                value={caseDetails.offender.name}
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
                    value={caseDetails?.offender.id_passport_number}
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
                value={caseDetails?.offender.age}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="offender.contact_number" className="block text-sm font-medium text-gray-700">Contact number</label>
              <Input
                type="text"
                id="offender.contact_number"
                name="offender.contact_number"
                value={caseDetails?.offender.contact_number}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="offender.sex" className="block text-sm font-medium text-gray-700">Sex</label>
              <Input
                type="text"
                id="offender.sex"
                name="offender.sex"
                value={caseDetails?.offender.sex}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">Occupation</label>
              <Input
                type="offender.occupation"
                id="offender.occupation"
                name="offender.occupation"
                value={caseDetails?.offender.occupation}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="offender.nationality" className="block text-sm font-medium text-gray-700">Nationality</label>
              <Input
                type="text"
                id="offender.nationality"
                name="offender.nationality"
                value={caseDetails?.reporter.nationality}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <Input
                type="text"
                id="offender.address"
                name="offender.address"
                value={caseDetails?.offender.address}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="ward" className="block text-sm font-medium text-gray-700">Ward</label>
              <Input
                type="text"
                id="offender.ward"
                name="offender.ward"
                value={caseDetails?.offender.ward}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="place_of_work" className="block text-sm font-medium text-gray-700">Place of work</label>
              <Input
                type="text"
                id="offender.place_of_work"
                name="offender.place_of_work"
                value={caseDetails.offender.place_of_work}
                onChange={handleInputChange}
              />
            </div>
          </InfoCard>

          {/* Investigation Information */}
          <InfoCard title='Investigation Information' icon={<FileText className="w-6 h-6 text-blue-500"/>}>
            <div>
              <label htmlFor="investigation.investigating_officer" className="block text-sm font-medium text-gray-700">Investigation officer</label>
              <Input
                type="text"
                id="investigation.investigating_officer"
                name="investigation.investigating_officer"
                value={caseDetails.investigation.investigating_officer}
                onChange={handleInputChange}
                
              />
            </div>
            <div>
              <label htmlFor="investigation.police_station" className="block text-sm font-medium text-gray-700">Police station</label>
              <Input
                type="text"
                id="investigation.police_station"
                name="investigation.police_station"
                value={caseDetails.investigation.police_station}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="cr_number" className="block text-sm font-medium text-gray-700">CR number</label>
              <Input
                type="text"
                id="investigation.cr_number"
                name="investigation.cr_number"
                value={caseDetails?.investigation.cr_number}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="investigation.offence" className="block text-sm font-medium text-gray-700">Offence</label>
              <Input
                type="text"
                id="investigation.offence"
                name="investigation.offence"
                value={caseDetails?.investigation.offence}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="investigation.outcome" className="block text-sm font-medium text-gray-700">Outcome</label>
              <Select
                name="investigation.outcome"
                value={caseDetails.investigation.outcome}
                onValueChange={(value) => handleInputChange({ target: { name: 'investigation.outcome', value } } as any)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Under investigation">Under Investigation</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </InfoCard>
        </form>
      </div>
    </div>
  )
}