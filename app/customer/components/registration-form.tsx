"use client"

import { useState, useEffect } from "react"
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
import { ChevronLeft, ChevronRight, Check, Eye, EyeOff, CalendarIcon, Search, X, CheckCircle, XCircle } from "lucide-react"
// import { toast } from "sonner"
import Image from 'next/image';
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { format } from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { OneGovAuth } from "./1gov-login"
import { Calendar } from "@/components/ui/calendar"
import { trlsIAM } from "@/app/lib/store"


const AUTH_API_URL = `${trlsIAM}/api/auth_microservice/register/`

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

// Common email domain typos and their corrections
const COMMON_DOMAIN_TYPOS: Record<string, string> = {
  // Gmail typos
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmil.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.om': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.cmo': 'gmail.com',
  
  // Yahoo typos
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yahoocom': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'yahoo.cm': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  
  // Outlook/Hotmail typos
  'outlook.cm': 'outlook.com',
  'outlook.con': 'outlook.com',
  'outlook.co': 'outlook.com',
  'hotmail.cm': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'hotmal.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  
  // Botswana domains
  'gov.bw': 'gov.bw',
  'ac.bw': 'ac.bw',
  'co.bw': 'co.bw',
  'org.bw': 'org.bw',
  
  // Common TLD typos
  '.cmo': '.com',
  '.con': '.com',
  '.comm': '.com',
  '.cm': '.com',
  '.coom': '.com',
  '.om': '.com',
  '.cim': '.com',
  '.commm': '.com',
  '.netl': '.net',
  '.orgn': '.org',
  '.ed': '.edu',
  '.eduu': '.edu',
}

// Popular email domains for validation
const POPULAR_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'gov.bw',
  'ac.bw',
  'co.bw',
  'org.bw',
  'live.com',
  'icloud.com',
  'aol.com',
  'protonmail.com'
]

// Enhanced country list with more African and other countries
const COUNTRIES = [
  // Botswana (reserved for citizens)
  "Botswana",
  
  // African countries
  "Algeria", "Angola", "Benin", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon", 
  "Central African Republic", "Chad", "Comoros", "Congo", "Côte d'Ivoire", "Djibouti", 
  "Democratic Republic of the Congo", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", 
  "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho", 
  "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", 
  "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "São Tomé and Príncipe", "Senegal", 
  "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", 
  "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe",
  
  // Other major countries
  "Afghanistan", "Albania", "Andorra", "Antigua and Barbuda", "Argentina", "Armenia", 
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", 
  "Belarus", "Belgium", "Belize", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Brazil", 
  "Brunei", "Bulgaria", "Cambodia", "Canada", "Chile", "China", "Colombia", "Costa Rica", 
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Dominica", "Dominican Republic", 
  "Ecuador", "El Salvador", "Estonia", "Fiji", "Finland", "France", "Georgia", "Germany", 
  "Greece", "Grenada", "Guatemala", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", 
  "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", 
  "Jordan", "Kazakhstan", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", 
  "Liechtenstein", "Lithuania", "Luxembourg", "Malaysia", "Maldives", "Malta", "Marshall Islands", 
  "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Myanmar", "Nauru", 
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "North Korea", "North Macedonia", "Norway", 
  "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", 
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Saint Kitts and Nevis", 
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Saudi Arabia", 
  "Serbia", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "South Korea", "Spain", 
  "Sri Lanka", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Thailand", 
  "Timor-Leste", "Tonga", "Trinidad and Tobago", "Turkey", "Turkmenistan", "Tuvalu", "Ukraine", 
  "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", 
  "Vatican City", "Venezuela", "Vietnam", "Yemen"
]

// Password validation rules
interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  requirements: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    noSpaces: boolean;
    noCommonPatterns: boolean;
    noRepeatedChars: boolean;
    noSequentialChars: boolean;
  };
}

