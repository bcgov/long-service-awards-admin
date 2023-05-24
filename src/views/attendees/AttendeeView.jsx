/*!
 * View Attendee Record
 * File: AttendeeView.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import ProfileData from "@/views/recipients/data/ProfileData.jsx";
import CeremonyData from "@/views/attendees/data/CeremonyData";

/**
 * Inherited model component
 */

export default function AttendeeView({ data }) {
  const { ceremony, recipient } = data || {};

  console.log(ceremony);

  return (
    <div>
      <ProfileData data={recipient} />
      <CeremonyData data={ceremony} />
    </div>
  );
}
