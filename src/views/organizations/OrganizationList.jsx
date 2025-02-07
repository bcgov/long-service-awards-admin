/*!
 * Organizations management view
 * File: OrganizationList.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useAPI } from "@/providers/api.provider.jsx";
import DataList from "@/views/default/DataList";
import DataEdit from "@/views/default/DataEdit.jsx";
import OrganizationView from "@/views/organizations/OrganizationView";
import OrganizationEdit from "@/views/organizations/OrganizationEdit";

/**
 * Inherited model component
 */

export default function OrganizationList() {
  const api = useAPI();

  const defaults = {
    name: "",
    abbreviation: "",
    previous_service_pins: false,
    active: false,
    bulk: false,
  };

  // build edit form template
  const editTemplate = (data, callback) => {
    const { id } = data || {};
    const _loader = async () => api.getOrganization(id);
    const _save = async (data) => api.saveOrganization(data).finally(callback);
    const _remove = async () => api.removeOrganization(id).finally(callback);  // Added .finally(callback) so that popup closes
    const _cancel = async () => { callback(); } // PSA-525 callback actually closes the popup
    return (
      <DataEdit loader={_loader} save={_save} remove={_remove} cancel={_cancel} defaults={data}>
        <OrganizationEdit />
      </DataEdit>
    );
  };

  // build create form template
  const createTemplate = (callback) => {
    const _loader = async () => {};
    const _save = async (data) =>
      api.createOrganization(data).finally(callback);
    const _cancel = async () => { callback(); } // PSA-525 callback actually closes the popup
    return (
      <DataEdit loader={_loader} save={_save} remove={null} cancel={_cancel} defaults={defaults}>
        <OrganizationEdit />
      </DataEdit>
    );
  };

  const viewTemplate = (data) => <OrganizationView data={data} />;

  /**
   * Column display templates
   * */

  const activeTemplate = (rowData) => {
    return rowData.active ? "Yes" : "No";
  };

  const bulkTemplate = (rowData) => {
    return rowData.bulk ? "Yes" : "No";
  };

  const retroactivePinsTemplate = (rowData) => {
    return rowData.previous_service_pins ? "Yes" : "No";
  };

  const schema = [
    {
      name: "name",
      input: "test",
      label: "Name",
      sortable: true,
    },
    {
      name: "abbreviation",
      input: "text",
      label: "Abbreviation",
      sortable: true,
    },
    {
      name: "previous_service_pins",
      input: "boolean",
      label: "Retroactive Pins",
      body: retroactivePinsTemplate,
      sortable: true,
    },
    {
      name: "bulk",
      input: "boolean",
      label: "Bulk",
      body: bulkTemplate,
      sortable: true,
    },
    {
      name: "active",
      input: "boolean",
      label: "Active",
      body: activeTemplate,
      sortable: true,
    },
  ];

  return (
    <DataList
      idKey={"id"}
      schema={schema}
      title={"Organizations"}
      loader={api.getOrganizations}
      create={createTemplate}
      edit={editTemplate}
      remove={api.removeOrganization}
      view={viewTemplate}
    />
  );
}
