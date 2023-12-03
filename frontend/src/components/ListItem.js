import React from "react";
import { useTranslation } from "react-i18next";

const ListItem = ({ item, isHighlighted, isActive }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`event-list-item ${isHighlighted ? "highlight" : ""}  ${
        isActive ? "active" : ""
      }`}
    >
      <div className="event-list-item-info-area">
        {/* Name */}
        <p className="event-header-font mb-[8px]">{item.StationName}</p>
        {/* Date */}
        <p>{item.Quality}</p>
      </div>
    </div>
  );
};

export default ListItem;
