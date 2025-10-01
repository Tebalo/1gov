import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import FileUpload from './file-upload'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


interface UploadResponse {
  bucket: string
  extension: string
  'original-name': string
  key: string
}

interface FileUploadProps {
  name: string
  label: string
  value?: UploadResponse | null
  onChange: (value: UploadResponse | null) => void
  error?: string
}

const SimpleFileUpload: React.FC<FileUploadProps> = ({ name, label, value, onChange, error }) => {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    
    // Simulate file upload - replace with your actual upload logic
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate delay
      
      const mockResponse: UploadResponse = {
        bucket: "MESD_006_28_001",
        extension: file.name.split('.').pop() || 'pdf',
        'original-name': file.name,
        key: Math.random().toString(36).substr(2, 9)
      }
      
      onChange(mockResponse)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {!value ? (
        <Input
          id={name}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={handleFileChange}
          disabled={uploading}
        />
      ) : (
        <div className="flex items-center justify-between p-2 border rounded">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">{value['original-name']}</span>
            <Badge variant="secondary">{value.extension.toUpperCase()}</Badge>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(null)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
      {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

// Main Qualifications Table Component
export interface QualificationEntry {
  id: string
  level?: string
  alt_qualification: string
  alt_qualification_year: string
  institution?: string
  major_subjects?: string
  alt_attachments: UploadResponse | null
}

interface QualificationsTableProps {
  qualifications: QualificationEntry[]
  onChange: (qualifications: QualificationEntry[]) => void
  error?: string
}

const QualificationsTable: React.FC<QualificationsTableProps> = ({
  qualifications,
  onChange,
  error
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQualification, setEditingQualification] = useState<QualificationEntry | null>(null)
  const [formData, setFormData] = useState({
    // level: '',
    // institution: '',
    // major_subjects: '',
    alt_qualification: '',
    alt_qualification_year: '',
    alt_attachments: null as UploadResponse | null
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const resetForm = () => {
    setFormData({
      // level: '',
      // institution: '',
      // major_subjects: '',
      alt_qualification: '',
      alt_qualification_year: '',
      alt_attachments: null
    })
    setFormErrors({})
    setEditingQualification(null)
  }

  const openDialog = (qualification?: QualificationEntry) => {
    if (qualification) {
      setEditingQualification(qualification)
      setFormData({
        // level: qualification.level || '',
        // institution: qualification.institution || '',
        // major_subjects: qualification.major_subjects || '',
        alt_qualification: qualification.alt_qualification,
        alt_qualification_year: qualification.alt_qualification_year,
        alt_attachments: qualification.alt_attachments
      })
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.alt_qualification.trim()) {
      errors.alt_qualification = 'Qualification name is required'
    }

    if (!formData.alt_qualification_year.trim()) {
      errors.alt_qualification_year = 'Qualification year is required'
    } else {
      const year = parseInt(formData.alt_qualification_year)
      const currentYear = new Date().getFullYear()
      if (year < 1950 || year > currentYear) {
        errors.alt_qualification_year = `Year must be between 1950 and ${currentYear}`
      }
    }

    if (!formData.alt_attachments) {
      errors.alt_attachments = 'Qualification certificate is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    const newQualification: QualificationEntry = {
      id: editingQualification?.id || Date.now().toString(),
      alt_qualification: formData.alt_qualification.trim(),
      alt_qualification_year: formData.alt_qualification_year.trim(),
      // level: formData.level,
      // institution: formData.institution,
      // major_subjects: formData.major_subjects,
      alt_attachments: formData.alt_attachments!
    }

    let updatedQualifications: QualificationEntry[]

    if (editingQualification) {
      // Update existing qualification
      updatedQualifications = qualifications.map(q =>
        q.id === editingQualification.id ? newQualification : q
      )
    } else {
      // Add new qualification
      updatedQualifications = [...qualifications, newQualification]
    }

    onChange(updatedQualifications)
    closeDialog()
  }

  const handleDelete = (id: string) => {
    const updatedQualifications = qualifications.filter(q => q.id !== id)
    onChange(updatedQualifications)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleAttachmentChange = (attachment: UploadResponse | null) => {
    setFormData(prev => ({ ...prev, alt_attachments: attachment }))
    if (formErrors.alt_attachments) {
      setFormErrors(prev => ({ ...prev, alt_attachments: '' }))
    }
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl text-gray-900">
              Additional Qualifications
            </CardTitle>
            <CardDescription className="mt-1 text-sm sm:text-base text-gray-600 pr-4 sm:pr-0">
              Add any additional qualifications, certifications, or training you have completed.
            </CardDescription>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => openDialog()}
                className="w-full sm:w-auto h-11 sm:h-10 flex items-center justify-center gap-2 text-base sm:text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                <span className="sm:hidden">Add New Qualification</span>
                <span className="hidden sm:inline">Add Qualification</span>
              </Button>
            </DialogTrigger>
            
            <DialogContent className="mx-4 sm:mx-0 sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader className="pb-4">
                <DialogTitle className="text-lg sm:text-xl">
                  {editingQualification ? 'Edit Qualification' : 'Add New Qualification'}
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base text-gray-600">
                  Enter the details of your qualification and upload the certificate.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* <div className="space-y-2">
                  <Label htmlFor="level" className="text-sm font-medium text-gray-700">
                    Teaching Qualification Level <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    onValueChange={(value) => handleInputChange('level', value)}
                    value={formData.level }
                  >
                    <SelectTrigger className={`h-11 text-base ${formErrors.level ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}>
                      <SelectValue placeholder="e.g., Diploma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Certificate'>Certificate</SelectItem>
                      <SelectItem value='Diploma'>Diploma</SelectItem>
                      <SelectItem value='Post-Graduate Diploma'>Post-Graduate Diploma</SelectItem>
                      <SelectItem value="Bachelor's Degree">Bachelor&lsquo;s Degree</SelectItem>
                      <SelectItem value="Bachelor's Degree Honours">Bachelor&lsquo;s Degree Honours</SelectItem>
                      <SelectItem value="Master's Degree">Master&lsquo;s Degree</SelectItem>
                      <SelectItem value="Doctoral Degree">Doctoral Degree</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.level && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="text-xs">⚠</span>
                      {formErrors.level}
                    </p>
                  )}
                </div> */}
 
                {/* <div className="space-y-2">
                  <Label htmlFor="institution" className="text-sm font-medium text-gray-700">
                    Institution <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => handleInputChange('institution', e.target.value)}
                    placeholder="e.g., BAC"
                    className={`h-11 text-base ${formErrors.institution ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  />
                  {formErrors.institution && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="text-xs">⚠</span>
                      {formErrors.institution}
                    </p>
                  )}
                </div> */}

                {/* <div className="space-y-2">
                  <Label htmlFor="major_subjects" className="text-sm font-medium text-gray-700">
                    Subject Specialization  <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="major_subjects"
                    value={formData.major_subjects}
                    onChange={(e) => handleInputChange('major_subjects', e.target.value)}
                    placeholder="e.g., Economics"
                    className={`h-11 text-base ${formErrors.major_subjects ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  />
                  {formErrors.major_subjects && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="text-xs">⚠</span>
                      {formErrors.major_subjects}
                    </p>
                  )}
                </div> */}

                <div className="space-y-2">
                  <Label htmlFor="qualification" className="text-sm font-medium text-gray-700">
                    Qualification Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="qualification"
                    value={formData.alt_qualification}
                    onChange={(e) => handleInputChange('alt_qualification', e.target.value)}
                    placeholder="e.g., Bachelor of Science in Education"
                    className={`h-11 text-base ${formErrors.alt_qualification ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  />
                  {formErrors.alt_qualification && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="text-xs">⚠</span>
                      {formErrors.alt_qualification}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year" className="text-sm font-medium text-gray-700">
                    Year Completed <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="year"
                    type="number"
                    inputMode="numeric"
                    min="1950"
                    max={new Date().getFullYear()}
                    value={formData.alt_qualification_year}
                    onChange={(e) => handleInputChange('alt_qualification_year', e.target.value)}
                    placeholder="e.g., 2020"
                    className={`h-11 text-base ${formErrors.alt_qualification_year ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                  />
                  {formErrors.alt_qualification_year && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="text-xs">⚠</span>
                      {formErrors.alt_qualification_year}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Qualification Certificate <span className="text-red-500">*</span>
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                    {/* <SimpleFileUpload
                      name="qualification_cert"
                      label="Qualification Certificate"
                      value={formData.alt_attachments}
                      onChange={handleAttachmentChange}
                      error={formErrors.alt_attachments}
                    /> */}
                    <FileUpload
                      name="qualification_cert"
                      label="Qualification Certificate"
                      description="Qualification certificate"
                      acceptedTypes=".pdf,.jpg,.jpeg,.png"
                      maxSize={5}
                      required={true}
                      value={formData.alt_attachments}
                      onChange={handleAttachmentChange}
                      error={formErrors.alt_attachments}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-6 flex flex-col-reverse sm:flex-row gap-3 sm:gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={closeDialog}
                  className="w-full sm:w-auto h-11 sm:h-10 text-base sm:text-sm"
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleSave}
                  className="w-full sm:w-auto h-11 sm:h-10 text-base sm:text-sm font-medium"
                >
                  {editingQualification ? 'Update' : 'Add'} Qualification
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Mobile progress indicator */}
        <div className="block sm:hidden mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Step 4: Qualifications</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Optional Section
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {qualifications.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <FileText className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-base sm:text-lg font-medium mb-2">No additional qualifications added yet.</p>
            <p className="text-sm text-gray-400">Click &quot;Add Qualification&quot; to get started.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View - Hidden on mobile */}
            <div className="hidden md:block rounded-md border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Qualification</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Year</th>
                    {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Specialization</th> */}
                    {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Institution</th>                    */}
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Qualification Attachment</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 w-[100px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {qualifications.map((qualification) => (
                    <tr key={qualification.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {qualification.alt_qualification}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{qualification.alt_qualification_year}</td>
                      {/* <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {qualification.institution}
                      </td> */}
                      {/* <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {qualification.major_subjects}
                      </td> */}
                      <td className="px-4 py-3 text-sm">
                        {qualification.alt_attachments ? (
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-green-600" />
                            <span className="text-sm">
                              {qualification.alt_attachments['original-name']}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {qualification.alt_attachments.extension.toUpperCase()}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-red-500 text-sm">No certificate</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDialog(qualification)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(qualification.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View - Hidden on desktop */}
            <div className="md:hidden space-y-4">
              {qualifications.map((qualification, index) => (
                <div 
                  key={qualification.id} 
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Header with qualification name and actions */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {qualification.alt_qualification}
                      </h3>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1 ml-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog(qualification)}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit qualification</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(qualification.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete qualification</span>
                      </Button>
                    </div>
                  </div>

                  {/* Qualification details */}
                  <div className="space-y-3">
                    {/* Year */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Year Completed
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {qualification.alt_qualification_year}
                      </span>
                    </div>

                    {/* Certificate Status */}
                    <div className="border-t border-gray-100 pt-3">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
                        Certificate
                      </span>
                      {qualification.alt_attachments ? (
                        <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-md border border-green-200">
                          <FileText className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-green-800 truncate">
                              {qualification.alt_attachments['original-name']}
                            </p>
                            <div className="flex items-center mt-1">
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                {qualification.alt_attachments.extension.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-md border border-red-200">
                          <div className="h-4 w-4 rounded-full bg-red-500 flex-shrink-0"></div>
                          <span className="text-sm font-medium text-red-700">
                            No certificate uploaded
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary for mobile */}
            <div className="md:hidden mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800">
                  Total Qualifications
                </span>
                <span className="text-lg font-bold text-blue-900">
                  {qualifications.length}
                </span>
              </div>
            </div>
          </>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
export default QualificationsTable