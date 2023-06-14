/*!
 * View Attendee Record
 * File: AttendeeView.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import ProfileData from "@/views/recipients/data/ProfileData.jsx";
import CeremonyData from "@/views/attendees/data/CeremonyData";
import AccommodationsData from "@/views/attendees/data/AccommodationsData";
import GuestData from "@/views/attendees/data/GuestData";

/**
 * Inherited model component
 */

export default function AttendeeView({ data }) {
  const { ceremony, recipient } = data || {};

  return (
    <div>
      <ProfileData data={recipient} />
      <GuestData data={data} />
      <CeremonyData data={ceremony} />
      <AccommodationsData data={data} />
    </div>
  );
}
