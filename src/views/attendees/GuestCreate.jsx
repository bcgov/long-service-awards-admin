/*!
 * Attendees Create parent component
 * File: AwardEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */
import DataEdit from "@/views/default/DataEdit.jsx";
import { useAPI } from "@/providers/api.provider.jsx";
import GuestEditInput from "./fieldsets/GuestEditInput";
import { useStatus } from "@/providers/status.provider.jsx";

export default function GuestCreate() {
  const api = useAPI();
  const _loader = async () => {};
  const status = useStatus();

  const _save = async (data, callback) => {
    try {
      data.attendee.recipient_accommodations = data.accommodations;
      data.attendee.guest_count = 1;
      data.attendee.guest_accommodations = data.guest_accommodations;
      data.attendee.attendance_confirmed = true;
      data.attendee.confirmed = true;
      data.attendee.status = "attending";
      data = data["attendee"];
      status.setMessage("save");
      return await api.createGuest(data);
    } catch (error) {
      console.log("Error:", error);
      status.setMessage("saveError");
    }
  };

  return (
    <DataEdit
      loader={_loader}
      save={_save}
      remove={null}
      defaults={{}}
      buttonText="Assign"
      header="Confirmation"
    >
      <GuestEditInput />
    </DataEdit>
  );
}
