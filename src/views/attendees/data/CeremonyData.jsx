/*!
 * Ceremony Data
 * File: CeremonyData.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { Panel } from "primereact/panel";

/**
 * Model data display component
 */

export default function CeremonyData({ data }) {
  console.log(data);
  const { active, address, created_at, datetime, venue } = data || {};

  return (
    <Panel className={"mb-2 mt-2"} header={"Ceremony Info"} toggleable>
      <div className={"container"}>
        <div className={"grid"}>
          <div className={"col-6"}>Date</div>
          <div className={"col-6"}>{datetime || "-"}</div>
          <div className={"col-6"}>Venue</div>
          <div className={"col-6"}>{venue || "-"}</div>
          <div className={"col-6"}>Address</div>
          <div className={"col-6"}>{address || "-"}</div>
        </div>
      </div>
    </Panel>
  );
}
