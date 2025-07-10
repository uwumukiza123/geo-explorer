"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, FileText, Table } from "lucide-react"

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

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  features: Feature[]
}

export function ExportDialog({ open, onOpenChange, features }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState("csv")
  const [selectedFields, setSelectedFields] = useState({
    name: true,
    type: true,
    country: true,
    continent: true,
    coordinates: true,
    measurements: true,
    description: true,
  })

  const handleFieldChange = (field: string, checked: boolean) => {
    setSelectedFields((prev) => ({ ...prev, [field]: checked }))
  }

  const generateCSV = () => {
    const headers = []
    if (selectedFields.name) headers.push("Name")
    if (selectedFields.type) headers.push("Type")
    if (selectedFields.country) headers.push("Country")
    if (selectedFields.continent) headers.push("Continent")
    if (selectedFields.coordinates) headers.push("Latitude", "Longitude")
    if (selectedFields.measurements)
      headers.push("Elevation (m)", "Depth (m)", "Length (km)", "Area (km²)", "Height (m)")
    if (selectedFields.description) headers.push("Description")

    const rows = features.map((feature) => {
      const row = []
      if (selectedFields.name) row.push(feature.name)
      if (selectedFields.type) row.push(feature.type)
      if (selectedFields.country) row.push(feature.country)
      if (selectedFields.continent) row.push(feature.continent)
      if (selectedFields.coordinates) {
        row.push(feature.coordinates.lat.toString())
        row.push(feature.coordinates.lng.toString())
      }
      if (selectedFields.measurements) {
        row.push(feature.elevation?.toString() || "")
        row.push(feature.depth?.toString() || "")
        row.push(feature.length?.toString() || "")
        row.push(feature.area?.toString() || "")
        row.push(feature.height?.toString() || "")
      }
      if (selectedFields.description) row.push(`"${feature.description.replace(/"/g, '""')}"`)
      return row
    })

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `geographical_features_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generatePDF = () => {
    // Create a simple HTML content for PDF generation
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Geographical Features Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
          .feature { margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
          .feature-name { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 5px; }
          .feature-type { background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px; display: inline-block; margin-bottom: 10px; }
          .feature-details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
          .detail-item { font-size: 14px; }
          .detail-label { font-weight: bold; color: #6b7280; }
          .description { font-style: italic; color: #4b5563; margin-top: 10px; }
          .stats { background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>Geographical Features Report</h1>
        <div class="stats">
          <p><strong>Total Features:</strong> ${features.length}</p>
          <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Continents Covered:</strong> ${new Set(features.map((f) => f.continent)).size}</p>
        </div>
        ${features
          .map(
            (feature) => `
          <div class="feature">
            ${selectedFields.name ? `<div class="feature-name">${feature.name}</div>` : ""}
            ${selectedFields.type ? `<div class="feature-type">${feature.type}</div>` : ""}
            <div class="feature-details">
              ${selectedFields.country ? `<div class="detail-item"><span class="detail-label">Country:</span> ${feature.country}</div>` : ""}
              ${selectedFields.continent ? `<div class="detail-item"><span class="detail-label">Continent:</span> ${feature.continent}</div>` : ""}
              ${selectedFields.coordinates ? `<div class="detail-item"><span class="detail-label">Coordinates:</span> ${feature.coordinates.lat.toFixed(4)}°, ${feature.coordinates.lng.toFixed(4)}°</div>` : ""}
              ${selectedFields.measurements && feature.elevation ? `<div class="detail-item"><span class="detail-label">Elevation:</span> ${feature.elevation.toLocaleString()} m</div>` : ""}
              ${selectedFields.measurements && feature.depth ? `<div class="detail-item"><span class="detail-label">Depth:</span> ${feature.depth.toLocaleString()} m</div>` : ""}
              ${selectedFields.measurements && feature.length ? `<div class="detail-item"><span class="detail-label">Length:</span> ${feature.length.toLocaleString()} km</div>` : ""}
              ${selectedFields.measurements && feature.area ? `<div class="detail-item"><span class="detail-label">Area:</span> ${feature.area.toLocaleString()} km²</div>` : ""}
              ${selectedFields.measurements && feature.height ? `<div class="detail-item"><span class="detail-label">Height:</span> ${feature.height.toLocaleString()} m</div>` : ""}
            </div>
            ${selectedFields.description ? `<div class="description">${feature.description}</div>` : ""}
          </div>
        `,
          )
          .join("")}
      </body>
      </html>
    `

    // Open in new window for printing/saving as PDF
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }

  const handleExport = () => {
    if (exportFormat === "csv") {
      generateCSV()
    } else {
      generatePDF()
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Geographical Data
          </DialogTitle>
          <DialogDescription>
            Choose your export format and select the fields to include in your export.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format */}
          <div>
            <Label className="text-sm font-medium">Export Format</Label>
            <RadioGroup value={exportFormat} onValueChange={setExportFormat} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center gap-2">
                  <Table className="h-4 w-4" />
                  CSV (Comma Separated Values)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF (Portable Document Format)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Field Selection */}
          <div>
            <Label className="text-sm font-medium">Fields to Include</Label>
            <div className="mt-2 space-y-2">
              {Object.entries(selectedFields).map(([field, checked]) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={field}
                    checked={checked}
                    onCheckedChange={(checked) => handleFieldChange(field, checked as boolean)}
                  />
                  <Label htmlFor={field} className="text-sm capitalize">
                    {field === "measurements" ? "Measurements (elevation, depth, etc.)" : field}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Export Info */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Export Summary:</strong> {features.length} features will be exported in{" "}
              {exportFormat.toUpperCase()} format.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export {exportFormat.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
