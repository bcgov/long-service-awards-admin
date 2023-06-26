/*!
 * View Attendee Record
 * File: AttendeeView.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import CeremonyData from "@/views/attendees/data/CeremonyData";

/**
 * Inherited model component
 */

export default function AttendeeView({ data }) {
  return (
    <div>
      <CeremonyData data={data} />
    </div>
  );
}
