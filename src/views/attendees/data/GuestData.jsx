/*!
 * Guest Data
 * File: GuestDataData.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { format } from "date-fns";
import { Panel } from "primereact/panel";

import React from "react";

export default function GuestData({ data }) {
  const { guest } = data || {};
  const isGuest = guest === 1;

  return (
    <Panel className={"mb-2 mt-2"} header={"Attendee Type"} toggleable>
      <div className={"container"}>
        <div className={"grid"}>
          <div className={"col-6"}>Type</div>
          <div className={"col-6"}>{isGuest ? "Guest" : "Recipient"}</div>
        </div>
      </div>
    </Panel>
  );
}
