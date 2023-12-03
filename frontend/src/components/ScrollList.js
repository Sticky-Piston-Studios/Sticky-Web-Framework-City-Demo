import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import EventListItem from "@/components/EventListItem";

const ScrollList = forwardRef(
  (
    {
      activeEvent,
      eventHighlight,
      handleSelectEventCallback,
      handleHighlightEventCallback,
    },
    ref
  ) => {
    const itemRefs = useRef([]);
    const [renderedCount, setRenderedCount] = useState(0);

    // dumym events
    const events = [
      { id: 1, name: "Event 1", date: "2022-01-01" },
      { id: 2, name: "Event 2", date: "2022-02-01" },
      { id: 3, name: "Event 3", date: "2022-03-01" },
      { id: 4, name: "Event 4", date: "2022-04-01" },
      { id: 5, name: "Event 5", date: "2022-05-01" },
    ];

    useImperativeHandle(ref, () => ({
      rerender() {
        setRenderedCount(0); // Reset to 0
      },

      scrollToActiveEvent() {
        scrollToActiveEvent(); // Reset to 0
      },
    }));

    const handleItemClick = (item) => {
      // Open details panel
      handleSelectEventCallback(item);
    };

    const fetchData = async () => {};

    useEffect(() => {
      fetchData();
    }, []);

    const scrollToActiveEvent = () => {
      if (activeEvent !== undefined) {
        const index = events.findIndex((event) => event.id === activeEvent.id);
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
      scrollToActiveEvent();
    }, [activeEvent]);

    // List item to display
    const listItem = (event, index) => (
      <div key={event.id}>
        <div className="flex">
          <li
            className={"w-full"}
            ref={(el) => (itemRefs.current[index] = el)}
            onClick={() => handleItemClick(event)}
            onMouseEnter={() => {
              handleHighlightEventCallback({ event: event, onMap: false });
            }}
            onMouseLeave={() => {
              handleHighlightEventCallback(undefined);
            }}
          >
            <EventListItem
              item={event}
              isHighlighted={
                eventHighlight !== undefined &&
                event.id === eventHighlight.event.id
              }
              isActive={
                activeEvent !== undefined && event.id === activeEvent.id
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
        <ul>{events.map((event, index) => listItem(event, index))}</ul>
      </>
    );
  }
);

ScrollList.displayName = "ScrollList";

export default ScrollList;
