/*!
 * LSA.Admin.Components.Attendees.Filter
 * File: AttendeesFilter.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { useAPI } from "@/providers/api.provider.jsx";
import { InputSwitch } from "primereact/inputswitch";
import { format } from "date-fns";
import { ceremonyStatuses as statuses } from "@/constants/statuses.constants.js";

function AttendeesFilter({ data, confirm, cancel }) {
  const api = useAPI();
  const [loading, setLoading] = useState(false);

  // init filter settings

  const [organizations, setOrganizations] = useState([]);
  const [ceremonies, setCeremonies] = useState([]);
  const [status, setStatus] = useState([]);
  const [filters, setFilters] = useState(data || {});
  const schema = {
    global: {
      label: "Global",
    },
    first_name: {
      label: "First Name",
      input: "text",
    },
    last_name: {
      label: "Last Name",
      input: "text",
    },
    organization: {
      label: "Organizations",
      input: "multiselect",
      valueKey: "id",
      labelKey: "name",
      options: organizations,
    },
    ceremony: {
      label: "Ceremony",
      input: "multiselect",
      valueKey: "id",
      labelKey: "datetime",
      options: ceremonies,
    },
    status: {
      label: "Registration Status",
      input: "multiselect",
      // valueKey: "value",
      // labelKey: "name",
      options: Object.keys(statuses).map((k) => statuses[k]),
    },
  };

  // init filter options states
  useEffect(() => {
    setFilters(data);
    setLoading(true);
    api
      .getCeremonies()
      .then((data) => {
        data.forEach(
          (d) =>
            (d.datetime_formatted = format(
              new Date(d.datetime),
              `p 'on' EEEE, MMMM dd, yyyy`
            ))
        );
        console.log(data);
        setCeremonies(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    api
      .getOrganizations()
      .then(setOrganizations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {Object.entries(filters).map(([key, filterValue]) => {
        const {
          label = "",
          input = "",
          options = [],
          valueKey = "",
          labelKey = "",
        } = schema.hasOwnProperty(key) ? schema[key] : {};
        return (
          <div
            key={`attendee-filter-${key}`}
            className="w-85 flex justify-content-between px-3"
          >
            {input === "text" && (
              <>
                <label className={"m-3"} htmlFor={"sortBy"}>
                  Filter By {label}
                </label>
                <InputText
                  id={"sortBy"}
                  value={String(filterValue || "")}
                  onChange={(e) => {
                    setFilters({ ...filters, ...{ [key]: e.target.value } });
                  }}
                  className={"m-3"}
                  aria-describedby={`sortBy-help`}
                  placeholder={`Enter filter value`}
                />
              </>
            )}
            {input === "select" && (
              <>
                <label className={"w-full m-3"} htmlFor={"sortBy"}>
                  Filter By {label}
                </label>
                <Dropdown
                  disabled={options.length === 0 || loading}
                  value={filterValue}
                  className={"m-3 w-full"}
                  filter
                  onChange={(e) => {
                    setFilters({ ...filters, ...{ [key]: e.target.value } });
                  }}
                  aria-describedby={`organization-help`}
                  options={options || []}
                  optionLabel={labelKey}
                  optionValue={valueKey}
                  placeholder={loading ? "Loading..." : "Select filter value"}
                />
              </>
            )}
            {input === "multiselect" && (
              <>
                <label className={"w-full m-3"} htmlFor={"sortBy"}>
                  Filter By {label}
                </label>
                <MultiSelect
                  display={"chip"}
                  disabled={options.length === 0 || loading}
                  value={options.length === 0 ? [] : filterValue || []}
                  onChange={(e) => {
                    setFilters({ ...filters, ...{ [key]: e.value } });
                  }}
                  options={options}
                  optionLabel={labelKey}
                  optionValue={valueKey}
                  filter
                  showClear
                  showSelectAll
                  placeholder={
                    options.length === 0
                      ? "Loading..."
                      : "Select filter value(s)"
                  }
                  className="m-3 w-full"
                />
              </>
            )}
            {input === "switch" && (
              <>
                <label className={"m-3"} htmlFor={"sortBy"}>
                  Filter By {label}
                </label>
                <InputSwitch
                  checked={!!filterValue}
                  onChange={(e) => {
                    setFilters({ ...filters, ...{ [key]: e.value } });
                  }}
                />
              </>
            )}
          </div>
        );
      })}
      <div className="text-center">
        <Button
          icon="pi pi-filter"
          label="Apply Filter"
          className="p-button-success m-2"
          autoFocus
          onClick={() => {
            confirm(filters);
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

export default AttendeesFilter;
