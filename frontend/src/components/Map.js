import React, { useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import {
  EVENT_MARKER_SIZE,
  EVENT_LOCATION_TYPES,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_BOUNDARIES,
  DEFAULT_MAP_ZOOM,
  DEFAULT_MAP_MIN_ZOOM,
  MAP_ZOOM_SNAP,
  MAP_ZOOM_DELTA,
  MAP_WHEEL_PX_PER_ZOOM_LEVEL,
  MAP_INTERTIA_DECELERATION,
  EVENT_TYPES,
} from "src/constants";

// Empty component to handle flying to locations on the map when focused event id changes
const MapComponent = ({ activeEvent, eventHighlight, markerRefs }) => {
  const map = useMap();

  return null;
};

// Return color of the first event type
const getCategoryColor = (eventType) => {
  return eventType ? EVENT_TYPES[eventType.split(".")[0]].Color : "white";
};

// Main map component
const Map = ({ activeEvent, eventHighlight }) => {
  const markerRefs = useRef([]);

  // Create event icons function
  const createIcon = useCallback((eventTypes, isHighlighted, opacity = 1) => {
    const [category, typeName] = eventTypes[0].split(".");
    const categoryColor = getCategoryColor(eventTypes[0]);
    const otherTypeCount =
      eventTypes.length > 1 ? "+" + (eventTypes.length - 1) : "";

    // Get type icon
    const iconData = EVENT_TYPES[category].Types.find(
      (typeItem) => typeItem.name === typeName
    )?.icon;

    const iconHtml = `
      <div class="event-marker ${isHighlighted ? "animated-icon" : ""}">
        <div class="event-marker-inner" style="background-color: ${categoryColor}">
          <div class="event-marker-icon">
            <svg style="width: 100%; height: 100%;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" fill="white">
              <path d="${iconData}"/>
            </svg>
          </div>
        </div>
      </div>
    `;

    const iconAdditionalTypeCountHtml = `  
      <div class="event-marker-number  ${isHighlighted ? "animated-icon" : ""}">
        <p class="event-marker-icon-font" data-content="${otherTypeCount}">${otherTypeCount}</p>
      </div>
    `;

    const icon = L.divIcon({
      html: iconHtml + (otherTypeCount > 0 ? iconAdditionalTypeCountHtml : ""),
      className: "",
      opacity: opacity,
      iconAnchor: [EVENT_MARKER_SIZE / 2, EVENT_MARKER_SIZE / 2],
      popupAnchor: [0, -35],
    });

    return icon;
  }, []);

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
      <MapComponent
        activeEvent={activeEvent}
        eventHighlight={eventHighlight}
        markerRefs={markerRefs}
      />

      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution="OpenStreetMap"
      />
    </MapContainer>
  );
};

export default Map;
