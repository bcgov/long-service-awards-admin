/*!
 * Attendees Create parent component
 * File: AwardEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */
import DataEdit from "@/views/default/DataEdit.jsx";
import { useAPI } from "@/providers/api.provider.jsx";
import GuestEditInput from "./fieldsets/GuestEditInput";
import { useParams } from "react-router-dom";

export default function GuestCreate() {
  const api = useAPI();
  const _loader = async () => {};

  const _save = async (data) => {
    data.attendee.recipient_accommodations = data.accommodations;
    data.attendee.guest_count = 1;
    // data.attendee.guest = 1;
    data.attendee.guest_accommodations = data.guest_accommodations;
    data.attendee.attendance_confirmed = true;
    data.attendee.confirmed = true;
    data.attendee.status = "attending";
    data = data["attendee"];
    console.log("Saving Guest data:", data);

    try {
      // setMessage("save");
      const [error, result] = await api.saveRSVP(data, data.id, "12345");
      console.log(error);
      if (error) setMessage("saveError");
      else setMessage("saveSuccess");
      if (!error && result) {
        return result;
      }
    } catch (error) {
      setMessage("saveError");
    }
  };

  // const _save = async (data) => {
  //   data.attendee.accommodations = [data.accommodations];
  //   data["recipients"] = data["attendee"];
  //   delete data["attendee"];
  //   delete data["accommodations"];
  //   console.log(data);
  //   api.createAttendee([data.attendee]).finally(callback());
  // };

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