const validatePassword = (password: string): PasswordValidation => {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    noSpaces: !/\s/.test(password),
    noCommonPatterns: !/(123456|password|qwerty|admin|welcome|letmein|monkey|sunshine|password1|123456789)/i.test(password),
    noRepeatedChars: !/(.)\1{3,}/.test(password),
    noSequentialChars: !/(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)
  };

  const errors: string[] = [];
  
  if (!requirements.minLength) errors.push("Password must be at least 8 characters long");
  if (!requirements.hasUpperCase) errors.push("Password must contain at least one uppercase letter (A-Z)");
  if (!requirements.hasLowerCase) errors.push("Password must contain at least one lowercase letter (a-z)");
  if (!requirements.hasNumber) errors.push("Password must contain at least one number (0-9)");
  if (!requirements.hasSpecialChar) errors.push("Password must contain at least one special character (!@#$%^&*() etc.)");
  if (!requirements.noSpaces) errors.push("Password must not contain spaces");
  if (!requirements.noCommonPatterns) errors.push("Password contains common words or patterns that are not allowed");
  if (!requirements.noRepeatedChars) errors.push("Password must not contain the same character repeated 4 or more times in a row");
  if (!requirements.noSequentialChars) errors.push("Password must not contain sequential characters (abc, 123, etc.)");

  return {
    isValid: errors.length === 0,
    errors,
    requirements
  };
};

