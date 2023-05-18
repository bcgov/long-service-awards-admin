/*!
 * LSA.Admin.Components.CeremonyList
 * File: Ceremony.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import { useState, useEffect, Fragment } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { useStatus } from "@/providers/status.provider.jsx";
import { useAPI } from "@/providers/api.provider.jsx";
import EditToolBar from "@/views/default/EditToolBar.jsx";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
//import CeremonyView from "@/views/ceremonies/CeremonyView";
import { Card } from "primereact/card";

export default function CeremonyList() {
  // set default filter values:
  const initFilters = {
    venue: null,
    updated_at: null,
    created_at: null,
  };
  const api = useAPI();
  const status = useStatus();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(null);
  const [ceremonies, setCeremonies] = useState([]);
  const [stats, setStats] = useState({
    total_count: 0,
  });
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filters, setFilters] = useState(initFilters);
  const [currentCycle, setCurrentCycle] = useState(null);
  const [pageState, setPageState] = useState({
    first: 0,
    rows: 10,
    page: 1,
    sortField: "id",
    sortOrder: 0,
    filters: {},
  });

  /**
   * Load ceremonies using applied filter
   * */

  useEffect(() => {
    loadData();
  }, [pageState, filters]);

  const loadData = () => {
    setLoading(true);
    const { first, rows, sortField, sortOrder } = pageState || {};
    // compose list filters
    const filter = {
      orderby: sortField,
      order: sortOrder >= 0 ? "ASC" : "DESC",
      limit: rows,
      offset: first || 0,
      ...filters,
    };

    // apply filters to ceremony data request
    api
      .getCeremonies()
      .then((results) => {
        const { total_filtered_records, ceremonies } = results || {};
        console.log(ceremonies);
        setCeremonies(ceremonies);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // create new ceremony night
  const createCeremony = async () => {
    try {
      status.setMessage("create");
      // create ceremony record stub and redirect
      const [error, res] = await api.createCeremony();
      const { message, result } = res || {};
      if (error) status.setMessage("createError");
      else status.setMessage(message);

      if (!error && result) {
        const { id } = result;
        navigate(`/ceremonies/edit/${id}`);
      }
    } catch (error) {
      status.setMessage("createError");
    }
  };

  // utility to format dates as readable
  const formatDate = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateOnly = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const clearFilter = () => {
    setFilters(initFilters);
  };

  const showFilterDialog = () => {
    setShowDialog("filter");
  };
  const applyFilter = (filterData) => {
    if (filterData) setFilters(filterData);
    setShowDialog(null);
  };

  const showSortDialog = () => {
    setShowDialog("sort");
  };
  const applySort = (sortData) => {
    if (sortData) setPageState({ ...pageState, ...sortData });
    setShowDialog(null);
  };

  /**
   * Column templates
   * */

  const updatedDateTemplate = (rowData) => {
    return formatDate(rowData.updated_at);
  };

  const createdDateTemplate = (rowData) => {
    return formatDate(rowData.created_at);
  };

  const ceremonyDateTemplate = (rowData) => {
    return format(new Date(rowData.datetime), `p 'on' EEEE, MMMM dd, yyyy`);
  };

  /**
   * Lazy loading
   * */

  const onPage = (event) => {
    setPageState(event);
  };

  /**
   * View ceremony record
   * */

  // const onView = (data) => {
  //     return <CeremonyView data={data} />
  // }

  /**
   * Delete ceremony record
   * */

  const onDelete = (data) => {
    const { id } = data || {};
    console.log(id);
    api
      .removeCeremony(id)
      .then(() => {
        status.setMessage("delete");
        loadData();
      })
      .catch((e) => {
        console.error(e);
        status.setMessage("deleteError");
      });
  };

  /**
   * Select ceremony for action
   * */

  const onSelectionChange = (event) => {
    const value = event.value;
    setSelected(value);
    setSelectAll(value.length === stats);
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
              <Card className={"m-0 p-0"} title={"Ceremonies"}></Card>
            </Fragment>
          }
          right={
            <Fragment>
              <Button
                className={"m-1"}
                type="button"
                icon="pi pi-sort"
                label="Sort"
                onClick={showSortDialog}
              />
              <Button
                className={"m-1"}
                type="button"
                icon="pi pi-filter"
                label="Filter"
                onClick={showFilterDialog}
              />
              <Button
                className={"m-1"}
                type="button"
                icon="pi pi-filter-slash"
                label="Clear"
                onClick={clearFilter}
              />
              <Button
                className={"m-1"}
                type="button"
                icon="pi pi-sync"
                label="Refresh"
                onClick={loadData}
              />
            </Fragment>
          }
        />
      </>
    );
  };

  /**
   * Render ceremony data table
   * */

  return (
    <>
      <Dialog
        visible={showDialog === "sort"}
        onHide={() => setShowDialog(null)}
        header={"Sort Ceremonies"}
        position="center"
        closable
        maximizable
        modal
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "50vw" }}
      >
        {/* <CeremoniesSort
                data={pageState}
                confirm={applySort}
                cancel={() => setShowDialog(null)}
            /> */}
      </Dialog>
      <Dialog
        visible={showDialog === "filter"}
        onHide={() => setShowDialog(null)}
        header={"Filter Ceremonies"}
        position="center"
        closable
        maximizable
        modal
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "50vw" }}
      >
        {/* <CeremoniesFilter
                data={filters || {}}
                confirm={applyFilter}
                cancel={() => setShowDialog(null)}
            /> */}
      </Dialog>
      <DataTable
        value={ceremonies}
        lazy
        dataKey="id"
        paginator
        paginatorPosition={"top"}
        paginatorRight={
          <Button
            className={"m-1 p-button-success"}
            type="button"
            icon="pi pi-user-plus"
            label="Register"
            onClick={createCeremony}
          />
        }
        rowClassName="m-0 p-0 w-full"
        stripedRows
        rows={pageState.rows}
        rowsPerPageOptions={[10, 25, 50]}
        onPage={onPage}
        first={pageState.first}
        sortField={pageState.sortField}
        sortOrder={pageState.sortOrder}
        loading={loading}
        selection={selected}
        onSelectionChange={onSelectionChange}
        selectAll={selectAll}
        onSelectAllChange={onSelectAllChange}
        tableStyle={{ minHeight: "70vh" }}
        header={header}
        scrollable
        scrollHeight="60vh"
      >
        <Column selectionMode="multiple" />
        <Column
          className={"p-1"}
          bodyStyle={{ overflow: "visible", maxWidth: "12em" }}
          headerStyle={{ overflow: "visible", maxWidth: "12em" }}
          body={(rowData) => {
            return (
              <EditToolBar
                item={rowData}
                save={`/ceremonies/edit/${rowData.id}`}
                view={() => onView(rowData)}
                remove={() => onDelete(rowData)}
              />
            );
          }}
        />
        <Column
          className={"p-1"}
          header="Ceremony Date"
          field="datetime"
          body={ceremonyDateTemplate}
          headerStyle={{ minWidth: "10em" }}
          bodyStyle={{ minWidth: "10em" }}
        />
        <Column
          className={"p-1"}
          header="Venue Name"
          field="venue"
          headerStyle={{ minWidth: "10em" }}
          bodyStyle={{ minWidth: "10em" }}
        />
        <Column
          className={"p-1"}
          field="updated_at"
          header="Updated"
          body={updatedDateTemplate}
          headerStyle={{ minWidth: "7em" }}
          bodyStyle={{ minWidth: "7em" }}
        />
        <Column
          className={"p-1"}
          field="created_at"
          header="Created"
          body={createdDateTemplate}
          headerStyle={{ minWidth: "7em" }}
          bodyStyle={{ minWidth: "7em" }}
        />
      </DataTable>
    </>
  );
}
