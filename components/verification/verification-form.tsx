"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import type { UserRole, VerificationStatus } from "@/lib/types"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface VerificationFormProps {
  user: SupabaseUser
  profile: any
  pendingRequest: any
  verificationStatus: VerificationStatus
}

const verificationTypes = [
  { value: "builder", label: "Builder", icon: User, description: "For individuals with ideas & talents" },
  {
    value: "institution",
    label: "Institution",
    icon: GraduationCap,
    description: "For schools & educational bodies",
  },
  { value: "business", label: "Small Business", icon: Briefcase, description: "For small businesses & startups" },
  { value: "company", label: "Company", icon: Building2, description: "For established companies" },
  { value: "organization", label: "Organization", icon: Users, description: "For NGOs & non-profits" },
]

const steps = [
  { id: 1, title: "Type", icon: FileText },
  { id: 2, title: "Details", icon: User },
  { id: 3, title: "Documents", icon: Upload },
  { id: 4, title: "Review", icon: CheckCircle },
]

export function VerificationForm({ user, profile, pendingRequest, verificationStatus }: VerificationFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationType, setVerificationType] = useState<UserRole | "">("")
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [documents, setDocuments] = useState<File[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!verificationType) newErrors.verificationType = "Please select a verification type"
    }

    if (step === 2) {
      if (!formData.fullName) newErrors.fullName = "Full name is required"
      if (!formData.description) newErrors.description = "Description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      // Clear errors when moving to next step
      setErrors({})
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files))
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    // Clear previous errors
    setErrors({})

    try {
      const supabase = createClient()

      // Upload documents if any
      let documentUrls: string[] = []
      if (documents.length > 0) {
        try {
          const uploadPromises = documents.map(async (file) => {
            try {
              const fileExt = file.name.split(".").pop()
              const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
              const { data: uploadData, error: uploadError } = await supabase.storage
                .from("documents")
                .upload(fileName, file)

              if (uploadError) {
                console.warn("Document upload error:", uploadError.message || uploadError)
                // Continue without this document if upload fails
                return null
              }

              const {
                data: { publicUrl },
              } = supabase.storage.from("documents").getPublicUrl(fileName)
              return publicUrl
            } catch (uploadErr: any) {
              console.warn("Document upload failed:", uploadErr?.message || uploadErr)
              return null
            }
          })

          const results = await Promise.all(uploadPromises)
          documentUrls = results.filter((url): url is string => url !== null)
          
          // Warn if some documents failed to upload
          if (documentUrls.length < documents.length) {
            console.warn(`Only ${documentUrls.length} of ${documents.length} documents uploaded successfully`)
          }
        } catch (uploadError: any) {
          // If document upload fails completely, continue without documents
          console.warn("Document upload process failed:", uploadError?.message || uploadError)
          // Allow submission to continue without documents
        }
      }

      // Create verification request
      const { data, error } = await supabase
        .from("verification_requests")
        .insert({
          user_id: user.id,
          verification_type: verificationType as UserRole,
          form_data: formData,
          documents: documentUrls,
          status: "pending",
        })
        .select()
        .single()

      if (error) throw error

      // Redirect to dashboard
      router.push("/dashboard?verification=pending")
      router.refresh()
    } catch (error: any) {
      // Extract meaningful error message from Supabase error or standard Error
      let errorMessage = "An error occurred while submitting your verification request"
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (error?.message) {
        errorMessage = error.message
      } else if (error?.error_description) {
        errorMessage = error.error_description
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      // Log error details for debugging (avoid logging entire error object)
      console.error("Verification submission error:", {
        message: errorMessage,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
      })
      
      setErrors({ submit: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = (currentStep / steps.length) * 100
  const selectedType = verificationTypes.find((t) => t.value === verificationType)
  const TypeIcon = selectedType?.icon || FileText

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-2xl">Request Verification</CardTitle>
              <CardDescription>Get verified to unlock full platform features</CardDescription>
            </div>
            <Badge variant="outline">{verificationStatus.replace("_", " ")}</Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Verification Type */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <Label className="text-base font-semibold mb-4 block">Select Verification Type</Label>
                <div className="grid gap-3">
                  {verificationTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          setVerificationType(type.value as UserRole)
                          updateFormData("verificationType", type.value)
                        }}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          verificationType === type.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              verificationType === type.value ? "bg-primary/10" : "bg-secondary"
                            }`}
                          >
                            <Icon className={`h-5 w-5 ${verificationType === type.value ? "text-primary" : ""}`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-muted-foreground">{type.description}</div>
                          </div>
                          {verificationType === type.value && (
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
            </motion.div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="fullName">Full Name / Business Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName || ""}
                  onChange={(e) => updateFormData("fullName", e.target.value)}
                  placeholder="Enter your full name or business name"
                />
                {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  placeholder="Tell us about yourself, your business, or organization"
                  rows={5}
                />
                {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
              </div>
              {verificationType === "business" || verificationType === "company" ? (
                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website || ""}
                    onChange={(e) => updateFormData("website", e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              ) : null}
            </motion.div>
          )}

          {/* Step 3: Documents */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="documents">Supporting Documents (Optional)</Label>
                <Input
                  id="documents"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Upload identification, business registration, or other supporting documents
                </p>
                {documents.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {documents.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Verification Type</span>
                  <p className="font-medium capitalize">{verificationType}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Name</span>
                  <p className="font-medium">{formData.fullName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Description</span>
                  <p className="text-sm">{formData.description}</p>
                </div>
                {formData.website && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Website</span>
                    <p className="text-sm">{formData.website}</p>
                  </div>
                )}
                {documents.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Documents</span>
                    <p className="text-sm">{documents.length} file(s) uploaded</p>
                  </div>
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
                {isSubmitting ? "Submitting..." : "Submit Verification Request"}
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

