"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Building2,
  Briefcase,
  FileText,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/client"
import type { UserRole } from "@/lib/types"

interface ApplicationFormProps {
  applicationType: UserRole
}

const typeConfig = {
  builder: {
    icon: User,
    title: "Builder Application",
    description: "For individuals with ideas, talents, and creative projects",
    color: "text-chart-1",
  },
  institution: {
    icon: GraduationCap,
    title: "Institution Application",
    description: "For schools, universities, and educational organizations",
    color: "text-chart-2",
  },
  business: {
    icon: Briefcase,
    title: "Small Business Application",
    description: "For small businesses and startups",
    color: "text-chart-3",
  },
  company: {
    icon: Building2,
    title: "Company Application",
    description: "For established companies and enterprises",
    color: "text-chart-4",
  },
  organization: {
    icon: Users,
    title: "Organization Application",
    description: "For NGOs, non-profits, and community organizations",
    color: "text-chart-5",
  },
  verifier: {
    icon: User,
    title: "Verifier Application",
    description: "For verifiers",
    color: "text-primary",
  },
  admin: {
    icon: User,
    title: "Admin Application",
    description: "For admins",
    color: "text-primary",
  },
}

const steps = [
  { id: 1, title: "Account", icon: User },
  { id: 2, title: "Details", icon: FileText },
  { id: 3, title: "Documents", icon: Upload },
  { id: 4, title: "Review", icon: CheckCircle },
]

