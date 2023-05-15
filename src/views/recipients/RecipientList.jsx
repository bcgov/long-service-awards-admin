/*!
 * LSA.Admin.Components.RecipientList
 * File: RecipientList.jsx
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
import RecipientsSort from "@/views/recipients/RecipientsSort";
import RecipientsFilter from "@/views/recipients/RecipientsFilter.jsx";
import { useNavigate } from "react-router-dom";
import RecipientView from "@/views/recipients/RecipientView";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from "primereact/autocomplete";
import DataEdit from "@/views/default/DataEdit.jsx";
import AttendeesEdit from "../attendees/fieldsets/AttendeesEditInput";
import AttendeesCreate from "../attendees/AttendeesCreate";

export default function RecipientList() {
  // set default filter values:
  // - shows confirmed registrations only
  // - 25-Year threshold for milestones (LSAs)
  const initFilters = {
    global: null,
    status: null,
    first_name: null,
    last_name: null,
    employee_number: null,
    organization: null,
    cycle: [2023],
    milestones: [25, 30, 35, 40, 45, 50, 55],
    qualifying_year: null,
    ceremony: null,
    ceremony_opt_out: null,
    confirmed: null,
    updated_at: null,
    created_at: null,
  };
  const api = useAPI();
  const status = useStatus();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [stats, setStats] = useState({
    total_count: 0,
    lsa_current_count: 0,
    lsa_previous_count: 0,
    service_pins_count: 0,
    retroactive_service_pins_count: 0,
    other_count: 0,
  });
  const [totalFilteredRecords, setTotalFilteredRecords] = useState(0);
  const [filteredRecipients, setFilteredRecipients] = useState([]);
  const [selected, setSelected] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filters, setFilters] = useState(initFilters);
  const [sort, setSort] = useState({
    orderBy: "last_name",
    order: 1,
  });
  const [currentCycle, setCurrentCycle] = useState(null);
  const [pageState, setPageState] = useState({
    first: 0,
    rows: 10,
    page: 1,
  });
  const [showCeremonyAssignDialog, setShowCeremonyAssignDialog] =
    useState(false);

  const searchRecipients = (event) => {
    let filteredRecipients = recipients.map((r) => {
      if (r.services.find((s) => s.ceremony_opt_out === false)) return r;
    });
    setFilteredRecipients(filteredRecipients);
  };
  /**
   * Load recipients using applied filter
   * */

  useEffect(() => {
    loadData(pageState, filters, sort);
  }, [pageState, filters, sort]);

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

    // get attendees records
    api.getAttendees().then((results) => setAttendees(results));

    // get current cycle
    api
      .getQualifyingYears()
      .then((years) => {
        const { name } = (years || []).find((y) => y.current) || {};
        setCurrentCycle(name);
      })
      .catch(console.error);

    // get records stats
    api
      .getRecipientStats()
      .then((stats) =>
        setStats(
          stats || {
            total_count: 0,
            lsa_current_count: 0,
            lsa_previous_count: 0,
            service_pins_count: 0,
            retroactive_service_pins_count: 0,
            other_count: 0,
          }
        )
      )
      .catch(console.error);

    // apply filters to recipient data request
    api
      .getRecipients(filter)
      .then((results) => {
        const { total_filtered_records, recipients } = results || {};
        setRecipients(recipients);
        console.log(recipients);
        setTotalFilteredRecords(total_filtered_records);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // create new registration
  const createRecipient = async () => {
    try {
      status.setMessage("create");
      // create recipient record stub and redirect
      const [error, res] = await api.createRecipient();
      const { message, result } = res || {};
      if (error) status.setMessage("createError");
      else status.setMessage(message);
      if (!error && result) {
        const { id } = result;
        navigate(`/recipients/edit/${id}`);
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

  /**
   * Filtered pagination
   * */

  const showFilterDialog = () => {
    setShowDialog("filter");
  };

  const applyFilter = (filterData) => {
    if (filterData) setFilters(filterData);
    setShowDialog(null);
  };

  const clearFilter = () => {
    setFilters(initFilters);
  };

  /**
   * Sorted pagination
   * */

  const showSortDialog = () => {
    setShowDialog("sort");
  };

  const applySort = (sortData) => {
    if (sortData) setSort(sortData);
    setShowDialog(null);
  };

  /**
   * Column templates
   * */

  const ceremonyTemplate = (rowData) => {
    const { services } = rowData || {};
    const ceremonyOptOut = (services || []).some(
      (service) => service.cycle === currentCycle && service.ceremony_opt_out
    );

    const statuses = {
      assigned: {
        label: "Assigned",
        severity: "primary",
      },
      declined: {
        label: "Declined",
        severity: "danger",
      },
      expired: {
        label: "Expired",
        severity: "danger",
      },
      invited: {
        label: "Invited",
        severity: "primary",
      },
      archived: {
        label: "Archived",
        severity: "info",
      },
      attending: {
        label: "Attending",
        severity: "success",
      },
      default: {
        label: "Not Assigned",
        severity: "secondary",
      },
    };
    // select the recipient status
    let statusIndicator = ceremonyOptOut ? statuses.declined : statuses.default;
    // check if recipient is an attendee
    const attendee = attendees.find((a) => a.recipient.id === rowData.id);
    if (attendee) statusIndicator = statuses[attendee.status.toLowerCase()];

    return (
      <>
        {statusIndicator && (
          <div>
            <Tag
              value={statusIndicator.label}
              severity={statusIndicator.severity}
            />
          </div>
        )}
      </>
    );
  };

  /**
   * Column templates
   * */

  const statusTemplate = (rowData) => {
    const { services, status } = rowData || {};
    const confirmed = (services || []).some(
      (service) => service.cycle === currentCycle && service.confirmed
    );
    // const inCurrentCycle = (services || [])
    //     .some(service => service.cycle === currentCycle);
    const { user } = rowData || {};
    const { idir, first_name, last_name } = user || {};
    const statuses = {
      archived: {
        label: "Archived",
        severity: "info",
        description: "Recipient is archived from a previous cycle.",
      },
      self: {
        label: "Self",
        severity: "primary",
        description: "Recipient self-registered",
      },
      delegated: {
        label: "Delegated",
        severity: "warning",
        description: `Recipient was registered by ${idir} (${
          first_name + " " + last_name
        }).`,
      },
      registered: {
        label: "Registered",
        severity: "info",
        description: "Registration has been confirmed.",
      },
      validated: {
        label: "Validated",
        severity: "success",
        description: "Registration data has been validated.",
      },
      default: {
        label: "In-Progress",
        severity: "warning",
        description: "Registration is in progress or incomplete.",
      },
    };
    const statusIndicator =
      confirmed && status === "validated"
        ? statuses.validated
        : confirmed
        ? statuses.registered
        : statuses.default;
    return (
      <Tag
        tooltip={statusIndicator.description}
        value={statusIndicator.label}
        severity={statusIndicator.severity}
      />
    );
  };

  const servicesTemplate = (rowData) => {
    const { services } = rowData || {};
    return (
      <DataTable
        dataKey={"milestone"}
        sortField={"milestone"}
        sortOrder={-1}
        header={""}
        className={"w-full text-xs"}
        value={services}
      >
        <Column className={"pt-0 pb-0"} field="cycle"></Column>
        <Column
          sortField={"milestone"}
          className={"pt-0 pb-0"}
          field="milestone"
        ></Column>
        <Column className={"pt-0 pb-0"} field="qualifying_year"></Column>
      </DataTable>
    );
  };

  const updatedDateTemplate = (rowData) => {
    return formatDate(rowData.updated_at);
  };

  // const createdDateTemplate = (rowData) => {
  //     return formatDate(rowData.created_at);
  // };

  /**
   * Lazy loading
   * */

  const onPage = (event) => {
    setPageState(event);
  };

  /**
   * View recipient record
   * */

  const onView = (data) => {
    return <RecipientView data={data} currentCycle={currentCycle} />;
  };

  /**
   * Delete recipient record
   * */

  const onDelete = (data) => {
    const { id } = data || {};
    api
      .removeRecipient(id)
      .then(() => {
        status.setMessage("delete");
        loadData(pageState, filters, sort);
      })
      .catch((e) => {
        console.error(e);
        status.setMessage("deleteError");
      });
  };

  /**
   * Select recipient for action
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

  const formatDateOnly = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const header = () => {
    return (
      <>
        <Toolbar
          left={
            <Fragment>
              <Card className={"m-0 p-0"} title={"Recipients"}></Card>
            </Fragment>
          }
          right={
            <Fragment>
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
                icon="pi pi-sort"
                label="Sort"
                onClick={showSortDialog}
              />
              <Button
                className={"m-1"}
                type="button"
                icon="pi pi-sync"
                label="Refresh"
                onClick={() => loadData(pageState, filters, sort)}
              />
              <Button
                className={"m-1 p-button-help"}
                type="button"
                icon="pi pi-ticket"
                label="Assign to Ceremony"
                onClick={() => setShowCeremonyAssignDialog(true)}
                disabled={
                  !selected.length ||
                  !selected.every((r) =>
                    r.services.find((s) => s.ceremony_opt_out === false)
                  )
                }
              />
              <Button
                className={"m-1 p-button-success"}
                type="button"
                icon="pi pi-user-plus"
                label="Register"
                onClick={createRecipient}
              />
            </Fragment>
          }
        />
      </>
    );
  };

  /**
   * Render recipient data table
   * */

  return (
    <>
      <Dialog
        visible={showCeremonyAssignDialog}
        onHide={() => setShowCeremonyAssignDialog(false)}
        header={"Assign to Ceremony"}
        position="center"
        closable
        maximizable
        modal
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "50vw" }}
      >
        <AttendeesCreate
          selectedRecipients={selected}
          callback={setShowCeremonyAssignDialog}
        />
      </Dialog>
      <Dialog
        visible={showDialog === "sort"}
        onHide={() => setShowDialog(null)}
        header={"Sort Recipients"}
        position="center"
        closable
        maximizable
        modal
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "50vw" }}
      >
        <RecipientsSort
          data={sort}
          confirm={applySort}
          cancel={() => setShowDialog(null)}
        />
      </Dialog>
      <Dialog
        visible={showDialog === "filter"}
        onHide={() => setShowDialog(null)}
        header={"Filter Recipients"}
        position="center"
        closable
        maximizable
        modal
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "50vw" }}
      >
        <RecipientsFilter
          data={filters || {}}
          confirm={applyFilter}
          cancel={() => setShowDialog(null)}
        />
      </Dialog>
      <DataTable
        value={recipients}
        lazy
        dataKey="id"
        paginator
        paginatorPosition={"top"}
        paginatorLeft={
          <DataTable className={"text-xs"} value={[stats || {}]}>
            <Column
              headerStyle={{ width: "5rem" }}
              bodyStyle={{ width: "5rem" }}
              field="lsa_current_count"
              header="LSA"
            ></Column>
            <Column
              headerStyle={{ width: "5rem" }}
              bodyStyle={{ width: "5rem" }}
              field="service_pins_count"
              header="Pins"
            ></Column>
            <Column
              headerStyle={{ width: "5rem" }}
              bodyStyle={{ width: "5rem" }}
              field="retroactive_service_pins_count"
              header="RetroPins"
            ></Column>
            <Column
              headerStyle={{ width: "5rem" }}
              bodyStyle={{ width: "5rem" }}
              field="lsa_previous_count"
              header="Archived"
            ></Column>
            <Column
              headerStyle={{ width: "5rem" }}
              bodyStyle={{ width: "5rem" }}
              field="other_count"
              header="Incomplete"
            ></Column>
            <Column
              headerStyle={{ width: "5rem" }}
              bodyStyle={{ width: "5rem" }}
              field="total_count"
              header="Total"
            ></Column>
            <Column
              headerStyle={{ width: "5rem" }}
              bodyStyle={{ width: "5rem" }}
              field="filtered"
              header="Filtered"
              body={<>{totalFilteredRecords}</>}
            ></Column>
          </DataTable>
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
                save={`/recipients/edit/${rowData.id}`}
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
          headerStyle={{ minWidth: "8em" }}
          bodyStyle={{ minWidth: "8em" }}
          body={statusTemplate}
        />
        <Column
          className={"p-1"}
          header="First Name"
          field="contact.first_name"
          headerStyle={{ minWidth: "10em" }}
          bodyStyle={{ minWidth: "10em" }}
        />
        <Column
          className={"p-1"}
          header="Last Name"
          field="contact.last_name"
          headerStyle={{ minWidth: "10em" }}
          bodyStyle={{ minWidth: "10em" }}
        />
        <Column
          className={"p-1"}
          header="Empl. No."
          field="employee_number"
          headerStyle={{ minWidth: "7em" }}
          bodyStyle={{ minWidth: "7em" }}
        />
        <Column
          className={"p-1"}
          header="Org"
          field="organization.abbreviation"
          headerStyle={{ minWidth: "8em" }}
          bodyStyle={{ minWidth: "8em" }}
        />
        <Column
          className={"p-1"}
          header={
            <div
              style={{ minWidth: "16em" }}
              className="flex justify-content-between p-0"
            >
              <div>Cycle</div>
              <div>Milestone</div>
              <div>Qualifying</div>
            </div>
          }
          field="services"
          body={servicesTemplate}
          headerStyle={{ minWidth: "19em" }}
          bodyStyle={{ minWidth: "19em" }}
        />
        <Column
          className={"p-1"}
          header="Ceremony"
          headerStyle={{ minWidth: "8em" }}
          bodyStyle={{ minWidth: "8em" }}
          body={ceremonyTemplate}
        />
        <Column
          className={"p-1"}
          field="updated_at"
          header="Updated"
          body={updatedDateTemplate}
          headerStyle={{ minWidth: "7em" }}
          bodyStyle={{ minWidth: "7em" }}
        />
      </DataTable>
    </>
  );
}
