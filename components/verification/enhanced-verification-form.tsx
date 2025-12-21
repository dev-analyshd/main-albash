"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  User,
  Building2,
  Briefcase,
  GraduationCap,
  Users,
  ArrowRight,
  ArrowLeft,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  MapPin,
  Phone,
  Mail,
  Globe,
  Image as ImageIcon,
  Link as LinkIcon,
  FileCheck,
  HelpCircle,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import type { UserRole, VerificationStatus } from "@/lib/types"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"

interface VerificationFormProps {
  user: SupabaseUser
  profile: any
  pendingRequest: any
  verificationStatus: VerificationStatus
}

const verificationTypes = [
  { value: "builder", label: "Builder / Individual", icon: User, description: "For individuals with ideas & talents" },
  { value: "student", label: "Student", icon: GraduationCap, description: "For students and learners" },
  {
    value: "institution",
    label: "Institution",
    icon: GraduationCap,
    description: "For schools & educational bodies",
  },
  { value: "business", label: "Small Business", icon: Briefcase, description: "For small businesses & startups" },
  { value: "company", label: "Company", icon: Building2, description: "For established companies" },
  { value: "organization", label: "Organization", icon: Users, description: "For NGOs & non-profits" },
  { value: "creator", label: "Creator / Artist", icon: User, description: "For artists and creators" },
]

// Map UI verification types to database user_role enum values
// DB enum user_role supports: 'builder', 'institution', 'business', 'company', 'organization', 'verifier', 'admin'
// We map UI-only types (student, creator) to 'builder' for compatibility
const mapVerificationTypeToUserRole = (type: string): UserRole => {
  if (type === "student" || type === "creator") {
    return "builder"
  }
  return type as UserRole
}

const steps = [
  { id: 1, title: "Identity", icon: User },
  { id: 2, title: "Role & Department", icon: FileText },
  { id: 3, title: "Evidence", icon: Upload },
  { id: 4, title: "Questions & Test", icon: HelpCircle },
  { id: 5, title: "Review & Submit", icon: CheckCircle },
]