export function ApplicationForm({ applicationType }: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [applicationId, setApplicationId] = useState("")
  const router = useRouter()

  const [formData, setFormData] = useState({
    // Account
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    // Details
    title: "",
    description: "",
    category: "",
    website: "",
    phone: "",
    location: "",
    // Documents
    documents: [] as File[],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const config = typeConfig[applicationType]
  const Icon = config.icon

  const updateFormData = (field: string, value: string | File[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.email) newErrors.email = "Email is required"
      if (!formData.password) newErrors.password = "Password is required"
      if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
      if (!formData.fullName) newErrors.fullName = "Full name is required"
    }

    if (step === 2) {
      if (!formData.title) newErrors.title = "Title is required"
      if (!formData.description) newErrors.description = "Description is required"
      if (!formData.category) newErrors.category = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const supabase = createClient()

      // Generate tracking code first
      const generatedId = `APP-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/dashboard/${applicationType}`,
          data: {
            full_name: formData.fullName,
            role: applicationType,
          },
        },
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error("Failed to create user account")
      }

      // Upload documents if any
      let documentUrls: string[] = []
      if (formData.documents.length > 0) {
        try {
          const uploadPromises = formData.documents.map(async (file) => {
            const fileExt = file.name.split(".").pop()
            const fileName = `${authData.user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from("documents")
              .upload(fileName, file)

            if (uploadError) {
              console.warn("Document upload error:", uploadError)
              // Don't throw - continue without this document
              return null
            }

            const {
              data: { publicUrl },
            } = supabase.storage.from("documents").getPublicUrl(fileName)
            return publicUrl
          })

          const results = await Promise.all(uploadPromises)
          documentUrls = results.filter((url): url is string => url !== null)
        } catch (uploadErr) {
          console.warn("Some documents failed to upload:", uploadErr)
          // Continue without documents - they can be uploaded later
        }
      }

      // Create application record
      const { data: applicationData, error: appError } = await supabase
        .from("applications")
        .insert({
          user_id: authData.user.id,
          application_type: applicationType,
          title: formData.title,
          description: formData.description,
          documents: documentUrls,
          status: "pending",
          tracking_code: generatedId,
        })
        .select()
        .single()

      if (appError) {
        console.error("Application creation error:", appError)
        // Don't throw - user account is created, we can show the tracking code
        // The application might be created later via a trigger or manual process
      }

      setApplicationId(generatedId)
      setIsComplete(true)
    } catch (error) {
      console.error("Application error:", error)
      setErrors({ submit: error instanceof Error ? error.message : "An error occurred" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      updateFormData("documents", Array.from(e.target.files))
    }
  }

  const progress = (currentStep / steps.length) * 100

  if (isComplete) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <Card className="text-center">
            <CardHeader>
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Application Submitted!</CardTitle>
              <CardDescription>Your application has been received and is pending review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-secondary/50 rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-1">Your Application ID</p>
                <p className="text-xl font-mono font-bold text-primary">{applicationId}</p>
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <p>Please check your email to verify your account.</p>
                <p>Our verification team will review your application within 2-3 business days.</p>
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={() => router.push(`/check-status?id=${applicationId}`)} className="w-full">
                  Track Application Status
                </Button>
                <Button variant="outline" onClick={() => router.push("/")} className="w-full bg-transparent">
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <div className={`w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4`}>
            <Icon className={`h-8 w-8 ${config.color}`} />
          </div>
          <h1 className="text-3xl font-bold mb-2">{config.title}</h1>
          <p className="text-muted-foreground">{config.description}</p>
        </div>

        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <Progress value={progress} className="h-2 mb-4" />
          <div className="flex justify-between">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-secondary"
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Account */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => updateFormData("fullName", e.target.value)}
                      />
                      {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={formData.password}
                        onChange={(e) => updateFormData("password", e.target.value)}
                      />
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Repeat your password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                      />
                      {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Details */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="title">
                        {applicationType === "builder" ? "Project/Idea Title" : "Organization Name"}
                      </Label>
                      <Input
                        id="title"
                        placeholder={applicationType === "builder" ? "My Amazing Idea" : "Organization Name"}
                        value={formData.title}
                        onChange={(e) => updateFormData("title", e.target.value)}
                      />
                      {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(v) => updateFormData("category", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ideas">Ideas & Innovations</SelectItem>
                          <SelectItem value="talents">Talents & Skills</SelectItem>
                          <SelectItem value="digital">Digital Products</SelectItem>
                          <SelectItem value="physical">Physical Products</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="educational">Educational</SelectItem>
                          <SelectItem value="art">Art & Design</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Tell us about your idea, talent, or organization..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => updateFormData("description", e.target.value)}
                      />
                      {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website (Optional)</Label>
                        <Input
                          id="website"
                          type="url"
                          placeholder="https://example.com"
                          value={formData.website}
                          onChange={(e) => updateFormData("website", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => updateFormData("phone", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="City, Country"
                        value={formData.location}
                        onChange={(e) => updateFormData("location", e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Documents */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <h3 className="font-semibold mb-2">Upload Supporting Documents</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Upload any relevant documents such as ID, certificates, portfolio, or business registration.
                      </p>
                    </div>

                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors">
                      <input
                        type="file"
                        id="documents"
                        multiple
                        className="hidden"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="documents" className="cursor-pointer">
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="font-medium mb-1">Click to upload or drag and drop</p>
                        <p className="text-sm text-muted-foreground">PDF, DOC, PNG, JPG up to 10MB each</p>
                      </label>
                    </div>

                    {formData.documents.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Uploaded Files:</p>
                        {formData.documents.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm bg-secondary/50 rounded-lg px-3 py-2"
                          >
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="flex-1 truncate">{file.name}</span>
                            <span className="text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground text-center">
                      Documents are optional but recommended for faster verification
                    </p>
                  </motion.div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h3 className="font-semibold mb-2">Review Your Application</h3>
                      <p className="text-sm text-muted-foreground">Please review your information before submitting</p>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-secondary/30 rounded-xl p-4">
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Account Information</h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-muted-foreground">Name:</span> {formData.fullName}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Email:</span> {formData.email}
                          </p>
                        </div>
                      </div>

                      <div className="bg-secondary/30 rounded-xl p-4">
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Application Details</h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-muted-foreground">Title:</span> {formData.title}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Category:</span> {formData.category}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Description:</span> {formData.description}
                          </p>
                          {formData.website && (
                            <p>
                              <span className="text-muted-foreground">Website:</span> {formData.website}
                            </p>
                          )}
                          {formData.location && (
                            <p>
                              <span className="text-muted-foreground">Location:</span> {formData.location}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-secondary/30 rounded-xl p-4">
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Documents</h4>
                        <p className="text-sm">
                          {formData.documents.length > 0
                            ? `${formData.documents.length} file(s) uploaded`
                            : "No documents uploaded"}
                        </p>
                      </div>
                    </div>

                    {errors.submit && (
                      <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">{errors.submit}</div>
                    )}

                    <p className="text-xs text-muted-foreground text-center">
                      By submitting, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="gap-2 bg-transparent"
                >
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
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
