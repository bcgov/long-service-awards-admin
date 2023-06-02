/*!
 * LSA.Admin.Components.RecipientsSort
 * File: RecipientsSort.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

function AttendeesSort({ data, confirm, cancel }) {
  const { orderBy, order } = data || {};
  const [selectedSortField, setSelectedSortField] = useState(orderBy);
  const [selectedSortOrder, setSelectedSortOrder] = useState(order);

  console.log(data);

  // init sort options states
  useEffect(() => {
    const { orderBy, order } = data || {};
    setSelectedSortField(orderBy);
    setSelectedSortOrder(order);
  }, [data]);

  // define sortable columns
  const cols = [
    {
      value: "recipient.contact.first_name",
      label: "First Name",
    },
    {
      value: "recipient.contact.last_name",
      label: "Last Name",
    },
    {
      value: "ceremony.datetime",
      label: "Ceremony",
    },
    {
      value: "updated_at",
      label: "Updated Date",
    },
  ];
  const orders = [
    {
      value: 1,
      label: "Ascending (A-Z)",
    },
    {
      value: -1,
      label: "Descending (Z-A)",
    },
  ];

  return (
    <>
      <div className="flex align-items-center flex-column pt-6 px-3">
        <div className={"m-2"}>
          <label className={"mr-2"} htmlFor={""}>
            Sort By
          </label>
          <Dropdown
            id={"orderBy"}
            value={selectedSortField || ""}
            onChange={(e) => {
              setSelectedSortField(e.target.value);
            }}
            aria-describedby={`sortBy-help`}
            options={cols}
            placeholder={`Select a field to sort by`}
          />
        </div>
        <div className={"m-2"}>
          <label className={"mr-2"} htmlFor={"sortOrder"}>
            Sort Order
          </label>
          <Dropdown
            id={"order"}
            value={selectedSortOrder || ""}
            onChange={(e) => {
              setSelectedSortOrder(e.target.value);
            }}
            aria-describedby={`sortBy-help`}
            options={orders}
            placeholder={`Select the sort order`}
          />
        </div>
      </div>
      <div className="text-center">
        <Button
          icon="pi pi-sort"
          label="Apply Sort"
          className="p-button-success m-2"
          autoFocus
          onClick={() => {
            confirm({ orderBy: selectedSortField, order: selectedSortOrder });
          }}
        />
        <Button
          icon="pi pi-times"
          label="Cancel"
          className="p-button-text m-2"
          onClick={cancel}
        />
      </div>
    </>
  );
}

export default AttendeesSort;
