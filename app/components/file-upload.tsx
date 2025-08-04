import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { fileUploadUrl } from '../lib/store'

interface UploadResponse {
  bucket: string
  extension: string
  'original-name': string
  key: string
}

interface FileUploadProps {
  name: string
  label: string
  description?: string
  acceptedTypes?: string
  maxSize?: number // in MB
  required?: boolean
  value?: UploadResponse | null
  onChange: (value: UploadResponse | null) => void
  error?: string
}

const FileUpload: React.FC<FileUploadProps> = ({
  name,
  label,
  description,
  acceptedTypes = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
  maxSize = 10,
  required = false,
  value,
  onChange,
  error
}) => {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    const allowedTypes = acceptedTypes.split(',').map(type => type.trim().toLowerCase())
    
    if (!allowedTypes.includes(fileExtension)) {
      return `File type not allowed. Accepted types: ${acceptedTypes}`
    }

    return null
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    setUploadProgress(0)
    setUploadError(null)

    try {
      const validationError = validateFile(file)
      if (validationError) {
        throw new Error(validationError)
      }
      
      // Create FormData EXACTLY like their working code
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'document')
      formData.append('name', file.name)
      formData.append('description', description || `${label} - ${file.name}`)
      // Don't append sessionId - handle it in the route
      
      // Progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData, // Send directly like their code
      })
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText)
      }
      
      const result = await response.json()
      onChange(result)
      
      setTimeout(() => setUploadProgress(0), 1000)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setUploadError(errorMessage)
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (file: File) => {
    uploadFile(file)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragOver(false)
    
    const file = event.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragOver(false)
  }

  const removeFile = () => {
    onChange(null)
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      
      {!value && !uploading && (
        <Card 
          className={`border-2 border-dashed transition-colors cursor-pointer hover:border-primary/50 ${
            dragOver ? 'border-primary bg-primary/5' : 'border-gray-300'
          } ${error ? 'border-red-300' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Upload className="h-10 w-10 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              {acceptedTypes} (max {maxSize}MB)
            </p>
          </CardContent>
        </Card>
      )}

      {uploading && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Uploading...</p>
                <Progress value={uploadProgress} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {value && !uploading && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-green-100">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{value['original-name']}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {value.extension.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Uploaded successfully
                    </span>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {(uploadError || error) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {uploadError || error}
          </AlertDescription>
        </Alert>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleInputChange}
        className="hidden"
        id={name}
      />

      {description && !error && !uploadError && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  )
}

export default FileUpload

// Example usage in your form:
const ExampleForm = () => {
  const [nationalIdDocument, setNationalIdDocument] = useState<UploadResponse | null>(null)
  const [qualificationDocument, setQualificationDocument] = useState<UploadResponse | null>(null)

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">Document Upload Example</h2>
      
      <FileUpload
        name="national_id"
        label="National ID Copy"
        description="Upload a clear copy of your National ID"
        acceptedTypes=".pdf,.jpg,.jpeg,.png"
        maxSize={5}
        required={true}
        value={nationalIdDocument}
        onChange={setNationalIdDocument}
      />

      <FileUpload
        name="qualification"
        label="Qualification Certificate"
        description="Upload your qualification certificate"
        acceptedTypes=".pdf,.jpg,.jpeg,.png"
        maxSize={10}
        required={false}
        value={qualificationDocument}
        onChange={setQualificationDocument}
      />

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Upload Results:</h3>
        <pre className="text-xs text-gray-600">
          {JSON.stringify({ nationalIdDocument, qualificationDocument }, null, 2)}
        </pre>
      </div>
    </div>
  )
}