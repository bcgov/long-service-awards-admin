/*!
 * Attendees Edit fieldset component
 * File: AwardEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useUser } from "@/providers/user.provider.jsx";
import { Panel } from "primereact/panel";
import classNames from "classnames";
import { Dropdown } from "primereact/dropdown";
import { useAPI } from "@/providers/api.provider.jsx";
import { format } from "date-fns";
import { MultiSelect } from "primereact/multiselect";
import { Chip } from "primereact/chip";
import { Tag } from "primereact/tag";
import { Checkbox } from "primereact/checkbox";

/**
 * Model data edit component
 * @returns {JSX.Element}
 */

export default function AttendeesEditInput({ isEditing, selectedRecipients }) {
  selectedRecipients
    ? selectedRecipients.map((r) =>
        Object.assign(r.contact, {
          full_name: `${r.contact.first_name} ${r.contact.last_name}`,
        })
      )
    : {};

  const { control } = useFormContext();
  const api = useAPI();
  const user = useUser();
  const { role } = user || {};
  // const isAdmin = ["super-administrator"].includes(role.name);
  const isAdmin = true;
  const [ceremonies, setCeremonies] = useState([]);

  const statuses = [
    {
      label: "Assigned",
      severity: "info",
      description: "Attendee was assigned to the ceremony.",
    },
    {
      label: "Expired",
      severity: "danger",
      description: "The invitation has expired",
    },
    {
      label: "Invited",
      severity: "primary",
      description: "Attendee was invited to the ceremony.",
    },
    {
      label: "Attending",
      severity: "success",
      description: "Attendee is attending the ceremony.",
    },
  ];

  const statusOptionTemplate = (option) => {
    return (
      <Tag
        tooltip={option.description}
        value={option.label}
        severity={option.severity}
      />
    );
  };

  const selectedStatusTemplate = (option) => {
    if (option) {
      return (
        <Tag
          tooltip={option.description}
          value={option.label}
          severity={option.severity}
        />
      );
    } else {
      return <span>Placeholder</span>;
    }
  };

  const statusCeremonyTemplate = (option) => {
    return format(new Date(option.datetime), `p 'on' EEEE, MMMM dd, yyyy`);
  };

  const selectedCeremonyTemplate = (option) => {
    if (option) {
      return format(new Date(option.datetime), `p 'on' EEEE, MMMM dd, yyyy`);
    } else {
      return <span>Select Ceremony</span>;
    }
  };

  useEffect(() => {
    api
      .getCeremonies()
      .then((results) => {
        const { ceremonies } = results || {};
        setCeremonies(ceremonies);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <Panel className={"mb-3"} header={<>Recipients</>}>
        <div className="container">
          <div className="grid">
            <div className={"col-12 form-field-container"}>
              <label htmlFor={"recipients"}>
                Selected Recipients Will be Assigned to Ceremony :
              </label>
              <Controller
                name={isEditing ? `recipient.contact.full_name` : `recipients`}
                control={control}
                rules={{
                  required: "Recipient is required.",
                }}
                defaultValue={
                  selectedRecipients ? selectedRecipients.map((r) => r.id) : []
                }
                render={({ field, fieldState: { invalid, error } }) => {
                  return !isEditing ? (
                    <>
                      <div className="flex">
                        {selectedRecipients.map((r) => (
                          <Chip
                            label={r.contact.full_name}
                            style={{ width: "max-content", margin: "2px" }}
                            key={r.contact.full_name}
                          />
                        ))}
                      </div>
                      {invalid && <p className="error">{error.message}</p>}
                    </>
                  ) : (
                    <Chip
                      label={field.value}
                      style={{ width: "max-content", margin: "2px" }}
                    />
                  );
                }}
              />
            </div>
          </div>
        </div>
      </Panel>
      <Panel className={"mb-3"} header={<>Ceremony</>}>
        <div className="container">
          <div className="grid">
            <div className={"col-12 form-field-container"}>
              <label htmlFor={"ceremony"}>Select Ceremony</label>
              <Controller
                name={`ceremony.id`}
                control={control}
                rules={{
                  required: "Ceremony is required.",
                }}
                render={({ field, fieldState: { invalid, error } }) => {
                  return (
                    <>
                      <Dropdown
                        className={classNames({ "p-invalid": error })}
                        id={field.id}
                        optionLabel="datetime"
                        value={field.value || ""}
                        options={ceremonies}
                        optionValue="id"
                        valueTemplate={selectedCeremonyTemplate}
                        itemTemplate={statusCeremonyTemplate}
                        onChange={(e) => {
                          field.onChange(e.value);
                        }}
                        aria-describedby={`ceremony-date-help`}
                        placeholder={"Select ceremony"}
                        dateFormat="dd/mm/yy"
                        mask="99/99/9999"
                        showTime
                        hourFormat="12"
                        showIcon
                      />
                      {invalid && <p className="error">{error.message}</p>}
                    </>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </Panel>
      {isEditing && isAdmin && (
        <>
          <Panel className={"mb-3"} header={<>Status</>}>
            <div className="container">
              <div className="grid">
                <div className={"col-12 form-field-container"}>
                  <label htmlFor={"status"} className={"font-bold"}>
                    Note: Changing the status may have unintended consequences.
                  </label>
                  <Controller
                    name={`status`}
                    control={control}
                    rules={{
                      required: "Status is required.",
                    }}
                    render={({ field, fieldState: { invalid, error } }) => {
                      return (
                        <>
                          <Dropdown
                            className={classNames({ "p-invalid": error })}
                            id={field.value}
                            optionLabel="label"
                            value={field.value || ""}
                            options={statuses}
                            optionValue="label"
                            onChange={(e) => {
                              field.onChange(e.value);
                            }}
                            itemTemplate={statusOptionTemplate}
                            valueTemplate={selectedStatusTemplate}
                            aria-describedby={`ceremony-date-help`}
                            placeholder={"Change Status"}
                          />
                          {invalid && <p className="error">{error.message}</p>}
                        </>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </Panel>
          <Panel className={"mb-3"} header={<>Guest</>}>
            <div className="container">
              <div className="grid">
                <div className={"col-12 form-field-container"}>
                  <label htmlFor={"guest"} className={"font-bold"}>
                    Note: Changing the guest value may have unintended
                    consequences.
                  </label>
                  <Controller
                    name="guest"
                    control={control}
                    render={({ field, fieldState: { invalid, error } }) => {
                      console.log(field.value);
                      return (
                        <div className="flex align-items-center">
                          <Checkbox
                            id={field.name}
                            inputId={field.name}
                            checked={!!field.value || false}
                            aria-describedby={`active-help`}
                            value={field.value || false}
                            onChange={(e) => {
                              field.onChange(e.checked);
                            }}
                          />
                          {invalid && <p className="error">{error.message}</p>}
                          <label className={"m-1"} htmlFor={`active`}>
                            I would like to bring a guest
                          </label>
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </Panel>
        </>
      )}
    </>
  );
}
