"use client"

import { useRef, useState } from "react"

interface Feature {
  id: number
  name: string
  type: string
  coordinates: { lat: number; lng: number }
  country: string
  continent: string
}

interface WorldMapProps {
  features: Feature[]
  selectedFeature: Feature | null
  onFeatureSelect: (feature: Feature) => void
}

export function WorldMap({ features, selectedFeature, onFeatureSelect }: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredFeature, setHoveredFeature] = useState<Feature | null>(null)

  // Convert lat/lng to SVG coordinates
  const projectCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 800
    const y = ((90 - lat) / 180) * 400
    return { x, y }
  }

  // World map outline (simplified)
  const worldOutline = `
    M 50 100 
    L 750 100 
    L 750 300 
    L 50 300 
    Z
    M 100 120
    Q 150 110 200 120
    T 300 130
    L 350 140
    Q 400 135 450 140
    L 500 145
    Q 550 140 600 145
    L 650 150
    Q 700 145 720 150
    M 80 180
    Q 120 170 160 180
    T 240 190
    L 280 195
    Q 320 190 360 195
    L 400 200
    Q 440 195 480 200
    L 520 205
    Q 560 200 600 205
    L 640 210
    Q 680 205 710 210
    M 120 240
    Q 160 230 200 240
    T 280 250
    L 320 255
    Q 360 250 400 255
    L 440 260
    Q 480 255 520 260
    L 560 265
    Q 600 260 640 265
  `

  return (
    <div className="relative w-full h-full bg-blue-50 rounded-lg overflow-hidden">
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="w-full h-full"
        style={{ background: "linear-gradient(to bottom, #e0f2fe 0%, #b3e5fc 50%, #81d4fa 100%)" }}
      >
        {/* Ocean background */}
        <rect width="800" height="400" fill="url(#oceanGradient)" />

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e1f5fe" />
            <stop offset="50%" stopColor="#b3e5fc" />
            <stop offset="100%" stopColor="#4fc3f7" />
          </linearGradient>
          <linearGradient id="landGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c8e6c9" />
            <stop offset="100%" stopColor="#a5d6a7" />
          </linearGradient>
        </defs>

        {/* Simplified continents */}
        {/* North America */}
        <path
          d="M 50 80 Q 80 70 120 80 L 180 85 Q 220 80 250 90 L 280 100 Q 300 95 320 100 L 340 110 Q 360 105 380 110 L 400 120 Q 420 115 440 120 L 460 130 Q 480 125 500 130 L 520 140 L 500 160 L 480 170 L 460 180 L 440 190 L 420 200 L 400 210 L 380 200 L 360 190 L 340 180 L 320 170 L 300 160 L 280 150 L 260 140 L 240 130 L 220 120 L 200 110 L 180 100 L 160 90 L 140 85 L 120 90 L 100 95 L 80 100 L 60 95 Z"
          fill="url(#landGradient)"
          stroke="#4caf50"
          strokeWidth="1"
        />

        {/* South America */}
        <path
          d="M 200 200 Q 220 190 240 200 L 260 210 Q 280 205 300 210 L 320 220 Q 340 215 360 220 L 380 230 L 390 250 L 400 270 L 390 290 L 380 310 L 370 330 L 360 350 L 350 370 L 340 360 L 330 350 L 320 340 L 310 330 L 300 320 L 290 310 L 280 300 L 270 290 L 260 280 L 250 270 L 240 260 L 230 250 L 220 240 L 210 230 L 200 220 Z"
          fill="url(#landGradient)"
          stroke="#4caf50"
          strokeWidth="1"
        />

        {/* Africa */}
        <path
          d="M 420 160 Q 440 150 460 160 L 480 170 Q 500 165 520 170 L 540 180 Q 560 175 580 180 L 600 190 L 610 210 L 620 230 L 630 250 L 640 270 L 630 290 L 620 310 L 610 330 L 600 350 L 590 340 L 580 330 L 570 320 L 560 310 L 550 300 L 540 290 L 530 280 L 520 270 L 510 260 L 500 250 L 490 240 L 480 230 L 470 220 L 460 210 L 450 200 L 440 190 L 430 180 L 420 170 Z"
          fill="url(#landGradient)"
          stroke="#4caf50"
          strokeWidth="1"
        />

        {/* Europe */}
        <path
          d="M 420 100 Q 440 90 460 100 L 480 105 Q 500 100 520 105 L 540 110 Q 560 105 580 110 L 600 115 L 610 125 L 620 135 L 610 145 L 600 155 L 590 145 L 580 135 L 570 125 L 560 120 L 550 125 L 540 130 L 530 125 L 520 120 L 510 125 L 500 130 L 490 125 L 480 120 L 470 115 L 460 110 L 450 105 L 440 100 L 430 105 Z"
          fill="url(#landGradient)"
          stroke="#4caf50"
          strokeWidth="1"
        />

        {/* Asia */}
        <path
          d="M 520 80 Q 540 70 560 80 L 580 85 Q 600 80 620 85 L 640 90 Q 660 85 680 90 L 700 95 Q 720 90 740 95 L 750 105 L 740 125 L 730 145 L 720 165 L 710 185 L 700 175 L 690 165 L 680 155 L 670 145 L 660 135 L 650 125 L 640 115 L 630 105 L 620 100 L 610 105 L 600 110 L 590 105 L 580 100 L 570 95 L 560 90 L 550 85 L 540 80 L 530 85 Z"
          fill="url(#landGradient)"
          stroke="#4caf50"
          strokeWidth="1"
        />

        {/* Australia */}
        <path
          d="M 620 280 Q 640 270 660 280 L 680 285 Q 700 280 720 285 L 740 290 L 750 300 L 740 310 L 730 320 L 720 310 L 710 300 L 700 295 L 690 300 L 680 305 L 670 300 L 660 295 L 650 290 L 640 285 L 630 280 Z"
          fill="url(#landGradient)"
          stroke="#4caf50"
          strokeWidth="1"
        />

        {/* Feature markers */}
        {features.map((feature) => {
          const { x, y } = projectCoordinates(feature.coordinates.lat, feature.coordinates.lng)
          const isSelected = selectedFeature?.id === feature.id
          const isHovered = hoveredFeature?.id === feature.id

          return (
            <g key={feature.id}>
              {/* Marker circle */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 8 : isHovered ? 6 : 4}
                fill={isSelected ? "#ef4444" : "#f59e0b"}
                stroke="#ffffff"
                strokeWidth="2"
                className="cursor-pointer transition-all duration-200"
                onClick={() => onFeatureSelect(feature)}
                onMouseEnter={() => setHoveredFeature(feature)}
                onMouseLeave={() => setHoveredFeature(null)}
              />

              {/* Feature label */}
              {(isSelected || isHovered) && (
                <g>
                  <rect
                    x={x + 10}
                    y={y - 15}
                    width={feature.name.length * 6 + 10}
                    height={20}
                    fill="rgba(0, 0, 0, 0.8)"
                    rx="4"
                  />
                  <text x={x + 15} y={y - 2} fill="white" fontSize="12" fontWeight="500">
                    {feature.name}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h4 className="font-semibold text-sm mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500 border border-white"></div>
            <span>Geographical Feature</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
            <span>Selected Feature</span>
          </div>
        </div>
      </div>
    </div>
  )
}
