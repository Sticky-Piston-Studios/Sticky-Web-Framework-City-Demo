import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_BOUNDARIES,
  DEFAULT_MAP_ZOOM,
  DEFAULT_MAP_MIN_ZOOM,
  MAP_ZOOM_SNAP,
  MAP_ZOOM_DELTA,
  MAP_WHEEL_PX_PER_ZOOM_LEVEL,
  MAP_INTERTIA_DECELERATION,
} from "src/constants";

// Function to get marker color based on air quality
const getMarkerColor = (quality) => {
  if (quality === "Bardzo dobry") {
    return "darkgreen";
  } else if (quality === "Dobry") {
    return "lightgreen";
  } else if (quality === "Umiarkowany") {
    return "yellow";
  } else if (quality === "Dostateczny") {
    return "orange";
  } else if (quality === "Zły") {
    return "red";
  } else if (quality === "Bardzo zły") {
    return "darkred";
  } else {
    return "gray"; // Default color
  }
};

const MapComponent = ({ activeSensorData, sensorDataHighlight }) => {
  const map = useMap();

  useEffect(() => {
    if (activeSensorData) {
      map.flyTo([activeSensorData.Latitude, activeSensorData.Longitude], 13);
    }
  }, [activeSensorData, map]);
  return null;
};

// Main map component
const Map = ({
  sensorData,
  activeSensorData,
  sensorDataHighlight,
  handleSelectSensorDataCallback,
  handleHighlightSensorDataCallback,
}) => {
  return (
    <MapContainer
      center={DEFAULT_MAP_CENTER}
      zoom={DEFAULT_MAP_ZOOM}
      minZoom={DEFAULT_MAP_MIN_ZOOM}
      maxBounds={DEFAULT_MAP_BOUNDARIES}
      zoomSnap={MAP_ZOOM_SNAP}
      zoomDelta={MAP_ZOOM_DELTA}
      wheelPxPerZoomLevel={MAP_WHEEL_PX_PER_ZOOM_LEVEL}
      inertiaDeceleration={MAP_INTERTIA_DECELERATION}
      zoomControl={false}
      style={{ height: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution="OpenStreetMap"
      />

      <MapComponent {...{ activeSensorData, sensorDataHighlight }} />
      {sensorData.map((data, index) => (
        <Marker
          key={index}
          position={[data.Latitude, data.Longitude]}
          eventHandlers={{
            click: () => {
              handleSelectSensorDataCallback(data);
            },
          }}
          icon={L.divIcon({
            className: "custom-icon",
            html: `<div style="background-color: ${getMarkerColor(
              data.Quality
            )}; width: 20px; height: 20px; border-radius: 50%;"></div>`,
          })}
        >
          <Popup>
            <div>
              <h2>{data.StationName}</h2>
              <p>Quality: {data.Quality}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