export function RegistrationForm({ className, ...props }: RegistrationFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<string[]>([])
  const [fieldErrors, setFieldErrors] = useState<ApiError>({})
  const [citizenship, setCitizenship] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [dateOfBirthOpen, setDateOfBirthOpen] = useState(false)
  const [emailSuggestion, setEmailSuggestion] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    isValid: false,
    errors: [],
    requirements: {
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
      noSpaces: true,
      noCommonPatterns: true,
      noRepeatedChars: true,
      noSequentialChars: true
    }
  })
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

  // Effect to handle country field based on citizenship selection
  useEffect(() => {
    if (citizenship === "Citizen") {
      // Pre-fill with Botswana and lock the field for citizens
      setFormData(prev => ({
        ...prev,
        country: "Botswana"
      }))
    } else if (citizenship === "Non-citizen") {
      // Clear country field for non-citizens to allow selection
      setFormData(prev => ({
        ...prev,
        country: ""
      }))
    }
  }, [citizenship])

  // Function to validate email domain and check for common typos
  const validateEmailDomain = (email: string): { isValid: boolean; suggestion: string } => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!emailRegex.test(email)) {
      return { isValid: false, suggestion: "" }
    }

    const [localPart, domain] = email.toLowerCase().split('@')
    
    // Check if domain exists in common typos
    if (COMMON_DOMAIN_TYPOS[domain]) {
      const correctedEmail = `${localPart}@${COMMON_DOMAIN_TYPOS[domain]}`
      return { 
        isValid: false, 
        suggestion: `Did you mean ${correctedEmail}?` 
      }
    }

    // Check for common TLD typos in the domain
    const domainParts = domain.split('.')
    if (domainParts.length >= 2) {
      const tld = `.${domainParts[domainParts.length - 1]}`
      if (COMMON_DOMAIN_TYPOS[tld]) {
        const correctedDomain = domainParts.slice(0, -1).join('.') + COMMON_DOMAIN_TYPOS[tld]
        const correctedEmail = `${localPart}@${correctedDomain}`
        return { 
          isValid: false, 
          suggestion: `Did you mean ${correctedEmail}?` 
        }
      }
    }

    // Check if domain is similar to popular domains (Levenshtein distance)
    let closestDomain = ""
    let minDistance = Infinity

    for (const popularDomain of POPULAR_DOMAINS) {
      const distance = levenshteinDistance(domain, popularDomain)
      if (distance <= 2 && distance < minDistance) { // Allow 1-2 character differences
        minDistance = distance
        closestDomain = popularDomain
      }
    }

    if (closestDomain && minDistance > 0) {
      const correctedEmail = `${localPart}@${closestDomain}`
      return { 
        isValid: false, 
        suggestion: `Did you mean ${correctedEmail}?` 
      }
    }

    // Check for repeated characters (e.g., gmaill.com, yahoo.com)
    const repeatedCharRegex = /(.)\1{2,}/
    if (repeatedCharRegex.test(domain)) {
      const simplifiedDomain = domain.replace(/(.)\1{2,}/g, '$1$1')
      if (POPULAR_DOMAINS.includes(simplifiedDomain)) {
        const correctedEmail = `${localPart}@${simplifiedDomain}`
        return { 
          isValid: false, 
          suggestion: `Did you mean ${correctedEmail}?` 
        }
      }
    }

    return { isValid: true, suggestion: "" }
  }

  // Levenshtein distance function to measure similarity between strings
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        )
      }
    }

    return matrix[str2.length][str1.length]
  }

  const validateStep = (step: number): boolean => {
    setErrors([])
    setFieldErrors({})
    setEmailSuggestion("")
    
    switch (step) {
      case 1: // Account credentials
        const stepOneErrors: string[] = []
        if (!formData.username.trim()) stepOneErrors.push("Username is required")
        if (!formData.email.trim()) stepOneErrors.push("Email is required")
        if (!formData.password.trim()) stepOneErrors.push("Password is required")
        
        // Enhanced password validation
        const passwordValidationResult = validatePassword(formData.password)
        if (!passwordValidationResult.isValid) {
          stepOneErrors.push(...passwordValidationResult.errors)
        }
        
        if (formData.password !== formData.confirmPassword) stepOneErrors.push("Passwords do not match")
        
        // Validate that email and username are the same
        if (formData.username.trim() && formData.email.trim() && formData.username !== formData.email) {
          stepOneErrors.push("Email and username must be the same")
        }
        
        // Validate email format and domain
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (formData.email.trim()) {
          if (!emailRegex.test(formData.email)) {
            stepOneErrors.push("Please enter a valid email address")
          } else {
            // Check for domain typos
            const domainValidation = validateEmailDomain(formData.email)
            if (!domainValidation.isValid) {
              stepOneErrors.push("Please check your email for typos")
              if (domainValidation.suggestion) {
                setEmailSuggestion(domainValidation.suggestion)
              }
            }
          }
        }
        
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
        if (!citizenship) stepTwoErrors.push("Citizenship status is required")
        
        // Validate Date of Birth is in the past (not today or future)
        if (formData.dateOfBirth.trim()) {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
          const birthDate = new Date(formData.dateOfBirth);
          
          // Check if date is valid
          if (isNaN(birthDate.getTime())) {
            stepTwoErrors.push("Please enter a valid date of birth");
          } else {
            // Check if birth date is today or in the future
            if (birthDate >= today) {
              stepTwoErrors.push("Date of birth must be in the past");
            }
          }
        }
        
        // Validate National ID or Passport ID based on citizenship
        if (citizenship === "Citizen") {
          if (!formData.nationalId.trim()) stepTwoErrors.push("National ID is required")
          
          // Validate National ID format (9 digits, 5th digit must be 1 or 2)
          if (formData.nationalId.trim()) {
            const nationalIdRegex = /^\d{9}$/
            if (!nationalIdRegex.test(formData.nationalId)) {
              stepTwoErrors.push("National ID must be exactly 9 digits")
            } else {
              const fifthDigit = formData.nationalId.charAt(4) // 5th digit (index 4)
              if (fifthDigit !== '1' && fifthDigit !== '2') {
                stepTwoErrors.push("National ID must have 1 or 2 as the 5th digit")
              }
            }
          }
        } else if (citizenship === "Non-citizen") {
          if (!formData.passportId.trim()) stepTwoErrors.push("Passport ID is required")
        }
        
        if (stepTwoErrors.length > 0) {
          setErrors(stepTwoErrors)
          return false
        }
        return true

      case 3: // Contact information
        const stepThreeErrors: string[] = []
        // Make required fields
        if (!formData.phone.trim()) stepThreeErrors.push("Phone number is required")
        if (!formData.postalAddress.trim()) stepThreeErrors.push("Postal address is required")
        if (!formData.physicalAddress.trim()) stepThreeErrors.push("Physical address is required")
        if (!formData.country.trim()) stepThreeErrors.push("Country is required")
        
        if (stepThreeErrors.length > 0) {
          setErrors(stepThreeErrors)
          return false
        }
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
          return true
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
    setEmailSuggestion("")
  }

  const goToStep = (step: number) => {
    if (step <= currentStep || step === currentStep + 1) {
      if (step > currentStep && !validateStep(currentStep)) {
        return
      }
      setCurrentStep(step)
      setErrors([])
      setFieldErrors({})
      setEmailSuggestion("")
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-fill username when email is entered and username is empty
    if (field === "email" && typeof value === "string" && !formData.username) {
      setFormData(prev => ({
        ...prev,
        username: value
      }))
    }

    // Validate National ID input (only allow digits)
    if (field === "nationalId" && typeof value === "string") {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '')
      // Limit to 9 digits
      const limitedDigits = digitsOnly.slice(0, 9)
      setFormData(prev => ({
        ...prev,
        nationalId: limitedDigits
      }))
    }

    // Validate password and update validation state
    if (field === "password" && typeof value === "string") {
      const validation = validatePassword(value)
      setPasswordValidation(validation)
    }

    // Clear email suggestion when email field is modified
    if (field === "email") {
      setEmailSuggestion("")
    }
  }

  const handleCitizenshipChange = (value: string) => {
    setCitizenship(value)
    // Clear the other ID field when citizenship changes
    if (value === "Citizen") {
      setFormData(prev => ({ ...prev, passportId: "" }))
    } else if (value === "Non-citizen") {
      setFormData(prev => ({ ...prev, nationalId: "" }))
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd")
      handleInputChange("dateOfBirth", formattedDate)
      setDateOfBirthOpen(false)
    }
  }

  // Function to apply email suggestion
  const applyEmailSuggestion = () => {
    if (emailSuggestion) {
      const suggestedEmail = emailSuggestion.replace('Did you mean ', '').replace('?', '')
      setFormData(prev => ({
        ...prev,
        email: suggestedEmail,
        username: suggestedEmail
      }))
      setEmailSuggestion("")
    }
  }

  // Get available countries based on citizenship
  const getAvailableCountries = () => {
    if (citizenship === "Citizen") {
      return ["Botswana"]
    } else if (citizenship === "Non-citizen") {
      return COUNTRIES.filter(country => country !== "Botswana")
    }
    return COUNTRIES
  }

  // Filter countries based on search query for non-citizens
  const getFilteredCountries = () => {
    const availableCountries = getAvailableCountries()
    if (!searchQuery.trim()) {
      return availableCountries
    }
    return availableCountries.filter(country =>
      country.toLowerCase().includes(searchQuery.toLowerCase())
    )
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
        linkedin_url: formData.linkedinUrl,
        github_url: formData.githubUrl,
        website_url: formData.websiteUrl,
        job_title: formData.jobTitle || null,
        organization: formData.organization || null
      },
      preferences: {
        preferred_language: formData.preferredLanguage,
        timezone: formData.timezone
      }
    }

    try {
      const response = await fetch(AUTH_API_URL, {
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
            description: "Registration failed. Please fill all information.",
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
            description: "Registration failed. Please fill all information.",
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

  const getProgressPercentage = () => {
    return ((currentStep - 1) / (STEPS.length - 1)) * 100
  }

  // Password requirement component
  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <CheckCircle className="h-3 w-3 text-green-500" />
      ) : (
        <XCircle className="h-3 w-3 text-red-500" />
      )}
      <span className={met ? "text-green-600" : "text-red-600"}>{text}</span>
    </div>
  )

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
                {emailSuggestion && (
                  <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md text-sm">
                    <span className="text-blue-700 flex-1">{emailSuggestion}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={applyEmailSuggestion}
                      className="h-7 text-xs"
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Use email as a username"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className={fieldErrors.username ? "border-destructive" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  Username will automatically match your email address
                </p>
              </div>
              

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="Create a very strong password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    disabled={isLoading}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={fieldErrors.password ? "border-destructive pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {/* Password Requirements */}
                {formData.password && (
                  <div className="p-3 bg-muted rounded-md space-y-2">
              
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                      <PasswordRequirement 
                        met={passwordValidation.requirements.minLength} 
                        text="At least 8 characters" 
                      />
                      <PasswordRequirement 
                        met={passwordValidation.requirements.hasUpperCase} 
                        text="One uppercase letter (A-Z)" 
                      />
                      <PasswordRequirement 
                        met={passwordValidation.requirements.hasLowerCase} 
                        text="One lowercase letter (a-z)" 
                      />
                      <PasswordRequirement 
                        met={passwordValidation.requirements.hasNumber} 
                        text="One number (0-9)" 
                      />
                      <PasswordRequirement 
                        met={passwordValidation.requirements.hasSpecialChar} 
                        text="One special character" 
                      />
                      <PasswordRequirement 
                        met={passwordValidation.requirements.noSpaces} 
                        text="No spaces" 
                      />
                      <PasswordRequirement 
                        met={passwordValidation.requirements.noCommonPatterns} 
                        text="No common patterns" 
                      />
                      <PasswordRequirement 
                        met={passwordValidation.requirements.noRepeatedChars} 
                        text="No repeated characters (4+)" 
                      />
                      <PasswordRequirement 
                        met={passwordValidation.requirements.noSequentialChars} 
                        text="No sequential characters" 
                      />
                    </div>
                    {passwordValidation.isValid && (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                       
                        
                      </div>
                    )}
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Create a very strong password with at least 8 characters including uppercase, lowercase, numbers, and special characters
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    placeholder="Confirm your strong password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    disabled={isLoading}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={formData.confirmPassword && formData.password !== formData.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <X className="h-3 w-3" />
                    Passwords do not match
                  </p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && passwordValidation.isValid && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Passwords match
                  </p>
                )}
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
                {/* Date of Birth with shadcn calendar implementation */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                    Date of Birth <span className="text-red-500">*</span>
                  </Label>
                  
                  <Popover open={dateOfBirthOpen} onOpenChange={setDateOfBirthOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                          !formData.dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span className="truncate">
                          {formData.dateOfBirth ? format(new Date(formData.dateOfBirth), "PPP") : <span>Enter your date of birth</span>}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
                        onSelect={(newDate) => {
                          if (newDate) {
                            const year = newDate.getFullYear();
                            const month = String(newDate.getMonth() + 1).padStart(2, '0');
                            const day = String(newDate.getDate()).padStart(2, '0');
                            handleInputChange("dateOfBirth", `${year}-${month}-${day}`);
                          } else {
                            handleInputChange("dateOfBirth", "");
                          }
                          setDateOfBirthOpen(false);
                        }}
                        className="rounded-md border shadow-sm"
                        captionLayout="dropdown"
                        disabled={(date) =>
                          date >= new Date(new Date().setHours(0, 0, 0, 0) + 86400000) || 
                          date < new Date("1900-01-01")
                        }
                      />
                      <div className="flex justify-end p-3 border-t">
                        <Button 
                          type="button" 
                          size="sm"
                          onClick={() => {
                            // Close the popover by finding and clicking the trigger
                            const trigger = document.querySelector('[data-state="open"]');
                            if (trigger) {
                              (trigger as HTMLElement).click();
                            }
                          }}
                          className="bg-blue-800 hover:bg-blue-900 text-white"
                        >
                          Close
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {errors.includes("Date of birth is required") && (
                    <p className='text-sm text-red-500 flex items-center gap-1'>
                      <span className="text-xs">⚠</span>
                      Date of birth is required
                    </p>
                  )}
                  {errors.includes("Date of birth must be in the past") && (
                    <p className='text-sm text-red-500 flex items-center gap-1'>
                      <span className="text-xs">⚠</span>
                      Date of birth must be in the past
                    </p>
                  )}
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
                      {/* <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Citizenship Field */}
              <div className="grid gap-2">
                <Label htmlFor="citizenship">Citizenship *</Label>
                <Select
                  value={citizenship}
                  onValueChange={handleCitizenshipChange}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select citizenship status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Citizen">Citizen</SelectItem>
                    <SelectItem value="Non-citizen">Non-citizen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional ID Fields */}
              {citizenship === "Citizen" && (
                <div className="grid gap-2">
                  <Label htmlFor="nationalId">National ID *</Label>
                  <Input
                    id="nationalId"
                    placeholder="Enter 9-digit national ID"
                    type="text"
                    disabled={isLoading}
                    value={formData.nationalId}
                    onChange={(e) => handleInputChange("nationalId", e.target.value)}
                    maxLength={9}
                  />
                  <p className="text-xs text-muted-foreground">
                    
                  </p>
                </div>
              )}

              {citizenship === "Non-citizen" && (
                <div className="grid gap-2">
                  <Label htmlFor="passportId">Passport ID *</Label>
                  <Input
                    id="passportId"
                    placeholder="Enter your passport ID"
                    type="text"
                    disabled={isLoading}
                    value={formData.passportId}
                    onChange={(e) => handleInputChange("passportId", e.target.value)}
                  />
                </div>
              )}

             {/* <div className="grid gap-2">
               <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a bit about yourself"
                  disabled={isLoading}
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={3}
                />
              </div>*/}

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
                  <Label htmlFor="phone">Phone Number *</Label>
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
                <Label htmlFor="postalAddress">Postal Address *</Label>
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
                <Label htmlFor="physicalAddress">Physical Address *</Label>
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
                    placeholder="Enter state or district"
                    type="text"
                    disabled={isLoading}
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleInputChange("country", value)}
                    disabled={isLoading || citizenship === "Citizen"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {citizenship === "Non-citizen" && (
                        <div className="sticky top-0 bg-background p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search countries..."
                              className="pl-8"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      )}
                      {getFilteredCountries().map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                      {citizenship === "Non-citizen" && getFilteredCountries().length === 0 && (
                        <div className="p-2 text-center text-sm text-muted-foreground">
                          No countries found
                        </div>
                      )}
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
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    placeholder="Mathematics Teacher"
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
                    placeholder="School Name"
                    type="text"
                    disabled={isLoading}
                    value={formData.organization}
                    onChange={(e) => handleInputChange("organization", e.target.value)}
                  />
                </div>
              </div>

              {/*<div className="grid gap-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  placeholder="https://linkedin.com/in/username"
                  type="url"
                  disabled={isLoading}
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                />
              </div>*/}

              {/*<div className="grid gap-2">
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  placeholder="https://yourwebsite.com"
                  type="url"
                  disabled={isLoading}
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                />
              </div>*/}

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
                    <p>Citizenship: {citizenship}</p>
                    {formData.nationalId && <p>National ID: {formData.nationalId}</p>}
                    {formData.passportId && <p>Passport ID: {formData.passportId}</p>}
                  </div>
                </div>

                {(formData.phone || formData.city || formData.country) && (
                  <div className="grid gap-2">
                    <h4 className="font-medium">Contact Information</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {formData.phone && <p>Phone: {formData.phone}</p>}
                      {formData.postalAddress && <p>Postal Address: {formData.postalAddress}</p>}
                      {formData.physicalAddress && <p>Physical Address: {formData.physicalAddress}</p>}
                      {formData.city && <p>City: {formData.city}</p>}
                      {formData.state && <p>State/District: {formData.state}</p>}
                      {formData.country && <p>Country: {formData.country}</p>}
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
                      Terms and Conditions of Use
                    </a>
                     {" "}
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
            {/* Login with 1Gov1Citizen */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <div className="w-6 h-6 items-center justify-center flex mr-2">
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
          </DialogTrigger>
          <DialogContent>
            <OneGovAuth/>
          </DialogContent>
        </Dialog>
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