"use client"

import { useEffect, useRef } from "react"

interface LocationMapProps {
  className?: string
}

export default function LocationMap({ className = "" }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return

    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      const L = (await import("leaflet")).default

      // Fix for default markers in Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })

      const targetLocation = [36.855346532643495, 10.16900311003645] as [number, number]

      // Initialize map centered on the target location
      if (!mapRef.current) return;
      const map = L.map(mapRef.current).setView(targetLocation, 15)

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map)

      // Custom red marker icon to match the brand
      const redIcon = L.divIcon({
        html: `
          <div style="
            background-color: oklch(0.55 0.22 25);
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            <div style="
              transform: rotate(45deg);
              color: white;
              font-size: 16px;
              font-weight: bold;
            ">📍</div>
          </div>
        `,
        className: "custom-marker",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      })

      const marker = L.marker(targetLocation, { icon: redIcon }).addTo(map)

      marker
        .bindPopup(`
        <div style="text-align: center; padding: 10px; font-family: system-ui;">
          <h3 style="margin: 0 0 8px 0; color: oklch(0.55 0.22 25); font-weight: bold;">CastPro Location</h3>
          <p style="margin: 0; color: #666; font-size: 14px;">Click to open in Maps</p>
          <p style="margin: 8px 0 0 0; color: #888; font-size: 12px;">Lat: ${targetLocation[0]}<br>Lng: ${targetLocation[1]}</p>
        </div>
      `)
        .openPopup()

      marker.on("click", () => {
        const lat = targetLocation[0]
        const lng = targetLocation[1]
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`
        window.open(mapsUrl, "_blank")
      })

      mapInstanceRef.current = map
    }

    initMap()

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />

      <div
        ref={mapRef}
        className="w-full h-96 rounded-lg shadow-lg border border-border"
        style={{ minHeight: "400px" }}
      />

      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded-full border border-white shadow-sm"></div>
            <span className="text-foreground">Click to open in Maps</span>
          </div>
        </div>
      </div>
    </div>
  )
}
