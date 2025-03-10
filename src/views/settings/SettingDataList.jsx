/*!
 * LSA.Admin.Components.RecipientList
 * File: RecipientList.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import { useState, useEffect, Fragment } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useStatus } from "@/providers/status.provider.jsx";
import EditToolBar from "@/views/default/EditToolBar.jsx";
import { Toolbar } from "primereact/toolbar";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";

export default function SettingDataList({
  idKey = "id",
  title = "Manage",
  schema = [],
  create = null,
  remove,
  edit,
  view,
  options,
  loader,
  isEditing,
  defaultFilter = null,
}) {
  const status = useStatus();
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const loadDefaultFilter = defaultFilter ? defaultFilter : "";
  const [globalFilterValue, setGlobalFilterValue] = useState(loadDefaultFilter);
  const [showDialog, setShowDialog] = useState(null);
  const [expandedRows, setExpandedRows] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: defaultFilter, matchMode: FilterMatchMode.CONTAINS },
  });

  /**
   * Data loader
   * */

  const loadData = () => {
    setLoading(true);
    // load records into view
    loader()
      .then((data) => {
        setItems(data);
        setTotalRecords(data.length);
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
        setIsLoaded(true);
      });
  };
  useEffect(loadData, []);

  useEffect(() => {
    if (isLoaded) {
      setDisabledRecords(items);
      setIsLoaded(false);
    }
  });

  const setDisabledRecords = () => {
    var rsvpActive = items.find((item) => {
      if (item.name === "ceremony-rsvp-active") return item;
    }).value;
    items.forEach((item) => {
      if (
        rsvpActive === "false" &&
        (item.name === "ceremony-rsvp-open-date" ||
          item.name === "ceremony-rsvp-close-date")
      )
        item.disabled = true;
      else item.disabled = false;
    });
  };

  /**
   * Filters and hooks
   * */

  const clear = () => {
    setShowDialog(null);
    setSelected(null);
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const resetSearch = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };

  /**
   * Templates
   * */

  /**
   * Show new record edit dialog
   * */

  const Create = () => {
    return create(() => {
      clear();
      loadData();
    });
  };

  /**
   * View record data
   * - render data display view passed to component
   * */

  const onView = (data) => {
    return view(data);
  };

  /**
   * Edit record data
   * - render edit fieldset passed to component
   * */

  const onEdit = (data, callback) => {
    return edit(data, callback);
  };

  /**
   * Open create dialog
   * */

  const onCreate = async () => {
    setShowDialog("create");
  };

  /**
   * Edit Options data
   * - render options fieldset passed to component
   * */

  const onOptions = (data, callback) => {
    return options ? options(data, callback) : null;
  };

  /**
   * Delete record
   * - delete record by ID
   * */

  const onDelete = async (data) => {
    try {
      setLoading(true);
      const id = data.hasOwnProperty(idKey) ? data[idKey] : null;
      const [error] = await remove(id);
      if (error) status.setMessage("deleteError");
      else {
        status.setMessage("delete");
        loadData();
      }
    } catch (error) {
      status.setMessage("deleteError");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Select record for action
   * */

  const onSelectionChange = (event) => {
    const value = event.value;
    setSelected(value);
    setSelectAll(value.length === totalRecords);
  };

  const onSelectAllChange = () => {};

  /**
   * Render data table header component
   * */

  const header = () => {
    return (
      <>
        <Toolbar
          left={
            <Fragment>
              <Card className={"m-0 p-0"} title={title}></Card>
              {create && (
                <Button
                  className={"m-2"}
                  type="button"
                  icon="pi pi-plus"
                  label={`Add New`}
                  onClick={onCreate}
                />
              )}
              <Button
                className={"m-2"}
                type="button"
                icon="pi pi-sync"
                label="Refresh"
                onClick={loadData}
              />
            </Fragment>
          }
          right={
            <Fragment>
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  type="search"
                  value={globalFilterValue}
                  onChange={onGlobalFilterChange}
                  placeholder="Keyword Search"
                />
              </span>
              <Button
                className={"m-2"}
                type="button"
                icon="pi pi-filter-slash"
                label="Clear"
                onClick={resetSearch}
              />
            </Fragment>
          }
        />
      </>
    );
  };

  const valueTemplate = (rowData) => {
    console.log(rowData);
    if (
      rowData.name == "ceremony-rsvp-open-date" ||
      rowData.name == "ceremony-rsvp-close-date"
    )
      return new Date(rowData.value).toLocaleString([], {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    else return rowData.value;
  };

  /**
   * Render data table
   * */

  return (
    <>
      <Dialog
        visible={showDialog === "create"}
        onHide={clear}
        onClick={(e) => {
          e.stopPropagation();
        }}
        header={isEditing ? "Edit Record" : "Create Record"}
        position="center"
        closable
        maximizable
        modal
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "50vw" }}
      >
        <Create />
      </Dialog>

      <DataTable
        value={items}
        sortField="name"
        sortOrder={1}
        dataKey={idKey}
        var="setting"
        rowClassName={(rowData) =>
          rowData.disabled ? "m-0 p-0 disabled-setting-row" : "m-0 p-0"
        }
        stripedRows
        loading={loading}
        selection={selected}
        onSelectionChange={onSelectionChange}
        filters={filters}
        filterDisplay="row"
        globalFilterFields={schema.map(({ name }) => name)}
        selectAll={selectAll}
        onSelectAllChange={onSelectAllChange}
        tableStyle={{ minHeight: "70vh" }}
        header={header}
        scrollable
        scrollHeight="70vh"
      >
        <Column
          bodyStyle={{ maxWidth: "3em" }}
          headerStyle={{ maxWidth: "3em" }}
          selectionMode="multiple"
        />
        <Column
          className={"p-1"}
          bodyStyle={{ overflow: "visible", maxWidth: "12em" }}
          headerStyle={{ overflow: "visible", maxWidth: "12em" }}
          body={(rowData) => {
            return (
              <EditToolBar
                loader={loadData}
                save={(callback) => onEdit(rowData, callback)}
                view={() => onView(rowData)}
                remove={remove ? () => onDelete(rowData) : null}
                options={
                  options ? (callback) => onOptions(rowData, callback) : null
                }
              />
            );
          }}
        />
        {schema.map((col, i) => {
          if (col.name == "value")
            return (
              <Column
                className={"p-1"}
                sortField={col.name}
                sortable={col.sortable}
                key={`${col.name}-${i}`}
                field={col.name}
                header={col.label}
                body={valueTemplate}
              />
            );
          else
            return (
              <Column
                className={"p-1"}
                sortField={col.name}
                sortable={col.sortable}
                key={`${col.name}-${i}`}
                field={col.name}
                header={col.label}
                body={col.body}
              />
            );
        })}
      </DataTable>
    </>
  );
}
