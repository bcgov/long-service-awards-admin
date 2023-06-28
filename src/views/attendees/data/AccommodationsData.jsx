/*!
 * Ceremony Data
 * File: CeremonyData.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { format } from "date-fns";
import { Panel } from "primereact/panel";
import { useState, useEffect } from "react";
import { useAPI } from "@/providers/api.provider.jsx";

/**
 * Model data display component
 */

export default function AccommodationsData({ data }) {
  const { accommodations } = data || {};
  //accommodations can be null if none exist
  return !!accommodations && accommodations.length ? (
    <Panel className={"mb-2 mt-2"} header={"Accommodations"} toggleable>
      <div className={"container"}>
        <div className={"grid"}>
          <div className={"col-6"}>
            {accommodations.map((a, index) => (
              <span key={a.accommodation}>
                {a.accommodation.charAt(0).toUpperCase() +
                  a.accommodation.slice(1).replace("_", " ") || ""}
                {index < accommodations.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  ) : (
    ""
  );
}
