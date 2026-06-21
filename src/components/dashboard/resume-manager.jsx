"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Trash2, Briefcase, GraduationCap, Wrench, Award } from "lucide-react"

export function ResumeManager({ userId }) {
  const [experiences, setExperiences] = useState([])
  const [education, setEducation] = useState([])
  const [skills, setSkills] = useState([])
  const [certifications, setCertifications] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = () => setRefreshKey((k) => k + 1)

  useEffect(() => {
    let active = true
    const load = async () => {
      const [exp, edu, sk, cert] = await Promise.all([
        supabase.from("experiences").select("*").eq("user_id", userId).order("sort_order"),
        supabase.from("education").select("*").eq("user_id", userId).order("sort_order"),
        supabase.from("skills").select("*").eq("user_id", userId).order("sort_order"),
        supabase.from("certifications").select("*").eq("user_id", userId).order("sort_order"),
      ])
      if (!active) return
      setExperiences(exp.data || [])
      setEducation(edu.data || [])
      setSkills(sk.data || [])
      setCertifications(cert.data || [])
    }
    load()
    return () => {
      active = false
    }
  }, [userId, refreshKey])

  return (
    <div className="space-y-6">
      <ExperienceSection userId={userId} items={experiences} onChange={refresh} />
      <EducationSection userId={userId} items={education} onChange={refresh} />
      <SkillsSection userId={userId} items={skills} onChange={refresh} />
      <CertificationsSection userId={userId} items={certifications} onChange={refresh} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */
function ExperienceSection({ userId, items, onChange }) {
  const [form, setForm] = useState({ title: "", company: "", location: "", start_date: "", end_date: "", description: "" })
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from("experiences").insert({
        user_id: userId,
        ...form,
        sort_order: items.length,
      })
      if (error) {
        toast.error("Failed to add experience")
      } else {
        toast.success("Experience added!")
        setForm({ title: "", company: "", location: "", start_date: "", end_date: "", description: "" })
        onChange()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from("experiences").delete().eq("id", id)
    if (error) toast.error("Failed to delete")
    else {
      toast.success("Experience deleted")
      onChange()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-accent" />
          Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exp-title">Title</Label>
              <Input
                id="exp-title"
                placeholder="Software Engineer"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-company">Company</Label>
              <Input
                id="exp-company"
                placeholder="Company name"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exp-location">Location</Label>
              <Input
                id="exp-location"
                placeholder="City"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-start">Start</Label>
              <Input
                id="exp-start"
                placeholder="05/2025"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-end">End</Label>
              <Input
                id="exp-end"
                placeholder="Present"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-desc">Description (one bullet per line)</Label>
            <Textarea
              id="exp-desc"
              placeholder={"Maintained an enterprise BPM platform...\nOptimized SQL Server stored procedures..."}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Experience"}
          </Button>
        </form>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 p-4 border rounded-lg">
              <div className="min-w-0">
                <p className="font-medium">
                  {item.title}
                  {item.company ? ` · ${item.company}` : ""}
                </p>
                <p className="text-sm text-muted-foreground">
                  {[item.location, [item.start_date, item.end_date].filter(Boolean).join(" – ")]
                    .filter(Boolean)
                    .join(" | ")}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Education                                                           */
/* ------------------------------------------------------------------ */
function EducationSection({ userId, items, onChange }) {
  const [form, setForm] = useState({ degree: "", school: "", location: "", start_date: "", end_date: "", details: "" })
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from("education").insert({
        user_id: userId,
        ...form,
        sort_order: items.length,
      })
      if (error) {
        toast.error("Failed to add education")
      } else {
        toast.success("Education added!")
        setForm({ degree: "", school: "", location: "", start_date: "", end_date: "", details: "" })
        onChange()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from("education").delete().eq("id", id)
    if (error) toast.error("Failed to delete")
    else {
      toast.success("Education deleted")
      onChange()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-accent" />
          Education
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edu-degree">Degree</Label>
              <Input
                id="edu-degree"
                placeholder="B.Sc. Information Technology"
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edu-school">School</Label>
              <Input
                id="edu-school"
                placeholder="University name"
                value={form.school}
                onChange={(e) => setForm({ ...form, school: e.target.value })}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edu-location">Location</Label>
              <Input
                id="edu-location"
                placeholder="City"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edu-start">Start</Label>
              <Input
                id="edu-start"
                placeholder="10/2020"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edu-end">End</Label>
              <Input
                id="edu-end"
                placeholder="01/2025"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edu-details">Details (one bullet per line)</Label>
            <Textarea
              id="edu-details"
              placeholder={"GPA: 3.15 / 4.0\nRelevant coursework: ..."}
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              rows={3}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Education"}
          </Button>
        </form>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 p-4 border rounded-lg">
              <div className="min-w-0">
                <p className="font-medium">{item.degree}</p>
                <p className="text-sm text-muted-foreground">
                  {[item.school, [item.start_date, item.end_date].filter(Boolean).join(" – ")]
                    .filter(Boolean)
                    .join(" | ")}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */
function SkillsSection({ userId, items, onChange }) {
  const [category, setCategory] = useState("")
  const [itemsText, setItemsText] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    const parsed = itemsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    if (parsed.length === 0) {
      toast.error("Add at least one skill")
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.from("skills").insert({
        user_id: userId,
        category,
        items: parsed,
        sort_order: items.length,
      })
      if (error) {
        toast.error("Failed to add skills")
      } else {
        toast.success("Skills added!")
        setCategory("")
        setItemsText("")
        onChange()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from("skills").delete().eq("id", id)
    if (error) toast.error("Failed to delete")
    else {
      toast.success("Skill group deleted")
      onChange()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-accent" />
          Skills
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skill-category">Category</Label>
            <Input
              id="skill-category"
              placeholder="Languages"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skill-items">Skills (comma-separated)</Label>
            <Input
              id="skill-items"
              placeholder="Java, C#, TypeScript, SQL"
              value={itemsText}
              onChange={(e) => setItemsText(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Skill Group"}
          </Button>
        </form>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 p-4 border rounded-lg">
              <div className="min-w-0">
                <p className="font-medium mb-2">{item.category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(item.items || []).map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Certifications                                                      */
/* ------------------------------------------------------------------ */
function CertificationsSection({ userId, items, onChange }) {
  const [name, setName] = useState("")
  const [issuer, setIssuer] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from("certifications").insert({
        user_id: userId,
        name,
        issuer,
        sort_order: items.length,
      })
      if (error) {
        toast.error("Failed to add certification")
      } else {
        toast.success("Certification added!")
        setName("")
        setIssuer("")
        onChange()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from("certifications").delete().eq("id", id)
    if (error) toast.error("Failed to delete")
    else {
      toast.success("Certification deleted")
      onChange()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-accent" />
          Certifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cert-name">Name</Label>
              <Input
                id="cert-name"
                placeholder="Big Data and Machine Learning Fundamentals"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cert-issuer">Issuer</Label>
              <Input
                id="cert-issuer"
                placeholder="Google Cloud"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Certification"}
          </Button>
        </form>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 p-4 border rounded-lg">
              <div className="min-w-0">
                <p className="font-medium">{item.name}</p>
                {item.issuer && <p className="text-sm text-muted-foreground">{item.issuer}</p>}
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
