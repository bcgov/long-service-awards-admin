/*!
 * Attendees Edit fieldset component
 * File: AttendeesEditInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { ceremonyStatuses } from "@/constants/statuses.constants.js";
import { useAPI } from "@/providers/api.provider.jsx";
import classNames from "classnames";
import { format } from "date-fns";
import { Checkbox } from "primereact/checkbox";
import { Chip } from "primereact/chip";
import { Dropdown } from "primereact/dropdown";
import { Panel } from "primereact/panel";
import { Tag } from "primereact/tag";
import { SelectButton } from "primereact/selectbutton";
import { Fragment, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

export default function AttendeesEditInput({ isEditing, selectedRecipients }) {
  const { control, setValue } = useFormContext();
  const api = useAPI();
  // const user = useUser();
  // const { role } = user || {};
  // const isAdmin = ["super-administrator"].includes(role.name);
  const [ceremonies, setCeremonies] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const accessibilityRequirements = [
    { name: "Yes", value: true },
    { name: "No", value: false },
  ];

  //Cell Templates
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

  //Remove Default status from the list
  delete ceremonyStatuses.default;

  const statuses = Object.keys(ceremonyStatuses).map(
    (k) => ceremonyStatuses[k]
  );

  useEffect(() => {
    api
      .getCeremonies()
      .then((results) => {
        const ceremonies = results || {};
        setCeremonies(ceremonies);
        selectedRecipients
          ? selectedRecipients.map((r) =>
              Object.assign(r.contact, {
                full_name: `${r.contact.first_name} ${r.contact.last_name}`,
              })
            )
          : {};
      })
      .catch(console.error);
    api
      .getAccommodations()
      .then((results) => {
        const accommodations = results || {};
        //remove accesibility requirement from the list
        accommodations.splice(
          accommodations.findIndex(({ name }) => name == "accessibility"),
          1
        );
        //sort alphabetically
        accommodations.sort((a, b) => a.name.localeCompare(b.name));
        //move "Other" to the end
        accommodations.push(
          ...accommodations.splice(
            accommodations.findIndex((v) => v.name === "other"),
            1
          )
        );
        setAccommodations(accommodations);
      })
      .catch(console.error);
  }, []);

  return (
    <Fragment>
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
                    <Fragment>
                      <div className="flex">
                        {selectedRecipients.map((r) => (
                          <Chip
                            label={r.contact.full_name}
                            style={{ width: "max-content", margin: "2px" }}
                            key={r.contact.id}
                          />
                        ))}
                      </div>
                      {invalid && <p className="error">{error.message}</p>}
                    </Fragment>
                  ) : (
                    <Chip
                      label={field.value}
                      style={{ width: "max-content", margin: "2px" }}
                      key={field.value}
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
                    <Fragment>
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
                        mask="99/99/9999"
                      />
                      {invalid && <p className="error">{error.message}</p>}
                    </Fragment>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </Panel>
      {isEditing && (
        <Fragment>
          <Panel className={"mb-3"} header={<>Accessibility</>}>
            <div className="container">
              <div className="grid">
                <div className={"col-12 form-field-container"}>
                  {/* <label
                    htmlFor={"accommodations.accessibility"}
                    className={"font-bold"}
                  >
                    Accessibility requirements
                  </label> */}
                  <p>
                    Do you have any accessibility requirements to attend the
                    ceremony (e.g. accessible parking and/or seating, a sign
                    language interpreter (ASL), service dog access etc.)?
                  </p>
                  <Controller
                    name="accommodations.accessibility"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => {
                      return (
                        <>
                          <div className="flex align-items-center">
                            <SelectButton
                              className={"radio-toggle"}
                              value={field.value}
                              onChange={(e) => {
                                setValue(
                                  "accommodations.accessibility",
                                  e.value === true ? true : undefined
                                );
                              }}
                              options={accessibilityRequirements}
                              optionLabel="name"
                            />
                            <label
                              className={"ml-2"}
                              htmlFor={`accommodations.accessibility`}
                            >
                              (Selected:{" "}
                              {
                                accessibilityRequirements.find(
                                  (a) => a.value === field.value
                                ).name
                              }
                              )
                            </label>
                          </div>
                          <small>
                            If yes. someone from the Long Service Awards team
                            will contact you closer to the event for further
                            information
                          </small>
                        </>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </Panel>
          <Panel className={"mb-3"} header={<>Accommodations</>}>
            <div className="container">
              <div className="grid">
                <div className={"col-12 form-field-container"}>
                  <label
                    htmlFor={"recipient.accommodations"}
                    className={"font-bold"}
                  >
                    Dietary Requirements
                  </label>
                  {accommodations.map((o, i) => (
                    <Controller
                      name={`accommodations.` + `${o.name}`}
                      control={control}
                      key={i}
                      render={({ field }) => {
                        return (
                          <div className="field-checkbox">
                            <Checkbox
                              inputId={i}
                              name="option"
                              value={o.name || ""}
                              onChange={(e) => field.onChange(e.checked)}
                              checked={field.value}
                            />
                            <label
                              htmlFor={`accommodations.` + `${o.name}`}
                              style={{
                                color: o.name === "other" ? "red" : "inherited",
                              }}
                            >
                              {o.label}
                            </label>
                          </div>
                        );
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Panel>
          <Panel className={"mb-3"} header={<>Status</>}>
            <div className="container">
              <div className="grid">
                <div className={"col-12 form-field-container"}>
                  <label htmlFor={"status"} className={"font-bold"}>
                    Note: Changing the status may have unintended consequences.
                  </label>
                  <Controller
                    name={"status"}
                    control={control}
                    rules={{
                      required: "Status is required.",
                    }}
                    render={({ field, fieldState: { invalid, error } }) =>
                      field.value && (
                        <Fragment>
                          <Dropdown
                            className={classNames({ "p-invalid": error })}
                            id={field.value}
                            optionLabel="label"
                            value={
                              field.value.charAt(0).toUpperCase() +
                                field.value.slice(1) || ""
                            }
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
                        </Fragment>
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </Panel>
        </Fragment>
      )}
    </Fragment>
  );
}
