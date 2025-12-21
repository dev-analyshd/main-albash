"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X, Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

export default function PortfolioBuilderPage() {
  const [formData, setFormData] = useState({
    name: "John Doe",
    title: "Full Stack Developer",
    bio: "Passionate about building innovative solutions",
    email: "john@example.com",
    github: "",
    linkedin: "",
    skills: ["React", "Node.js", "TypeScript"],
    projects: [
      {
        id: 1,
        name: "E-commerce Platform",
        description: "Built a scalable online marketplace",
        tech: ["Next.js", "PostgreSQL"],
      },
    ],
  })

  const [newSkill, setNewSkill] = useState("")
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] })
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) })
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 bg-background border-b">
        <div className="flex items-center justify-between px-4 h-14 container mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/studio">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-semibold">Portfolio Builder</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              Toggle Theme
            </Button>
            <Button>Publish</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 grid gap-8 lg:grid-cols-2">
        {/* Editor */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Build Your Portfolio</h2>
            <p className="text-muted-foreground">Create a professional portfolio to showcase your work</p>
          </div>

          <Card className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact & Social</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    placeholder="username"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    placeholder="username"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Skills</h3>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                />
                <Button onClick={addSkill} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-20 h-fit">
          <h3 className="font-semibold mb-4">Live Preview</h3>
          <div
            className={`rounded-lg shadow-xl overflow-hidden ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
          >
            <div
              className={`p-8 ${theme === "dark" ? "bg-gradient-to-br from-blue-600 to-purple-600" : "bg-gradient-to-br from-blue-100 to-purple-100"}`}
            >
              <div className="w-24 h-24 rounded-full bg-white/20 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-center mb-2">{formData.name}</h1>
              <p className={`text-center ${theme === "dark" ? "text-blue-100" : "text-blue-900"}`}>{formData.title}</p>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">About</h2>
                <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>{formData.bio}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className={theme === "dark" ? "bg-gray-800" : "bg-gray-100"}>
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Projects</h2>
                {formData.projects.map((project) => (
                  <Card
                    key={project.id}
                    className={`p-4 mb-3 ${theme === "dark" ? "bg-gray-800 border-gray-700" : ""}`}
                  >
                    <h3 className="font-semibold mb-2">{project.name}</h3>
                    <p className={`text-sm mb-3 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <Badge key={t} variant="outline" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Contact</h2>
                <div className="flex gap-4">
                  {formData.email && (
                    <a href={`mailto:${formData.email}`} className="hover:text-primary">
                      <Mail className="h-5 w-5" />
                    </a>
                  )}
                  {formData.github && (
                    <a href={`https://github.com/${formData.github}`} className="hover:text-primary">
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {formData.linkedin && (
                    <a href={`https://linkedin.com/in/${formData.linkedin}`} className="hover:text-primary">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
