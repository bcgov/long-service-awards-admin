/*!
 * Awards management view
 * File: AwardList.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useAPI } from "@/providers/api.provider.jsx";
import DataList from "@/views/default/DataList";
import AwardView from "@/views/awards/AwardView.jsx";
import AwardEdit from "@/views/awards/AwardEdit.jsx";
import DataEdit from "@/views/default/DataEdit.jsx";
import AwardOptionsEdit from "@/views/awards/AwardOptionsEdit";

/**
 * Inherited model component
 */

export default function AttendeesList() {
  const api = useAPI();

  //   const awardTypes = [
  //     { name: "stationary", label: "Stationary" },
  //     { name: "clock", label: "Clock" },
  //     { name: "watch", label: "Watch" },
  //     { name: "earrings", label: "Earrings" },
  //     { name: "luggage", label: "Luggage" },
  //     { name: "print", label: "Print" },
  //     { name: "necklace", label: "Necklace" },
  //     { name: "pecsf", label: "PECSF" },
  //     { name: "bracelet", label: "Bracelet" },
  //     { name: "pottery", label: "Pottery" },
  //     { name: "glassware", label: "Glassware" },
  //     { name: "other", label: "Other" },
  //   ];

  //   const optionsTemplate = (data, callback) => {
  //     const { id } = data || {};
  //     const _loader = async () => api.getAward(id);
  //     const _save = async (data) => api.saveAward(data).finally(callback);
  //     const _remove = async () => api.removeAward(id);
  //     return (
  //       <DataEdit loader={_loader} save={_save} remove={_remove} defaults={data}>
  //         <AwardOptionsEdit awardTypes={awardTypes} />
  //       </DataEdit>
  //     );
  //   };

  //   // build edit form template
  //   const editTemplate = (data, callback) => {
  //     const { id } = data || {};
  //     const _loader = async () => api.getAward(id);
  //     const _save = async (data) => api.saveAward(data).finally(callback);
  //     const _remove = id ? async () => api.removeAward(id) : null;
  //     return (
  //       <DataEdit loader={_loader} save={_save} remove={_remove} defaults={data}>
  //         <AwardEdit awardTypes={awardTypes} />
  //       </DataEdit>
  //     );
  //   };

  //   // build create form template
  //   const createTemplate = (callback) => {
  //     const _loader = async () => {};
  //     const _save = async (data) => api.createAward(data).finally(callback);
  //     return (
  //       <DataEdit loader={_loader} save={_save} remove={null} defaults={{}}>
  //         <AwardEdit awardTypes={awardTypes} />
  //       </DataEdit>
  //     );
  //   };

  const viewTemplate = (data) => <AttendeesView data={data} />;

  /**
   * Activated award display template
   * */

  //   const activeTemplate = (rowData) => {
  //     return rowData.active ? "Yes" : "No";
  //   };

  /**
   * Award quantity display template
   * */

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
      name: "ceremony",
      input: "text",
      label: "Ceremony",
      sortable: true,
    },
    {
      name: "created_at",
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
      //   create={createTemplate}
      //   edit={editTemplate}
      view={viewTemplate}
      //   remove={api.removeAward}
      //   options={optionsTemplate}
    />
  );
}
