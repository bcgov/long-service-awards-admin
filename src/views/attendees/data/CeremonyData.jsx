/*!
 * Ceremony Data
 * File: CeremonyData.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { format } from "date-fns";
import { Panel } from "primereact/panel";

/**
 * Model data display component
 */

export default function CeremonyData({ data }) {
  const { address, datetime, venue, ceremony_noshow } = data || {};

  return (
    <Panel className={"mb-2 mt-2"} header={"Ceremony Info"} toggleable>
      <div className={"container"}>
        <div className={"grid"}>
          <div className={"col-6"}>Date</div>
          <div className={"col-6"}>
            {format(new Date(datetime), `p 'on' EEEE, MMMM dd, yyyy`) || "-"}
          </div>
          <div className={"col-6"}>Venue</div>
          <div className={"col-6"}>{venue || "-"}</div>
          <div className={"col-6"}>Address</div>
          <div className={"col-6"}>
            {address.street1} {address.street2} {address.community}{" "}
            {address.province} {address.country} {address.postal_code}{" "}
            {address.pobox}
          </div>
          <div className={"col-6"}>Ceremony No Show</div>
          <div className={"col-6"}>{ceremony_noshow ? "Yes" : ""}</div>
        </div>
      </div>
    </Panel>
  );
}
