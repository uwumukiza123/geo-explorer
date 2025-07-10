"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Mountain, Waves } from "lucide-react"

interface Feature {
  id: number
  name: string
  type: string
  country: string
  continent: string
  coordinates: { lat: number; lng: number }
  elevation?: number
  depth?: number
  length?: number
  area?: number
  height?: number
  description: string
}

interface DataTableProps {
  features: Feature[]
  onFeatureSelect: (feature: Feature) => void
}

export function DataTable({ features, onFeatureSelect }: DataTableProps) {
  const [sortField, setSortField] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedFeatures = [...features].sort((a, b) => {
    if (!sortField) return 0

    let aValue = a[sortField as keyof Feature]
    let bValue = b[sortField as keyof Feature]

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = (bValue as string).toLowerCase()
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const getFeatureIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "mountain":
        return <Mountain className="h-4 w-4" />
      case "river":
      case "lake":
      case "ocean trench":
        return <Waves className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getMeasurement = (feature: Feature) => {
    if (feature.elevation) return `${feature.elevation.toLocaleString()}m elevation`
    if (feature.depth) return `${feature.depth.toLocaleString()}m depth`
    if (feature.length) return `${feature.length.toLocaleString()}km length`
    if (feature.area) return `${feature.area.toLocaleString()}km² area`
    if (feature.height) return `${feature.height.toLocaleString()}m height`
    return "N/A"
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">
                <Button variant="ghost" size="sm" onClick={() => handleSort("name")} className="font-semibold">
                  Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                </Button>
              </th>
              <th className="text-left p-3">
                <Button variant="ghost" size="sm" onClick={() => handleSort("type")} className="font-semibold">
                  Type {sortField === "type" && (sortDirection === "asc" ? "↑" : "↓")}
                </Button>
              </th>
              <th className="text-left p-3">
                <Button variant="ghost" size="sm" onClick={() => handleSort("country")} className="font-semibold">
                  Country {sortField === "country" && (sortDirection === "asc" ? "↑" : "↓")}
                </Button>
              </th>
              <th className="text-left p-3">
                <Button variant="ghost" size="sm" onClick={() => handleSort("continent")} className="font-semibold">
                  Continent {sortField === "continent" && (sortDirection === "asc" ? "↑" : "↓")}
                </Button>
              </th>
              <th className="text-left p-3">Coordinates</th>
              <th className="text-left p-3">Measurement</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedFeatures.map((feature) => (
              <tr key={feature.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {getFeatureIcon(feature.type)}
                    <span className="font-medium">{feature.name}</span>
                  </div>
                </td>
                <td className="p-3">
                  <Badge variant="secondary">{feature.type}</Badge>
                </td>
                <td className="p-3">{feature.country}</td>
                <td className="p-3">{feature.continent}</td>
                <td className="p-3">
                  <div className="text-sm font-mono">
                    <div>{feature.coordinates.lat.toFixed(4)}°</div>
                    <div>{feature.coordinates.lng.toFixed(4)}°</div>
                  </div>
                </td>
                <td className="p-3 text-sm">{getMeasurement(feature)}</td>
                <td className="p-3">
                  <Button size="sm" variant="outline" onClick={() => onFeatureSelect(feature)}>
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {features.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No geographical features found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