export function EnhancedVerificationForm({ user, profile, pendingRequest, verificationStatus }: VerificationFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [departments, setDepartments] = useState<any[]>([])
  const [loadingDepartments, setLoadingDepartments] = useState(false)
  const [showTest, setShowTest] = useState(false)
  
  const [formData, setFormData] = useState<Record<string, any>>({
    // Step 1: Identity
    fullName: "",
    country: "",
    city: "",
    phone: "",
    profilePhoto: null as File | null,
    nationalId: null as File | null,
    passport: null as File | null,
    studentId: null as File | null,
    businessRegistration: null as File | null,
    institutionLetter: null as File | null,
    
    // Step 2: Role & Department
    verificationType: "",
    department: "",
    
    // Step 3: Evidence
    workSamples: [] as File[],
    portfolio: null as File | null,
    productPhoto: null as File | null,
    certificates: [] as File[],
    awards: [] as File[],
    recommendationLetters: [] as File[],
    videos: [] as File[],
    prototypes: [] as File[],
    links: [] as string[],
    
    // Step 4: Questions
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
    testAnswer: "",
    
    // Agreements
    confirmTruthful: false,
    acceptTerms: false,
    acceptConsequences: false,
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [linkInput, setLinkInput] = useState("")

  // Fetch departments when role is selected
  useEffect(() => {
    if (formData.verificationType) {
      fetchDepartments()
    }
  }, [formData.verificationType])

  const fetchDepartments = async () => {
    setLoadingDepartments(true)
    try {
      const { data, error } = await supabase
        .from("departments")
        .select("*")
        .order("name", { ascending: true })
      
      if (!error && data) {
        setDepartments(data)
      }
    } catch (error) {
      console.error("Error fetching departments:", error)
    } finally {
      setLoadingDepartments(false)
    }
  }

  // If there's a pending request, show status
  if (pendingRequest || verificationStatus === "VERIFICATION_PENDING") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Verification Pending</CardTitle>
            <CardDescription>Your verification request is being reviewed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Status</span>
                <Badge variant="secondary">Under Review</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Submitted</span>
                <span className="text-sm">
                  {pendingRequest?.submitted_at
                    ? new Date(pendingRequest.submitted_at).toLocaleDateString()
                    : "Recently"}
                </span>
              </div>
              {pendingRequest?.verification_type && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm capitalize">{pendingRequest.verification_type}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Our verification team is reviewing your request. You'll be notified once a decision is made. This
              typically takes 2-3 business days.
            </p>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleFileChange = (field: string, files: FileList | null) => {
    if (!files) return
    if (field.includes("[]")) {
      // Array field
      const fieldName = field.replace("[]", "")
      const existingFiles = formData[fieldName] || []
      updateFormData(fieldName, [...existingFiles, ...Array.from(files)])
    } else {
      updateFormData(field, files[0])
    }
  }

  const removeFile = (field: string, index?: number) => {
    if (index !== undefined) {
      const existingFiles = [...(formData[field] || [])]
      existingFiles.splice(index, 1)
      updateFormData(field, existingFiles)
    } else {
      updateFormData(field, null)
    }
  }

  const addLink = () => {
    if (linkInput.trim()) {
      updateFormData("links", [...formData.links, linkInput.trim()])
      setLinkInput("")
    }
  }

  const removeLink = (index: number) => {
    const links = [...formData.links]
    links.splice(index, 1)
    updateFormData("links", links)
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = "Full name is required"
      if (!formData.country) newErrors.country = "Country is required"
      if (!formData.city) newErrors.city = "City is required"
      if (!formData.phone) newErrors.phone = "Phone number is required"
    }

    if (step === 2) {
      if (!formData.verificationType) newErrors.verificationType = "Please select a verification type"
      if (!formData.department) newErrors.department = "Please select a department"
    }

    if (step === 3) {
      // At least one evidence required
      const hasWorkSamples = formData.workSamples?.length > 0
      const hasPortfolio = !!formData.portfolio
      const hasProductPhoto = !!formData.productPhoto
      const hasLinks = formData.links?.length > 0
      
      if (!hasWorkSamples && !hasPortfolio && !hasProductPhoto && !hasLinks) {
        newErrors.evidence = "Please upload at least one work sample, portfolio, product photo, or link"
      }
    }

    if (step === 4) {
      if (!formData.question1) newErrors.question1 = "This question is required"
      if (!formData.question2) newErrors.question2 = "This question is required"
      if (!formData.question3) newErrors.question3 = "This question is required"
      if (!formData.question4) newErrors.question4 = "This question is required"
      if (!formData.question5) newErrors.question5 = "This question is required"
    }

    if (step === 5) {
      if (!formData.confirmTruthful) newErrors.confirmTruthful = "You must confirm information is truthful"
      if (!formData.acceptTerms) newErrors.acceptTerms = "You must accept the terms"
      if (!formData.acceptConsequences) newErrors.acceptConsequences = "You must accept the consequences"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setErrors({})
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setErrors({})
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    setErrors({})

    try {
      // Upload all files
      const uploadPromises: Promise<string | null>[] = []
      const uploadedFiles: Record<string, string | string[]> = {}

      // Profile photo
      if (formData.profilePhoto) {
        uploadPromises.push(uploadFile(formData.profilePhoto, "profile-photo"))
      }

      // Optional documents
      const optionalDocs = [
        { key: "nationalId", file: formData.nationalId },
        { key: "passport", file: formData.passport },
        { key: "studentId", file: formData.studentId },
        { key: "businessRegistration", file: formData.businessRegistration },
        { key: "institutionLetter", file: formData.institutionLetter },
      ]

      optionalDocs.forEach(({ key, file }) => {
        if (file) {
          uploadPromises.push(uploadFile(file, key))
        }
      })

      // Evidence files
      if (formData.portfolio) {
        uploadPromises.push(uploadFile(formData.portfolio, "portfolio"))
      }
      if (formData.productPhoto) {
        uploadPromises.push(uploadFile(formData.productPhoto, "product-photo"))
      }

      // Array files
      const arrayFiles = [
        { key: "workSamples", files: formData.workSamples },
        { key: "certificates", files: formData.certificates },
        { key: "awards", files: formData.awards },
        { key: "recommendationLetters", files: formData.recommendationLetters },
        { key: "videos", files: formData.videos },
        { key: "prototypes", files: formData.prototypes },
      ]

      arrayFiles.forEach(({ key, files }) => {
        if (files?.length > 0) {
          Promise.all(files.map((f: File) => uploadFile(f, key))).then((urls) => {
            uploadedFiles[key] = urls.filter((u): u is string => u !== null)
          })
        }
      })

      await Promise.all(uploadPromises)

      // Prepare submission data
      const submissionData = {
        verificationType: formData.verificationType,
        department: formData.department,
        identity: {
          fullName: formData.fullName,
          country: formData.country,
          city: formData.city,
          phone: formData.phone,
        },
        evidence: {
          workSamples: formData.workSamples?.length > 0 ? "uploaded" : null,
          portfolio: formData.portfolio ? "uploaded" : null,
          productPhoto: formData.productPhoto ? "uploaded" : null,
          links: formData.links || [],
        },
        questions: {
          question1: formData.question1,
          question2: formData.question2,
          question3: formData.question3,
          question4: formData.question4,
          question5: formData.question5,
        },
        testAnswer: showTest ? formData.testAnswer : null,
      }

      // Create verification request
      const { data, error } = await supabase
        .from("verification_requests")
        .insert({
          user_id: user.id,
          // Map UI verification type to valid user_role enum
          verification_type: mapVerificationTypeToUserRole(formData.verificationType),
          // Preserve original UI type in form_data for reviewers
          form_data: { ...submissionData, uiVerificationType: formData.verificationType },
          documents: uploadedFiles,
          status: "pending",
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Verification Submitted",
        description: "Your verification request has been submitted successfully.",
      })

      router.push("/dashboard?verification=pending")
      router.refresh()
    } catch (error: any) {
      let errorMessage = "An error occurred while submitting your verification request"

      // Handle common Supabase/Postgres errors explicitly
      if (error?.code === "23505") {
        errorMessage =
          "You already have a pending verification request. Please wait for a decision before submitting a new one."
      } else if (error?.code === "42501") {
        errorMessage =
          "Permission denied for verification submission. Please ensure you are signed in and have the required access."
      } else if (
        typeof error?.message === "string" &&
        error.message.toLowerCase().includes("invalid input value for enum user_role")
      ) {
        errorMessage =
          "Selected verification type is not yet supported by the system. Please choose a different type or contact support."
      } else if (
        typeof error?.message === "string" &&
        error.message.toLowerCase().includes("verification_requests")
      ) {
        errorMessage =
          "Verification system tables are missing or migrations have not been run. Please run the verification migration scripts."
      } else if (error instanceof Error) {
        errorMessage = error.message
      } else if (error?.message) {
        errorMessage = error.message
      } else if (error?.error_description) {
        errorMessage = error.error_description
      } else if (typeof error === "string") {
        errorMessage = error
      }

      // Log full error for debugging (including stringified fallback)
      let serialized = ""
      try {
        serialized = JSON.stringify(error)
      } catch (_) {
        serialized = String(error)
      }

      // If we still have a generic message and nothing meaningful, surface the serialized blob
      if (errorMessage === "An error occurred while submitting your verification request" && serialized) {
        errorMessage = `Verification failed: ${serialized}`
      }

      console.error("Verification submission error:", {
        raw: error,
        serialized,
        message: errorMessage,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
      })

      setErrors({ submit: errorMessage })
      toast({
        title: "Submission Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const uploadFile = async (file: File, category: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}/${category}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, file)

      if (uploadError) {
        console.warn("File upload error:", uploadError)
        return null
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("documents").getPublicUrl(fileName)
      return publicUrl
    } catch (error) {
      console.warn("File upload failed:", error)
      return null
    }
  }

  const progress = (currentStep / steps.length) * 100
  const selectedType = verificationTypes.find((t) => t.value === formData.verificationType)
  const TypeIcon = selectedType?.icon || FileText

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="mb-6">
            <CardTitle className="text-3xl mb-2">Verify Your Identity & Work</CardTitle>
            <CardDescription className="text-base">
              Verification unlocks marketplace access, community participation, tokenization, and reputation across
              AlbashSolution.
            </CardDescription>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-4 text-sm text-muted-foreground">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-secondary"
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
                </div>
                <span className="hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Step 1: Identity Confirmation */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Identity Confirmation</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Ensure one real person / entity = one identity. Optional documents boost your trust score.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="fullName">Full Name / Business Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      placeholder="+1234567890"
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => updateFormData("country", e.target.value)}
                    placeholder="Your country"
                  />
                  {errors.country && <p className="text-sm text-destructive mt-1">{errors.country}</p>}
                </div>

                <div>
                  <Label htmlFor="city">City / Region *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    placeholder="Your city"
                  />
                  {errors.city && <p className="text-sm text-destructive mt-1">{errors.city}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email (Already verified)
                </Label>
                <Input id="email" value={user.email || ""} disabled className="bg-muted" />
              </div>

              <div>
                <Label>Profile Photo *</Label>
                <div className="flex items-center gap-4 mt-2">
                  {formData.profilePhoto ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={URL.createObjectURL(formData.profilePhoto)} />
                        <AvatarFallback>{(formData.fullName || "U")[0]}</AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateFormData("profilePhoto", null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg hover:bg-accent">
                        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Upload Photo</span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange("profilePhoto", e.target.files)}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Optional Documents (Boost Trust Score)</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>National ID / Passport</Label>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange("nationalId", e.target.files)}
                    />
                  </div>
                  <div>
                    <Label>Student ID</Label>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange("studentId", e.target.files)}
                    />
                  </div>
                  <div>
                    <Label>Business Registration</Label>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange("businessRegistration", e.target.files)}
                    />
                  </div>
                  <div>
                    <Label>Institution Letter</Label>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange("institutionLetter", e.target.files)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Role & Department */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Role & Department Selection</h3>
                <p className="text-sm text-muted-foreground mb-6">Who are you verifying as?</p>
              </div>

              <div>
                <Label className="text-base font-semibold mb-4 block">Select Verification Type *</Label>
                <div className="grid gap-3">
                  {verificationTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => updateFormData("verificationType", type.value)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          formData.verificationType === type.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              formData.verificationType === type.value ? "bg-primary/10" : "bg-secondary"
                            }`}
                          >
                            <Icon className={`h-5 w-5 ${formData.verificationType === type.value ? "text-primary" : ""}`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-muted-foreground">{type.description}</div>
                          </div>
                          {formData.verificationType === type.value && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
                {errors.verificationType && (
                  <p className="text-sm text-destructive mt-2">{errors.verificationType}</p>
                )}
              </div>

              {formData.verificationType && (
                <div>
                  <Label htmlFor="department">Which department best matches your work? *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => updateFormData("department", value)}
                    disabled={loadingDepartments}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-sm text-destructive mt-1">{errors.department}</p>}
                  {loadingDepartments && <p className="text-sm text-muted-foreground mt-1">Loading departments...</p>}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Evidence Upload */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Evidence Upload</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Upload what proves your work — not what proves perfection.
                </p>
                <p className="text-sm font-medium text-destructive">At least one piece of evidence is required.</p>
              </div>

              {errors.evidence && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                  {errors.evidence}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <Label>Work Samples / Portfolio *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.workSamples?.map((file: File, index: number) => (
                      <Badge key={index} variant="secondary" className="gap-2">
                        {file.name}
                        <button
                          type="button"
                          onClick={() => removeFile("workSamples", index)}
                          className="hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => handleFileChange("workSamples[]", e.target.files)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Portfolio (Optional)</Label>
                  {formData.portfolio && (
                    <div className="flex items-center gap-2 mt-2 mb-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{formData.portfolio.name}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("portfolio")}>
                        Remove
                      </Button>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept=".pdf,.zip"
                    onChange={(e) => handleFileChange("portfolio", e.target.files)}
                  />
                </div>

                <div>
                  <Label>Product Photo (Optional)</Label>
                  {formData.productPhoto && (
                    <div className="mt-2 mb-2">
                      <img
                        src={URL.createObjectURL(formData.productPhoto)}
                        alt="Product"
                        className="h-32 w-32 object-cover rounded"
                      />
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("productPhoto")}>
                        Remove
                      </Button>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange("productPhoto", e.target.files)}
                  />
                </div>

                <div>
                  <Label>Links (GitHub, Behance, Google Drive, etc.)</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="url"
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      placeholder="https://example.com"
                      onKeyPress={(e) => e.key === "Enter" && addLink()}
                    />
                    <Button type="button" onClick={addLink}>
                      Add
                    </Button>
                  </div>
                  {formData.links?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.links.map((link: string, index: number) => (
                        <Badge key={index} variant="secondary" className="gap-2">
                          <LinkIcon className="h-3 w-3" />
                          <a href={link} target="_blank" rel="noopener noreferrer" className="max-w-xs truncate">
                            {link}
                          </a>
                          <button
                            type="button"
                            onClick={() => removeLink(index)}
                            className="hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Additional Evidence (Optional)</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Certificates</Label>
                      <Input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange("certificates[]", e.target.files)}
                      />
                    </div>
                    <div>
                      <Label>Awards</Label>
                      <Input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange("awards[]", e.target.files)}
                      />
                    </div>
                    <div>
                      <Label>Recommendation Letters</Label>
                      <Input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange("recommendationLetters[]", e.target.files)}
                      />
                    </div>
                    <div>
                      <Label>Videos / Prototypes</Label>
                      <Input
                        type="file"
                        multiple
                        accept="video/*,.zip"
                        onChange={(e) => handleFileChange("videos[]", e.target.files)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Questions & Test */}
          {currentStep === 4 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Questions & Test</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Answer these questions to help us understand your work. The optional test boosts your trust score.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="question1">1. Describe what you want to build or offer. *</Label>
                  <Textarea
                    id="question1"
                    value={formData.question1}
                    onChange={(e) => updateFormData("question1", e.target.value)}
                    placeholder="200-500 characters"
                    rows={4}
                    maxLength={500}
                  />
                  {errors.question1 && <p className="text-sm text-destructive mt-1">{errors.question1}</p>}
                </div>

                <div>
                  <Label htmlFor="question2">2. Why should your work be trusted? *</Label>
                  <Textarea
                    id="question2"
                    value={formData.question2}
                    onChange={(e) => updateFormData("question2", e.target.value)}
                    placeholder="200-500 characters"
                    rows={4}
                    maxLength={500}
                  />
                  {errors.question2 && <p className="text-sm text-destructive mt-1">{errors.question2}</p>}
                </div>

                <div>
                  <Label htmlFor="question3">3. Who benefits from this? *</Label>
                  <Textarea
                    id="question3"
                    value={formData.question3}
                    onChange={(e) => updateFormData("question3", e.target.value)}
                    placeholder="200-500 characters"
                    rows={4}
                    maxLength={500}
                  />
                  {errors.question3 && <p className="text-sm text-destructive mt-1">{errors.question3}</p>}
                </div>

                <div>
                  <Label htmlFor="question4">4. Is this idea/product original or adapted? *</Label>
                  <Textarea
                    id="question4"
                    value={formData.question4}
                    onChange={(e) => updateFormData("question4", e.target.value)}
                    placeholder="200-500 characters"
                    rows={4}
                    maxLength={500}
                  />
                  {errors.question4 && <p className="text-sm text-destructive mt-1">{errors.question4}</p>}
                </div>

                <div>
                  <Label htmlFor="question5">5. Are you open to collaboration? *</Label>
                  <Textarea
                    id="question5"
                    value={formData.question5}
                    onChange={(e) => updateFormData("question5", e.target.value)}
                    placeholder="200-500 characters"
                    rows={4}
                    maxLength={500}
                  />
                  {errors.question5 && <p className="text-sm text-destructive mt-1">{errors.question5}</p>}
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-base font-semibold">Department-Specific Test (Optional)</Label>
                    <p className="text-sm text-muted-foreground">Taking the test boosts your trust score</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTest(!showTest)}
                  >
                    {showTest ? "Hide Test" : "Take Test (Recommended)"}
                  </Button>
                </div>

                {showTest && (
                  <div className="space-y-4 bg-secondary/50 p-4 rounded-lg">
                    <div>
                      <Label htmlFor="testAnswer">
                        {formData.verificationType === "builder" || formData.verificationType === "creator"
                          ? "Describe your creative process or problem-solving approach."
                          : formData.verificationType === "institution"
                          ? "Explain your student handling and verification process."
                          : "Describe your quality assurance or supply process."}
                      </Label>
                      <Textarea
                        id="testAnswer"
                        value={formData.testAnswer}
                        onChange={(e) => updateFormData("testAnswer", e.target.value)}
                        placeholder="Your answer here..."
                        rows={6}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Note: Test failure does not lead to rejection. No test = slower verification.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Review & Submit</h3>
                <p className="text-sm text-muted-foreground mb-6">Review your information before submitting</p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-6 space-y-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Verification Type</span>
                  <p className="font-medium capitalize">{formData.verificationType}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Name</span>
                  <p className="font-medium">{formData.fullName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Location</span>
                  <p className="font-medium">
                    {formData.city}, {formData.country}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Phone</span>
                  <p className="font-medium">{formData.phone}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Department</span>
                  <p className="font-medium">
                    {departments.find((d) => d.id === formData.department)?.name || "Not selected"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Evidence</span>
                  <p className="font-medium">
                    {formData.workSamples?.length || 0} work sample(s), {formData.links?.length || 0} link(s)
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="confirmTruthful"
                    checked={formData.confirmTruthful}
                    onCheckedChange={(checked) => updateFormData("confirmTruthful", checked)}
                  />
                  <Label htmlFor="confirmTruthful" className="cursor-pointer">
                    I confirm all information is true
                  </Label>
                </div>
                {errors.confirmTruthful && (
                  <p className="text-sm text-destructive ml-7">{errors.confirmTruthful}</p>
                )}

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => updateFormData("acceptTerms", checked)}
                  />
                  <Label htmlFor="acceptTerms" className="cursor-pointer">
                    I accept AlbashSolution Terms & Privacy
                  </Label>
                </div>
                {errors.acceptTerms && <p className="text-sm text-destructive ml-7">{errors.acceptTerms}</p>}

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="acceptConsequences"
                    checked={formData.acceptConsequences}
                    onCheckedChange={(checked) => updateFormData("acceptConsequences", checked)}
                  />
                  <Label htmlFor="acceptConsequences" className="cursor-pointer">
                    I agree that false claims may lead to suspension
                  </Label>
                </div>
                {errors.acceptConsequences && (
                  <p className="text-sm text-destructive ml-7">{errors.acceptConsequences}</p>
                )}
              </div>

              {errors.submit && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Submission Error</p>
                    <p>{errors.submit}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={nextStep} className="gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Submit for Verification
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

