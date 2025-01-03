/*!
 * Reports list
 * File: ReportList.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { useAPI } from "@/providers/api.provider.jsx";
import React, { Fragment, useState } from "react";
import { useStatus } from "@/providers/status.provider.jsx";
import { useUser } from "@/providers/user.provider.jsx";

export default function ReportList() {
  const { authenticated, role } = useUser() || {};
  const currentYear = new Date().getFullYear();
  const [yearSelected, setYearSelected] = useState(currentYear);

  // check if user is authorized to access menu items
  const isAdmin =
    authenticated &&
    ["administrator", "super-administrator"].includes(role.name);

  // check if user is authorized to access menu items
  const isAuthorized =
    authenticated &&
    ["administrator", "super-administrator", "org-contact"].includes(role.name);

  const api = useAPI();
  const status = useStatus();
  const [downloading, setDownloading] = useState({
    recipients: false,
    pins: false,
  });

  const yearSelector = () => {
    // init year setting
    function generateCycleYears() {
      let currentYear = new Date().getFullYear(),
        years = [];
      const startYear = currentYear - 60;
      //Start of program data saved in this database
      const programStartYear = 2023;
      while (startYear <= currentYear) {
        if (currentYear >= programStartYear) years.push(currentYear);
        currentYear--;
      }
      return years;
    }
    const cycles = generateCycleYears();

    return (
      <Fragment>
        <label>Select Report Year</label>
        <Dropdown
          value={yearSelected}
          defaultValue={currentYear}
          className={"m-3"}
          onChange={(e) => {
            setYearSelected(e.value);
          }}
          aria-describedby={`selectYear-help`}
          options={cycles || []}
        />
      </Fragment>
    );
  };

  /**
   * Define available reports
   * */

  const reports = [
    {
      id: "lsa",
      filename: "long-service-awards-report",
      format: "csv",
      label: "Long Service Awards Report",
      description:
        "All recipients registered for milestones at 25 years and up in current year.",
      authorized: isAuthorized,
    },
    {
      id: "lsa-count",
      filename: "awards-count-by-night",
      format: "csv",
      label: "Awards Count by Night",
      description: "Awards Count per night",
      authorized: isAuthorized,
    },
    {
      id: "pecsf-certificates",
      filename: "pecsf-certificates",
      format: "csv",
      label: "PECSF Certificates",
      description: "PECSF Certificates",
      authorized: isAdmin,
    },
    {
      id: "service-pins",
      filename: "service-pins-report",
      format: "csv",
      label: "Service Pins Report",
      description:
        "All recipients registered for service pins (including retroactive pins).",
      authorized: isAdmin,
    },
    {
      id: "attendees",
      filename: "attendees-report",
      format: "csv",
      label: "Attendees Report",
      description: "All attendees registered for ceremonies.",
      authorized: isAdmin,
    },
    {
      id: "transactions",
      filename: "transactions-report",
      format: "csv",
      label: "Transactions Error Report",
      description: "All errors that have occurred for email transactions.",
      authorized: isAdmin,
    },
    {
      id: "duplicates",
      filename: "duplicates-report",
      format: "csv",
      label: "Duplicate Recipient Report",
      description: "List of duplicate recipients for selected cycle.",
      authorized: isAdmin,
    },
  ];

  /**
   * Download report data as CSV
   * */

  const onDownload = (data) => {
    const { id, filename, format } = data || {};
    setDownloading({ ...downloading, [id]: true });
    const ts = Date.now();
    api
      .getReport(
        id,
        `${filename}-${yearSelected}-${ts}.${format}`,
        yearSelected
      )
      .catch(() => {
        status.setMessage("downloadError");
      })
      .finally(() => {
        setDownloading({ ...downloading, [id]: false });
      });
  };

  /**
   * Render data table
   * */

  return (
    <>
      <DataTable
        value={reports}
        header={
          <Card className={"m-0 p-0"} title={"Reports"}>
            {yearSelector()}
          </Card>
        }
        dataKey={"id"}
        stripedRows
        tableStyle={{ minHeight: "70vh" }}
        scrollable
        scrollHeight="70vh"
      >
        <Column
          className={"p-2"}
          sortField={"label"}
          sortable={true}
          field={"label"}
          header={"Report"}
        />
        <Column
          className={"p-2"}
          sortable={false}
          field={"description"}
          header={"Description"}
        />
        <Column
          bodyStyle={{ maxWidth: "12em" }}
          headerStyle={{ maxWidth: "12em" }}
          body={(rowData) => {
            return (
              <Button
                disabled={!rowData.authorized || downloading[rowData.id]}
                icon={
                  downloading[rowData.id]
                    ? "pi pi-spin pi-spinner"
                    : "pi pi-download"
                }
                label={
                  downloading[rowData.id] ? "Downloading..." : "Download CSV"
                }
                onClick={() => onDownload(rowData)}
              />
            );
          }}
        />
      </DataTable>
    </>
  );
}
