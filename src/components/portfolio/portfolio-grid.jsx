/* eslint-disable no-unused-vars */
"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ImageIcon, Code, FileText, Play } from "lucide-react"

export function PortfolioGrid({ items }) {
  const [activeType, setActiveType] = useState("all")

  // Define content types with icons and colors
  const contentTypes = {
    image: { label: "Images", icon: ImageIcon, color: "from-pink-500 to-rose-500" },
    project: { label: "Projects", icon: Code, color: "from-blue-500 to-cyan-500" },
    blog: { label: "Blog", icon: FileText, color: "from-purple-500 to-indigo-500" },
    video: { label: "Videos", icon: Play, color: "from-red-500 to-orange-500" },
  }

  // Filter items by active type
  const filteredItems = activeType === "all" ? items : items.filter((item) => item.content_type === activeType)

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex gap-2 mb-12 flex-wrap">
        <button
          onClick={() => setActiveType("all")}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-accent/20 hover:border-accent ${
            activeType === "all"
              ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30"
              : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
          }`}
        >
          All Work
        </button>

        {Object.entries(contentTypes).map(([key, { label, icon: Icon }]) => {
          const count = items.filter((item) => item.content_type === key).length
          if (count === 0) return null

          return (
            <button
              key={key}
              onClick={() => setActiveType(key)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-accent/20 hover:border-accent ${
                activeType === key
                  ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label} ({count})
            </button>
          )
        })}
      </div>

      {/* Grid Display */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No items in this category yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const typeInfo = contentTypes[item.content_type] || contentTypes.project
            const TypeIcon = typeInfo.icon

            return (
              <Card
                key={item.id}
                className="overflow-hidden group border-border hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10"
              >
                {/* Image/Content Preview */}
                {item.image_url && (
                  <div className="relative h-56 overflow-hidden bg-muted">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Type Badge with gradient background */}
                    <div
                      className={`absolute top-3 right-3 bg-gradient-to-r ${typeInfo.color} p-2 rounded-lg shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                    >
                      <TypeIcon className="w-5 h-5 text-white" />
                    </div>

                    {/* Hover overlay with action buttons */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="flex gap-3 w-full">
                        {item.project_url && (
                          <a
                            href={item.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-accent text-accent-foreground py-2 px-4 rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                          >
                            View <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {item.video_url && (
                          <a
                            href={item.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-accent text-accent-foreground py-2 px-4 rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                          >
                            Watch <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg group-hover:text-accent transition-colors flex-1">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>

                  {/* View count badge */}
                  {item.view_count > 0 && (
                    <Badge variant="secondary" className="mb-3 bg-accent/10 text-accent">
                      {item.view_count} views
                    </Badge>
                  )}

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs bg-muted text-muted-foreground hover:bg-accent/20 hover:text-accent transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
