'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { fileUploadUrl } from '../lib/store'

export interface UploadResponse {
  bucket: string
  extension: string
  'original-name': string
  key: string
  [k: string]: unknown
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
  compact?: boolean
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
  error,
  compact = false
}) => {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadControllerRef = useRef<AbortController | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      if (uploadControllerRef.current) {
        uploadControllerRef.current.abort()
      }
    }
  }, [])

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
      return `File size must be less than ${maxSize}MB (current: ${formatFileSize(file.size)})`
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    const allowedTypes = acceptedTypes.split(',').map(type => type.trim().toLowerCase())

    if (!allowedTypes.includes(fileExtension)) {
      return `File type "${fileExtension}" not supported. Accepted types: ${acceptedTypes}`
    }

    // Check for empty file
    if (file.size === 0) {
      return 'File appears to be empty'
    }

    return null
  }

  const uploadFile = async (file: File) => {
    // Clear any previous errors
    setUploadError(null)
    
    // Validate file before upload
    const validationError = validateFile(file)
    if (validationError) {
      setUploadError(validationError)
      return
    }

    setUploading(true)
    setUploadProgress(0)

    // Create abort controller for this upload
    uploadControllerRef.current = new AbortController()

    try {
      // Create FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', file.type || 'application/octet-stream')
      formData.append('name', file.name)
      formData.append('description', 'TRLS')

      // Start progress simulation (more conservative)
      progressIntervalRef.current = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 80) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current)
              progressIntervalRef.current = null
            }
            return 80
          }
          return prev + Math.random() * 15 + 5 // More realistic progress increments
        })
      }, 300)

      // Upload file with timeout and abort signal
      const timeoutId = setTimeout(() => {
        if (uploadControllerRef.current) {
          uploadControllerRef.current.abort()
        }
      }, 30000) // 30 second timeout

      const response = await fetch(fileUploadUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData,
        signal: uploadControllerRef.current.signal
      })

      clearTimeout(timeoutId)

      // Clear progress interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
      
      setUploadProgress(100)

      if (!response.ok) {
        let errorMessage = `Upload failed (${response.status})`
        
        try {
          const errorText = await response.text()
          if (errorText) {
            errorMessage += `: ${errorText}`
          }
        } catch {
          // If we can't read the error text, use status-based message
          switch (response.status) {
            case 413:
              errorMessage = `File too large. Maximum size is ${maxSize}MB`
              break
            case 415:
              errorMessage = `File type not supported by server`
              break
            case 500:
              errorMessage = 'Server error occurred during upload'
              break
            case 503:
              errorMessage = 'Upload service temporarily unavailable'
              break
            default:
              errorMessage = `Upload failed with error ${response.status}`
          }
        }
        
        throw new Error(errorMessage)
      }

      const result: UploadResponse = await response.json()

      // Validate response structure
      if (!result || !result['original-name'] || !result.key) {
        throw new Error('Invalid response from upload server')
      }

      // Call onChange with the upload response
      onChange(result)

      // Reset progress after a brief delay
      setTimeout(() => setUploadProgress(0), 1500)
      
    } catch (error) {
      // Clear progress interval on error
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
      
      let errorMessage = 'Upload failed'
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Upload was cancelled or timed out'
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Network error occurred during upload'
        } else {
          errorMessage = error.message
        }
      }
      
      setUploadError(errorMessage)
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
      uploadControllerRef.current = null
    }
  }

  const handleFileSelect = (file: File) => {
    uploadFile(file)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault() // Prevent form submission
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation() // Prevent event bubbling
    setDragOver(false)

    const file = event.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setDragOver(false)
  }

  const removeFile = () => {
    // Cancel any ongoing upload
    if (uploadControllerRef.current) {
      uploadControllerRef.current.abort()
    }
    
    onChange(null)
    setUploadError(null)
    setUploading(false)
    setUploadProgress(0)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation() // Prevent form submission
    }
    fileInputRef.current?.click()
  }

  const handleCardClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    openFileDialog()
  }

  if (compact) {
    return (
      <div className="space-y-1.5">
        {!value && !uploading && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openFileDialog}
            className={`w-full py-5 justify-start ${error || uploadError ? 'border-red-300' : ''}`}
          >
            <Upload className="h-4 w-4 mr-2" />
            <span className="text-sm">{label}</span>
            {required && <span className="text-red-500 ml-1">*</span>}
          </Button>
        )}

        {uploading && (
          <div className="border rounded-md p-2">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <Progress value={uploadProgress} className="h-1" />
                <p className="text-xs text-gray-500 mt-1">Uploading... {Math.round(uploadProgress)}%</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="h-6 w-6 p-0 flex-shrink-0"
                title="Cancel upload"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {value && !uploading && (
          <div className="border rounded-md p-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <p className="text-sm truncate" title={value['original-name']}>
                  {value['original-name']}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-gray-500 hover:text-red-500 h-6 w-6 p-0 flex-shrink-0"
                title="Remove file"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {(uploadError || error) && (
          <p className="text-xs text-red-500">{uploadError || error}</p>
        )}

        <Input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={handleInputChange}
          className="hidden"
          id={name}
        />
      </div>
    )
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
          } ${error || uploadError ? 'border-red-300' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleCardClick}
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Uploading... {Math.round(uploadProgress)}%</p>
                  <Progress value={uploadProgress} className="mt-2" />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-gray-500 hover:text-red-500 ml-2"
                title="Cancel upload"
              >
                <X className="h-4 w-4" />
              </Button>
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
                  <p className="text-sm font-medium" title={value['original-name']}>
                    {value['original-name']}
                  </p>
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
                title="Remove file"
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