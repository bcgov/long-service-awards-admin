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
  const { address, datetime, venue } = data || {};
  const api = useAPI();

  const [accommodations, setAccommodations] = useState([]);

  useEffect(() => {
    api
      .getAccommodations()
      .then((results) => {
        setAccommodations(results);
        console.log(results);
      })
      .catch(console.error);
  }, []);

  return (
    <Panel className={"mb-2 mt-2"} header={"Accommodations Info"} toggleable>
      <div className={"container"}>
        <div className={"grid"}>
          <div className={"col-6"}>
            {accommodations.map((a, index) => (
              <span key={a.name}>
                {a.label}
                {index < accommodations.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
