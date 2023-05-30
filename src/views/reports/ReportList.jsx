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
import { useAPI } from "@/providers/api.provider.jsx";
import React, { useState } from "react";
import { useStatus } from "@/providers/status.provider.jsx";
import { useUser } from "@/providers/user.provider.jsx";

export default function ReportList() {
  const { authenticated, role } = useUser() || {};

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
      description: "Ceremonies.",
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
      .getReport(id, `${filename}-${ts}.${format}`)
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
        header={<Card className={"m-0 p-0"} title={"Reports"}></Card>}
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
