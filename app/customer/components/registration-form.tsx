"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
// import { toast } from "sonner"
import Image from 'next/image';
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface RegistrationFormProps extends React.HTMLAttributes<HTMLDivElement> {}

interface ApiError {
  username?: string[]
  email?: string[]
  password?: string[]
  [key: string]: string[] | undefined
}

const STEPS = [
  { id: 1, title: "Account", description: "Basic credentials" },
  { id: 2, title: "Personal", description: "Personal information" },
  { id: 3, title: "Contact", description: "Contact details" },
  { id: 4, title: "Professional", description: "Work & social info" },
  { id: 5, title: "Review", description: "Review & submit" }
]

export function RegistrationForm({ className, ...props }: RegistrationFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<string[]>([])
  const [fieldErrors, setFieldErrors] = useState<ApiError>({})
  const [formData, setFormData] = useState({
    // Basic credentials
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    
    // Personal Information
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    bio: "",
    nationalId: "",
    passportId: "",
    nextOfKinName: "",
    nextOfKinRelation: "",
    nextOfKinContacts: "",
    
    // Contact Information
    phone: "",
    altPhone: "",
    postalAddress: "",
    physicalAddress: "",
    city: "",
    state: "",
    country: "Botswana",
    postalCode: "",
    
    // Social Information
    linkedinUrl: "",
    githubUrl: "",
    websiteUrl: "",
    jobTitle: "",
    organization: "",
    
    // Preferences
    preferredLanguage: "en",
    timezone: "Africa/Gaborone",
    
    // Terms and conditions
    agreeToTerms: false,
    agreeToNewsletter: false
  })

  const { toast } = useToast();

  const validateStep = (step: number): boolean => {
    setErrors([])
    setFieldErrors({})
    
    switch (step) {
      case 1: // Account credentials
        const stepOneErrors: string[] = []
        if (!formData.username.trim()) stepOneErrors.push("Username is required")
        if (!formData.email.trim()) stepOneErrors.push("Email is required")
        if (!formData.password.trim()) stepOneErrors.push("Password is required")
        if (formData.password.length < 8) stepOneErrors.push("Password must be at least 8 characters long")
        if (formData.password !== formData.confirmPassword) stepOneErrors.push("Passwords do not match")
        
        if (stepOneErrors.length > 0) {
          setErrors(stepOneErrors)
          return false
        }
        return true

      case 2: // Personal information
        const stepTwoErrors: string[] = []
        if (!formData.firstName.trim()) stepTwoErrors.push("First name is required")
        if (!formData.lastName.trim()) stepTwoErrors.push("Last name is required")
        if (!formData.dateOfBirth.trim()) stepTwoErrors.push("Date of birth is required")
        if (!formData.gender.trim()) stepTwoErrors.push("Gender is required")
        if (!formData.nationalId.trim()) stepTwoErrors.push("National ID is required")
        
        if (stepTwoErrors.length > 0) {
          setErrors(stepTwoErrors)
          return false
        }
        return true

      case 3: // Contact information
        return true

      case 4: // Professional information
        const stepFourErrors: string[] = []
        
        // Optional validation for URLs
        if(formData.linkedinUrl && formData.linkedinUrl.length > 0 && !formData.linkedinUrl.includes("http")) { 
          stepFourErrors.push("LinkedIn URL must start with http or https")
        }
        if(formData.githubUrl && formData.githubUrl.length > 0 && !formData.githubUrl.includes("http")) {
          stepFourErrors.push("GitHub URL must start with http or https")
        }
        if(formData.websiteUrl && formData.websiteUrl.length > 0 && !formData.websiteUrl.includes("http")) {
          stepFourErrors.push("Website URL must start with http or https")
        }
        
        // Make job title required
        if (!formData.jobTitle.trim()) {
          stepFourErrors.push("Job title is required")
        }
        
        // Make organization required
        if (!formData.organization.trim()) {
          stepFourErrors.push("Organization is required")
        }
        
        if (stepFourErrors.length > 0) {
          setErrors(stepFourErrors)
          return false
        }
        return true

      case 5: // Review and terms
        const stepFiveErrors: string[] = []
        if (!formData.agreeToTerms) stepFiveErrors.push("You must agree to the Terms of Service")
        
        if (stepFiveErrors.length > 0) {
          setErrors(stepFiveErrors)
          return false
        }
        return true

      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    setErrors([])
    setFieldErrors({})
  }

  const goToStep = (step: number) => {
    if (step <= currentStep || step === currentStep + 1) {
      if (step > currentStep && !validateStep(currentStep)) {
        return
      }
      setCurrentStep(step)
      setErrors([])
      setFieldErrors({})
    }
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    
    if (!validateStep(currentStep)) {
      return
    }

    setIsLoading(true)

    // Prepare payload according to new structure
    const payload = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      personal_info: {
        first_name: formData.firstName,
        middle_name: formData.middleName || null,
        last_name: formData.lastName,
        date_of_birth: formData.dateOfBirth || null,
        gender: formData.gender || null,
        profile_picture: null,
        bio: formData.bio || null,
        national_id: formData.nationalId || null,
        passport_id: formData.passportId || null,
        next_of_kin_name: formData.nextOfKinName || null,
        next_of_kin_relation: formData.nextOfKinRelation || null,
        next_of_kin_contacts: formData.nextOfKinContacts || null
      },
      contact_info: {
        phone: formData.phone || null,
        alt_phone: formData.altPhone || null,
        email_verified: false,
        postal_address: formData.postalAddress || null,
        physical_address: formData.physicalAddress || null,
        city: formData.city || null,
        state: formData.state || null,
        country: formData.country,
        postal_code: formData.postalCode || null
      },
      account_security: {
        is_staff: false,
        is_superuser: false,
        is_approved: true,
        two_factor_enabled: false
      },
      social_info: {
        linkedin_url: formData.linkedinUrl || null,
        github_url: formData.githubUrl || null,
        website_url: formData.websiteUrl || null,
        job_title: formData.jobTitle || null,
        organization: formData.organization || null
      },
      preferences: {
        preferred_language: formData.preferredLanguage,
        timezone: formData.timezone
      }
    }

    try {
      const response = await fetch('https://twosixdigitalbw.com/v1/api/auth_microservice/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Passed!!!",
          description: "Registration successful. You can now log in.",
          action: (
            <ToastAction altText="Ok">Ok</ToastAction>
          ),
        });
        
        // Redirect to login page after successful registration
        router.push('/customer/signin')
      } else {
        const errorData = await response.json()
        
        if (response.status === 400) {
          toast({
            title: "Failed!!!",
            description: "Authentication failed. Please check your credentials and try again.",
            action: (
              <ToastAction altText="Ok">Ok</ToastAction>
            ),
          });
          // Handle field-specific errors
          setFieldErrors(errorData)
          
          // Extract error messages for display
          const errorMessages: string[] = []
          Object.entries(errorData).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach(message => errorMessages.push(message))
            }
          })
          setErrors(errorMessages)
        } else {
          toast({
            title: "Failed!!!",
            description: "Authentication failed. Please check your credentials and try again.",
            action: (
              <ToastAction altText="Ok">Ok</ToastAction>
            ),
          });
          setErrors(["Registration failed. Please try again."])
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrors(["Network error. Please check your connection and try again."])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getProgressPercentage = () => {
    return ((currentStep - 1) / (STEPS.length - 1)) * 100
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Create Your Account</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Choose a unique username"
                  type="text"
                  autoComplete="username"
                  disabled={isLoading}
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className={fieldErrors.username ? "border-destructive" : ""}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={fieldErrors.email ? "border-destructive" : ""}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Create a strong password"
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={fieldErrors.password ? "border-destructive" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    type="text"
                    autoCapitalize="words"
                    autoComplete="given-name"
                    disabled={isLoading}
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    placeholder="Enter your middle name"
                    type="text"
                    autoCapitalize="words"
                    disabled={isLoading}
                    value={formData.middleName}
                    onChange={(e) => handleInputChange("middleName", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    type="text"
                    autoCapitalize="words"
                    autoComplete="family-name"
                    disabled={isLoading}
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    disabled={isLoading}
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleInputChange("gender", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nationalId">National ID *</Label>
                  <Input
                    id="nationalId"
                    placeholder="Enter your national ID"
                    type="text"
                    disabled={isLoading}
                    value={formData.nationalId}
                    onChange={(e) => handleInputChange("nationalId", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="passportId">Passport ID</Label>
                  <Input
                    id="passportId"
                    placeholder="Enter your passport ID"
                    type="text"
                    disabled={isLoading}
                    value={formData.passportId}
                    onChange={(e) => handleInputChange("passportId", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a bit about yourself"
                  disabled={isLoading}
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={3}
                />
              </div>

              {/* Next of Kin Information */}
              <div className="grid gap-4 pt-4 border-t">
                <h4 className="font-medium">Next of Kin Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nextOfKinName">Next of Kin Name</Label>
                    <Input
                      id="nextOfKinName"
                      placeholder="Full name"
                      type="text"
                      disabled={isLoading}
                      value={formData.nextOfKinName}
                      onChange={(e) => handleInputChange("nextOfKinName", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="nextOfKinRelation">Relation</Label>
                    <Select
                      value={formData.nextOfKinRelation}
                      onValueChange={(value) => handleInputChange("nextOfKinRelation", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Parent">Parent</SelectItem>
                        <SelectItem value="Spouse">Spouse</SelectItem>
                        <SelectItem value="Sibling">Sibling</SelectItem>
                        <SelectItem value="Child">Child</SelectItem>
                        <SelectItem value="Friend">Friend</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="nextOfKinContacts">Contact Number</Label>
                    <Input
                      id="nextOfKinContacts"
                      placeholder="+267xxxxxxxx"
                      type="tel"
                      disabled={isLoading}
                      value={formData.nextOfKinContacts}
                      onChange={(e) => handleInputChange("nextOfKinContacts", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+267xxxxxxxx"
                    type="tel"
                    disabled={isLoading}
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="altPhone">Alternative Phone</Label>
                  <Input
                    id="altPhone"
                    placeholder="+267xxxxxxxx"
                    type="tel"
                    disabled={isLoading}
                    value={formData.altPhone}
                    onChange={(e) => handleInputChange("altPhone", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="postalAddress">Postal Address</Label>
                <Textarea
                  id="postalAddress"
                  placeholder="P.O. Box 123, City"
                  disabled={isLoading}
                  value={formData.postalAddress}
                  onChange={(e) => handleInputChange("postalAddress", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="physicalAddress">Physical Address</Label>
                <Textarea
                  id="physicalAddress"
                  placeholder="123 Street Name, Area"
                  disabled={isLoading}
                  value={formData.physicalAddress}
                  onChange={(e) => handleInputChange("physicalAddress", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Gaborone"
                    type="text"
                    disabled={isLoading}
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">State/District</Label>
                  <Input
                    id="state"
                    placeholder="South East"
                    type="text"
                    disabled={isLoading}
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleInputChange("country", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Botswana">Botswana</SelectItem>
                      <SelectItem value="South Africa">South Africa</SelectItem>
                      <SelectItem value="Namibia">Namibia</SelectItem>
                      <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    placeholder="12345"
                    type="text"
                    disabled={isLoading}
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  />
                </div>
              </div>

              {/* Preferences */}
              <div className="grid gap-4 pt-4 border-t">
                <h4 className="font-medium">Preferences</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="preferredLanguage">Preferred Language</Label>
                    <Select
                      value={formData.preferredLanguage}
                      onValueChange={(value) => handleInputChange("preferredLanguage", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="tn">Setswana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={formData.timezone}
                      onValueChange={(value) => handleInputChange("timezone", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Gaborone">Africa/Gaborone</SelectItem>
                        <SelectItem value="Africa/Johannesburg">Africa/Johannesburg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Professional & Social Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    placeholder="Senior Developer"
                    type="text"
                    disabled={isLoading}
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="organization">Organization *</Label>
                  <Input
                    id="organization"
                    placeholder="Company Name"
                    type="text"
                    disabled={isLoading}
                    value={formData.organization}
                    onChange={(e) => handleInputChange("organization", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  placeholder="https://linkedin.com/in/username"
                  type="url"
                  disabled={isLoading}
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    placeholder="https://github.com/username"
                    type="url"
                    disabled={isLoading}
                    value={formData.githubUrl}
                    onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Input
                    id="websiteUrl"
                    placeholder="https://yourwebsite.com"
                    type="url"
                    disabled={isLoading}
                    value={formData.websiteUrl}
                    onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-muted-foreground">
                  This information helps us understand your professional background and connect you with relevant opportunities.
                </p>
              </div>
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              {/* Summary */}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <h4 className="font-medium">Account Information</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Username: {formData.username}</p>
                    <p>Email: {formData.email}</p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <h4 className="font-medium">Personal Information</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Name: {formData.firstName} {formData.middleName} {formData.lastName}</p>
                    {formData.dateOfBirth && <p>Date of Birth: {formData.dateOfBirth}</p>}
                    {formData.gender && <p>Gender: {formData.gender}</p>}
                  </div>
                </div>

                {(formData.phone || formData.city) && (
                  <div className="grid gap-2">
                    <h4 className="font-medium">Contact Information</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {formData.phone && <p>Phone: {formData.phone}</p>}
                      {formData.city && <p>Location: {formData.city}, {formData.country}</p>}
                    </div>
                  </div>
                )}

                {(formData.jobTitle || formData.organization) && (
                  <div className="grid gap-2">
                    <h4 className="font-medium">Professional Information</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {formData.jobTitle && <p>Job Title: {formData.jobTitle}</p>}
                      {formData.organization && <p>Organization: {formData.organization}</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="grid gap-3 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", !!checked)}
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <a 
                      href="/terms" 
                      className="font-medium text-primary underline-offset-4 hover:underline"
                      target="_blank"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a 
                      href="/privacy" 
                      className="font-medium text-primary underline-offset-4 hover:underline"
                      target="_blank"
                    >
                      Privacy Policy
                    </a>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={formData.agreeToNewsletter}
                    onCheckedChange={(checked) => handleInputChange("agreeToNewsletter", !!checked)}
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor="newsletter"
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Send me updates about new features and educational opportunities
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className={cn("max-w-2xl mx-auto", className)} {...props}>
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {STEPS.length}
          </span>
        </div>
        
        <Progress value={getProgressPercentage()} className="mb-4" />
        
        {/* Step Navigation */}
        <div className="flex justify-between">
          {STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => goToStep(step.id)}
              className={cn(
                "flex flex-col items-center text-xs transition-colors",
                "hover:text-primary focus:outline-none focus:text-primary",
                currentStep === step.id
                  ? "text-primary font-medium"
                  : currentStep > step.id
                  ? "text-green-600"
                  : "text-muted-foreground"
              )}
              disabled={step.id > currentStep + 1}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-colors",
                  currentStep === step.id
                    ? "bg-primary text-primary-foreground"
                    : currentStep > step.id
                    ? "bg-green-600 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>
              <span className="hidden sm:block">{step.title}</span>
              <span className="hidden md:block text-[10px] text-muted-foreground">
                {step.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit}>
        {/* Error Display */}
        {errors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        <div className="mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isLoading}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentStep === STEPS.length ? (
            <Button
              type="submit"
              disabled={isLoading || !formData.agreeToTerms}
              className="flex items-center gap-2"
            >
              {isLoading && <Icons.spinner className="w-4 h-4 animate-spin" />}
              Create Account
            </Button>
          ) : (
            <Button
              type="button"
              onClick={nextStep}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Alternative Registration Options */}
      {currentStep === 1 && (
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-4">
            <Button variant="outline" className="w-full" size="lg">
              <div className="w-6 h-6 items-center justify-center">
                <Image
                  src="/gov_icon.png"
                  alt='Coat-of-arms'
                  width={24}
                  height={24}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              1Gov1Citizen
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Icons component
const Icons = {
  spinner: (props: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 11-6.219-8.56" />
    </svg>
  ),
}