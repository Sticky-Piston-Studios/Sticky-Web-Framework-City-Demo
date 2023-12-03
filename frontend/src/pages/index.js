import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import ScrollList from "src/components/ScrollList";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
//import CompanyComponent from "@/components/CompanyComponent";
/*
export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      {console.log("Component is being rendered")}

      <CompanyComponent />
    </>
  );
}*/

const DynamicMap = dynamic(() => import("@/components/Map"), { ssr: false });

export default function Home() {
  // Global dynamic constants
  /*
  document.documentElement.style.setProperty(
    "--events-panel-width",
    EVENTS_PANEL_WIDTH + "px"
  );
  document.documentElement.style.setProperty(
    "--event-marker-size",
    EVENT_MARKER_SIZE + "px"
  );
  */

  const { t } = useTranslation();
  const scrollListRef = useRef();
  const [activeEvent, setActiveEvent] = useState(undefined); // Active event (the one which is being displayed in opened details panel)
  const [eventHighlight, setEventHighlight] = useState(undefined); // Structure storing highlighted event and highlighted on map or on event list info { event: undefined, onMap: false }

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

  // reload events in this area on page load
  useEffect(() => {
    console.log("Running");
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
