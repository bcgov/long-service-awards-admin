/*!
 * Attendees Management View
 * File: AttendeesList.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useAPI } from "@/providers/api.provider.jsx";
import { useStatus } from "@/providers/status.provider.jsx";
import AttendeeView from "@/views/attendees/AttendeeView";
import AttendeesFilter from "@/views/attendees/AttendeesFilter.jsx";
import EditToolBar from "@/views/default/EditToolBar.jsx";
import InvitationCreate from "@/views/invitations/InvitationCreate";
import { format } from "date-fns";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { Toolbar } from "primereact/toolbar";
import { Fragment, useEffect, useState } from "react";
import { ceremonyStatuses as statuses } from "@/constants/statuses.constants.js";

export default function AttendeesList() {
  // set default filter values:
  const initFilters = {
    global: null,
    first_name: null,
    last_name: null,
    ceremony: null,
    status: null,
    organization: null,
  };

  const api = useAPI();
  const status = useStatus();
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [stats, setStats] = useState({
    total_count: 0,
  });
  const [showRSVPDialog, setShowRSVPDialog] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filters, setFilters] = useState(initFilters);
  const [pageState, setPageState] = useState({
    first: 0,
    rows: 10,
    page: 1,
    sortField: "id",
    sortOrder: 0,
    filters: {},
  });

  /**
   * Load attendees using applied filter
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
      // .getAttendees(filter)
      .getAttendees()
      .then((results) => {
        // const { total_filtered_records, attendees } = results || {};
        const attendees = results || {};
        results.forEach((r) => {
          r.ceremony.datetime_formatted = format(
            new Date(r.ceremony.datetime),
            `p 'on' EEEE, MMMM dd, yyyy`
          );
          r.ceremony.created_at_formatted = format(
            new Date(r.ceremony.created_at),
            "EEEE, MMMM dd, yyyy"
          );
          r.created_at_formatted = format(
            new Date(r.created_at),
            "dd/mm/yy, h:mm aa"
          );
        });
        setAttendees(attendees);
        // setTotalFilteredRecords(total_filtered_records);
      })
      .finally(() => {
        setLoading(false);
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
   * Lazy loading
   * */

  const onPage = (event) => {
    setPageState(event);
  };

  /**
   * View ceremony record
   * */

  const onView = (data) => {
    return <AttendeeView data={data} />;
  };

  /**
   * Delete ceremony record
   * */

  const onDelete = (data) => {
    const { id } = data || {};
    api
      .removeAttendee(id)
      .then(() => {
        status.setMessage("delete");
        loadData();
      })
      .catch((e) => {
        console.error(e);
        status.setMessage("deleteError");
      });
  };

  // const editTemplate = (data, callback) => {
  //   console.log(data);

  /**
   * Select ceremony for action
   * */

  const onSelectionChange = (event) => {
    const value = event.value;
    setSelected(value);
    setSelectAll(value.length === stats);
  };

  const onSelectAllChange = () => {};

  const guestTemplate = (rowData) => {
    const { guest } = rowData || {};
    return guest === 1 ? "Yes" : "No";
  };

  const statusTemplate = (rowData) => {
    const { status } = rowData || {};
    const statusIndicator = statuses[status.toLowerCase()];
    return (
      <Tag
        tooltip={statusIndicator.description}
        value={statusIndicator.label}
        severity={statusIndicator.severity}
      />
    );
  };

  /**
   * Render data table header component
   * */

  const header = () => {
    return (
      <>
        <Toolbar
          left={
            <Fragment>
              <Card className={"m-0 p-0"} title={"Attendees"}></Card>
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
   * Render attendees data table
   * */

  return (
    <>
      <Dialog
        visible={showRSVPDialog}
        onHide={() => setShowRSVPDialog(false)}
        header={"RSVP"}
        position="center"
        closable
        maximizable
        modal
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "50vw" }}
      >
        <InvitationCreate selected={selected} />
      </Dialog>
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
        <AttendeesFilter
          data={filters || {}}
          confirm={applyFilter}
          cancel={() => setShowDialog(null)}
        />
      </Dialog>
      <DataTable
        value={attendees}
        lazy
        dataKey="id"
        paginator
        paginatorPosition={"top"}
        paginatorRight={
          <Button
            className={"m-1 p-button-success"}
            disabled={
              !selected.length || !selected.every((r) => r.status !== "Invited")
            }
            type="button"
            icon="pi pi-user-plus"
            label="Send RSVP Invite"
            onClick={() => setShowRSVPDialog(true)}
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
                save={`/attendees/edit/${rowData.id}`}
                view={() => onView(rowData)}
                remove={() => onDelete(rowData)}
              />
            );
          }}
        />
        <Column
          className={"p-1"}
          header="Status"
          field="status"
          body={statusTemplate}
          headerStyle={{ minWidth: "10em" }}
          bodyStyle={{ minWidth: "10em" }}
        />
        <Column
          className={"p-1"}
          field="recipient.contact.first_name"
          header="First Name"
          headerStyle={{ minWidth: "7em" }}
          bodyStyle={{ minWidth: "7em" }}
        />
        <Column
          className={"p-1"}
          field="recipient.contact.last_name"
          header="Last Name"
          headerStyle={{ minWidth: "7em" }}
          bodyStyle={{ minWidth: "7em" }}
        />
        <Column
          className={"p-1"}
          field="recipient.organization.abbreviation"
          header="Organization"
          headerStyle={{ minWidth: "7em" }}
          bodyStyle={{ minWidth: "7em" }}
        />
        <Column
          className={"p-1"}
          field="ceremony.datetime_formatted"
          header="Ceremony"
          headerStyle={{ minWidth: "7em" }}
          bodyStyle={{ minWidth: "7em" }}
        />
        <Column
          className={"p-1"}
          field="guest"
          header="Guest"
          body={guestTemplate}
          headerStyle={{ minWidth: "7em" }}
          bodyStyle={{ minWidth: "7em" }}
        />
        <Column
          className={"p-1"}
          field="created_at_formatted"
          header="Assigned"
          headerStyle={{ minWidth: "7em" }}
          bodyStyle={{ minWidth: "7em" }}
        />
      </DataTable>
    </>
  );
}
