/*!
 * Attendees Create parent component
 * File: AwardEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */
import DataEdit from "@/views/default/DataEdit.jsx";
import AttendeesEdit from "@/views/attendees/fieldsets/AttendeesEditInput";
import { useAPI } from "@/providers/api.provider.jsx";

export default function AttendeesCreate({ selectedRecipients, callback }) {
  const api = useAPI();
  const _loader = async () => {};
  const _save = async (data) => api.createAttendee(data).finally(callback());

  return (
    <DataEdit
      loader={_loader}
      save={_save}
      remove={null}
      defaults={{}}
      buttonText="Assign"
      header="Confirmation"
    >
      <AttendeesEdit selectedRecipients={selectedRecipients} />
    </DataEdit>
  );
}
