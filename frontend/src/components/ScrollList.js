import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import ListItem from "@/components/ListItem";

const ScrollList = forwardRef(
  (
    {
      sensorData,
      activeSensorData,
      sensorDataHighlight,
      handleSelectSensorDataCallback,
      handleHighlightSensorDataCallback,
    },
    ref
  ) => {
    const itemRefs = useRef([]);
    const [renderedCount, setRenderedCount] = useState(0);

    useImperativeHandle(ref, () => ({
      rerender() {
        setRenderedCount(0); // Reset to 0
      },

      scrollToActiveSensorData() {
        scrollToActiveSensorData(); // Reset to 0
      },
    }));

    const handleItemClick = (item) => {
      // Open details panel
      handleSelectSensorDataCallback(item);
    };

    const fetchData = async () => {};

    useEffect(() => {
      fetchData();
    }, []);

    const scrollToActiveSensorData = () => {
      if (activeSensorData !== undefined) {
        const index = sensorData.findIndex(
          (data) => data.id === activeSensorData.id
        );
        if (index !== -1 && itemRefs.current[index]) {
          itemRefs.current[index].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    };

    // Scroll to active event on active event change
    useEffect(() => {
      scrollToActiveSensorData();
    }, [activeSensorData]);

    // List item to display
    const listItem = (sensorData, index) => (
      <div key={sensorData.id}>
        <div className="flex">
          <li
            className={"w-full"}
            ref={(el) => (itemRefs.current[index] = el)}
            onClick={() => handleItemClick(sensorData)}
            onMouseEnter={() => {
              handleHighlightSensorDataCallback({
                sensorData: sensorData,
                onMap: false,
              });
            }}
            onMouseLeave={() => {
              handleHighlightSensorDataCallback(undefined);
            }}
          >
            <ListItem
              item={sensorData}
              isHighlighted={
                sensorDataHighlight !== undefined &&
                sensorData.id === sensorDataHighlight.id
              }
              isActive={
                activeSensorData !== undefined &&
                sensorData.id === activeSensorData.id
              }
            />
          </li>
        </div>
      </div>
    );

    return (
      <>
        {/* Header */}
        <h1 className="event-list-header">SWF-City-Demo</h1>
        {/* List */}
        <ul>
          {sensorData.map((sensorData, index) => listItem(sensorData, index))}
        </ul>
      </>
    );
  }
);

ScrollList.displayName = "ScrollList";

export default ScrollList;
