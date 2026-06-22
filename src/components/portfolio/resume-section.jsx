import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, GraduationCap, Wrench, Award } from "lucide-react"

function bullets(text) {
  if (!text) return []
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

function dateRange(start, end) {
  return [start, end].filter(Boolean).join(" – ")
}

export function ResumeSection({ experiences = [], education = [], skills = [], certifications = [], themeColor, hideHeading = false }) {
  const hasAnything =
    experiences.length > 0 || education.length > 0 || skills.length > 0 || certifications.length > 0
  if (!hasAnything) return null

  return (
    <div className={hideHeading ? "" : "mb-20"}>
      {!hideHeading && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Resume</h2>
          <p className="text-muted-foreground">My experience, education, skills, and certifications</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main column: experience + education */}
        <div className="lg:col-span-2 space-y-12">
          {experiences.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6" style={{ color: themeColor }} />
                Experience
              </h3>
              <div className="space-y-6">
                {experiences.map((item) => (
                  <Card key={item.id} className="p-6 border-border bg-card/50">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-lg">
                        {item.title}
                        {item.company && (
                          <span className="text-muted-foreground font-normal"> · {item.company}</span>
                        )}
                      </h4>
                      {dateRange(item.start_date, item.end_date) && (
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {dateRange(item.start_date, item.end_date)}
                        </span>
                      )}
                    </div>
                    {item.location && <p className="text-sm text-muted-foreground mb-3">{item.location}</p>}
                    {bullets(item.description).length > 0 && (
                      <ul className="space-y-1.5 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
                        {bullets(item.description).map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <GraduationCap className="w-6 h-6" style={{ color: themeColor }} />
                Education
              </h3>
              <div className="space-y-6">
                {education.map((item) => (
                  <Card key={item.id} className="p-6 border-border bg-card/50">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-lg">{item.degree}</h4>
                      {dateRange(item.start_date, item.end_date) && (
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {dateRange(item.start_date, item.end_date)}
                        </span>
                      )}
                    </div>
                    {item.school && <p className="text-sm text-muted-foreground mb-3">{item.school}</p>}
                    {bullets(item.details).length > 0 && (
                      <ul className="space-y-1.5 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
                        {bullets(item.details).map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Side column: skills + certifications */}
        <div className="space-y-12">
          {skills.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Wrench className="w-6 h-6" style={{ color: themeColor }} />
                Skills
              </h3>
              <div className="space-y-5">
                {skills.map((group) => (
                  <div key={group.id}>
                    <p className="text-sm font-medium mb-2">{group.category}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(group.items || []).map((s) => (
                        <Badge
                          key={s}
                          variant="outline"
                          style={{ borderColor: `${themeColor}66` }}
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6" style={{ color: themeColor }} />
                Certifications
              </h3>
              <div className="space-y-3">
                {certifications.map((item) => (
                  <Card key={item.id} className="p-4 border-border bg-card/50">
                    <p className="font-medium text-sm">{item.name}</p>
                    {item.issuer && <p className="text-xs text-muted-foreground mt-0.5">{item.issuer}</p>}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
