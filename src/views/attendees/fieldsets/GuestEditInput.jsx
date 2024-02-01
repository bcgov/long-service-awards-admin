/*!
 * Guest Edit fieldset component
 * File: GuestsEditInput.js
 * Copyright(c) 2024 BC Gov
 * MIT Licensed
 */

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

export default function GuestEditInput() {
  const { control, setValue } = useFormContext();
  const api = useAPI();
  const [attendees, setAttendees] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const accessibilityRequirements = [
    { name: "Yes", value: true },
    { name: "No", value: false },
  ];

  //Cell Templates
  const attendeeTemplate = (option) => {
    return option.first_name + " " + option.last_name;
  };

  useEffect(() => {
    api.getAttendees().then((results) => {
      const attendees = results || {};
      delete attendees.total_filtered_records;
      // check if the attendee is a guest (guest === 1) and if so remove both the guest (guest === 1) and the attendee that has the same recipient id
      const attendeesWithoutGuests = Object.values(attendees.attendees).filter(
        (attendee) => {
          return (
            attendee.guest === 0 &&
            !Object.values(attendees.attendees).some(
              (a) => a.recipient.id === attendee.recipient.id && a.guest === 1
            )
          );
        }
      );
      setAttendees(attendeesWithoutGuests);
    });

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
              <h4>
                NOTE : Only attendees that don't have guests assigned to them
                could be selected
              </h4>
              <label htmlFor={`attendee`}>
                Selected an Attendee this guest will be Assigned to:
              </label>
              <Controller
                name={`attendee`}
                control={control}
                rules={{ required: "Attendee is required" }}
                render={({ field, fieldState: { invalid, error } }) => (
                  <>
                    <Dropdown
                      id={field.name}
                      value={field.value || ""}
                      filter
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      aria-describedby={`attendee-help`}
                      options={attendees}
                      optionLabel={attendeeTemplate}
                      //   optionValue="id"
                      className={classNames("w-full", { "p-invalid": error })}
                      placeholder={`Select an Attendee`}
                    />
                    {invalid && <p className="error">{error.message}</p>}
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </Panel>
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
                  name="guest_accommodations.accessibility"
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
                                "guest_accommodations.accessibility",
                                e.value === true ? true : undefined
                              );
                            }}
                            options={accessibilityRequirements}
                            optionLabel="name"
                          />
                          <label
                            className={"ml-2"}
                            htmlFor={`guest_accommodations.accessibility`}
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
                          If yes. someone from the Long Service Awards team will
                          contact you closer to the event for further
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
                <label htmlFor={"guest_accommodations"} className={"font-bold"}>
                  Dietary Requirements
                </label>
                {accommodations.map((o, i) => (
                  <Controller
                    name={`guest_accommodations.` + `${o.name}`}
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
                            htmlFor={`guest_accommodations.` + `${o.name}`}
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
      </Fragment>
    </Fragment>
  );
}
