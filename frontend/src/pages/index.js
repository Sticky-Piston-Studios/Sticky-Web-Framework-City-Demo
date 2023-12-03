import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import ScrollList from "src/components/ScrollList";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

// Import and configure dotenv
require("dotenv").config();

if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  const { t } = useTranslation();
  const scrollListRef = useRef();
  const [activeEvent, setActiveEvent] = useState(undefined); // Active event (the one which is being displayed in opened details panel)
  const [eventHighlight, setEventHighlight] = useState(undefined); // Structure storing highlighted event and highlighted on map or on event list info { event: undefined, onMap: false }
  const [sensorData, setSensorData] = useState([]);
  const [lastUpdateTime, setLastUpdateTime] = useState(undefined); // Last update time of the data from the server
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  // Handle event select
  const selectEvent = (event) => {
    setActiveEvent(event);
  };

  // Handle event highlight
  // There are two flavours of highlight: "highlighted on event list" and "highlighted on marker (on map)"
  // Parameter should be of type {event, onMap} or undefined
  const highlightEvent = (highlight) => {
    setEventHighlight(highlight);
  };

  // save just relevant data about air sensors
  const saveSensorData = (data) => {
    const transformedData = data.result.map((item, index) => {
      // Save the time from the first data item of each result
      if (index === 0) {
        setLastUpdateTime(item.data[0].time);
      }
      return {
        Id: index,
        StationName: item.name,
        Quality: item.ijp.name,
        Latitude: item.lat,
        Longitude: item.lon,
      };
    });

    console.log(transformedData);
    setSensorData(transformedData);
  };

  const fetchStationData = async () => {
    // Call the "GetAirSensors" endpoint
    fetch(`/api/action/air_sensors_get/?apikey=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Got data: ", data);
        saveSensorData(data);
      })
      .catch((error) => {
        console.error("Error fetching sensor data", error);
      });
  };

  // reload station data on reload
  useEffect(() => {
    fetchStationData();
  }, []);

  return (
    <>
      {console.log("Component is being rendered")}

      <Head>
        <title>{t("MapPageTitle")}</title>
        <meta name="description" content={t("MapPageTitle")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div>
          <div className="flex">
            {/*Event list */}
            <div className="events-list scroll-container ">
              <SimpleBar style={{ height: "100%" }}>
                <ScrollList
                  ref={scrollListRef}
                  activeEvent={activeEvent}
                  eventHighlight={eventHighlight}
                  handleSelectEventCallback={(event) => {
                    selectEvent(event);
                  }}
                  handleHighlightEventCallback={(highlight) => {
                    highlightEvent(highlight);
                  }}
                />
              </SimpleBar>
            </div>

            {/* SECTION: Overlaying maps panel */}
            <div className="map-section">
              {/* Map */}
              <DynamicMap
                layers={[]}
                activeEvent={activeEvent}
                eventHighlight={eventHighlight}
                handleSelectEventCallback={(event) => {
                  selectEvent(event);
                }}
                handleHighlightEventCallback={(highlight) => {
                  highlightEvent(highlight);
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
