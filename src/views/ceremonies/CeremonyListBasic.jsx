/*!
 * Ceremonies management view
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
import CeremonyEdit from "@/views/ceremonies/CeremonyEdit";
import CeremonyEditBasic from "@/views/ceremonies/CeremonyEditBasic";
import CeremonyView from "@/views/ceremonies/CeremonyView";
import { format } from "date-fns";

/**
 * Inherited model component
 */

export default function CeremonyListBasic() {
  const api = useAPI();

  // build edit form template
  const editTemplate = (data, callback) => {
    const { id } = data || {};
    const _loader = async () => api.getCeremony(id);
    const _save = async (data) => api.saveCeremony(data).finally(callback);
    const _remove = id ? async () => api.removeCeremony(id) : null;
    return (
      <DataEdit loader={_loader} save={_save} remove={_remove} defaults={data}>
        <CeremonyEditBasic />
      </DataEdit>
    );
  };

  // build create form template
  const createTemplate = (callback) => {
    const _loader = async () => {};
    const _save = async (data) => {
      // return api.createCeremony(data).finally(callback);
      return api.createCeremony(data);
    };
    return (
      <DataEdit loader={_loader} save={_save} remove={null} defaults={{}}>
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

  /**
   * Activated award display template
   * */

  //   const activeTemplate = (rowData) => {
  //     return rowData.active ? "Yes" : "No";
  //   };

  /**
   * Award quantity display template
   * */

  //   const quantityTemplate = (rowData) => {
  //     return rowData.quantity > 0 ? rowData.quantity : "-";
  //   };

  /**
   * Award selection quantity display template
   * */

  const selectedTemplate = (rowData) => {
    return rowData.selected ? rowData.selected : 0;
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
    // {
    //   name: "created_at",
    //   input: "text",
    //   label: "Selected",
    //   body: selectedTemplate,
    //   sortable: true,
    // },
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
      //   options={optionsTemplate}
    />
  );
}
