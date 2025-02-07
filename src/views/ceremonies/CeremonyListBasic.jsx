/*!
 * Ceremonies management view
 * File: CeremonyListBasic.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useAPI } from "@/providers/api.provider.jsx";
import CeremonyEditBasic from "@/views/ceremonies/CeremonyEditBasic";
import CeremonyView from "@/views/ceremonies/CeremonyView";
import DataEdit from "@/views/default/DataEdit.jsx";
import DataList from "@/views/default/DataList";
import { format } from "date-fns";
import { useEffect, useState } from "react";

/**
 * Inherited model component
 */

export default function CeremonyListBasic() {
  const api = useAPI();
  const currentYear = new Date().getFullYear();
  const [currentCycle, setCurrentCycle] = useState(currentYear);

  // LSA-517 Set default report year to cycle year
  api.getCurrentCycle().then(cycle => {

    console.log("Cycle is " +cycle);
    setCurrentCycle(cycle);
  });

  // build edit form template
  const editTemplate = (data, callback) => {
    const { id } = data || {};
    const _loader = async () => api.getCeremony(id);
    const _save = async (data) => api.saveCeremony(data).finally(callback);
    const _remove = id
      ? async () => api.removeCeremony(id).finally(callback)
      : null;
    const _cancel = async () => { callback(); } // PSA-525 callback actually closes the popup
    return (
      <DataEdit
        loader={_loader}
        save={_save}
        remove={_remove}
        cancel={_cancel}
        defaults={data}
        isEditing
        header={"Save Ceremony"}
      >
        <CeremonyEditBasic />
      </DataEdit>
    );
  };

  // build create form template
  const createTemplate = (callback) => {
    const _loader = async () => {};
    const _save = async (data) => {
      return api.createCeremony(data).finally(callback);
    };
    const _cancel = async () => { callback(); } // PSA-525 callback actually closes the popup
    return (
      <DataEdit
        loader={_loader}
        save={_save}
        remove={null}
        cancel={_cancel}
        defaults={{}}
        header={"Create Ceremony"}
      >
        <CeremonyEditBasic />
      </DataEdit>
    );
  };

  const viewTemplate = (data) => <CeremonyView data={data} />;

  const ceremonyDateTemplate = (rowData) => {
    return format(new Date(rowData.datetime), `p 'on' EEEE, MMMM dd, yyyy`);
  };

  const createdAtTemplate = (rowData) => {
    return format(new Date(rowData.created_at), `LL/dd/yyyy, p`);
  };

  const updatedAtTemplate = (rowData) => {
    return format(new Date(rowData.updated_at), `LL/dd/yyyy, p`);
  };

  const schema = [
    {
      name: "datetime",
      input: "text",
      label: "Ceremony Date",
      body: ceremonyDateTemplate,
      sortable: true,
    },
    {
      name: "venue",
      input: "text",
      label: "Venue Name",
      sortable: true,
    },
    {
      name: "updated_at",
      input: "text",
      label: "Updated",
      sortable: true,
      body: updatedAtTemplate,
    },
    {
      name: "created_at",
      input: "text",
      label: "Created",
      sortable: true,
      body: createdAtTemplate,
    },
  ];

  return (
    <DataList
      idKey={"id"}
      schema={schema}
      title={"Ceremonies"}
      loader={api.getCeremonies}
      create={createTemplate}
      edit={editTemplate}
      view={viewTemplate}
      remove={api.removeCeremony}
      defaultFilter={currentCycle}
    />
  );
}
