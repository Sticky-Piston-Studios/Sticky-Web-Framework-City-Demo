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
  const [activeSensorData, setActiveSensorData] = useState(undefined);
  const [sensorDataHighlight, setSensorDataHighlight] = useState(undefined);
  const [sensorData, setSensorData] = useState([]);
  const [lastUpdateTime, setLastUpdateTime] = useState(undefined); // Last update time of the data from the server
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  // Handle sensor data select
  const selectSensorData = (sensorData) => {
    console.log("Selected sensor data: ", sensorData);
    setActiveSensorData(sensorData);
  };

  // Handle sensor data highlight
  // There are two flavours of highlight: "highlighted on sensor data list" and "highlighted on marker (on map)"
  // Parameter should be of type {sensorData, onMap} or undefined
  const highlightSensorData = (highlight) => {
    setSensorDataHighlight(highlight);
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
        StationName: item.station,
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
        //console.log("Got data: ", data);
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
                  sensorData={sensorData}
                  activeSensorData={activeSensorData}
                  sensorDataHighlight={sensorDataHighlight}
                  handleSelectSensorDataCallback={(sensorData) => {
                    selectSensorData(sensorData);
                  }}
                  handleHighlightSensorDataCallback={(highlight) => {
                    highlightSensorData(highlight);
                  }}
                />
              </SimpleBar>
            </div>

            {/* SECTION: Overlaying maps panel */}
            <div className="map-section">
              {/* Map */}
              <DynamicMap
                sensorData={sensorData}
                activeSensorData={activeSensorData}
                sensorDataHighlight={sensorDataHighlight}
                handleSelectSensorDataCallback={(sensorData) => {
                  console.log("Selected sensor data: ", sensorData);
                  selectSensorData(sensorData);
                }}
                handleHighlightSensorDataCallback={(highlight) => {
                  highlightSensorData(highlight);
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
