import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, FileText, AlertCircle, CheckCircle } from 'lucide-react'


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
  alt_qualification: string
  alt_qualification_year: string
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
    alt_qualification: '',
    alt_qualification_year: '',
    alt_attachments: null as UploadResponse | null
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const resetForm = () => {
    setFormData({
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
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Additional Qualifications</CardTitle>
            <CardDescription>
              Add any additional qualifications, certifications, or training you have completed.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Qualification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingQualification ? 'Edit Qualification' : 'Add New Qualification'}
                </DialogTitle>
                <DialogDescription>
                  Enter the details of your qualification and upload the certificate.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="qualification">Qualification Name *</Label>
                  <Input
                    id="qualification"
                    value={formData.alt_qualification}
                    onChange={(e) => handleInputChange('alt_qualification', e.target.value)}
                    placeholder="e.g., Bachelor of Science in Education"
                    className={formErrors.alt_qualification ? 'border-red-500' : ''}
                  />
                  {formErrors.alt_qualification && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.alt_qualification}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="year">Year Completed *</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1950"
                    max={new Date().getFullYear()}
                    value={formData.alt_qualification_year}
                    onChange={(e) => handleInputChange('alt_qualification_year', e.target.value)}
                    placeholder="e.g., 2020"
                    className={formErrors.alt_qualification_year ? 'border-red-500' : ''}
                  />
                  {formErrors.alt_qualification_year && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.alt_qualification_year}</p>
                  )}
                </div>

                <SimpleFileUpload
                  name="qualification_cert"
                  label="Qualification Certificate *"
                  value={formData.alt_attachments}
                  onChange={handleAttachmentChange}
                  error={formErrors.alt_attachments}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSave}>
                  {editingQualification ? 'Update' : 'Add'} Qualification
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {qualifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No additional qualifications added yet.</p>
            <p className="text-sm">Click &quot;Add Qualification&quot; to get started.</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Qualification</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Year</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Certificate</th>
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
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

// Example usage component
const ExampleUsage = () => {
  const [qualifications, setQualifications] = useState<QualificationEntry[]>([])

  const handleQualificationsChange = (newQualifications: QualificationEntry[]) => {
    setQualifications(newQualifications)
    console.log('Updated qualifications:', newQualifications)
  }

  // Convert to API format
  const getAPIFormatQualifications = () => {
    return qualifications
      .filter(q => q.alt_attachments) // Only include qualifications with attachments
      .map(q => ({
        alt_qualification: q.alt_qualification,
        alt_qualification_year: q.alt_qualification_year,
        alt_attachments: q.alt_attachments!
      }))
  }

  return (
    <div className="max-w-7xl mx-auto  space-y-6">
      <QualificationsTable
        qualifications={qualifications}
        onChange={handleQualificationsChange}
      />

      {/* Debug output */}
      {/* <Card>
        <CardHeader>
          <CardTitle>API Format Output</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto">
            {JSON.stringify(getAPIFormatQualifications(), null, 2)}
          </pre>
        </CardContent>
      </Card> */}
    </div>
  )
}

export default QualificationsTable