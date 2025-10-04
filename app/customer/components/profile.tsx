'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, Edit, X, AlertTriangle, CalendarIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Types for the user profile data
interface PersonalInfo {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: string;
  profile_picture?: string | null;
  bio?: string;
  national_id: string;
  passport_id?: string;
  next_of_kin_name?: string;
  next_of_kin_relation?: string;
  next_of_kin_contacts?: string;
}

interface ContactInfo {
  phone: string;
  alt_phone: string;
  email_verified: boolean;
  postal_address: string;
  physical_address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

interface AccountSecurity {
  email_verified: any;
  is_staff: boolean;
  is_superuser: boolean;
  is_approved: boolean;
  two_factor_enabled: boolean;
}

interface SocialInfo {
  linkedin_url: string;
  github_url: string;
  website_url: string;
  job_title: string;
  organization: string;
}

interface Preferences {
  preferred_language: string;
  timezone: string;
}

interface UserProfileData {
  id: number;
  username: string;
  email: string;
  personal_info: PersonalInfo;
  contact_info: ContactInfo;
  account_security: AccountSecurity;
  social_info: SocialInfo;
  preferences: Preferences;
}

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export function Profile({ isOpen, onClose, userId }: ProfileProps) {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfileData>>({});
  const [dateOfBirthOpen, setDateOfBirthOpen] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  // Fetch user profile data
  useEffect(() => {
    if (isOpen && userId) {
      fetchUserProfile();
    }
  }, [isOpen, userId]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://twosixdigitalbw.com/v1/api/auth_microservice/users/${userId}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      setUserData(data);
      setFormData(data);
      console.log('Fetched user profile:', data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof UserProfileData] as object),
        [field]: value
      }
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Validate National ID input (only allow digits)
    if (field === "national_id" && typeof value === "string") {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '')
      // Limit to 9 digits
      const limitedDigits = digitsOnly.slice(0, 9)
      setFormData(prev => ({
        ...prev,
        personal_info: {
          ...prev.personal_info,
          national_id: limitedDigits
        }
      }));
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd")
      handleInputChange("personal_info", "date_of_birth", formattedDate)
      setDateOfBirthOpen(false)
    }
  };

  const validateSection = (section: string): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (section === 'personal_info') {
      if (!formData.personal_info?.first_name?.trim()) {
        newErrors.first_name = "First name is required";
      }
      if (!formData.personal_info?.last_name?.trim()) {
        newErrors.last_name = "Last name is required";
      }
      if (!formData.personal_info?.date_of_birth?.trim()) {
        newErrors.date_of_birth = "Date of birth is required";
      } else {
        // Validate Date of Birth is in the past (not today or future)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
        const birthDate = new Date(formData.personal_info.date_of_birth);
        
        // Check if date is valid
      if (isNaN(birthDate.getTime())) {
        newErrors.date_of_birth = "Please enter a valid date of birth";
      } else {
        // Check if birth date is today or in the future
        if (birthDate >= today) {
          newErrors.date_of_birth = "Date of birth must be in the past";
        } else {
          // Calculate age and check if at least 18 years old
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          
          // Check if birthday hasn't occurred yet this year
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            // Subtract 1 from age if birthday hasn't occurred yet
            if (age - 1 < 18) {
              newErrors.date_of_birth = "You must be at least 18 years old";
            }
          } else {
            // Birthday has occurred this year
            if (age < 18) {
              newErrors.date_of_birth = "You must be at least 18 years old";
            }
          }
        }
      }
      }

      if (!formData.personal_info?.gender?.trim()) {
        newErrors.gender = "Gender is required";
      }
      if (!formData.personal_info?.national_id?.trim()) {
        newErrors.national_id = "National ID is required";
      } else {
        // Validate National ID format (9 digits, 5th digit must be 1 or 2)
        const nationalIdRegex = /^\d{9}$/
        if (!nationalIdRegex.test(formData.personal_info.national_id)) {
          newErrors.national_id = "National ID must be exactly 9 digits"
        } else {
          const fifthDigit = formData.personal_info.national_id.charAt(4) // 5th digit (index 4)
          if (fifthDigit !== '1' && fifthDigit !== '2') {
            newErrors.national_id = "National ID must have 1 or 2 as the 5th digit"
          }
        }
      }
    }

    if (section === 'contact_info') {
      if (!formData.contact_info?.phone?.trim()) {
        newErrors.phone = "Phone number is required";
      }
      if (!formData.contact_info?.physical_address?.trim()) {
        newErrors.physical_address = "Physical address is required";
      }
      if (!formData.contact_info?.postal_address?.trim()) {
        newErrors.postal_address = "Postal address is required";
      }
    }

    if (section === 'social_info') {
      if (!formData.social_info?.job_title?.trim()) {
        newErrors.job_title = "Job title is required";
      }
      if (!formData.social_info?.organization?.trim()) {
        newErrors.organization = "Organization is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const startEditing = (section: string) => {
    setEditingSection(section);
    setErrors({});
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setFormData(userData as UserProfileData);
    setErrors({});
  };

  const saveChanges = async (section: string) => {
    if (!validateSection(section)) {
      toast({
        title: "Unfortunately!",
        description: "You can't leave this blank.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // Prepare the data to send based on the section being edited
      let updateData = {};
      if (section === 'personal_info' && formData.personal_info) {
        updateData = formData.personal_info;
      } else if (section === 'contact_info' && formData.contact_info) {
        updateData = formData.contact_info;
      } else if (section === 'social_info' && formData.social_info) {
        updateData = formData.social_info;
      } else if (section === 'preferences' && formData.preferences) {
        updateData = formData.preferences;
      }

      const response = await fetch(`https://twosixdigitalbw.com/v1/api/auth_microservice/profile/update/${userId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Refresh the user data
      await fetchUserProfile();
      setEditingSection(null);
      setErrors({});
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            View and edit your profile information
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : userData ? (
          <div className="grid gap-6 py-4">
            {/* Personal Information Section */}
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                {editingSection !== 'personal_info' ? (
                  <Button variant="outline" size="sm" onClick={() => startEditing('personal_info')}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={cancelEditing}
                      disabled={isSaving}
                    >
                      <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => saveChanges('personal_info')}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  {editingSection === 'personal_info' ? (
                    <div>
                      <Input
                        id="first_name"
                        value={formData.personal_info?.first_name || ''}
                        onChange={(e) => handleInputChange('personal_info', 'first_name', e.target.value)}
                        className={errors.first_name ? "border-destructive" : ""}
                      />
                      {errors.first_name && (
                        <p className="text-sm text-destructive">{errors.first_name}</p>
                      )}
                    </div>
                  ) : (
                    <p>{userData.personal_info.first_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middle_name">Middle Name</Label>
                  {editingSection === 'personal_info' ? (
                    <Input
                      id="middle_name"
                      value={formData.personal_info?.middle_name || ''}
                      onChange={(e) => handleInputChange('personal_info', 'middle_name', e.target.value)}
                    />
                  ) : (
                    <p>{userData.personal_info.middle_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  {editingSection === 'personal_info' ? (
                    <div>
                      <Input
                        id="last_name"
                        value={formData.personal_info?.last_name || ''}
                        onChange={(e) => handleInputChange('personal_info', 'last_name', e.target.value)}
                        className={errors.last_name ? "border-destructive" : ""}
                      />
                      {errors.last_name && (
                        <p className="text-sm text-destructive">{errors.last_name}</p>
                      )}
                    </div>
                  ) : (
                    <p>{userData.personal_info.last_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  {editingSection === 'personal_info' ? (
                    <div>
                      <Popover open={dateOfBirthOpen} onOpenChange={setDateOfBirthOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.personal_info?.date_of_birth && "text-muted-foreground",
                              errors.date_of_birth ? "border-destructive" : ""
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.personal_info?.date_of_birth ? (
                              format(new Date(formData.personal_info.date_of_birth), "PPP")
                            ) : (
                              <span>Enter your date of birth</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.personal_info?.date_of_birth ? new Date(formData.personal_info.date_of_birth) : undefined}
                            onSelect={handleDateSelect}
                            disabled={(date) => 
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            captionLayout="dropdown"
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                            className="rounded-md border"
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.date_of_birth && (
                        <p className="text-sm text-destructive">{errors.date_of_birth}</p>
                      )}
                    </div>
                  ) : (
                    <p>{userData.personal_info.date_of_birth}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  {editingSection === 'personal_info' ? (
                    <div>
                      <Select
                        value={formData.personal_info?.gender || ''}
                        onValueChange={(value) => handleInputChange('personal_info', 'gender', value)}
                      >
                        <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && (
                        <p className="text-sm text-destructive">{errors.gender}</p>
                      )}
                    </div>
                  ) : (
                    <p>{userData.personal_info.gender}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="national_id">National ID</Label>
                    {editingSection === 'personal_info' && (
                      <div className="flex items-center gap-1 text-amber-600 text-xs">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Update with caution</span>
                      </div>
                    )}
                  </div>
                  {editingSection === 'personal_info' ? (
                    <div className="space-y-2">
                      <Input
                        id="national_id"
                        value={formData.personal_info?.national_id || ''}
                        onChange={(e) => handleInputChange('personal_info', 'national_id', e.target.value)}
                        className={cn(
                          editingSection === 'personal_info' ? 'border-amber-300 focus:border-amber-500' : '',
                          errors.national_id ? "border-destructive" : ""
                        )}
                        maxLength={9}
                      />
                      {errors.national_id ? (
                        <p className="text-sm text-destructive">{errors.national_id}</p>
                      ) : (
                        <p className="text-xs text-amber-600 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Ensure this is correct to see accurate account information
                        </p>
                      )}
                    </div>
                  ) : (
                    <p>{userData.personal_info.national_id}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passport_id">Passport ID</Label>
                  {editingSection === 'personal_info' ? (
                    <Input
                      id="passport_id"
                      value={formData.personal_info?.passport_id || ''}
                      onChange={(e) => handleInputChange('personal_info', 'passport_id', e.target.value)}
                    />
                  ) : (
                    <p>{userData.personal_info.passport_id}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  {editingSection === 'personal_info' ? (
                    <Textarea
                      id="bio"
                      value={formData.personal_info?.bio || ''}
                      onChange={(e) => handleInputChange('personal_info', 'bio', e.target.value)}
                    />
                  ) : (
                    <p>{userData.personal_info.bio}</p>
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              <h4 className="font-medium mb-3">Next of Kin</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="next_of_kin_name">Name</Label>
                  {editingSection === 'personal_info' ? (
                    <Input
                      id="next_of_kin_name"
                      value={formData.personal_info?.next_of_kin_name || ''}
                      onChange={(e) => handleInputChange('personal_info', 'next_of_kin_name', e.target.value)}
                    />
                  ) : (
                    <p>{userData.personal_info.next_of_kin_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="next_of_kin_relation">Relation</Label>
                  {editingSection === 'personal_info' ? (
                    <Select
                      value={formData.personal_info?.next_of_kin_relation || ''}
                      onValueChange={(value) => handleInputChange('personal_info', 'next_of_kin_relation', value)}
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
                  ) : (
                    <p>{userData.personal_info.next_of_kin_relation}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="next_of_kin_contacts">Contacts</Label>
                  {editingSection === 'personal_info' ? (
                    <Input
                      id="next_of_kin_contacts"
                      value={formData.personal_info?.next_of_kin_contacts || ''}
                      onChange={(e) => handleInputChange('personal_info', 'next_of_kin_contacts', e.target.value)}
                    />
                  ) : (
                    <p>{userData.personal_info.next_of_kin_contacts}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                {editingSection !== 'contact_info' ? (
                  <Button variant="outline" size="sm" onClick={() => startEditing('contact_info')}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={cancelEditing}
                      disabled={isSaving}
                    >
                      <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => saveChanges('contact_info')}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  {editingSection === 'contact_info' ? (
                    <div>
                      <Input
                        id="phone"
                        value={formData.contact_info?.phone || ''}
                        onChange={(e) => handleInputChange('contact_info', 'phone', e.target.value)}
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone}</p>
                      )}
                    </div>
                  ) : (
                    <p>{userData.contact_info.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alt_phone">Alternate Phone</Label>
                  {editingSection === 'contact_info' ? (
                    <Input
                      id="alt_phone"
                      value={formData.contact_info?.alt_phone || ''}
                      onChange={(e) => handleInputChange('contact_info', 'alt_phone', e.target.value)}
                    />
                  ) : (
                    <p>{userData.contact_info.alt_phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="physical_address">Physical Address</Label>
                  {editingSection === 'contact_info' ? (
                    <div>
                      <Input
                        id="physical_address"
                        value={formData.contact_info?.physical_address || ''}
                        onChange={(e) => handleInputChange('contact_info', 'physical_address', e.target.value)}
                        className={errors.physical_address ? "border-destructive" : ""}
                      />
                      {errors.physical_address && (
                        <p className="text-sm text-destructive">{errors.physical_address}</p>
                      )}
                    </div>
                  ) : (
                    <p>{userData.contact_info.physical_address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal_address">Postal Address</Label>
                  {editingSection === 'contact_info' ? (
                    <div>
                      <Input
                        id="postal_address"
                        value={formData.contact_info?.postal_address || ''}
                        onChange={(e) => handleInputChange('contact_info', 'postal_address', e.target.value)}
                        className={errors.postal_address ? "border-destructive" : ""}
                      />
                      {errors.postal_address && (
                        <p className="text-sm text-destructive">{errors.postal_address}</p>
                      )}
                    </div>
                  ) : (
                    <p>{userData.contact_info.postal_address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  {editingSection === 'contact_info' ? (
                    <Input
                      id="city"
                      value={formData.contact_info?.city || ''}
                      onChange={(e) => handleInputChange('contact_info', 'city', e.target.value)}
                    />
                  ) : (
                    <p>{userData.contact_info.city}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  {editingSection === 'contact_info' ? (
                    <Select
                      value={formData.contact_info?.state || ''}
                      onValueChange={(value) => handleInputChange('contact_info', 'state', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Central">Central</SelectItem>
                        <SelectItem value="Chobe">Chobe </SelectItem>
                        <SelectItem value="Ghanzi">Ghanzi</SelectItem>
                        <SelectItem value="Kgalagadi">Kgalagadi</SelectItem>
                        <SelectItem value="Kgatleng">Kgatleng</SelectItem>
                        <SelectItem value="Kweneng">Kweneng </SelectItem>
                        <SelectItem value="North-East">North-East</SelectItem>
                        <SelectItem value="North-West">North-West</SelectItem>
                        <SelectItem value="South-East">South-East</SelectItem>
                        <SelectItem value="Southern ">Southern</SelectItem>
                        <SelectItem value="Gaborone">Gaborone</SelectItem>
                        <SelectItem value="Francistown">Francistown</SelectItem>
                        <SelectItem value="Lobatse">Lobatse</SelectItem>
                        <SelectItem value="Jwaneng">Jwaneng</SelectItem>
                        <SelectItem value="Orapa">Orapa</SelectItem>
                        <SelectItem value="Sowa">Sowa</SelectItem>
                        <SelectItem value="Selebi-Phikwe">Selebi-Phikwe</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p>{userData.contact_info.state}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  {editingSection === 'contact_info' ? (
                    <Select
                      value={formData.contact_info?.country || ''}
                      onValueChange={(value) => handleInputChange('contact_info', 'country', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Botswana">Botswana</SelectItem>
                        <SelectItem value="South Africa">South Africa</SelectItem>
                        <SelectItem value="Namibia">Namibia</SelectItem>
                        <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p>{userData.contact_info.country}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  {editingSection === 'contact_info' ? (
                    <Input
                      id="postal_code"
                      value={formData.contact_info?.postal_code || ''}
                      onChange={(e) => handleInputChange('contact_info', 'postal_code', e.target.value)}
                    />
                  ) : (
                    <p>{userData.contact_info.postal_code}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Information Section */}
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Social Information</h3>
                {editingSection !== 'social_info' ? (
                  <Button variant="outline" size="sm" onClick={() => startEditing('social_info')}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={cancelEditing}
                      disabled={isSaving}
                    >
                      <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => saveChanges('social_info')}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job_title">Job Title</Label>
                  {editingSection === 'social_info' ? (
                    <div>
                      <Input
                        id="job_title"
                        value={formData.social_info?.job_title || ''}
                        onChange={(e) => handleInputChange('social_info', 'job_title', e.target.value)}
                        className={errors.job_title ? "border-destructive" : ""}
                      />
                      {errors.job_title && (
                        <p className="text-sm text-destructive">{errors.job_title}</p>
                      )}
                    </div>
                  ) : (
                    <p>{userData.social_info.job_title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  {editingSection === 'social_info' ? (
                    <div>
                      <Input
                        id="organization"
                        value={formData.social_info?.organization || ''}
                        onChange={(e) => handleInputChange('social_info', 'organization', e.target.value)}
                        className={errors.organization ? "border-destructive" : ""}
                      />
                      {errors.organization && (
                        <p className="text-sm text-destructive">{errors.organization}</p>
                      )}
                    </div>
                  ) : (
                    <p>{userData.social_info.organization}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  {editingSection === 'social_info' ? (
                    <Input
                      id="linkedin_url"
                      value={formData.social_info?.linkedin_url || ''}
                      onChange={(e) => handleInputChange('social_info', 'linkedin_url', e.target.value)}
                    />
                  ) : (
                    <p>{userData.social_info.linkedin_url}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github_url">GitHub URL</Label>
                  {editingSection === 'social_info' ? (
                    <Input
                      id="github_url"
                      value={formData.social_info?.github_url || ''}
                      onChange={(e) => handleInputChange('social_info', 'github_url', e.target.value)}
                    />
                  ) : (
                    <p>{userData.social_info.github_url}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="website_url">Website URL</Label>
                  {editingSection === 'social_info' ? (
                    <Input
                      id="website_url"
                      value={formData.social_info?.website_url || ''}
                      onChange={(e) => handleInputChange('social_info', 'website_url', e.target.value)}
                    />
                  ) : (
                    <p>{userData.social_info.website_url}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Preferences</h3>
                {editingSection !== 'preferences' ? (
                  <Button variant="outline" size="sm" onClick={() => startEditing('preferences')}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={cancelEditing}
                      disabled={isSaving}
                    >
                      <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => saveChanges('preferences')}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferred_language">Preferred Language</Label>
                  {editingSection === 'preferences' ? (
                    <Select
                      value={formData.preferences?.preferred_language || ''}
                      onValueChange={(value) => handleInputChange('preferences', 'preferred_language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p>{userData.preferences.preferred_language}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  {editingSection === 'preferences' ? (
                    <Select
                      value={formData.preferences?.timezone || ''}
                      onValueChange={(value) => handleInputChange('preferences', 'timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Gaborone">Africa/Gaborone</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p>{userData.preferences.timezone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Security Section (Read-only) */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Account Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email Verified</Label>
                  <Badge variant={userData.account_security.email_verified ? "default" : "secondary"}>
                    {userData.account_security.email_verified ? "Yes" : "No"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label>Two-Factor Authentication</Label>
                  <Badge variant={userData.account_security.two_factor_enabled ? "default" : "secondary"}>
                    {userData.account_security.two_factor_enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label>Account Status</Label>
                  <Badge variant={userData.account_security.is_approved ? "default" : "secondary"}>
                    {userData.account_security.is_approved ? "Approved" : "Pending Approval"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>Failed to load profile data</p>
            <Button onClick={fetchUserProfile} className="mt-4">
              Try Again
            </Button>
          </div>
        )}

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}