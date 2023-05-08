/*!
 * Attendees Management View
 * File: AwardList.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useAPI } from "@/providers/api.provider.jsx";
import DataList from "@/views/default/DataList";
import AttendeeView from "@/views/attendees/AttendeeView";
import DataEdit from "@/views/default/DataEdit.jsx";
import AttendeesEdit from "@/views/attendees/AttendeesEdit.jsx";

/**
 * Inherited model component
 */

export default function AttendeesList() {
  const api = useAPI();

  // build edit form template
  const editTemplate = (data, callback) => {
    console.log(data);
    const _loader = async () => {};
    const _save = async (data) =>
      api.saveAttendee(data).then((data) => console.log(data));
    return (
      <DataEdit loader={_loader} save={_save} remove={null} defaults={{}}>
        <AttendeesEdit
          selectedRecipients={[data.recipient]}
          selectedCeremony={data.ceremony}
        />
      </DataEdit>
    );
  };

  const viewTemplate = (data) => <AttendeeView data={data} />;

  const schema = [
    {
      name: "recipient.contact.first_name",
      input: "select",
      label: "First Name",
      sortable: true,
    },
    {
      name: "recipient.contact.last_name",
      input: "select",
      label: "First Name",
      sortable: true,
    },
    {
      name: "ceremony.datetime",
      input: "text",
      label: "Ceremony",
      sortable: true,
    },
    {
      name: "ceremony.created_at",
      input: "date",
      label: "Assigned on",
      sortable: true,
    },
  ];

  return (
    <DataList
      idKey={"id"}
      schema={schema}
      title={"Attendees"}
      loader={api.getAttendees}
      edit={editTemplate}
      view={viewTemplate}
      remove={api.removeAttendee}
      //   options={optionsTemplate}
    />
  );
}
