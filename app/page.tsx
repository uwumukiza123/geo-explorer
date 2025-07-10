"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search, Globe, MapPin, Mountain, Waves } from "lucide-react"
import { WorldMap } from "@/components/world-map"
import { DataTable } from "@/components/data-table"
import { ExportDialog } from "@/components/export-dialog"

// Sample geographical data
const geographicalFeatures = [
  {
    id: 1,
    name: "Mount Everest",
    type: "Mountain",
    country: "Nepal/China",
    continent: "Asia",
    elevation: 8848,
    coordinates: { lat: 27.9881, lng: 86.925 },
    description: "The world's highest mountain peak",
  },
  {
    id: 2,
    name: "Amazon River",
    type: "River",
    country: "Brazil/Peru",
    continent: "South America",
    length: 6400,
    coordinates: { lat: -3.4653, lng: -62.2159 },
    description: "The longest river in the world",
  },
  {
    id: 3,
    name: "Sahara Desert",
    type: "Desert",
    country: "Multiple",
    continent: "Africa",
    area: 9000000,
    coordinates: { lat: 23.4162, lng: 25.6628 },
    description: "The largest hot desert in the world",
  },
  {
    id: 4,
    name: "Great Barrier Reef",
    type: "Coral Reef",
    country: "Australia",
    continent: "Oceania",
    area: 344400,
    coordinates: { lat: -18.2871, lng: 147.6992 },
    description: "The world's largest coral reef system",
  },
  {
    id: 5,
    name: "Lake Baikal",
    type: "Lake",
    country: "Russia",
    continent: "Asia",
    depth: 1642,
    coordinates: { lat: 53.5587, lng: 108.165 },
    description: "The world's deepest and oldest freshwater lake",
  },
  {
    id: 6,
    name: "Grand Canyon",
    type: "Canyon",
    country: "United States",
    continent: "North America",
    depth: 1857,
    coordinates: { lat: 36.1069, lng: -112.1129 },
    description: "A steep-sided canyon carved by the Colorado River",
  },
  {
    id: 7,
    name: "Victoria Falls",
    type: "Waterfall",
    country: "Zambia/Zimbabwe",
    continent: "Africa",
    height: 108,
    coordinates: { lat: -17.9243, lng: 25.8572 },
    description: "One of the largest waterfalls in the world",
  },
  {
    id: 8,
    name: "Mariana Trench",
    type: "Ocean Trench",
    country: "International Waters",
    continent: "Pacific Ocean",
    depth: 11034,
    coordinates: { lat: 11.3733, lng: 142.5917 },
    description: "The deepest part of the world's oceans",
  },
]

export default function GeographicalExplorer() {
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filteredFeatures, setFilteredFeatures] = useState(geographicalFeatures)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)

  useEffect(() => {
    let filtered = geographicalFeatures

    if (searchTerm) {
      filtered = filtered.filter(
        (feature) =>
          feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          feature.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
          feature.type.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterType !== "all") {
      filtered = filtered.filter((feature) => feature.type.toLowerCase() === filterType.toLowerCase())
    }

    setFilteredFeatures(filtered)
  }, [searchTerm, filterType])

  const getFeatureIcon = (type) => {
    switch (type.toLowerCase()) {
      case "mountain":
        return <Mountain className="h-4 w-4" />
      case "river":
        return <Waves className="h-4 w-4" />
      case "lake":
        return <Waves className="h-4 w-4" />
      case "ocean trench":
        return <Waves className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const uniqueTypes = [...new Set(geographicalFeatures.map((f) => f.type))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Geographical Features Explorer</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and explore the world's most remarkable geographical features. Interactive maps, detailed data, and
            export capabilities.
          </p>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, country, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => setExportDialogOpen(true)} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>Interactive World Map</CardTitle>
                <CardDescription>Click on markers to explore geographical features</CardDescription>
              </CardHeader>
              <CardContent className="h-full">
                <WorldMap
                  features={filteredFeatures}
                  selectedFeature={selectedFeature}
                  onFeatureSelect={setSelectedFeature}
                />
              </CardContent>
            </Card>
          </div>

          {/* Feature Details */}
          <div className="space-y-4">
            {selectedFeature ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getFeatureIcon(selectedFeature.type)}
                    {selectedFeature.name}
                  </CardTitle>
                  <CardDescription>
                    <Badge variant="secondary">{selectedFeature.type}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600">Location</h4>
                    <p>{selectedFeature.country}</p>
                    <p className="text-sm text-gray-500">{selectedFeature.continent}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-gray-600">Coordinates</h4>
                    <p className="text-sm font-mono">
                      {selectedFeature.coordinates.lat.toFixed(4)}°, {selectedFeature.coordinates.lng.toFixed(4)}°
                    </p>
                  </div>

                  {selectedFeature.elevation && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Elevation</h4>
                      <p>{selectedFeature.elevation.toLocaleString()} meters</p>
                    </div>
                  )}

                  {selectedFeature.depth && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Depth</h4>
                      <p>{selectedFeature.depth.toLocaleString()} meters</p>
                    </div>
                  )}

                  {selectedFeature.length && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Length</h4>
                      <p>{selectedFeature.length.toLocaleString()} km</p>
                    </div>
                  )}

                  {selectedFeature.area && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Area</h4>
                      <p>{selectedFeature.area.toLocaleString()} km²</p>
                    </div>
                  )}

                  {selectedFeature.height && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-600">Height</h4>
                      <p>{selectedFeature.height.toLocaleString()} meters</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-sm text-gray-600">Description</h4>
                    <p className="text-sm">{selectedFeature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-48 text-gray-500">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Select a feature on the map to view details</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Features:</span>
                  <span className="font-semibold">{filteredFeatures.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Continents:</span>
                  <span className="font-semibold">{new Set(filteredFeatures.map((f) => f.continent)).size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Feature Types:</span>
                  <span className="font-semibold">{new Set(filteredFeatures.map((f) => f.type)).size}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Geographical Features</CardTitle>
            <CardDescription>Complete list of geographical features with detailed information</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable features={filteredFeatures} onFeatureSelect={setSelectedFeature} />
          </CardContent>
        </Card>

        {/* Export Dialog */}
        <ExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} features={filteredFeatures} />
      </div>
    </div>
  )
}
