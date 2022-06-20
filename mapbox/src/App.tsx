import { useRef, useEffect, useState } from "react"
import mapboxgl, { Map } from "mapbox-gl"

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const App = () => {
  const mapContainer = useRef<any>(null)
  const map = useRef<any>(null)
  const [lng, setLng] = useState(-70.9)
  const [lat, setLat] = useState(42.35)
  const [zoom, setZoom] = useState(9)

  useEffect(() => {
    if (map.current) return
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom
    })
  })

  useEffect(() => {
    if (!map.current) return
    map.current.on("move", () => {
      setLng(map?.current?.getCenter().lng.toFixed(4))
      setLat(map?.current?.getCenter().lat.toFixed(4))
      setZoom(map?.current?.getZoom().toFixed(2))
    })
  })
  return (
    <div>
      <div ref={mapContainer} className="mapContainer" />
    </div>
  )
}
export default App
