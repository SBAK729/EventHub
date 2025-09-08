'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the map component to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">Loading map...</div>
})

const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
  ssr: false
})

const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), {
  ssr: false
})

const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
  ssr: false
})

interface MapComponentProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void
  initialLocation?: { lat: number; lng: number; address: string }
}

const MapComponent = ({ onLocationSelect, initialLocation }: MapComponentProps) => {
  const [map, setMap] = useState<any>(null)
  const [position, setPosition] = useState<[number, number]>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : [-1.2921, 36.8219] // Default to Nairobi
  )
  const [selectedAddress, setSelectedAddress] = useState(initialLocation?.address || '')

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  const handleMapClick = async (e: any) => {
    const { lat, lng } = e.latlng
    setPosition([lat, lng])
    
    try {
      // Reverse geocoding to get address
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      )
      const data = await response.json()
      const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      
      setSelectedAddress(address)
      onLocationSelect(lat, lng, address)
    } catch (error) {
      console.error('Error getting address:', error)
      const address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      setSelectedAddress(address)
      onLocationSelect(lat, lng, address)
    }
  }

  const MapClickHandler = () => {
    const { useMapEvents } = require('react-leaflet')
    
    useMapEvents({
      click: handleMapClick,
    })
    return null
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Selected Location
        </label>
        <div className="p-3 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-600">
            {selectedAddress || 'Click on the map to select a location'}
          </p>
        </div>
      </div>
      
      <div className="h-64 rounded-lg overflow-hidden border">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={setMap}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <div>
                <p className="font-medium">Selected Location</p>
                <p className="text-sm text-gray-600">{selectedAddress}</p>
              </div>
            </Popup>
          </Marker>
          <MapClickHandler />
        </MapContainer>
      </div>
      
      <p className="text-xs text-gray-500">
        Click anywhere on the map to select the event location
      </p>
    </div>
  )
}

export default MapComponent
