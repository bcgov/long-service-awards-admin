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
import AttendeesSort from "@/views/attendees/AttendeesSort";
import EditToolBar from "@/views/default/EditToolBar.jsx";
import InvitationCreate from "@/views/invitations/InvitationCreate";
import InvitationReminder from "@/views/invitations/InvitationReminder";
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
import { formatDate } from "@/services/utils.services";
import { ro } from "date-fns/locale";
import { Badge } from "primereact/badge";
import { Message } from "primereact/message";
import { useNavigate, useLocation } from "react-router-dom";
import { v4 as uuid } from "uuid";

export default function AttendeesList() {
  // set default filter values:
  // - Sets default cycle as current year

  const currentYear = new Date().getFullYear();

  const initFilters = {
    global: null,
    first_name: null,
    last_name: null,
    ceremony: null,
    status: null,
    organization: null,
    guest: null,
    cycle: [currentYear],
  };

  const api = useAPI();
  const status = useStatus();
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [totalFilteredRecords, setTotalFilteredRecords] = useState(0);
  const [showRSVPDialog, setShowRSVPDialog] = useState(false);
  const [showRemindersDialog, setShowRemindersDialog] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filters, setFilters] = useState(initFilters);
  const [statusesNumbers, setStatusesNumbers] = useState({
    invited: 0,
    atteding: 0,
    declined: 0,
  });
  const [sort, setSort] = useState({
    orderBy: "last_name",
    order: 1,
  });
  const [pageState, setPageState] = useState({
    first: 0,
    rows: 50,
    page: 1,
  });
  const navigate = useNavigate();

  // LSA-517 Set default report year to cycle year
  useEffect( () => {
  
    api.getCurrentCycle().then(cycle => {
  
      const cycles = [/*...filters.cycle, */+cycle];
      setFilters( Object.assign({}, filters, { cycle: [...new Set(cycles)] }))    
    });
  }, []); // Empty conditions so that it only runs once

  /**
   * Load attendees using applied filter
   * */

  const loadData = (pageState, filters, sort) => {
    setLoading(true);
    const { orderBy, order } = sort || {};
    const { first, rows } = pageState || {};
    // compose list filters
    const filter = {
      orderby: orderBy,
      order: order >= 0 ? "ASC" : "DESC",
      limit: rows,
      offset: first || 0,
      ...filters,
    };
    if (filter.status)
      filter.status = filter.status.map((s) => s.toLowerCase());
    // apply filters to ceremony data request
    api
      .getAttendees(filter)
      .then((res) => {
        let { total_filtered_records, attendees } = res || {};
        attendees = (attendees || [])
          .filter((a) => {
            let attendee = a;
            if (a.guest === 1) {
              attendee = attendees.find(
                (at) => at.recipient.id === a.recipient.id && at.guest === 0
              );
              if (!attendee) return undefined;
              Object.assign(attendee, {
                guest_profile: a,
              });
            }
            return attendee;
          })
          .filter((a) => a.guest === 0);
        setAttendees(attendees);
        setTotalFilteredRecords(total_filtered_records);
        generateStatusesNumbers(attendees);
      })
      .catch(console.error)
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
    setSelected([]);
    setShowDialog(null);
  };

  const showSortDialog = () => {
    setShowDialog("sort");
  };
  const applySort = (sortData) => {
    //sortField comes from clicking datatable column header, dialog and setSort uses orderBy
    if (sortData.sortField) {
      sortData.orderBy = sortData.sortField;
      sortData.order = sortData.sortOrder;
    }

    if (sortData) setSort(sortData);
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
        let _expandedRows = expandedRows;
        attendees.forEach((a) => {
          if (a.recipient.id == data.recipient.id)
            delete _expandedRows[`${a.id}`];
        });
        setExpandedRows(_expandedRows);

        status.setMessage("delete");
        loadData(pageState, filters, sort);
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
    setSelectAll(value.length === totalFilteredRecords);
  };

  const guestCount = (rowData) => {
    return rowData.guest_profile ? 2 : 1;
  };

  const formattedCeremonyDateTemplate = (rowData) => {
    return format(
      new Date(rowData.ceremony.datetime),
      `p 'on' EEEE, MMMM dd, yyyy`
    );
  };

  const formattedCeremonyNoShowTemplate = (rowData) => {
    return rowData.ceremony_noshow ? (
      <Badge value="No Show" severity="danger" />
    ) : (
      ""
    );
  };

  const formattedCreatedDateTemplate = (rowData) => {
    return formatDate(new Date(rowData.created_at));
  };

  const formattedUpdatedDateTemplate = (rowData) => {
    return formatDate(new Date(rowData.updated_at));
  };

  const statusTemplate = (rowData) => {
    const { status } = rowData || {};
    const statusIndicator = statuses[status.replace(/\s/g, "")];
    return (
      <Tag
        tooltip={statusIndicator.description}
        value={statusIndicator.label}
        severity={statusIndicator.severity}
      />
    );
  };

  const generateStatusesNumbers = (attendees) => {
    let attending = 0;
    let declined = 0;
    let invited = 0;
    attendees.forEach((attendee) => {
      if (attendee.status === "attending" && !attendee.guest_profile)
        attending++;
      else if (attendee.status === "attending" && attendee.guest_profile)
        attending += 2;
      else if (attendee.status === "declined") declined++;
      else if (attendee.status === "invited") invited++;
    });
    setStatusesNumbers({ attending, declined, invited });
  };

  const allowExpansion = (rowData) => {
    return rowData.guest_profile;
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="grid col-offset-2 pl-2 gap-3 align-items-center">
        <div>
          <EditToolBar
            item={data.guest_profile}
            save={`/attendees/edit/${data.guest_profile.id}`}
            view={() => onView(data.guest_profile)}
            remove={() => onDelete(data.guest_profile)}
          />
        </div>
        <span className="ml-2 p-column-title">Guest</span>
      </div>
    );
  };

  useEffect(() => {
    loadData(pageState, filters, sort);
  }, [pageState, filters, sort, showRSVPDialog]);

  /**
   * Render data table header component
   * */

  const header = () => {
    return (
      <Fragment>
        <Toolbar
          left={
            <Fragment>
              <Card className={"m-0 p-0"} title={"Attendees"}>
                <Message
                  className="status-number mr-2"
                  severity="info"
                  content={`Invited : ${statusesNumbers.invited}`}
                />
                <Message
                  className="status-number mr-2"
                  severity="success"
                  content={`Attending : ${statusesNumbers.attending}`}
                />
                <Message
                  className="status-number mr-2"
                  severity="error"
                  content={`Declined : ${statusesNumbers.declined}`}
                />
              </Card>
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
                onClick={() => loadData(pageState, filters, sort)}
              />
            </Fragment>
          }
        />
      </Fragment>
    );
  };

  /**
   * Render attendees data table
   * */

  return (
    <Fragment>
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
        <InvitationCreate
          selected={selected}
          setShowRSVPDialog={setShowRSVPDialog}
          callback={setSelected}
        />
      </Dialog>
      { /* LSA-510 Send ceremony reminder emails dialog */ }
      <Dialog
        visible={showRemindersDialog}
        onHide={() => setShowRemindersDialog(false)}
        header={"Send Reminder emails"}
        position="center"
        closable
        maximizable
        modal
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "50vw" }}
      >
        <InvitationReminder
          selected={selected}
          setShowRemindersDialog={setShowRemindersDialog}
          callback={setSelected}
        />
       
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
        <AttendeesSort
          data={sort}
          confirm={applySort}
          cancel={() => setShowDialog(null)}
        />
      </Dialog>
      <Dialog
        visible={showDialog === "filter"}
        onHide={() => setShowDialog(null)}
        header={"Filter Attendees"}
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
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        lazy
        dataKey="id"
        paginator
        paginatorPosition={"top"}
        paginatorRight={
          <Fragment>
            <Button
              className={"m-1 p-button"}
              // disabled={
              //   !selected.length ||
              //   !selected.every((r) => r.status !== "attending" && r.guest !== 1)
              // }
              type="button"
              icon="pi pi-user-plus"
              label="Add Guest"
              onClick={() => navigate("/attendees/create/")}
            />
            <Button
              className={"m-1 p-button-success"}
              // disabled={
              //   !selected.length ||
              //   !selected.every((r) => r.status !== "attending" && r.guest !== 1)
              // }
              type="button"
              icon="pi pi-user-plus"
              label="Send RSVP Invite"
              onClick={() => setShowRSVPDialog(true)}
            />
            {/* LSA-510 Send ceremony reminder emails button */}  
            <Button
              className={"m-1 p-button-success"}
               disabled={
                 !selected.length ||
                 !selected.every((r) => r.status === "attending" )
               }
              type="button"
              icon="pi pi-user-plus"
              label="Send Ceremony Reminders"
              onClick={() => setShowRemindersDialog(true)}
            />
          </Fragment>
        }
        rowClassName="m-0 p-0 w-full"
        stripedRows
        rows={pageState.rows}
        rowsPerPageOptions={[10, 25, 50]}
        totalRecords={totalFilteredRecords}
        onPage={onPage}
        first={pageState.first}
        sortField={sort.orderBy}
        sortOrder={sort.order}
        loading={loading}
        selection={selected}
        onSelectionChange={onSelectionChange}
        selectAll={selectAll}
        // onSelectAllChange={onSelectAllChange}
        tableStyle={{ minHeight: "70vh" }}
        header={header}
        scrollable
        scrollHeight="60vh"
        onSort={applySort}
      >
        <Column selectionMode="multiple" />
        <Column expander={allowExpansion} style={{ width: "5rem" }} />
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
          field="recipient.contact.first_name"
          header="First Name"
          headerStyle={{ minWidth: "7em" }}
          bodyStyle={{ minWidth: "7em" }}
          sortable
        />
        <Column
          className={"p-1"}
          field="recipient.contact.last_name"
          header="Last Name"
          headerStyle={{ minWidth: "7em" }}
          bodyStyle={{ minWidth: "7em" }}
          sortable
        />
        <Column
          className={"p-1"}
          header="Status"
          field="status"
          body={statusTemplate}
          headerStyle={{ minWidth: "10em" }}
          bodyStyle={{ minWidth: "10em" }}
          sortable
        />
        <Column
          className={"p-1"}
          field="guest"
          header="Total Attendees"
          body={guestCount}
          headerStyle={{ minWidth: "7em" }}
          bodyStyle={{ minWidth: "7em" }}
          sortable
        />

        <Column
          className={"p-1"}
          field="recipient.organization.abbreviation"
          header="Organization"
          headerStyle={{ minWidth: "7em" }}
          bodyStyle={{ minWidth: "7em" }}
          sortable
        />
        <Column
          className={"p-1"}
          field="recipient.attending_organization.abbreviation"
          header="Attending Organization"
          headerStyle={{ minWidth: "7em" }}
          bodyStyle={{ minWidth: "7em" }}
        />
        <Column
          className={"p-1"}
          field="ceremony.datetime"
          body={formattedCeremonyDateTemplate}
          header="Ceremony"
          headerStyle={{ minWidth: "7em" }}
          bodyStyle={{ minWidth: "7em" }}
          sortable
        />
        <Column
          className={"p-1"}
          field="ceremony_noshow"
          body={formattedCeremonyNoShowTemplate}
          header="No Show"
          headerStyle={{ minWidth: "7em" }}
          bodyStyle={{ minWidth: "7em" }}
          sortable
        />

        <Column
          className={"p-1"}
          field="created_at"
          header="Assigned"
          body={formattedCreatedDateTemplate}
          headerStyle={{ minWidth: "7em" }}
          bodyStyle={{ minWidth: "7em" }}
          sortable
        />
        <Column
          className={"p-1"}
          field="updated_at"
          header="Updated"
          body={formattedUpdatedDateTemplate}
          headerStyle={{ minWidth: "7em" }}
          bodyStyle={{ minWidth: "7em" }}
          sortable
        />
      </DataTable>
    </Fragment>
  );
}
